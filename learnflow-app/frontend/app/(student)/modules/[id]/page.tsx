'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Play, Lock, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getModuleIcon } from '@/components/ModuleIcons';

interface Topic {
  id: string;
  moduleId: string;
  name: string;
  description: string;
  exercises: number;
  completed: boolean;
}

interface Module {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topics: Topic[];
  progress: number;
  completed: boolean;
}

const modulesData: Record<string, Module> = {
  'basics': {
    id: 'basics',
    name: 'Python Basics',
    description: 'Learn the fundamentals of Python programming',
    icon: <getModuleIcon iconName="Python" />,
    difficulty: 'beginner',
    progress: 0,
    completed: false,
    topics: [
      { id: 'basics-1', moduleId: 'basics', name: 'Variables & Data Types', description: 'Store and use data in Python', exercises: 3, completed: false },
      { id: 'basics-2', moduleId: 'basics', name: 'Operators', description: 'Perform mathematical and logical operations', exercises: 3, completed: false },
      { id: 'basics-3', moduleId: 'basics', name: 'Input/Output', description: 'Get user input and display output', exercises: 2, completed: false },
      { id: 'basics-4', moduleId: 'basics', name: 'Comments & Documentation', description: 'Document your code effectively', exercises: 2, completed: false },
    ],
  },
  'control_flow': {
    id: 'control_flow',
    name: 'Control Flow',
    description: 'Master conditional logic and loops',
    icon: <getModuleIcon iconName="Flow" />,
    difficulty: 'beginner',
    progress: 0,
    completed: false,
    topics: [
      { id: 'flow-1', moduleId: 'control_flow', name: 'If Statements', description: 'Make decisions with conditional logic', exercises: 4, completed: false },
      { id: 'flow-2', moduleId: 'control_flow', name: 'Loops', description: 'Repeat code with for and while loops', exercises: 4, completed: false },
      { id: 'flow-3', moduleId: 'control_flow', name: 'Break & Continue', description: 'Control loop execution flow', exercises: 3, completed: false },
    ],
  },
  'functions': {
    id: 'functions',
    name: 'Functions',
    description: 'Create reusable code blocks',
    icon: <getModuleIcon iconName="Bolt" />,
    difficulty: 'intermediate',
    progress: 0,
    completed: false,
    topics: [
      { id: 'func-1', moduleId: 'functions', name: 'Defining Functions', description: 'Create reusable functions with def keyword', exercises: 4, completed: false },
      { id: 'func-2', moduleId: 'functions', name: 'Parameters & Returns', description: 'Pass data into and out of functions', exercises: 4, completed: false },
      { id: 'func-3', moduleId: 'functions', name: 'Scope & Lifetime', description: 'Understand variable visibility', exercises: 3, completed: false },
      { id: 'func-4', moduleId: 'functions', name: 'Lambda Functions', description: 'Create anonymous inline functions', exercises: 3, completed: false },
    ],
  },
  'data_structures': {
    id: 'data_structures',
    name: 'Data Structures',
    description: 'Lists, dictionaries, tuples, and sets',
    icon: <getModuleIcon iconName="Box" />,
    difficulty: 'intermediate',
    progress: 0,
    completed: false,
    topics: [
      { id: 'ds-1', moduleId: 'data_structures', name: 'Lists', description: 'Work with ordered mutable collections', exercises: 5, completed: false },
      { id: 'ds-2', moduleId: 'data_structures', name: 'Dictionaries', description: 'Store key-value pairs efficiently', exercises: 5, completed: false },
      { id: 'ds-3', moduleId: 'data_structures', name: 'Tuples & Sets', description: 'Use immutable and unique collections', exercises: 4, completed: false },
    ],
  },
  'files': {
    id: 'files',
    name: 'File Operations',
    description: 'Read and write files on disk',
    icon: <getModuleIcon iconName="Folder" />,
    difficulty: 'intermediate',
    progress: 0,
    completed: false,
    topics: [
      { id: 'file-1', moduleId: 'files', name: 'Reading Files', description: 'Load and read file contents', exercises: 3, completed: false },
      { id: 'file-2', moduleId: 'files', name: 'Writing Files', description: 'Create and write to files', exercises: 3, completed: false },
      { id: 'file-3', moduleId: 'files', name: 'File Context Managers', description: 'Safely manage file resources', exercises: 3, completed: false },
    ],
  },
  'errors': {
    id: 'errors',
    name: 'Error Handling',
    description: 'Debug and handle exceptions gracefully',
    icon: <getModuleIcon iconName="Bug" />,
    difficulty: 'intermediate',
    progress: 0,
    completed: false,
    topics: [
      { id: 'err-1', moduleId: 'errors', name: 'Try/Except Blocks', description: 'Catch and handle runtime errors', exercises: 4, completed: false },
      { id: 'err-2', moduleId: 'errors', name: 'Exception Types', description: 'Work with different exception types', exercises: 3, completed: false },
      { id: 'err-3', moduleId: 'errors', name: 'Raising Exceptions', description: 'Throw custom exceptions when needed', exercises: 3, completed: false },
    ],
  },
  'oop': {
    id: 'oop',
    name: 'Object-Oriented Programming',
    description: 'Classes and objects',
    icon: <getModuleIcon iconName="Building" />,
    difficulty: 'advanced',
    progress: 0,
    completed: false,
    topics: [
      { id: 'oop-1', moduleId: 'oop', name: 'Classes & Objects', description: 'Define custom classes and objects', exercises: 5, completed: false },
      { id: 'oop-2', moduleId: 'oop', name: 'Methods & Attributes', description: 'Add behavior to classes', exercises: 4, completed: false },
      { id: 'oop-3', moduleId: 'oop', name: 'Inheritance', description: 'Extend and reuse class definitions', exercises: 4, completed: false },
      { id: 'oop-4', moduleId: 'oop', name: 'Polymorphism', description: 'Implement different behaviors', exercises: 3, completed: false },
    ],
  },
  'libraries': {
    id: 'libraries',
    name: 'Advanced Python',
    description: 'Decorators, generators, and more',
    icon: <getModuleIcon iconName="Rocket" />,
    difficulty: 'advanced',
    progress: 0,
    completed: false,
    topics: [
      { id: 'adv-1', moduleId: 'libraries', name: 'Decorators', description: 'Modify function behavior dynamically', exercises: 4, completed: false },
      { id: 'adv-2', moduleId: 'libraries', name: 'Generators', description: 'Create lazy iterators with yield', exercises: 4, completed: false },
      { id: 'adv-3', moduleId: 'libraries', name: 'List Comprehensions', description: 'Write concise iteration expressions', exercises: 4, completed: false },
      { id: 'adv-4', moduleId: 'libraries', name: 'Context Managers', description: 'Implement resource management patterns', exercises: 3, completed: false },
    ],
  },
};

export default function ModuleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [module, setModule] = useState<Module | null>(null);
  const [exercises, setExercises] = useState<Array<{
    id: string;
    title: string;
    description: string;
    difficulty: string;
    topic: string;
    points: number;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadModuleData = async () => {
      const moduleId = params.id as string;

      // Try to get module from static data first (fallback)
      const staticModuleData = modulesData[moduleId];
      if (staticModuleData) {
        setModule(staticModuleData);
      }

      // Fetch actual exercises for this module from the backend
      try {
        const exercisesRes = await fetch(`/api/proxy/exercise/exercises/all`);
        if (exercisesRes.ok) {
          const data = await exercisesRes.json();
          // Filter exercises for this module
          const moduleExercises = (data.exercises || []).filter((ex: any) =>
            ex.module_id === moduleId || ex.moduleId === `module_${moduleId}`
          );
          setExercises(moduleExercises);
        }
      } catch (error) {
        console.error('Failed to fetch exercises:', error);
      }

      setLoading(false);
    };

    loadModuleData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading module...</p>
        </div>
      </div>
    );
  }

  if (!module && exercises.length === 0) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <Card className="p-8 text-center shadow-elevated max-w-md">
          <p className="text-muted-foreground mb-4">Module not found or no exercises available</p>
          <Button onClick={() => router.push('/modules')}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Modules
          </Button>
        </Card>
      </div>
    );
  }

  // If we have exercises, show them instead of the static module data
  if (exercises.length > 0) {
    return (
      <div className="space-y-6 animate-fade-in p-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.push('/modules')}
            variant="ghost"
            size="sm"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gradient">{exercises[0]?.topic || params.id} - Exercises</h1>
            <p className="text-sm text-muted-foreground">
              {exercises.length} exercise{exercises.length > 1 ? 's' : ''} available
            </p>
          </div>
        </div>

        {/* Exercises List */}
        <div className="grid gap-4">
          {exercises.map((exercise, index) => (
            <Card
              key={exercise.id}
              className="group hover-lift transition-all duration-300 border border-border bg-card/80 backdrop-blur-sm shadow-elevated cursor-pointer"
              onClick={() => router.push(`/exercise/${exercise.id}`)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex h-8 w-8 rounded-full bg-primary/20 border border-primary/30 text-primary font-bold text-sm">
                        {index + 1}
                      </div>
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-cosmic-purple transition-colors">
                        {exercise.title}
                      </h3>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        exercise.difficulty === 'beginner'
                          ? 'bg-success/20 text-success'
                          : exercise.difficulty === 'intermediate'
                          ? 'bg-warning/20 text-warning'
                          : 'bg-destructive/20 text-destructive'
                      }`}>
                        {exercise.difficulty || 'Beginner'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{exercise.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {exercise.points} points • {exercise.topic}
                    </p>
                  </div>
                  <Play className="h-5 w-5 text-primary group-hover:text-cosmic-purple transition-colors" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in p-6">
      {/* Module Header */}
      <div className="glass rounded-xl p-6 shadow-elevated">
        <div className="flex items-start gap-6">
          <Button
            onClick={() => router.push('/modules')}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl gradient-nebula text-primary-foreground">
            {module.icon}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gradient">{module.name}</h1>
            <p className="mt-2 text-muted-foreground">{module.description}</p>
            <div className="mt-4 flex items-center gap-4">
              <span className={`rounded-full px-3 py-1 text-sm font-semibold ${
                module.difficulty === 'beginner'
                  ? 'bg-success/20 text-success border border-success/30'
                  : module.difficulty === 'intermediate'
                  ? 'bg-warning/20 text-warning border border-warning/30'
                  : 'bg-destructive/20 text-destructive border border-destructive/30'
              }`}>
                {module.difficulty}
              </span>
              <span className="text-sm text-muted-foreground">
                {module.topics.length} topics • {module.topics.reduce((sum, t) => sum + t.exercises, 0)} exercises
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Topics List */}
      <div>
        <h2 className="mb-4 text-2xl font-bold text-foreground flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg icon-nebula-purple">
            <svg className="h-4 w-4 text-cosmic-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </span>
          Topics
        </h2>
        <div className="grid gap-4">
          {module.topics.map((topic, index) => (
            <Card
              key={topic.id}
              className="group hover-lift transition-all duration-300 border border-border bg-card/80 backdrop-blur-sm shadow-elevated"
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  {/* Topic Number */}
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 border border-primary/30 text-primary font-bold">
                    {index + 1}
                  </div>

                  {/* Topic Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-cosmic-purple transition-colors">
                          {topic.name}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">{topic.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {topic.completed ? (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/20">
                            <CheckCircle2 className="h-5 w-5 text-success" />
                          </div>
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Exercise Count */}
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {topic.exercises} exercises
                      </span>
                      <Link
                        href="/modules"
                        className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cosmic-purple/90 to-cosmic-blue/90 hover:from-cosmic-purple hover:to-cosmic-blue text-white px-4 py-2 text-sm font-medium transition-all shadow-glow-purple/30 hover:shadow-glow-purple/50"
                      >
                        <Play className="h-4 w-4" />
                        Start Exercises
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
