import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  FolderPlus,
  FilePlus,
  LogOut,
  Trash2,
  FileText,
  Folder,
} from 'lucide-react';
import { generateMermaidCode } from '../services/ai';
import { Modal } from './Modal';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from './Toast';

export function Sidebar() {
  const { user, signOut } = useAuth();
  const {
    projects,
    currentProject,
    diagrams,
    currentDiagram,
    setProjects,
    setCurrentProject,
    setDiagrams,
    setCurrentDiagram,
    addProject,
    addDiagram,
    deleteProject,
    deleteDiagram,
    setIsGenerating,
  } = useStore();

  const { toasts, removeToast, success, error: showError, warning } = useToast();
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showDiagramModal, setShowDiagramModal] = useState(false);

  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user]);

  useEffect(() => {
    if (currentProject) {
      loadDiagrams(currentProject.id);
    } else {
      setDiagrams([]);
    }
  }, [currentProject]);

  const loadProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user!.id)
      .order('updated_at', { ascending: false });

    if (!error && data) {
      setProjects(data);
    } else if (error) {
      console.error('Load projects error:', error);
      showError('加载项目失败');
    }
  };

  const loadDiagrams = async (projectId: string) => {
    const { data, error } = await supabase
      .from('diagrams')
      .select('*')
      .eq('project_id', projectId)
      .order('updated_at', { ascending: false });

    if (!error && data) {
      setDiagrams(data);
    } else if (error) {
      showError('加载流程图失败');
    }
  };

  const handleCreateProject = async (name: string) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          user_id: user!.id,
          name,
          description: '',
        } as any)
        .select()
        .single();

      if (error) {
        console.error('Create project error:', error);
        showError(`创建项目失败: ${error.message}`);
        return;
      }

      if (data) {
        addProject(data);
        setCurrentProject(data);
        success('项目创建成功!');
      }
    } catch (error: any) {
      console.error('Create project error:', error);
      showError('创建项目失败,请重试');
    }
  };

  const handleCreateDiagram = async (prompt: string) => {
    if (!currentProject) {
      warning('请先选择一个项目');
      return;
    }

    try {
      setIsGenerating(true);
      const code = await generateMermaidCode(prompt);

      const { data, error } = await supabase
        .from('diagrams')
        .insert({
          project_id: currentProject.id,
          name: prompt.slice(0, 50),
          mermaid_code: code,
        } as any)
        .select()
        .single();

      if (error) {
        console.error('Create diagram error:', error);
        showError(`创建流程图失败: ${error.message}`);
        return;
      }

      if (data) {
        addDiagram(data);
        setCurrentDiagram(data);
        success('流程图创建成功!');

        // 添加历史记录
        // @ts-ignore - Supabase type inference issue
        await supabase.from('diagram_history').insert({
          // @ts-ignore - Supabase type inference issue
          diagram_id: data.id,
          mermaid_code: code,
          user_prompt: prompt,
          ai_response: 'AI 生成初始版本',
        });
      }
    } catch (error: any) {
      console.error('Create diagram error:', error);
      showError('AI 生成失败,请检查配置');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteProject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('确定要删除这个项目吗?所有流程图也会被删除。')) return;

    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) {
      showError('删除项目失败');
      return;
    }

    deleteProject(id);
    if (currentProject?.id === id) {
      setCurrentProject(null);
      setCurrentDiagram(null);
    }
    success('项目已删除');
  };

  const handleDeleteDiagram = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('确定要删除这个流程图吗?')) return;

    const { error } = await supabase.from('diagrams').delete().eq('id', id);
    if (error) {
      showError('删除流程图失败');
      return;
    }

    deleteDiagram(id);
    if (currentDiagram?.id === id) {
      setCurrentDiagram(null);
    }
    success('流程图已删除');
  };

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <div className="w-64 bg-gray-900 text-white flex flex-col h-full">
        {/* 头部 */}
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">Mermaid AI</h1>
          <p className="text-xs text-gray-400 mt-1 truncate">{user?.email}</p>
        </div>

        {/* 项目列表 */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-400 uppercase">
                项目
              </h2>
              <button
                onClick={() => setShowProjectModal(true)}
                className="p-1 hover:bg-gray-800 rounded transition-colors"
                title="新建项目"
              >
                <FolderPlus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              {projects.map((project) => (
                <div key={project.id} className="group">
                  <div
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                      currentProject?.id === project.id
                        ? 'bg-blue-600'
                        : 'hover:bg-gray-800'
                    }`}
                  >
                    <button
                      onClick={() => setCurrentProject(project)}
                      className="flex items-center gap-2 flex-1 min-w-0"
                    >
                      <Folder className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm truncate">{project.name}</span>
                    </button>
                    <button
                      onClick={(e) => handleDeleteProject(project.id, e)}
                      className="p-1 hover:bg-red-600 rounded opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  {/* 流程图列表 */}
                  {currentProject?.id === project.id && (
                    <div className="ml-6 mt-1 space-y-1">
                      {diagrams.map((diagram) => (
                        <div
                          key={diagram.id}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-sm group ${
                            currentDiagram?.id === diagram.id
                              ? 'bg-blue-500'
                              : 'hover:bg-gray-800'
                          }`}
                        >
                          <button
                            onClick={() => setCurrentDiagram(diagram)}
                            className="flex items-center gap-2 flex-1 min-w-0"
                          >
                            <FileText className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate text-xs">{diagram.name}</span>
                          </button>
                          <button
                            onClick={(e) => handleDeleteDiagram(diagram.id, e)}
                            className="p-1 hover:bg-red-600 rounded opacity-0 group-hover:opacity-100 flex-shrink-0"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 底部操作 */}
        <div className="p-4 border-t border-gray-700 space-y-2">
          <button
            onClick={() => setShowDiagramModal(true)}
            disabled={!currentProject}
            className="w-full flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FilePlus className="w-4 h-4" />
            <span className="text-sm">新建流程图</span>
          </button>

          <button
            onClick={signOut}
            className="w-full flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">退出登录</span>
          </button>
        </div>
      </div>

      {/* 模态框 */}
      <Modal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        onConfirm={handleCreateProject}
        title="创建新项目"
        placeholder="请输入项目名称"
      />

      <Modal
        isOpen={showDiagramModal}
        onClose={() => setShowDiagramModal(false)}
        onConfirm={handleCreateDiagram}
        title="创建流程图"
        placeholder="描述你想要创建的流程图,例如: 用户登录注册流程"
        multiline
      />
    </>
  );
}
