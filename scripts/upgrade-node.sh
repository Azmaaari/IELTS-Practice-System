#!/bin/bash

# Node.js 快速升级脚本
# 用途：升级 Node.js 到符合 Vite 5 要求的版本

set -e

echo "🚀 Node.js 版本升级脚本"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 检查当前版本
CURRENT_VERSION=$(node -v)
echo "当前 Node.js 版本: $CURRENT_VERSION"
echo ""

# 检查是否安装了 nvm
if ! command -v nvm &> /dev/null; then
    echo "❌ 未检测到 nvm (Node Version Manager)"
    echo ""
    echo "请手动安装 nvm："
    echo "  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    echo ""
    echo "然后重新运行此脚本"
    exit 1
fi

echo "✅ 检测到 nvm"
echo ""

# 显示可用版本
echo "📋 已安装的 Node.js 版本："
nvm list
echo ""

# 提示用户选择版本
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "推荐安装版本："
echo "  1) Node.js 22 LTS (推荐) - 最新长期支持版本"
echo "  2) Node.js 20.19+ - 最低要求版本"
echo ""
read -p "请选择要安装的版本 (1/2，默认为1): " choice
choice=${choice:-1}

if [ "$choice" = "1" ]; then
    TARGET_VERSION="22"
    echo ""
    echo "📦 安装 Node.js 22 LTS..."
elif [ "$choice" = "2" ]; then
    TARGET_VERSION="20"
    echo ""
    echo "📦 安装 Node.js 20 最新版..."
else
    echo "❌ 无效选择"
    exit 1
fi

# 安装新版本
nvm install $TARGET_VERSION

# 使用新版本
nvm use $TARGET_VERSION

# 验证版本
NEW_VERSION=$(node -v)
echo ""
echo "✅ Node.js 已升级到: $NEW_VERSION"
echo "✅ npm 版本: $(npm -v)"
echo ""

# 询问是否设置为默认版本
read -p "是否设置为默认版本？(y/n，默认为y): " set_default
set_default=${set_default:-y}

if [ "$set_default" = "y" ] || [ "$set_default" = "Y" ]; then
    nvm alias default $TARGET_VERSION
    echo "✅ 已设置 Node.js $NEW_VERSION 为默认版本"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Node.js 升级完成！"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "下一步："
echo "  1. 清理之前的安装（如果有）："
echo "     rm -rf node_modules package-lock.json"
echo ""
echo "  2. 运行初始化脚本："
echo "     ./scripts/init-project.sh"
echo ""

# 询问是否立即清理并初始化
read -p "是否立即清理并运行初始化脚本？(y/n): " run_init
if [ "$run_init" = "y" ] || [ "$run_init" = "Y" ]; then
    echo ""
    echo "🧹 清理之前的安装..."
    rm -rf node_modules package-lock.json
    
    echo ""
    echo "🚀 运行初始化脚本..."
    ./scripts/init-project.sh
fi

echo ""
echo "✅ 全部完成！"

