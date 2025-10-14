import { useState, useEffect } from 'react';
import { CodeEditor } from './CodeEditor';
import { MermaidRenderer } from './MermaidRenderer';
import { ChatPanel } from './ChatPanel';
import { HistoryDrawer } from './HistoryDrawer';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';
import { refineMermaidCode } from '../services/ai';
import { Save, Download, History, Sparkles } from 'lucide-react';

export function DiagramEditor() {
  const { currentDiagram, updateDiagram, addHistory } = useStore();
  const [code, setCode] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentLayout, setCurrentLayout] = useState<'dagre' | 'elk'>('dagre');
  const [currentTheme, setCurrentTheme] = useState<'default' | 'neutral' | 'dark' | 'forest' | 'base'>('default');

  useEffect(() => {
    if (currentDiagram) {
      setCode(currentDiagram.mermaid_code);
      // 加载该流程图保存的布局和主题配置
      const newLayout = (currentDiagram.layout as 'dagre' | 'elk') || 'dagre';
      const newTheme = (currentDiagram.theme as 'default' | 'neutral' | 'dark' | 'forest' | 'base') || 'default';
      setCurrentLayout(newLayout);
      setCurrentTheme(newTheme);
    }
  }, [currentDiagram]);

  const handleSave = async () => {
    if (!currentDiagram) return;

    try {
      setIsSaving(true);
      const { error } = await supabase
        .from('diagrams')
        // @ts-ignore - Supabase type inference issue
        .update({
          mermaid_code: code,
          layout: currentLayout,
          theme: currentTheme,
          updated_at: new Date().toISOString(),
        })
        .eq('id', currentDiagram.id);

      if (error) throw error;

      updateDiagram(currentDiagram.id, {
        mermaid_code: code,
        layout: currentLayout,
        theme: currentTheme,
        updated_at: new Date().toISOString(),
      });

      // 添加历史记录
      const { data: historyData, error: historyError } = await supabase
        .from('diagram_history')
        .insert({
          diagram_id: currentDiagram.id,
          mermaid_code: code,
          user_prompt: '手动保存',
          layout: currentLayout,
          theme: currentTheme,
        } as any)
        .select()
        .single();

      if (!historyError && historyData) {
        addHistory(historyData);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('保存失败');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentDiagram?.name || 'diagram'}.mmd`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAIRefine = async (prompt: string) => {
    if (!currentDiagram) return;

    try {
      const newCode = await refineMermaidCode(code, prompt);
      setCode(newCode);

      // 保存到数据库
      await supabase
        .from('diagrams')
        // @ts-ignore - Supabase type inference issue
        .update({
          mermaid_code: newCode,
          layout: currentLayout,
          theme: currentTheme,
          updated_at: new Date().toISOString(),
        })
        .eq('id', currentDiagram.id);

      // 添加历史记录
      const { data: historyData } = await supabase
        .from('diagram_history')
        .insert({
          diagram_id: currentDiagram.id,
          mermaid_code: newCode,
          user_prompt: prompt,
          ai_response: '已生成新版本',
          layout: currentLayout,
          theme: currentTheme,
        } as any)
        .select()
        .single();

      if (historyData) {
        addHistory(historyData);
      }

      updateDiagram(currentDiagram.id, {
        mermaid_code: newCode,
        layout: currentLayout,
        theme: currentTheme,
        updated_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error('AI refine error:', error);
      throw error;
    }
  };

  const handleRestoreHistory = (restoredCode: string) => {
    setCode(restoredCode);
  };

  if (!currentDiagram) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-lg">选择一个流程图或创建新的流程图</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* 工具栏 */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">
          {currentDiagram.name}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowChat(!showChat)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            AI 助手
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <History className="w-4 h-4" />
            历史记录
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? '保存中...' : '保存'}
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            导出
          </button>
        </div>
      </div>

      {/* 编辑器区域 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧代码编辑器 - 30% 宽度 */}
        <div className="w-[30%] border-r border-gray-200 p-4 overflow-x-auto">
          <div className="h-full min-w-[400px]">
            <CodeEditor value={code} onChange={setCode} className="h-full" />
          </div>
        </div>

        {/* 右侧预览区域 - 70% 宽度 */}
        <div className="w-[70%] bg-gradient-to-br from-gray-50 to-gray-100 p-6">
          <div className="h-full bg-white rounded-xl shadow-lg border border-gray-200">
            <MermaidRenderer
              key={currentDiagram?.id}
              code={code}
              className="h-full"
              initialLayout={currentLayout}
              initialTheme={currentTheme}
              onLayoutChange={setCurrentLayout}
              onThemeChange={setCurrentTheme}
            />
          </div>
        </div>
      </div>

      {/* AI 对话面板 */}
      {showChat && (
        <ChatPanel
          onClose={() => setShowChat(false)}
          onRefine={handleAIRefine}
        />
      )}

      {/* 历史记录抽屉 */}
      <HistoryDrawer
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        diagramId={currentDiagram.id}
        onRestore={handleRestoreHistory}
      />
    </div>
  );
}
