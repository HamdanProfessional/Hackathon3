'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

interface Exercise {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'beginner' | 'intermediate' | 'advanced';
  moduleId: string;
  module_id?: string;
  moduleName?: string;
  topic?: string;
  timeEstimate?: number;
  completed?: boolean;
  mastery?: number;
  points?: number;
}

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
  Refresh: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
};

export default function ExerciseListPage() {
  const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExercises = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const exerciseUrl = process.env.NEXT_PUBLIC_EXERCISE_URL;
        if (!exerciseUrl) {
          throw new Error('Exercise service URL not configured');
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(`${exerciseUrl.trim()}/exercises/all`, {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          if (data.exercises && Array.isArray(data.exercises)) {
            // Transform backend exercise data to match our interface
            const transformedExercises: Exercise[] = data.exercises.map((ex: any) => ({
              id: ex.id,
              title: ex.title,
              description: ex.description || `Complete the ${ex.topic || 'exercise'}`,
              difficulty: ex.difficulty || 'beginner',
              moduleId: ex.module_id || ex.moduleId || 'basics',
              module_id: ex.module_id,
              topic: ex.topic,
              timeEstimate: 15, // Default time estimate
              completed: false,
              mastery: 0,
              points: ex.points || 10,
            }));
            setExercises(transformedExercises);
          } else {
            setExercises([]);
          }
        } else {
          setError('Failed to load exercises from server');
          setExercises([]);
        }
      } catch (err) {
        console.error('Failed to fetch exercises:', err);
        setError('Unable to connect to exercise service');
        setExercises([]);
      }

      setIsLoading(false);
    };

    fetchExercises();
  }, []);

  // Get unique modules from exercises
  const modules = ['all', ...Array.from(new Set(exercises.map((e) => e.moduleId || e.module_id || 'basics')))];

  const filteredExercises = exercises.filter((exercise) => {
    if (filter !== 'all' && exercise.difficulty !== filter) return false;
    if (selectedModule !== 'all' && exercise.moduleId !== selectedModule && exercise.module_id !== selectedModule) return false;
    return true;
  });

  const getDifficultyColor = (difficulty: string) => {
    const diff = difficulty.toLowerCase();
    if (diff === 'easy' || diff === 'beginner') return 'bg-success/20 text-success border border-success/30';
    if (diff === 'medium' || diff === 'intermediate') return 'bg-warning/20 text-warning border border-warning/30';
    if (diff === 'hard' || diff === 'advanced') return 'bg-destructive/20 text-destructive border border-destructive/30';
    return 'bg-muted text-muted-foreground';
  };

  const formatDifficulty = (difficulty: string) => {
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  };

  const completedCount = exercises.filter((e) => e.completed).length;

  if (isLoading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading exercises...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Coding Exercises</h1>
          <p className="mt-2 text-muted-foreground">
            Practice your Python skills with hands-on exercises
          </p>
        </div>
        {error && (
          <Button onClick={() => window.location.reload()} variant="outline" size="sm" className="gap-2">
            <Icons.Refresh />
            Retry
          </Button>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <Card className="p-6 border-destructive/50 bg-destructive/10">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/20">
              <svg className="h-5 w-5 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-destructive">Unable to load exercises</h3>
              <p className="text-sm text-destructive/80 mt-1">{error}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Filters */}
      {exercises.length > 0 && (
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
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
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
      )}

      {/* Progress Summary */}
      {exercises.length > 0 && (
        <Card className="shadow-elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Your Progress</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {completedCount} of {exercises.length} exercises completed
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
                    {exercises.filter((e) => !e.completed).length}
                  </p>
                  <p className="text-xs text-muted-foreground">Remaining</p>
                </div>
              </div>
            </div>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${exercises.length > 0 ? (completedCount / exercises.length) * 100 : 0}%` }}
              />
            </div>
          </CardContent>
        </Card>
      )}

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
                        {formatDifficulty(exercise.difficulty)}
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
                    <span>{exercise.topic || exercise.moduleName || exercise.moduleId}</span>
                  </div>
                  {exercise.points && (
                    <div className="flex items-center space-x-1">
                      <span className="text-primary">⭐</span>
                      <span>{exercise.points} pts</span>
                    </div>
                  )}
                </div>

                {exercise.mastery !== undefined && exercise.mastery > 0 && (
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

      {filteredExercises.length === 0 && !error && (
        <Card className="p-12 text-center shadow-subtle">
          <div className="flex justify-center text-muted-foreground">
            {Icons.Code}
          </div>
          <h3 className="mt-4 text-lg font-semibold text-foreground">No exercises found</h3>
          <p className="mt-2 text-muted-foreground">
            {exercises.length === 0
              ? 'No exercises are available yet. Check back soon!'
              : 'Try adjusting your filters to see more exercises.'}
          </p>
        </Card>
      )}
    </div>
  );
}
