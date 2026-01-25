import { User, Bot, AlertCircle, GitBranch, BookOpen, Bug, Pencil, BarChart } from 'lucide-react';
import type { Message } from '@/types';

// Agent icons
const AgentIcon = ({ type }: { type: string }) => {
  const icons = {
    triage: <GitBranch className="h-3 w-3" />,
    concepts: <BookOpen className="h-3 w-3" />,
    debug: <Bug className="h-3 w-3" />,
    exercise: <Pencil className="h-3 w-3" />,
    progress: <BarChart className="h-3 w-3" />,
  };
  return icons[type as keyof typeof icons] || null;
};

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center py-2">
        <div className="flex items-center gap-2 rounded-full bg-destructive/20 border border-destructive/30 px-4 py-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-[85%] items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${
          isUser
            ? 'gradient-nebula shadow-glow-purple'
            : 'icon-nebula-purple'
        }`}>
          {isUser ? (
            <User className="h-5 w-5 text-white" />
          ) : (
            <Bot className="h-5 w-5 text-cosmic-purple" />
          )}
        </div>

        {/* Message Content */}
        <div className={`rounded-2xl px-4 py-2.5 ${
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted/60 border border-border/50 text-foreground'
        }`}>
          {message.agentType && !isUser && (
            <span className="mb-1.5 block text-xs font-medium text-cosmic-purple flex items-center gap-1">
              <AgentIcon type={message.agentType} />
              {message.agentType.charAt(0).toUpperCase() + message.agentType.slice(1)} Agent
            </span>
          )}
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
          <span className={`mt-1.5 block text-xs ${
            isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
          }`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
}
