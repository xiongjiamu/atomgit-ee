# GitHub Pages 部署指南

本文档说明如何将 AtomGit 企业版工作台部署到 GitHub Pages。

## 📋 前置要求

1. GitHub 账号
2. 已创建的 GitHub 仓库
3. 本地已安装 Node.js (v18+) 和 npm

## 🚀 快速部署步骤

### 1. 配置 GitHub 仓库

#### 1.1 推送代码到 GitHub

```bash
# 如果还没有初始化 git 仓库
cd /Users/miykael/Documents/GitCode+HuaWei/产品规划/007-企业版/prd/stitch
git init
git add .
git commit -m "Initial commit: AtomGit Enterprise Dashboard"

# 添加远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

#### 1.2 启用 GitHub Pages

1. 进入你的 GitHub 仓库
2. 点击 **Settings** (设置)
3. 在左侧菜单中找到 **Pages**
4. 在 **Source** (来源) 下拉菜单中选择 **GitHub Actions**

### 2. 配置 base 路径

在 `vue-components/vite.config.js` 中，已经配置了 base 路径：

```javascript
base: process.env.NODE_ENV === 'production' ? '/prd/' : '/',
```

**重要：** 根据你的仓库名称修改 base 路径：

- 如果仓库名是 `prd`，保持 `'/prd/'`
- 如果仓库名是 `my-repo`，改为 `'/my-repo/'`
- 如果使用自定义域名或用户/组织主页，改为 `'/'`

### 3. 自动部署

一旦你推送代码到 `main` 分支，GitHub Actions 会自动：

1. ✅ 检出代码
2. ✅ 安装依赖
3. ✅ 构建项目
4. ✅ 部署到 GitHub Pages

你可以在仓库的 **Actions** 标签页查看部署进度。

### 4. 访问你的网站

部署完成后，你的网站将在以下地址可用：

```
https://YOUR_USERNAME.github.io/YOUR_REPO/
```

例如：
- 仓库：`https://github.com/miykael/prd`
- 网站：`https://miykael.github.io/prd/`

## 🔧 手动部署（可选）

如果你想手动构建和部署：

```bash
# 进入项目目录
cd vue-components

# 安装依赖
npm install

# 构建生产版本
npm run build

# dist 目录包含了构建后的文件
# 你可以手动上传这些文件到任何静态网站托管服务
```

## 📝 配置说明

### vite.config.js

```javascript
{
  // 生产环境的 base 路径
  base: process.env.NODE_ENV === 'production' ? '/prd/' : '/',
  
  // 构建配置
  build: {
    outDir: 'dist',           // 输出目录
    assetsDir: 'assets',      // 静态资源目录
    sourcemap: false,         // 不生成 sourcemap
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue']  // 将 Vue 单独打包
        }
      }
    }
  }
}
```

### GitHub Actions 工作流

位置：`.github/workflows/deploy.yml`

触发条件：
- 推送到 `main` 分支
- 手动触发（在 Actions 页面）

工作流程：
1. **构建任务**：安装依赖并构建项目
2. **部署任务**：将构建产物部署到 GitHub Pages

## 🎯 自定义域名（可选）

如果你想使用自定义域名：

### 1. 添加 CNAME 文件

在 `vue-components/public/` 目录下创建 `CNAME` 文件：

```
your-domain.com
```

### 2. 配置 DNS

在你的域名提供商处添加以下 DNS 记录：

**A 记录：**
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

**或 CNAME 记录：**
```
YOUR_USERNAME.github.io
```

### 3. 更新 vite.config.js

```javascript
base: process.env.NODE_ENV === 'production' ? '/' : '/',
```

### 4. 在 GitHub 设置中配置自定义域名

1. 进入仓库 Settings → Pages
2. 在 Custom domain 中输入你的域名
3. 勾选 Enforce HTTPS

## 🐛 常见问题

### 问题 1：页面显示 404

**原因：** base 路径配置不正确

**解决方案：**
1. 检查 `vite.config.js` 中的 `base` 配置
2. 确保 base 路径与仓库名称匹配
3. 重新构建并部署

### 问题 2：资源加载失败

**原因：** 静态资源路径错误

**解决方案：**
1. 确保所有资源使用相对路径
2. 检查 `public` 目录中的文件
3. 确认 `.nojekyll` 文件存在

### 问题 3：GitHub Actions 构建失败

**原因：** 依赖安装或构建错误

**解决方案：**
1. 检查 Actions 日志查看具体错误
2. 确保 `package.json` 和 `package-lock.json` 已提交
3. 本地运行 `npm run build` 测试构建

### 问题 4：部署后页面空白

**原因：** 路由配置或 base 路径问题

**解决方案：**
1. 打开浏览器控制台查看错误
2. 检查 base 路径配置
3. 确认所有资源正确加载

## 📊 部署状态徽章

在你的 README.md 中添加部署状态徽章：

```markdown
[![Deploy to GitHub Pages](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/deploy.yml/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/deploy.yml)
```

## 🔄 更新部署

每次推送到 `main` 分支时，网站会自动更新：

```bash
# 修改代码后
git add .
git commit -m "Update: description of changes"
git push origin main

# GitHub Actions 会自动构建和部署
```

## 📚 相关资源

- [GitHub Pages 文档](https://docs.github.com/en/pages)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)
- [GitHub Actions 文档](https://docs.github.com/en/actions)

## ✅ 部署检查清单

- [ ] 代码已推送到 GitHub
- [ ] GitHub Pages 已启用（Source 设置为 GitHub Actions）
- [ ] `vite.config.js` 中的 base 路径已正确配置
- [ ] `.nojekyll` 文件已创建
- [ ] GitHub Actions 工作流文件已创建
- [ ] 首次部署已成功完成
- [ ] 网站可以正常访问
- [ ] 所有功能正常工作

---

**部署完成后，你的 AtomGit 企业版工作台将在以下地址可用：**

```
https://YOUR_USERNAME.github.io/YOUR_REPO/
```

🎉 享受你的在线演示！
