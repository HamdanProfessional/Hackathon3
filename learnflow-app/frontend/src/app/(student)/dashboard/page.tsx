/**
 * Student Dashboard Page
 * Main student learning hub with progress overview and quick actions
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import StarfieldBackground from '@/components/StarfieldBackground';
import { ActivityHeatmap } from '@/components/charts';

// Mock data
const modules = [
  { id: 1, name: 'Python Basics', progress: 100, icon: '🐍', color: 'from-green-500 to-emerald-600' },
  { id: 2, name: 'Control Flow', progress: 85, icon: '🔄', color: 'from-blue-500 to-cyan-600' },
  { id: 3, name: 'Functions', progress: 70, icon: '⚡', color: 'from-purple-500 to-pink-600' },
  { id: 4, name: 'Data Structures', progress: 55, icon: '📊', color: 'from-yellow-500 to-orange-600' },
  { id: 5, name: 'File Operations', progress: 40, icon: '📁', color: 'from-indigo-500 to-purple-600' },
  { id: 6, name: 'Error Handling', progress: 25, icon: '🛡️', color: 'from-red-500 to-rose-600' },
];

const recentActivity = [
  { id: 1, type: 'exercise', title: 'Completed: For Loops', time: '2 hours ago', icon: '✅' },
  { id: 2, type: 'achievement', title: 'Earned: Quick Learner Badge', time: '5 hours ago', icon: '🏆' },
  { id: 3, type: 'exercise', title: 'Completed: While Loops', time: 'Yesterday', icon: '✅' },
  { id: 4, type: 'streak', title: '14 Day Streak!', time: 'Yesterday', icon: '🔥' },
];

const quickActions = [
  { id: 1, title: 'Continue Learning', description: 'Pick up where you left off', href: '/exercise', icon: '▶️' },
  { id: 2, title: 'Practice Coding', description: 'Sharpen your skills', href: '/exercise', icon: '💻' },
  { id: 3, title: 'Ask AI Tutor', description: 'Get help with concepts', href: '/chat', icon: '🤖' },
  { id: 4, title: 'View Analytics', description: 'Track your progress', href: '/analytics', icon: '📈' },
];

export default function DashboardPage() {
  const [user] = useState({
    name: 'Student',
    streak: 14,
    xp: 2450,
    level: 12,
    completedExercises: 40,
    totalExercises: 100,
  });

  return (
    <StarfieldBackground density="medium">
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome back, {user.name}! 👋
            </h1>
            <p className="text-purple-300 text-lg">
              Ready to continue your Python journey?
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* XP Card */}
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-300 text-sm font-medium">Total XP</p>
                  <p className="text-3xl font-bold text-white">{user.xp.toLocaleString()}</p>
                  <p className="text-gray-400 text-sm">Level {user.level}</p>
                </div>
                <div className="text-5xl">⭐</div>
              </div>
            </div>

            {/* Streak Card */}
            <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-sm border border-red-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-300 text-sm font-medium">Learning Streak</p>
                  <p className="text-3xl font-bold text-white">{user.streak}</p>
                  <p className="text-gray-400 text-sm">days in a row</p>
                </div>
                <div className="text-5xl">🔥</div>
              </div>
            </div>

            {/* Progress Card */}
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-300 text-sm font-medium">Exercises</p>
                  <p className="text-3xl font-bold text-white">
                    {user.completedExercises}/{user.totalExercises}
                  </p>
                  <p className="text-gray-400 text-sm">{user.completedExercises}% done</p>
                </div>
                <div className="text-5xl">📝</div>
              </div>
            </div>

            {/* Mastery Card */}
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-300 text-sm font-medium">Mastery Score</p>
                  <p className="text-3xl font-bold text-white">72%</p>
                  <p className="text-gray-400 text-sm">Advanced</p>
                </div>
                <div className="text-5xl">🎯</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {quickActions.map((action) => (
              <Link
                key={action.id}
                href={action.href}
                className="group bg-gray-900/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all"
              >
                <div className="text-4xl mb-3">{action.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-purple-300">
                  {action.title}
                </h3>
                <p className="text-gray-400 text-sm">{action.description}</p>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Learning Modules */}
            <div className="lg:col-span-2">
              <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-white">Learning Modules</h2>
                  <Link href="/exercise" className="text-purple-400 hover:text-purple-300 text-sm">
                    View All →
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {modules.map((module) => (
                    <Link
                      key={module.id}
                      href={`/exercise?module=${module.id}`}
                      className={`bg-gradient-to-br ${module.color} bg-opacity-10 border border-white/10 rounded-lg p-4 hover:scale-105 transition-transform`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="text-3xl">{module.icon}</div>
                        <span className="text-sm font-medium text-white/80">
                          {module.progress}%
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {module.name}
                      </h3>
                      <div className="w-full bg-black/20 rounded-full h-2">
                        <div
                          className="bg-white rounded-full h-2 transition-all"
                          style={{ width: `${module.progress}%` }}
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Activity Heatmap */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
                <h2 className="text-2xl font-semibold text-white mb-4">Learning Activity</h2>
                <ActivityHeatmap weeks={8} />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Daily Goal */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Daily Goal</h2>
                <div className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="rgba(139, 92, 246, 0.2)"
                        strokeWidth="12"
                        fill="none"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="#8b5cf6"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray="352"
                        strokeDashoffset="88"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white">3/4</div>
                        <div className="text-xs text-gray-400">exercises</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300">Almost there! Complete 1 more exercise today.</p>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-3 bg-gray-800/30 rounded-lg"
                    >
                      <div className="text-2xl">{activity.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">
                          {activity.title}
                        </p>
                        <p className="text-gray-400 text-xs">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StarfieldBackground>
  );
}
