import Editor from '@monaco-editor/react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const handleEditorChange = (value: string | undefined) => {
    onChange(value || '');
  };

  return (
    <Editor
      height="100%"
      defaultLanguage="markdown"
      value={value}
      onChange={handleEditorChange}
      theme="vs-light"
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineHeight: 24,
        padding: { top: 16, bottom: 16 },
        wordWrap: 'on',
        wrappingStrategy: 'advanced',
        scrollBeyondLastLine: false,
        smoothScrolling: true,
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: 'on',
        fontFamily: "'Fira Code', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
        fontLigatures: true,
        formatOnPaste: true,
        formatOnType: true,
        renderWhitespace: 'selection',
        tabSize: 2,
        insertSpaces: true,
        quickSuggestions: {
          other: true,
          comments: false,
          strings: false,
        },
        suggest: {
          showWords: true,
          showSnippets: true,
        },
        bracketPairColorization: {
          enabled: true,
        },
      }}
    />
  );
}
