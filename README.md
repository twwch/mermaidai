# Mermaid AI - AI 驱动的流程图生成工具

基于 AI 技术的 Mermaid 流程图创建和编辑工具，支持通过自然语言描述生成专业的流程图。

![Version](https://img.shields.io/badge/version-2.3.0-blue)
![Node](https://img.shields.io/badge/node-22+-green)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ 功能特性

### 核心功能
- 🤖 **AI 智能生成**: 使用 Google Gemini AI 根据自然语言描述生成专业 Mermaid 流程图
- 💬 **AI 对话微调**: 通过自然对话方式让 AI 调整和优化流程图
- 🎨 **实时预览**: 代码编辑器与实时渲染同步，所见即所得
- 🎭 **多主题支持**: Default、Neutral、Dark、Forest、Base 五种主题随心切换
- 📐 **智能布局引擎**: 支持 Dagre（默认分层）和 ELK（自适应智能）两种布局算法
- 🔍 **缩放平移功能**: 支持鼠标滚轮缩放、拖拽平移、重置视图等交互操作
- 📊 **Markdown 编辑器**: 集成 Markdown + Mermaid 编辑器，支持混合文档和流程图
- 📄 **PDF 导出**: Markdown 文档可一键导出为 PDF，支持大型流程图自动分页

### 项目管理
- 📚 **项目组织**: 创建多个项目空间，分类管理流程图
- 🖼️ **缩略图预览**: 流程图列表显示实时渲染的缩略图
- 🎯 **卡片式界面**: 现代化的卡片网格布局，一目了然
- 🔍 **快速导航**: 三级导航结构（项目 → 流程图 → 编辑器）

### 版本管理
- ⏱️ **完整历史**: 自动记录每次修改，形成版本时间轴
- 🔄 **一键回退**: 随时查看和恢复任意历史版本
- 📝 **修改追踪**: 记录用户提示、AI 响应和代码变化

### 用户体验
- 🔐 **Google 登录**: 使用 Google OAuth 安全便捷登录
- 🌍 **多语言支持**: 支持中文、英文、日文、韩文四种语言，自动检测浏览器语言
- ☁️ **云端存储**: 使用 Supabase 可靠存储所有数据
- 💾 **自动保存**: 实时保存编辑内容，不怕丢失
- 📥 **多格式导出**: 支持导出为 SVG、PNG、MMD 源文件和 PDF 格式
- 🎪 **美观通知系统**: 自定义 Toast 通知替代所有原生 alert 弹窗，支持自动关闭
- 🎨 **错误提示优化**: 渲染失败时显示友好的错误提示，自动清理底部错误信息
- 🌈 **友好空状态**: 新用户引导和功能介绍页面
- 📱 **无限滚动**: 项目和流程图列表支持分页加载，流畅浏览大量数据
- ✏️ **Markdown 工具栏**: 提供 15+ 常用 Markdown 编辑工具，快速插入标题、表格、代码块等

## 🚀 快速开始

### 方式一: 快速启动清单 (推荐)

按照清单一步步完成配置:

📋 **[QUICKSTART_CHECKLIST.md](QUICKSTART_CHECKLIST.md)** ⭐

### 方式二: 详细教程

查看完整的设置指南:

📖 **[GOOGLE_AUTH_SETUP.md](GOOGLE_AUTH_SETUP.md)**

### 最简步骤

```bash
# 1. 克隆项目
git clone <repository-url>
cd mermaidai

# 2. 安装依赖
nvm use 22
npm install

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env 填入你的配置

# 4. 启动应用
npm run dev
```

访问: http://localhost:3000

## 📋 配置需求

需要获取以下配置:

1. **Google Client ID**: 用于 Google OAuth 登录
   - 获取方式: [Google Cloud Console](https://console.cloud.google.com/)

2. **Supabase 配置**: 用于数据存储
   - 获取方式: [Supabase Dashboard](https://supabase.com/dashboard)
   - Project URL
   - anon key

3. **Gemini API Key**: 用于 AI 生成
   - 获取方式: [Google AI Studio](https://aistudio.google.com/app/apikey)

## 🏗️ 技术栈

- **前端框架**: React 19 + TypeScript + Vite
- **样式方案**: Tailwind CSS
- **路由管理**: React Router v6
- **国际化**: i18next + react-i18next
- **代码编辑器**: Monaco Editor
- **图表渲染**: Mermaid.js v11.12.0 + ELK 布局引擎
- **图表交互**: svg-pan-zoom (缩放平移)
- **状态管理**: Zustand + React Context API
- **数据库**: Supabase (PostgreSQL)
- **认证系统**: Google OAuth 2.0
- **AI 引擎**: Google Gemini 2.0 Flash
- **UI 组件**: Lucide React Icons、react-spinners
- **Markdown**: react-markdown + remark-gfm + rehype-raw
- **PDF 生成**: jsPDF + html2canvas
- **部署平台**: Vercel (支持 SPA 路由)

## 📁 项目结构

```
mermaidai/
├── src/
│   ├── components/          # React 组件
│   │   ├── Auth.tsx        # 登录组件
│   │   ├── ChatPanel.tsx   # AI 对话面板
│   │   ├── CodeEditor.tsx  # Monaco 代码编辑器
│   │   ├── ConfirmDialog.tsx  # 确认对话框
│   │   ├── DiagramEditor.tsx  # 流程图编辑器
│   │   ├── ErrorToast.tsx  # 错误提示组件
│   │   ├── HistoryDrawer.tsx  # 历史记录抽屉
│   │   ├── LanguageSwitcher.tsx  # 语言切换器
│   │   ├── MarkdownEditor.tsx  # Monaco Markdown 编辑器
│   │   ├── MarkdownToolbar.tsx # Markdown 编辑工具栏
│   │   ├── MarkdownWithMermaid.tsx # Markdown + Mermaid 渲染器
│   │   ├── MermaidRenderer.tsx  # Mermaid 渲染器（支持缩放平移）
│   │   └── Toast.tsx       # Toast 通知组件
│   ├── contexts/            # React Context
│   │   └── AuthContext.tsx # 全局认证状态
│   ├── pages/               # 页面组件
│   │   ├── ProjectList.tsx     # 项目列表页
│   │   ├── DiagramList.tsx     # 流程图列表页
│   │   ├── DiagramEditorPage.tsx  # 流程图编辑器页面
│   │   └── MarkdownEditorPage.tsx # Markdown 编辑器页面
│   ├── locales/             # 国际化翻译文件
│   │   ├── zh.ts           # 中文翻译
│   │   ├── en.ts           # 英文翻译
│   │   ├── ja.ts           # 日文翻译
│   │   └── ko.ts           # 韩文翻译
│   ├── lib/                 # 第三方库配置
│   │   ├── supabase.ts     # Supabase 客户端
│   │   └── googleAuth.ts   # Google OAuth
│   ├── services/            # 业务服务
│   │   └── ai.ts           # AI 生成和微调
│   ├── store/               # 状态管理
│   │   └── useStore.ts     # Zustand 全局状态
│   ├── i18n.ts              # 国际化配置
│   └── types/               # TypeScript 类型
│       └── database.ts     # 数据库类型定义
├── supabase-schema-new.sql  # 数据库架构
├── vercel.json              # Vercel 部署配置
├── QUICKSTART_CHECKLIST.md  # 快速启动清单 ⭐
├── GOOGLE_AUTH_SETUP.md     # Google OAuth 设置指南
├── CHANGES.md               # 重大变更说明
├── TROUBLESHOOTING.md       # 故障排查指南
└── README.md                # 本文件
```

## 🎯 使用指南

### 1️⃣ 创建项目

首次登录会看到欢迎页面，点击"创建新项目"按钮：
- 输入项目名称（如："电商系统设计"）
- 项目将显示为卡片，点击进入

### 2️⃣ 生成流程图

在项目内点击"创建新流程图"，用自然语言描述你的需求：

**示例 1 - 用户流程：**
```
创建一个用户注册登录流程图，包括：
- 输入用户名和密码
- 验证信息
- 成功则进入系统
- 失败则重新输入
```

**示例 2 - 业务流程：**
```
画一个订单处理流程，从下单到收货的完整过程
```

**示例 3 - 系统架构：**
```
展示一个微服务架构图，包括前端、网关、各个服务和数据库
```

### 3️⃣ AI 智能微调

在编辑器中点击 AI 对话按钮，与 AI 互动修改流程图：

- 💬 "改成横向布局"
- 💬 "添加一个忘记密码的分支"
- 💬 "把菱形节点改成圆角矩形"
- 💬 "使用暗色主题"
- 💬 "添加错误处理流程"

### 4️⃣ 主题和布局

右上角工具栏可以快速切换：
- **主题**：Default（默认）、Neutral（中性）、Dark（暗色）、Forest（森林）、Base（基础）
- **布局引擎**：
  - **Dagre**：默认分层布局，适合传统流程图
  - **ELK**：自适应智能布局，适合复杂关系图

### 4.5️⃣ 交互操作

流程图支持丰富的交互功能：
- 🔍 **缩放**：鼠标滚轮或点击放大/缩小按钮
- 🖱️ **平移**：鼠标拖拽移动画布
- 📐 **适应窗口**：自动缩放以适应当前窗口大小
- 🔄 **重置视图**：恢复到初始状态

### 5️⃣ 版本历史

点击历史按钮查看所有修改记录：
- 时间轴展示每次修改
- 查看用户提示和 AI 响应
- 一键恢复到任意历史版本

### 6️⃣ 语言切换

点击右上角的语言切换器（地球图标）：
- 🇨🇳 **中文**：简体中文界面
- 🇺🇸 **English**：英文界面
- 🇯🇵 **日本語**：日文界面
- 🇰🇷 **한국어**：韩文界面

语言设置会自动保存，下次访问时使用您选择的语言。

### 7️⃣ 导出和保存

- 💾 **自动保存**：修改后自动保存到云端
- 📥 **多格式导出**：
  - **PNG 图片**：高清晰度 2x 分辨率图片，适合插入文档
  - **SVG 矢量**：可无限缩放的矢量图，适合专业排版
  - **MMD 源码**：Mermaid 源代码文件，方便分享和版本控制

### 8️⃣ Markdown 编辑器

从项目列表页可以进入独立的 Markdown + Mermaid 编辑器：
- ✍️ **Monaco 编辑器**：专业的代码编辑体验
- 🎨 **实时预览**：左侧编辑，右侧实时渲染
- 🛠️ **快捷工具栏**：15+ 常用 Markdown 和 Mermaid 模板
- 📄 **PDF 导出**：
  - 支持混合 Markdown 文本和 Mermaid 流程图
  - 自动处理大型流程图
  - 智能分页，确保内容完整
  - 高质量输出 (2x scale, PNG 格式)

## 📖 文档导航

| 文档 | 说明 |
|-----|------|
| [QUICKSTART_CHECKLIST.md](QUICKSTART_CHECKLIST.md) | ✅ 快速启动清单 |
| [GOOGLE_AUTH_SETUP.md](GOOGLE_AUTH_SETUP.md) | 🔐 Google OAuth 详细设置 |
| [CHANGES.md](CHANGES.md) | 📝 重大变更说明 |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | 🐛 故障排查指南 |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | 📊 项目技术架构 |

## 🔄 版本更新

### v2.3.0 (2025-10-16)

**通知系统优化：**
- 🎪 **Toast 通知系统**：替换所有原生 alert 弹窗为自定义 Toast 组件
  - 自动关闭功能（5秒后）
  - 手动关闭按钮
  - 进度条指示
  - 平滑的动画效果
- 🎨 **错误提示改进**：渲染失败时使用 ErrorToast 组件，自动清理 Mermaid 生成的底部错误文本
- ✅ **统一通知风格**：所有错误、成功、信息提示使用一致的 UI 设计

**Markdown 编辑器新增：**
- 📊 **独立 Markdown 编辑器**：支持 Markdown + Mermaid 混合编辑
- ✏️ **Monaco 编辑器集成**：专业代码编辑体验，支持语法高亮、自动补全
- 🛠️ **Markdown 工具栏**：15+ 快捷工具（标题、表格、列表、代码块、Mermaid 等）
- 📄 **PDF 导出功能**：
  - 完整的 Markdown + Mermaid 渲染
  - 修复 oklch 颜色解析错误
  - 支持大型流程图自动分页
  - 智能页面分割，避免流程图跨页断裂
  - 使用 PNG 格式和 2x scale 提升导出质量

**渲染器增强：**
- 🔍 **缩放平移功能**：集成 svg-pan-zoom，支持鼠标滚轮缩放、拖拽平移
- 📐 **布局引擎切换**：支持 Dagre 和 ELK 两种布局算法
- 🎨 **交互控制优化**：新增放大、缩小、适应窗口、重置视图按钮
- 🧹 **错误清理增强**：自动清理 Mermaid 在 DOM 中创建的错误元素

**代码质量：**
- ✅ 消除所有原生 alert() 调用
- 🔧 优化错误处理逻辑
- 📦 更新依赖包版本

### v2.2.0 (2025-10-14)

**国际化支持：**
- 🌍 完整的多语言支持：中文、英文、日文、韩文
- 🔄 自动检测浏览器语言，智能切换
- 💾 语言偏好持久化保存到本地
- 📅 日期和时间本地化显示
- 🎨 全局语言切换器，一键切换界面语言

**AI 生成优化：**
- 🤖 增强 AI Prompt，严格遵守 Mermaid 语法规范
- ✅ 节点ID规范化（仅使用字母、数字、下划线）
- 🔍 智能代码验证，自动过滤无效内容
- 📋 详细的语法约束和错误预防机制
- 🎯 大幅降低渲染失败率，提升生成质量

**用户体验改进：**
- 🚨 渲染错误改为弹窗提示，界面更简洁
- 📱 支持无限滚动分页加载（每页10条）
- 📌 固定页面标题栏，滚动时保持可见
- 🔄 优化空状态下的滚动体验

**部署优化：**
- ☁️ 修复 Vercel 部署的路由 404 问题
- 🔧 添加 SPA 路由配置支持

### v2.1.0 (2025-10-14)

**UI/UX 重大改进：**
- ✨ 全新卡片式界面布局，替代侧边栏设计
- 🎨 美观的确认对话框，替代浏览器原生弹窗
- 🖼️ 流程图列表显示缩略图预览，尊重用户设置的主题和布局
- 🌈 新用户欢迎页面，展示核心功能介绍
- 📚 空状态页面提供使用示例和引导

**技术优化：**
- ⚡ 使用 react-spinners 加载组件库
- 🔧 优化缩略图渲染队列，防止冲突
- 🎯 改进列表加载状态展示
- 🐛 修复所有 TypeScript 构建错误

### v2.0.0 (2025-10-13)

**认证系统升级：**
- ✅ 改用 Google OAuth 直接登录
- ✅ 自定义 users 表存储用户数据
- ✅ 简化登录流程
- ✅ 改进会话管理
- ✅ 端口改为 3000

详情查看：[CHANGES.md](CHANGES.md)

## 🐛 故障排查

遇到问题? 查看:
1. [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - 完整排查指南
2. 浏览器控制台 (F12)
3. Supabase Dashboard 日志
4. GitHub Issues

## 🤝 贡献

欢迎提交 Issue 和 Pull Request!

## 📄 许可证

MIT License

## 📞 需要帮助?

- 📋 查看[快速启动清单](QUICKSTART_CHECKLIST.md)
- 📖 阅读[完整文档](GOOGLE_AUTH_SETUP.md)
- 🐛 查看[故障排查](TROUBLESHOOTING.md)
- 💬 提交 GitHub Issue

## 🎨 界面预览

### 项目列表页
- 现代化卡片网格布局
- 渐变色项目图标
- 悬停显示删除按钮
- 空状态展示功能介绍

### 流程图列表页
- 实时渲染的缩略图预览
- 保持用户设置的主题和布局
- 串行渲染队列，确保稳定性
- AI 生成创建新流程图

### 编辑器页面
- Monaco 代码编辑器（左侧）
- Mermaid 实时渲染（右侧）
- AI 对话面板辅助修改
- 历史版本时间轴
- 主题和布局快速切换

---

**当前版本**：v2.2.0
**最后更新**：2025-10-14
**开发状态**：✅ 生产就绪
**构建状态**：✅ 通过所有测试
**语言支持**：🌍 中文 | English | 日本語 | 한국어
