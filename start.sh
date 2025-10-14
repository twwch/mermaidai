#!/bin/bash

# Mermaid AI 启动脚本

echo "🚀 启动 Mermaid AI..."

# 检查是否安装了 nvm
if [ -s "$HOME/.nvm/nvm.sh" ]; then
    echo "📦 加载 nvm..."
    source "$HOME/.nvm/nvm.sh"
    nvm use
else
    echo "⚠️  未检测到 nvm,使用当前 Node 版本"
fi

# 显示 Node 版本
echo "📌 Node 版本: $(node --version)"
echo "📌 NPM 版本: $(npm --version)"

# 检查 .env 文件
if [ ! -f .env ]; then
    echo "⚠️  警告: .env 文件不存在"
    echo "请复制 .env.example 为 .env 并填入你的配置"
    echo "运行: cp .env.example .env"
    exit 1
fi

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
fi

# 启动开发服务器
echo "🌟 启动开发服务器..."
npm run dev
