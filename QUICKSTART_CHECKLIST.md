# ✅ Mermaid AI 快速启动清单

## 📝 配置步骤 (按顺序完成)

### 1. ⚙️ 获取 Google Client ID

- [ ] 访问 [Google Cloud Console](https://console.cloud.google.com/)
- [ ] 创建/选择项目
- [ ] 配置 OAuth 同意屏幕 (External)
- [ ] 创建 OAuth Client ID (Web application)
- [ ] 添加 Authorized JavaScript origins: `http://localhost:3000`
- [ ] 复制 Client ID

**详细步骤**: [GOOGLE_AUTH_SETUP.md](GOOGLE_AUTH_SETUP.md#%EF%B8%8F-获取-google-client-id)

### 2. 🗄️ 设置 Supabase

- [ ] 访问 [Supabase Dashboard](https://supabase.com/dashboard)
- [ ] 创建新项目
- [ ] 复制 Project URL
- [ ] 复制 anon/public key
- [ ] 进入 SQL Editor
- [ ] 运行 `supabase-schema-new.sql` 脚本
- [ ] 确认 users/projects/diagrams/diagram_history 表已创建

**详细步骤**: [GOOGLE_AUTH_SETUP.md](GOOGLE_AUTH_SETUP.md#%EF%B8%8F-初始化数据库)

### 3. 🤖 获取 Gemini API Key

- [ ] 访问 [Google AI Studio](https://aistudio.google.com/app/apikey)
- [ ] 创建 API Key
- [ ] 复制保存

### 4. 📄 配置环境变量

- [ ] 在项目根目录运行: `cp .env.example .env`
- [ ] 编辑 `.env` 文件:
  ```env
  VITE_SUPABASE_URL=https://xxx.supabase.co
  VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  VITE_GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
  VITE_GEMINI_API_KEY=AIzaSy...
  ```
- [ ] 保存文件

### 5. 🚀 启动应用

```bash
# 确保使用 Node 22
nvm use 22

# 安装依赖
npm install

# 检查配置
npm run check-config

# 启动开发服务器
npm run dev
```

- [ ] 访问 http://localhost:3000
- [ ] 看到登录界面

### 6. ✅ 测试功能

- [ ] 点击 Google 登录按钮
- [ ] 选择 Google 账号并授权
- [ ] 登录成功,进入主界面
- [ ] 创建项目
- [ ] 创建流程图
- [ ] 测试 AI 生成
- [ ] 测试 AI 微调
- [ ] 测试保存和导出

## 🎯 预期结果

### 登录成功后

在 Supabase Dashboard 的 Table Editor 中:
- `users` 表应该有你的记录
- `google_id`, `email`, `name`, `picture` 都有数据

在浏览器中:
- localStorage 有 `mermaid_ai_user` 数据
- 可以看到侧边栏和编辑器界面

### 创建流程图后

- 左侧显示 Mermaid 代码
- 右侧显示渲染的流程图
- 数据保存到 Supabase

## 🐛 遇到问题?

### 常见错误速查

| 错误信息 | 可能原因 | 解决方案 |
|---------|---------|---------|
| "配置错误" | Client ID 未配置 | 检查 `.env` 文件 |
| "401 Unauthorized" | Client ID 无效 | 重新创建 OAuth Client |
| "不在测试用户列表" | OAuth 测试模式 | 添加邮箱到测试用户 |
| "relation 'users' does not exist" | 数据库未初始化 | 运行 SQL 脚本 |
| "permission denied" | RLS 策略问题 | 检查数据库策略 |

### 排查步骤

1. **检查配置**: `npm run check-config`
2. **查看控制台**: 浏览器 F12
3. **查看日志**: Supabase Dashboard > Logs
4. **查看文档**: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

## 📚 完整文档

- **快速开始**: 本文件
- **Google OAuth 设置**: [GOOGLE_AUTH_SETUP.md](GOOGLE_AUTH_SETUP.md)
- **变更说明**: [CHANGES.md](CHANGES.md)
- **故障排查**: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **项目文档**: [README.md](README.md)

## 💡 提示

- 首次启动需要安装依赖,需要几分钟
- 确保使用 Node 22: `node --version`
- 开发服务器在 http://localhost:3000
- 修改代码后会自动热重载

## 🎉 完成!

全部打勾后,你就可以开始使用 Mermaid AI 了!

---

**需要帮助?** 查看文档或提交 Issue
