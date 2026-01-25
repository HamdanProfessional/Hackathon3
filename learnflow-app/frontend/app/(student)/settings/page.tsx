'use client';

import { useState } from 'react';
import { useUserStore } from '@/stores/userStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Icons
const Icons = {
  User: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Bell: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  Moon: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  ),
  Shield: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  Keyboard: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  ),
  CheckCircle: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export default function SettingsPage() {
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    reminders: true,
  });

  const [preferences, setPreferences] = useState({
    theme: 'dark',
    fontSize: 'medium',
    autoSave: true,
  });

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaveSuccess(false);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile Settings */}
      <Card className="shadow-subtle">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-primary">{Icons.User}</span>
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Role</p>
              <p className="text-xs text-muted-foreground">
                {user?.role === 'student' ? 'Student' : 'Teacher'}
              </p>
            </div>
            <Button onClick={handleSaveProfile} disabled={saving} className="min-w-[100px]">
              {saving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="shadow-subtle">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-primary">{Icons.Bell}</span>
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'email', label: 'Email Notifications', description: 'Receive updates via email' },
            { key: 'push', label: 'Push Notifications', description: 'Get notified in your browser' },
            { key: 'reminders', label: 'Learning Reminders', description: 'Daily practice reminders' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-foreground">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <button
                onClick={() => setNotifications((prev) => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  notifications[item.key as keyof typeof notifications] ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                    notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card className="shadow-subtle">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-primary">{Icons.Moon}</span>
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Theme</Label>
            <select
              value={preferences.theme}
              onChange={(e) => setPreferences((prev) => ({ ...prev, theme: e.target.value }))}
              className="w-full rounded-lg border-border bg-muted px-4 py-2.5 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="system">System Default</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Editor Font Size</Label>
            <select
              value={preferences.fontSize}
              onChange={(e) => setPreferences((prev) => ({ ...prev, fontSize: e.target.value }))}
              className="w-full rounded-lg border-border bg-muted px-4 py-2.5 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-foreground">Auto-save Code</p>
              <p className="text-sm text-muted-foreground">Automatically save your work</p>
            </div>
            <button
              onClick={() => setPreferences((prev) => ({ ...prev, autoSave: !prev.autoSave }))}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                preferences.autoSave ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                  preferences.autoSave ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card className="shadow-subtle">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-primary">{Icons.Shield}</span>
            Account Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex-1 border-2 border-cosmic-purple/40 bg-cosmic-purple/10 text-cosmic-purple hover:bg-cosmic-purple/20 hover:border-cosmic-purple/60">
              Change Password
            </Button>
            <Button variant="outline" className="flex-1 border-2 border-cosmic-blue/40 bg-cosmic-blue/10 text-cosmic-blue hover:bg-cosmic-blue/20 hover:border-cosmic-blue/60">
              Export Data
            </Button>
          </div>
          <div className="pt-4 border-t border-border">
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full sm:w-auto"
            >
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Keyboard Shortcuts */}
      <Card className="shadow-subtle">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-primary">{Icons.Keyboard}</span>
            Keyboard Shortcuts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 text-sm">
            {[
              { key: 'Ctrl + Enter', description: 'Run code' },
              { key: 'Ctrl + S', description: 'Save code' },
              { key: 'Ctrl + /', description: 'Toggle comment' },
              { key: 'Esc', description: 'Close modal' },
            ].map((shortcut) => (
              <div key={shortcut.key} className="flex items-center justify-between py-2">
                <span className="text-muted-foreground">{shortcut.description}</span>
                <kbd className="rounded border border-border bg-muted px-2 py-1 text-xs font-mono">
                  {shortcut.key}
                </kbd>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
