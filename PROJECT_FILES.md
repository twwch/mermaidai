# Mermaid AI 项目文件清单

## 📁 项目根目录

### 配置文件
- `.env.example` - 环境变量示例文件
- `.nvmrc` - Node 版本指定文件 (22)
- `.gitignore` - Git 忽略规则
- `package.json` - 项目依赖和脚本
- `package-lock.json` - 依赖锁定文件
- `tsconfig.json` - TypeScript 配置
- `tsconfig.app.json` - 应用 TypeScript 配置
- `tsconfig.node.json` - Node TypeScript 配置
- `vite.config.ts` - Vite 构建配置
- `eslint.config.js` - ESLint 配置
- `tailwind.config.js` - Tailwind CSS 配置
- `postcss.config.js` - PostCSS 配置

### 文档文件
- `README.md` - 项目主文档
- `QUICKSTART.md` - 5分钟快速开始指南 ⭐
- `SETUP.md` - 详细设置指南
- `PROJECT_SUMMARY.md` - 项目总结文档
- `PROJECT_FILES.md` - 本文件

### 数据库
- `supabase-schema.sql` - Supabase 数据库初始化脚本

### 脚本
- `start.sh` - 快速启动脚本 (可执行)
- `check-config.js` - 配置检查工具 (可执行)

### HTML
- `index.html` - 应用入口 HTML

## 📁 src/ - 源代码目录

### 入口文件
- `main.tsx` - React 应用入口
- `App.tsx` - 根组件
- `index.css` - 全局样式

### components/ - React 组件
- `Auth.tsx` - 登录页面组件
- `Sidebar.tsx` - 侧边栏组件 (项目和流程图列表)
- `DiagramEditor.tsx` - 流程图编辑器主组件
- `CodeEditor.tsx` - Monaco 代码编辑器组件
- `MermaidRenderer.tsx` - Mermaid 渲染组件
- `ChatPanel.tsx` - AI 对话面板组件

### hooks/ - React Hooks
- `useAuth.ts` - 认证 Hook (登录/登出/用户状态)

### lib/ - 第三方库配置
- `supabase.ts` - Supabase 客户端配置

### services/ - 业务服务
- `ai.ts` - Google Gemini AI 服务

### store/ - 状态管理
- `useStore.ts` - Zustand 全局状态管理

### types/ - TypeScript 类型定义
- `database.ts` - Supabase 数据库类型
- `index.ts` - 应用类型定义

## 📁 public/ - 静态资源

静态资源文件 (图标、图片等)

## 🔧 npm 脚本

### 开发
- `npm run dev` - 启动开发服务器
- `npm run check-config` - 检查环境变量配置

### 构建
- `npm run build` - 构建生产版本
- `npm run preview` - 预览生产构建

### 代码质量
- `npm run lint` - 运行 ESLint

### 快速启动
- `npm start` 或 `./start.sh` - 一键启动 (推荐)

## 📊 项目统计

### 核心组件: 6 个
- Auth, Sidebar, DiagramEditor, CodeEditor, MermaidRenderer, ChatPanel

### 自定义 Hooks: 1 个
- useAuth

### 服务: 2 个
- AI 服务 (Gemini)
- Supabase 客户端

### 状态管理: 1 个
- Zustand Store

### 数据库表: 3 个
- projects, diagrams, diagram_history

## 🎯 关键文件说明

### 必须配置
1. `.env` - 从 `.env.example` 复制并填入配置
2. `supabase-schema.sql` - 在 Supabase 中执行

### 推荐阅读顺序
1. **QUICKSTART.md** - 快速上手 ⭐
2. **README.md** - 功能介绍
3. **SETUP.md** - 详细设置
4. **PROJECT_SUMMARY.md** - 项目架构

### 核心代码
1. `src/App.tsx` - 应用结构
2. `src/components/DiagramEditor.tsx` - 主功能
3. `src/services/ai.ts` - AI 集成
4. `src/lib/supabase.ts` - 数据库集成

## 📦 依赖包

### 核心依赖
- react + react-dom
- @supabase/supabase-js
- @google/generative-ai
- mermaid
- @monaco-editor/react
- zustand
- tailwindcss

### 开发依赖
- vite
- typescript
- eslint
- @tailwindcss/postcss

---

**项目规模**: 中小型
**代码行数**: ~2000+ 行
**组件数**: 6 个
**文档**: 完整
**状态**: ✅ 生产就绪
