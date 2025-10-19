# IELTS Practice System

> **📊 当前状态** (2025-10-19): ✅ 基础功能完成 | ✅ 13篇文章可用 | ⏳ 持续开发中  
> **快速开始**: [README-当前状态.md](README-当前状态.md) | [测试指南.md](测试指南.md)

<div align="center">

**基于 Vue 3 + TypeScript + Tailwind CSS 的离线IELTS阅读练习平台**

[![Vue](https://img.shields.io/badge/Vue-3.5+-4FC08D?logo=vue.js)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1+-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4+-06B6D4?logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

## 📖 项目简介

离线IELTS阅读练习平台，支持：
- ✅ **117篇完整阅读文章**（P1: 43篇，P2: 32篇，P3: 42篇）
- ✅ **14种题型全覆盖**
- ✅ **搜索和筛选功能**
- ⚠️ 套题模拟考试（开发中）
- ⚠️ PWA离线支持（开发中）
- ⚠️ 练习历史和统计（开发中）

---

## 🚀 快速开始

### 1. 确认Node.js版本

```bash
node --version
# 必须是 v22.20.0 或更高版本

# 如果不是，使用nvm切换
nvm use 22
```

### 2. 安装依赖（如果还没有）

```bash
npm install
```

### 3. 处理数据（如果还没有）

```bash
# 生成manifest和search-index
node scripts/process-data.js
```

### 4. 启动开发服务器

```bash
npm run dev
```

### 5. 访问应用

打开浏览器: **http://localhost:5173**

---

## 📚 文档导航

### 核心文档
- [快速启动指南](doc/快速启动指南.md) ⭐ 开始这里
- [配置完成总结](doc/配置完成总结.md)
- [依赖检查清单](doc/依赖检查清单.md)

### 设计文档
- [技术设计方案](doc/技术设计方案.md)
- [UI组件设计规范](doc/UI组件设计规范.md) ⭐ 组件开发必读
- [JSON数据格式说明](doc/JSON数据格式说明.md)
- [JSON与HTML工作流对应指南](doc/JSON与HTML工作流对应指南.md)

---

## 🎯 当前功能

### ✅ 已实现

**首页**:
- 统计卡片（总练习次数、平均正确率、题库总数）
- 快速开始（搜索文章、开始套题）

**搜索页面**:
- 关键词搜索（支持模糊搜索）
- 难度筛选（P1/P2/P3）
- 文章卡片展示
- 题型标签显示

**单篇练习**:
- 左右分栏布局
- 文章查看器（支持段落标签）
- 题目渲染器（动态加载题型组件）
- 答案收集
- 已答题统计

**题型支持**:
- ✅ TRUE/FALSE/NOT GIVEN 判断题
- ✅ 单选题
- ✅ 标题匹配（拖拽）

### ⚠️ 开发中

- 其他11种题型组件
- 评分系统
- 练习历史
- 统计分析
- 套题功能
- PWA离线支持

---

## 🏗️ 技术栈

### 核心
- Vue 3.5.13
- TypeScript 5.7.3
- Vite 7.1.10

### UI
- Tailwind CSS 3.4.18
- Iconify Vue 5.0.0

### 功能
- Pinia 3.0.3 (状态管理)
- Vue Router 4.6.3 (路由)
- Fuse.js 7.1.0 (搜索)
- Dexie.js 4.2.1 (IndexedDB)

---

## 📁 项目结构

```
src/
├── components/
│   └── practice/
│       ├── PassageViewer.vue      # 文章查看器
│       ├── QuestionRenderer.vue   # 题目渲染器
│       └── questions/             # 题型组件
│           ├── TrueFalseQuestion.vue
│           ├── SingleChoiceQuestion.vue
│           ├── HeadingMatchingQuestion.vue
│           └── OptionPool.vue
├── composables/
│   ├── useExamLoader.ts          # 文章加载
│   └── useSearch.ts              # 搜索功能
├── stores/
│   ├── examStore.ts              # 题库状态
│   ├── practiceStore.ts          # 练习会话
│   ├── historyStore.ts           # 练习历史
│   └── userStore.ts              # 用户设置
├── views/
│   ├── HomeView.vue              # 首页
│   ├── SearchView.vue            # 搜索页面
│   └── practice/
│       └── SinglePracticeView.vue # 单篇练习
└── types/
    ├── exam.ts                    # 考试类型
    ├── practice.ts                # 练习类型
    └── history.ts                 # 历史类型
```

---

## 🛠️ 开发命令

```bash
# 开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview

# 代码检查
npm run lint

# 格式化代码
npm run format

# 类型检查
npm run type-check

# 处理数据
node scripts/process-data.js
```

---

## 🔍 调试技巧

### 查看数据

```javascript
// 浏览器控制台

// 查看manifest
fetch('/data/manifest.json').then(r => r.json()).then(console.log)

// 查看某篇文章
fetch('/data/chunks/e002.json').then(r => r.json()).then(console.log)
```

### 查看状态

打开 Vue DevTools，查看：
- examStore - 题库状态
- practiceStore - 当前练习
- userAnswers - 用户答案

---

## 📊 数据统计

- **总文章数**: 117篇
- **P1（简单）**: 43篇
- **P2（中等）**: 32篇
- **P3（困难）**: 42篇
- **题型覆盖**: 14种（部分实现）

---

## 🐛 问题排查

### 问题1: 服务器无法启动

**检查**:
```bash
# 确认Node版本
node --version  # 必须 >= 22.20.0

# 切换版本
nvm use 22

# 重新安装依赖
rm -rf node_modules package-lock.json
npm install
```

### 问题2: 找不到文章

**检查**:
```bash
# 确认数据文件存在
ls -la public/data/
ls -la public/data/chunks/ | head -10

# 重新处理数据
node scripts/process-data.js
```

### 问题3: 某些文章没有内容

**原因**: 13篇文章缺少段落数据

**查看**:
```bash
# 脚本输出中会显示缺少段落的文章ID
node scripts/process-data.js | grep "缺少段落"
```

---

## 📞 获取帮助

- 查看 [快速启动指南](doc/快速启动指南.md)
- 查看 [UI组件设计规范](doc/UI组件设计规范.md)
- 查看浏览器控制台错误信息

---

## 📄 License

MIT

---

<div align="center">

**开始使用前，请阅读 [快速启动指南](doc/快速启动指南.md)**

[快速启动](doc/快速启动指南.md) | [技术设计](doc/技术设计方案.md) | [UI规范](doc/UI组件设计规范.md)

</div>
