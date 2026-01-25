import { useChatStore } from '@/stores/chatStore';
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';
import { Button } from '@/components/ui/button';

export default function ChatLayout() {
  const { clearMessages, messages } = useChatStore();

  return (
    <div className="flex h-full flex-col bg-card/80 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 bg-card/50 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-nebula">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">AI Python Tutor</h1>
            <p className="text-xs text-muted-foreground">
              Ask questions and get personalized help
            </p>
          </div>
        </div>
        <Button
          onClick={clearMessages}
          variant="outline"
          size="sm"
          className="border-cosmic-purple/30 hover:border-cosmic-purple/60 hover:bg-cosmic-purple/10 text-foreground"
          disabled={messages.length === 0}
        >
          Clear Chat
        </Button>
      </div>

      {/* Chat Messages */}
      <ChatHistory />

      {/* Chat Input */}
      <ChatInput />
    </div>
  );
}
