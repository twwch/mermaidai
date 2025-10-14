# Mermaid AI 项目总结

## 项目概述

**Mermaid AI** 是一个基于 AI 技术的流程图创建和编辑工具,用户可以通过自然语言描述生成专业的 Mermaid 流程图,并通过 AI 对话进行实时微调。

## 已完成功能

### ✅ 核心功能
- **AI 流程图生成**: 使用 Google Gemini AI 根据用户描述生成 Mermaid 代码
- **实时预览**: 左侧代码编辑器,右侧实时渲染预览
- **AI 对话微调**: 通过对话方式让 AI 帮助调整流程图
- **项目管理**: 支持创建多个项目,每个项目包含多个流程图
- **历史记录**: 记录每次修改的历史(数据库已支持)
- **导出功能**: 导出 Mermaid 源代码文件

### ✅ 用户认证
- **Google OAuth 登录**: 通过 Supabase Auth 实现
- **用户会话管理**: 自动保持登录状态
- **安全的用户隔离**: 每个用户只能访问自己的数据

### ✅ 数据存储
- **Supabase PostgreSQL 数据库**:
  - `projects` 表: 存储项目信息
  - `diagrams` 表: 存储流程图
  - `diagram_history` 表: 存储历史记录
- **Row Level Security (RLS)**: 确保数据安全
- **自动时间戳**: 创建和更新时间自动记录

### ✅ 用户界面
- **响应式设计**: 使用 Tailwind CSS
- **Monaco Editor**: 专业的代码编辑器
- **Mermaid.js 渲染**: 实时渲染流程图
- **直观的侧边栏**: 项目和流程图管理
- **美观的登录页面**: Google 品牌设计

## 技术架构

### 前端
- **React 18**: 使用 Hooks 和函数组件
- **TypeScript**: 类型安全
- **Vite**: 快速的开发构建工具
- **Tailwind CSS**: 实用优先的 CSS 框架
- **Zustand**: 轻量级状态管理
- **Monaco Editor**: VS Code 编辑器核心
- **Mermaid.js**: 流程图渲染引擎

### 后端服务
- **Supabase**:
  - PostgreSQL 数据库
  - Authentication (Google OAuth)
  - Row Level Security
  - Real-time subscriptions (可扩展)
- **Google Gemini AI**:
  - Model: gemini-2.0-flash-exp
  - 自然语言处理
  - Mermaid 代码生成

### 开发工具
- **Node.js 22+**: 运行环境
- **npm**: 包管理器
- **ESLint**: 代码检查
- **TypeScript Compiler**: 类型检查

## 项目结构

```
mermaidai/
├── src/
│   ├── components/          # React 组件
│   │   ├── Auth.tsx        # 登录页面
│   │   ├── Sidebar.tsx     # 侧边栏(项目/流程图列表)
│   │   ├── DiagramEditor.tsx  # 主编辑器
│   │   ├── CodeEditor.tsx  # Monaco 代码编辑器
│   │   ├── MermaidRenderer.tsx  # Mermaid 渲染器
│   │   └── ChatPanel.tsx   # AI 对话面板
│   ├── hooks/              # React Hooks
│   │   └── useAuth.ts      # 认证 Hook
│   ├── lib/                # 第三方库配置
│   │   └── supabase.ts     # Supabase 客户端
│   ├── services/           # 业务服务
│   │   └── ai.ts           # AI 服务(Gemini)
│   ├── store/              # 状态管理
│   │   └── useStore.ts     # Zustand Store
│   ├── types/              # TypeScript 类型定义
│   │   ├── database.ts     # 数据库类型
│   │   └── index.ts        # 应用类型
│   ├── App.tsx             # 根组件
│   ├── main.tsx            # 应用入口
│   └── index.css           # 全局样式
├── public/                 # 静态资源
├── supabase-schema.sql     # 数据库架构 SQL
├── .env.example            # 环境变量示例
├── .nvmrc                  # Node 版本指定
├── check-config.js         # 配置检查工具
├── start.sh                # 快速启动脚本
├── SETUP.md                # 详细设置指南
├── README.md               # 项目文档
└── PROJECT_SUMMARY.md      # 本文件
```

## 数据库架构

### projects 表
- `id`: UUID (主键)
- `user_id`: UUID (外键到 auth.users)
- `name`: TEXT (项目名称)
- `description`: TEXT (项目描述,可空)
- `created_at`: TIMESTAMPTZ (创建时间)
- `updated_at`: TIMESTAMPTZ (更新时间)

### diagrams 表
- `id`: UUID (主键)
- `project_id`: UUID (外键到 projects)
- `name`: TEXT (流程图名称)
- `mermaid_code`: TEXT (Mermaid 代码)
- `created_at`: TIMESTAMPTZ (创建时间)
- `updated_at`: TIMESTAMPTZ (更新时间)

### diagram_history 表
- `id`: UUID (主键)
- `diagram_id`: UUID (外键到 diagrams)
- `mermaid_code`: TEXT (该版本的代码)
- `user_prompt`: TEXT (用户输入,可空)
- `ai_response`: TEXT (AI 响应,可空)
- `created_at`: TIMESTAMPTZ (创建时间)

## 核心功能实现

### 1. AI 生成流程图
```typescript
// services/ai.ts
export async function generateMermaidCode(
  userPrompt: string,
  currentCode?: string
): Promise<string>
```

- 使用 Google Gemini 2.0 Flash
- 支持从零生成或基于现有代码修改
- 自动清理 AI 返回的 markdown 标记

### 2. 实时预览
```typescript
// components/MermaidRenderer.tsx
- useEffect 监听代码变化
- mermaid.render() 渲染 SVG
- 错误处理和显示
```

### 3. 项目和流程图管理
```typescript
// store/useStore.ts
- Zustand 状态管理
- CRUD 操作(增删改查)
- 当前选中项追踪
```

### 4. 数据持久化
```typescript
// lib/supabase.ts
- Supabase 客户端配置
- 自动会话管理
- RLS 保护数据安全
```

## 环境变量配置

需要配置以下环境变量(在 `.env` 文件中):

```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_GEMINI_API_KEY=AIzaSy...
```

## 快速开始

### 1. 使用快速启动脚本
```bash
./start.sh
```

### 2. 手动启动
```bash
# 使用 Node 22
nvm use 22

# 安装依赖
npm install

# 检查配置
npm run check-config

# 启动开发服务器
npm run dev
```

### 3. 访问应用
打开浏览器访问: http://localhost:5173

## 使用流程

1. **登录**: 点击 "使用 Google 登录"
2. **创建项目**: 点击侧边栏的 "新建项目" 图标
3. **创建流程图**:
   - 选择项目
   - 点击 "新建流程图"
   - 描述你想要的流程图
4. **编辑流程图**:
   - 手动编辑左侧代码
   - 或使用 AI 助手对话微调
5. **保存和导出**:
   - 点击 "保存" 按钮
   - 点击 "导出" 下载 .mmd 文件

## 支持的图表类型

- 流程图 (Flowchart): `flowchart TD` / `flowchart LR`
- 序列图 (Sequence): `sequenceDiagram`
- 类图 (Class): `classDiagram`
- 状态图 (State): `stateDiagram-v2`
- ER图 (Entity Relationship): `erDiagram`
- 甘特图 (Gantt): `gantt`
- 饼图 (Pie): `pie`
- Git图 (Git Graph): `gitGraph`

## 待实现功能

### 近期计划
- [ ] 历史记录时间轴 UI
- [ ] 流程图版本对比
- [ ] 流程图模板库
- [ ] 导出为图片(PNG/SVG)
- [ ] 流程图分享链接

### 长期计划
- [ ] 支持更多 AI 模型(Claude, OpenAI)
- [ ] 团队协作功能
- [ ] 评论和批注
- [ ] 移动端适配
- [ ] 桌面应用(Electron)

## 性能优化

### 已实现
- Monaco Editor 懒加载
- Mermaid 按需渲染
- Zustand 最小化重渲染
- Vite 代码分割

### 可优化
- 虚拟滚动(大量项目/流程图)
- 图片缓存
- Service Worker 离线支持
- WebSocket 实时协作

## 安全考虑

### 已实现
- Supabase RLS 策略
- 用户数据隔离
- API Key 环境变量管理
- HTTPS 强制(生产环境)

### 注意事项
- ⚠️ Gemini API Key 在浏览器中暴露(开发模式)
- 建议: 生产环境使用后端代理调用 AI API

## 故障排查

### 常见问题

1. **开发服务器启动失败**
   - 检查 Node 版本 (需要 22+)
   - 运行 `npm install` 重新安装依赖

2. **AI 生成失败**
   - 检查 Gemini API Key
   - 检查网络连接
   - 查看浏览器控制台错误

3. **登录失败**
   - 检查 Supabase 配置
   - 确认 Google OAuth 已正确设置
   - 检查重定向 URI

4. **渲染错误**
   - 检查 Mermaid 语法
   - 简化代码测试
   - 查看错误消息

## 开发建议

### 代码规范
- 使用 TypeScript 类型
- 遵循 React Hooks 规则
- 组件保持单一职责
- 使用 ESLint 检查代码

### Git 工作流
```bash
# 功能分支
git checkout -b feature/new-feature

# 提交
git commit -m "feat: add new feature"

# 合并到主分支
git checkout main
git merge feature/new-feature
```

### 测试
- 手动测试所有功能
- 检查不同浏览器兼容性
- 测试响应式布局

## 部署

### 构建生产版本
```bash
npm run build
```

### 预览生产构建
```bash
npm run preview
```

### 部署平台建议
- **Vercel**: 自动部署,零配置
- **Netlify**: 持续部署
- **Cloudflare Pages**: 全球 CDN

### 环境变量配置
在部署平台中配置相同的环境变量

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request!

## 联系方式

- GitHub Issues: 报告 bug 或功能请求
- 文档: 参考 SETUP.md 和 README.md

---

**当前版本**: v1.0.0
**最后更新**: 2025-10-14
**开发状态**: ✅ 核心功能完成,可用于生产
