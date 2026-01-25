import { ReactNode } from 'react';
import TeacherNav from '@/components/TeacherNav';

export default function TeacherLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Nebula background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cosmic-purple/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cosmic-blue/10 rounded-full blur-3xl" />
      </div>

      {/* Navigation Bar */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <a href="/teacher/dashboard" className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-nebula opacity-30 blur-lg rounded-lg" />
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-lg gradient-nebula">
                    <span className="text-lg font-bold text-white">L</span>
                  </div>
                </div>
                <span className="text-xl font-bold text-gradient">LearnFlow</span>
                <span className="ml-2 rounded-full bg-cosmic-purple/20 border border-cosmic-purple/30 px-2.5 py-0.5 text-xs font-semibold text-cosmic-purple">
                  Teacher
                </span>
              </a>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex md:items-center md:space-x-1">
              <a
                href="/teacher/dashboard"
                className="rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-cosmic-purple/10"
              >
                Dashboard
              </a>
              <a
                href="/dashboard"
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/50"
              >
                Student View
              </a>
            </div>

            {/* User Menu */}
            <TeacherNav />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
