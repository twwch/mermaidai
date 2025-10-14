import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function CodeEditor({ value, onChange, className = '' }: CodeEditorProps) {
  return (
    <div className={`${className} border border-gray-200 rounded-lg overflow-hidden`}>
      <Editor
        height="100%"
        defaultLanguage="mermaid"
        language="markdown"
        value={value}
        onChange={(val) => onChange(val || '')}
        theme="vs-light"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          wrappingIndent: 'indent',
          automaticLayout: true,
        }}
      />
    </div>
  );
}
