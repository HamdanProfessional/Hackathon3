'use client';

import { useState } from 'react';
import { useChatStore } from '@/stores/chatStore';
import { Button } from '@/components/ui/button';
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';
import { X, MessageCircle, Trash2 } from 'lucide-react';

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatSidebar({ isOpen, onClose }: ChatSidebarProps) {
  const { messages } = useChatStore();

  return (
    <>
      {/* Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col bg-card border-l border-border/50 shadow-elevated">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/50 bg-card/50 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-nebula">
                <MessageCircle className="h-4 w-4 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground">AI Python Tutor</h2>
                {messages.length > 0 && (
                  <p className="text-xs text-muted-foreground">{messages.length} messages</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                onClick={() => useChatStore.getState().clearMessages()}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground h-8 w-8 p-0"
                disabled={messages.length === 0}
                title="Clear chat"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground h-8 w-8 p-0"
                title="Close chat"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Chat Messages */}
          <ChatHistory />

          {/* Chat Input */}
          <ChatInput />
        </div>
      </div>
    </>
  );
}

// Floating Chat Button Component (separate so it can always be visible)
interface FloatingChatButtonProps {
  isOpen: boolean;
  onClick: () => void;
  messageCount?: number;
}

export function FloatingChatButton({ isOpen, onClick, messageCount = 0 }: FloatingChatButtonProps) {
  // Don't render if sidebar is open
  if (isOpen) return null;

  return (
    <button
      onClick={onClick}
      className="fixed right-6 bottom-6 z-30 flex h-14 w-14 items-center justify-center rounded-full gradient-nebula shadow-glow-purple text-white hover-glow transition-all duration-300 hover:scale-110"
      title="Open AI Tutor"
    >
      <MessageCircle className="h-6 w-6" />
      {messageCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-bold">
          {messageCount}
        </span>
      )}
    </button>
  );
}

// Hook to control chat sidebar from parent components
export function useChatSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return {
    isOpen,
    openChat: () => setIsOpen(true),
    closeChat: () => setIsOpen(false),
    toggleChat: () => setIsOpen(prev => !prev),
  };
}
