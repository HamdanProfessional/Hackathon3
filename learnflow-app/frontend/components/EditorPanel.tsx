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

export default function EditorPanel({
  onRun,
  onSubmit,
  onHint,
  showSubmit = true,
  showHint = true,
  starterCode = '',
}: EditorPanelProps) {
  const { code, setCode, runCode, isRunning } = useCodeStore();

  const handleRun = () => {
    if (onRun) {
      onRun();
    } else {
      runCode();
    }
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    // Auto-save to localStorage
    try {
      localStorage.setItem('learnflow_code', newCode);
    } catch (e) {
      // Ignore localStorage errors
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border shadow-elevated bg-card">
      <EditorToolbar
        onRun={handleRun}
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
