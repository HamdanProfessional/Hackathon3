"""Base agent class for LearnFlow AI agents.

Supports both OpenAI and GLM 4.7 (Z.ai) LLM providers.
Configure via environment variables:
    LLM_PROVIDER: "openai" or "glm" (default: openai)
    OPENAI_API_KEY: Your OpenAI API key (if using openai)
    GLM_API_KEY or ZAI_API_KEY: Your Z.ai API key (if using glm)
    LLM_MODEL: Model name (default: gpt-4o-mini for openai, glm-4.7 for glm)
"""
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from openai import AsyncOpenAI
import os
import logging

from common.llm_client import get_llm_client, LLMProvider, get_default_model

logger = logging.getLogger(__name__)


class BaseAgent(ABC):
    """Base class for all LearnFlow agents."""

    def __init__(self, provider: Optional[LLMProvider] = None):
        """
        Initialize agent with configurable LLM provider.

        Args:
            provider: LLM provider (defaults to LLM_PROVIDER env var or openai)
        """
        # Determine provider from env if not specified
        if provider is None:
            provider_str = os.getenv("LLM_PROVIDER", "openai").lower()
            provider = LLMProvider(provider_str)

        self.provider = provider
        self.client = get_llm_client(provider, async_client=True)
        self.model = os.getenv("LLM_MODEL") or get_default_model(provider)

        logger.info(f"Initialized {self.__class__.__name__} with {provider.value} and model {self.model}")

    @abstractmethod
    async def process(self, query: str, context: Dict[str, Any]) -> str:
        """Process user query and return response."""
        pass

    @abstractmethod
    async def process_event(self, event_data: Dict[str, Any]):
        """Process Kafka event."""
        pass

    async def call_llm(
        self,
        messages: list[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: int = 1000,
        tools: Optional[list] = None,
        tool_choice: Optional[str] = None,
    ) -> str:
        """
        Call LLM API (works with both OpenAI and GLM).

        Args:
            messages: Chat messages for the LLM
            temperature: Sampling temperature (0-1)
            max_tokens: Maximum tokens to generate
            tools: Optional function calling tools
            tool_choice: Tool choice strategy

        Returns:
            LLM response content
        """
        try:
            kwargs = {
                "model": self.model,
                "messages": messages,
                "temperature": temperature,
                "max_tokens": max_tokens,
            }
            if tools:
                kwargs["tools"] = tools
            if tool_choice:
                kwargs["tool_choice"] = tool_choice

            response = await self.client.chat.completions.create(**kwargs)
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"LLM API call failed ({self.provider.value}): {e}")
            raise

    def build_system_prompt(self, base_prompt: str, context: Optional[Dict] = None) -> str:
        """Build system prompt with context."""
        if context:
            context_str = "\n".join([f"{k}: {v}" for k, v in context.items()])
            return f"{base_prompt}\n\nContext:\n{context_str}"
        return base_prompt

    async def get_conversation_history(
        self, student_id: str, db, limit: int = 10
    ) -> list[Dict[str, str]]:
        """Get conversation history for a student."""
        try:
            query = """
                SELECT role, content
                FROM conversation_history
                WHERE student_id = $1
                ORDER BY timestamp DESC
                LIMIT $2
            """
            rows = await db.fetch(query, student_id, limit)
            return [
                {"role": row["role"], "content": row["content"]}
                for row in reversed(rows)
            ]
        except Exception as e:
            logger.error(f"Failed to get conversation history: {e}")
            return []

    async def save_conversation_message(
        self, student_id: str, role: str, content: str, db
    ):
        """Save a conversation message."""
        try:
            query = """
                INSERT INTO conversation_history (student_id, role, content, timestamp)
                VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
            """
            await db.execute(query, student_id, role, content)
        except Exception as e:
            logger.error(f"Failed to save conversation message: {e}")


class TriageAgent(BaseAgent):
    """Routes queries to appropriate specialist agents."""

    async def process(self, query: str, context: Dict[str, Any]) -> str:
        """Route query to appropriate service."""
        system_prompt = """You are a triage agent for a Python learning platform.
Your job is to route student queries to the appropriate specialist service.

Available services:
- concepts: For explaining Python concepts, syntax, or theory
- debug: For debugging errors, fixing bugs, or understanding why code doesn't work
- exercise: For generating coding exercises or challenges
- progress: For checking student progress or mastery levels
- code-review: For reviewing code quality and providing improvement suggestions

Respond with a JSON object containing:
{
  "target_service": "service_name",
  "confidence": 0.0-1.0,
  "reasoning": "brief explanation"
}
"""

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": query},
        ]

        response = await self.call_llm(messages, temperature=0.3)
        return response

    async def process_event(self, event_data: Dict[str, Any]):
        """Process learning events."""
        # Triage agent mainly responds to direct queries
        pass


class ConceptsAgent(BaseAgent):
    """Explains Python concepts adapted to student mastery level."""

    async def process(self, query: str, context: Dict[str, Any]) -> str:
        """Explain a concept with adaptation to mastery level."""
        mastery = context.get("mastery_level", "Beginner")
        system_prompt = f"""You are a Python tutor explaining concepts to a student with {mastery} mastery level.

Mastery level guidelines:
- Beginner (0-40%): Use simple language, avoid jargon, provide basic examples
- Learning (41-70%): Use standard explanations, introduce terminology gradually
- Proficient (71-90%): Be concise, use technical terms appropriately
- Mastered (91-100%): Cover edge cases, best practices, advanced techniques

Provide clear explanations with relevant code examples."""

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": query},
        ]

        return await self.call_llm(messages, temperature=0.7)

    async def process_event(self, event_data: Dict[str, Any]):
        """Process concept request events."""
        pass


class DebugAgent(BaseAgent):
    """Analyzes code errors and provides progressive hints."""

    async def process(self, query: str, context: Dict[str, Any]) -> str:
        """Analyze error and provide hint."""
        hint_level = context.get("hint_level", 1)
        error_message = context.get("error_message", "")

        system_prompt = f"""You are a Python debugging assistant helping students learn to fix their own code.

You are providing hint level {hint_level}/3:
- Level 1: Identify error type and general area
- Level 2: Point to specific line or concept issue
- Level 3: Provide concrete suggestion (but not full solution)

Be helpful but don't give the answer directly. Guide the student to discover the solution."""

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Error: {error_message}\n\nQuery: {query}"},
        ]

        return await self.call_llm(messages, temperature=0.5)

    async def process_event(self, event_data: Dict[str, Any]):
        """Process error events."""
        pass


class ExerciseAgent(BaseAgent):
    """Generates and grades coding exercises."""

    async def process(self, query: str, context: Dict[str, Any]) -> str:
        """Generate exercise or grade submission."""
        action = context.get("action", "generate")

        if action == "generate":
            return await self._generate_exercise(query, context)
        elif action == "grade":
            return await self._grade_submission(query, context)
        else:
            return "Invalid action. Use 'generate' or 'grade'."

    async def _generate_exercise(self, query: str, context: Dict[str, Any]) -> str:
        """Generate a coding exercise."""
        module = context.get("module", 1)
        difficulty = context.get("difficulty", "beginner")

        system_prompt = f"""You are generating a Python coding exercise.

Module: {module}
Difficulty: {difficulty}

Provide:
1. Exercise description
2. Starter code template
3. Test cases for validation
4. 3 progressive hints

Respond in JSON format."""

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": query},
        ]

        return await self.call_llm(messages, temperature=0.8)

    async def _grade_submission(self, query: str, context: Dict[str, Any]) -> str:
        """Grade a code submission."""
        system_prompt = """You are grading a Python exercise submission.

Analyze the code for correctness and provide:
1. Pass/fail status
2. Brief feedback
3. Specific issues (if any)

Be encouraging and constructive."""

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": query},
        ]

        return await self.call_llm(messages, temperature=0.3)

    async def process_event(self, event_data: Dict[str, Any]):
        """Process exercise events."""
        pass


class ProgressAgent(BaseAgent):
    """Tracks student progress and mastery."""

    async def process(self, query: str, context: Dict[str, Any]) -> str:
        """Get or update progress."""
        student_id = context.get("student_id")

        if not student_id:
            return "Student ID required"

        # This would typically query the database
        # For now, return a template response
        return f"Progress for student {student_id}"

    async def process_event(self, event_data: Dict[str, Any]):
        """Process progress update events."""
        pass


class CodeReviewAgent(BaseAgent):
    """Analyzes code quality."""

    async def process(self, query: str, context: Dict[str, Any]) -> str:
        """Review code for quality."""
        system_prompt = """You are a code reviewer analyzing Python code quality.

Evaluate:
1. Correctness: Does it run without errors?
2. Style: Does it follow PEP 8?
3. Efficiency: Is it performant for the problem size?
4. Readability: Are names clear and structure logical?

Provide scores (0-100) for each category with overall score and suggestions."""

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": query},
        ]

        return await self.call_llm(messages, temperature=0.5)

    async def process_event(self, event_data: Dict[str, Any]):
        """Process code review events."""
        pass
