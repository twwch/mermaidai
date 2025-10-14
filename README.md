# Mermaid AI - AI 驱动的流程图生成工具

基于 AI 技术的 Mermaid 流程图创建和编辑工具,支持通过自然语言描述生成专业的流程图。

## 功能特性

- ✨ **AI 生成**: 使用 Google Gemini AI 根据自然语言描述生成 Mermaid 流程图
- 🎨 **实时预览**: 左侧编辑器(30%),右侧实时渲染预览(70%)
- 💬 **AI 对话微调**: 通过对话的方式让 AI 帮你调整流程图
- 📚 **项目管理**: 支持创建多个项目,每个项目包含多个流程图
- ⏱️ **历史记录**: 记录每次修改的历史,支持代码/预览切换和版本恢复
- 🎭 **主题切换**: 支持 5 种内置主题 (default, neutral, dark, forest, base)
- 📐 **布局引擎**: 支持 Dagre 和 ELK 两种布局引擎
- 🔍 **缩放平移**: 支持图表缩放、平移和适应屏幕
- 📥 **多格式导出**: 支持导出 PNG、SVG、MMD 格式
- 🔐 **Google 登录**: 使用 Google OAuth 快速登录
- ☁️ **云端存储**: 使用 Supabase 存储所有数据
- 💾 **配置持久化**: 每个流程图独立保存布局和主题配置

## 技术栈

- **前端框架**: React 18 + TypeScript + Vite
- **UI 样式**: Tailwind CSS
- **代码编辑器**: Monaco Editor
- **图表渲染**: Mermaid.js v11
- **布局引擎**: Dagre + ELK (@mermaid-js/layout-elk)
- **图表交互**: svg-pan-zoom
- **状态管理**: Zustand
- **数据库**: Supabase (PostgreSQL)
- **认证**: Supabase Auth (Google OAuth)
- **AI**: Google Gemini 2.0 Flash

## 快速开始

### 1. 环境准备

确保你已安装:
- Node.js 18+
- npm 或 yarn

### 2. 克隆项目

\`\`\`bash
git clone <repository-url>
cd mermaidai
\`\`\`

### 3. 安装依赖

\`\`\`bash
npm install
\`\`\`

### 4. 配置环境变量

复制 `.env.example` 为 `.env`:

\`\`\`bash
cp .env.example .env
\`\`\`

在 `.env` 文件中填入以下配置:

\`\`\`env
# Supabase 配置
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Gemini API 配置
VITE_GEMINI_API_KEY=your_gemini_api_key
\`\`\`

### 5. 配置 Supabase

#### 5.1 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com/)
2. 创建新项目
3. 获取项目的 URL 和 anon key

#### 5.2 设置数据库

在 Supabase SQL Editor 中运行 `supabase-schema.sql` 脚本:

1. 打开 Supabase Dashboard
2. 进入 SQL Editor
3. 复制 `supabase-schema.sql` 的内容
4. 执行脚本

#### 5.3 配置 Google OAuth

1. 在 Supabase Dashboard 中进入 **Authentication** > **Providers**
2. 启用 **Google** 提供商
3. 前往 [Google Cloud Console](https://console.cloud.google.com/)
4. 创建 OAuth 2.0 凭据
5. 设置授权重定向 URI: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
6. 将 Client ID 和 Client Secret 填入 Supabase

### 6. 获取 Gemini API Key

1. 访问 [Google AI Studio](https://aistudio.google.com/app/apikey)
2. 创建新的 API Key
3. 将 API Key 填入 `.env` 文件

### 7. 启动开发服务器

\`\`\`bash
npm run dev
\`\`\`

访问 http://localhost:5173

## 项目结构

\`\`\`
mermaidai/
├── src/
│   ├── components/          # React 组件
│   │   ├── Auth.tsx        # 登录组件
│   │   ├── Sidebar.tsx     # 侧边栏
│   │   ├── DiagramEditor.tsx  # 流程图编辑器
│   │   ├── CodeEditor.tsx  # 代码编辑器
│   │   ├── MermaidRenderer.tsx  # Mermaid 渲染器
│   │   └── ChatPanel.tsx   # AI 对话面板
│   ├── hooks/              # React Hooks
│   │   └── useAuth.ts      # 认证 Hook
│   ├── lib/                # 库配置
│   │   └── supabase.ts     # Supabase 客户端
│   ├── services/           # 服务层
│   │   └── ai.ts           # AI 服务
│   ├── store/              # 状态管理
│   │   └── useStore.ts     # Zustand Store
│   ├── types/              # TypeScript 类型
│   │   ├── database.ts     # 数据库类型
│   │   └── index.ts        # 通用类型
│   ├── App.tsx             # 主应用组件
│   ├── main.tsx            # 应用入口
│   └── index.css           # 全局样式
├── supabase-schema.sql     # 数据库架构
├── .env.example            # 环境变量示例
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
\`\`\`

## 使用指南

### 创建项目

1. 使用 Google 账号登录
2. 点击侧边栏的 "新建项目" 按钮
3. 输入项目名称

### 创建流程图

1. 选择一个项目
2. 点击 "新建流程图" 按钮
3. 描述你想要创建的流程图,例如:
   - "创建一个用户注册登录流程图"
   - "画一个电商购物流程"
   - "制作一个系统架构图"
4. AI 将自动生成对应的 Mermaid 代码

### 编辑流程图

- **手动编辑**: 直接在左侧编辑器中修改 Mermaid 代码
- **AI 微调**:
  1. 点击 "AI 助手" 按钮
  2. 描述你想要的修改,例如:
     - "把开始节点改成圆形"
     - "添加一个错误处理分支"
     - "改用横向布局"
  3. AI 将根据你的描述自动调整代码

### 查看历史

点击侧边栏的 "历史记录" 按钮查看所有修改历史。

### 导出流程图

点击工具栏的 "导出" 按钮下载 `.mmd` 文件。

## 支持的 Mermaid 图表类型

- 流程图 (Flowchart)
- 序列图 (Sequence Diagram)
- 类图 (Class Diagram)
- 状态图 (State Diagram)
- ER 图 (Entity Relationship Diagram)
- 甘特图 (Gantt Chart)
- 饼图 (Pie Chart)
- Git 图 (Git Graph)

## 常见问题

### Q: AI 生成失败怎么办?

A: 请检查:
1. Gemini API Key 是否正确配置
2. 网络连接是否正常
3. API 配额是否充足

### Q: 无法登录?

A: 请确认:
1. Supabase Google OAuth 已正确配置
2. Google OAuth 重定向 URI 正确
3. 浏览器未禁用第三方 Cookie

### Q: 流程图无法渲染?

A: 请检查:
1. Mermaid 语法是否正确
2. 查看浏览器控制台错误信息
3. 尝试简化代码进行调试

## 开发计划

- [ ] 支持更多 AI 模型 (OpenAI, Claude 等)
- [ ] 添加流程图模板库
- [ ] 支持团队协作
- [ ] 导出为图片 (PNG, SVG)
- [ ] 流程图分享功能
- [ ] 移动端适配

## 贡献指南

欢迎提交 Issue 和 Pull Request!

## 许可证

MIT License

## 联系方式

如有问题或建议,请提交 Issue 或联系开发者。
