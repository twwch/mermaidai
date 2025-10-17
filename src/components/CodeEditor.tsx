import Editor, { type OnMount } from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function CodeEditor({ value, onChange, className = '' }: CodeEditorProps) {
  const handleEditorWillMount: OnMount = (_editor, monaco) => {
    // 注册 Mermaid 语言定义
    monaco.languages.register({ id: 'mermaid' });

    // 设置 Mermaid 语法高亮规则
    monaco.languages.setMonarchTokensProvider('mermaid', {
      defaultToken: '',
      tokenPostfix: '.mermaid',

      keywords: [
        'graph', 'flowchart', 'sequenceDiagram', 'classDiagram', 'stateDiagram',
        'erDiagram', 'gantt', 'pie', 'journey', 'gitGraph', 'mindmap', 'timeline',
        'quadrantChart', 'sankey', 'xyChart', 'block-beta',
        'subgraph', 'end', 'participant', 'activate', 'deactivate',
        'note', 'loop', 'alt', 'else', 'opt', 'par', 'and', 'rect',
        'class', 'click', 'callback', 'link', 'style', 'classDef',
        'direction', 'TB', 'TD', 'BT', 'RL', 'LR',
        'section', 'title', 'dateFormat', 'axisFormat',
      ],

      operators: [
        '-->', '--->', '-.->',  '--', '---', '-.-',
        '==>', '==>',
        '->>', '->>', '-->', '-->>', '-x', '--x',
        '|', '||', 'o--o', 'o==o',
        '>>', '<<', '+', '-', '#',
      ],

      symbols: /[=><!~?:&|+\-*/^%]+/,
      escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

      tokenizer: {
        root: [
          // 图表类型声明
          [/^(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|gantt|pie|journey|gitGraph|mindmap|timeline|quadrantChart|sankey|xyChart|block-beta)\b/, 'keyword'],

          // 关键字
          [/\b(subgraph|end|participant|activate|deactivate|note|loop|alt|else|opt|par|and|rect|class|click|callback|link|style|classDef|direction|section|title|dateFormat|axisFormat)\b/, 'keyword'],

          // 方向
          [/\b(TB|TD|BT|RL|LR)\b/, 'keyword'],

          // 节点标识符 (字母数字下划线)
          [/[A-Za-z_][\w]*/, {
            cases: {
              '@keywords': 'keyword',
              '@default': 'identifier'
            }
          }],

          // 字符串
          [/"([^"\\]|\\.)*$/, 'string.invalid'],  // 未闭合的字符串
          [/"/, 'string', '@string_double'],
          [/'([^'\\]|\\.)*$/, 'string.invalid'],  // 未闭合的字符串
          [/'/, 'string', '@string_single'],
          [/\[/, 'string', '@string_bracket'],
          [/\(/, 'string', '@string_paren'],
          [/\{/, 'string', '@string_brace'],

          // 注释
          [/%%.*$/, 'comment'],

          // 运算符和箭头
          [/-->|---|===>|==>|\.\.>|\.\.|->>|->>|->>|-->>|-->>|-x|--x|o--o|o==o/, 'operator'],
          [/[=><!~?:&|+\-*/^%]/, 'operator'],

          // 数字
          [/\d+/, 'number'],

          // 分隔符
          [/[;,.]/, 'delimiter'],

          // 空白字符
          [/[ \t\r\n]+/, ''],
        ],

        string_double: [
          [/[^\\"]+/, 'string'],
          [/@escapes/, 'string.escape'],
          [/\\./, 'string.escape.invalid'],
          [/"/, 'string', '@pop']
        ],

        string_single: [
          [/[^\\']+/, 'string'],
          [/@escapes/, 'string.escape'],
          [/\\./, 'string.escape.invalid'],
          [/'/, 'string', '@pop']
        ],

        string_bracket: [
          [/[^\]]+/, 'string'],
          [/\]/, 'string', '@pop']
        ],

        string_paren: [
          [/[^)]+/, 'string'],
          [/\)/, 'string', '@pop']
        ],

        string_brace: [
          [/[^}]+/, 'string'],
          [/\}/, 'string', '@pop']
        ],
      },
    });

    // 设置主题颜色
    monaco.editor.defineTheme('mermaid-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '0000FF', fontStyle: 'bold' },
        { token: 'identifier', foreground: '000000' },
        { token: 'string', foreground: 'A31515' },
        { token: 'comment', foreground: '008000', fontStyle: 'italic' },
        { token: 'operator', foreground: '000000' },
        { token: 'number', foreground: '098658' },
        { token: 'delimiter', foreground: '000000' },
      ],
      colors: {
        'editor.foreground': '#000000',
        'editor.background': '#FFFFFF',
        'editorCursor.foreground': '#000000',
        'editor.lineHighlightBackground': '#F5F5F5',
        'editorLineNumber.foreground': '#999999',
        'editor.selectionBackground': '#ADD6FF',
        'editor.inactiveSelectionBackground': '#E5EBF1',
      }
    });

    // 配置语言特性
    monaco.languages.setLanguageConfiguration('mermaid', {
      comments: {
        lineComment: '%%',
      },
      brackets: [
        ['{', '}'],
        ['[', ']'],
        ['(', ')']
      ],
      autoClosingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
      ],
      surroundingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
      ],
    });
  };

  return (
    <div className={`${className} border border-gray-200 rounded-lg overflow-hidden`}>
      <Editor
        height="100%"
        defaultLanguage="mermaid"
        language="mermaid"
        value={value}
        onChange={(val) => onChange(val || '')}
        theme="mermaid-light"
        onMount={handleEditorWillMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          wrappingIndent: 'indent',
          automaticLayout: true,
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
          folding: true,
          foldingStrategy: 'indentation',
          showFoldingControls: 'always',
          matchBrackets: 'always',
          autoClosingBrackets: 'always',
          autoClosingQuotes: 'always',
        }}
      />
    </div>
  );
}
