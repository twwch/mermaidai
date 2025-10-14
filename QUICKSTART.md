# Mermaid AI - 5分钟快速开始

## 📋 前提条件

- Node.js 22+ (推荐使用 nvm)
- 浏览器 (Chrome/Firefox/Safari/Edge)
- Google 账号

## 🚀 快速启动步骤

### 步骤 1: 配置环境 (3分钟)

#### 1.1 创建 Supabase 项目
1. 访问 https://supabase.com/
2. 点击 "Start your project" 并登录
3. 创建新项目,等待初始化完成
4. 进入 **Settings → API**,复制:
   - Project URL
   - anon/public key

#### 1.2 初始化数据库
1. 在 Supabase Dashboard 点击 **SQL Editor**
2. 复制并运行 `supabase-schema.sql` 的内容
3. 确认看到成功消息

#### 1.3 配置 Google OAuth

**在 Google Cloud Console:**
1. 访问 https://console.cloud.google.com/
2. 创建/选择项目
3. 搜索 "OAuth" → **APIs & Services → Credentials**
4. 配置 Consent Screen (选择 External)
5. 创建 OAuth Client ID (Web application)
6. 保存 Client ID 和 Secret

**在 Supabase:**
1. **Authentication → Providers → Google**
2. 启用并填入 Google Client ID 和 Secret
3. 复制 Callback URL

**回到 Google Console:**
1. 在 OAuth Client 中添加 Authorized redirect URI:
   ```
   https://你的项目ID.supabase.co/auth/v1/callback
   ```

#### 1.4 获取 Gemini API Key
1. 访问 https://aistudio.google.com/app/apikey
2. 创建 API Key
3. 复制保存

#### 1.5 配置环境变量
```bash
# 复制配置文件
cp .env.example .env

# 编辑 .env 文件,填入你的配置
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
VITE_GEMINI_API_KEY=AIzaSy...
```

### 步骤 2: 启动应用 (1分钟)

```bash
# 使用 Node 22
nvm use 22

# 安装依赖(首次运行)
npm install

# 检查配置
npm run check-config

# 启动开发服务器
npm run dev
```

或者使用快速启动脚本:
```bash
./start.sh
```

### 步骤 3: 开始使用 (1分钟)

1. 打开浏览器访问: http://localhost:5173
2. 点击 "使用 Google 登录"
3. 授权应用
4. 开始创建你的第一个流程图!

## 🎯 创建第一个流程图

1. **创建项目**
   - 点击侧边栏的 "📁+" 图标
   - 输入项目名称: "我的第一个项目"

2. **创建流程图**
   - 选择刚创建的项目
   - 点击 "新建流程图" 按钮
   - 输入描述,例如:
     ```
     创建一个用户登录流程图,包括:
     1. 用户输入账号密码
     2. 验证登录信息
     3. 如果成功则进入系统
     4. 如果失败则显示错误并重新输入
     ```

3. **等待 AI 生成**
   - AI 会自动生成 Mermaid 代码
   - 左侧显示代码,右侧显示渲染的流程图

4. **微调流程图**
   - 点击 "AI 助手" 按钮
   - 输入修改需求,例如:
     - "把布局改成横向的"
     - "添加一个忘记密码的分支"
     - "把菱形的判断节点改成圆角矩形"

5. **保存和导出**
   - 点击 "保存" 按钮保存到数据库
   - 点击 "导出" 下载 .mmd 文件

## 💡 示例提示词

### 流程图
```
创建一个电商购物流程图,从浏览商品到支付完成
```

### 序列图
```
创建一个用户登录的序列图,包括前端、后端和数据库的交互
```

### 类图
```
创建一个简单的图书管理系统类图,包括图书、作者、借阅记录
```

### 状态图
```
创建一个订单状态机,从待支付到已完成
```

## 🐛 常见问题

### Q: 启动失败?
**A:** 检查 Node 版本:
```bash
node --version  # 应该显示 v22.x.x
```
如果不是,运行:
```bash
nvm use 22
```

### Q: AI 生成失败?
**A:** 检查配置:
```bash
npm run check-config
```
确保所有环境变量已正确填写。

### Q: 登录失败?
**A:** 检查:
1. Supabase 中 Google Provider 已启用
2. Google OAuth Redirect URI 已正确配置
3. 浏览器没有阻止弹窗

### Q: 流程图不显示?
**A:** 检查浏览器控制台是否有错误。确保 Mermaid 语法正确。

## 📚 下一步

- 查看 [README.md](README.md) 了解完整功能
- 阅读 [SETUP.md](SETUP.md) 获取详细配置说明
- 参考 [Mermaid 文档](https://mermaid.js.org/) 学习语法

## 🎉 享受创作!

现在你已经准备好使用 Mermaid AI 创建专业的流程图了!

有问题? 查看 [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) 或提交 Issue。
