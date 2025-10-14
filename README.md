# Mermaid AI - AI 驱动的流程图生成工具

基于 AI 技术的 Mermaid 流程图创建和编辑工具，支持通过自然语言描述生成专业的流程图。

![Version](https://img.shields.io/badge/version-2.1.0-blue)
![Node](https://img.shields.io/badge/node-22+-green)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ 功能特性

### 核心功能
- 🤖 **AI 智能生成**: 使用 Google Gemini AI 根据自然语言描述生成专业 Mermaid 流程图
- 💬 **AI 对话微调**: 通过自然对话方式让 AI 调整和优化流程图
- 🎨 **实时预览**: 代码编辑器与实时渲染同步，所见即所得
- 🎭 **多主题支持**: Default、Neutral、Dark、Forest、Base 五种主题随心切换
- 📐 **灵活布局**: 支持 TB（上下）、LR（左右）、BT（下上）、RL（右左）四种布局方向

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
- ☁️ **云端存储**: 使用 Supabase 可靠存储所有数据
- 💾 **自动保存**: 实时保存编辑内容，不怕丢失
- 📥 **导出功能**: 一键导出 Mermaid 源代码文件
- 🎪 **美观对话框**: 现代化的确认对话框替代原生弹窗
- 🌈 **友好空状态**: 新用户引导和功能介绍页面

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

- **前端框架**: React 18 + TypeScript + Vite
- **样式方案**: Tailwind CSS
- **路由管理**: React Router v6
- **代码编辑器**: Monaco Editor
- **图表渲染**: Mermaid.js v11
- **状态管理**: React Context API
- **数据库**: Supabase (PostgreSQL)
- **认证系统**: Google OAuth 2.0
- **AI 引擎**: Google Gemini 2.5 Pro
- **UI 组件**: Lucide React Icons、react-spinners

## 📁 项目结构

```
mermaidai/
├── src/
│   ├── components/          # React 组件
│   │   ├── Auth.tsx        # 登录组件
│   │   ├── ChatPanel.tsx   # AI 对话面板
│   │   ├── CodeEditor.tsx  # Monaco 代码编辑器
│   │   ├── ConfirmDialog.tsx  # 确认对话框
│   │   ├── HistoryDrawer.tsx  # 历史记录抽屉
│   │   └── MermaidRenderer.tsx  # Mermaid 渲染器
│   ├── contexts/            # React Context
│   │   └── AuthContext.tsx # 全局认证状态
│   ├── pages/               # 页面组件
│   │   ├── ProjectList.tsx     # 项目列表页
│   │   ├── DiagramList.tsx     # 流程图列表页
│   │   └── DiagramEditorPage.tsx  # 编辑器页面
│   ├── lib/                 # 第三方库配置
│   │   ├── supabase.ts     # Supabase 客户端
│   │   └── googleAuth.ts   # Google OAuth
│   ├── services/            # 业务服务
│   │   └── ai.ts           # AI 生成和微调
│   └── types/               # TypeScript 类型
│       └── database.ts     # 数据库类型定义
├── supabase-schema-new.sql  # 数据库架构
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
- **布局**：TB（上下）、LR（左右）、BT（下上）、RL（右左）

### 5️⃣ 版本历史

点击历史按钮查看所有修改记录：
- 时间轴展示每次修改
- 查看用户提示和 AI 响应
- 一键恢复到任意历史版本

### 6️⃣ 导出和保存

- 💾 **自动保存**：修改后自动保存到云端
- 📥 **导出代码**：点击导出按钮下载 `.mmd` 文件

## 📖 文档导航

| 文档 | 说明 |
|-----|------|
| [QUICKSTART_CHECKLIST.md](QUICKSTART_CHECKLIST.md) | ✅ 快速启动清单 |
| [GOOGLE_AUTH_SETUP.md](GOOGLE_AUTH_SETUP.md) | 🔐 Google OAuth 详细设置 |
| [CHANGES.md](CHANGES.md) | 📝 重大变更说明 |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | 🐛 故障排查指南 |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | 📊 项目技术架构 |

## 🔄 版本更新

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

**当前版本**：v2.1.0
**最后更新**：2025-10-14
**开发状态**：✅ 生产就绪
**构建状态**：✅ 通过所有测试
