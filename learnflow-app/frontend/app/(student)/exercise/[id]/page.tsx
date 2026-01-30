'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCodeStore } from '@/stores/codeStore';
import { useUserStore } from '@/stores/userStore';
import { api } from '@/lib/api';
import EditorPanel from '@/components/EditorPanel';
import OutputPanel from '@/components/OutputPanel';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, Loader2, Lightbulb } from 'lucide-react';
import type { Exercise } from '@/types';

// Mock exercise data
const mockExercises: Record<string, Exercise> = {
  '1': {
    id: '1',
    title: 'Hello World',
    description: 'Write a program that prints "Hello, World!" to the console.',
    difficulty: 'easy',
    moduleId: 'python-basics',
    instructions: `# Hello World Exercise

In this exercise, you'll write your first Python program!

**Task:**
1. Use the \`print()\` function to display "Hello, World!"
2. Run your code to see the output

**Hint:**
The syntax is: \`print("Hello, World!")\``,
    starterCode: '# Write your code here\nprint("Hello, World!")',
    hints: [
      'Use the print() function to display text',
      'Remember to put your text inside quotes',
      'Press Run to execute your code',
    ],
    timeLimit: 300,
  },
  '2': {
    id: '2',
    title: 'Variables and Data Types',
    description: 'Learn about variables, strings, integers, and floats',
    difficulty: 'easy',
    moduleId: 'python-basics',
    instructions: `# Variables and Data Types

Learn to store and use data in Python.

**Task:**
1. Create a variable named \`name\` and assign your name to it
2. Create a variable named \`age\` and assign your age to it
3. Print both variables

**Example:**
\`\`\`python
name = "Alice"
age = 25
print(name)
print(age)
\`\`\``,
    starterCode: '# Create your variables here\n\n',
    hints: [
      'Use the assignment operator (=) to create variables',
      'Strings need quotes, numbers do not',
      'Use print() to display values',
    ],
    timeLimit: 300,
  },
  '3': {
    id: '3',
    title: 'Basic Arithmetic',
    description: 'Practice mathematical operations in Python',
    difficulty: 'easy',
    moduleId: 'python-basics',
    instructions: `# Basic Arithmetic

Practice math operations in Python.

**Task:**
1. Add two numbers: 15 + 27
2. Multiply: 6 * 7
3. Calculate the remainder of 17 divided by 5

**Operators:**
- \`+\` Addition
- \`-\` Subtraction
- \`*\` Multiplication
- \`/\` Division
- \`%\` Modulo (remainder)`,
    starterCode: '# Try the arithmetic operations\n\n',
    hints: [
      'Use + for addition',
      'Use * for multiplication',
      'Use % for remainder',
    ],
    timeLimit: 300,
  },
};

export default function ExercisePage() {
  const params = useParams();
  const router = useRouter();
  const { setExerciseId, setExerciseTitle, resetCode, code, runCode, isRunning } = useCodeStore();
  const user = useUserStore((state) => state.user);

  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [hintIndex, setHintIndex] = useState(0);
  const [showHintCard, setShowHintCard] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string; score?: number } | null>(null);

  useEffect(() => {
    const loadExercise = async () => {
      const exerciseId = params.id as string;

      // Try to fetch from API
      const response = await api.getExercise(exerciseId);

      if (response.success && response.data) {
        setExercise(response.data);
        setExerciseId(response.data.id);
        setExerciseTitle(response.data.title);
        if (response.data.starterCode) {
          resetCode(response.data.starterCode);
        }
      } else {
        // Use mock data for fallback
        const mockExercise = mockExercises[exerciseId];
        if (mockExercise) {
          setExercise(mockExercise);
          setExerciseId(mockExercise.id);
          setExerciseTitle(mockExercise.title);
          resetCode(mockExercise.starterCode);
        }
      }

      setLoading(false);
    };

    loadExercise();
  }, [params.id]);

  // Load saved code from localStorage on mount
  useEffect(() => {
    if (exercise) {
      try {
        const savedCode = localStorage.getItem('learnflow_code');
        if (savedCode && savedCode.trim()) {
          resetCode(savedCode);
        }
      } catch (e) {
        // Ignore localStorage errors
      }
    }
  }, [exercise]);

  const handleRun = async () => {
    setSubmitResult(null);
    await runCode();
  };

  const handleSubmit = async () => {
    if (!exercise || !code?.trim()) return;

    setSubmitResult(null);

    // Get student ID from user context
    const studentId = user?.studentId || user?.id || 'default-student';

    const response = await api.submitExercise({
      exerciseId: exercise.id,
      code,
      studentId,
      submittedAt: new Date().toISOString(),
    });

    if (response.success && response.data) {
      if (response.data.success) {
        setSubmitResult({
          success: true,
          message: `Great job! Your code passed all tests! Score: ${response.data.score || 100}%`,
          score: response.data.score || 100,
        });
      } else {
        setSubmitResult({
          success: false,
          message: `Not quite right. ${response.data.feedback || 'Keep trying!'}`,
        });
      }
    } else {
      setSubmitResult({
        success: false,
        message: response.error || 'Failed to submit exercise',
      });
    }
  };

  const handleHint = () => {
    if (exercise && hintIndex < exercise.hints.length) {
      setShowHintCard(true);
      setHintIndex(hintIndex + 1);
    }
  };

  const closeHintCard = () => {
    setShowHintCard(false);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading exercise...</p>
        </div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Card className="p-8 text-center shadow-elevated max-w-md">
          <p className="text-muted-foreground mb-4">Exercise not found</p>
          <Button onClick={() => router.push('/modules')}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Modules
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/80 backdrop-blur-sm px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => router.push('/modules')}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-gradient">{exercise.title}</h1>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  exercise.difficulty === 'easy'
                    ? 'bg-success/20 text-success border border-success/30'
                    : exercise.difficulty === 'medium'
                    ? 'bg-warning/20 text-warning border border-warning/30'
                    : 'bg-destructive/20 text-destructive border border-destructive/30'
                }`}>
                  {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{exercise.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Instructions Panel */}
        <div className="w-full md:w-1/3 overflow-auto border-r border-border bg-card/50 backdrop-blur-sm p-4 md:p-6 order-2 md:order-1">
          <h2 className="mb-4 text-lg font-semibold text-foreground flex items-center gap-2">
            <svg className="h-5 w-5 text-cosmic-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.5a2 2 0 012 2v14a2 2 0 01-2 2h-3.5a2 2 0 01-2-2V9a2 2 0 012-2h1.5" />
            </svg>
            Instructions
          </h2>
          <div className="prose prose-sm max-w-none text-muted-foreground">
            <p className="whitespace-pre-line">{exercise.instructions}</p>
          </div>

          {exercise.timeLimit && (
            <div className="mt-6 rounded-xl bg-primary/10 p-4 border border-primary/20">
              <p className="text-sm font-medium text-primary">
                Time Limit: {Math.floor(exercise.timeLimit / 60)} minutes
              </p>
            </div>
          )}

          {/* Submit Result */}
          {submitResult && (
            <div className={`mt-6 rounded-xl p-4 border ${
              submitResult.success
                ? 'bg-success/10 border-success/30'
                : 'bg-destructive/10 border-destructive/30'
            }`}>
              <div className="flex items-start gap-2">
                {submitResult.success ? (
                  <svg className="h-5 w-5 text-success flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m4 4v6m0-6l2 2m-2-2h-4" />
                  </svg>
                )}
                <p className={`text-sm ${submitResult.success ? 'text-success' : 'text-destructive'}`}>
                  {submitResult.message}
                </p>
              </div>
            </div>
          )}

          {exercise.hints && exercise.hints.length > 0 && hintIndex < exercise.hints.length && (
            <div className="mt-6">
              <Button
                onClick={handleHint}
                variant="outline"
                className="w-full gap-2 border-cosmic-purple/30 text-cosmic-purple hover:bg-cosmic-purple/10"
                disabled={isRunning}
              >
                <Lightbulb className="h-4 w-4" />
                Get Hint ({hintIndex}/{exercise.hints.length})
              </Button>
            </div>
          )}
        </div>

        {/* Editor and Output */}
        <div className="flex flex-1 flex-col md:flex-row">
          <div className="flex flex-1 flex-col border-b border-border md:border-b-0 md:border-r border-border p-2 md:p-4">
            <EditorPanel
              onRun={handleRun}
              onSubmit={handleSubmit}
              onHint={handleHint}
              starterCode={exercise.starterCode}
            />
          </div>
          <div className="h-32 md:h-64 p-2 md:p-4">
            <OutputPanel />
          </div>
        </div>
      </div>

      {/* Hint Card Popup */}
      {showHintCard && exercise.hints[hintIndex - 1] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-elevated p-6 max-w-md animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full icon-nebula-purple">
                <Lightbulb className="h-5 w-5 text-cosmic-purple" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">Hint {hintIndex}</h3>
                <p className="text-sm text-muted-foreground">{exercise.hints[hintIndex - 1]}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={closeHintCard} size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Got it!
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
