'use client';

import { useEffect, useState } from 'react';
import ClassOverview from '@/components/ClassOverview';
import StruggleAlerts from '@/components/StruggleAlerts';
import type { ClassOverview as ClassOverviewType, StruggleAlert } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Mock data for demonstration
const mockClassOverview: ClassOverviewType = {
  totalStudents: 45,
  activeToday: 32,
  strugglingCount: 5,
  averageMastery: 68,
  topPerformers: [
    { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'student' as const, studentId: '1', level: 'advanced' as const },
    { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'student' as const, studentId: '2', level: 'intermediate' as const },
    { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'student' as const, studentId: '3', level: 'intermediate' as const },
    { id: '4', name: 'Diana Prince', email: 'diana@example.com', role: 'student' as const, studentId: '4', level: 'advanced' as const },
    { id: '5', name: 'Eve Davis', email: 'eve@example.com', role: 'student' as const, studentId: '5', level: 'beginner' as const },
  ],
  strugglingStudents: [
    { id: '6', name: 'Frank Miller', email: 'frank@example.com', role: 'student' as const, studentId: '6', level: 'beginner' as const },
    { id: '7', name: 'Grace Lee', email: 'grace@example.com', role: 'student' as const, studentId: '7', level: 'beginner' as const },
  ],
};

const mockStruggleAlerts: StruggleAlert[] = [
  {
    id: 'alert-1',
    studentId: 'student-1',
    studentName: 'John Doe',
    type: 'repeated_error',
    severity: 'high',
    message: 'Student has encountered the same error 5 times in the Functions module',
    context: {
      exerciseId: 'functions-1',
      error: 'SyntaxError: invalid syntax',
      attempts: 5,
    },
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
    resolved: false,
  },
  {
    id: 'alert-2',
    studentId: 'student-2',
    studentName: 'Jane Smith',
    type: 'time_spent',
    severity: 'medium',
    message: 'Student has been stuck on an exercise for 25 minutes',
    context: {
      exerciseId: 'loops-2',
      timeSpent: 1500,
    },
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    resolved: false,
  },
  {
    id: 'alert-3',
    studentId: 'student-3',
    studentName: 'Bob Johnson',
    type: 'low_quiz_score',
    severity: 'medium',
    message: 'Student scored 35% on the Data Types quiz',
    context: {},
    createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
    resolved: false,
  },
];

export default function TeacherDashboardPage() {
  const [classOverview, setClassOverview] = useState<ClassOverviewType | null>(null);
  const [alerts, setAlerts] = useState<StruggleAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      // Try to fetch from API
      try {
        // For demo purposes, use mock data
        setClassOverview(mockClassOverview);
        setAlerts(mockStruggleAlerts);

        // In production, you would call:
        // const overviewResponse = await api.getClassOverview('class-1');
        // const alertsResponse = await api.getStruggleAlerts('class-1', false);
      } catch (error) {
        console.error('Failed to load data:', error);
      }

      setIsLoading(false);
    };

    loadData();
  }, []);

  const handleResolveAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="glass rounded-xl p-6 shadow-elevated">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gradient">
              Teacher Dashboard
            </h1>
            <p className="mt-2 text-muted-foreground">
              Monitor your class progress and help struggling students
            </p>
          </div>
          <div className="hidden sm:block">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl icon-nebula-purple">
              <svg className="h-8 w-8 text-cosmic-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Class Overview */}
      {classOverview && (
        <div>
          <ClassOverview overview={classOverview} />
        </div>
      )}

      {/* Struggle Alerts */}
      <div>
        <h2 className="mb-4 text-2xl font-bold text-foreground flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg icon-container-destructive">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </span>
          Struggle Alerts
          <span className="rounded-full bg-destructive/20 border border-destructive/30 px-3 py-1 text-sm font-semibold text-destructive">
            {alerts.length}
          </span>
        </h2>
        <StruggleAlerts alerts={alerts} onResolve={handleResolveAlert} />
      </div>
    </div>
  );
}
