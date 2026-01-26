/**
 * Teacher Dashboard Page
 * Instructor monitoring and analytics interface
 */

'use client';

import React, { useState, useEffect } from 'react';
import StarfieldBackground from '@/components/StarfieldBackground';
import { ModuleProgressChart } from '@/components/charts';

// Mock data
const classStats = {
  totalStudents: 28,
  activeStudents: 24,
  averageMastery: 65,
  totalExercises: 680,
};

const strugglingStudents = [
  {
    id: 1,
    name: 'John Smith',
    module: 'Data Structures',
    streak: 0,
    lastActive: '2 days ago',
    alert: 'At Risk',
  },
  {
    id: 2,
    name: 'Emma Wilson',
    module: 'Functions',
    streak: 1,
    lastActive: '1 day ago',
    alert: 'Needs Attention',
  },
  {
    id: 3,
    name: 'Michael Brown',
    module: 'Error Handling',
    streak: 0,
    lastActive: '3 days ago',
    alert: 'At Risk',
  },
];

const classProgress = [
  { name: 'Python Basics', progress: 95, exercises: 9, mastery: 'Excellent' },
  { name: 'Control Flow', progress: 78, exercises: 7, mastery: 'Good' },
  { name: 'Functions', progress: 62, exercises: 5, mastery: 'Average' },
  { name: 'Data Structures', progress: 45, exercises: 3, mastery: 'Below Avg' },
  { name: 'File Operations', progress: 32, exercises: 2, mastery: 'Poor' },
];

const topPerformers = [
  { id: 1, name: 'Sarah Lee', xp: 3450, streak: 21, modules: 6 },
  { id: 2, name: 'David Kim', xp: 3200, streak: 18, modules: 5 },
  { id: 3, name: 'Lisa Chen', xp: 2980, streak: 15, modules: 5 },
  { id: 4, name: 'James Miller', xp: 2750, streak: 12, modules: 4 },
  { id: 5, name: 'Anna Taylor', xp: 2650, streak: 11, modules: 4 },
];

export default function TeacherDashboardPage() {
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    // Simulate live updates
    const interval = setInterval(() => {
      // In real app, this would fetch from API
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <StarfieldBackground density="low">
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Teacher Dashboard
              </h1>
              <p className="text-purple-300">
                Monitor class progress and student performance
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 ${
                    isLive ? '' : 'hidden'
                  }`}
                ></span>
                <span
                  className={`relative inline-flex rounded-full h-3 w-3 ${
                    isLive ? 'bg-green-500' : 'bg-gray-500'
                  }`}
                ></span>
              </span>
              <span className="text-sm text-gray-400">
                {isLive ? 'Live' : 'Paused'}
              </span>
            </div>
          </div>

          {/* Class Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Total Students</span>
                <span className="text-2xl">👥</span>
              </div>
              <div className="text-3xl font-bold text-white">{classStats.totalStudents}</div>
              <div className="text-sm text-green-400">{classStats.activeStudents} active</div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Avg Mastery</span>
                <span className="text-2xl">📊</span>
              </div>
              <div className="text-3xl font-bold text-white">{classStats.averageMastery}%</div>
              <div className="text-sm text-purple-400">Class average</div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Exercises Done</span>
                <span className="text-2xl">✅</span>
              </div>
              <div className="text-3xl font-bold text-white">{classStats.totalExercises}</div>
              <div className="text-sm text-cyan-400">This month</div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Struggling</span>
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="text-3xl font-bold text-white">{strugglingStudents.length}</div>
              <div className="text-sm text-red-400">Need attention</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Class Progress */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-white">
                    Class Progress by Module
                  </h2>
                  <select className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm">
                    <option>This Week</option>
                    <option>This Month</option>
                    <option>All Time</option>
                  </select>
                </div>
                <ModuleProgressChart data={classProgress} height={300} />
              </div>

              {/* Struggle Alerts */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-red-500/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-white">
                    ⚠️ Students Needing Attention
                  </h2>
                  <button className="text-sm text-purple-400 hover:text-purple-300">
                    Send Reminders
                  </button>
                </div>
                <div className="space-y-3">
                  {strugglingStudents.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-medium">{student.name}</p>
                          <p className="text-gray-400 text-sm">
                            {student.module} • Last active {student.lastActive}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            student.alert === 'At Risk'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}
                        >
                          {student.alert}
                        </span>
                        <p className="text-gray-400 text-sm mt-1">Streak: {student.streak} days</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Top Performers */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-green-500/20 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  🏆 Top Performers
                </h2>
                <div className="space-y-3">
                  {topPerformers.map((student, idx) => (
                    <div
                      key={student.id}
                      className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg"
                    >
                      <div className="text-lg font-bold text-yellow-400">#{idx + 1}</div>
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{student.name}</p>
                        <p className="text-gray-400 text-xs">
                          {student.xp} XP • {student.modules} modules
                        </p>
                      </div>
                      <div className="text-orange-400 text-xs">
                        🔥 {student.streak}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Quick Actions
                </h2>
                <div className="space-y-2">
                  <button className="w-full px-4 py-3 bg-purple-600/20 border border-purple-500/30 rounded-lg text-white hover:bg-purple-600/30 transition-all text-left">
                    📧 Send Class Announcement
                  </button>
                  <button className="w-full px-4 py-3 bg-purple-600/20 border border-purple-500/30 rounded-lg text-white hover:bg-purple-600/30 transition-all text-left">
                    📝 Create New Exercise
                  </button>
                  <button className="w-full px-4 py-3 bg-purple-600/20 border border-purple-500/30 rounded-lg text-white hover:bg-purple-600/30 transition-all text-left">
                    📊 Export Progress Report
                  </button>
                  <button className="w-full px-4 py-3 bg-purple-600/20 border border-purple-500/30 rounded-lg text-white hover:bg-purple-600/30 transition-all text-left">
                    ⚙️ Class Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StarfieldBackground>
  );
}
