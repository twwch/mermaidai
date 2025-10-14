# 重大更新 - Google OAuth 直接登录

## 🔄 变更概览

本次更新将登录方式从 Supabase Auth 改为 **Google OAuth 直接登录**,用户数据存储在自定义的 `users` 表中。

## 📋 主要变更

### 1. 登录方式变更

**之前**:
- 使用 Supabase Auth 的 OAuth Provider
- 用户数据存储在 `auth.users` 表

**现在**:
- 直接使用 Google OAuth SDK (`@react-oauth/google`)
- 用户数据存储在自定义 `users` 表
- 使用 localStorage 维护会话

### 2. 新增依赖

```json
{
  "@react-oauth/google": "^0.12.2",
  "jwt-decode": "^4.0.0"
}
```

### 3. 数据库架构变更

**新增 users 表**:
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  google_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  picture TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

**projects 表变更**:
```sql
-- 之前
user_id UUID REFERENCES auth.users(id)

-- 现在
user_id UUID REFERENCES users(id)
```

### 4. 环境变量变更

**新增**:
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

**不再需要**:
- Supabase 的 Google OAuth 配置

### 5. 端口变更

开发服务器端口从 `5173` 改为 `3000`

## 📝 新文件

1. **supabase-schema-new.sql** - 新的数据库架构(包含 users 表)
2. **GOOGLE_AUTH_SETUP.md** - Google OAuth 完整设置指南

## 🔧 修改的文件

### src/hooks/useAuth.ts
- 移除 Supabase Auth 依赖
- 实现自定义登录逻辑
- 使用 localStorage 存储会话
- 新增 `handleGoogleLogin` 方法

### src/components/Auth.tsx
- 使用 `@react-oauth/google` 组件
- 实现 JWT 解码
- 添加配置检查提示

### src/types/index.ts
- 新增 `User` 接口

### vite.config.ts
- 添加端口配置 (3000)

### .env.example
- 添加 `VITE_GOOGLE_CLIENT_ID`

## 🚀 迁移步骤

### 对于新项目

1. 安装依赖:
   ```bash
   npm install
   ```

2. 配置环境变量:
   ```bash
   cp .env.example .env
   # 编辑 .env 填入配置
   ```

3. 获取 Google Client ID:
   - 参考 [GOOGLE_AUTH_SETUP.md](GOOGLE_AUTH_SETUP.md)

4. 初始化数据库:
   - 在 Supabase SQL Editor 中运行 `supabase-schema-new.sql`

5. 启动应用:
   ```bash
   npm run dev
   ```

6. 访问 http://localhost:3000

### 对于已有项目

⚠️ **重要**: 如果你已经有使用 Supabase Auth 的数据,需要进行数据迁移。

1. 备份现有数据

2. 执行数据迁移 SQL:
   ```sql
   -- 创建 users 表(如果不存在)
   CREATE TABLE IF NOT EXISTS users (...);

   -- 迁移现有用户数据
   INSERT INTO users (id, google_id, email, name, picture)
   SELECT
     id,
     raw_user_meta_data->>'sub' as google_id,
     email,
     raw_user_meta_data->>'name' as name,
     raw_user_meta_data->>'picture' as picture
   FROM auth.users
   WHERE raw_user_meta_data->>'sub' IS NOT NULL;
   ```

3. 更新 projects 外键约束

4. 更新代码并重新部署

## 🔍 验证清单

登录成功后检查:

- [ ] users 表中有用户记录
- [ ] localStorage 中有 `mermaid_ai_user` 数据
- [ ] 可以创建项目
- [ ] 可以创建流程图
- [ ] 可以使用 AI 生成
- [ ] 可以正常退出登录

## 📊 登录流程对比

### 旧流程 (Supabase Auth)
```
用户点击登录
  ↓
跳转到 Supabase Auth
  ↓
Google 授权
  ↓
回调到 Supabase
  ↓
Supabase 创建会话
  ↓
回调到应用
  ↓
应用获取会话
```

### 新流程 (直接 OAuth)
```
用户点击登录
  ↓
Google OAuth 弹窗
  ↓
用户授权
  ↓
获取 JWT Token
  ↓
解码获取用户信息
  ↓
保存到 users 表
  ↓
保存到 localStorage
  ↓
更新应用状态
```

## ⚡ 优势

1. **更简单**: 不依赖 Supabase Auth
2. **更快**: 少一次网络跳转
3. **更灵活**: 完全控制用户数据结构
4. **更便宜**: 不占用 Supabase Auth 配额

## ⚠️ 注意事项

1. **会话管理**: 使用 localStorage,刷新页面会保持登录状态
2. **安全性**: JWT Token 在前端解码,适合单页应用
3. **测试用户**: 开发阶段需要将测试邮箱添加到 Google Cloud Console
4. **生产环境**:
   - 更新 Google OAuth Authorized origins
   - 考虑添加 token 刷新机制
   - 实现更严格的 RLS 策略

## 📚 相关文档

- [GOOGLE_AUTH_SETUP.md](GOOGLE_AUTH_SETUP.md) - 详细设置指南
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - 故障排查
- [README.md](README.md) - 项目文档

## 🆘 需要帮助?

- 查看 [GOOGLE_AUTH_SETUP.md](GOOGLE_AUTH_SETUP.md) 的常见问题部分
- 检查浏览器控制台错误
- 提交 Issue

---

**更新日期**: 2025-10-14
**版本**: v2.0.0
