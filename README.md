# AtomGit 企业版工作台 - Vue 组件化版本

这是将原始 HTML 文件 `00-overview.html` 按照 Vue 脚手架标准拆分后的项目。

## 项目结构

```
vue-components/
├── src/
│   ├── components/          # Vue 组件
│   │   ├── AppHeader.vue           # 顶部导航栏
│   │   ├── MainNavigation.vue      # 主导航菜单
│   │   ├── AlertBanner.vue         # 告警横幅
│   │   ├── SeatUsage.vue           # 席位使用情况
│   │   ├── MetricCard.vue          # 指标卡片(可复用)
│   │   ├── DevMetrics.vue          # 研发效能指标
│   │   ├── ResourceCard.vue        # 资源统计卡片
│   │   ├── CIInsights.vue          # CI构建洞察
│   │   └── ResourcesSection.vue    # 资源与基础设施
│   ├── styles/
│   │   └── main.css                # 全局样式
│   ├── App.vue                     # 主应用组件
│   └── main.js                     # 入口文件
├── index.html                      # HTML 入口
├── package.json                    # 项目依赖
├── vite.config.js                  # Vite 配置
├── tailwind.config.js              # Tailwind CSS 配置
└── postcss.config.js               # PostCSS 配置
```

## 组件说明

### 1. **AppHeader.vue** - 顶部导航栏
- 功能: 公司logo、搜索框、新建项目按钮、通知、帮助、用户头像
- Props: `companyName`, `userInitials`, `hasNotifications`, `searchPlaceholder`
- Events: `search`, `create-project`, `notifications`, `help`, `user-profile`

### 2. **MainNavigation.vue** - 主导航菜单
- 功能: 工作台、项目、代码、企业管理等导航项
- Props: `activeNav`
- Events: `nav-change`

### 3. **AlertBanner.vue** - 告警横幅
- 功能: 可关闭的告警/通知横幅,支持多种类型
- Props: `type`, `title`, `message`, `dismissible`
- Events: `dismiss`

### 4. **SeatUsage.vue** - 席位使用情况
- 功能: 展示席位占用率、剩余席位、详细统计
- Props: `usedSeats`, `totalSeats`, `stats`
- Events: `manage-seats`

### 5. **MetricCard.vue** - 指标卡片(可复用)
- 功能: 展示单个指标的卡片,包含趋势图
- Props: `title`, `value`, `stats`, `chartPath`, `color`

### 6. **DevMetrics.vue** - 研发效能指标
- 功能: 展示代码提交、Issue、MR、CR等指标
- Props: `days`, `dateRange`, `metrics`
- Events: `custom-date`

### 7. **ResourceCard.vue** - 资源统计卡片
- 功能: 展示存储、项目等资源信息
- Props: `icon`, `title`, `mainValue`, `unit`, `subtitle`, `badge`, `showChart`, `chartPath`

### 8. **CIInsights.vue** - CI构建洞察
- 功能: 展示CI构建统计和趋势
- Props: `days`, `totalRuns`, `failureRate`, `peakValue`, `metrics`

### 9. **ResourcesSection.vue** - 资源与基础设施
- 功能: 组合资源卡片和CI洞察
- Props: `resourceCards`, `ciDays`, `ciTotalRuns`, `ciFailureRate`, `ciPeakValue`, `ciMetrics`

## 安装和运行

### 1. 安装依赖
```bash
cd vue-components
npm install
```

### 2. 启动开发服务器
```bash
npm run dev
```

浏览器会自动打开 `http://localhost:3000`

### 3. 构建生产版本
```bash
npm run build
```

### 4. 预览生产版本
```bash
npm run preview
```

## 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **Vite** - 下一代前端构建工具
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Material Icons** - Google 图标库

## 特性

- ✅ 组件化架构,易于维护和复用
- ✅ 响应式设计,支持暗黑模式
- ✅ 使用 Tailwind CSS 进行样式管理
- ✅ 完整的 TypeScript 类型支持(可选)
- ✅ 热模块替换(HMR)开发体验
- ✅ 优化的生产构建

## 开发建议

1. **状态管理**: 如果应用变得更复杂,建议引入 Pinia 进行状态管理
2. **路由**: 如果需要多页面,可以引入 Vue Router
3. **API 集成**: 可以使用 Axios 或 Fetch API 进行数据获取
4. **类型安全**: 可以迁移到 TypeScript 以获得更好的类型安全

## 许可证

MIT
