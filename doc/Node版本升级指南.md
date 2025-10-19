# Node.js 版本升级指南

> **问题**: 当前 Node.js 版本不符合 Vite 5 要求  
> **要求**: Node.js 20.19+ 或 22.12+  
> **当前**: Node.js 20.11.1 或 16.20.2

---

## 🔧 解决方案（推荐）

### 方案一：使用 nvm 升级到最新 LTS 版本

你已经安装了 nvm，这是最简单的方案。

#### 步骤1: 安装 Node.js 22 LTS

在**新的终端窗口**中执行以下命令：

```bash
# 安装最新的 Node.js 22 LTS 版本
nvm install 22

# 或者安装指定版本
nvm install 22.18.0
```

#### 步骤2: 切换到新版本

```bash
# 使用新安装的版本
nvm use 22

# 验证版本
node --version
# 应该显示 v22.x.x
```

#### 步骤3: 设置为默认版本（可选）

```bash
# 设置为默认版本，以后打开终端自动使用
nvm alias default 22
```

#### 步骤4: 重新初始化项目

```bash
# 返回项目目录
cd /Users/armazi/Desktop/code/IELTS-Practice-System

# 清理之前的安装（如果有）
rm -rf node_modules package-lock.json

# 重新运行初始化脚本
./scripts/init-project.sh
```

---

### 方案二：使用 nvm 安装 Node.js 20.19+

如果你想保持在 Node.js 20.x 版本：

```bash
# 安装 Node.js 20 的最新版本
nvm install 20

# 使用新版本
nvm use 20

# 验证版本（应该 >= 20.19）
node --version
```

---

## 🎯 快速执行（一键升级）

在新的终端窗口中复制粘贴以下命令：

```bash
# 一键升级并初始化项目
cd /Users/armazi/Desktop/code/IELTS-Practice-System && \
nvm install 22 && \
nvm use 22 && \
nvm alias default 22 && \
node --version && \
npm --version && \
rm -rf node_modules package-lock.json && \
./scripts/init-project.sh
```

---

## ❓ 如果 nvm 命令不可用

### 检查 nvm 是否正确配置

```bash
# 检查 .zshrc 文件
cat ~/.zshrc | grep nvm
```

应该包含类似以下内容：

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
```

### 如果没有，添加配置

```bash
# 添加 nvm 配置到 .zshrc
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zshrc
echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.zshrc
echo '[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"' >> ~/.zshrc

# 重新加载配置
source ~/.zshrc

# 然后重试安装
nvm install 22
```

---

## 🔄 备选方案：修改 Vite 版本

如果暂时无法升级 Node.js，可以降级 Vite 版本：

### 修改 package.json

创建或修改 `package.json`，使用 Vite 4：

```json
{
  "name": "ielts-practice-system",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.4.0",
    "vue-router": "^4.2.0",
    "pinia": "^2.1.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.5.0",
    "vite": "^4.5.0",
    "typescript": "^5.3.0"
  }
}
```

**注意**: 不推荐这种方案，因为 Vite 4 缺少一些新特性。

---

## ✅ 验证安装

升级完成后，验证版本：

```bash
# 检查 Node.js 版本
node --version
# 应该显示 v22.x.x 或 v20.19+

# 检查 npm 版本
npm --version
# 应该显示 10.x.x

# 检查项目是否可以运行
cd /Users/armazi/Desktop/code/IELTS-Practice-System
npm run dev
```

---

## 📝 推荐版本

| 工具 | 推荐版本 | 最低版本 |
|------|---------|---------|
| Node.js | 22.18.0 (LTS) | 20.19.0 |
| npm | 10.9.2 | 10.0.0 |
| Vite | 5.0+ | 5.0.0 |

---

## 🚀 升级后的下一步

1. ✅ 确认 Node.js 版本正确
2. ✅ 运行初始化脚本成功
3. ✅ 启动开发服务器
4. ✅ 开始开发

---

## 💡 常见问题

### Q: 为什么需要升级 Node.js？

A: Vite 5 使用了 Node.js 的新特性（如 `crypto.hash`），只有较新版本才支持。

### Q: 升级会影响其他项目吗？

A: 不会。使用 nvm 可以为不同项目使用不同的 Node.js 版本。在项目根目录创建 `.nvmrc` 文件可以自动切换版本。

### Q: 可以使用 Node.js 18 吗？

A: 不行。Vite 5 明确要求 Node.js 20.19+ 或 22.12+。

---

## 🔍 故障排查

### 问题1: `nvm: command not found`

**解决**: 重新安装或配置 nvm

```bash
# 下载并安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 重新加载配置
source ~/.zshrc
```

### 问题2: 安装很慢

**解决**: 使用国内镜像

```bash
# 设置 nvm 镜像
export NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node

# 然后再安装
nvm install 22
```

### 问题3: 权限错误

**解决**: 检查 nvm 目录权限

```bash
# 修复 nvm 目录权限
sudo chown -R $(whoami) ~/.nvm
```

---

**升级完成后，回到项目目录运行初始化脚本即可！** 🎉

