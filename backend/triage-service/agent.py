"""
Triage Agent Implementation
Routes student queries to appropriate specialist agents.
"""
from openai import AsyncOpenAI
from typing import Optional
import json
import os
import sys

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from common.agent_base import TriageAgent as BaseTriageAgent
import logging

logger = logging.getLogger(__name__)


class TriageAgent(BaseTriageAgent):
    """
    Routes student queries to the appropriate specialist service.

    Uses OpenAI function calling to classify queries into:
    - concepts: Explaining Python concepts
    - debug: Debugging errors
    - exercise: Generating exercises
    - progress: Checking progress
    - code-review: Reviewing code
    """

    def __init__(self):
        super().__init__()
        self.service_descriptions = {
            "concepts": "Explaining Python concepts, syntax, or theory (e.g., 'what is a loop', 'explain functions')",
            "debug": "Debugging errors, fixing bugs, or understanding why code doesn't work (e.g., 'why is this not working', 'help with error')",
            "exercise": "Generating coding exercises, practice challenges, or quizzes (e.g., 'give me an exercise', 'I want to practice')",
            "progress": "Checking student progress, mastery levels, or learning statistics (e.g., 'how am I doing', 'show my progress')",
            "code-review": "Reviewing code quality, improving code style, or optimization suggestions (e.g., 'review my code', 'how can I improve this')"
        }

    async def process(self, query: str, context: dict) -> str:
        """
        Process user query and determine routing.

        Returns JSON with routing decision.
        """
        try:
            system_prompt = """You are a triage agent for a Python learning platform called LearnFlow.
Your job is to analyze student queries and route them to the appropriate specialist service.

Available services:
1. concepts: Explaining Python concepts, syntax, or theory
   Keywords: what is, explain, how does, tell me about, define, meaning
2. debug: Debugging errors, fixing bugs, understanding why code doesn't work
   Keywords: error, bug, not working, wrong output, fix, help debug
3. exercise: Generating coding exercises, practice challenges, or quizzes
   Keywords: exercise, practice, challenge, quiz, test me, give me a problem
4. progress: Checking student progress, mastery levels, or learning statistics
   Keywords: progress, how am I doing, my score, mastery, level, statistics
5. code-review: Reviewing code quality, improving code style, or optimization
   Keywords: review my code, improve, better way, refactor, optimize, is this good

Analyze the query and respond with a JSON object:
{
  "target_service": "service_name",
  "confidence": 0.0-1.0,
  "reasoning": "brief explanation of why this service was chosen"
}

Be decisive. Choose exactly one service. Provide clear reasoning."""

            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Query: {query}"}
            ]

            response = await self.call_openai(messages, temperature=0.3, max_tokens=200)

            # Try to parse as JSON
            try:
                # Extract JSON from response if it contains extra text
                if "```json" in response:
                    response = response.split("```json")[1].split("```")[0].strip()
                elif "```" in response:
                    response = response.split("```")[1].split("```")[0].strip()

                routing = json.loads(response)

                # Validate routing
                if routing.get("target_service") not in self.service_descriptions:
                    logger.warning(f"Unknown service: {routing.get('target_service')}")
                    routing["target_service"] = "concepts"  # Default fallback

                return json.dumps(routing)

            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse routing JSON: {e}")
                # Fallback to keyword matching
                service = self._keyword_based_routing(query)
                return json.dumps({
                    "target_service": service,
                    "confidence": 0.6,
                    "reasoning": "Fallback to keyword-based routing"
                })

        except Exception as e:
            logger.error(f"Error in triage process: {e}")
            return json.dumps({
                "target_service": "concepts",
                "confidence": 0.5,
                "reasoning": f"Error during routing: {str(e)}"
            })

    def _keyword_based_routing(self, query: str) -> str:
        """
        Fallback keyword-based routing.
        """
        query_lower = query.lower()

        # Define keyword patterns for each service
        patterns = {
            "concepts": ["what is", "explain", "how does", "tell me about", "define", "meaning of"],
            "debug": ["error", "bug", "not working", "wrong output", "fix", "help debug", "why is"],
            "exercise": ["exercise", "practice", "challenge", "quiz", "test me", "give me a problem"],
            "progress": ["progress", "how am i doing", "my score", "mastery", "level", "statistics"],
            "code-review": ["review my code", "improve", "better way", "refactor", "optimize", "is this good"]
        }

        # Count matches
        scores = {}
        for service, keywords in patterns.items():
            score = sum(1 for keyword in keywords if keyword in query_lower)
            if score > 0:
                scores[service] = score

        if scores:
            return max(scores, key=scores.get)

        return "concepts"  # Default fallback

    async def process_event(self, event_data: dict):
        """
        Process Kafka events.
        Triage agent mainly responds to direct queries.
        """
        logger.info(f"Triage agent received event: {event_data}")
        # Events are mainly handled by the main.py subscriber
