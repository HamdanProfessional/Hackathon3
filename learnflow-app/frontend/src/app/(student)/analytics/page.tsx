/**
 * Analytics Dashboard Page
 * Comprehensive learning analytics with visualizations
 */

'use client';

import React, { useState, useEffect } from 'react';
import StarfieldBackground from '@/components/StarfieldBackground';
import {
  ProgressChart,
  ModuleProgressChart,
  SkillRadarChart,
  ExercisePieChart,
  ActivityHeatmap
} from '@/components/charts';

// Mock data - replace with API calls
const progressData = [
  { date: 'Week 1', mastery: 15, exercisesCompleted: 3, timeSpent: 120 },
  { date: 'Week 2', mastery: 25, exercisesCompleted: 8, timeSpent: 180 },
  { date: 'Week 3', mastery: 35, exercisesCompleted: 12, timeSpent: 240 },
  { date: 'Week 4', mastery: 45, exercisesCompleted: 18, timeSpent: 300 },
  { date: 'Week 5', mastery: 55, exercisesCompleted: 24, timeSpent: 360 },
  { date: 'Week 6', mastery: 65, exercisesCompleted: 30, timeSpent: 420 },
  { date: 'Week 7', mastery: 72, exercisesCompleted: 35, timeSpent: 480 },
  { date: 'Week 8', mastery: 78, exercisesCompleted: 40, timeSpent: 540 },
];

const moduleData = [
  { name: 'Python Basics', progress: 100, exercises: 10, mastery: 'Mastered' },
  { name: 'Control Flow', progress: 85, exercises: 8, mastery: 'Advanced' },
  { name: 'Functions', progress: 70, exercises: 7, mastery: 'Proficient' },
  { name: 'Data Structures', progress: 55, exercises: 6, mastery: 'Intermediate' },
  { name: 'File Operations', progress: 40, exercises: 4, mastery: 'Learning' },
  { name: 'Error Handling', progress: 25, exercises: 3, mastery: 'Beginner' },
  { name: 'OOP', progress: 10, exercises: 1, mastery: 'Novice' },
  { name: 'Advanced Python', progress: 0, exercises: 0, mastery: 'Not Started' },
];

const skillData = [
  { skill: 'Syntax', current: 85, target: 100 },
  { skill: 'Problem Solving', current: 70, target: 90 },
  { skill: 'Code Quality', current: 65, target: 85 },
  { skill: 'Debugging', current: 60, target: 80 },
  { skill: 'Documentation', current: 55, target: 75 },
  { skill: 'Testing', current: 45, target: 70 },
];

const exerciseStatusData = [
  { name: 'Completed', value: 40, color: '#10b981' },
  { name: 'In Progress', value: 8, color: '#f59e0b' },
  { name: 'Not Started', value: 52, color: '#ef4444' },
];

const statsData = [
  {
    label: 'Total Exercises',
    value: '100',
    unit: 'completed',
    trend: '+12%',
    trendUp: true,
    icon: '📝'
  },
  {
    label: 'Learning Streak',
    value: '14',
    unit: 'days',
    trend: '+3',
    trendUp: true,
    icon: '🔥'
  },
  {
    label: 'Time Spent',
    value: '42',
    unit: 'hours',
    trend: '+8h',
    trendUp: true,
    icon: '⏱️'
  },
  {
    label: 'Mastery Score',
    value: '72',
    unit: '%',
    trend: '+5%',
    trendUp: true,
    icon: '🎯'
  },
];

export default function AnalyticsPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'all'>('all');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <StarfieldBackground density="medium">
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Learning Analytics
            </h1>
            <p className="text-purple-300">
              Track your learning progress and performance
            </p>
          </div>

          {/* Timeframe Selector */}
          <div className="flex gap-2 mb-6">
            {(['week', 'month', 'all'] as const).map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedTimeframe === timeframe
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
              </button>
            ))}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statsData.map((stat, idx) => (
              <div
                key={idx}
                className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{stat.icon}</span>
                  <span className={`text-sm font-medium ${
                    stat.trendUp ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {stat.trend}
                  </span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">
                  {stat.label} • {stat.unit}
                </div>
              </div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Progress Over Time */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Progress Over Time
              </h2>
              <ProgressChart data={progressData} showArea={true} height={280} />
            </div>

            {/* Module Progress */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Module Progress
              </h2>
              <ModuleProgressChart data={moduleData} height={280} />
            </div>

            {/* Skill Assessment */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Skill Assessment
              </h2>
              <SkillRadarChart data={skillData} height={320} />
            </div>

            {/* Exercise Status */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Exercise Status
              </h2>
              <ExercisePieChart data={exerciseStatusData} height={300} />
            </div>
          </div>

          {/* Activity Heatmap - Full Width */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Learning Activity
            </h2>
            <ActivityHeatmap weeks={12} />
          </div>

          {/* Performance Insights */}
          <div className="mt-6 bg-gray-900/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Performance Insights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="text-green-400 font-semibold mb-2">🎯 Strength</div>
                <p className="text-gray-300 text-sm">
                  You excel at Python basics and syntax. Keep up the great work!
                </p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <div className="text-yellow-400 font-semibold mb-2">📈 Focus Area</div>
                <p className="text-gray-300 text-sm">
                  Data Structures require more practice. Try 2-3 more exercises this week.
                </p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                <div className="text-purple-400 font-semibold mb-2">🏆 Achievement</div>
                <p className="text-gray-300 text-sm">
                  You've maintained a 14-day learning streak! Keep the momentum going.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StarfieldBackground>
  );
}
