'use client';

import { useEffect, useState, useRef } from 'react';
import ClassOverview from '@/components/ClassOverview';
import StruggleAlerts from '@/components/StruggleAlerts';
import AssignmentGenerator from '@/components/AssignmentGenerator';
import type { ClassOverview as ClassOverviewType, StruggleAlert, Exercise } from '@/types';
import { api } from '@/lib/api';
import { Activity, Wifi, WifiOff, Sparkles, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Empty state for when no data is available
const emptyClassOverview: ClassOverviewType = {
  totalStudents: 0,
  activeToday: 0,
  strugglingCount: 0,
  averageMastery: 0,
  topPerformers: [],
  strugglingStudents: [],
};

export default function TeacherDashboardPage() {
  const [classOverview, setClassOverview] = useState<ClassOverviewType | null>(null);
  const [alerts, setAlerts] = useState<StruggleAlert[]>([]);
  const [assignments, setAssignments] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState<string | null>(null);

  // Refs to store EventSource instances for cleanup
  const alertsEventSource = useRef<EventSource | null>(null);
  const statsEventSource = useRef<EventSource | null>(null);

  useEffect(() => {
    // Get class ID from user context or environment
    // In production, teachers have their class ID assigned to their account
    const classId = process.env.NEXT_PUBLIC_DEFAULT_CLASS_ID || 'class-1';

    // Track if component is mounted to prevent state updates after unmount
    let isMounted = true;
    let sseTimeout: ReturnType<typeof setTimeout> | null = null;

    const loadData = async () => {
      if (!isMounted) return;

      setIsLoading(true);
      setError(null);

      try {
        // Fetch class overview
        const overviewResponse = await api.getClassOverview(classId);
        if (!isMounted) return;

        if (overviewResponse.success && overviewResponse.data) {
          setClassOverview(overviewResponse.data);
        } else {
          setClassOverview(emptyClassOverview);
          setError(overviewResponse.error || 'Failed to load class overview');
        }

        // Fetch alerts
        const alertsResponse = await api.getStruggleAlerts(classId, false);
        if (!isMounted) return;

        if (alertsResponse.success && alertsResponse.data) {
          setAlerts(alertsResponse.data.alerts || []);
        } else {
          setAlerts([]);
          console.warn('Failed to load alerts:', alertsResponse.error);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('Failed to load data:', err);
        setClassOverview(emptyClassOverview);
        setAlerts([]);
        setError('Failed to connect to server. Please check your connection.');
      }

      if (isMounted) {
        setIsLoading(false);
      }
    };

    loadData();

    // Set up SSE for real-time alerts
    const setupSSE = () => {
      if (!isMounted) return;

      // Subscribe to struggle alerts stream
      try {
        alertsEventSource.current = api.subscribeToStruggleAlerts(
          classId,
          (alert) => {
            if (!isMounted) return;
            // New alert received
            setAlerts((prev) => {
              // Check if alert already exists
              const exists = prev.some((a) => a.id === alert.id);
              if (!exists) {
                // Play notification sound (optional)
                try {
                  const audio = new Audio('/notification.mp3');
                  audio.volume = 0.3;
                  audio.play().catch(() => {
                    // Ignore autoplay errors
                  });
                } catch {
                  // Ignore audio errors
                }
                return [alert, ...prev];
              }
              return prev;
            });
            setLastUpdate(new Date());
          },
          (error) => {
            if (!isMounted) return;
            console.error('SSE alerts error:', error);
            setIsLive(false);
          }
        );

        // Subscribe to class stats stream
        statsEventSource.current = api.subscribeToClassStats(
          classId,
          (stats) => {
            if (!isMounted) return;
            setClassOverview(stats);
            setLastUpdate(new Date());
          },
          (error) => {
            if (!isMounted) return;
            console.error('SSE stats error:', error);
            setIsLive(false);
          }
        );

        if (isMounted) {
          setIsLive(true);
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('Failed to set up SSE:', error);
        setIsLive(false);
      }
    };

    // Start SSE after initial data loads
    sseTimeout = setTimeout(setupSSE, 1000);

    // Cleanup function
    return () => {
      isMounted = false;
      if (sseTimeout) {
        clearTimeout(sseTimeout);
      }
      if (alertsEventSource.current) {
        alertsEventSource.current.close();
        alertsEventSource.current = null;
      }
      if (statsEventSource.current) {
        statsEventSource.current.close();
        statsEventSource.current = null;
      }
    };
  }, []);

  const handleResolveAlert = async (alertId: string) => {
    await api.resolveAlert(alertId);
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
  };

  const handleAssignmentCreated = (exercise: Exercise) => {
    setAssignments((prev) => [exercise, ...prev]);
    setActiveTab('overview');
  };

  const handleRetry = () => {
    const classId = 'class-1';
    setError(null);
    setIsLoading(true);

    api.getClassOverview(classId).then((response) => {
      if (response.success && response.data) {
        setClassOverview(response.data);
        setError(null);
      } else {
        setError(response.error || 'Failed to load data');
      }
      setIsLoading(false);
    }).catch(() => {
      setError('Failed to connect to server');
      setIsLoading(false);
    });
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
      {/* Welcome Header with Live Indicator */}
      <div className="glass rounded-xl p-6 shadow-elevated">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gradient">
                Teacher Dashboard
              </h1>
              <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                isLive
                  ? 'bg-success/20 text-success border border-success/30 animate-pulse'
                  : 'bg-muted text-muted-foreground border border-border'
              }`}>
                {isLive ? (
                  <>
                    <Activity className="h-3 w-3 animate-pulse" />
                    <span>Live</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="h-3 w-3" />
                    <span>Offline</span>
                  </>
                )}
              </div>
            </div>
            <p className="mt-2 text-muted-foreground">
              Monitor your class progress and help struggling students
            </p>
            {lastUpdate && (
              <p className="mt-1 text-xs text-muted-foreground/70">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {error && (
              <Button onClick={handleRetry} variant="outline" size="sm" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Retry
              </Button>
            )}
            <div className="hidden sm:block">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl icon-nebula-purple">
                <svg className="h-8 w-8 text-cosmic-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="p-6 border-destructive/50 bg-destructive/10">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/20">
              <WifiOff className="h-5 w-5 text-destructive" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-destructive">Connection Error</h3>
              <p className="text-sm text-destructive/80 mt-1">{error}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Unable to connect to the backend service. Please check that the services are running.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Tabs for Dashboard Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="glass p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Overview
          </TabsTrigger>
          <TabsTrigger value="alerts" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Alerts {alerts.length > 0 && `(${alerts.length})`}
          </TabsTrigger>
          <TabsTrigger value="create" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Create Assignment
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Class Overview */}
          {classOverview && (
            <div>
              <ClassOverview overview={classOverview} />
              {classOverview.totalStudents === 0 && !error && (
                <Card className="mt-6 p-8 text-center">
                  <p className="text-muted-foreground">No students enrolled yet. Share your class code to get started!</p>
                </Card>
              )}
            </div>
          )}

          {/* Recent Assignments */}
          {assignments.length > 0 && (
            <div className="glass rounded-xl p-6 shadow-elevated">
              <h3 className="mb-4 text-xl font-bold text-foreground">Recent Assignments</h3>
              <div className="space-y-3">
                {assignments.map((assignment) => (
                  <div key={assignment.id} className="flex items-center justify-between rounded-lg bg-black/20 p-4">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{assignment.title}</p>
                      <p className="text-sm text-muted-foreground">{assignment.topic} • {assignment.difficulty}</p>
                    </div>
                    <span className="rounded-full bg-primary/20 px-3 py-1 text-sm font-medium text-primary">
                      {assignment.points} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="alerts">
          {/* Struggle Alerts */}
          <div>
            <h2 className="mb-4 text-2xl font-bold text-foreground flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg icon-container-destructive">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </span>
              Struggle Alerts
              {alerts.length > 0 && (
                <span className="rounded-full bg-destructive/20 border border-destructive/30 px-3 py-1 text-sm font-semibold text-destructive">
                  {alerts.length}
                </span>
              )}
            </h2>
            {alerts.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No alerts at the moment. Your students are doing great!</p>
              </Card>
            ) : (
              <StruggleAlerts alerts={alerts} onResolve={handleResolveAlert} />
            )}
          </div>
        </TabsContent>

        <TabsContent value="create">
          <AssignmentGenerator onAssignmentCreated={handleAssignmentCreated} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
