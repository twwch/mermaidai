import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import mermaid from 'mermaid';

interface MarkdownWithMermaidProps {
  content: string;
  className?: string;
}

export function MarkdownWithMermaid({ content, className = '' }: MarkdownWithMermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 初始化 Mermaid
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      logLevel: 'error',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    });
  }, []);

  useEffect(() => {
    const renderMermaidDiagrams = async () => {
      if (!containerRef.current) return;

      const mermaidElements = containerRef.current.querySelectorAll('.language-mermaid');

      for (let i = 0; i < mermaidElements.length; i++) {
        const element = mermaidElements[i] as HTMLElement;
        const code = element.textContent || '';

        try {
          const id = `mermaid-${Date.now()}-${i}`;
          const { svg } = await mermaid.render(id, code);

          // 创建容器来包裹 SVG
          const wrapper = document.createElement('div');
          wrapper.className = 'mermaid-diagram-wrapper my-6 p-4 bg-white rounded-lg border border-gray-200 overflow-x-auto';
          wrapper.innerHTML = svg;

          // 替换原来的 code 元素
          if (element.parentElement?.tagName === 'PRE') {
            element.parentElement.replaceWith(wrapper);
          } else {
            element.replaceWith(wrapper);
          }
        } catch (err) {
          console.error('Mermaid render error:', err);
          // 保留原始代码块，添加错误提示
          const errorDiv = document.createElement('div');
          errorDiv.className = 'my-6 p-4 bg-red-50 border border-red-200 rounded-lg';
          errorDiv.innerHTML = `
            <div class="flex items-start gap-2">
              <span class="text-red-600">⚠️</span>
              <div>
                <div class="font-semibold text-red-800 mb-1">渲染失败</div>
                <div class="text-sm text-red-600">${err instanceof Error ? err.message : '未知错误'}</div>
              </div>
            </div>
            <details class="mt-3">
              <summary class="cursor-pointer text-sm text-red-700 hover:text-red-800">查看源码</summary>
              <pre class="mt-2 p-2 bg-red-100 rounded text-xs overflow-x-auto"><code>${code}</code></pre>
            </details>
          `;

          if (element.parentElement?.tagName === 'PRE') {
            element.parentElement.replaceWith(errorDiv);
          } else {
            element.replaceWith(errorDiv);
          }
        }
      }
    };

    // 延迟渲染以确保 DOM 已更新
    const timeoutId = setTimeout(renderMermaidDiagrams, 100);
    return () => clearTimeout(timeoutId);
  }, [content]);

  // 如果内容为空，显示空状态
  if (!content || !content.trim()) {
    return (
      <div className={`markdown-content ${className} flex items-center justify-center w-full h-full min-h-[400px]`}>
        <div className="text-center text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-lg font-medium">在左侧输入内容开始编辑</p>
          <p className="text-sm mt-2">支持 Markdown 和 Mermaid 图表</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // 自定义代码块渲染
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            const inline = !match;

            // Mermaid 代码块将在 useEffect 中处理
            if (language === 'mermaid') {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }

            // 其他代码块正常渲染
            if (!inline && match) {
              return (
                <pre className="my-4 p-4 bg-gray-50 rounded-lg border border-gray-200 overflow-x-auto">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              );
            }

            // 行内代码
            return (
              <code className="px-1.5 py-0.5 bg-gray-100 rounded text-sm font-mono text-pink-600" {...props}>
                {children}
              </code>
            );
          },
          // 标题样式
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold text-gray-900 mb-4 mt-8 first:mt-0 pb-2 border-b-2 border-gray-200">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-6 pb-2 border-b border-gray-200">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-bold text-gray-900 mb-2 mt-5">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg font-semibold text-gray-900 mb-2 mt-4">
              {children}
            </h4>
          ),
          // 段落样式
          p: ({ children }) => (
            <p className="text-gray-700 leading-relaxed mb-4">
              {children}
            </p>
          ),
          // 列表样式
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="ml-4">
              {children}
            </li>
          ),
          // 引用样式
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 text-gray-700 italic">
              {children}
            </blockquote>
          ),
          // 链接样式
          a: ({ children, href }) => (
            <a
              href={href}
              className="text-blue-600 hover:text-blue-800 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          // 表格样式
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-100">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-300 px-4 py-2 text-gray-700">
              {children}
            </td>
          ),
          // 水平线
          hr: () => (
            <hr className="my-8 border-t-2 border-gray-300" />
          ),
          // 图片
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt}
              className="max-w-full h-auto rounded-lg shadow-md my-4"
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
