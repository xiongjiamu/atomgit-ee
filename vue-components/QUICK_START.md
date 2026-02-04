# 快速开始指南

## 📦 安装依赖

进入项目目录并安装依赖:

```bash
cd vue-components
npm install
```

安装过程可能需要几分钟,请耐心等待。

## 🚀 启动开发服务器

```bash
npm run dev
```

执行后,你会看到类似以下输出:

```
VITE v5.0.0  ready in 500 ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
➜  press h to show help
```

浏览器会自动打开 `http://localhost:3000`,你就能看到完整的 AtomGit 企业版工作台界面了!

## 🛠️ 开发模式特性

- **热模块替换 (HMR)**: 修改代码后,页面会自动刷新,无需手动刷新浏览器
- **快速启动**: Vite 提供极快的冷启动速度
- **即时反馈**: 保存文件后立即看到效果

## 📝 修改组件

### 示例 1: 修改公司名称

编辑 `src/App.vue`:

```javascript
data() {
  return {
    companyName: 'Your Company Name', // 修改这里
    // ...
  }
}
```

保存后,页面会自动更新显示新的公司名称。

### 示例 2: 修改主题颜色

编辑 `tailwind.config.js`:

```javascript
colors: {
  primary: "#3b82f6", // 修改为你喜欢的颜色,例如 "#10b981" (绿色)
  // ...
}
```

### 示例 3: 添加新的告警

编辑 `src/App.vue`,在 `alerts` 数组中添加:

```javascript
alerts: [
  // 现有告警...
  {
    type: 'success',
    title: '新功能上线',
    message: '我们刚刚发布了新的代码审查功能,快去体验吧!'
  }
]
```

## 🏗️ 构建生产版本

```bash
npm run build
```

构建完成后,会在 `dist/` 目录生成优化后的文件:

```
dist/
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
└── index.html
```

## 👀 预览生产版本

```bash
npm run preview
```

这会启动一个本地服务器来预览生产构建。

## 🎨 暗黑模式切换

在浏览器控制台执行:

```javascript
// 切换到暗黑模式
document.documentElement.classList.add('dark')

// 切换回亮色模式
document.documentElement.classList.remove('dark')

// 自动切换
document.documentElement.classList.toggle('dark')
```

你也可以在组件中添加一个切换按钮:

```vue
<template>
  <button @click="toggleDarkMode">
    切换主题
  </button>
</template>

<script>
export default {
  methods: {
    toggleDarkMode() {
      document.documentElement.classList.toggle('dark')
    }
  }
}
</script>
```

## 📂 项目文件说明

| 文件/目录 | 说明 |
|---------|------|
| `src/components/` | 所有 Vue 组件 |
| `src/styles/` | 全局样式文件 |
| `src/App.vue` | 根组件,整合所有子组件 |
| `src/main.js` | 应用入口文件 |
| `index.html` | HTML 模板 |
| `package.json` | 项目依赖配置 |
| `vite.config.js` | Vite 构建配置 |
| `tailwind.config.js` | Tailwind CSS 配置 |

## 🔧 常见问题

### Q: 端口 3000 已被占用怎么办?

修改 `vite.config.js`:

```javascript
export default defineConfig({
  server: {
    port: 3001, // 改为其他端口
    open: true
  }
})
```

### Q: 如何禁用自动打开浏览器?

修改 `vite.config.js`:

```javascript
export default defineConfig({
  server: {
    port: 3000,
    open: false // 设置为 false
  }
})
```

### Q: 如何添加新组件?

1. 在 `src/components/` 目录创建新的 `.vue` 文件
2. 在需要使用的地方导入:

```vue
<script>
import MyNewComponent from './components/MyNewComponent.vue'

export default {
  components: {
    MyNewComponent
  }
}
</script>

<template>
  <MyNewComponent />
</template>
```

### Q: 如何连接后端 API?

安装 axios:

```bash
npm install axios
```

创建 API 服务:

```javascript
// src/api/index.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://your-api.com'
})

export const getSeatData = () => api.get('/seats')
export const getMetrics = () => api.get('/metrics')
```

在组件中使用:

```vue
<script>
import { getSeatData } from './api'

export default {
  async mounted() {
    const { data } = await getSeatData()
    this.seatData = data
  }
}
</script>
```

## 📚 更多资源

- [Vue 3 官方文档](https://cn.vuejs.org/)
- [Vite 官方文档](https://cn.vitejs.dev/)
- [Tailwind CSS 官方文档](https://tailwindcss.com/)
- [组件使用示例](./COMPONENT_EXAMPLES.md)
- [项目结构说明](./PROJECT_STRUCTURE.md)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request!

## 📄 许可证

MIT License
