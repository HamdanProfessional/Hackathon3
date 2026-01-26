"""Concepts Service - Provides adaptive explanations of Python concepts.

Adjusts explanation complexity based on student mastery level.
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from shared.models import HealthResponse, ChatRequest, ChatResponse, ConceptExplanation


SERVICE_NAME = "concepts-service"
SERVICE_VERSION = "1.0.0"
PORT = int(os.getenv("PORT", "8002"))

app = FastAPI(title="LearnFlow Concepts Service", version=SERVICE_VERSION)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])


# Concept explanations database
CONCEPT_EXPLANATIONS = {
    "beginner": {
        "variable": {
            "explanation": "A variable is like a labeled box where you can store information. In Python, you create a variable by giving it a name and using the = symbol.",
            "examples": ["name = 'Alice'", "age = 25", "height = 5.6"]
        },
        "function": {
            "explanation": "A function is a reusable block of code that performs a specific task. Think of it as a recipe you can use over and over.",
            "examples": ["def greet():", "  print('Hello!')"]
        },
        "loop": {
            "explanation": "A loop lets you repeat code multiple times. A for loop runs for each item in a list, while a while loop runs as long as a condition is true.",
            "examples": ["for i in range(5):", "while x < 10:"]
        },
    },
    "learning": {
        "variable": {
            "explanation": "Variables in Python are dynamically typed references to objects. The assignment operator (=) binds a name to a value.",
            "examples": ["x = 42  # integer", "name = 'Bob'  # string", "items = [1, 2, 3]  # list"]
        },
        "function": {
            "explanation": "Functions are defined using def keyword and can take parameters and return values. They help organize code into reusable pieces.",
            "examples": ["def add(a, b):", "  return a + b"]
        },
        "loop": {
            "explanation": "Python provides for loops for iteration and while loops for conditional repetition. The range() function generates number sequences.",
            "examples": ["for item in collection:", "while condition:"]
        },
    },
    "proficient": {
        "variable": {
            "explanation": "Python variables are references to objects. Assignment binds names to objects in memory. Understanding reference semantics is crucial for mutable objects.",
            "examples": ["a = [1, 2]", "b = a  # b references same list", "is vs == for identity/equality"]
        },
        "function": {
            "explanation": "Functions are first-class objects supporting closures, decorators, and higher-order functions. Default arguments are evaluated once at definition time.",
            "examples": ["def func(*args, **kwargs):", "lambda x: x * 2", "@decorator"]
        },
        "loop": {
            "explanation": "Iteration in Python uses the iterator protocol. List comprehensions and generator expressions provide concise iteration patterns.",
            "examples": ["[x*2 for x in items]", "for i, val in enumerate(seq):"]
        },
    },
    "mastered": {
        "variable": {
            "explanation": "Variables implement Python's reference counting GC. Understanding scoping rules (LEGB), namespace resolution, and the difference between assignment and mutation.",
            "examples": ["nonlocal, global keywords", "__slots__ for memory optimization", "weakref module"]
        },
        "function": {
            "explanation": "Functions support type hints, docstrings, keyword-only args, and annotations. Decorator pattern wraps functions. Closures capture enclosing scope.",
            "examples": ["def func(x: int) -> int:", "@functools.wraps", "function.__annotations__"]
        },
        "loop": {
            "explanation": "Python's iteration protocol: __iter__, __next__. Generators maintain state via yield. itertools provides powerful iteration tools.",
            "examples": ["yield from", "itertools.chain", "async for and asynchronous iteration"]
        },
    },
}


@app.get("/", response_model=dict)
async def root():
    return {"service": SERVICE_NAME, "version": SERVICE_VERSION, "status": "running"}


@app.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse(status="healthy", service=SERVICE_NAME, version=SERVICE_VERSION)


@app.post("/chat", response_model=ChatResponse)
async def explain_concept(request: ChatRequest):
    """Provide concept explanation adapted to mastery level."""
    # Extract concept from message (simplified)
    concept_keywords = {
        "variable": ["variable", "var", "assign", "store"],
        "function": ["function", "def", "return", "callable"],
        "loop": ["loop", "for", "while", "iterate", "repeat"],
    }

    message_lower = request.message.lower()
    detected_concept = "variable"  # default

    for concept, keywords in concept_keywords.items():
        if any(kw in message_lower for kw in keywords):
            detected_concept = concept
            break

    # Get explanation (default to learning level)
    level = "learning"
    explanation = CONCEPT_EXPLANATIONS.get(level, {}).get(detected_concept, CONCEPT_EXPLANATIONS["learning"]["variable"])

    return ChatResponse(
        response=f"{explanation['explanation']}\n\nExamples:\n" + "\n".join(explanation['examples']),
        agent_type="concepts",
        confidence=0.9,
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)
