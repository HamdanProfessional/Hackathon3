"""
test_with_test_cases: Test code against provided test cases
Auto-grading functionality for exercise validation.
"""
import json
from typing import Dict, Any, List
from .execute_code import execute_code

def test_with_test_cases(code: str, test_cases: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Test code against provided test cases.

    Args:
        code: Python code to test (should include function definition)
        test_cases: List of test cases, each with:
            - input: dict of parameter names to values
            - expected: expected result
            - description: optional test description

    Returns:
    - status: success/error
    - passed: int (number of passed tests)
    - total: int (total number of tests)
    - results: list of test results

    Example test_cases:
    [
        {"input": {"x": 2, "y": 3}, "expected": 5, "description": "2 + 3 = 5"},
        {"input": {"x": -1, "y": 1}, "expected": 0, "description": "-1 + 1 = 0"}
    ]
    """
    if not test_cases:
        return {
            "status": "error",
            "error": "No test cases provided",
        }

    results = []
    passed = 0

    for i, test_case in enumerate(test_cases):
        test_input = test_case.get("input", {})
        expected = test_case.get("expected")
        description = test_case.get("description", f"Test case {i + 1}")

        try:
            # Build test wrapper code
            params = ", ".join(test_input.keys())
            values = ", ".join(repr(v) for v in test_input.values())

            # Assuming code defines a function, add test call
            test_code = f'''
{code}

# Test runner
result = function({params}) if 'function' in dir() else None
print(json.dumps({{"result": result, "expected": {repr(expected)}}}))
'''

            exec_result = execute_code(test_code, timeout=5)

            if exec_result["status"] == "timeout":
                results.append({
                    "description": description,
                    "passed": False,
                    "error": "Test timed out",
                })
                continue

            if exec_result["status"] == "error":
                results.append({
                    "description": description,
                    "passed": False,
                    "error": exec_result.get("error", "Unknown error"),
                })
                continue

            # Parse output
            output = exec_result.get("output", "")

            try:
                # Extract JSON result from output
                for line in output.split('\n'):
                    if '{"result"' in line:
                        data = json.loads(line.strip())
                        result = data.get("result")

                        # Compare with expected
                        test_passed = result == expected

                        if test_passed:
                            passed += 1

                        results.append({
                            "description": description,
                            "passed": test_passed,
                            "input": test_input,
                            "expected": expected,
                            "actual": result,
                        })
                        break
                else:
                    # No JSON found in output
                    results.append({
                        "description": description,
                        "passed": False,
                        "error": "No valid output",
                        "output": output[:200],
                    })

            except json.JSONDecodeError:
                results.append({
                    "description": description,
                    "passed": False,
                    "error": "Invalid output format",
                    "output": output[:200],
                })

        except Exception as e:
            results.append({
                "description": description,
                "passed": False,
                "error": str(e)[:100],
            })

    return {
        "status": "success",
        "passed": passed,
        "total": len(test_cases),
        "score": round((passed / len(test_cases)) * 100, 1) if test_cases else 0,
        "results": results[:20],  # Limit to 20 results
    }

__all__ = ["test_with_test_cases"]
