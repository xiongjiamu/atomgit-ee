# 全局 Alert 管理系统使用指南

## 概述

全局 Alert 管理系统提供了一个集中式的方式来管理整个应用中的 alert 消息。所有 alert 的内容都在一个地方维护，大大降低了维护成本。

## 文件结构

```
vue-components/src/
├── composables/
│   └── useGlobalAlerts.js          # 全局 alert 状态管理
├── components/
│   ├── AlertBanner.vue             # Alert 展示组件（基础组件）
│   └── GlobalAlerts.vue            # 全局 Alert 容器组件
```

## 核心概念

### 1. 全局 Alert 配置 (`useGlobalAlerts.js`)

所有 alert 的内容都在这个文件中集中管理：

```javascript
const globalAlerts = ref([
  {
    id: 'resource-warning',           // 唯一标识符
    type: 'warning',                  // 类型: warning, info, error, default
    title: '资源预警',                 // 标题
    icon: 'warning',                  // Material Icons 图标名
    message: '您企业当前的存储...',    // 消息内容
    show: true,                       // 是否显示
    dismissible: true,                // 是否可关闭
    pages: []                         // 指定显示页面（空数组表示所有页面）
  }
])
```

### 2. GlobalAlerts 组件

这是一个容器组件，自动从全局状态读取并显示 alerts：

```vue
<GlobalAlerts page-name="audit-logs" />
```

### 3. 持久化存储

用户关闭的 alerts 会自动保存到 `localStorage`，刷新页面后不会再次显示。

## 使用方法

### 在页面中使用

1. **导入 GlobalAlerts 组件**

```vue
<script>
import GlobalAlerts from './GlobalAlerts.vue'

export default {
  components: {
    GlobalAlerts
  }
}
</script>
```

2. **在模板中使用**

```vue
<template>
  <div>
    <!-- 显示全局 alerts -->
    <GlobalAlerts page-name="your-page-name" />
    
    <!-- 页面其他内容 -->
  </div>
</template>
```

### 添加新的 Alert

在 `useGlobalAlerts.js` 中添加新的 alert 配置：

```javascript
{
  id: 'maintenance-notice',
  type: 'info',
  title: '维护通知',
  icon: 'build',
  message: '系统将于本周六进行维护',
  show: true,
  dismissible: true,
  pages: ['audit-logs', 'wiki-settings']  // 只在这些页面显示
}
```

### 动态添加 Alert

如果需要在运行时动态添加 alert：

```vue
<script>
import { useGlobalAlerts } from '../composables/useGlobalAlerts'

export default {
  setup() {
    const { addAlert } = useGlobalAlerts()
    
    const showCustomAlert = () => {
      addAlert({
        id: 'custom-alert',
        type: 'warning',
        title: '自定义提醒',
        message: '这是一个动态添加的 alert',
        pages: ['current-page']
      })
    }
    
    return { showCustomAlert }
  }
}
</script>
```

## Alert 类型

- **warning**: 警告信息（黄色）
- **info**: 一般信息（蓝色）
- **error**: 错误信息（红色）
- **default**: 默认样式（灰色）

## 页面过滤

### 全局显示

如果 `pages` 为空数组，alert 会在所有页面显示：

```javascript
{
  id: 'global-announcement',
  // ...
  pages: []  // 所有页面都显示
}
```

### 特定页面显示

指定 `pages` 数组，alert 只在这些页面显示：

```javascript
{
  id: 'security-warning',
  // ...
  pages: ['security-overview', 'audit-logs']  // 只在这两个页面显示
}
```

## API 参考

### useGlobalAlerts(pageName)

**参数:**
- `pageName` (String, 可选): 当前页面名称

**返回值:**
- `visibleAlerts` (ComputedRef): 当前页面应该显示的 alerts
- `dismissAlert(alertId)` (Function): 关闭指定 alert
- `resetDismissedAlerts()` (Function): 重置所有已关闭的 alerts
- `addAlert(alert)` (Function): 动态添加新 alert
- `removeAlert(alertId)` (Function): 移除指定 alert
- `globalAlerts` (Ref): 全局 alerts 数组

## 优势

1. **集中管理**: 所有 alert 内容在一个文件中维护
2. **低维护成本**: 修改一次，全局生效
3. **持久化**: 用户关闭的 alerts 不会重复显示
4. **灵活控制**: 可以指定 alert 在哪些页面显示
5. **动态管理**: 支持运行时添加/删除 alerts
6. **代码简洁**: 每个组件只需一行代码即可显示 alerts

## 已迁移的组件

以下组件已经迁移到使用全局 Alert 系统：

- ✅ AuditLogs.vue
- ✅ AnnouncementManagement.vue
- ✅ IssueConfig.vue
- ✅ ClaConfig.vue
- ✅ WikiSettings.vue
- ✅ IpAllowlistManagement.vue
- ✅ SecurityOverview.vue

## 示例

### 修改现有 Alert 内容

只需在 `useGlobalAlerts.js` 中修改：

```javascript
// 修改前
message: '您企业当前的存储空间已使用 856GB (85%)...'

// 修改后
message: '您企业当前的存储空间已使用 920GB (92%)...'
```

所有使用该 alert 的页面会自动更新！

### 临时禁用某个 Alert

```javascript
{
  id: 'resource-warning',
  // ...
  show: false  // 设置为 false 即可
}
```

### 清除用户已关闭的 Alerts

```vue
<script>
import { useGlobalAlerts } from '../composables/useGlobalAlerts'

export default {
  setup() {
    const { resetDismissedAlerts } = useGlobalAlerts()
    
    // 在某个操作后重置
    const handleReset = () => {
      resetDismissedAlerts()
      // 所有被用户关闭的 alerts 会重新显示
    }
    
    return { handleReset }
  }
}
</script>
```

## 注意事项

1. 每个 alert 必须有唯一的 `id`
2. `page-name` 应该使用 kebab-case 命名
3. 关闭的 alerts 存储在 localStorage 中，清除浏览器数据会重置
4. 建议定期审查和清理不再需要的 alerts
