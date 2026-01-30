#!/usr/bin/env python3
"""
LearnFlow Exercise Database Seeder
Populates PostgreSQL with all Python exercises from basics to libraries
"""

import asyncio
import asyncpg
from datetime import datetime
import json

# Database connection
DATABASE_URL = "postgresql://postgres:learnflow123@learnflow-postgres-postgresql.learnflow.svc.cluster.local:5432/learnflow_db"

# Complete exercise catalog for all 8 modules
EXERCISES = {
    "MODULE_1_BASICS": {
        "module_id": "basics",
        "module_name": "Python Basics",
        "order": 1,
        "description": "Introduction to Python programming basics",
        "topics": ["Variables", "Data Types", "Input/Output", "Operators", "Type Conversion"],
        "exercises": [
            {
                "id": "ex_1_1",
                "title": "Your First Variable",
                "difficulty": "beginner",
                "points": 10,
                "topic": "Variables",
                "problem": "Create a variable called `my_name` and assign your name to it. Then print it.",
                "starter_code": "# Write your code below\n",
                "solution": "my_name = \"YourName\"\nprint(my_name)",
                "test_cases": [{"variable": "my_name", "should_contain": "\"YourName\""}],
                "hints": ["Use the assignment operator (=)", "Variables can hold strings"],
                "skills": ["variables", "print", "strings"]
            },
            {
                "id": "ex_1_2",
                "title": "String Concatenation",
                "difficulty": "beginner",
                "points": 15,
                "topic": "Strings",
                "problem": "Create two string variables, `first_name` and `last_name`. Print them together as a full name.",
                "starter_code": "first_name = \"John\"\nlast_name = \"Doe\"\n# Print full name below",
                "solution": "print(f\"{first_name} {last_name}\")",
                "test_cases": [{"output": "John Doe"}],
                "hints": ["Use f-strings for formatting", "Put a space between names"],
                "skills": ["strings", "f-strings", "print"]
            },
            {
                "id": "ex_1_3",
                "title": "Integer Operations",
                "difficulty": "beginner",
                "points": 20,
                "topic": "Arithmetic Operators",
                "problem": "Create two variables `a = 10` and `b = 3`. Print the sum, difference, product, and quotient.",
                "starter_code": "a = 10\nb = 3\n",
                "solution": "print(f\"Sum: {a + b}\")\nprint(f\"Difference: {a - b}\")\nprint(f\"Product: {a * b}\")\nprint(f\"Quotient: {a / b}\")",
                "test_cases": [{"has_output": "Sum: 13"}],
                "hints": ["+", "addition", "-", "subtraction", "*", "multiplication", "/", "division"],
                "skills": ["operators", "arithmetic", "print"]
            },
            {
                "id": "ex_1_4",
                "title": "Input and Output",
                "difficulty": "beginner",
                "points": 15,
                "topic": "Input/Output",
                "problem": "Ask the user for their favorite color and print a message saying \"That's a great color!\"",
                "starter_code": "# Get user input\n",
                "solution": "color = input(\"What is your favorite color? \")\nprint(f\"That's a great color, {color}!\")",
                "test_cases": [{"requires_input": True}],
                "hints": ["Use the input() function", "f-strings for variable interpolation"],
                "skills": ["input", "f-strings", "print"]
            },
            {
                "id": "ex_1_5",
                "title": "Type Conversion",
                "difficulty": "beginner",
                "points": 20,
                "topic": "Type Conversion",
                "problem": "Convert the string \"42\" to an integer and multiply by 2. Print the result.",
                "starter_code": "number_str = \"42\"\n",
                "solution": "number = int(number_str)\nprint(number * 2)",
                "test_cases": [{"output": "84"}],
                "hints": ["Use int() to convert string to integer", "Type conversion is explicit"],
                "skills": ["type-conversion", "int", "arithmetic"]
            }
        ]
    },
    "MODULE_2_CONTROL_FLOW": {
        "module_id": "control_flow",
        "module_name": "Control Flow",
        "order": 2,
        "description": "Conditional statements, loops, and flow control",
        "topics": ["Conditionals", "For Loops", "While Loops", "Break/Continue"],
        "exercises": [
            {
                "id": "ex_2_1",
                "title": "If-Else Statement",
                "difficulty": "beginner",
                "points": 15,
                "topic": "Conditionals",
                "problem": "Write a program that checks if a number is positive or negative and prints an appropriate message.",
                "starter_code": "number = 5\n# Add your code below",
                "solution": "if number > 0:\n    print(\"The number is positive\")\nelse:\n    print(\"The number is negative\")",
                "test_cases": [{"number": 5, "output": "positive"}, {"number": -3, "output": "negative"}],
                "hints": ["Use if-else structure", "The > operator checks if positive"],
                "skills": ["if-else", "comparison operators", "print"]
            },
            {
                "id": "ex_2_2",
                "title": "Even or Odd",
                "difficulty": "beginner",
                "points": 20,
                "topic": "Conditionals",
                "problem": "Check if a number is even or odd using the modulo operator (%).",
                "starter_code": "num = 7\n",
                "solution": "if num % 2 == 0:\n    print(f\"{num} is even\")\nelse:\n    print(f\"{num} is odd\")",
                "test_cases": [{"num": 4, "output": "even"}, {"num": 7, "output": "odd"}],
                "hints": ["Modulo % returns remainder", "Even numbers have remainder 0"],
                "skills": ["modulo", "conditionals", "if-else"]
            },
            {
                "id": "ex_2_3",
                "title": "For Loop Sum",
                "difficulty": "beginner",
                "points": 25,
                "topic": "For Loops",
                "problem": "Calculate the sum of numbers from 1 to 10 using a for loop.",
                "starter_code": "# Calculate sum\n",
                "solution": "total = 0\nfor i in range(1, 11):\n    total += i\nprint(f\"Sum: {total}\")",
                "test_cases": [{"output": "Sum: 55"}],
                "hints": ["range(1, 11) goes from 1 to 10", "Use += to add to accumulator"],
                "skills": ["for-loop", "range", "arithmetic"]
            },
            {
                "id": "ex_2_4",
                "title": "While Loop Counter",
                "difficulty": "intermediate",
                "points": 30,
                "topic": "While Loops",
                "problem": "Use a while loop to count down from 5 to 1.",
                "starter_code": "count = 5\n",
                "solution": "while count > 0:\n    print(count)\n    count -= 1",
                "test_cases": [{"output": "5\\n4\\n3\\n2\\n1"}],
                "hints": ["Decrement the counter", "While condition checks before loop body"],
                "skills": ["while-loop", "decrement", "comparison"]
            },
            {
                "id": "ex_2_5",
                "title": "Break Statement",
                "difficulty": "intermediate",
                "points": 25,
                "topic": "Break/Continue",
                "problem": "Loop through numbers 1-10, but break when you reach 5.",
                "starter_code": "for i in range(1, 11):\n    # Add break logic\n    print(i)",
                "solution": "for i in range(1, 11):\n    if i == 5:\n        break\n    print(i)",
                "test_cases": [{"output": "1\\n2\\n3\\n4"}],
                "hints": ["break exits the loop immediately", "Place break condition before print"],
                "skills": ["for-loop", "break"]
            },
            {
                "id": "ex_2_6",
                "title": "Continue Statement",
                "difficulty": "intermediate",
                "points": 25,
                "topic": "Break/Continue",
                "problem": "Print all odd numbers from 1-10. Use continue to skip even numbers.",
                "starter_code": "for i in range(1, 11):\n    # Skip evens here\n    print(i)",
                "solution": "for i in range(1, 11):\n    if i % 2 == 0:\n        continue\n    print(i)",
                "test_cases": [{"output": "1\\n3\\n5\\n7\\n9"}],
                "hints": ["continue skips to next iteration", "Modulo 2 identifies even numbers"],
                "skills": ["for-loop", "continue", "modulo"]
            }
        ]
    },
    "MODULE_3_DATA_STRUCTURES": {
        "module_id": "data_structures",
        "module_name": "Data Structures",
        "order": 3,
        "description": "Lists, tuples, dictionaries, and sets",
        "topics": ["Lists", "Tuples", "Dictionaries", "Sets"],
        "exercises": [
            {
                "id": "ex_3_1",
                "title": "List Operations",
                "difficulty": "beginner",
                "points": 20,
                "topic": "Lists",
                "problem": "Create a list of 5 fruits. Add \"mango\" at the end and remove the first item.",
                "starter_code": "fruits = [\"apple\", \"banana\", \"cherry\", \"date\", \"elderberry\"]\n",
                "solution": "fruits.append(\"mango\")\nfruits.pop(0)\nprint(f\"Updated list: {fruits}\")",
                "test_cases": [{"list_length": 5, "first": "banana", "last": "mango"}],
                "hints": [".append() adds to end", ".pop(0) removes first element"],
                "skills": ["lists", "append", "pop"]
            },
            {
                "id": "ex_3_2",
                "title": "Tuple Immutability",
                "difficulty": "beginner",
                "points": 15,
                "topic": "Tuples",
                "problem": "Try to modify a tuple and explain why it doesn't work.",
                "starter_code": "coordinates = (10, 20)\n# Try to change the first value\ncoordinates[0] = 15",
                "solution": "# Tuples are immutable - cannot be changed\nprint(\"Tuples cannot be modified after creation\")",
                "test_cases": [{"error": "TypeError"}],
                "hints": ["Tuples use parentheses ()", "Tuples are immutable"],
                "skills": ["tuples", "immutability"]
            },
            {
                "id": "ex_3_3",
                "title": "Dictionary Access",
                "difficulty": "beginner",
                "points": 25,
                "topic": "Dictionaries",
                "problem": "Given a person dictionary, print their age using the key \"age\".",
                "starter_code": "person = {\"name\": \"Alice\", \"age\": 30, \"city\": \"NYC\"}\n",
                "solution": "print(f\"Age: {person['age']}\")",
                "test_cases": [{"output": "Age: 30"}],
                "hints": ["Access with ['key'] or .get() method", "Keys are strings in quotes"],
                "skills": ["dictionaries", "key-access"]
            },
            {
                "id": "ex_3_4",
                "title": "Set Operations",
                "difficulty": "intermediate",
                "points": 30,
                "topic": "Sets",
                "problem": "Create two sets of numbers and find their union and intersection.",
                "starter_code": "set1 = {1, 2, 3, 4, 5}\nset2 = {4, 5, 6, 7, 8}\n",
                "solution": "print(f\"Union: {set1 | set2}\")\nprint(f\"Intersection: {set1 & set2}\")",
                "test_cases": [{"union": "{1, 2, 3, 4, 5, 6, 7, 8}", "intersection": "{4, 5}"}],
                "hints": ["| is union operator", "& is intersection"],
                "skills": ["sets", "union", "intersection"]
            },
            {
                "id": "ex_3_5",
                "title": "Dictionary Loop",
                "difficulty": "intermediate",
                "points": 25,
                "topic": "Dictionaries",
                "problem": "Print all keys and values from a dictionary using a loop.",
                "starter_code": "scores = {\"Alice\": 85, \"Bob\": 92, \"Charlie\": 78}\n",
                "solution": "for name, score in scores.items():\n    print(f\"{name}: {score}\")",
                "test_cases": [{"has": "Alice: 85"}],
                "hints": [".items() returns key-value pairs", "for key, value in dict"],
                "skills": ["dictionaries", "loops", "items"]
            }
        ]
    },
    "MODULE_4_FUNCTIONS": {
        "module_id": "functions",
        "module_name": "Functions",
        "order": 4,
        "description": "Creating functions, parameters, return values",
        "topics": ["Defining Functions", "Parameters", "Return Values", "Scope"],
        "exercises": [
            {
                "id": "ex_4_1",
                "title": "Simple Function",
                "difficulty": "beginner",
                "points": 20,
                "topic": "Defining Functions",
                "problem": "Define a function called `greet` that takes a name parameter and prints a greeting.",
                "starter_code": "# Define your function below\n",
                "solution": "def greet(name):\n    return f\"Hello, {name}!\"\n\nprint(greet(\"Alice\"))",
                "test_cases": [{"output": "Hello, Alice!"}],
                "hints": ["Use def keyword", "Functions need () to call"],
                "skills": ["functions", "def", "parameters"]
            },
            {
                "id": "ex_4_2",
                "title": "Default Parameters",
                "difficulty": "intermediate",
                "points": 25,
                "topic": "Parameters",
                "problem": "Create a function that calculates rectangle area. Default width=10, height=5.",
                "starter_code": "# Function with defaults\n",
                "solution": "def rectangle_area(width=10, height=5):\n    return width * height\n\nprint(rectangle_area())\nprint(rectangle_area(15))",
                "test_cases": [50, 75],
                "hints": ["Default parameters in function definition", "Can override defaults when calling"],
                "skills": ["functions", "default-parameters", "return"]
            },
            {
                "id": "ex_4_3",
                "title": "Return Values",
                "difficulty": "intermediate",
                "points": 30,
                "topic": "Return Values",
                "problem": "Write a function that takes a list and returns the sum of all elements.",
                "starter_code": "def calculate_sum(numbers):\n    # Add logic here\n",
                "solution": "def calculate_sum(numbers):\n    return sum(numbers)\n\nresult = calculate_sum([1, 2, 3, 4, 5])\nprint(f\"Sum: {result}\")",
                "test_cases": [{"sum": 15}],
                "hints": ["Use built-in sum() function", "Return without printing"],
                "skills": ["functions", "return", "list-operations"]
            },
            {
                "id": "ex_4_4",
                "title": "Scope Challenge",
                "difficulty": "intermediate",
                "points": 30,
                "topic": "Scope",
                "problem": "Predict the output of this code:\n\ncount = 5\n\ndef increment():\n    count += 1\n    return count\n\nincrement()\nprint(count)",
                "starter_code": "",
                "solution": "The output is 5. The `count` variable outside is unchanged because Python looks for `count` in local scope first, but the function doesn't modify the global variable without `global` keyword.\n\nAnswer: 5",
                "test_cases": [{"output": "5"}],
                "hints": ["Python uses LEGB rule - Local, Enclosing, Global, Built-in", "Functions create local scope"],
                "skills": ["scope", "local-vs-global", "LEGB"]
            }
        ]
    },
    "MODULE_5_OOP": {
        "module_id": "oop",
        "module_name": "Object-Oriented Programming",
        "order": 5,
        "description": "Classes, objects, inheritance, and encapsulation",
        "topics": ["Classes & Objects", "Attributes & Methods", "Inheritance", "Encapsulation"],
        "exercises": [
            {
                "id": "ex_5_1",
                "title": "Your First Class",
                "difficulty": "beginner",
                "points": 25,
                "topic": "Classes & Objects",
                "problem": "Create a `Dog` class with `name` and `breed` attributes. Add a `bark()` method.",
                "starter_code": "class Dog:\n    # Add attributes here\n    \n    def bark(self):\n        return \"Woof!\"",
                "solution": "class Dog:\n    def __init__(self, name, breed):\n        self.name = name\n        self.breed = breed\n    \n    def bark(self):\n        return f\"{self.name} says: Woof!\"\n\ndog = Dog(\"Buddy\", \"Golden Retriever\")\nprint(dog.bark())",
                "test_cases": [{"output": "Buddy says: Woof!"}],
                "hints": ["__init__ is the constructor", "self refers to the instance"],
                "skills": ["classes", "__init__", "attributes", "methods"]
            },
            {
                "id": "ex_5_2",
                "title": "Class Methods",
                "difficulty": "beginner",
                "points": 30,
                "topic": "Methods",
                "problem": "Add a method to the `BankAccount` class to withdraw funds (with balance check).",
                "starter_code": "class BankAccount:\n    def __init__(self, balance):\n        self.balance = balance\n\n    # Add withdraw method here\n",
                "solution": "class BankAccount:\n    def __init__(self, balance):\n        self.balance = balance\n    \n    def withdraw(self, amount):\n        if self.balance >= amount:\n            self.balance -= amount\n            return True\n        return False",
                "test_cases": [{"withdraw": 50, "balance": 50}, {"withdraw": 100, "balance": 50}],
                "hints": ["Check if balance is sufficient", "Update balance after withdrawal"],
                "skills": ["classes", "methods", "validation"]
            },
            {
                "id": "ex_5_3",
                "title": "Inheritance",
                "difficulty": "intermediate",
                "points": 30,
                "topic": "Inheritance",
                "problem": "Create a `Student` class that inherits from a `Person` class and adds a `grade` attribute.",
                "starter_code": "class Person:\n    def __init__(self, name):\n        self.name = name\n\n# Create Student class here",
                "solution": "class Student(Person):\n    def __init__(self, name, grade):\n        super().__init__(name)\n        self.grade = grade\n\nstudent = Student(\"Alice\", \"A\")\nprint(f\"{student.name}: {student.grade}\")",
                "test_cases": [{"output": "Alice: A"}],
                "hints": ["Use super().__init__() to call parent constructor", "Child inherits from Parent"],
                "skills": ["inheritance", "super()", "classes"]
            },
            {
                "id": "ex_5_4",
                "title": "Encapsulation",
                "difficulty": "intermediate",
                "points": 25,
                "topic": "Encapsulation",
                "problem": "Make the `balance` attribute private and add a getter method.",
                "starter_code": "class BankAccount:\n    def __init__(self, balance):\n        self.balance = balance",
                "solution": "class BankAccount:\n    def __init__(self, balance):\n        self.__balance = balance\n    \n    def get_balance(self):\n        return self.__balance\n\naccount = BankAccount(100)\nprint(account.get_balance())",
                "test_cases": [{"output": 100}],
                "hints": ["Double underscore __ makes it private", "Getter methods provide controlled access"],
                "skills": ["encapsulation", "private-attributes", "getters"]
            }
        ]
    },
    "MODULE_6_FILES": {
        "module_id": "files",
        "module_name": "File Handling",
        "order": 6,
        "description": "Reading, writing, CSV, and JSON handling",
        "topics": ["Reading/Writing Files", "CSV Processing", "JSON Handling"],
        "exercises": [
            {
                "id": "ex_6_1",
                "title": "Write to File",
                "difficulty": "beginner",
                "points": 20,
                "topic": "Writing Files",
                "problem": "Write the text \"Hello, World!\" to a file called `greeting.txt`.",
                "starter_code": "# Write code to create file\n",
                "solution": "with open(\"greeting.txt\", \"w\") as file:\n    file.write(\"Hello, World!\")",
                "test_cases": [{"file_content": "Hello, World!"}],
                "hints": ["\"w\" mode for writing", "with statement automatically closes file"],
                "skills": ["file-write", "with-context-manager", "open"]
            },
            {
                "id": "ex_6_2",
                "title": "Read from File",
                "difficulty": "beginner",
                "points": 20,
                "topic": "Reading Files",
                "problem": "Read the contents of `greeting.txt` and print it.",
                "starter_code": "# Read file contents\n",
                "solution": "with open(\"greeting.txt\", \"r\") as file:\n    content = file.read()\n    print(content)",
                "test_cases": [{"content": "Hello, World!"}],
                "hints": ["\"r\" mode for reading", "read() returns entire file content"],
                "skills": ["file-read", "open", "read"]
            },
            {
                "id": "ex_6_3",
                "title": "CSV Processing",
                "difficulty": "intermediate",
                "points": 30,
                "topic": "CSV Processing",
                "problem": "Parse a CSV line \"apple,red,sweet,3.99\" and print the fruit name and price.",
                "starter_code": "csv_line = \"apple,red,sweet,3.99\"\n",
                "solution": "parts = csv_line.split(\",\")\nfruit = parts[0]\nprice = parts[3]\nprint(f\"{fruit}: ${price}\")",
                "test_cases": [{"fruit": "apple", "price": "3.99"}],
                "hints": [".split(',') separates by comma", "Indexing starts at 0"],
                "skills": ["csv", "split", "indexing"]
            },
            {
                "id": "ex_6_4",
                "title": "JSON Handling",
                "difficulty": "intermediate",
                "points": 30,
                "topic": "JSON Handling",
                "problem": "Parse the JSON string '{\"name\": \"Alice\", \"age\": 30}' and access the age field.",
                "starter_code": "import json\n\ndata = '{\"name\": \"Alice\", \"age\": 30}'",
                "solution": "import json\n\ndata = '{\"name\": \"Alice\", \"age\": 30}'\nuser = json.loads(data)\nprint(user['age'])",
                "test_cases": [{"age": 30}],
                "hints": ["json.loads() parses JSON string", "Access dict values with ['key']"],
                "skills": ["json", "json.loads", "dictionary-access"]
            }
        ]
    },
    "MODULE_7_ERRORS": {
        "module_id": "errors",
        "module_name": "Error Handling",
        "order": 7,
        "description": "Try/Except, exception types, custom exceptions",
        "topics": ["Try/Except", "Exception Types", "Custom Exceptions", "Debugging"],
        "exercises": [
            {
                "id": "ex_7_1",
                "title": "Basic Try-Except",
                "difficulty": "beginner",
                "points": 25,
                "topic": "Try/Except",
                "problem": "Wrap division in a try-except block to handle ZeroDivisionError.",
                "starter_code": "numerator = 10\ndenominator = 0",
                "solution": "try:\n    result = numerator / denominator\n    print(f\"Result: {result}\")\nexcept ZeroDivisionError:\n    print(\"Cannot divide by zero!\")",
                "test_cases": [{"output": "Cannot divide by zero!"}],
                "hints": ["ZeroDivisionError raised when dividing by zero", "except block catches the error"],
                "skills": ["try-except", "exception-handling", "ZeroDivisionError"]
            },
            {
                "id": "ex_7_2",
                "title": "Multiple Exceptions",
                "difficulty": "intermediate",
                "points": 30,
                "topic": "Exception Types",
                "problem": "Handle both ValueError and KeyError when accessing dictionary data.",
                "starter_code": "data = {\"name\": \"Bob\"}\n\n# Try to access age and city keys",
                "solution": "try:\n    age = data['age']\n    print(f\"Age: {age}\")\nexcept KeyError as e:\n    print(f\"Missing key: {e}\")\n\ntry:\n    city = data['city']\n    print(f\"City: {city}\")\nexcept KeyError as e:\n    print(f\"Missing key: {e}\")",
                "test_cases": [{"output": "Missing key: 'city'"}],
                "hints": ["Catch KeyError for missing keys", "Different exceptions for different missing keys"],
                "skills": ["try-except", "KeyError", "multiple-exceptions"]
            },
            {
                "id": "ex_7_3",
                "title": "Custom Exception",
                "difficulty": "intermediate",
                "points": 30,
                "topic": "Custom Exceptions",
                "problem": "Create a custom exception `InvalidAgeError` and raise it if age < 0 or age > 120.",
                "starter_code": "# Define custom exception and validate function",
                "solution": "class InvalidAgeError(Exception):\n    pass\n\ndef validate_age(age):\n    if age < 0 or age > 120:\n        raise InvalidAgeError(f\"Invalid age: {age}\")\n    return True\n\ntry:\n    validate_age(-5)\nexcept InvalidAgeError as e:\n    print(f\"Error: {e}\")",
                "test_cases": [{"error": "Invalid age: -5"}],
                "hints": ["Custom exceptions inherit from Exception", "raise keyword triggers the exception"],
                "skills": ["custom-exceptions", "raise", "exception-inheritance"]
            },
            {
                "id": "ex_7_4",
                "title": "Finally Block",
                "difficulty": "intermediate",
                "points": 25,
                "topic": "Try/Except/Else",
                "problem": "Open a file in try block, print \"Success!\" in except block, and \"Done\" in finally block.",
                "starter_code": "# File operations with try-except-finally",
                "solution": "try:\n    file = open(\"data.txt\", \"r\")\n    content = file.read()\nexcept FileNotFoundError:\n    print(\"Success!\")\nfinally:\n    print(\"Done\")",
                "test_cases": [{"has": "Done"}],
                "hints": ["finally block always executes", "Use for cleanup operations"],
                "skills": ["try-except-finally", "FileNotFoundError", "finally"]
            }
        ]
    },
    "MODULE_8_LIBRARIES": {
        "module_id": "libraries",
        "module_name": "Libraries & External Packages",
        "order": 8,
        "description": "Installing packages, working with APIs, virtual environments",
        "topics": ["Installing Packages", "Working with APIs", "Virtual Environments"],
        "exercises": [
            {
                "id": "ex_8_1",
                "title": "Install a Package",
                "difficulty": "beginner",
                "points": 20,
                "topic": "Installing Packages",
                "problem": "Write a command to install the `requests` package using pip.",
                "starter_code": "# Write pip command\n",
                "solution": "# Using pip\npip install requests",
                "test_cases": [{"command": "pip install requests"}],
                "hints": ["pip is Python's package installer", "Specify package name"],
                "skills": ["pip", "package-installation", "terminal"]
            },
            {
                "id": "ex_8_2",
                "title": "Import and Use Module",
                "difficulty": "beginner",
                "points": 25,
                "topic": "Using Libraries",
                "problem": "Import the `random` module and use `randint()` to generate a random number between 1-100.",
                "starter_code": "# Import random module\n",
                "solution": "import random\n\nnumber = random.randint(1, 100)\nprint(f\"Random number: {number}\")",
                "test_cases": [{"range": "1-100"}],
                "hints": ["random.randint(start, end) is inclusive", "Module import needed"],
                "skills": ["import", "random", "random-int"]
            },
            {
                "id": "ex_8_3",
                "title": "API Request",
                "difficulty": "intermediate",
                "points": 30,
                "topic": "Working with APIs",
                "problem": "Use the `requests` library to fetch data from https://api.github.com/users.",
                "starter_code": "import requests\n\n# Fetch user data from GitHub API",
                "solution": "import requests\n\nresponse = requests.get(\"https://api.github.com/users\")\nif response.status_code == 200:\n    print(f\"Status: {response.status_code}\")\n    users = response.json()\n    print(f\"Found {len(users)} users\")",
                "test_cases": [{"check": "status_code"}],
                "hints": ["requests.get() fetches URLs", "Check status_code before parsing"],
                "skills": ["requests", "http", "api", "json"]
            },
            {
                "id": "ex_8_4",
                "title": "Virtual Environment",
                "difficulty": "intermediate",
                "points": 25,
                "topic": "Virtual Environments",
                "problem": "Create a virtual environment called `myenv` and activate it.",
                "starter_code": "# Commands to create and activate\n",
                "solution": "# Create venv\npython -m venv myenv\n\n# Activate (Windows)\nmyenv\\Scripts\\activate\n\n# Activate (Linux/Mac)\nsource myenv/bin/activate",
                "test_cases": [{"command": "python -m venv myenv"}],
                "hints": ["python -m venv creates venv", "Activation depends on OS"],
                "skills": ["virtualenv", "environment-setup", "activation"]
            }
        ]
    }
}

async def seed_exercises():
    """Seed the database with all exercises"""

    # Connect to database
    conn = await asyncpg.connect(DATABASE_URL)

    try:
        async with conn.transaction():
            # Create tables
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS modules (
                    id VARCHAR(50) PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    description TEXT,
                    display_order INTEGER NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TABLE IF NOT EXISTS exercise_topics (
                    id VARCHAR(50) PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    module_id VARCHAR(50) REFERENCES modules(id),
                    display_order INTEGER NOT NULL
                );

                CREATE TABLE IF NOT EXISTS exercises (
                    id VARCHAR(50) PRIMARY KEY,
                    title VARCHAR(200) NOT NULL,
                    description TEXT,
                    difficulty VARCHAR(20) NOT NULL,
                    points INTEGER NOT NULL,
                    topic_id VARCHAR(50) REFERENCES exercise_topics(id),
                    module_id VARCHAR(50) REFERENCES modules(id),
                    starter_code TEXT,
                    solution TEXT,
                    test_cases JSONB,
                    hints TEXT[],
                    skills TEXT[],
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TABLE IF NOT EXISTS user_progress (
                    id SERIAL PRIMARY KEY,
                    user_id VARCHAR(100) NOT NULL,
                    exercise_id VARCHAR(50) REFERENCES exercises(id),
                    completed BOOLEAN DEFAULT FALSE,
                    attempts INTEGER DEFAULT 0,
                    last_attempt_at TIMESTAMP,
                    score INTEGER,
                    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE(user_id, exercise_id)
                );
            """)

            # Clear existing data
            await conn.execute("DELETE FROM user_progress;")
            await conn.execute("DELETE FROM exercises;")
            await conn.execute("DELETE FROM exercise_topics;")
            await conn.execute("DELETE FROM modules;")

            # Insert all modules and exercises
            for module_key, module_data in EXERCISES.items():
                # Insert module
                await conn.execute(
                    "INSERT INTO modules (id, name, description, display_order) VALUES ($1, $2, $3, $4)",
                    module_data["module_id"],
                    module_data["module_name"],
                    module_data["description"],
                    module_data["order"]
                )

                # Insert topics for this module
                for topic_idx, topic_name in enumerate(module_data["topics"]):
                    topic_id = f"{module_data['module_id']}_{topic_idx}"
                    await conn.execute(
                        "INSERT INTO exercise_topics (id, name, module_id, display_order) VALUES ($1, $2, $3, $4)",
                        topic_id,
                        topic_name,
                        module_data["module_id"],
                        topic_idx
                    )

                # Insert exercises for this module
                for exercise in module_data["exercises"]:
                    # Get the topic_id for this exercise
                    topic_id = f"{module_data['module_id']}_{module_data['topics'].index(exercise['topic'])}"

                    await conn.execute(
                        """
                        INSERT INTO exercises (
                            id, title, description, difficulty, points, topic_id,
                            module_id, starter_code, solution, test_cases, hints, skills
                        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                        """,
                        exercise["id"],
                        exercise["title"],
                        exercise["description"],
                        exercise["difficulty"],
                        exercise["points"],
                        topic_id,
                        module_data["module_id"],
                        exercise["starter_code"],
                        exercise["solution"],
                        json.dumps(exercise.get("test_cases", [])),
                        exercise.get("hints", []),
                        json.dumps(exercise.get("skills", []))
                    )

            print("✅ Database seeded successfully!")
            print("\n📊 Summary:")
            print(f"   - {len(EXERCISES)} modules")
            print(f"   - Total exercises: {sum(len(m['exercises']) for m in EXERCISES.values())}")

            # Print first few exercises per module
            print("\n📝 Module Breakdown:")
            for module_key, module_data in EXERCISES.items():
                print(f"\n   {module_data['module_name']}:")
                for exercise in module_data["exercises"]:
                    print(f"      - {exercise['title']} ({exercise['difficulty']}) - {exercise['points']} pts")

            await conn.commit()

    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        raise
    finally:
        await conn.close()

if __name__ == "__main__":
    asyncio.run(seed_exercises())
