import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { FolderPlus, Folder, LogOut, Trash2, Sparkles } from 'lucide-react';
import type { Project } from '../types';
import { ClipLoader } from 'react-spinners';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { Toast } from '../components/Toast';
import type { ToastType } from '../components/Toast';

export function ProjectList() {
  const { t, i18n } = useTranslation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; projectId: string | null; projectName: string }>({
    isOpen: false,
    projectId: null,
    projectName: '',
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 10;
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  useEffect(() => {
    loadProjects();
  }, [user]);

  const loadProjects = async (pageNum: number = 0, append: boolean = false) => {
    if (!user) return;

    if (!append) {
      setIsLoading(true);
      setPage(0);
    }

    try {
      const from = pageNum * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .range(from, to);

      if (error) {
        console.error('Load projects error:', error);
        return;
      }

      if (data) {
        if (append) {
          setProjects(prev => [...prev, ...data]);
        } else {
          setProjects(data);
        }
        setHasMore(data.length === PAGE_SIZE);
      }
    } finally {
      if (!append) {
        setIsLoading(false);
      }
    }
  };

  const loadMore = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    await loadProjects(nextPage, true);
    setIsLoadingMore(false);
  };


  const handleCreateProject = async () => {
    if (!newProjectName.trim() || !user) return;

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          name: newProjectName,
          description: '',
        } as any)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setProjects([data, ...projects]);
        setNewProjectName('');
        setIsCreating(false);
      }
    } catch (error) {
      console.error('Create project error:', error);
      setToast({ message: '创建项目失败', type: 'error' });
    }
  };

  const handleDeleteProject = async (projectId: string, projectName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirm({ isOpen: true, projectId, projectName });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.projectId) return;

    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', deleteConfirm.projectId);

      if (error) throw error;

      // 重新加载第一页数据
      setPage(0);
      setHasMore(true);
      await loadProjects(0, false);

      setDeleteConfirm({ isOpen: false, projectId: null, projectName: '' });
    } catch (error) {
      console.error('Delete project error:', error);
      setToast({ message: t('project.deleteProjectError'), type: 'error' });
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
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('project.title')}</h1>
              <p className="text-sm text-gray-600 mt-1">{t('project.myProjects')}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <img
                  src={user?.picture || ''}
                  alt={user?.name || ''}
                  className="w-8 h-8 rounded-full"
                />
                <span>{user?.name}</span>
              </div>
              <LanguageSwitcher />
              <button
                onClick={signOut}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                {t('common.logout')}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content with top padding to account for fixed header */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
        {/* Create Project Card */}
        <div className="mb-8">
          {isCreating ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('project.createProject')}</h3>
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder={t('project.projectName')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateProject();
                  if (e.key === 'Escape') {
                    setIsCreating(false);
                    setNewProjectName('');
                  }
                }}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleCreateProject}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t('common.create')}
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setNewProjectName('');
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
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
                  <FolderPlus className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900">{t('project.createProject')}</p>
                  <p className="text-sm text-gray-500 mt-1">{t('project.createProjectDesc')}</p>
                </div>
              </div>
            </button>
          )}
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <ClipLoader size={50} color="#2563eb" />
              <p className="text-gray-600 mt-4">{t('common.loading')}</p>
            </div>
          </div>
        ) : projects.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => navigate(`/project/${project.id}`)}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group relative"
                >
                  <button
                    onClick={(e) => handleDeleteProject(project.id, project.name, e)}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <Folder className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">
                        {project.name}
                      </h3>
                      {project.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        {t('project.updatedAt')} {new Date(project.updated_at).toLocaleDateString(
                          i18n.language === 'zh' ? 'zh-CN' :
                          i18n.language === 'ja' ? 'ja-JP' :
                          i18n.language === 'ko' ? 'ko-KR' : 'en-US'
                        )}
                      </p>
                    </div>
                  </div>
                </div>
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
            {!hasMore && projects.length >= PAGE_SIZE && (
              <div className="text-center py-8">
                <p className="text-gray-500">{t('common.noMore')}</p>
              </div>
            )}
          </>
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* 欢迎区域 */}
            <div className="text-center mb-12">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-6">
                <Folder className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">{t('welcome.title')}</h2>
              <p className="text-lg text-gray-600">{t('welcome.subtitle')}</p>
            </div>

            {/* 功能介绍 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('welcome.features.aiGeneration.title')}</h3>
                <p className="text-gray-600">
                  {t('welcome.features.aiGeneration.desc')}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                  <FolderPlus className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('welcome.features.projectManagement.title')}</h3>
                <p className="text-gray-600">
                  {t('welcome.features.projectManagement.desc')}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('welcome.features.realTimePreview.title')}</h3>
                <p className="text-gray-600">
                  {t('welcome.features.realTimePreview.desc')}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('welcome.features.versionHistory.title')}</h3>
                <p className="text-gray-600">
                  {t('welcome.features.versionHistory.desc')}
                </p>
              </div>
            </div>

            {/* 行动号召 */}
            <div className="text-center">
              <p className="text-gray-600 mb-6">{t('welcome.getStarted')}</p>
              <button
                onClick={() => setIsCreating(true)}
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <FolderPlus className="w-5 h-5" />
                {t('project.createProject')}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* 删除确认对话框 */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title={t('project.deleteProjectTitle')}
        message={t('project.deleteProjectMessage', { name: deleteConfirm.projectName })}
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, projectId: null, projectName: '' })}
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
