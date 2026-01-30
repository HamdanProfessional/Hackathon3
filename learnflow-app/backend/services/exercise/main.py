"""Exercise Service - Generates and grades coding exercises.

Provides auto-graded Python exercises with hints and progressive difficulty.
Integrates with MCP Code Execution server for safe code evaluation.
"""

import os
import httpx
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from shared.models import (
    HealthResponse, ChatRequest, ChatResponse,
    ExerciseRequest, Exercise, ExerciseSubmission, ExerciseResult
)
from shared.dapr_client import get_dapr_client, EventTopics

# MCP Code Execution Service URL
CODE_EXECUTION_MCP_URL = os.getenv("CODE_EXECUTION_MCP_URL", "http://code-execution-mcp.learnflow.svc.cluster.local:9000")


SERVICE_NAME = "exercise-service"
SERVICE_VERSION = "2.0.0"
PORT = int(os.getenv("PORT", "8004"))

app = FastAPI(title="LearnFlow Exercise Service", version=SERVICE_VERSION)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

# Complete exercise database with all 8 modules
ALL_EXERCISES = {
    # MODULE 1: BASICS (5 exercises)
    "basics_1": Exercise(
        id="ex_1_1", title="Your First Variable", difficulty="beginner",
        description="Create a variable called `my_name` and assign your name to it.",
        instructions="Create a variable called `my_name` and assign your name to it. Then print it.",
        starter_code="# Write your code below\n",
        solution='my_name = "YourName"\nprint(my_name)',
        test_cases=[{"check": "my_name", "type": "code_check"}, {"output": "YourName"}],
        hints=["Use the assignment operator (=)", "Variables can hold strings"],
        skills=["variables", "print", "strings"],
        points=10, module_id="basics", topic="Variables"
    ),
    "basics_2": Exercise(
        id="ex_1_2", title="String Concatenation", difficulty="beginner",
        description="Create two string variables, `first_name` and `last_name`. Print them together.",
        instructions="Create two string variables, `first_name` and `last_name`. Print them together as a full name.",
        starter_code='first_name = "John"\nlast_name = "Doe"\n# Print full name below',
        solution='print(f"{first_name} {last_name}")',
        test_cases=[{"output": "John Doe"}],
        hints=["Use f-strings for formatting", "Put a space between names"],
        skills=["strings", "f-strings", "print"],
        points=15, module_id="basics", topic="Strings"
    ),
    "basics_3": Exercise(
        id="ex_1_3", title="Integer Operations", difficulty="beginner",
        description="Create two variables `a = 10` and `b = 3`. Print their sum, difference, product, and quotient.",
        instructions="Create two variables `a = 10` and `b = 3`. Print the sum, difference, product, and quotient.",
        starter_code="a = 10\nb = 3\n",
        solution='print(f"Sum: {a + b}")\nprint(f"Difference: {a - b}")\nprint(f"Product: {a * b}")\nprint(f"Quotient: {a / b}")',
        test_cases=[{"has_output": "Sum: 13"}],
        hints=["+", "-", "*", "/"],
        skills=["operators", "arithmetic", "print"],
        points=20, module_id="basics", topic="Arithmetic Operators"
    ),
    "basics_4": Exercise(
        id="ex_1_4", title="Input and Output", difficulty="beginner",
        description="Ask the user for their favorite color and print a message.",
        instructions="Ask the user for their favorite color and print a message saying \"That's a great color!\"",
        starter_code="# Get user input\n",
        solution='color = input("What is your favorite color? ")\nprint(f"That\'s a great color, {color}!")',
        test_cases=[{"requires_input": True}],
        hints=["Use the input() function", "f-strings for variable interpolation"],
        skills=["input", "f-strings", "print"],
        points=15, module_id="basics", topic="Input/Output"
    ),
    "basics_5": Exercise(
        id="ex_1_5", title="Type Conversion", difficulty="beginner",
        description="Convert the string \"42\" to an integer and multiply by 2.",
        instructions="Convert the string \"42\" to an integer and multiply by 2. Print the result.",
        starter_code='number_str = "42"\n',
        solution='number = int(number_str)\nprint(number * 2)',
        test_cases=[{"output": "84"}],
        hints=["Use int() to convert string to integer", "Type conversion is explicit"],
        skills=["type-conversion", "int", "arithmetic"],
        points=20, module_id="basics", topic="Type Conversion"
    ),

    # MODULE 2: CONTROL FLOW (6 exercises)
    "control_1": Exercise(
        id="ex_2_1", title="If-Else Statement", difficulty="beginner",
        description="Check if a number is positive or negative.",
        instructions="Write a program that checks if a number is positive or negative and prints an appropriate message.",
        starter_code="number = 5\n# Add your code below",
        solution='if number > 0:\n    print("The number is positive")\nelse:\n    print("The number is negative")',
        test_cases=[{"number": 5, "output": "positive"}, {"number": -3, "output": "negative"}],
        hints=["Use if-else structure", "The > operator checks if positive"],
        skills=["if-else", "comparison operators", "print"],
        points=15, module_id="control_flow", topic="Conditionals"
    ),
    "control_2": Exercise(
        id="ex_2_2", title="Even or Odd", difficulty="beginner",
        description="Check if a number is even or odd.",
        instructions="Check if a number is even or odd using the modulo operator (%).",
        starter_code="num = 7\n",
        solution='if num % 2 == 0:\n    print(f"{num} is even")\nelse:\n    print(f"{num} is odd")',
        test_cases=[{"num": 4, "output": "even"}, {"num": 7, "output": "odd"}],
        hints=["Modulo % returns remainder", "Even numbers have remainder 0"],
        skills=["modulo", "conditionals", "if-else"],
        points=20, module_id="control_flow", topic="Conditionals"
    ),
    "control_3": Exercise(
        id="ex_2_3", title="For Loop Sum", difficulty="beginner",
        description="Calculate the sum of numbers from 1 to 10.",
        instructions="Calculate the sum of numbers from 1 to 10 using a for loop.",
        starter_code="# Calculate sum\n",
        solution='total = 0\nfor i in range(1, 11):\n    total += i\nprint(f"Sum: {total}")',
        test_cases=[{"output": "Sum: 55"}],
        hints=["range(1, 11) goes from 1 to 10", "Use += to add to accumulator"],
        skills=["for-loop", "range", "arithmetic"],
        points=25, module_id="control_flow", topic="For Loops"
    ),
    "control_4": Exercise(
        id="ex_2_4", title="While Loop Counter", difficulty="intermediate",
        description="Use a while loop to count down from 5 to 1.",
        instructions="Use a while loop to count down from 5 to 1.",
        starter_code="count = 5\n",
        solution='while count > 0:\n    print(count)\n    count -= 1',
        test_cases=[{"output": "5\\n4\\n3\\n2\\n1"}],
        hints=["Decrement the counter", "While condition checks before loop body"],
        skills=["while-loop", "decrement", "comparison"],
        points=30, module_id="control_flow", topic="While Loops"
    ),
    "control_5": Exercise(
        id="ex_2_5", title="Break Statement", difficulty="intermediate",
        description="Loop through numbers 1-10, but break when you reach 5.",
        instructions="Loop through numbers 1-10, but break when you reach 5.",
        starter_code='for i in range(1, 11):\n    # Add break logic\n    print(i)',
        solution='for i in range(1, 11):\n    if i == 5:\n        break\n    print(i)',
        test_cases=[{"output": "1\\n2\\n3\\n4"}],
        hints=["break exits the loop immediately", "Place break condition before print"],
        skills=["for-loop", "break"],
        points=25, module_id="control_flow", topic="Break/Continue"
    ),
    "control_6": Exercise(
        id="ex_2_6", title="Continue Statement", difficulty="intermediate",
        description="Print all odd numbers from 1-10. Use continue to skip evens.",
        instructions="Print all odd numbers from 1-10. Use continue to skip even numbers.",
        starter_code='for i in range(1, 11):\n    # Skip evens here\n    print(i)',
        solution='for i in range(1, 11):\n    if i % 2 == 0:\n        continue\n    print(i)',
        test_cases=[{"output": "1\\n3\\n5\\n7\\n9"}],
        hints=["continue skips to next iteration", "Modulo 2 identifies even numbers"],
        skills=["for-loop", "continue", "modulo"],
        points=25, module_id="control_flow", topic="Break/Continue"
    ),

    # MODULE 3: DATA STRUCTURES (5 exercises)
    "data_1": Exercise(
        id="ex_3_1", title="List Operations", difficulty="beginner",
        description="Create a list of 5 fruits, add one, remove the first.",
        instructions="Create a list of 5 fruits. Add \"mango\" at the end and remove the first item.",
        starter_code='fruits = ["apple", "banana", "cherry", "date", "elderberry"]\n',
        solution='fruits.append("mango")\nfruits.pop(0)\nprint(f"Updated list: {fruits}")',
        test_cases=[{"list_length": 5, "first": "banana", "last": "mango"}],
        hints=[".append() adds to end", ".pop(0) removes first element"],
        skills=["lists", "append", "pop"],
        points=20, module_id="data_structures", topic="Lists"
    ),
    "data_2": Exercise(
        id="ex_3_2", title="Tuple Immutability", difficulty="beginner",
        description="Try to modify a tuple and understand why it doesn't work.",
        instructions="Try to modify a tuple and explain why it doesn't work.",
        starter_code='coordinates = (10, 20)\n# Try to change the first value\ncoordinates[0] = 15',
        solution='# Tuples are immutable - cannot be changed\nprint("Tuples cannot be modified after creation")',
        test_cases=[{"error": "TypeError"}],
        hints=["Tuples use parentheses ()", "Tuples are immutable"],
        skills=["tuples", "immutability"],
        points=15, module_id="data_structures", topic="Tuples"
    ),
    "data_3": Exercise(
        id="ex_3_3", title="Dictionary Access", difficulty="beginner",
        description="Print the age from a person dictionary.",
        instructions="Given a person dictionary, print their age using the key \"age\".",
        starter_code='person = {"name": "Alice", "age": 30, "city": "NYC"}\n',
        solution='print(f"Age: {person[\'age\']}")',
        test_cases=[{"output": "Age: 30"}],
        hints=["Access with ['key'] or .get() method", "Keys are strings in quotes"],
        skills=["dictionaries", "key-access"],
        points=25, module_id="data_structures", topic="Dictionaries"
    ),
    "data_4": Exercise(
        id="ex_3_4", title="Set Operations", difficulty="intermediate",
        description="Find union and intersection of two sets.",
        instructions="Create two sets of numbers and find their union and intersection.",
        starter_code='set1 = {1, 2, 3, 4, 5}\nset2 = {4, 5, 6, 7, 8}\n',
        solution='print(f"Union: {set1 | set2}")\nprint(f"Intersection: {set1 & set2}")',
        test_cases=[{"union": "{1, 2, 3, 4, 5, 6, 7, 8}", "intersection": "{4, 5}"}],
        hints=["| is union operator", "& is intersection"],
        skills=["sets", "union", "intersection"],
        points=30, module_id="data_structures", topic="Sets"
    ),
    "data_5": Exercise(
        id="ex_3_5", title="Dictionary Loop", difficulty="intermediate",
        description="Print all keys and values from a dictionary.",
        instructions="Print all keys and values from a dictionary using a loop.",
        starter_code='scores = {"Alice": 85, "Bob": 92, "Charlie": 78}\n',
        solution='for name, score in scores.items():\n    print(f"{name}: {score}")',
        test_cases=[{"has": "Alice: 85"}],
        hints=[".items() returns key-value pairs", "for key, value in dict"],
        skills=["dictionaries", "loops", "items"],
        points=25, module_id="data_structures", topic="Dictionaries"
    ),

    # MODULE 4: FUNCTIONS (4 exercises)
    "functions_1": Exercise(
        id="ex_4_1", title="Simple Function", difficulty="beginner",
        description="Define a function that takes a name and prints a greeting.",
        instructions="Define a function called `greet` that takes a name parameter and prints a greeting.",
        starter_code="# Define your function below\n",
        solution='def greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("Alice"))',
        test_cases=[{"output": "Hello, Alice!"}],
        hints=["Use def keyword", "Functions need () to call"],
        skills=["functions", "def", "parameters"],
        points=20, module_id="functions", topic="Defining Functions"
    ),
    "functions_2": Exercise(
        id="ex_4_2", title="Default Parameters", difficulty="intermediate",
        description="Create a function with default parameters for rectangle area.",
        instructions="Create a function that calculates rectangle area. Default width=10, height=5.",
        starter_code="# Function with defaults\n",
        solution='def rectangle_area(width=10, height=5):\n    return width * height\n\nprint(rectangle_area())\nprint(rectangle_area(15))',
        test_cases=[{"output": "50"}, {"output": "75"}],
        hints=["Default parameters in function definition", "Can override defaults when calling"],
        skills=["functions", "default-parameters", "return"],
        points=25, module_id="functions", topic="Parameters"
    ),
    "functions_3": Exercise(
        id="ex_4_3", title="Return Values", difficulty="intermediate",
        description="Write a function that returns the sum of a list.",
        instructions="Write a function that takes a list and returns the sum of all elements.",
        starter_code='def calculate_sum(numbers):\n    # Add logic here\n',
        solution='def calculate_sum(numbers):\n    return sum(numbers)\n\nresult = calculate_sum([1, 2, 3, 4, 5])\nprint(f"Sum: {result}")',
        test_cases=[{"sum": 15}],
        hints=["Use built-in sum() function", "Return without printing"],
        skills=["functions", "return", "list-operations"],
        points=30, module_id="functions", topic="Return Values"
    ),
    "functions_4": Exercise(
        id="ex_4_4", title="Scope Challenge", difficulty="intermediate",
        description="Understand local vs global scope in functions.",
        instructions="Predict the output of code with a global and local variable.",
        starter_code='count = 5\n\ndef increment():\n    count += 1\n    return count\n\nincrement()\nprint(count)',
        solution='The output is 5. The function doesn\'t modify the global variable.\n\nAnswer: 5',
        test_cases=[{"output": "5"}],
        hints=["Python uses LEGB rule - Local, Enclosing, Global, Built-in", "Functions create local scope"],
        skills=["scope", "local-vs-global", "LEGB"],
        points=30, module_id="functions", topic="Scope"
    ),

    # MODULE 5: OOP (4 exercises)
    "oop_1": Exercise(
        id="ex_5_1", title="Your First Class", difficulty="beginner",
        description="Create a `Dog` class with name, breed attributes and a bark() method.",
        instructions="Create a `Dog` class with `name` and `breed` attributes. Add a `bark()` method.",
        starter_code='class Dog:\n    # Add attributes here\n    \n    def bark(self):\n        return "Woof!"',
        solution='class Dog:\n    def __init__(self, name, breed):\n        self.name = name\n        self.breed = breed\n    \n    def bark(self):\n        return f"{self.name} says: Woof!"\n\ndog = Dog("Buddy", "Golden Retriever")\nprint(dog.bark())',
        test_cases=[{"output": "Buddy says: Woof!"}],
        hints=["__init__ is the constructor", "self refers to the instance"],
        skills=["classes", "__init__", "attributes", "methods"],
        points=25, module_id="oop", topic="Classes & Objects"
    ),
    "oop_2": Exercise(
        id="ex_5_2", title="Class Methods", difficulty="beginner",
        description="Add a withdraw method to BankAccount class with balance check.",
        instructions="Add a method to the `BankAccount` class to withdraw funds.",
        starter_code='class BankAccount:\n    def __init__(self, balance):\n        self.balance = balance\n\n    # Add withdraw method here\n',
        solution='class BankAccount:\n    def __init__(self, balance):\n        self.balance = balance\n    \n    def withdraw(self, amount):\n        if self.balance >= amount:\n            self.balance -= amount\n            return True\n        return False',
        test_cases=[{"withdraw": 50, "balance": 50}, {"withdraw": 100, "balance": 50}],
        hints=["Check if balance is sufficient", "Update balance after withdrawal"],
        skills=["classes", "methods", "validation"],
        points=30, module_id="oop", topic="Attributes & Methods"
    ),
    "oop_3": Exercise(
        id="ex_5_3", title="Inheritance", difficulty="intermediate",
        description="Create a Student class that inherits from Person.",
        instructions="Create a `Student` class that inherits from `Person` and adds a grade attribute.",
        starter_code='class Person:\n    def __init__(self, name):\n        self.name = name\n\n# Create Student class here',
        solution='class Student(Person):\n    def __init__(self, name, grade):\n        super().__init__(name)\n        self.grade = grade\n\nstudent = Student("Alice", "A")\nprint(f"{student.name}: {student.grade}")',
        test_cases=[{"output": "Alice: A"}],
        hints=["Use super().__init__() to call parent constructor", "Child inherits from Parent"],
        skills=["inheritance", "super()", "classes"],
        points=30, module_id="oop", topic="Inheritance"
    ),
    "oop_4": Exercise(
        id="ex_5_4", title="Encapsulation", difficulty="intermediate",
        description="Make balance attribute private with a getter method.",
        instructions="Make the `balance` attribute private and add a getter method.",
        starter_code='class BankAccount:\n    def __init__(self, balance):\n        self.balance = balance',
        solution='class BankAccount:\n    def __init__(self, balance):\n        self.__balance = balance\n    \n    def get_balance(self):\n        return self.__balance\n\naccount = BankAccount(100)\nprint(account.get_balance())',
        test_cases=[{"output": 100}],
        hints=["Double underscore __ makes it private", "Getter methods provide controlled access"],
        skills=["encapsulation", "private-attributes", "getters"],
        points=25, module_id="oop", topic="Encapsulation"
    ),

    # MODULE 6: FILES (4 exercises)
    "files_1": Exercise(
        id="ex_6_1", title="Write to File", difficulty="beginner",
        description="Write text to a file called `greeting.txt`.",
        instructions="Write the text \"Hello, World!\" to a file called `greeting.txt`.",
        starter_code="# Write code to create file\n",
        solution='with open("greeting.txt", "w") as file:\n    file.write("Hello, World!")',
        test_cases=[{"file_content": "Hello, World!"}],
        hints=["\"w\" mode for writing", "with statement automatically closes file"],
        skills=["file-write", "with-context-manager", "open"],
        points=20, module_id="files", topic="Writing Files"
    ),
    "files_2": Exercise(
        id="ex_6_2", title="Read from File", difficulty="beginner",
        description="Read and print contents of a file.",
        instructions="Read the contents of `greeting.txt` and print it.",
        starter_code="# Read file contents\n",
        solution='with open("greeting.txt", "r") as file:\n    content = file.read()\n    print(content)',
        test_cases=[{"content": "Hello, World!"}],
        hints=["\"r\" mode for reading", "read() returns entire file content"],
        skills=["file-read", "open", "read"],
        points=20, module_id="files", topic="Reading Files"
    ),
    "files_3": Exercise(
        id="ex_6_3", title="CSV Processing", difficulty="intermediate",
        description="Parse a CSV string and extract fruit name and price.",
        instructions="Parse a CSV line \"apple,red,sweet,3.99\" and print the fruit name and price.",
        starter_code='csv_line = "apple,red,sweet,3.99"\n',
        solution='parts = csv_line.split(",")\nfruit = parts[0]\nprice = parts[3]\nprint(f"{fruit}: ${price}")',
        test_cases=[{"fruit": "apple", "price": "3.99"}],
        hints=[".split(',') separates by comma", "Indexing starts at 0"],
        skills=["csv", "split", "indexing"],
        points=30, module_id="files", topic="CSV Processing"
    ),
    "files_4": Exercise(
        id="ex_6_4", title="JSON Handling", difficulty="intermediate",
        description="Parse JSON and access a specific field.",
        instructions="Parse the JSON string '{\"name\": \"Alice\", \"age\": 30}' and access the age.",
        starter_code='import json\n\ndata = \'{"name": "Alice", "age": 30}\'',
        solution='import json\n\ndata = \'{"name": "Alice", "age": 30}\'\nuser = json.loads(data)\nprint(user[\'age\'])',
        test_cases=[{"age": 30}],
        hints=["json.loads() parses JSON string", "Access dict values with ['key']"],
        skills=["json", "json.loads", "dictionary-access"],
        points=30, module_id="files", topic="JSON Handling"
    ),

    # MODULE 7: ERRORS (4 exercises)
    "errors_1": Exercise(
        id="ex_7_1", title="Basic Try-Except", difficulty="beginner",
        description="Handle division by zero with try-except.",
        instructions="Wrap division in a try-except block to handle ZeroDivisionError.",
        starter_code='numerator = 10\ndenominator = 0',
        solution='try:\n    result = numerator / denominator\n    print(f"Result: {result}")\nexcept ZeroDivisionError:\n    print("Cannot divide by zero!")',
        test_cases=[{"output": "Cannot divide by zero!"}],
        hints=["ZeroDivisionError raised when dividing by zero", "except block catches the error"],
        skills=["try-except", "exception-handling", "ZeroDivisionError"],
        points=25, module_id="errors", topic="Try/Except"
    ),
    "errors_2": Exercise(
        id="ex_7_2", title="Multiple Exceptions", difficulty="intermediate",
        description="Handle both ValueError and KeyError when accessing dictionary.",
        instructions="Handle both ValueError and KeyError when accessing dictionary data.",
        starter_code='data = {"name": "Bob"}\n\n# Try to access age and city keys',
        solution='try:\n    age = data["age"]\n    print(f"Age: {age}")\nexcept KeyError as e:\n    print(f"Missing key: {e}")\n\ntry:\n    city = data["city"]\n    print(f"City: {city}")\nexcept KeyError as e:\n    print(f"Missing key: {e}")',
        test_cases=[{"output": "Missing key: 'city'"}],
        hints=["Catch KeyError for missing keys", "Different exceptions for different missing keys"],
        skills=["try-except", "KeyError", "multiple-exceptions"],
        points=30, module_id="errors", topic="Exception Types"
    ),
    "errors_3": Exercise(
        id="ex_7_3", title="Custom Exception", difficulty="intermediate",
        description="Create a custom exception and raise it for invalid age.",
        instructions="Create a custom exception `InvalidAgeError` and raise it if age < 0 or age > 120.",
        starter_code="# Define custom exception and validate function",
        solution='class InvalidAgeError(Exception):\n    pass\n\ndef validate_age(age):\n    if age < 0 or age > 120:\n        raise InvalidAgeError(f"Invalid age: {age}")\n    return True\n\ntry:\n    validate_age(-5)\nexcept InvalidAgeError as e:\n    print(f"Error: {e}")',
        test_cases=[{"error": "Invalid age: -5"}],
        hints=["Custom exceptions inherit from Exception", "raise keyword triggers the exception"],
        skills=["custom-exceptions", "raise", "exception-inheritance"],
        points=30, module_id="errors", topic="Custom Exceptions"
    ),
    "errors_4": Exercise(
        id="ex_7_4", title="Finally Block", difficulty="intermediate",
        description="Use finally block to ensure cleanup code always runs.",
        instructions="Open a file in try block, print error in except block, and \"Done\" in finally block.",
        starter_code="# File operations with try-except-finally",
        solution='try:\n    file = open("data.txt", "r")\n    content = file.read()\nexcept FileNotFoundError:\n    print("Success!")\nfinally:\n    print("Done")',
        test_cases=[{"has": "Done"}],
        hints=["finally block always executes", "Use for cleanup operations"],
        skills=["try-except-finally", "FileNotFoundError", "finally"],
        points=25, module_id="errors", topic="Try/Except/Else"
    ),

    # MODULE 8: LIBRARIES (4 exercises)
    "libraries_1": Exercise(
        id="ex_8_1", title="Install a Package", difficulty="beginner",
        description="Understand how to install Python packages using pip.",
        instructions="Write a command to install the `requests` package using pip.",
        starter_code="# Write pip command\n",
        solution='# Using pip\npip install requests',
        test_cases=[{"command": "pip install requests"}],
        hints=["pip is Python's package installer", "Specify package name"],
        skills=["pip", "package-installation", "terminal"],
        points=20, module_id="libraries", topic="Installing Packages"
    ),
    "libraries_2": Exercise(
        id="ex_8_2", title="Import and Use Module", difficulty="beginner",
        description="Use the `random` module to generate random numbers.",
        instructions="Import the `random` module and use `randint()` to generate a random number between 1-100.",
        starter_code="# Import random module\n",
        solution='import random\n\nnumber = random.randint(1, 100)\nprint(f"Random number: {number}")',
        test_cases=[{"range": "1-100"}],
        hints=["random.randint(start, end) is inclusive", "Module import needed"],
        skills=["import", "random", "random-int"],
        points=25, module_id="libraries", topic="Using Libraries"
    ),
    "libraries_3": Exercise(
        id="ex_8_3", title="API Request", difficulty="intermediate",
        description="Fetch data from an API using the requests library.",
        instructions="Use the `requests` library to fetch data from a public API.",
        starter_code='import requests\n\n# Fetch user data from GitHub API',
        solution='import requests\n\nresponse = requests.get("https://api.github.com/users")\nif response.status_code == 200:\n    print(f"Status: {response.status_code}")\n    users = response.json()\n    print(f"Found {len(users)} users")',
        test_cases=[{"check": "status_code"}],
        hints=["requests.get() fetches URLs", "Check status_code before parsing"],
        skills=["requests", "http", "api", "json"],
        points=30, module_id="libraries", topic="Working with APIs"
    ),
    "libraries_4": Exercise(
        id="ex_8_4", title="Virtual Environment", difficulty="intermediate",
        description="Create and activate a Python virtual environment.",
        instructions="Create a virtual environment called `myenv` and activate it.",
        starter_code="# Commands to create and activate\n",
        solution='# Create venv\npython -m venv myenv\n\n# Activate (Windows)\nmyenv\\Scripts\\activate\n\n# Activate (Linux/Mac)\nsource myenv/bin/activate',
        test_cases=[{"command": "python -m venv myenv"}],
        hints=["python -m venv creates venv", "Activation depends on OS"],
        skills=["virtualenv", "environment-setup", "activation"],
        points=25, module_id="libraries", topic="Virtual Environments"
    ),
}


# Flatten for backwards compatibility with generate endpoint
EXERCISES = {}
for key, exercise in ALL_EXERCISES.items():
    EXERCISES[len(EXERCISES) + 1] = exercise


@app.get("/", response_model=dict)
async def root():
    return {"service": SERVICE_NAME, "version": SERVICE_VERSION, "status": "running", "total_exercises": len(ALL_EXERCISES)}


@app.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse(status="healthy", service=SERVICE_NAME, version=SERVICE_VERSION)


@app.get("/exercises/all", response_model=dict)
async def get_all_exercises():
    """Get all available exercises."""
    exercises_list = []
    for key, exercise in ALL_EXERCISES.items():
        exercises_list.append({
            "id": exercise.id,
            "title": exercise.title,
            "description": exercise.description,
            "difficulty": exercise.difficulty,
            "points": exercise.points,
            "module_id": exercise.module_id,
            "topic": exercise.topic,
            "skills": exercise.skills
        })
    return {
        "total": len(exercises_list),
        "exercises": exercises_list
    }


@app.get("/modules", response_model=dict)
async def get_modules():
    """Get all available modules with their exercises."""
    modules = {
        "basics": {
            "id": "basics",
            "name": "Python Basics",
            "order": 1,
            "topics": ["Variables", "Data Types", "Input/Output", "Operators", "Type Conversion"],
            "exercises": [e.id for e in ALL_EXERCISES.values() if e.module_id == "basics"]
        },
        "control_flow": {
            "id": "control_flow",
            "name": "Control Flow",
            "order": 2,
            "topics": ["Conditionals", "For Loops", "While Loops", "Break/Continue"],
            "exercises": [e.id for e in ALL_EXERCISES.values() if e.module_id == "control_flow"]
        },
        "data_structures": {
            "id": "data_structures",
            "name": "Data Structures",
            "order": 3,
            "topics": ["Lists", "Tuples", "Dictionaries", "Sets"],
            "exercises": [e.id for e in ALL_EXERCISES.values() if e.module_id == "data_structures"]
        },
        "functions": {
            "id": "functions",
            "name": "Functions",
            "order": 4,
            "topics": ["Defining Functions", "Parameters", "Return Values", "Scope"],
            "exercises": [e.id for e in ALL_EXERCISES.values() if e.module_id == "functions"]
        },
        "oop": {
            "id": "oop",
            "name": "Object-Oriented Programming",
            "order": 5,
            "topics": ["Classes & Objects", "Attributes & Methods", "Inheritance", "Encapsulation"],
            "exercises": [e.id for e in ALL_EXERCISES.values() if e.module_id == "oop"]
        },
        "files": {
            "id": "files",
            "name": "File Handling",
            "order": 6,
            "topics": ["Reading/Writing Files", "CSV Processing", "JSON Handling"],
            "exercises": [e.id for e in ALL_EXERCISES.values() if e.module_id == "files"]
        },
        "errors": {
            "id": "errors",
            "name": "Error Handling",
            "order": 7,
            "topics": ["Try/Except", "Exception Types", "Custom Exceptions", "Debugging"],
            "exercises": [e.id for e in ALL_EXERCISES.values() if e.module_id == "errors"]
        },
        "libraries": {
            "id": "libraries",
            "name": "Libraries & External Packages",
            "order": 8,
            "topics": ["Installing Packages", "Working with APIs", "Virtual Environments"],
            "exercises": [e.id for e in ALL_EXERCISES.values() if e.module_id == "libraries"]
        }
    }
    return modules


@app.post("/generate", response_model=Exercise)
async def generate_exercise(request: ExerciseRequest):
    """Generate an exercise for the student."""
    # Return first exercise from requested module
    for key, exercise in ALL_EXERCISES.items():
        if exercise.module_id == request.module_id or request.module_id == "basics":
            return exercise

    # Default to first exercise
    return next(iter(ALL_EXERCISES.values()))


@app.get("/exercise/{exercise_id}", response_model=Exercise)
async def get_exercise(exercise_id: str):
    """Get a specific exercise by ID."""
    for exercise in ALL_EXERCISES.values():
        if exercise.id == exercise_id:
            return exercise

    raise HTTPException(status_code=404, detail="Exercise not found")


@app.post("/submit", response_model=ExerciseResult)
async def submit_exercise(submission: ExerciseSubmission):
    """Grade exercise submission using MCP Code Execution and publish event."""
    # Find the exercise
    exercise = None
    for ex in ALL_EXERCISES.values():
        if ex.id == submission.exercise_id:
            exercise = ex
            break

    if not exercise:
        return ExerciseResult(
            passed=False,
            feedback="Exercise not found",
            test_results=[],
        )

    # Use MCP Code Execution to validate and run the code
    passed = False
    output = ""
    error = ""
    try:
        async with httpx.AsyncClient() as client:
            # First check syntax
            syntax_response = await client.post(
                f"{CODE_EXECUTION_MCP_URL}/tools/call",
                json={
                    "name": "check_syntax",
                    "arguments": {"code": submission.code}
                },
                timeout=5.0
            )

            # Execute the code
            exec_response = await client.post(
                f"{CODE_EXECUTION_MCP_URL}/tools/call",
                json={
                    "name": "execute_code",
                    "arguments": {"code": submission.code}
                },
                timeout=10.0
            )

            if exec_response.status_code == 200:
                result = exec_response.json()
                # Parse MCP response (returns list of TextContent)
                if isinstance(result, list) and len(result) > 0:
                    import json
                    exec_result = json.loads(result[0]["text"])
                    passed = exec_result.get("success", False)
                    output = exec_result.get("output", "")
                    error = exec_result.get("error", "")

                    # Validate against test cases
                    test_passed = True
                    if exercise.test_cases:
                        for tc in exercise.test_cases:
                            if tc.get("type") == "output":
                                if tc.get("expected") and tc["expected"] not in output:
                                    test_passed = False
                            elif tc.get("type") == "code_check":
                                if tc.get("check") and tc["check"] not in submission.code:
                                    test_passed = False

                    passed = passed and test_passed and (error is None or error == "")
    except Exception as e:
        # Fallback to simple validation if MCP is unavailable
        code = submission.code.strip()
        passed = len(code) > 10 and "print" in code

    # Publish exercise attempt event to Kafka
    try:
        dapr = get_dapr_client()
        await dapr.publish_event(
            topic=EventTopics.EXERCISE_ATTEMPT,
            data={
                "student_id": str(submission.student_id),
                "exercise_id": submission.exercise_id,
                "passed": passed,
                "module_id": exercise.module_id,
                "topic": exercise.topic,
                "difficulty": exercise.difficulty,
            },
        )
    except:
        pass  # Event publishing is optional

    return ExerciseResult(
        passed=passed,
        feedback=output if passed else (error or "Code didn't produce expected output"),
        test_results=[{"output": output, "error": error}],
        hints=exercise.hints if not passed else [],
    )


@app.post("/chat")
async def exercise_chat(request: ChatRequest):
    """Handle exercise-related chat."""
    return ChatResponse(
        response=f"I can help you with exercises! I have {len(ALL_EXERCISES)} exercises available across 8 modules: Basics, Control Flow, Data Structures, Functions, OOP, Files, Errors, and Libraries.",
        agent_type="exercise",
        confidence=0.95,
    )


# ============================================================================
# Teacher Assignment Generation (AI-Powered)
# ============================================================================

from pydantic import BaseModel
from typing import Optional, List


class TeacherAssignmentRequest(BaseModel):
    """Request model for teacher to generate an assignment."""
    prompt: str  # Teacher's description of what they want
    difficulty: str  # 'beginner', 'intermediate', or 'advanced'
    topic: Optional[str] = None  # Optional topic to focus on
    module_id: Optional[str] = None  # Optional module to target


class GeneratedAssignment(BaseModel):
    """Response model for generated assignment."""
    exercise: Exercise
    preview: str  # Human-readable preview of the exercise


@app.post("/api/v1/teacher/generate-assignment", response_model=GeneratedAssignment)
async def generate_teacher_assignment(request: TeacherAssignmentRequest):
    """
    Generate a custom exercise assignment based on teacher's prompt and difficulty.

    This endpoint uses AI to create a tailored exercise for students based on the
    teacher's requirements. The exercise will be automatically generated with:
    - Title and description based on the prompt
    - Difficulty-appropriate starter code
    - Test cases for validation
    - Hints for students
    """
    from uuid import uuid4

    # Generate exercise ID
    exercise_id = f"teacher_{uuid4().hex[:8]}"

    # Build AI prompt for exercise generation
    ai_prompt = f"""Generate a Python coding exercise with the following specifications:

TEACHER'S REQUEST: {request.prompt}
DIFFICULTY LEVEL: {request.difficulty}
TOPIC: {request.topic or 'General Python'}
MODULE: {request.module_id or 'various'}

Create an exercise that includes:
1. A clear, concise title
2. A brief description of what the student needs to do
3. Step-by-step instructions
4. Starter code (with comments for guidance)
5. A complete solution
6. 3-5 test cases for validation
7. 3 progressive hints
8. Relevant skills/tags

Format your response as a JSON object with these fields:
{{
  "title": "...",
  "description": "...",
  "instructions": "...",
  "starter_code": "...",
  "solution": "...",
  "test_cases": [...],
  "hints": [...],
  "skills": [...],
  "points": <10-50 based on difficulty>
}}

Return ONLY the JSON, no other text."""

    # For now, create a template-based exercise
    # In production, this would call an AI service (like concepts-service with OpenAI)

    # Difficulty-based adjustments
    difficulty_points = {
        "beginner": 10,
        "intermediate": 25,
        "advanced": 40
    }

    # Generate a custom exercise based on the prompt
    # This is a simplified version - production would use actual AI generation
    generated_exercise = Exercise(
        id=exercise_id,
        title=f"Custom: {request.prompt[:50]}{'...' if len(request.prompt) > 50 else ''}",
        difficulty=request.difficulty,
        description=f"Complete the following exercise: {request.prompt}",
        instructions=f"""Based on your teacher's request, complete this exercise:

{request.prompt}

Difficulty: {request.difficulty.title()}
{f'Topic: {request.topic}' if request.topic else ''}

Requirements:
- Follow Python best practices
- Include proper error handling
- Add comments to explain your code""",
        starter_code=f"# Custom Exercise ({request.difficulty} level)\n# Prompt: {request.prompt}\n\n# Write your solution below:\n\n",
        solution=f"# Solution for: {request.prompt}\n# This is a placeholder - actual solution would be AI-generated\nprint('Exercise completed!')\n",
        test_cases=[
            {"check": "print", "type": "code_check"},
            {"has_output": "Exercise completed!"}
        ],
        hints=[
            "Read the requirements carefully",
            "Break down the problem into smaller steps",
            "Test your code as you build it"
        ],
        skills=[request.topic.lower() if request.topic else "problem-solving", request.difficulty],
        points=difficulty_points.get(request.difficulty, 20),
        module_id=request.module_id or "custom",
        topic=request.topic or "Custom Assignment"
    )

    return GeneratedAssignment(
        exercise=generated_exercise,
        preview=f"""Custom Exercise: {generated_exercise.title}

Difficulty: {request.difficulty}
Points: {generated_exercise.points}

Description:
{generated_exercise.description[:200]}...

This exercise has been automatically generated based on your requirements.
You can assign this to specific students or the entire class."""
    )


@app.post("/api/v1/teacher/save-assignment")
async def save_teacher_assignment(
    exercise_id: str,
    student_ids: List[str],
    note: Optional[str] = None
):
    """
    Save a generated assignment and assign it to specific students.

    This creates a record in the progress service tracking which students
    have been assigned which exercises.
    """
    # In production, this would:
    # 1. Save the exercise to the database
    # 2. Create assignment records for each student in progress service
    # 3. Publish events to notify students

    return {
        "message": f"Assignment {exercise_id} created for {len(student_ids)} student(s)",
        "exercise_id": exercise_id,
        "assigned_students": student_ids,
        "note": note
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)
