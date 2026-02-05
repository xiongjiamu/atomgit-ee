# 🚀 快速部署到 GitHub Pages

## 方法一：自动部署（推荐）

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **启用 GitHub Pages**
   - 进入仓库 Settings → Pages
   - Source 选择 "GitHub Actions"

3. **完成！** 
   - GitHub Actions 会自动构建和部署
   - 访问 `https://YOUR_USERNAME.github.io/YOUR_REPO/`

## 方法二：使用部署脚本

```bash
# 一键部署
./deploy.sh "你的提交信息"
```

## 配置说明

### 修改 base 路径

编辑 `vue-components/vite.config.js`：

```javascript
// 如果仓库名是 my-repo
base: process.env.NODE_ENV === 'production' ? '/my-repo/' : '/',

// 如果使用自定义域名
base: process.env.NODE_ENV === 'production' ? '/' : '/',
```

### 自定义域名

1. 在 `vue-components/public/` 创建 `CNAME` 文件
2. 写入你的域名：`your-domain.com`
3. 配置 DNS 记录指向 GitHub Pages

## 📚 详细文档

查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 获取完整部署指南。

## ✅ 检查清单

- [ ] 代码已推送到 GitHub
- [ ] GitHub Pages 已启用
- [ ] base 路径已正确配置
- [ ] 部署成功
- [ ] 网站可访问

---

**需要帮助？** 查看 [GitHub Pages 文档](https://docs.github.com/en/pages)
