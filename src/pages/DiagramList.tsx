import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { ArrowLeft, FilePlus, FileText, Trash2, Sparkles } from 'lucide-react';
import type { Project, Diagram } from '../types';
import mermaid from 'mermaid';
import { generateMermaidCode } from '../services/ai';
import { ClipLoader } from 'react-spinners';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { Toast } from '../components/Toast';
import type { ToastType } from '../components/Toast';

export function DiagramList() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newDiagramPrompt, setNewDiagramPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; diagramId: string | null; diagramName: string }>({
    isOpen: false,
    diagramId: null,
    diagramName: '',
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 10;
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  useEffect(() => {
    if (projectId) {
      loadData();
    }
  }, [projectId, user]);

  const loadData = async () => {
    setIsLoading(true);
    setPage(0);
    try {
      await Promise.all([loadProject(), loadDiagrams(0, false)]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    await loadDiagrams(nextPage, true);
    setIsLoadingMore(false);
  };


  const loadProject = async () => {
    if (!projectId) return;

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (error) {
      console.error('Load project error:', error);
      return;
    }

    setProject(data);
  };

  const loadDiagrams = async (pageNum: number = 0, append: boolean = false) => {
    if (!projectId) return;

    const from = pageNum * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error } = await supabase
      .from('diagrams')
      .select('*')
      .eq('project_id', projectId)
      .order('updated_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Load diagrams error:', error);
      return;
    }

    if (data) {
      if (append) {
        setDiagrams(prev => [...prev, ...data]);
      } else {
        setDiagrams(data);
      }
      setHasMore(data.length === PAGE_SIZE);
    }
  };

  const handleCreateDiagram = async () => {
    if (!newDiagramPrompt.trim() || !projectId) return;

    try {
      setIsGenerating(true);
      const code = await generateMermaidCode(newDiagramPrompt);

      const { data, error } = await supabase
        .from('diagrams')
        .insert({
          project_id: projectId,
          name: newDiagramPrompt.slice(0, 50),
          mermaid_code: code,
        } as any)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        // 添加历史记录
        // @ts-ignore
        await supabase.from('diagram_history').insert({
          // @ts-ignore
          diagram_id: data.id,
          mermaid_code: code,
          user_prompt: newDiagramPrompt,
          ai_response: t('diagram.aiGenerate'),
        });

        setDiagrams([data, ...diagrams]);
        setNewDiagramPrompt('');
        setIsCreating(false);

        // 直接跳转到编辑页面
        // @ts-ignore - Supabase type inference issue
        navigate(`/project/${projectId}/diagram/${data.id}`);
      }
    } catch (error) {
      console.error('Create diagram error:', error);
      setToast({ message: t('diagram.createDiagramError'), type: 'error' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteDiagram = async (diagramId: string, diagramName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirm({ isOpen: true, diagramId, diagramName });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.diagramId) return;

    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('diagrams')
        .delete()
        .eq('id', deleteConfirm.diagramId);

      if (error) throw error;

      // 重新加载第一页数据
      setPage(0);
      setHasMore(true);
      await loadDiagrams(0, false);

      setDeleteConfirm({ isOpen: false, diagramId: null, diagramName: '' });
    } catch (error) {
      console.error('Delete diagram error:', error);
      setToast({ message: t('diagram.deleteDiagramError'), type: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{project?.name || '项目'}</h1>
                <p className="text-sm text-gray-600 mt-1">{t('diagram.diagramList')}</p>
              </div>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

      {/* Content with top padding to account for fixed header */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
        {/* Create Diagram Card */}
        <div className="mb-8">
          {isCreating ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('diagram.createDiagram')}</h3>
              <textarea
                value={newDiagramPrompt}
                onChange={(e) => setNewDiagramPrompt(e.target.value)}
                placeholder={t('diagram.descriptionPlaceholder')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 resize-none"
                rows={3}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setIsCreating(false);
                    setNewDiagramPrompt('');
                  }
                }}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleCreateDiagram}
                  disabled={isGenerating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <ClipLoader size={16} color="#ffffff" />
                      {t('diagram.generating')}
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      {t('diagram.aiGenerate')}
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setNewDiagramPrompt('');
                  }}
                  disabled={isGenerating}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  {t('common.cancel')}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-300 p-8 hover:border-blue-500 hover:bg-blue-50 transition-colors group"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <FilePlus className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900">{t('diagram.createDiagram')}</p>
                  <p className="text-sm text-gray-500 mt-1">{t('diagramWelcome.subtitle')}</p>
                </div>
              </div>
            </button>
          )}
        </div>

        {/* Diagrams Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <ClipLoader size={50} color="#2563eb" />
              <p className="text-gray-600 mt-4">{t('common.loading')}</p>
            </div>
          </div>
        ) : diagrams.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {diagrams.map((diagram) => (
                <DiagramCard
                  key={diagram.id}
                  diagram={diagram}
                  onDelete={(id, name, e) => handleDeleteDiagram(id, name, e)}
                  onClick={() => navigate(`/project/${projectId}/diagram/${diagram.id}`)}
                />
              ))}
            </div>

            {/* 分页加载按钮 */}
            {hasMore && (
              <div className="flex justify-center py-8">
                <button
                  onClick={loadMore}
                  disabled={isLoadingMore}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoadingMore ? (
                    <>
                      <ClipLoader size={20} color="#ffffff" />
                      <span>{t('common.loadMore')}</span>
                    </>
                  ) : (
                    <span>{t('common.loadMore')}</span>
                  )}
                </button>
              </div>
            )}

            {/* 没有更多数据提示 */}
            {!hasMore && diagrams.length >= PAGE_SIZE && (
              <div className="text-center py-8">
                <p className="text-gray-500">{t('common.noMore')}</p>
              </div>
            )}
          </>
        ) : (
          <div className="max-w-3xl mx-auto">
            {/* 欢迎区域 */}
            <div className="text-center mb-10">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-5">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('diagramWelcome.title')}</h2>
              <p className="text-gray-600">{t('diagramWelcome.subtitle')}</p>
            </div>

            {/* 功能介绍 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-center">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">{t('diagramWelcome.features.aiGeneration.title')}</h3>
                <p className="text-sm text-gray-600">
                  {t('diagramWelcome.features.aiGeneration.desc')}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-center">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">{t('diagramWelcome.features.customStyle.title')}</h3>
                <p className="text-sm text-gray-600">
                  {t('diagramWelcome.features.customStyle.desc')}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-center">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">{t('diagramWelcome.features.versionControl.title')}</h3>
                <p className="text-sm text-gray-600">
                  {t('diagramWelcome.features.versionControl.desc')}
                </p>
              </div>
            </div>

            {/* 示例说明 */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('diagramWelcome.examplesTitle')}</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>{t('diagramWelcome.examples.example1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>{t('diagramWelcome.examples.example2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>{t('diagramWelcome.examples.example3')}</span>
                </li>
              </ul>
            </div>

            {/* 行动号召 */}
            <div className="text-center">
              <button
                onClick={() => setIsCreating(true)}
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-5 h-5" />
                {t('diagram.createFirstDiagram')}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* 删除确认对话框 */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title={t('diagram.deleteDiagramTitle')}
        message={t('diagram.deleteDiagramMessage', { name: deleteConfirm.diagramName })}
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, diagramId: null, diagramName: '' })}
        danger
        isLoading={isDeleting}
      />

      {/* Toast 提示 */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

// 全局渲染队列，确保缩略图串行渲染
let thumbnailRenderQueue = Promise.resolve();

// 流程图卡片组件，带缩略图
function DiagramCard({
  diagram,
  onDelete,
  onClick,
}: {
  diagram: Diagram;
  onDelete: (id: string, name: string, e: React.MouseEvent) => void;
  onClick: () => void;
}) {
  const { t, i18n } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    let mounted = true;

    const renderThumbnail = async () => {
      // 等待 DOM 准备好
      await new Promise(resolve => setTimeout(resolve, 0));

      if (!containerRef.current || !mounted) return;

      // 加入队列，等待前面的缩略图渲染完成
      thumbnailRenderQueue = thumbnailRenderQueue.then(async () => {
        if (!mounted || !containerRef.current) return;

        try {
          const layout = diagram.layout || 'TB';
          const config: any = {
            startOnLoad: false,
            theme: diagram.theme || 'default',
            securityLevel: 'loose',
            fontSize: 10,
            flowchart: {
              curve: layout === 'TB' || layout === 'BT' ? 'linear' : 'basis',
              htmlLabels: true,
              padding: 10,
              nodeSpacing: 30,
              rankSpacing: 30,
              useMaxWidth: true,
            },
          };

          mermaid.initialize(config);

          const id = `thumbnail-${diagram.id}-${Date.now()}`;
          const { svg } = await mermaid.render(id, diagram.mermaid_code);

          if (containerRef.current && mounted) {
            containerRef.current.innerHTML = svg;
            // 调整 SVG 尺寸以适应容器
            const svgElement = containerRef.current.querySelector('svg');
            if (svgElement) {
              svgElement.style.width = '100%';
              svgElement.style.height = '100%';
            }
            setIsRendered(true);
          }
        } catch (error) {
          console.error('Thumbnail render error:', error);
          if (mounted) {
            setHasError(true);
          }
        }
      });
    };

    renderThumbnail();

    return () => {
      mounted = false;
    };
  }, [diagram.mermaid_code]);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group relative"
    >
      <button
        onClick={(e) => onDelete(diagram.id, diagram.name, e)}
        className="absolute top-3 right-3 z-10 p-2 bg-white text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-md"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {/* 缩略图 */}
      <div className="h-48 bg-gray-50 flex items-center justify-center p-4 overflow-hidden relative">
        {hasError ? (
          <div className="text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-xs text-gray-400">{t('diagram.previewError')}</p>
          </div>
        ) : (
          <>
            {!isRendered && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
                <div className="text-center">
                  <ClipLoader size={32} color="#2563eb" />
                  <p className="text-xs text-gray-400 mt-2">{t('common.loading')}</p>
                </div>
              </div>
            )}
            <div
              ref={containerRef}
              className="w-full h-full flex items-center justify-center"
              style={{ transform: 'scale(0.8)', opacity: isRendered ? 1 : 0 }}
            />
          </>
        )}
      </div>

      {/* 信息 */}
      <div className="p-4">
        <h3 className="text-base font-semibold text-gray-900 truncate mb-1">
          {diagram.name}
        </h3>
        <p className="text-xs text-gray-400">
          {t('project.updatedAt')} {new Date(diagram.updated_at).toLocaleDateString(
            i18n.language === 'zh' ? 'zh-CN' :
            i18n.language === 'ja' ? 'ja-JP' :
            i18n.language === 'ko' ? 'ko-KR' : 'en-US'
          )}
        </p>
      </div>
    </div>
  );
}
