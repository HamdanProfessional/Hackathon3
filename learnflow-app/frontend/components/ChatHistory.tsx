import { useEffect, useRef } from 'react';
import { Monitor } from 'lucide-react';
import { useChatStore } from '@/stores/chatStore';
import MessageBubble from './MessageBubble';

export default function ChatHistory() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitializedRef = useRef(false);
  const { messages, isStreaming, currentStreamingMessage, initialize, isLoading } = useChatStore();

  // Initialize chat store on mount (load conversation history)
  useEffect(() => {
    if (!hasInitializedRef.current) {
      initialize();
      hasInitializedRef.current = true;
    }
  }, [initialize]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentStreamingMessage]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar">
      {isLoading && (
        <div className="flex h-full items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-sm text-muted-foreground">Loading chat history...</p>
          </div>
        </div>
      )}

      {!isLoading && messages.length === 0 && !isStreaming && (
        <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl gradient-nebula shadow-glow-purple mb-4">
            <Monitor className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">AI Python Tutor</h3>
          <p className="text-center max-w-md">
            Ask me anything about Python programming! I can help explain concepts, debug code, and guide you through exercises.
          </p>
        </div>
      )}

      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {isStreaming && currentStreamingMessage && (
        <div className="mb-4 flex justify-start">
          <div className="flex max-w-[80%] items-start space-x-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full icon-nebula-purple">
              <Monitor className="h-4 w-4 text-cosmic-purple" />
            </div>
            <div className="rounded-2xl bg-muted/50 border border-border/50 px-4 py-2 text-foreground">
              <p className="whitespace-pre-wrap text-sm">{currentStreamingMessage}</p>
              <span className="mt-1 block flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="flex h-2 w-2 animate-pulse rounded-full bg-cosmic-purple"></span>
                <span>AI is typing...</span>
              </span>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
