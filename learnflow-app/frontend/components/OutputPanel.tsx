import { CheckCircle, XCircle, Info, Loader2, Terminal } from 'lucide-react';
import { useCodeStore } from '@/stores/codeStore';

export default function OutputPanel() {
  const { output, error, isRunning } = useCodeStore();

  const getOutputStatus = () => {
    if (isRunning) return 'running';
    if (error) return 'error';
    if (output) return 'success';
    return 'idle';
  };

  const status = getOutputStatus();

  return (
    <div className="flex h-full flex-col bg-card/50 backdrop-blur-sm rounded-xl border border-border shadow-elevated overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-card/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg icon-nebula-cyan">
            <Terminal className="h-4 w-4 text-cosmic-cyan" />
          </div>
          <span className="text-sm font-semibold text-foreground">Output</span>
          {isRunning && (
            <span className="flex items-center gap-1.5 text-xs text-cosmic-cyan">
              <span className="flex h-2 w-2 animate-pulse rounded-full bg-cosmic-cyan"></span>
              Running...
            </span>
          )}
        </div>
        {status === 'success' && (
          <CheckCircle className="h-5 w-5 text-success" />
        )}
        {status === 'error' && (
          <XCircle className="h-5 w-5 text-destructive" />
        )}
        {status === 'idle' && (
          <Info className="h-5 w-5 text-muted-foreground" />
        )}
      </div>

      {/* Output Content */}
      <div className="flex-1 overflow-auto p-4 font-mono text-sm custom-scrollbar">
        {isRunning && (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p>Executing your code...</p>
            </div>
          </div>
        )}

        {!isRunning && status === 'idle' && (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <div className="flex flex-col items-center space-y-3 text-center">
              <Terminal className="h-12 w-12 opacity-30" />
              <p>Click &quot;Run&quot; to execute your code and see the output here.</p>
            </div>
          </div>
        )}

        {!isRunning && output && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-foreground break-words bg-muted/30 rounded-lg p-4 border border-border/50">
              <code>{output}</code>
            </pre>
          </div>
        )}

        {!isRunning && error && (
          <div className="space-y-2">
            <div className="flex items-start gap-2 rounded-lg bg-destructive/10 border border-destructive/30 p-4">
              <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <pre className="whitespace-pre-wrap text-destructive break-words flex-1">
                {error}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
