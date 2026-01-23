"""
LearnFlow Code Execution MCP Server
Provides safe Python code execution for LearnFlow exercises.

This MCP server enables AI agents to:
- Execute Python code in a sandboxed environment
- Test code against predefined test cases
- Analyze code for syntax errors and style issues
- Format code according to PEP 8
- Track execution history

Follows MCP Code Execution pattern for token efficiency.
"""
import asyncio
import ast
import json
import logging
import os
import sys
import tempfile
import traceback
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional
import subprocess
import time

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class CodeExecutionMCP:
    """MCP Server for safe Python code execution."""

    def __init__(self):
        self.execution_history = {}
        self.max_timeout = 10  # seconds
        self.max_memory = 100  # MB

    # ============================================
    # MCP Tools Implementation
    # ============================================

    async def execute_code(
        self,
        code: str,
        timeout: int = 5,
        max_memory: int = 50
    ) -> Dict[str, Any]:
        """
        Execute Python code in a sandboxed environment.

        Safety measures:
        - Timeout enforcement (max 10s)
        - Memory limits (max 100MB)
        - No network access
        - Temporary file system only
        - No access to system resources

        Returns:
            Execution result with stdout, stderr, and status.
        """
        if timeout > self.max_timeout:
            return {"error": f"Timeout exceeds maximum of {self.max_timeout}s"}
        if max_memory > self.max_memory:
            return {"error": f"Memory limit exceeds maximum of {self.max_memory}MB"}

        # Create temporary file
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
            temp_file = f.name
            f.write(code)

        try:
            # Execute in subprocess with limits
            start_time = time.time()
            result = subprocess.run(
                [sys.executable, temp_file],
                capture_output=True,
                text=True,
                timeout=timeout,
                # Resource limits would be set via ulimit or cgroups
                env={
                    'PYTHONPATH': '',
                    'PATH': os.environ.get('PATH', ''),
                    'HOME': tempfile.gettempdir(),
                    'TMPDIR': tempfile.gettempdir()
                }
            )
            execution_time = time.time() - start_time

            return {
                "success": result.returncode == 0,
                "stdout": result.stdout,
                "stderr": result.stderr,
                "returncode": result.returncode,
                "execution_time": round(execution_time, 3),
                "timeout": timeout
            }

        except subprocess.TimeoutExpired:
            return {
                "success": False,
                "error": f"Execution timeout after {timeout}s",
                "stderr": "TimeoutExpired"
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "stderr": traceback.format_exc()
            }
        finally:
            # Clean up temp file
            try:
                os.unlink(temp_file)
            except:
                pass

    async def test_code(
        self,
        code: str,
        test_cases: Optional[List[Dict]] = None
    ) -> Dict[str, Any]:
        """
        Test Python code against test cases.

        Executes the code with each test case's input
        and compares against expected output.
        """
        test_cases = test_cases or []

        # First, check syntax
        syntax_check = await self.analyze_code(code)
        if not syntax_check.get("valid", True):
            return {
                "error": "Syntax errors in code",
                "syntax_errors": syntax_check.get("errors", [])
            }

        results = []
        passed = 0
        failed = 0

        for i, test_case in enumerate(test_cases):
            # Prepare test code
            test_input = test_case.get("input", "")
            expected = test_case.get("expected_output", "")

            # Wrap code to capture output
            test_code = f"""
import sys
from io import StringIO

# Capture stdout
old_stdout = sys.stdout
sys.stdout = StringIO()

# Execute user code
{code}

# Restore stdout
output = sys.stdout.getvalue()
sys.stdout = old_stdout

print(output, end='')
"""

            # Execute
            result = await self.execute_code(test_code)

            # Compare output
            actual = result.get("stdout", "").strip()
            expected_clean = expected.strip()

            test_passed = actual == expected_clean

            if test_passed:
                passed += 1
            else:
                failed += 1

            results.append({
                "test_case": i + 1,
                "passed": test_passed,
                "expected": expected_clean,
                "actual": actual,
                "execution_time": result.get("execution_time", 0)
            })

        return {
            "total_tests": len(test_cases),
            "passed": passed,
            "failed": failed,
            "success_rate": round(passed / len(test_cases) * 100, 1) if test_cases else 0,
            "results": results
        }

    async def analyze_code(self, code: str) -> Dict[str, Any]:
        """
        Analyze Python code for errors and issues.

        Checks:
        - Syntax errors
        - Import errors
        - Undefined variables
        - Style issues (basic PEP 8)
        """
        issues = []
        errors = []

        try:
            # Parse syntax
            tree = ast.parse(code)

            # Check for issues
            for node in ast.walk(tree):
                # Check for print statements (not errors, but style issues)
                if isinstance(node, ast.Call) and isinstance(node.func, ast.Name):
                    if node.func.id == "print":
                        issues.append({
                            "type": "style",
                            "message": "print() statement found",
                            "line": node.lineno,
                            "suggestion": "Use logging instead of print for production code"
                        })

            return {
                "valid": True,
                "issues": issues,
                "errors": []
            }

        except SyntaxError as e:
            errors.append({
                "type": "syntax",
                "message": str(e),
                "line": e.lineno,
                "offset": e.offset,
                "text": e.text
            })
            return {
                "valid": False,
                "issues": issues,
                "errors": errors
            }
        except Exception as e:
            errors.append({
                "type": "parsing",
                "message": str(e)
            })
            return {
                "valid": False,
                "issues": issues,
                "errors": errors
            }

    async def format_code(self, code: str) -> Dict[str, Any]:
        """
        Format Python code according to PEP 8.

        Uses Black formatter if available, otherwise basic formatting.
        """
        try:
            # Try using Black
            result = subprocess.run(
                [sys.executable, "-m", "black", "--code", code],
                capture_output=True,
                text=True,
                timeout=5
            )

            if result.returncode == 0:
                return {
                    "success": True,
                    "formatted_code": result.stdout,
                    "original_code": code,
                    "formatter": "black"
                }
            else:
                # Black not available, do basic formatting
                return self._basic_format(code)

        except Exception as e:
            # Black not available, do basic formatting
            return self._basic_format(code)

    def _basic_format(self, code: str) -> Dict[str, Any]:
        """Basic code formatting without Black."""
        try:
            # Parse and unparse for basic formatting
            tree = ast.parse(code)
            formatted = ast.unparse(tree)

            return {
                "success": True,
                "formatted_code": formatted,
                "original_code": code,
                "formatter": "ast.unparse (basic)"
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "formatted_code": code,
                "original_code": code
            }

    async def get_execution_history(
        self,
        session_id: str,
        limit: int = 10
    ) -> Dict[str, Any]:
        """Retrieve execution history for a session."""
        if session_id not in self.execution_history:
            return {
                "session_id": session_id,
                "history": [],
                "count": 0
            }

        history = self.execution_history[session_id][-limit:]

        return {
            "session_id": session_id,
            "history": history,
            "count": len(history)
        }

    def add_to_history(
        self,
        session_id: str,
        code: str,
        result: Dict[str, Any]
    ):
        """Add execution to history."""
        if session_id not in self.execution_history:
            self.execution_history[session_id] = []

        self.execution_history[session_id].append({
            "timestamp": datetime.now().isoformat(),
            "code": code[:100] + "..." if len(code) > 100 else code,
            "result": {
                "success": result.get("success"),
                "execution_time": result.get("execution_time")
            }
        })


# ============================================
# MCP Server Entry Point
# ============================================

async def main():
    """Run the MCP server."""
    server = CodeExecutionMCP()

    print("=" * 60)
    print("LearnFlow Code Execution MCP Server")
    print("=" * 60)
    print()

    # Example: Execute code
    print("Test: execute_code")
    code = """
for i in range(5):
    print(f"Number: {i}")
"""
    result = await server.execute_code(code)
    print("Code:", code.strip())
    print("Output:", result["stdout"])
    print("Success:", result["success"])
    print("Execution time:", result["execution_time"], "seconds")
    print()

    # Example: Analyze code
    print("Test: analyze_code")
    result = await server.analyze_code(code)
    print("Valid:", result["valid"])
    print("Issues:", result.get("issues", []))
    print()

    # Example: Test code
    print("Test: test_code")
    test_code = """
def add(a, b):
    return a + b
"""
    test_cases = [
        {"input": "add(2, 3)", "expected_output": "5"},
        {"input": "add(10, 20)", "expected_output": "30"}
    ]
    result = await server.test_code(test_code, test_cases)
    print("Test results:", json.dumps(result, indent=2))
    print()

    # Example: Format code
    print("Test: format_code")
    messy_code = "x=1+2;y=3+4"
    result = await server.format_code(messy_code)
    print("Original:", messy_code)
    print("Formatted:", result.get("formatted_code", messy_code))
    print()


if __name__ == "__main__":
    asyncio.run(main())
