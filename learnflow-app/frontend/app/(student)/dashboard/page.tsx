'use client';

import { useEffect, useState } from 'react';
import { useUserStore } from '@/stores/userStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { api } from '@/lib/api';

// SVG Icons
const Icons = {
  Users: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 016-3.553V9a6 6 0 016-3.553V5a2 2 0 012-2h3.27a2 2 0 012 2v3.553" />
    </svg>
  ),
  Zap: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  TrendingUp: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  Clock: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Star: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  ),
  Code: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  BarChart: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  Chat: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  Settings: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Play: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 001.555-.832z" />
    </svg>
  ),
  ArrowRight: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  CheckCircle: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export default function StudentDashboardPage() {
  const user = useUserStore((state) => state.user);
  const [mounted, setMounted] = useState(false);
  const [exerciseCount, setExerciseCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch dynamic data from backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get user ID from store first
        const user = useUserStore.getState().user;
        const studentId = user?.studentId || user?.id || 'default-student';

        // Fetch modules from exercise service (uses proxy via API client)
        const modulesResponse = await api.getModules();
        if (modulesResponse.success && modulesResponse.data) {
          // Calculate total exercises from all modules
          let totalExercises = 0;
          for (const key in modulesResponse.data) {
            if (modulesResponse.data[key]?.exercises?.length) {
              totalExercises += modulesResponse.data[key].exercises.length;
            }
          }
          setExerciseCount(totalExercises);
        }

        // Fetch progress from progress service (uses proxy via API client)
        const progressResponse = await api.getStudentProgress(studentId);
        if (progressResponse.success && progressResponse.data) {
          const progressData = Array.isArray(progressResponse.data) ? progressResponse.data : [];
          // Calculate progress based on completed exercises
          const totalCompleted = progressData?.reduce?.((sum: number, m: { exercises_completed?: number }) => sum + (m.exercises_completed || 0), 0) ?? 0;
          const totalPossible = progressData?.reduce?.((sum: number, m: { total_exercises?: number }) => sum + (m.total_exercises || 0), 0) ?? 0;
          const progressPercent = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;
          setProgress(progressPercent);
          setXp(totalCompleted * 10); // 10 XP per exercise

          // Get streak from localStorage or default to 0
          try {
            const streakFromStorage = localStorage.getItem('learnflow_streak');
            setStreak(streakFromStorage ? parseInt(streakFromStorage, 10) : 0);
          } catch {
            // localStorage might be unavailable
            setStreak(0);
          }
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Set safe fallback values (not hardcoded mocks)
        setExerciseCount(0);
        setProgress(0);
        setStreak(0);
        setXp(0);

        // Try to get saved values from localStorage
        try {
          const savedProgress = localStorage.getItem('learnflow_progress');
          if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            setExerciseCount(progress.exerciseCount || 0);
            setProgress(progress.progress || 0);
            setStreak(progress.streak || 0);
            setXp(progress.xp || 0);
          }
        } catch (e) {
          // Ignore localStorage errors
        }
      }
    };

    fetchDashboardData();
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Please log in...</p>
      </div>
    );
  }

  const modules = [
    {
      id: 1,
      title: 'Python Basics',
      description: 'Variables, types, and basic syntax',
      difficulty: 'Easy',
      difficultyColor: 'bg-success/20 text-success',
      progress: 75,
      icon: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
      iconColor: 'icon-container-primary',
    },
    {
      id: 2,
      title: 'Control Flow',
      description: 'If statements, loops, and logic',
      difficulty: 'Medium',
      difficultyColor: 'bg-warning/20 text-warning',
      progress: 40,
      icon: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>,
      iconColor: 'icon-container-accent',
    },
    {
      id: 3,
      title: 'Functions',
      description: 'Reusable code blocks',
      difficulty: 'Medium',
      difficultyColor: 'bg-warning/20 text-warning',
      progress: 20,
      icon: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 015.263 21h-4.017c-.163 0-.326-.02-.485-.06M7 20h.01" /></svg>,
      iconColor: 'icon-container-success',
    },
    {
      id: 4,
      title: 'Data Structures',
      description: 'Lists, dictionaries, and sets',
      difficulty: 'Hard',
      difficultyColor: 'bg-accent/20 text-accent',
      progress: 10,
      icon: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4m0 0c0 2.21 3.582 4 8 4s8-1.79 8-4" /></svg>,
      iconColor: 'icon-container-warning',
    },
    {
      id: 5,
      title: 'OOP',
      description: 'Classes and objects',
      difficulty: 'Hard',
      difficultyColor: 'bg-accent/20 text-accent',
      progress: 0,
      icon: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
      iconColor: 'icon-container-destructive',
    },
    {
      id: 6,
      title: 'File Handling',
      description: 'Read and write files',
      difficulty: 'Medium',
      difficultyColor: 'bg-warning/20 text-warning',
      progress: 0,
      icon: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.5a2 2 0 012 2v14a2 2 0 01-2 2h-5.5a2 2 0 01-2-2V9a2 2 0 012-2h5.5a2 2 0 012 2z" /></svg>,
      iconColor: 'icon-container-secondary',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="glass rounded-xl p-6 shadow-elevated">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {user.name}!
            </h1>
            <p className="mt-2 text-muted-foreground">
              Continue your Python learning journey
            </p>
          </div>
          <div className="hidden sm:block">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl icon-nebula-cyan">
              <svg className="h-8 w-8 text-cosmic-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">
                  Exercises
                </p>
                <div className="text-3xl font-bold text-foreground mt-2">{exerciseCount}</div>
                <p className="text-xs text-muted-foreground mt-1">Available challenges</p>
              </div>
              <div className="p-3 rounded-xl icon-container-primary">
                {Icons.Code}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">
                  Progress
                </p>
                <div className="text-3xl font-bold text-foreground mt-2">{progress}%</div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <div className="p-3 rounded-xl icon-container-accent">
                {Icons.TrendingUp}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">
                  Streak
                </p>
                <div className="text-3xl font-bold text-foreground mt-2">{streak}</div>
                <p className="text-xs text-muted-foreground mt-1">days in a row</p>
              </div>
              <div className="p-3 rounded-xl icon-container-warning">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v6m0 0v6m0-6h6m-6 0h6" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">
                  XP Points
                </p>
                <div className="text-3xl font-bold text-foreground mt-2">{xp.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">+{(xp / 25).toFixed(0)} this week</p>
              </div>
              <div className="p-3 rounded-xl icon-container-success">
                {Icons.Star}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Modules */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Learning Modules</h2>
          <Link href="/exercise">
            <Button variant="outline" className="border-2 border-cosmic-purple/50 bg-cosmic-purple/10 text-cosmic-purple hover:bg-cosmic-purple/20 hover:border-cosmic-purple/70">
              View all {Icons.ArrowRight}
            </Button>
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <Card key={module.id} className="hover-lift cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${module.iconColor}`}>
                      {module.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                      <span
                        className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${module.difficultyColor}`}
                      >
                        {module.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
                <CardDescription className="mt-2">{module.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold text-primary">{module.progress}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${module.progress}%` }}
                    />
                  </div>
                  <Link href={`/modules`} className="block">
                    <Button
                      className="w-full"
                      size="sm"
                    >
                      {module.progress > 0 ? (
                        <>
                          Continue {Icons.Play}
                        </>
                      ) : (
                        'Start Learning'
                      )}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-2xl font-bold">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link href="/exercise">
            <Card className="hover-lift cursor-pointer border-l-4 border-l-primary">
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl icon-container-primary">
                    {Icons.Code}
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-semibold text-lg">Practice Coding</h3>
                    <p className="text-sm text-muted-foreground">Work on Python exercises and improve your skills</p>
                  </div>
                  <div className="text-muted-foreground transition-transform group-hover:translate-x-1">
                    {Icons.ArrowRight}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/chat">
            <Card className="hover-lift cursor-pointer border-l-4 border-l-accent">
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl icon-container-accent">
                    {Icons.Chat}
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-semibold text-lg">Ask AI Tutor</h3>
                    <p className="text-sm text-muted-foreground">Get personalized help with Python concepts</p>
                  </div>
                  <div className="text-muted-foreground transition-transform group-hover:translate-x-1">
                    {Icons.ArrowRight}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="shadow-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: 'Completed', item: 'Python Basics - Exercise 3', time: '2 hours ago', icon: Icons.CheckCircle },
              { action: 'Started', item: 'Control Flow - Lesson 1', time: 'Yesterday', icon: Icons.Play },
              { action: 'Earned', item: '5 Day Streak Badge', time: '2 days ago', icon: Icons.Star },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 rounded-lg p-3 transition-all hover:bg-muted/50 hover-lift"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full icon-container-primary">
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.action}</span>{' '}
                    <span className="text-muted-foreground">{activity.item}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
