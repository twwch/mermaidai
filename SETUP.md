# Mermaid AI 完整设置指南

## 第一步: 创建 Supabase 项目

### 1.1 注册并创建项目

1. 访问 [Supabase](https://supabase.com/)
2. 点击 "Start your project"
3. 使用 GitHub 账号登录
4. 点击 "New project"
5. 填写项目信息:
   - Name: `mermaid-ai` (或你喜欢的名字)
   - Database Password: 生成一个强密码并保存
   - Region: 选择离你最近的区域
6. 点击 "Create new project"
7. 等待项目初始化完成(约 2-3 分钟)

### 1.2 获取项目凭据

1. 在项目 Dashboard 中,点击左侧的 **Settings** (齿轮图标)
2. 点击 **API**
3. 找到以下信息并复制:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 1.3 初始化数据库

1. 在 Supabase Dashboard 中,点击左侧的 **SQL Editor**
2. 点击 "New query"
3. 打开本项目的 `supabase-schema.sql` 文件
4. 复制所有内容并粘贴到 SQL Editor 中
5. 点击右下角的 "Run" 按钮
6. 确认看到 "Success. No rows returned" 消息
7. 点击左侧的 **Table Editor** 验证以下表已创建:
   - `projects`
   - `diagrams`
   - `diagram_history`

## 第二步: 配置 Google OAuth

### 2.1 创建 Google OAuth 应用

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 在左上角搜索栏中输入 "OAuth" 并选择 **APIs & Services > Credentials**
4. 点击 **Configure Consent Screen**:
   - User Type: 选择 **External**
   - 点击 **Create**
   - App name: `Mermaid AI`
   - User support email: 你的邮箱
   - Developer contact: 你的邮箱
   - 点击 **Save and Continue**
   - Scopes: 点击 **Save and Continue** (使用默认)
   - Test users: 点击 **Save and Continue**
   - 点击 **Back to Dashboard**

5. 创建 OAuth 2.0 凭据:
   - 点击 **Create Credentials** > **OAuth client ID**
   - Application type: **Web application**
   - Name: `Mermaid AI Web Client`
   - Authorized JavaScript origins:
     ```
     http://localhost:5173
     ```
   - Authorized redirect URIs: 稍后填写(先创建)
   - 点击 **Create**
   - **保存 Client ID 和 Client Secret**

### 2.2 在 Supabase 中配置 Google Provider

1. 回到 Supabase Dashboard
2. 点击左侧的 **Authentication** > **Providers**
3. 找到 **Google** 并点击展开
4. 启用 Google provider (切换开关)
5. 填入刚才创建的:
   - Client ID: `你的 Google Client ID`
   - Client Secret: `你的 Google Client Secret`
6. 复制 **Callback URL (for OAuth)**:
   ```
   https://你的项目ID.supabase.co/auth/v1/callback
   ```
7. 点击 **Save**

### 2.3 更新 Google OAuth 重定向 URI

1. 回到 Google Cloud Console
2. 进入 **APIs & Services > Credentials**
3. 点击你刚创建的 OAuth 2.0 Client ID
4. 在 **Authorized redirect URIs** 中添加:
   ```
   https://你的项目ID.supabase.co/auth/v1/callback
   ```
5. 点击 **Save**

## 第三步: 获取 Google Gemini API Key

1. 访问 [Google AI Studio](https://aistudio.google.com/app/apikey)
2. 点击 "Create API Key"
3. 选择一个 Google Cloud 项目(或创建新项目)
4. 点击 "Create API key in existing project"
5. 复制生成的 API Key

## 第四步: 配置环境变量

1. 在项目根目录中,复制 `.env.example` 为 `.env`:
   ```bash
   cp .env.example .env
   ```

2. 打开 `.env` 文件,填入以下信息:
   ```env
   # Supabase 配置
   VITE_SUPABASE_URL=https://你的项目ID.supabase.co
   VITE_SUPABASE_ANON_KEY=你的_supabase_anon_key

   # Google Gemini API 配置
   VITE_GEMINI_API_KEY=你的_gemini_api_key
   ```

## 第五步: 启动应用

1. 确保使用 Node.js 22+:
   ```bash
   nvm use 22
   # 或
   nvm use
   ```

2. 安装依赖:
   ```bash
   npm install
   ```

3. 启动开发服务器:
   ```bash
   npm run dev
   ```

4. 打开浏览器访问: http://localhost:5173

## 验证设置

### 测试登录
1. 点击 "使用 Google 登录"
2. 选择你的 Google 账号
3. 授权应用访问你的基本信息
4. 应该成功进入应用主界面

### 测试创建项目
1. 点击侧边栏的 "新建项目" 图标
2. 输入项目名称,如 "测试项目"
3. 项目应该出现在侧边栏中

### 测试创建流程图
1. 选择刚创建的项目
2. 点击 "新建流程图" 按钮
3. 输入描述,如: "创建一个用户登录流程图"
4. 等待 AI 生成
5. 应该看到左侧显示 Mermaid 代码,右侧显示渲染的流程图

## 常见问题排查

### 1. Google 登录失败

**问题**: 点击登录后报错或无反应

**解决方案**:
- 检查 Google OAuth 重定向 URI 是否正确配置
- 确认 Supabase 中 Google Provider 已启用
- 检查浏览器控制台是否有错误信息
- 确保没有浏览器扩展阻止弹窗

### 2. AI 生成失败

**问题**: 创建流程图时提示 "AI 生成失败"

**解决方案**:
- 检查 Gemini API Key 是否正确
- 确认 API Key 有足够的配额
- 检查网络连接
- 查看浏览器控制台的详细错误信息

### 3. 数据库操作失败

**问题**: 无法创建项目或流程图

**解决方案**:
- 检查 Supabase URL 和 Key 是否正确
- 确认数据库表已正确创建
- 检查 RLS 策略是否正确应用
- 在 Supabase Dashboard 中查看日志

### 4. 流程图不渲染

**问题**: 右侧预览区域显示错误或空白

**解决方案**:
- 检查 Mermaid 语法是否正确
- 查看浏览器控制台的错误信息
- 尝试简化代码测试
- 参考 [Mermaid 文档](https://mermaid.js.org/)

## 开发模式 vs 生产模式

### 开发模式
- 使用 `npm run dev`
- 热重载
- 详细的错误信息
- Source maps

### 生产构建
```bash
npm run build
npm run preview  # 预览生产构建
```

## 下一步

- 阅读 [README.md](README.md) 了解功能详情
- 查看 [Mermaid 语法文档](https://mermaid.js.org/)
- 探索不同类型的图表

## 需要帮助?

如果遇到问题:
1. 检查浏览器控制台错误
2. 查看 Supabase Dashboard 日志
3. 参考本文档的常见问题部分
4. 提交 Issue 到项目仓库
