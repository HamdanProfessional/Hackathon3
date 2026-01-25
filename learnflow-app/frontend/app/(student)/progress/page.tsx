'use client';

import { useState, useEffect } from 'react';
import { useUserStore } from '@/stores/userStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Icon components
const TrophyIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const TargetIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

const AwardIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="12" cy="8" r="7" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
);

const CodeIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

interface Module {
  id: string;
  name: string;
  progress: number;
  mastery: 'Beginner' | 'Learning' | 'Proficient' | 'Mastered';
  exercisesCompleted: number;
  totalExercises: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  earnedAt: string;
  icon: React.ReactNode;
}

export default function ProgressPage() {
  const user = useUserStore((state) => state.user);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  // Mock data
  const modules: Module[] = [
    {
      id: '1',
      name: 'Python Basics',
      progress: 75,
      mastery: 'Proficient',
      exercisesCompleted: 6,
      totalExercises: 8,
    },
    {
      id: '2',
      name: 'Control Flow',
      progress: 40,
      mastery: 'Learning',
      exercisesCompleted: 2,
      totalExercises: 5,
    },
    {
      id: '3',
      name: 'Functions',
      progress: 20,
      mastery: 'Beginner',
      exercisesCompleted: 1,
      totalExercises: 5,
    },
    {
      id: '4',
      name: 'Data Structures',
      progress: 10,
      mastery: 'Beginner',
      exercisesCompleted: 0,
      totalExercises: 6,
    },
    {
      id: '5',
      name: 'OOP',
      progress: 0,
      mastery: 'Beginner',
      exercisesCompleted: 0,
      totalExercises: 4,
    },
    {
      id: '6',
      name: 'File Handling',
      progress: 0,
      mastery: 'Beginner',
      exercisesCompleted: 0,
      totalExercises: 3,
    },
  ];

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first exercise',
      earnedAt: '2 days ago',
      icon: <AwardIcon />,
    },
    {
      id: '2',
      title: 'Code Warrior',
      description: 'Complete 5 exercises',
      earnedAt: '1 day ago',
      icon: <TrophyIcon />,
    },
    {
      id: '3',
      title: 'On Fire!',
      description: 'Maintain a 5-day streak',
      earnedAt: 'Today',
      icon: <TargetIcon />,
    },
  ];

  const getMasteryColor = (mastery: string) => {
    switch (mastery) {
      case 'Beginner':
        return 'bg-destructive/20 text-destructive';
      case 'Learning':
        return 'bg-warning/20 text-warning';
      case 'Proficient':
        return 'bg-success/20 text-success';
      case 'Mastered':
        return 'bg-primary/20 text-primary';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const overallProgress = Math.round(
    modules.reduce((acc, m) => acc + m.progress, 0) / modules.length
  );

  const totalExercisesCompleted = modules.reduce((acc, m) => acc + m.exercisesCompleted, 0);
  const totalExercises = modules.reduce((acc, m) => acc + m.totalExercises, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Your Progress</h1>
        <p className="mt-2 text-muted-foreground">
          Track your learning journey and achievements
        </p>
      </div>

      {/* Overall Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-lift shadow-subtle">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">
                  Overall Progress
                </p>
                <div className="text-3xl font-bold text-foreground mt-2">{overallProgress}%</div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
              </div>
              <div className="p-3 rounded-xl icon-container-primary">
                <TrendingUpIcon />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift shadow-subtle">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">
                  Exercises
                </p>
                <div className="text-3xl font-bold text-foreground mt-2">
                  {totalExercisesCompleted}/{totalExercises}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round((totalExercisesCompleted / totalExercises) * 100)}% complete
                </p>
              </div>
              <div className="p-3 rounded-xl icon-container-success">
                <CodeIcon />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift shadow-subtle">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">
                  Current Streak
                </p>
                <div className="text-3xl font-bold text-foreground mt-2">5</div>
                <p className="text-xs text-muted-foreground mt-1">days in a row</p>
              </div>
              <div className="p-3 rounded-xl icon-container-warning">
                <CalendarIcon />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift shadow-subtle">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">
                  Achievements
                </p>
                <div className="text-3xl font-bold text-foreground mt-2">{achievements.length}</div>
                <p className="text-xs text-muted-foreground mt-1">badges earned</p>
              </div>
              <div className="p-3 rounded-xl icon-container-accent">
                <TrophyIcon />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Module Progress */}
      <div>
        <h2 className="mb-4 text-2xl font-bold">Module Progress</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <Card key={module.id} className="hover-lift shadow-subtle">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{module.name}</CardTitle>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getMasteryColor(module.mastery)}`}>
                    {module.mastery}
                  </span>
                </div>
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
                  <p className="text-xs text-muted-foreground">
                    {module.exercisesCompleted} of {module.totalExercises} exercises completed
                  </p>
                  <Link href={`/exercise/${module.id}`} className="block">
                    <Button className="w-full border-2 border-cosmic-cyan/40 bg-cosmic-cyan/10 text-cosmic-cyan hover:bg-cosmic-cyan/20 hover:border-cosmic-cyan/60" size="sm" variant="outline">
                      {module.progress > 0 ? 'Continue' : 'Start Learning'} <ChevronRightIcon />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Achievements */}
      <div>
        <h2 className="mb-4 text-2xl font-bold">Recent Achievements</h2>
        <Card className="shadow-elevated">
          <CardContent className="p-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-start space-x-4 rounded-lg p-4 border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full icon-container-accent">
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{achievement.earnedAt}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
