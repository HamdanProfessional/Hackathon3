import { useCallback, useRef, useEffect } from 'react';
import { useCodeStore } from '@/stores/codeStore';
import CodeEditor from './MonacoEditor';
import EditorToolbar from './EditorToolbar';

interface EditorPanelProps {
  onRun?: () => void;
  onSubmit?: () => void;
  onHint?: () => void;
  showSubmit?: boolean;
  showHint?: boolean;
  starterCode?: string;
}

// Debounce timeout in milliseconds
const AUTOSAVE_DEBOUNCE_MS = 1000;

export default function EditorPanel({
  onRun,
  onSubmit,
  onHint,
  showSubmit = true,
  showHint = true,
  starterCode = '',
}: EditorPanelProps) {
  const { code, setCode, runCode, isRunning } = useCodeStore();
  const autosaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }
    };
  }, []);

  // Debounced auto-save to localStorage with quota handling
  const saveToLocalStorage = useCallback((codeToSave: string) => {
    try {
      localStorage.setItem('learnflow_code', codeToSave);
    } catch (e) {
      // Handle QuotaExceededError specifically
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        console.error('LocalStorage quota exceeded, attempting cleanup...');
        // Try to free up space by removing old data
        try {
          const keys = Object.keys(localStorage);
          // Keep only the most recent item
          if (keys.length > 1) {
            keys.forEach((key, index) => {
              if (index < keys.length - 1 && key !== 'learnflow_streak') {
                localStorage.removeItem(key);
              }
            });
            // Retry saving after cleanup
            localStorage.setItem('learnflow_code', codeToSave);
          }
        } catch (retryError) {
          console.error('Failed to save code even after cleanup:', retryError);
        }
      } else if (e instanceof DOMException && e.name === 'SecurityError') {
        // Private browsing mode - expected, no action needed
        console.debug('localStorage unavailable (private browsing mode)');
      } else {
        console.error('Failed to save code to localStorage:', e);
      }
    }
  }, []);

  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);

    // Clear previous timeout
    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }

    // Set new timeout for auto-save (debounced by 1 second)
    autosaveTimeoutRef.current = setTimeout(() => {
      saveToLocalStorage(newCode);
    }, AUTOSAVE_DEBOUNCE_MS);
  }, [setCode, saveToLocalStorage]);

  // Define local handleRun if no prop provided
  const localHandleRun = useCallback(() => {
    runCode();
  }, [runCode]);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border shadow-elevated bg-card">
      <EditorToolbar
        onRun={onRun || localHandleRun}
        onSubmit={onSubmit}
        onHint={onHint}
        showSubmit={showSubmit}
        showHint={showHint}
        isRunning={isRunning}
      />

      <div className="flex-1 overflow-hidden">
        <CodeEditor
          value={code || starterCode}
          onChange={handleCodeChange}
          language="python"
        />
      </div>
    </div>
  );
}
