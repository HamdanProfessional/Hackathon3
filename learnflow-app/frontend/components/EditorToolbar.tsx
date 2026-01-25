import { Play, RotateCcw, Lightbulb, Send, Loader2 } from 'lucide-react';
import { useCodeStore } from '@/stores/codeStore';
import { Button } from '@/components/ui/button';

interface EditorToolbarProps {
  onRun: () => void;
  onSubmit?: () => void;
  onHint?: () => void;
  showSubmit?: boolean;
  showHint?: boolean;
  isRunning?: boolean;
}

export default function EditorToolbar({
  onRun,
  onSubmit,
  onHint,
  showSubmit = true,
  showHint = true,
  isRunning = false,
}: EditorToolbarProps) {
  const { code, resetCode } = useCodeStore();

  const handleReset = () => {
    resetCode();
    try {
      localStorage.removeItem('learnflow_code');
    } catch (e) {
      // Ignore localStorage errors
    }
  };

  return (
    <div className="flex items-center justify-between border-b border-border bg-card/50 backdrop-blur-sm px-4 py-3">
      <div className="flex items-center gap-2">
        <Button
          onClick={onRun}
          disabled={isRunning || !code?.trim()}
          size="sm"
          variant="success"
          className="gap-2 shadow-glow-purple/20"
        >
          {isRunning ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          <span>{isRunning ? 'Running...' : 'Run'}</span>
        </Button>

        {showSubmit && onSubmit && (
          <Button
            onClick={onSubmit}
            disabled={!code?.trim() || isRunning}
            size="sm"
            variant="cosmic"
            className="gap-2"
          >
            <Send className="h-4 w-4" />
            <span>Submit</span>
          </Button>
        )}

        {showHint && onHint && (
          <Button
            onClick={onHint}
            disabled={isRunning}
            variant="outline"
            size="sm"
            className="gap-2 border-2 border-cosmic-purple/60 bg-cosmic-purple/15 text-cosmic-purple hover:bg-cosmic-purple/25 hover:border-cosmic-purple shadow-glow-purple/20"
          >
            <Lightbulb className="h-4 w-4" />
            <span>Hint</span>
          </Button>
        )}

        <Button
          onClick={handleReset}
          disabled={isRunning}
          variant="outline"
          size="sm"
          className="gap-2 border-2 border-border/60 bg-muted/50 text-muted-foreground hover:bg-muted hover:border-border"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reset</span>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg icon-nebula-purple">
          <svg className="h-4 w-4 text-cosmic-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <span className="text-sm font-medium text-muted-foreground">Python 3</span>
      </div>
    </div>
  );
}
