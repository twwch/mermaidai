import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Clock, User, RotateCcw, Code, Eye, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import mermaid from 'mermaid';
import type { DiagramHistory } from '../types';

// 全局队列锁，确保串行渲染
let renderQueue = Promise.resolve();

// 简化的安全 Mermaid 渲染组件
function SafeMermaidRenderer({
  code,
  itemId,
  layout = 'dagre',
  theme = 'default',
}: {
  code: string;
  itemId: string;
  layout?: string;
  theme?: string;
}) {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    let mounted = true;
    setError(null);
    setRendered(false);

    const renderDiagram = async () => {
      if (!containerRef.current || !mounted) return;

      // 加入队列，等待前面的渲染完成
      renderQueue = renderQueue.then(async () => {
        if (!mounted) return;

        try {
        // 清空容器
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }

        // 生成唯一 ID
        const id = `mermaid-history-${itemId}`;

        // 根据布局类型配置参数
        const config: any = layout === 'elk'
          ? {
              startOnLoad: false,
              theme: theme,
              flowchart: {
                curve: 'linear',
                htmlLabels: true,
                padding: 20,
                nodeSpacing: 50,
                rankSpacing: 60,
                useMaxWidth: true,
                defaultRenderer: 'elk',
              },
              elk: {
                nodePlacementStrategy: 'SIMPLE',
                mergeEdges: true,
              },
              themeVariables: {
                fontSize: '14px',
                fontFamily: 'Arial, sans-serif',
                primaryColor: '#4F46E5',
                primaryTextColor: '#fff',
                primaryBorderColor: '#4338CA',
                lineColor: '#6366F1',
                secondaryColor: '#10B981',
                tertiaryColor: '#F59E0B',
                strokeWidth: '2px',
              },
              securityLevel: 'loose',
              logLevel: 'fatal',
            }
          : {
              startOnLoad: false,
              theme: theme,
              flowchart: {
                curve: 'linear',
                htmlLabels: true,
                padding: 20,
                nodeSpacing: 50,
                rankSpacing: 60,
                useMaxWidth: true,
              },
              themeVariables: {
                fontSize: '14px',
                fontFamily: 'Arial, sans-serif',
                primaryColor: '#4F46E5',
                primaryTextColor: '#fff',
                primaryBorderColor: '#4338CA',
                lineColor: '#6366F1',
                secondaryColor: '#10B981',
                tertiaryColor: '#F59E0B',
                strokeWidth: '2px',
              },
              securityLevel: 'loose',
              logLevel: 'fatal',
            };

        // 每次渲染前都重新初始化配置
        mermaid.initialize(config as any);

        // 渲染图表
        const { svg } = await mermaid.render(id, code);

          if (containerRef.current && mounted) {
            containerRef.current.innerHTML = svg;
            setRendered(true);
          }
        } catch (err) {
          console.error(`History item ${itemId} render error:`, err);
          if (mounted) {
            setError(err instanceof Error ? err.message : t('history.renderError'));
            setRendered(true);
          }
          if (containerRef.current) {
            containerRef.current.innerHTML = '';
          }
        }
      }).catch(err => {
        console.error(`Queue error for ${itemId}:`, err);
      });
    };

    // 立即渲染
    renderDiagram();

    return () => {
      mounted = false;
    };
  }, [code, itemId, layout, theme]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
        <AlertCircle className="w-12 h-12 mb-3 text-amber-500" />
        <p className="text-base font-medium text-gray-700 mb-2">{t('history.syntaxError')}</p>
        <p className="text-xs text-center text-gray-500 max-w-md">
          {t('history.invalidCode')}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center relative">
      {!rendered && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent"></div>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full flex items-center justify-center" />
    </div>
  );
}

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  diagramId: string;
  onRestore: (code: string) => void;
}

export function HistoryDrawer({ isOpen, onClose, diagramId, onRestore }: HistoryDrawerProps) {
  const { t, i18n } = useTranslation();
  const [history, setHistory] = useState<DiagramHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [globalViewMode, setGlobalViewMode] = useState<'code' | 'preview'>('code');

  useEffect(() => {
    if (isOpen && diagramId) {
      loadHistory();
    }
  }, [isOpen, diagramId]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('diagram_history')
        .select('*')
        .eq('diagram_id', diagramId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const locale = i18n.language === 'zh' ? 'zh-CN' :
                   i18n.language === 'ja' ? 'ja-JP' :
                   i18n.language === 'ko' ? 'ko-KR' : 'en-US';
    return date.toLocaleString(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t('history.justNow');
    if (diffMins < 60) return t('history.minutesAgo', { count: diffMins });
    if (diffHours < 24) return t('history.hoursAgo', { count: diffHours });
    if (diffDays < 7) return t('history.daysAgo', { count: diffDays });
    return formatDate(dateStr);
  };


  if (!isOpen) return null;

  return (
    <>
      {/* 遮罩层 */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* 抽屉 */}
      <div className="fixed right-0 top-0 h-full w-[60%] bg-white shadow-2xl z-50 flex flex-col animate-slide-in-right">
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-800">{t('history.title')}</h2>
          </div>
          <div className="flex items-center gap-3">
            {/* 全局视图切换按钮 */}
            <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setGlobalViewMode('code')}
                className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-md transition-colors ${
                  globalViewMode === 'code'
                    ? 'bg-indigo-100 text-indigo-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Code className="w-4 h-4" />
                {t('history.code')}
              </button>
              <button
                onClick={() => setGlobalViewMode('preview')}
                className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-md transition-colors ${
                  globalViewMode === 'preview'
                    ? 'bg-indigo-100 text-indigo-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Eye className="w-4 h-4" />
                {t('history.preview')}
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Clock className="w-16 h-16 mb-4 text-gray-300" />
              <p className="text-lg">{t('history.noHistory')}</p>
              <p className="text-sm mt-2">{t('history.noHistoryDesc')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:shadow-md transition-all"
                >
                  {/* 时间线标记 */}
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-indigo-600">
                          {history.length - index}
                        </span>
                      </div>
                      {index < history.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 mt-2" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* 标题和时间 */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-700">
                              {item.user_prompt || t('editor.manualSave')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{formatDate(item.created_at)}</span>
                            <span className="text-gray-400">({formatRelativeTime(item.created_at)})</span>
                          </div>
                        </div>
                      </div>

                      {/* AI 回复 */}
                      {item.ai_response && (
                        <div className="bg-purple-50 rounded-lg p-3 mb-3">
                          <p className="text-sm text-purple-900">{item.ai_response}</p>
                        </div>
                      )}

                      {/* 内容展示区域 */}
                      {globalViewMode === 'preview' ? (
                        <div className="bg-gray-50 rounded-lg p-3 mb-3 overflow-hidden" style={{ height: '600px' }}>
                          <div className="transform scale-75 origin-top-left" style={{ width: '133.33%', height: '133.33%' }}>
                            <SafeMermaidRenderer
                              code={item.mermaid_code}
                              itemId={item.id}
                              layout={item.layout}
                              theme={item.theme}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-lg p-3 mb-3 max-h-80 overflow-y-auto">
                          <pre className="text-xs text-gray-700 font-mono whitespace-pre-wrap break-words">
                            {item.mermaid_code}
                          </pre>
                        </div>
                      )}

                      {/* 操作按钮 */}
                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            onRestore(item.mermaid_code);
                            onClose();
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          <RotateCcw className="w-4 h-4" />
                          {t('history.restore')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
