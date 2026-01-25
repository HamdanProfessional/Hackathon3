'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Exercise {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  moduleId: string;
  moduleName: string;
  timeEstimate: number;
  completed: boolean;
  mastery: number;
}

// Mock exercises data
const mockExercises: Exercise[] = [
  {
    id: '1',
    title: 'Hello World',
    description: 'Write your first Python program to print "Hello, World!"',
    difficulty: 'easy',
    moduleId: 'python-basics',
    moduleName: 'Python Basics',
    timeEstimate: 10,
    completed: true,
    mastery: 100,
  },
  {
    id: '2',
    title: 'Variables and Data Types',
    description: 'Learn about variables, strings, integers, and floats',
    difficulty: 'easy',
    moduleId: 'python-basics',
    moduleName: 'Python Basics',
    timeEstimate: 15,
    completed: true,
    mastery: 100,
  },
  {
    id: '3',
    title: 'Basic Arithmetic',
    description: 'Practice mathematical operations in Python',
    difficulty: 'easy',
    moduleId: 'python-basics',
    moduleName: 'Python Basics',
    timeEstimate: 15,
    completed: false,
    mastery: 0,
  },
  {
    id: '4',
    title: 'If Statements',
    description: 'Learn conditional logic with if/else statements',
    difficulty: 'medium',
    moduleId: 'control-flow',
    moduleName: 'Control Flow',
    timeEstimate: 20,
    completed: false,
    mastery: 0,
  },
  {
    id: '5',
    title: 'For Loops',
    description: 'Iterate over sequences using for loops',
    difficulty: 'medium',
    moduleId: 'control-flow',
    moduleName: 'Control Flow',
    timeEstimate: 25,
    completed: false,
    mastery: 0,
  },
  {
    id: '6',
    title: 'While Loops',
    description: 'Learn to use while loops for iteration',
    difficulty: 'medium',
    moduleId: 'control-flow',
    moduleName: 'Control Flow',
    timeEstimate: 20,
    completed: false,
    mastery: 0,
  },
];

// Icons
const Icons = {
  Code: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  Clock: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  CheckCircle: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Circle: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <circle cx="12" cy="12" r="10" />
    </svg>
  ),
};

export default function ExerciseListPage() {
  const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [selectedModule, setSelectedModule] = useState<string>('all');

  const modules = ['all', ...Array.from(new Set(mockExercises.map((e) => e.moduleName)))];

  const filteredExercises = mockExercises.filter((exercise) => {
    if (filter !== 'all' && exercise.difficulty !== filter) return false;
    if (selectedModule !== 'all' && exercise.moduleName !== selectedModule) return false;
    return true;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-success/20 text-success';
      case 'medium':
        return 'bg-warning/20 text-warning';
      case 'hard':
        return 'bg-destructive/20 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const completedCount = mockExercises.filter((e) => e.completed).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Coding Exercises</h1>
        <p className="mt-2 text-muted-foreground">
          Practice your Python skills with hands-on exercises
        </p>
      </div>

      {/* Filters */}
      <Card className="shadow-subtle">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-foreground">Difficulty:</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as typeof filter)}
                className="rounded-lg border-border bg-muted px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">All</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-foreground">Module:</label>
              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="rounded-lg border-border bg-muted px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {modules.map((module) => (
                  <option key={module} value={module}>
                    {module === 'all' ? 'All Modules' : module}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Summary */}
      <Card className="shadow-elevated">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Your Progress</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {completedCount} of {mockExercises.length} exercises completed
              </p>
            </div>
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-success">
                  {completedCount}
                </p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {mockExercises.filter((e) => !e.completed).length}
                </p>
                <p className="text-xs text-muted-foreground">Remaining</p>
              </div>
            </div>
          </div>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${(completedCount / mockExercises.length) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Exercise List */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredExercises.map((exercise) => (
          <Link
            key={exercise.id}
            href={`/exercise/${exercise.id}`}
            className="group"
          >
            <Card className="h-full hover-lift shadow-subtle">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center space-x-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getDifficultyColor(
                          exercise.difficulty
                        )}`}
                      >
                        {exercise.difficulty}
                      </span>
                      {exercise.completed && (
                        <span className="flex items-center rounded-full bg-success/20 px-2.5 py-0.5 text-xs font-medium text-success">
                          <span className="mr-1">{Icons.CheckCircle}</span>
                          Complete
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-lg">{exercise.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{exercise.description}</p>

                <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <span className="text-primary">{Icons.Code}</span>
                    <span>{exercise.moduleName}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-primary">{Icons.Clock}</span>
                    <span>{exercise.timeEstimate} min</span>
                  </div>
                </div>

                {exercise.mastery > 0 && (
                  <div className="mt-4">
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Mastery</span>
                      <span className="font-medium text-foreground">{exercise.mastery}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${exercise.mastery}%` }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <Card className="p-12 text-center shadow-subtle">
          <div className="flex justify-center text-muted-foreground">
            {Icons.Code}
          </div>
          <h3 className="mt-4 text-lg font-semibold text-foreground">No exercises found</h3>
          <p className="mt-2 text-muted-foreground">
            Try adjusting your filters to see more exercises.
          </p>
        </Card>
      )}
    </div>
  );
}
