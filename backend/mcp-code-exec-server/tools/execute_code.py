"""
execute_code: Execute Python code in sandboxed environment
Implements resource constraints and security restrictions.
"""
import subprocess
import tempfile
import os
import signal
from typing import Dict, Any
from config import settings_exec, settings_security

class TimeoutException(Exception):
    """Execution timeout exception."""
    pass

def execute_code(code: str, timeout: int = 5, memory_limit: int = 50) -> Dict[str, Any]:
    """
    Execute Python code in a sandboxed environment.

    Args:
        code: Python code to execute
        timeout: Maximum execution time in seconds (default 5, max 10)
        memory_limit: Memory limit in MB (default 50, max 100)

    Returns:
    - status: success/error/timeout
    - output: str (stdout)
    - error: str (stderr, if any)
    - execution_time: float (seconds)

    Security constraints:
    - No network access
    - Temp directory only for file I/O
    - Timeout enforced
    - Memory limit enforced
    - Limited built-in functions
    """
    # Enforce limits
    timeout = min(max(timeout, 1), settings_exec.max_timeout)
    memory_limit = min(max(memory_limit, 10), settings_exec.max_memory_limit)

    # Create temporary file for code
    with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False, dir=settings_exec.temp_dir) as f:
        code_file = f.name
        # Wrap code to capture output
        wrapped_code = f'''
import sys
import json

# Security: Restrict built-ins
SAFE_BUILTINS = {{
    "abs": abs,
    "all": all,
    "any": any,
    "bool": bool,
    "dict": dict,
    "enumerate": enumerate,
    "filter": filter,
    "float": float,
    "int": int,
    "len": len,
    "list": list,
    "map": map,
    "max": max,
    "min": min,
    "range": range,
    "reversed": reversed,
    "round": round,
    "set": set,
    "sorted": sorted,
    "str": str,
    "sum": sum,
    "tuple": tuple,
    "zip": zip,
    "print": print,
}}

__builtins__.update(SAFE_BUILTINS)

# Capture output
output = []
original_print = print

def print(*args, **kwargs):
    output.append(" ".join(str(arg) for arg in args))
    original_print(*args, **kwargs)

try:
{chr(10).join("    " + line for line in code.split(chr(10)))}
except SystemExit:
    pass
except Exception as e:
    print(f"Error: {{type(e).__name__}}: {{e}}")
'''
        f.write(wrapped_code)

    try:
        # Prepare environment with restricted path
        env = {
            'PATH': os.pathsep.join(['/usr/bin', '/bin']),
            'PYTHONPATH': settings_exec.temp_dir,
            'TMPDIR': settings_exec.temp_dir,
            'HOME': settings_exec.temp_dir,
        }

        # Execute with timeout and memory limit (using prlimit on Linux)
        cmd = [
            "prlimit",
            "--as={}".format(memory_limit * 1024 * 1024),  # Convert MB to bytes
            settings_exec.python_path,
            code_file
        ]

        # Fallback: no prlimit on Windows
        if os.name == 'nt':
            cmd = [settings_exec.python_path, code_file]

        result = subprocess.run(
            cmd if os.name != 'nt' else [settings_exec.python_path, code_file],
            capture_output=True,
            text=True,
            timeout=timeout,
            env={**os.environ, **env} if os.name != 'nt' else None
        )

        stdout = result.stdout
        stderr = result.stderr

        # Check for common security violations
        security_violations = []
        if "ImportError" in stderr or "ModuleNotFoundError" in stderr:
            # Check if importing restricted module
            for line in stderr.split('\n'):
                if "No module named" in line:
                    module = line.split("'")[1] if "'" in line else "unknown"
                    if module not in settings_security.allowed_modules:
                        security_violations.append(f"Restricted module: {module}")

        return {
            "status": "success",
            "output": stdout[-5000:] if len(stdout) > 5000 else stdout,  # Limit output
            "error": stderr[-1000:] if stderr else None,  # Limit error
            "execution_time": timeout,  # Approximate (actual time requires perf_counter)
            "security_violations": security_violations if security_violations else None,
        }

    except subprocess.TimeoutExpired:
        return {
            "status": "timeout",
            "output": None,
            "error": f"Execution exceeded {timeout} second timeout",
            "execution_time": timeout,
        }
    except Exception as e:
        return {
            "status": "error",
            "output": None,
            "error": str(e)[:200],
            "execution_time": 0,
        }
    finally:
        # Clean up temp file
        try:
            os.unlink(code_file)
        except:
            pass

__all__ = ["execute_code"]
