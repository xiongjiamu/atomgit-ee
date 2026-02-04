# 项目结构说明

## 完整目录结构

```
vue-components/
│
├── public/                          # 静态资源目录(可选)
│
├── src/                             # 源代码目录
│   ├── components/                  # Vue 组件目录
│   │   ├── AppHeader.vue           # 顶部导航栏组件
│   │   ├── MainNavigation.vue      # 主导航菜单组件
│   │   ├── AlertBanner.vue         # 告警横幅组件
│   │   ├── SeatUsage.vue           # 席位使用情况组件
│   │   ├── MetricCard.vue          # 指标卡片组件(可复用)
│   │   ├── DevMetrics.vue          # 研发效能指标组件
│   │   ├── ResourceCard.vue        # 资源统计卡片组件
│   │   ├── CIInsights.vue          # CI构建洞察组件
│   │   └── ResourcesSection.vue    # 资源与基础设施组件
│   │
│   ├── styles/                      # 样式文件目录
│   │   └── main.css                # 全局样式文件
│   │
│   ├── assets/                      # 资源文件目录
│   │   └── (图片、字体等静态资源)
│   │
│   ├── App.vue                      # 根组件
│   └── main.js                      # 应用入口文件
│
├── index.html                       # HTML 入口文件
├── package.json                     # 项目依赖配置
├── vite.config.js                   # Vite 构建配置
├── tailwind.config.js               # Tailwind CSS 配置
├── postcss.config.js                # PostCSS 配置
├── .gitignore                       # Git 忽略文件
├── README.md                        # 项目说明文档
└── COMPONENT_EXAMPLES.md            # 组件使用示例文档
```

## 组件层级关系

```
App.vue (根组件)
│
├── AppHeader.vue (顶部导航栏)
│   ├── Logo
│   ├── SearchBar
│   ├── CreateProjectButton
│   └── UserActions
│
├── MainNavigation.vue (主导航菜单)
│   └── NavItems[]
│
├── AlertBanner.vue × 2 (告警横幅)
│   ├── Icon
│   ├── Title & Message
│   └── CloseButton
│
├── SeatUsage.vue (席位使用情况)
│   ├── Header
│   ├── UsageDisplay
│   │   ├── ProgressBar
│   │   └── Statistics
│   └── StatsCards[]
│
├── DevMetrics.vue (研发效能指标)
│   ├── Header
│   └── MetricCard[] × 4
│       ├── Title & Value
│       ├── TrendChart
│       └── SubStats[]
│
└── ResourcesSection.vue (资源与基础设施)
    ├── ResourceCard[] × 2
    │   ├── Icon & Title
    │   ├── MainValue
    │   ├── Badge (可选)
    │   └── MiniChart
    │
    └── CIInsights.vue
        ├── Header
        ├── Metrics[]
        └── TrendChart
```

## 数据流向

```
┌─────────────────────────────────────────────────────────┐
│                        App.vue                          │
│                     (状态管理中心)                        │
│                                                         │
│  - companyName                                          │
│  - userInitials                                         │
│  - alerts[]                                             │
│  - seatData{}                                           │
│  - devMetrics[]                                         │
│  - resourceCards[]                                      │
│  - ciData{}                                             │
└─────────────────────────────────────────────────────────┘
                          │
                          │ Props ↓
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ↓                 ↓                 ↓
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  AppHeader   │  │  SeatUsage   │  │ DevMetrics   │
└──────────────┘  └──────────────┘  └──────────────┘
        │                 │                 │
        │ Events ↑        │ Events ↑        │ Events ↑
        │                 │                 │
        └─────────────────┴─────────────────┘
                          │
                          ↓
                    处理事件并更新状态
```

## 组件通信方式

### 1. Props (父 → 子)
```javascript
// 父组件传递数据给子组件
<SeatUsage
  :used-seats="428"
  :total-seats="500"
  :stats="seatStats"
/>
```

### 2. Events (子 → 父)
```javascript
// 子组件触发事件
this.$emit('manage-seats')

// 父组件监听事件
<SeatUsage @manage-seats="handleManageSeats" />
```

### 3. 插槽 (Slots) - 可扩展
```javascript
// 如果需要更灵活的内容定制,可以使用插槽
<template>
  <MetricCard>
    <template #header>
      <CustomHeader />
    </template>
  </MetricCard>
</template>
```

## 样式组织

```
样式层级:
1. Tailwind 基础样式 (@tailwind base)
2. Tailwind 组件样式 (@tailwind components)
3. Tailwind 工具类 (@tailwind utilities)
4. 自定义全局样式 (main.css)
5. 组件内样式 (scoped styles)
```

## 构建流程

```
开发模式:
npm run dev
    ↓
Vite 启动开发服务器
    ↓
热模块替换 (HMR)
    ↓
浏览器自动刷新

生产模式:
npm run build
    ↓
Vite 构建优化
    ↓
Tailwind CSS 清除未使用的样式
    ↓
代码压缩和打包
    ↓
生成 dist/ 目录
```

## 扩展建议

### 1. 添加状态管理 (Pinia)
```bash
npm install pinia
```

```javascript
// stores/app.js
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    seatData: {},
    devMetrics: []
  }),
  actions: {
    updateSeatData(data) {
      this.seatData = data
    }
  }
})
```

### 2. 添加路由 (Vue Router)
```bash
npm install vue-router
```

```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: Dashboard },
  { path: '/projects', component: Projects }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
```

### 3. 添加 API 请求 (Axios)
```bash
npm install axios
```

```javascript
// api/index.js
import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://api.example.com'
})

export const getSeatData = () => api.get('/seats')
```

### 4. 添加 TypeScript
```bash
npm install -D typescript @vue/tsconfig
```

```typescript
// App.vue
<script setup lang="ts">
interface SeatData {
  used: number
  total: number
  stats: Array<{
    label: string
    value: number
    description: string
    color: string
  }>
}

const seatData: SeatData = {
  used: 428,
  total: 500,
  stats: []
}
</script>
```

## 性能优化建议

1. **懒加载组件**
```javascript
const DevMetrics = defineAsyncComponent(() =>
  import('./components/DevMetrics.vue')
)
```

2. **使用 v-memo 缓存渲染**
```vue
<div v-memo="[usedSeats, totalSeats]">
  <!-- 只有当 usedSeats 或 totalSeats 变化时才重新渲染 -->
</div>
```

3. **优化图表渲染**
- 考虑使用 Canvas 替代 SVG 处理大量数据
- 使用 requestAnimationFrame 优化动画

4. **代码分割**
```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue'],
          'components': ['./src/components/*']
        }
      }
    }
  }
}
```
