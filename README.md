# Mermaid AI - AI 驱动的流程图生成工具

基于 AI 技术的 Mermaid 流程图创建和编辑工具,支持通过自然语言描述生成专业的流程图。

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![Node](https://img.shields.io/badge/node-22+-green)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ 功能特性

- 🤖 **AI 生成**: 使用 Google Gemini AI 根据自然语言生成 Mermaid 流程图
- 🎨 **实时预览**: 左侧代码编辑器,右侧实时渲染
- 💬 **AI 对话微调**: 通过对话方式让 AI 调整流程图
- 📚 **项目管理**: 支持多个项目,每个项目包含多个流程图
- ⏱️ **历史记录**: 记录每次修改,形成版本时间轴
- 🔐 **Google 登录**: 使用 Google OAuth 直接登录
- ☁️ **云端存储**: 使用 Supabase 存储所有数据
- 📥 **导出功能**: 导出 Mermaid 源代码文件

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

- **前端**: React 18 + TypeScript + Vite + Tailwind CSS
- **编辑器**: Monaco Editor
- **渲染**: Mermaid.js
- **状态管理**: Zustand
- **数据库**: Supabase (PostgreSQL)
- **认证**: Google OAuth SDK
- **AI**: Google Gemini 2.0 Flash

## 📁 项目结构

```
mermaidai/
├── src/
│   ├── components/        # React 组件
│   ├── hooks/            # React Hooks
│   ├── lib/              # 第三方库配置
│   ├── services/         # 业务服务
│   ├── store/            # 状态管理
│   └── types/            # TypeScript 类型
├── supabase-schema-new.sql  # 数据库架构
├── QUICKSTART_CHECKLIST.md  # 快速启动清单 ⭐
├── GOOGLE_AUTH_SETUP.md     # Google OAuth 设置指南
├── CHANGES.md               # 重大变更说明
├── TROUBLESHOOTING.md       # 故障排查指南
└── README.md                # 本文件
```

## 🎯 使用示例

### 创建流程图

1. 登录应用
2. 创建新项目
3. 点击"新建流程图"
4. 输入描述,例如:
   ```
   创建一个用户注册登录流程图,包括:
   - 输入用户名和密码
   - 验证信息
   - 成功则进入系统
   - 失败则重新输入
   ```
5. AI 自动生成 Mermaid 代码和流程图

### AI 微调

使用 AI 助手对流程图进行修改:
- "改成横向布局"
- "添加一个忘记密码的分支"
- "把菱形节点改成圆角矩形"

## 📖 文档导航

| 文档 | 说明 |
|-----|------|
| [QUICKSTART_CHECKLIST.md](QUICKSTART_CHECKLIST.md) | ✅ 快速启动清单 |
| [GOOGLE_AUTH_SETUP.md](GOOGLE_AUTH_SETUP.md) | 🔐 Google OAuth 详细设置 |
| [CHANGES.md](CHANGES.md) | 📝 重大变更说明 |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | 🐛 故障排查指南 |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | 📊 项目技术架构 |

## 🔄 最近更新 (v2.0.0)

- ✅ 改用 Google OAuth 直接登录
- ✅ 自定义 users 表存储用户数据
- ✅ 简化登录流程
- ✅ 改进会话管理
- ✅ 端口改为 3000

详情查看: [CHANGES.md](CHANGES.md)

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

---

**当前版本**: v2.0.0
**最后更新**: 2025-10-14
**开发状态**: ✅ 生产就绪
