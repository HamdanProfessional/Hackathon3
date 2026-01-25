import { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ChatRequest {
  message: string;
  conversationId?: string;
  context?: {
    currentExercise?: string;
    currentModule?: string;
    codeSnippet?: string;
    errorContext?: string;
  };
  history?: Array<{ role: string; content: string }>;
}

// Mock responses for demonstration
const mockResponses: Record<string, string> = {
  variable: `# Variables in Python

A variable is a container for storing data values. In Python, you don't need to declare variables explicitly - just assign a value.

**Example:**
\`\`\`python
name = "Alice"
age = 25
height = 5.6
is_student = True
\`\`\`

**Key Points:**
- Python is dynamically typed
- Variable names should be descriptive
- Variables can hold any data type
- Use snake_case for multi-word names`,

  'for loop': `# For Loops in Python

A for loop is used to iterate over a sequence (list, tuple, string, etc.).

**Example:**
\`\`\`python
# Iterate over a list
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

# Using range()
for i in range(5):
    print(i)  # Prints 0, 1, 2, 3, 4
\`\`\`

**Key Points:**
- Use \`for item in sequence\` syntax
- \`range()\` generates a sequence of numbers
- Indentation is crucial in Python!`,

  function: `# Functions in Python

A function is a reusable block of code that performs a specific task.

**Example:**
\`\`\`python
def greet(name):
    return f"Hello, {name}!"

# Calling the function
message = greet("Alice")
print(message)  # Output: Hello, Alice!
\`\`\`

**Key Points:**
- Use \`def\` keyword to define functions
- Parameters are inputs, return values are outputs
- Functions help organize and reuse code
- Use descriptive names for functions

**Best Practice:**
\`\`\`python
def calculate_area(length: float, width: float) -> float:
    """Calculate the area of a rectangle."""
    return length * width
\`\`\``,

  default: `That's a great question about Python! Let me help you understand this concept.

Python is a versatile programming language known for its clean syntax and readability. Here are some key tips for learning Python:

1. **Practice regularly** - Coding is a skill that improves with practice
2. **Start with basics** - Master variables, data types, and control flow first
3. **Build projects** - Apply what you learn to real projects
4. **Use the debugger** - When stuck, use print statements or a debugger
5. **Read documentation** - Python has excellent documentation

Is there a specific Python topic you'd like to explore further?`,
};

export async function POST(request: NextRequest) {
  const body: ChatRequest = await request.json();
  const { message } = body;

  // Create a streaming response
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Determine which response to use based on keywords
        const lowerMessage = message.toLowerCase();
        let response = mockResponses.default;

        if (lowerMessage.includes('variable')) {
          response = mockResponses.variable;
        } else if (lowerMessage.includes('for') || lowerMessage.includes('loop')) {
          response = mockResponses['for loop'];
        } else if (lowerMessage.includes('function')) {
          response = mockResponses.function;
        }

        // Simulate streaming by sending chunks
        const words = response.split(' ');
        const chunkSize = 3; // Send 3 words at a time

        for (let i = 0; i < words.length; i += chunkSize) {
          const chunk = words.slice(i, i + chunkSize).join(' ') + ' ';
          const data = JSON.stringify({ chunk, done: false });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));

          // Simulate network delay
          await new Promise((resolve) => setTimeout(resolve, 50));
        }

        // Send done signal
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      } catch (error) {
        controller.error(error);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
