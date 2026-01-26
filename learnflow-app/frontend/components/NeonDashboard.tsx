'use client';

import { useEffect, useState } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: string;
  glowColor?: 'cyan' | 'magenta' | 'green' | 'error';
}

function StatCard({ title, value, change, trend, icon, glowColor = 'cyan' }: StatCardProps) {
  const glowClass = {
    cyan: 'neon-glow',
    magenta: 'neon-glow-accent',
    green: 'neon-glow-success',
    error: 'neon-glow-error',
  }[glowColor];

  const borderClass = {
    cyan: 'neon-border',
    magenta: 'neon-border-accent',
    green: 'neon-border-success',
    error: 'neon-border',
  }[glowColor];

  return (
    <div className={`glass-dark ${borderClass} rounded-xl p-6 hover-glow slide-in-up`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold text-foreground font-mono">
            {value}
          </p>
          {change && trend && (
            <div className="mt-2 flex items-center space-x-1">
              <span className={`text-sm font-medium ${
                trend === 'up' ? 'text-success' :
                trend === 'down' ? 'text-destructive' :
                'text-muted-foreground'
              }`}>
                {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {change}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${glowClass} bg-muted/50`}>
            <span className="text-2xl">{icon}</span>
          </div>
        )}
      </div>
    </div>
  );
}

interface ChartBarProps {
  label: string;
  value: number;
  max: number;
  color?: 'cyan' | 'magenta' | 'green';
}

function ChartBar({ label, value, max, color = 'cyan' }: ChartBarProps) {
  const percentage = (value / max) * 100;
  const colorClass = {
    cyan: 'bg-primary',
    magenta: 'bg-secondary',
    green: 'bg-success',
  }[color];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono text-foreground">{value}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full ${colorClass} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

interface ActivityItemProps {
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  description: string;
  time: string;
}

function ActivityItem({ type, title, description, time }: ActivityItemProps) {
  const statusClass = {
    success: 'status-online',
    warning: 'status-warning',
    error: 'status-offline',
    info: 'bg-primary',
  }[type];

  return (
    <div className="flex items-start space-x-3 rounded-lg p-3 transition-colors hover:bg-muted/30">
      <div className={`mt-1 h-2 w-2 rounded-full ${statusClass} pulse-neon`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
        <p className="mt-1 text-xs text-muted-foreground/60">{time}</p>
      </div>
    </div>
  );
}

export function NeonDashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="shimmer-neon h-12 w-12 rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen grid-pattern">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-dark border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-neon neon-glow">
                <span className="text-lg font-bold text-background">L</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-neon">LearnFlow</h1>
                <p className="text-xs text-muted-foreground">Analytics Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg neon-border">
                <div className="status-online h-2 w-2 rounded-full" />
                <span className="text-xs text-success font-medium">System Online</span>
              </div>
              <div className="h-8 w-8 rounded-full gradient-neon flex items-center justify-center">
                <span className="text-sm font-bold">JD</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Users"
              value="12,847"
              change="+12.5%"
              trend="up"
              icon="US"
              glowColor="cyan"
            />
            <StatCard
              title="Active Sessions"
              value="1,429"
              change="+8.2%"
              trend="up"
              icon="AS"
              glowColor="magenta"
            />
            <StatCard
              title="Completion Rate"
              value="87.3%"
              change="-2.1%"
              trend="down"
              icon="CR"
              glowColor="green"
            />
            <StatCard
              title="Avg. Session"
              value="24m 32s"
              change="+5.4%"
              trend="up"
              icon="TM"
              glowColor="cyan"
            />
          </div>

          {/* Main Panels Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Performance Chart */}
            <div className="lg:col-span-2 glass-dark neon-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Learning Progress</h2>
                  <p className="text-sm text-muted-foreground">Weekly module completion</p>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-xs rounded-md bg-primary/20 text-primary neon-border">
                    Week
                  </button>
                  <button className="px-3 py-1 text-xs rounded-md bg-muted/30 text-muted-foreground hover:bg-muted/50">
                    Month
                  </button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <ChartBar label="Python Basics" value={156} max={200} color="cyan" />
                <ChartBar label="Control Flow" value={132} max={200} color="magenta" />
                <ChartBar label="Functions" value={98} max={200} color="green" />
                <ChartBar label="Data Structures" value={87} max={200} color="cyan" />
                <ChartBar label="OOP" value={64} max={200} color="magenta" />
                <ChartBar label="File Handling" value={45} max={200} color="green" />
              </div>
            </div>

            {/* Activity Feed */}
            <div className="glass-dark neon-border-accent rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Live Activity</h2>
                  <p className="text-sm text-muted-foreground">Real-time updates</p>
                </div>
                <div className="flex h-2 w-2">
                  <div className="status-online h-2 w-2 rounded-full animate-ping" />
                  <div className="status-online h-2 w-2 rounded-full relative" />
                </div>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                <ActivityItem
                  type="success"
                  title="Exercise Completed"
                  description="User finished Python Basics Quiz"
                  time="2 min ago"
                />
                <ActivityItem
                  type="info"
                  title="New User Registered"
                  description="Student account created"
                  time="5 min ago"
                />
                <ActivityItem
                  type="warning"
                  title="Struggle Detected"
                  description="User stuck on Functions module"
                  time="12 min ago"
                />
                <ActivityItem
                  type="success"
                  title="Badge Earned"
                  description="5-day streak achievement"
                  time="18 min ago"
                />
                <ActivityItem
                  type="error"
                  title="Code Execution Failed"
                  description="Syntax error detected"
                  time="25 min ago"
                />
                <ActivityItem
                  type="info"
                  title="AI Tutor Session"
                  description="Help requested with loops"
                  time="32 min ago"
                />
              </div>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="glass-dark rounded-xl p-6 neon-border">
            <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <button className="group flex items-center space-x-3 rounded-lg p-4 transition-all hover:bg-primary/10 hover-glow">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 neon-glow">
                  <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-foreground">New Exercise</span>
              </button>

              <button className="group flex items-center space-x-3 rounded-lg p-4 transition-all hover:bg-secondary/10 hover-glow">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/20 neon-glow-accent">
                  <svg className="h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-foreground">View Reports</span>
              </button>

              <button className="group flex items-center space-x-3 rounded-lg p-4 transition-all hover:bg-success/10 hover-glow">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/20 neon-glow-success">
                  <svg className="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-foreground">Students</span>
              </button>

              <button className="group flex items-center space-x-3 rounded-lg p-4 transition-all hover:bg-accent/10 hover-glow">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20" style={{ boxShadow: '0 0 20px rgba(123, 97, 255, 0.3)' }}>
                  <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-foreground">Settings</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
