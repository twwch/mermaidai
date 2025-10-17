-- 添加 direction 字段到 diagrams 和 diagram_history 表
-- 在 Supabase SQL Editor 中运行此脚本

-- 为 diagrams 表添加 direction 列
ALTER TABLE diagrams
ADD COLUMN IF NOT EXISTS direction TEXT DEFAULT 'TB';

-- 为 diagram_history 表添加 direction 列（历史记录保存当时的方向配置）
ALTER TABLE diagram_history
ADD COLUMN IF NOT EXISTS direction TEXT DEFAULT 'TB';

-- 更新现有记录，设置默认值为 'TB' (从上到下)
UPDATE diagrams
SET direction = 'TB'
WHERE direction IS NULL;

UPDATE diagram_history
SET direction = 'TB'
WHERE direction IS NULL;

-- 添加注释说明字段含义
COMMENT ON COLUMN diagrams.direction IS '流程图方向: TB(从上到下), BT(从下到上), LR(从左到右), RL(从右到左)';
COMMENT ON COLUMN diagram_history.direction IS '历史记录的流程图方向: TB(从上到下), BT(从下到上), LR(从左到右), RL(从右到左)';

SELECT 'Direction column added successfully to both tables!' as status;
