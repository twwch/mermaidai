import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Split from 'react-split';
import { MarkdownWithMermaid } from '../components/MarkdownWithMermaid';
import { MarkdownEditor } from '../components/MarkdownEditor';
import { MarkdownToolbar } from '../components/MarkdownToolbar';
import { Toast } from '../components/Toast';
import type { ToastType } from '../components/Toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export function MarkdownEditorPage() {
  const navigate = useNavigate();
  const [markdown, setMarkdown] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const handleInsertTemplate = (template: string) => {
    // 在当前光标位置插入模板文本
    setMarkdown(prev => {
      if (!prev) return template + '\n';
      return prev + '\n\n' + template + '\n';
    });
  };

  const handleExportPDF = async () => {
    if (!previewRef.current || !markdown.trim()) {
      setToast({ message: '请先输入一些内容再导出', type: 'warning' });
      return;
    }

    setIsExporting(true);

    try {
      // 等待足够时间确保所有 Mermaid 图表都已渲染完成
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 创建一个克隆容器用于导出
      const originalElement = previewRef.current.querySelector('.markdown-content');
      if (!originalElement) {
        throw new Error('无法找到内容元素');
      }

      // 创建临时容器
      const exportContainer = document.createElement('div');
      exportContainer.style.position = 'absolute';
      exportContainer.style.left = '-9999px';
      exportContainer.style.top = '0';
      exportContainer.style.width = '800px'; // 固定宽度，确保内容适配
      exportContainer.style.padding = '40px';
      exportContainer.style.backgroundColor = '#ffffff';
      exportContainer.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

      // 克隆内容
      const clonedContent = originalElement.cloneNode(true) as HTMLElement;

      // 清理所有可能包含 oklch 的样式
      const cleanColors = (element: HTMLElement) => {
        // 移除所有 class，避免 Tailwind 的 oklch 颜色
        element.removeAttribute('class');

        // 设置基本样式
        element.style.color = '#000000';
        element.style.backgroundColor = 'transparent';

        // 递归处理所有子元素
        Array.from(element.children).forEach(child => {
          if (child instanceof HTMLElement) {
            cleanColors(child);
          }
        });
      };

      cleanColors(clonedContent);

      // 添加基本样式
      clonedContent.style.cssText = `
        color: #000000;
        line-height: 1.6;
        font-size: 14px;
      `;

      // 处理特殊元素
      clonedContent.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
        const heading = h as HTMLElement;
        heading.style.cssText = `
          color: #000000;
          font-weight: bold;
          margin-top: 1em;
          margin-bottom: 0.5em;
        `;
      });

      clonedContent.querySelectorAll('p').forEach((p) => {
        const para = p as HTMLElement;
        para.style.cssText = `
          color: #000000;
          margin-bottom: 1em;
        `;
      });

      clonedContent.querySelectorAll('code').forEach((code) => {
        const codeEl = code as HTMLElement;
        codeEl.style.cssText = `
          color: #d63384;
          background-color: #f8f9fa;
          padding: 2px 6px;
          border-radius: 3px;
          font-family: monospace;
        `;
      });

      clonedContent.querySelectorAll('pre').forEach((pre) => {
        const preEl = pre as HTMLElement;
        preEl.style.cssText = `
          background-color: #f8f9fa;
          padding: 16px;
          border-radius: 6px;
          overflow: auto;
          margin: 1em 0;
        `;
      });

      clonedContent.querySelectorAll('table').forEach((table) => {
        const tableEl = table as HTMLElement;
        tableEl.style.cssText = `
          border-collapse: collapse;
          width: 100%;
          margin: 1em 0;
        `;
      });

      clonedContent.querySelectorAll('th, td').forEach((cell) => {
        const cellEl = cell as HTMLElement;
        cellEl.style.cssText = `
          border: 1px solid #dee2e6;
          padding: 8px;
          color: #000000;
        `;
      });

      // 处理 SVG（Mermaid 图表）
      clonedContent.querySelectorAll('svg').forEach((svg) => {
        const svgEl = svg as SVGElement;
        // 确保 SVG 有固定尺寸
        const width = svgEl.getAttribute('width') || '100%';
        const height = svgEl.getAttribute('height') || 'auto';
        svgEl.setAttribute('width', width);
        svgEl.setAttribute('height', height);

        // 清理 SVG 内的样式
        svgEl.querySelectorAll('*').forEach(el => {
          if (el instanceof SVGElement) {
            el.removeAttribute('class');
          }
        });
      });

      exportContainer.appendChild(clonedContent);
      document.body.appendChild(exportContainer);

      // 使用 html2canvas 捕获
      const canvas = await html2canvas(exportContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 800,
        allowTaint: true,
      });

      // 清理临时容器
      document.body.removeChild(exportContainer);

      // 创建 PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = 297; // A4 height in mm
      const pageWidth = pdfWidth - 20; // 留出边距
      const pageHeight = pdfHeight - 20;

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      // 如果内容高度超过一页，分页处理
      if (imgHeight <= pageHeight) {
        // 内容适合一页
        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      } else {
        // 需要分页
        const totalPages = Math.ceil(imgHeight / pageHeight);

        for (let page = 0; page < totalPages; page++) {
          if (page > 0) {
            pdf.addPage();
          }

          const sourceY = (canvas.height / totalPages) * page;
          const sourceHeight = Math.min(
            canvas.height / totalPages,
            canvas.height - sourceY
          );

          // 创建临时 canvas 用于裁剪
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = canvas.width;
          tempCanvas.height = sourceHeight;
          const ctx = tempCanvas.getContext('2d');

          if (ctx) {
            ctx.drawImage(
              canvas,
              0, sourceY, canvas.width, sourceHeight,
              0, 0, canvas.width, sourceHeight
            );

            const pageImgData = tempCanvas.toDataURL('image/png');
            const pageImgHeight = (sourceHeight * pageWidth) / canvas.width;
            pdf.addImage(pageImgData, 'PNG', 10, 10, imgWidth, pageImgHeight);
          }
        }
      }

      // 保存 PDF
      pdf.save(`markdown-${Date.now()}.pdf`);

      // 显示成功提示
      setToast({ message: 'PDF 导出成功！', type: 'success' });
    } catch (error) {
      console.error('PDF export error:', error);
      setToast({
        message: '导出 PDF 失败: ' + (error instanceof Error ? error.message : '未知错误'),
        type: 'error'
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Toast 提示 */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* 顶部工具栏 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-900 transition-colors"
            title="返回首页"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900">
            Markdown + Mermaid 编辑器
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>导出中...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>导出 PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 编辑器和预览区域 */}
      <div className="flex-1 overflow-hidden">
        <Split
          className="flex h-full"
          sizes={[50, 50]}
          minSize={300}
          gutterSize={8}
          gutterStyle={() => ({
            backgroundColor: '#e5e7eb',
            cursor: 'col-resize',
          })}
        >
          {/* 左侧编辑器 */}
          <div className="flex flex-col bg-white">
            {/* 工具栏 */}
            <MarkdownToolbar onInsert={handleInsertTemplate} />

            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-700">编辑器</h2>
              <button
                onClick={() => setMarkdown(`# 示例文档

欢迎使用 Markdown + Mermaid 编辑器！

## 功能特性

- ✅ 完整的 Markdown 语法支持
- ✅ 内嵌 Mermaid 流程图渲染
- ✅ 实时预览
- ✅ 导出为 PDF

## 流程图示例

\`\`\`mermaid
graph TD
    A[开始] --> B{是否登录?}
    B -->|是| C[显示主页]
    B -->|否| D[跳转登录页]
    C --> E[结束]
    D --> E
\`\`\`

## 序列图示例

\`\`\`mermaid
sequenceDiagram
    participant 用户
    participant 前端
    participant 后端

    用户->>前端: 发送请求
    前端->>后端: 转发请求
    后端-->>前端: 返回数据
    前端-->>用户: 显示结果
\`\`\`

## 表格示例

| 功能 | 状态 | 优先级 |
|------|------|--------|
| Markdown 渲染 | ✅ | 高 |
| Mermaid 支持 | ✅ | 高 |
| PDF 导出 | ✅ | 中 |

## 代码示例

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

**提示**: 清空内容开始编辑，或修改这个示例文档。
`)}
                className="text-xs text-blue-600 hover:text-blue-700 hover:underline"
              >
                加载示例
              </button>
            </div>
            <div className="flex-1">
              <MarkdownEditor
                value={markdown}
                onChange={setMarkdown}
                placeholder="在这里输入 Markdown 内容..."
              />
            </div>
          </div>

          {/* 右侧预览 */}
          <div className="flex flex-col bg-white">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-700">预览</h2>
            </div>
            <div className="flex-1 overflow-y-auto" ref={previewRef}>
              <div className="p-6 min-h-full">
                <MarkdownWithMermaid content={markdown} />
              </div>
            </div>
          </div>
        </Split>
      </div>

      {/* 底部提示 */}
      <div className="bg-gray-100 border-t border-gray-200 px-6 py-2 text-xs text-gray-600">
        <span className="mr-4">
          💡 <strong>提示:</strong> 使用 <code className="px-1 py-0.5 bg-gray-200 rounded">```mermaid</code> 代码块来添加流程图
        </span>
        <span>
          📖 <a href="https://mermaid.js.org/intro/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            Mermaid 语法文档
          </a>
        </span>
      </div>
    </div>
  );
}
