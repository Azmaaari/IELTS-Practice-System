#!/bin/bash

# IELTS Practice System 项目初始化脚本
# 用途：自动化项目初始化和配置

set -e  # 遇到错误立即退出

echo "🚀 开始初始化 IELTS Practice System..."
echo ""

# 检查Node.js版本
echo "📋 检查环境..."
if ! command -v node &> /dev/null; then
    echo "❌ 错误：未安装 Node.js"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2)
MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1)
MINOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f2)

echo "检测到 Node.js 版本: v$NODE_VERSION"

# 检查是否满足 Vite 5 的要求：Node.js 20.19+ 或 22.12+
if [ "$MAJOR_VERSION" -eq 20 ]; then
    if [ "$MINOR_VERSION" -lt 19 ]; then
        echo "❌ 错误：Node.js 20.x 版本需要 >= 20.19.0"
        echo "   当前版本: v$NODE_VERSION"
        echo "   Vite 5 要求: Node.js 20.19+ 或 22.12+"
        echo ""
        echo "📖 解决方案请查看: doc/Node版本升级指南.md"
        echo ""
        echo "快速升级命令："
        echo "   nvm install 22 && nvm use 22"
        exit 1
    fi
elif [ "$MAJOR_VERSION" -eq 22 ]; then
    if [ "$MINOR_VERSION" -lt 12 ]; then
        echo "❌ 错误：Node.js 22.x 版本需要 >= 22.12.0"
        echo "   当前版本: v$NODE_VERSION"
        echo "   Vite 5 要求: Node.js 20.19+ 或 22.12+"
        echo ""
        echo "📖 解决方案请查看: doc/Node版本升级指南.md"
        echo ""
        echo "快速升级命令："
        echo "   nvm install 22 && nvm use 22"
        exit 1
    fi
elif [ "$MAJOR_VERSION" -lt 20 ]; then
    echo "❌ 错误：Node.js 版本过低"
    echo "   当前版本: v$NODE_VERSION"
    echo "   Vite 5 要求: Node.js 20.19+ 或 22.12+"
    echo ""
    echo "📖 解决方案请查看: doc/Node版本升级指南.md"
    echo ""
    echo "快速升级命令："
    echo "   nvm install 22 && nvm use 22"
    exit 1
elif [ "$MAJOR_VERSION" -eq 21 ] || [ "$MAJOR_VERSION" -gt 22 ]; then
    echo "⚠️  警告：Node.js v$NODE_VERSION 未经测试"
    echo "   建议使用 Node.js 22 LTS 版本"
    echo ""
fi

echo "✅ Node.js 版本: $(node -v)"
echo "✅ npm 版本: $(npm -v)"
echo ""

# 创建项目（如果不存在）
if [ ! -f "package.json" ]; then
    echo "📦 创建 Vue + TypeScript 项目..."
    npm create vite@latest . -- --template vue-ts
    echo ""
fi

# 安装依赖
echo "📦 安装核心依赖..."
npm install vue-router@4 pinia

echo "📦 安装功能依赖..."
npm install fuse.js dexie

echo "📦 安装 Tailwind CSS..."
npm install -D tailwindcss@3 postcss autoprefixer
npm install @iconify/vue

echo "📦 安装 PWA 插件..."
npm install -D vite-plugin-pwa workbox-window

echo "📦 安装开发依赖..."
npm install -D @types/node
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D prettier eslint-config-prettier eslint-plugin-vue
npm install -D @tailwindcss/forms @tailwindcss/typography

echo ""
echo "✅ 所有依赖安装完成"
echo ""

# 初始化 Tailwind
echo "🎨 初始化 Tailwind CSS..."
npx tailwindcss init -p

echo ""
echo "✅ Tailwind 配置文件已创建"
echo ""

# 创建目录结构
echo "📁 创建目录结构..."

# 创建主要目录
mkdir -p src/components/common
mkdir -p src/components/layout
mkdir -p src/components/exam
mkdir -p src/components/practice/questions
mkdir -p src/composables
mkdir -p src/db
mkdir -p src/stores
mkdir -p src/styles
mkdir -p src/types
mkdir -p src/utils
mkdir -p src/views/practice
mkdir -p public/data/chunks
mkdir -p public/icons

echo "✅ 目录结构创建完成"
echo ""

# 创建数据文件占位符
echo "📄 创建占位符文件..."

cat > public/data/manifest.json << 'EOF'
{
  "version": "1.0.0",
  "totalExams": 0,
  "lastUpdated": "2025-10-19",
  "index": []
}
EOF

cat > public/data/search-index.json << 'EOF'
{
  "version": "1.0",
  "items": []
}
EOF

echo "✅ 占位符文件创建完成"
echo ""

# 创建.env文件
if [ ! -f ".env" ]; then
    echo "⚙️  创建环境变量文件..."
    cat > .env << 'EOF'
VITE_APP_TITLE=IELTS阅读练习平台
VITE_APP_VERSION=1.0.0
VITE_DATA_PATH=/data
EOF
    echo "✅ .env 文件创建完成"
    echo ""
fi

# 创建.gitignore补充
echo "📝 更新 .gitignore..."
cat >> .gitignore << 'EOF'

# IELTS Practice System specific
public/data/chunks/*.json
!public/data/chunks/.gitkeep
.env.local
*.log
EOF

touch public/data/chunks/.gitkeep
echo "✅ .gitignore 更新完成"
echo ""

# 创建 ESLint 配置
echo "🔧 创建 ESLint 配置..."
cat > .eslintrc.js << 'EOF'
module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2021,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
}
EOF
echo "✅ ESLint 配置创建完成"
echo ""

# 创建 Prettier 配置
echo "🎨 创建 Prettier 配置..."
cat > .prettierrc << 'EOF'
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "arrowParens": "avoid"
}
EOF
echo "✅ Prettier 配置创建完成"
echo ""

# 更新 package.json scripts
echo "📝 更新 package.json scripts..."
npm pkg set scripts.dev="vite"
npm pkg set scripts.build="vite build"
npm pkg set scripts.preview="vite preview"
npm pkg set scripts.lint="eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix"
npm pkg set scripts.format="prettier --write src/"
npm pkg set scripts.type-check="vue-tsc --noEmit"

echo "✅ Scripts 更新完成"
echo ""

# 创建 README
if [ ! -f "README.md" ]; then
    echo "📖 创建 README..."
    cat > README.md << 'EOF'
# IELTS Practice System

## 项目简介

基于 Vue 3 + TypeScript + Tailwind CSS 的离线IELTS阅读练习平台

## 技术栈

- **框架**: Vue 3
- **构建工具**: Vite
- **语言**: TypeScript
- **状态管理**: Pinia
- **路由**: Vue Router
- **UI**: Tailwind CSS
- **PWA**: Vite Plugin PWA
- **数据库**: IndexedDB (Dexie.js)

## 开发指南

### 安装依赖

```bash
npm install
```

### 开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

### 代码检查

```bash
npm run lint
```

### 格式化代码

```bash
npm run format
```

## 项目结构

详见 `doc/技术设计方案.md`

## 文档

- [开发文档](doc/dev-document.md)
- [技术设计方案](doc/技术设计方案.md)
- [JSON数据格式说明](doc/JSON数据格式说明.md)

## License

MIT
EOF
    echo "✅ README 创建完成"
    echo ""
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 项目初始化完成！"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 下一步操作："
echo "   1. 查看技术设计方案: doc/技术设计方案.md"
echo "   2. 配置 vite.config.ts（已在设计文档中）"
echo "   3. 配置 tailwind.config.js（已在设计文档中）"
echo "   4. 创建核心类型定义文件"
echo "   5. 创建 Store 文件"
echo "   6. 创建路由配置"
echo ""
echo "🚀 启动开发服务器："
echo "   npm run dev"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

