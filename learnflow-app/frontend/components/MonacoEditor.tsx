'use client';

import { useRef } from 'react';

// Dynamic import with correct pattern for @monaco-editor/react
import dynamic from 'next/dynamic';

const MonacoEditorComp = dynamic(
  () => import('@monaco-editor/react'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center bg-card">
        <svg className="h-8 w-8 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0l4 4-4-4z" />
        </svg>
      </div>
    ),
  }
);

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  readOnly?: boolean;
  height?: string;
}

export default function CodeEditor({
  value,
  onChange,
  language = 'python',
  readOnly = false,
  height = '100%',
}: CodeEditorProps) {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
  };

  return (
    <div className="h-full w-full bg-card">
      <MonacoEditorComp
        height={height}
        language={language}
        value={value}
        onChange={(value) => onChange(value || '')}
        theme="vs-dark"
        onMount={handleEditorDidMount}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          lineHeight: 22,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 4,
          insertSpaces: true,
          wordWrap: 'on',
          formatOnPaste: true,
          formatOnType: true,
          autoIndent: 'full',
          suggest: {
            showKeywords: true,
            showSnippets: true,
          },
          quickSuggestions: {
            other: true,
            comments: true,
            strings: true,
          },
          parameterHints: {
            enabled: true,
          },
          folding: true,
          foldingStrategy: 'indentation',
          showFoldingControls: 'always',
          matchBrackets: 'always',
          autoClosingBrackets: 'always',
          autoClosingQuotes: 'always',
          renderLineHighlight: 'all',
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          smoothScrolling: true,
          padding: { top: 16 },
        }}
      />
    </div>
  );
}
