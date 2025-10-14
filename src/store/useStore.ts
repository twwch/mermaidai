import { create } from 'zustand';
import type { Project, Diagram, DiagramHistory } from '../types';

interface AppState {
  // 项目相关
  projects: Project[];
  currentProject: Project | null;
  setProjects: (projects: Project[]) => void;
  setCurrentProject: (project: Project | null) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // 流程图相关
  diagrams: Diagram[];
  currentDiagram: Diagram | null;
  setDiagrams: (diagrams: Diagram[]) => void;
  setCurrentDiagram: (diagram: Diagram | null) => void;
  addDiagram: (diagram: Diagram) => void;
  updateDiagram: (id: string, updates: Partial<Diagram>) => void;
  deleteDiagram: (id: string) => void;

  // 历史记录相关
  history: DiagramHistory[];
  setHistory: (history: DiagramHistory[]) => void;
  addHistory: (record: DiagramHistory) => void;

  // UI 状态
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  // 项目相关
  projects: [],
  currentProject: null,
  setProjects: (projects) => set({ projects }),
  setCurrentProject: (project) => set({ currentProject: project }),
  addProject: (project) =>
    set((state) => ({ projects: [...state.projects, project] })),
  updateProject: (id, updates) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
      currentProject:
        state.currentProject?.id === id
          ? { ...state.currentProject, ...updates }
          : state.currentProject,
    })),
  deleteProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      currentProject: state.currentProject?.id === id ? null : state.currentProject,
    })),

  // 流程图相关
  diagrams: [],
  currentDiagram: null,
  setDiagrams: (diagrams) => set({ diagrams }),
  setCurrentDiagram: (diagram) => set({ currentDiagram: diagram }),
  addDiagram: (diagram) =>
    set((state) => ({ diagrams: [...state.diagrams, diagram] })),
  updateDiagram: (id, updates) =>
    set((state) => ({
      diagrams: state.diagrams.map((d) =>
        d.id === id ? { ...d, ...updates } : d
      ),
      currentDiagram:
        state.currentDiagram?.id === id
          ? { ...state.currentDiagram, ...updates }
          : state.currentDiagram,
    })),
  deleteDiagram: (id) =>
    set((state) => ({
      diagrams: state.diagrams.filter((d) => d.id !== id),
      currentDiagram: state.currentDiagram?.id === id ? null : state.currentDiagram,
    })),

  // 历史记录相关
  history: [],
  setHistory: (history) => set({ history }),
  addHistory: (record) =>
    set((state) => ({ history: [...state.history, record] })),

  // UI 状态
  isGenerating: false,
  setIsGenerating: (isGenerating) => set({ isGenerating }),
}));
