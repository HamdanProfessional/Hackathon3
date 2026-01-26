"""Exercise Service - Generates and grades coding exercises.

Provides auto-graded Python exercises with hints and progressive difficulty.
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from shared.models import (
    HealthResponse, ChatRequest, ChatResponse,
    ExerciseRequest, Exercise, ExerciseSubmission, ExerciseResult
)


SERVICE_NAME = "exercise-service"
SERVICE_VERSION = "1.0.0"
PORT = int(os.getenv("PORT", "8004"))

app = FastAPI(title="LearnFlow Exercise Service", version=SERVICE_VERSION)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])


# Exercise database
EXERCISES = {
    1: {
        1: Exercise(
            id=1, title="Hello World", description="Your first Python program",
            instructions="Write a program that prints 'Hello, World!'",
            starter_code='# Write your code here\n',
            test_cases=[{"expected": "Hello, World!", "type": "output"}],
            hints=["Use the print() function", "Don't forget the quotes!"],
            difficulty="beginner", module_id=1, topic="basics"
        ),
        2: Exercise(
            id=2, title="Variables", description="Store and print a name",
            instructions="Create a variable called 'name' with your name and print it",
            starter_code='name = \nprint(name)',
            test_cases=[{"check": "name in code", "type": "code_check"}],
            hints=["Use = to assign a value", "Strings need quotes"],
            difficulty="beginner", module_id=1, topic="variables"
        ),
    },
    2: {
        1: Exercise(
            id=3, title="For Loop", description="Print numbers 1-5",
            instructions="Use a for loop to print numbers from 1 to 5",
            starter_code='for i in range(___):\n    print(i)',
            test_cases=[{"check": "for i in range", "type": "code_check"}],
            hints=["Use range(1, 6) for 1-5", "Don't forget the colon!"],
            difficulty="beginner", module_id=2, topic="loops"
        ),
    },
}


@app.get("/", response_model=dict)
async def root():
    return {"service": SERVICE_NAME, "version": SERVICE_VERSION, "status": "running"}


@app.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse(status="healthy", service=SERVICE_NAME, version=SERVICE_VERSION)


@app.post("/generate", response_model=Exercise)
async def generate_exercise(request: ExerciseRequest):
    """Generate an exercise for the student."""
    exercises = EXERCISES.get(request.module_id, {})
    if not exercises:
        # Return default exercise
        return EXERCISES[1][1]

    # Return first exercise from module
    return next(iter(exercises.values()))


@app.post("/submit", response_model=ExerciseResult)
async def submit_exercise(submission: ExerciseSubmission):
    """Grade exercise submission."""
    exercise = EXERCISES.get(submission.exercise_id // 10, {}).get(submission.exercise_id)

    if not exercise:
        return ExerciseResult(
            passed=False,
            feedback="Exercise not found",
            test_results=[],
        )

    # Simple validation (in real implementation, would execute code)
    code = submission.code.strip()
    passed = len(code) > 10 and "print" in code

    return ExerciseResult(
        passed=passed,
        feedback="Great job!" if passed else "Keep trying - check the instructions",
        test_results=[{"passed": passed}],
        hints=exercise.hints if not passed else [],
    )


@app.post("/chat")
async def exercise_chat(request: ChatRequest):
    """Handle exercise-related chat."""
    return ChatResponse(
        response="I can help you with exercises! Ask me to generate a new exercise or get hints on your current one.",
        agent_type="exercise",
        confidence=0.9,
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)
