/**
 * AI Chat Page
 * Interactive AI tutoring chat interface
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import StarfieldBackground from '@/components/StarfieldBackground';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI Python tutor. I can help you with:\n\n• Explaining Python concepts\n• Debugging your code\n• Suggesting improvements\n• Answering questions\n\nWhat would you like to learn today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateMockResponse(input),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const generateMockResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    if (input.includes('variable')) {
      return "In Python, a **variable** is like a container that stores data. Here's an example:\n\n```python\nname = 'Alice'\nage = 25\npi = 3.14159\n```\n\nPython automatically determines the type based on the value you assign. Variables can store different types: strings, integers, floats, booleans, lists, and more!\n\nWould you like to try creating some variables?";
    }

    if (input.includes('function')) {
      return "A **function** in Python is a reusable block of code that performs a specific task. Here's how to define one:\n\n```python\ndef greet(name):\n    return f'Hello, {name}!'\n\n# Call the function\nmessage = greet('Alice')\nprint(message)  # Output: Hello, Alice!\n```\n\nFunctions help you organize code and avoid repetition. You can also add parameters and return values.\n\nWant to practice writing a function?";
    }

    if (input.includes('loop') || input.includes('for') || input.includes('while')) {
      return "**Loops** let you repeat code multiple times. Python has two main types:\n\n```python\n# For loop - iterate over a sequence\nfor i in range(5):\n    print(i)  # Prints 0, 1, 2, 3, 4\n\n# While loop - repeat while condition is true\ncount = 0\nwhile count < 5:\n    print(count)\n    count += 1\n```\n\nFor loops are great when you know how many times to iterate. While loops are better when you want to loop until a condition changes.\n\nShall I explain the difference in more detail?";
    }

    if (input.includes('error') || input.includes('debug') || input.includes('help')) {
      return "I'd be happy to help debug your code! Please share:\n\n1. The code that's causing the error\n2. The error message you're seeing\n3. What you expected to happen\n\nCommon Python errors include:\n• **SyntaxError**: Code structure issues\n• **NameError**: Using undefined variables\n• **TypeError**: Wrong data type operations\n• **IndentationError**: Incorrect spacing\n\nPaste your code and I'll help you fix it!";
    }

    return `Great question about "${userInput}"!\n\nI can help you understand this concept better. Could you tell me more about:\n\n1. What specifically confuses you?\n2. Have you tried any examples yet?\n3. Would you like me to provide a code example?\n\nI'm here to make learning Python easy and fun! 🐍`;
  };

  const suggestedQuestions = [
    'What is a variable in Python?',
    'How do I write a function?',
    'Explain for loops',
    'Help me debug my code',
  ];

  return (
    <StarfieldBackground density="low">
      <div className="min-h-screen flex flex-col p-4 md:p-6">
        {/* Header */}
        <div className="max-w-4xl w-full mx-auto mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">AI Python Tutor</h1>
              <p className="text-purple-300 text-sm">Ask me anything about Python!</p>
            </div>
            <button
              onClick={() => setMessages([messages[0]])}
              className="px-4 py-2 bg-gray-800/50 border border-purple-500/20 rounded-lg text-white hover:bg-gray-700/50 transition-all text-sm"
            >
              New Chat
            </button>
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex-1 max-w-4xl w-full mx-auto flex flex-col bg-gray-900/30 backdrop-blur-sm border border-purple-500/20 rounded-xl overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'bg-gray-800/50 text-gray-100 border border-purple-500/20'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="text-xs text-purple-400 mb-2">🤖 AI Tutor</div>
                  )}
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  <div className="text-xs opacity-60 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800/50 rounded-2xl px-4 py-3 border border-purple-500/20">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length === 1 && (
            <div className="p-4 border-t border-purple-500/20">
              <p className="text-sm text-gray-400 mb-3">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInput(question)}
                    className="px-3 py-2 bg-gray-800/50 border border-purple-500/20 rounded-lg text-sm text-gray-300 hover:bg-purple-600/20 hover:border-purple-500/40 transition-all"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-purple-500/20">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me anything about Python..."
                className="flex-1 px-4 py-3 bg-gray-800/50 border border-purple-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50"
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-white shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </StarfieldBackground>
  );
}
