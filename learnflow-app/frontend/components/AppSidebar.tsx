'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/stores/userStore';
import { useChatStore } from '@/stores/chatStore';
import ChatSidebar, { FloatingChatButton } from './ChatSidebar';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

// Lucide-style SVG icons
const Icons = {
  Dashboard: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  Exercise: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  Chat: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  Progress: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  Settings: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Logout: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 0v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  ChevronLeft: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  ),
  ChevronRight: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  Menu: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
};

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: Icons.Dashboard },
  { name: 'Exercises', href: '/exercise', icon: Icons.Exercise },
  { name: 'AI Tutor', href: '/chat', icon: Icons.Chat },
  { name: 'Progress', href: '/progress', icon: Icons.Progress },
  { name: 'Settings', href: '/settings', icon: Icons.Settings },
];

export function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-screen flex-col bg-card text-card-foreground transition-all duration-300',
          'border-r border-border shadow-elevated',
          isCollapsed ? 'w-sidebar-collapsed' : 'w-sidebar',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo Section */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4 bg-primary">
          {!isCollapsed && (
            <Link href="/dashboard" className="flex items-center space-x-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-card shadow-lg group-hover:shadow-xl transition-all">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <span className="text-lg font-bold text-primary-foreground">LearnFlow</span>
            </Link>
          )}
          {isCollapsed && (
            <Link href="/dashboard" className="flex items-center justify-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-card shadow-lg">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
            </Link>
          )}
          <button
            onClick={toggleSidebar}
            className="rounded-lg p-2 text-primary-foreground transition-all hover:bg-primary-foreground/20"
            aria-label="Toggle sidebar"
          >
            {isCollapsed ? Icons.ChevronRight : Icons.ChevronLeft}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-2 custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group flex items-center rounded-lg px-3 py-2.5 transition-all duration-200',
                  'relative overflow-hidden',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-medium'
                    : 'text-foreground hover:bg-muted hover:scale-[1.02] hover-lift',
                  isCollapsed ? 'justify-center' : 'justify-start'
                )}
                onClick={() => setIsMobileOpen(false)}
              >
                {/* Active indicator */}
                {isActive && !isCollapsed && (
                  <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full bg-primary-foreground shadow-lg" />
                )}

                <span className={cn(
                  "transition-transform group-hover:scale-110",
                  isActive ? "text-primary-foreground" : "text-primary group-hover:text-accent"
                )}>
                  {item.icon}
                </span>

                {!isCollapsed && (
                  <>
                    <span className="ml-3 font-medium">{item.name}</span>
                    {item.badge && item.badge > 0 && (
                      <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 hidden rounded-lg bg-card border border-border px-3 py-1.5 text-sm text-foreground shadow-xl opacity-0 group-hover:lg:block group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="border-t border-border p-4">
          {!isCollapsed ? (
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                <span className="text-sm font-bold text-primary-foreground" suppressHydrationWarning>
                  {user?.name?.[0].toUpperCase() || 'S'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium text-foreground" suppressHydrationWarning>
                  {user?.name || 'Student'}
                </p>
                <p className="truncate text-xs text-muted-foreground" suppressHydrationWarning>
                  {user?.email || 'student@example.com'}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                <span className="text-sm font-bold text-primary-foreground" suppressHydrationWarning>
                  {user?.name?.[0].toUpperCase() || 'S'}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className={cn(
              'mt-3 flex w-full items-center rounded-lg px-3 py-2 transition-all',
              'text-foreground hover:bg-destructive/20 hover:text-destructive hover-lift',
              isCollapsed ? 'justify-center' : 'justify-start space-x-3'
            )}
          >
            <span className="text-destructive">{Icons.Logout}</span>
            {!isCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden lg:ml-sidebar">
        {/* Mobile Header */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-card/80 backdrop-blur-sm lg:hidden">
          <div className="flex items-center px-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-lg p-2 text-foreground transition-colors hover:bg-muted"
              aria-label="Open menu"
            >
              {Icons.Menu}
            </button>
            <Link href="/dashboard" className="ml-3 flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <svg className="h-4 w-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <span className="text-lg font-bold text-foreground">LearnFlow</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>

      {/* Chat Sidebar */}
      <ChatSidebar isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* Floating Chat Button */}
      <FloatingChatButton
        isOpen={isChatOpen}
        onClick={() => setIsChatOpen(true)}
        messageCount={useChatStore.getState().messages.length}
      />
    </div>
  );
}
