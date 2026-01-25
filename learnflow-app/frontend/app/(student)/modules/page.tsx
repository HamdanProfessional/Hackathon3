'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUserStore } from '@/stores/userStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Module {
  id: string;
  name: string;
  description: string;
  icon: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topics: Topic[];
  progress: number;
  completed: boolean;
}

interface Topic {
  id: string;
  moduleId: string;
  name: string;
  description: string;
  exercises: number;
  completed: boolean;
}

const pythonModules: Module[] = [
  {
    id: 'python-basics',
    name: 'Python Basics',
    description: 'Learn the fundamentals of Python programming',
    icon: '🐍',
    difficulty: 'beginner',
    progress: 0,
    completed: false,
    topics: [
      { id: 'basics-1', moduleId: 'python-basics', name: 'Variables & Data Types', description: 'Store and use data', exercises: 3, completed: false },
      { id: 'basics-2', moduleId: 'python-basics', name: 'Operators', description: 'Math and comparison operators', exercises: 3, completed: false },
      { id: 'basics-3', moduleId: 'python-basics', name: 'Input/Output', description: 'Interact with users', exercises: 2, completed: false },
      { id: 'basics-4', moduleId: 'python-basics', name: 'Comments & Documentation', description: 'Document your code', exercises: 2, completed: false },
    ],
  },
  {
    id: 'control-flow',
    name: 'Control Flow',
    description: 'Master conditional logic and loops',
    icon: '🔀',
    difficulty: 'beginner',
    progress: 0,
    completed: false,
    topics: [
      { id: 'flow-1', moduleId: 'control-flow', name: 'If Statements', description: 'Conditional execution', exercises: 4, completed: false },
      { id: 'flow-2', moduleId: 'control-flow', name: 'Loops', description: 'For and while loops', exercises: 4, completed: false },
      { id: 'flow-3', moduleId: 'control-flow', name: 'Break & Continue', description: 'Control loop flow', exercises: 3, completed: false },
    ],
  },
  {
    id: 'functions',
    name: 'Functions',
    description: 'Create reusable code blocks',
    icon: '⚡',
    difficulty: 'intermediate',
    progress: 0,
    completed: false,
    topics: [
      { id: 'func-1', moduleId: 'functions', name: 'Defining Functions', description: 'Create functions', exercises: 4, completed: false },
      { id: 'func-2', moduleId: 'functions', name: 'Parameters & Returns', description: 'Pass data in/out', exercises: 4, completed: false },
      { id: 'func-3', moduleId: 'functions', name: 'Scope & Lifetime', description: 'Variable visibility', exercises: 3, completed: false },
      { id: 'func-4', moduleId: 'functions', name: 'Lambda Functions', description: 'Anonymous functions', exercises: 3, completed: false },
    ],
  },
  {
    id: 'data-structures',
    name: 'Data Structures',
    description: 'Lists, dictionaries, tuples, sets',
    icon: '📦',
    difficulty: 'intermediate',
    progress: 0,
    completed: false,
    topics: [
      { id: 'ds-1', moduleId: 'data-structures', name: 'Lists', description: 'Ordered collections', exercises: 5, completed: false },
      { id: 'ds-2', moduleId: 'data-structures', name: 'Dictionaries', description: 'Key-value pairs', exercises: 5, completed: false },
      { id: 'ds-3', moduleId: 'data-structures', name: 'Tuples & Sets', description: 'Immutable collections', exercises: 4, completed: false },
    ],
  },
  {
    id: 'file-operations',
    name: 'File Operations',
    description: 'Read and write files',
    icon: '📁',
    difficulty: 'intermediate',
    progress: 0,
    completed: false,
    topics: [
      { id: 'file-1', moduleId: 'file-operations', name: 'Reading Files', description: 'Load file contents', exercises: 3, completed: false },
      { id: 'file-2', moduleId: 'file-operations', name: 'Writing Files', description: 'Save data to files', exercises: 3, completed: false },
      { id: 'file-3', moduleId: 'file-operations', name: 'File Context Managers', description: 'Safe file handling', exercises: 3, completed: false },
    ],
  },
  {
    id: 'error-handling',
    name: 'Error Handling',
    description: 'Debug and handle exceptions',
    icon: '🐛',
    difficulty: 'intermediate',
    progress: 0,
    completed: false,
    topics: [
      { id: 'err-1', moduleId: 'error-handling', name: 'Try/Except Blocks', description: 'Catch exceptions', exercises: 4, completed: false },
      { id: 'err-2', moduleId: 'error-handling', name: 'Exception Types', description: 'Different error types', exercises: 3, completed: false },
      { id: 'err-3', moduleId: 'error-handling', name: 'Raising Exceptions', description: 'Throw errors', exercises: 3, completed: false },
    ],
  },
  {
    id: 'oop',
    name: 'Object-Oriented Programming',
    description: 'Classes and objects',
    icon: '🏛️',
    difficulty: 'advanced',
    progress: 0,
    completed: false,
    topics: [
      { id: 'oop-1', moduleId: 'oop', name: 'Classes & Objects', description: 'Define classes', exercises: 5, completed: false },
      { id: 'oop-2', moduleId: 'oop', name: 'Methods & Attributes', description: 'Class behavior', exercises: 4, completed: false },
      { id: 'oop-3', moduleId: 'oop', name: 'Inheritance', description: 'Extend classes', exercises: 4, completed: false },
      { id: 'oop-4', moduleId: 'oop', name: 'Polymorphism', description: 'Different behaviors', exercises: 3, completed: false },
    ],
  },
  {
    id: 'advanced-python',
    name: 'Advanced Python',
    description: 'Decorators, generators, and more',
    icon: '🚀',
    difficulty: 'advanced',
    progress: 0,
    completed: false,
    topics: [
      { id: 'adv-1', moduleId: 'advanced-python', name: 'Decorators', description: 'Function modifiers', exercises: 4, completed: false },
      { id: 'adv-2', moduleId: 'advanced-python', name: 'Generators', description: 'Lazy evaluation', exercises: 4, completed: false },
      { id: 'adv-3', moduleId: 'advanced-python', name: 'List Comprehensions', description: 'Concise iteration', exercises: 4, completed: false },
      { id: 'adv-4', moduleId: 'advanced-python', name: 'Context Managers', description: 'Resource management', exercises: 3, completed: false },
    ],
  },
];

function getModuleColor(difficulty: string) {
  switch (difficulty) {
    case 'beginner':
      return 'bg-success/20 text-success border-success/30';
    case 'intermediate':
      return 'bg-warning/20 text-warning border-warning/30';
    case 'advanced':
      return 'bg-destructive/20 text-destructive border-destructive/30';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

function getProgressColor(progress: number) {
  if (progress <= 40) return 'bg-destructive';
  if (progress <= 70) return 'bg-warning';
  if (progress <= 90) return 'bg-success';
  return 'bg-cosmic-cyan';
}

export default function ModulesPage() {
  const user = useUserStore((state) => state.user);
  const [mounted, setMounted] = useState(false);
  const [modules, setModules] = useState<Module[]>(pythonModules);

  useEffect(() => {
    setMounted(true);
    // In production, fetch modules from API
    // For now, use mock data
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading modules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in p-6">
      {/* Header */}
      <div className="glass rounded-xl p-6 shadow-elevated">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gradient">
              Python Learning Modules
            </h1>
            <p className="mt-2 text-muted-foreground">
              Master Python through interactive exercises. Complete modules in order, or jump to any topic that interests you.
            </p>
          </div>
        </div>
      </div>

      {/* Module Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {modules.map((module) => (
          <Card
            key={module.id}
            className="group hover-lift cursor-pointer transition-all duration-300 border border-border bg-card/80 backdrop-blur-sm shadow-elevated overflow-hidden"
          >
            <Link href={`/modules/${module.id}`} className="block h-full">
              <div className="p-6">
                {/* Module Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-nebula text-2xl">
                    {module.icon}
                  </div>
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${getModuleColor(module.difficulty)}`}>
                    {module.difficulty}
                  </span>
                </div>

                {/* Module Name */}
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-cosmic-purple transition-colors">
                  {module.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {module.description}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {module.topics.length} topics
                  </span>
                  <span className="font-medium text-foreground">
                    {module.progress}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${getProgressColor(module.progress)}`}
                    style={{ width: `${module.progress}%` }}
                  />
                </div>
              </div>
            </Link>
          </Card>
        ))}
      </div>

      {/* Quick Start Section */}
      <div className="glass rounded-xl p-6 shadow-elevated">
        <h2 className="text-xl font-bold text-foreground mb-4">Quick Start Exercises</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/exercise/1">
            <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3 border-2 border-cosmic-purple/40 bg-cosmic-purple/5 hover:bg-cosmic-purple/15 hover:border-cosmic-purple/60">
              <span className="text-2xl">1️⃣</span>
              <div className="text-left">
                <p className="font-medium text-foreground">Hello World</p>
                <p className="text-xs text-muted-foreground">Your first program</p>
              </div>
            </Button>
          </Link>
          <Link href="/exercise/2">
            <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3 border-2 border-cosmic-blue/40 bg-cosmic-blue/5 hover:bg-cosmic-blue/15 hover:border-cosmic-blue/60">
              <span className="text-2xl">2️⃣</span>
              <div className="text-left">
                <p className="font-medium text-foreground">Variables</p>
                <p className="text-xs text-muted-foreground">Store data</p>
              </div>
            </Button>
          </Link>
          <Link href="/exercise/3">
            <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3 border-2 border-cosmic-cyan/40 bg-cosmic-cyan/5 hover:bg-cosmic-cyan/15 hover:border-cosmic-cyan/60">
              <span className="text-2xl">3️⃣</span>
              <div className="text-left">
                <p className="font-medium text-foreground">Arithmetic</p>
                <p className="text-xs text-muted-foreground">Math operations</p>
              </div>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
