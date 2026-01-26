"""Debug Service - Analyzes errors and provides progressive hints.

Helps students debug code by identifying error types and providing guided hints.
"""

import os
import re
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from shared.models import HealthResponse, ChatRequest, ChatResponse, CodeSubmission, CodeReviewResult


SERVICE_NAME = "debug-service"
SERVICE_VERSION = "1.0.0"
PORT = int(os.getenv("PORT", "8003"))

app = FastAPI(title="LearnFlow Debug Service", version=SERVICE_VERSION)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])


ERROR_PATTERNS = {
    "SyntaxError": [
        (r"invalid syntax", "Check for missing colons, parentheses, or quotes"),
        (r"unexpected EOF", "You may have unclosed parentheses, brackets, or quotes"),
        (r"EOL while scanning string literal", "Check that all strings have closing quotes"),
    ],
    "NameError": [
        (r"is not defined", "The variable name might be misspelled or used before assignment"),
        (r"object has no attribute", "The object doesn't have this method or property"),
    ],
    "IndentationError": [
        (r"unexpected indent", "Python uses consistent indentation - check for extra spaces"),
        (r"unindent does not match", "Indentation levels must be consistent in blocks"),
    ],
    "TypeError": [
        (r"unsupported operand type", "Check that you're using the right data types for the operation"),
        (r"can only concatenate-str", "Use str() to convert numbers before adding to strings"),
    ],
    "ValueError": [
        (r"invalid literal for int", "The input can't be converted to the expected type"),
        (r"math domain error", "Check for negative numbers in sqrt() or log()"),
    ],
}


def analyze_error(code: str, error_msg: str = "") -> tuple[str, list[str]]:
    """Analyze code/error and return hints."""
    hints = []

    # Check for common issues
    if "print(" in code and ")" not in code.split("print(")[-1].split("\n")[0]:
        hints.append("Check your print statement - it might be missing a closing parenthesis")

    if "=" in code and "==" not in code and "if " in code:
        hints.append("Remember: use == for comparison, = for assignment")

    if "for " in code and ":" not in code:
        hints.append("For loops need a colon (:) at the end of the line")

    if code.count("(") != code.count(")"):
        hints.append(f"Mismatched parentheses: {code.count('(')} opening but {code.count(')')} closing")

    # Analyze error message if provided
    if error_msg:
        for error_type, patterns in ERROR_PATTERNS.items():
            if error_type in error_msg:
                for pattern, hint in patterns:
                    if re.search(pattern, error_msg):
                        hints.append(hint)
                        break

    # Categorize error
    if "SyntaxError" in error_msg or "IndentationError" in error_msg:
        category = "syntax"
    elif "NameError" in error_msg or "TypeError" in error_msg:
        category = "reference"
    elif "ValueError" in error_msg:
        category = "data"
    else:
        category = "general"

    return category, hints[:3]  # Return top 3 hints


@app.get("/", response_model=dict)
async def root():
    return {"service": SERVICE_NAME, "version": SERVICE_VERSION, "status": "running"}


@app.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse(status="healthy", service=SERVICE_NAME, version=SERVICE_VERSION)


@app.post("/chat", response_model=ChatResponse)
async def debug_chat(request: ChatRequest):
    """Analyze code from chat and provide hints."""
    category, hints = analyze_error(request.message)

    if hints:
        response = "I found some issues:\n\n" + "\n".join(f"• {h}" for h in hints)
    else:
        response = "I don't see an obvious error in your description. Can you share the error message or code?"

    return ChatResponse(response=response, agent_type="debug", confidence=0.8, hints=hints)


@app.post("/analyze", response_model=CodeReviewResult)
async def analyze_code(submission: CodeSubmission):
    """Analyze code for errors."""
    category, hints = analyze_error(submission.code)

    return CodeReviewResult(
        correct=len(hints) == 0,
        feedback=f"Code analysis complete. Found {len(hints)} potential issues." if hints else "Code looks good!",
        hints=hints,
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)
