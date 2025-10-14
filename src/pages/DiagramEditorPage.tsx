import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CodeEditor } from '../components/CodeEditor';
import { MermaidRenderer } from '../components/MermaidRenderer';
import { ChatPanel } from '../components/ChatPanel';
import { HistoryDrawer } from '../components/HistoryDrawer';
import { supabase } from '../lib/supabase';
import { refineMermaidCode } from '../services/ai';
import { Save, Download, History, Sparkles, ArrowLeft } from 'lucide-react';
import type { Diagram } from '../types';

export function DiagramEditorPage() {
  const navigate = useNavigate();
  const { projectId, diagramId } = useParams<{ projectId: string; diagramId: string }>();
  const [diagram, setDiagram] = useState<Diagram | null>(null);
  const [code, setCode] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentLayout, setCurrentLayout] = useState<'dagre' | 'elk'>('dagre');
  const [currentTheme, setCurrentTheme] = useState<'default' | 'neutral' | 'dark' | 'forest' | 'base'>('default');

  useEffect(() => {
    if (diagramId) {
      loadDiagram();
    }
  }, [diagramId]);

  const loadDiagram = async () => {
    if (!diagramId) return;

    const { data, error } = await supabase
      .from('diagrams')
      .select('*')
      .eq('id', diagramId)
      .single();

    if (error) {
      console.error('Load diagram error:', error);
      return;
    }

    if (data) {
      // @ts-ignore - Supabase type inference issue
      setDiagram(data);
      // @ts-ignore - Supabase type inference issue
      setCode(data.mermaid_code);
      // @ts-ignore - Supabase type inference issue
      setCurrentLayout((data.layout as 'dagre' | 'elk') || 'dagre');
      // @ts-ignore - Supabase type inference issue
      setCurrentTheme((data.theme as 'default' | 'neutral' | 'dark' | 'forest' | 'base') || 'default');
    }
  };

  const handleSave = async () => {
    if (!diagram) return;

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
        .eq('id', diagram.id);

      if (error) throw error;

      // 添加历史记录
      const { error: historyError } = await supabase
        .from('diagram_history')
        .insert({
          diagram_id: diagram.id,
          mermaid_code: code,
          user_prompt: '手动保存',
          layout: currentLayout,
          theme: currentTheme,
        } as any)
        .select()
        .single();

      if (historyError) console.error('History error:', historyError);

      // 更新本地状态
      setDiagram({
        ...diagram,
        mermaid_code: code,
        layout: currentLayout,
        theme: currentTheme,
        updated_at: new Date().toISOString(),
      });
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
    a.download = `${diagram?.name || 'diagram'}.mmd`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAIRefine = async (prompt: string) => {
    if (!diagram) return;

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
        .eq('id', diagram.id);

      // 添加历史记录
      await supabase
        .from('diagram_history')
        .insert({
          diagram_id: diagram.id,
          mermaid_code: newCode,
          user_prompt: prompt,
          ai_response: '已生成新版本',
          layout: currentLayout,
          theme: currentTheme,
        } as any)
        .select()
        .single();

      setDiagram({
        ...diagram,
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

  if (!diagram) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">
      {/* 顶部导航栏 */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/project/${projectId}`)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h2 className="text-lg font-semibold text-gray-800">
            {diagram.name}
          </h2>
        </div>
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
      </header>

      {/* 编辑器区域 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧代码编辑器 - 30% 宽度 */}
        <div className="w-[30%] border-r border-gray-200 p-4 overflow-x-auto bg-white">
          <div className="h-full min-w-[400px]">
            <CodeEditor value={code} onChange={setCode} className="h-full" />
          </div>
        </div>

        {/* 右侧预览区域 - 70% 宽度 */}
        <div className="w-[70%] bg-gradient-to-br from-gray-50 to-gray-100 p-6">
          <div className="h-full bg-white rounded-xl shadow-lg border border-gray-200">
            <MermaidRenderer
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
        diagramId={diagram.id}
        onRestore={handleRestoreHistory}
      />
    </div>
  );
}
