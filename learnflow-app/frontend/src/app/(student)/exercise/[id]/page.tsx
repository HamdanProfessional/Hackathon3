/**
 * Individual Exercise Page
 * Interactive coding exercise with Monaco editor
 */

'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import StarfieldBackground from '@/components/StarfieldBackground';
import MonacoEditor from '@/components/MonacoEditor';
import OutputPanel from '@/components/OutputPanel';

// Mock exercise data (in real app, fetch from API)
const exerciseData: Record<string, any> = {
  '1': {
    id: 1,
    title: 'Hello World',
    description: 'Write your first Python program! Print "Hello, World!" to the console.',
    instructions: `# Your Task

Print "Hello, World!" to the console using the print() function.

## Example
\`\`\`python
print("Hello, World!")
\`\`\``,
    starterCode: '# Write your code here\n',
    expectedOutput: 'Hello, World!',
    hints: ['Use the print() function', 'Don\'t forget the quotes!'],
    xp: 50,
  },
  '2': {
    id: 2,
    title: 'Variables and Types',
    description: 'Create variables of different types and print them.',
    instructions: `# Your Task

Create three variables:
1. A string variable called \`name\`
2. An integer variable called \`age\`
3. A float variable called \`height\`

Print all three variables.

## Example
\`\`\`python
name = "Alice"
age = 25
height = 5.6
print(name)
print(age)
print(height)
\`\`\``,
    starterCode: '# Create your variables here\n\n',
    expectedOutput: '',
    hints: ['Strings use quotes', 'Integers are whole numbers', 'Floats have decimal points'],
    xp: 75,
  },
};

export default function ExerciseDetailPage() {
  const params = useParams();
  const exerciseId = params.id as string;
  const exercise = exerciseData[exerciseId] || exerciseData['1'];

  const [code, setCode] = useState(exercise.starterCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('Running...');

    // Simulate code execution (replace with actual API call)
    setTimeout(() => {
      try {
        // Capture print outputs (mock)
        const lines = code.split('\n').filter(line => line.trim().startsWith('print('));
        if (lines.length > 0) {
          const result = lines
            .map(line => {
              const match = line.match(/print\((.*?)\)/);
              return match ? eval(match[1]) : '';
            })
            .join('\n');
          setOutput(result || 'Code executed successfully!');
        } else {
          setOutput('Code executed successfully! (No output)');
        }
      } catch (error) {
        setOutput(`Error: ${error}`);
      }
      setIsRunning(false);
    }, 1000);
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);

    // Simulate submission check (replace with actual API call)
    setTimeout(() => {
      if (code.includes('print')) {
        setOutput('✅ Exercise completed! +' + exercise.xp + ' XP');
      } else {
        setOutput('❌ Not quite right. Try again!');
      }
      setIsSubmitted(false);
    }, 1500);
  };

  const showNextHint = () => {
    if (currentHintIndex < exercise.hints.length - 1) {
      setCurrentHintIndex(currentHintIndex + 1);
    }
  };

  return (
    <StarfieldBackground density="low">
      <div className="min-h-screen p-4 md:p-6">
        <div className="max-w-7xl mx-auto h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link
                href="/exercise"
                className="p-2 bg-gray-800/50 border border-purple-500/20 rounded-lg text-white hover:bg-gray-700/50 transition-all"
              >
                ←
              </Link>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {exercise.title}
                </h1>
                <p className="text-purple-300 text-sm">{exercise.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-400 font-medium">+{exercise.xp} XP</span>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
            {/* Instructions Panel */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 overflow-y-auto">
              <h2 className="text-xl font-semibold text-white mb-4">Instructions</h2>
              <div className="prose prose-invert max-w-none text-gray-300">
                <div dangerouslySetInnerHTML={{ __html: exercise.instructions.replace(/\n/g, '<br/>').replace(/`/g, '').replace(/#/g, '') }} />
              </div>

              {/* Hints Section */}
              <div className="mt-6 pt-6 border-t border-purple-500/20">
                <button
                  onClick={() => setShowHints(!showHints)}
                  className="text-sm text-purple-400 hover:text-purple-300 mb-3"
                >
                  {showHints ? 'Hide' : 'Show'} Hints 💡
                </button>
                {showHints && (
                  <div className="space-y-2">
                    {exercise.hints.slice(0, currentHintIndex + 1).map((hint: string, idx: number) => (
                      <div key={idx} className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm text-yellow-200">
                        Hint {idx + 1}: {hint}
                      </div>
                    ))}
                    {currentHintIndex < exercise.hints.length - 1 && (
                      <button
                        onClick={showNextHint}
                        className="w-full py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-300 hover:bg-yellow-500/30 transition-all text-sm"
                      >
                        Show Next Hint
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Code Editor Panel */}
            <div className="flex flex-col gap-4 min-h-0">
              {/* Editor */}
              <div className="flex-1 bg-gray-900/50 backdrop-blur-sm border border-purple-500/20 rounded-xl overflow-hidden">
                <div className="bg-gray-800/50 px-4 py-2 border-b border-purple-500/20 flex items-center justify-between">
                  <span className="text-sm text-gray-400">main.py</span>
                  <button
                    onClick={handleRunCode}
                    disabled={isRunning}
                    className="px-4 py-1.5 bg-green-600/20 border border-green-500/30 rounded-lg text-green-400 hover:bg-green-600/30 transition-all text-sm disabled:opacity-50"
                  >
                    {isRunning ? 'Running...' : '▶ Run'}
                  </button>
                </div>
                <div className="h-full min-h-[300px]">
                  <MonacoEditor
                    code={code}
                    onChange={setCode}
                    language="python"
                    height="100%"
                  />
                </div>
              </div>

              {/* Output */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/20 rounded-xl overflow-hidden">
                <div className="bg-gray-800/50 px-4 py-2 border-b border-purple-500/20">
                  <span className="text-sm text-gray-400">Output</span>
                </div>
                <div className="h-32 overflow-y-auto p-4">
                  <OutputPanel output={output} />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitted}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-white shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 disabled:opacity-50 transition-all"
                >
                  {isSubmitted ? 'Submitting...' : 'Submit Solution'}
                </button>
                <button
                  onClick={() => setCode(exercise.starterCode)}
                  className="px-6 py-3 bg-gray-800/50 border border-purple-500/20 rounded-lg text-white hover:bg-gray-700/50 transition-all"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StarfieldBackground>
  );
}
