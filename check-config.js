#!/usr/bin/env node

/**
 * Mermaid AI 配置检查工具
 * 检查所有必需的环境变量是否已配置
 */

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = join(__dirname, '.env');

console.log('🔍 检查 Mermaid AI 配置...\n');

// 检查 .env 文件是否存在
if (!existsSync(envPath)) {
  console.log('❌ .env 文件不存在');
  console.log('   请运行: cp .env.example .env');
  console.log('   然后填入你的配置\n');
  process.exit(1);
}

// 读取 .env 文件
const envContent = readFileSync(envPath, 'utf-8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  }
});

// 检查必需的配置
const requiredVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_GEMINI_API_KEY'
];

let allConfigured = true;

requiredVars.forEach(varName => {
  const value = envVars[varName];
  const isConfigured = value && value !== 'your_supabase_url' &&
                       value !== 'your_supabase_anon_key' &&
                       value !== 'your_gemini_api_key';

  if (isConfigured) {
    console.log(`✅ ${varName}`);
    // 显示部分值以供确认
    const displayValue = value.length > 20
      ? value.substring(0, 20) + '...'
      : value;
    console.log(`   ${displayValue}\n`);
  } else {
    console.log(`❌ ${varName} 未配置`);
    allConfigured = false;
  }
});

console.log('---\n');

if (allConfigured) {
  console.log('✅ 所有配置已完成!');
  console.log('   运行 npm run dev 启动应用\n');
  process.exit(0);
} else {
  console.log('⚠️  请完成所有配置后再启动应用');
  console.log('   参考 SETUP.md 获取详细设置说明\n');
  process.exit(1);
}
