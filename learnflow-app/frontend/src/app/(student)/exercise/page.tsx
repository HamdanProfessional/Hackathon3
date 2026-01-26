/**
 * Exercise List Page
 * Browse and filter exercises by module
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import StarfieldBackground from '@/components/StarfieldBackground';

// Mock exercise data
const exercises = [
  {
    id: 1,
    title: 'Hello World',
    description: 'Write your first Python program',
    difficulty: 'beginner',
    module: 'Python Basics',
    moduleId: 1,
    completed: true,
    xp: 50,
  },
  {
    id: 2,
    title: 'Variables and Types',
    description: 'Practice using different variable types',
    difficulty: 'beginner',
    module: 'Python Basics',
    moduleId: 1,
    completed: true,
    xp: 75,
  },
  {
    id: 3,
    title: 'For Loops',
    description: 'Iterate using for loops',
    difficulty: 'beginner',
    module: 'Control Flow',
    moduleId: 2,
    completed: true,
    xp: 100,
  },
  {
    id: 4,
    title: 'While Loops',
    description: 'Practice while loop syntax',
    difficulty: 'intermediate',
    module: 'Control Flow',
    moduleId: 2,
    completed: false,
    xp: 120,
  },
  {
    id: 5,
    title: 'Define a Function',
    description: 'Create your first function',
    difficulty: 'beginner',
    module: 'Functions',
    moduleId: 3,
    completed: true,
    xp: 100,
  },
  {
    id: 6,
    title: 'Function Parameters',
    description: 'Work with function parameters',
    difficulty: 'intermediate',
    module: 'Functions',
    moduleId: 3,
    completed: false,
    xp: 150,
  },
  {
    id: 7,
    title: 'Lists',
    description: 'Create and manipulate lists',
    difficulty: 'beginner',
    module: 'Data Structures',
    moduleId: 4,
    completed: false,
    xp: 120,
  },
  {
    id: 8,
    title: 'Dictionaries',
    description: 'Work with key-value pairs',
    difficulty: 'intermediate',
    module: 'Data Structures',
    moduleId: 4,
    completed: false,
    xp: 150,
  },
];

const modules = [
  { id: 0, name: 'All Modules' },
  { id: 1, name: 'Python Basics' },
  { id: 2, name: 'Control Flow' },
  { id: 3, name: 'Functions' },
  { id: 4, name: 'Data Structures' },
  { id: 5, name: 'File Operations' },
  { id: 6, name: 'Error Handling' },
];

const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

export default function ExerciseListPage() {
  const [selectedModule, setSelectedModule] = useState(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [showCompleted, setShowCompleted] = useState(true);

  const filteredExercises = exercises.filter((exercise) => {
    const moduleMatch = selectedModule === 0 || exercise.moduleId === selectedModule;
    const difficultyMatch = selectedDifficulty === 'all' || exercise.difficulty === selectedDifficulty;
    const completedMatch = showCompleted || !exercise.completed;
    return moduleMatch && difficultyMatch && completedMatch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'intermediate':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'advanced':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <StarfieldBackground density="medium">
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Python Exercises</h1>
            <p className="text-purple-300">
              Practice and master Python with hands-on coding exercises
            </p>
          </div>

          {/* Filters */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Module Filter */}
              <div className="flex-1">
                <label className="block text-sm text-gray-400 mb-2">Module</label>
                <select
                  value={selectedModule}
                  onChange={(e) => setSelectedModule(Number(e.target.value))}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
                >
                  {modules.map((module) => (
                    <option key={module.id} value={module.id}>
                      {module.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div className="flex-1">
                <label className="block text-sm text-gray-400 mb-2">Difficulty</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
                >
                  {difficulties.map((difficulty) => (
                    <option key={difficulty} value={difficulty} className="capitalize">
                      {difficulty}
                    </option>
                  ))}
                </select>
              </div>

              {/* Toggle Completed */}
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showCompleted}
                    onChange={(e) => setShowCompleted(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-400">Show Completed</span>
                </label>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{exercises.length}</div>
              <div className="text-xs text-gray-400">Total Exercises</div>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm border border-green-500/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{exercises.filter(e => e.completed).length}</div>
              <div className="text-xs text-gray-400">Completed</div>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">
                {filteredExercises.length}
              </div>
              <div className="text-xs text-gray-400">Showing</div>
            </div>
          </div>

          {/* Exercise List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExercises.map((exercise) => (
              <Link
                key={exercise.id}
                href={`/exercise/${exercise.id}`}
                className={`bg-gray-900/50 backdrop-blur-sm border rounded-xl p-6 hover:scale-105 transition-all ${
                  exercise.completed
                    ? 'border-green-500/30'
                    : 'border-purple-500/20 hover:border-purple-500/40'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium border ${getDifficultyColor(exercise.difficulty)}`}
                  >
                    {exercise.difficulty}
                  </span>
                  {exercise.completed && (
                    <span className="text-green-400">✓</span>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">
                  {exercise.title}
                </h3>

                <p className="text-gray-400 text-sm mb-4">{exercise.description}</p>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-purple-300">{exercise.module}</span>
                  <span className="text-yellow-400 font-medium">+{exercise.xp} XP</span>
                </div>
              </Link>
            ))}
          </div>

          {filteredExercises.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-white mb-2">No exercises found</h3>
              <p className="text-gray-400">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </StarfieldBackground>
  );
}
