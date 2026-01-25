'use client';

import { useEffect, useState } from 'react';
import ChatLayout from '@/components/ChatLayout';
import { useUserStore } from '@/stores/userStore';

export default function ChatPage() {
  const user = useUserStore((state) => state.user);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <p className="text-muted-foreground">Please log in to access the AI tutor...</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <ChatLayout />
    </div>
  );
}
