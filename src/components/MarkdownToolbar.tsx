interface MarkdownToolbarProps {
  onInsert: (text: string) => void;
}

interface ToolButton {
  icon: string;
  label: string;
  template: string;
  description: string;
}

const tools: ToolButton[] = [
  {
    icon: 'H1',
    label: '标题 1',
    template: '# ',
    description: '插入一级标题',
  },
  {
    icon: 'H2',
    label: '标题 2',
    template: '## ',
    description: '插入二级标题',
  },
  {
    icon: 'H3',
    label: '标题 3',
    template: '### ',
    description: '插入三级标题',
  },
  {
    icon: 'B',
    label: '粗体',
    template: '**粗体文本**',
    description: '插入粗体文本',
  },
  {
    icon: 'I',
    label: '斜体',
    template: '*斜体文本*',
    description: '插入斜体文本',
  },
  {
    icon: '≡',
    label: '列表',
    template: '- 列表项 1\n- 列表项 2\n- 列表项 3',
    description: '插入无序列表',
  },
  {
    icon: '1.',
    label: '有序列表',
    template: '1. 第一项\n2. 第二项\n3. 第三项',
    description: '插入有序列表',
  },
  {
    icon: '[]',
    label: '待办',
    template: '- [ ] 待办事项 1\n- [ ] 待办事项 2\n- [x] 已完成事项',
    description: '插入待办列表',
  },
  {
    icon: '📊',
    label: '表格',
    template: '| 列1 | 列2 | 列3 |\n|-----|-----|-----|\n| 数据1 | 数据2 | 数据3 |\n| 数据4 | 数据5 | 数据6 |',
    description: '插入表格',
  },
  {
    icon: '</>',
    label: '代码',
    template: '```javascript\n// 你的代码\nconsole.log("Hello");\n```',
    description: '插入代码块',
  },
  {
    icon: '💬',
    label: '引用',
    template: '> 这是一段引用文本',
    description: '插入引用',
  },
  {
    icon: '🔗',
    label: '链接',
    template: '[链接文本](https://example.com)',
    description: '插入链接',
  },
  {
    icon: '🖼️',
    label: '图片',
    template: '![图片描述](图片URL)',
    description: '插入图片',
  },
  {
    icon: '📈',
    label: 'Mermaid',
    template: '```mermaid\ngraph TD\n    A[开始] --> B{条件}\n    B -->|是| C[执行]\n    B -->|否| D[结束]\n    C --> D\n```',
    description: '插入 Mermaid 流程图',
  },
  {
    icon: '---',
    label: '分隔线',
    template: '\n---\n',
    description: '插入分隔线',
  },
];

export function MarkdownToolbar({ onInsert }: MarkdownToolbarProps) {
  return (
    <div className="flex items-center gap-1 px-4 py-2 bg-white border-b border-gray-200 overflow-x-auto">
      {tools.map((tool, index) => (
        <button
          key={index}
          onClick={() => onInsert(tool.template)}
          className="flex flex-col items-center justify-center min-w-[50px] px-2 py-1.5 text-gray-700 hover:bg-gray-100 rounded transition-colors group relative"
          title={tool.description}
        >
          <span className="text-sm font-semibold">{tool.icon}</span>
          <span className="text-xs text-gray-500 whitespace-nowrap">{tool.label}</span>

          {/* Tooltip */}
          <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
            {tool.description}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
          </div>
        </button>
      ))}
    </div>
  );
}
