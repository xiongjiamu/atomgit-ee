#!/bin/bash

# AtomGit 企业版工作台 - GitHub Pages 部署脚本
# 使用方法: ./deploy.sh "commit message"

set -e

echo "🚀 开始部署到 GitHub Pages..."

# 检查是否提供了提交信息
COMMIT_MSG=${1:-"Update: deploy to GitHub Pages"}

echo "📝 提交信息: $COMMIT_MSG"

# 进入 vue-components 目录
cd vue-components

# 安装依赖（如果需要）
if [ ! -d "node_modules" ]; then
  echo "📦 安装依赖..."
  npm install
fi

# 构建项目
echo "🔨 构建项目..."
npm run build

# 返回根目录
cd ..

# Git 操作
echo "📤 推送到 GitHub..."
git add .
git commit -m "$COMMIT_MSG"
git push origin main

echo "✅ 部署完成！"
echo "🌐 你的网站将在几分钟后更新"
echo "📍 访问: https://YOUR_USERNAME.github.io/YOUR_REPO/"
echo ""
echo "💡 提示: 在 GitHub 仓库的 Actions 标签页查看部署进度"
