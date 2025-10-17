-- Mermaid AI 完整数据库架构
-- 不使用外键,禁用 RLS
-- 在 Supabase SQL Editor 中运行此脚本

-- 1. 删除所有现有表
DROP TABLE IF EXISTS diagram_history CASCADE;
DROP TABLE IF EXISTS diagrams CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 2. 创建 users 表
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  google_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  picture TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 创建 projects 表 (不使用外键)
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 创建 diagrams 表 (不使用外键)
-- 包含 layout、theme 和 direction 字段用于存储每个流程图的布局、主题和方向配置
CREATE TABLE diagrams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL,
  name TEXT NOT NULL,
  mermaid_code TEXT NOT NULL,
  layout TEXT DEFAULT 'dagre',
  theme TEXT DEFAULT 'default',
  direction TEXT DEFAULT 'TB',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 创建 diagram_history 表 (不使用外键)
-- 包含 layout、theme 和 direction 字段用于存储历史记录时的布局、主题和方向配置
CREATE TABLE diagram_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  diagram_id UUID NOT NULL,
  mermaid_code TEXT NOT NULL,
  user_prompt TEXT,
  ai_response TEXT,
  layout TEXT DEFAULT 'dagre',
  theme TEXT DEFAULT 'default',
  direction TEXT DEFAULT 'TB',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. 创建索引
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_diagrams_project_id ON diagrams(project_id);
CREATE INDEX idx_diagram_history_diagram_id ON diagram_history(diagram_id);

-- 7. 禁用 RLS
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE diagrams DISABLE ROW LEVEL SECURITY;
ALTER TABLE diagram_history DISABLE ROW LEVEL SECURITY;

-- 8. 创建自动更新时间的函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 9. 创建触发器
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_diagrams_updated_at BEFORE UPDATE ON diagrams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 完成!
SELECT 'Database created successfully!' as status;


ALTER TABLE diagrams
ADD COLUMN IF NOT EXISTS layout TEXT DEFAULT 'dagre',
ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'default';

-- 为 diagram_history 表添加列（历史记录保存当时的配置）
ALTER TABLE diagram_history
ADD COLUMN IF NOT EXISTS layout TEXT DEFAULT 'dagre',
ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'default';

-- 更新现有记录，设置默认值
UPDATE diagrams
SET layout = 'dagre', theme = 'default'
WHERE layout IS NULL OR theme IS NULL;

UPDATE diagram_history
SET layout = 'dagre', theme = 'default'
WHERE layout IS NULL OR theme IS NULL;