# 组件使用示例

本文档提供了各个组件的详细使用示例。

## 1. AppHeader 组件

```vue
<template>
  <AppHeader
    company-name="Acme Corp"
    user-initials="JS"
    :has-notifications="true"
    search-placeholder="在 AtomGit 中搜索项目、代码或成员..."
    @search="handleSearch"
    @create-project="handleCreateProject"
    @notifications="handleNotifications"
    @help="handleHelp"
    @user-profile="handleUserProfile"
  />
</template>

<script>
import AppHeader from './components/AppHeader.vue'

export default {
  components: { AppHeader },
  methods: {
    handleSearch(query) {
      console.log('搜索:', query)
    },
    handleCreateProject() {
      console.log('创建新项目')
    },
    handleNotifications() {
      console.log('显示通知')
    },
    handleHelp() {
      console.log('显示帮助')
    },
    handleUserProfile() {
      console.log('显示用户资料')
    }
  }
}
</script>
```

## 2. MainNavigation 组件

```vue
<template>
  <MainNavigation
    active-nav="dashboard"
    @nav-change="handleNavChange"
  />
</template>

<script>
import MainNavigation from './components/MainNavigation.vue'

export default {
  components: { MainNavigation },
  methods: {
    handleNavChange(navId) {
      console.log('导航切换到:', navId)
      // 可以在这里进行路由跳转
    }
  }
}
</script>
```

## 3. AlertBanner 组件

```vue
<template>
  <div class="space-y-4">
    <!-- 警告类型 -->
    <AlertBanner
      type="warning"
      title="资源告警"
      message="您当前的存储使用量为 856GB (85%),接近套餐限额。"
      @dismiss="handleDismiss"
    />

    <!-- 信息类型 -->
    <AlertBanner
      type="info"
      title="系统维护公告"
      message="AtomGit 将于本周五 22:00 进行例行更新维护。"
      @dismiss="handleDismiss"
    />

    <!-- 成功类型 -->
    <AlertBanner
      type="success"
      title="操作成功"
      message="您的设置已成功保存。"
      @dismiss="handleDismiss"
    />

    <!-- 错误类型 -->
    <AlertBanner
      type="error"
      title="操作失败"
      message="无法连接到服务器,请稍后重试。"
      @dismiss="handleDismiss"
    />
  </div>
</template>

<script>
import AlertBanner from './components/AlertBanner.vue'

export default {
  components: { AlertBanner },
  methods: {
    handleDismiss() {
      console.log('告警已关闭')
    }
  }
}
</script>
```

## 4. SeatUsage 组件

```vue
<template>
  <SeatUsage
    :used-seats="428"
    :total-seats="500"
    :stats="seatStats"
    @manage-seats="handleManageSeats"
  />
</template>

<script>
import SeatUsage from './components/SeatUsage.vue'

export default {
  components: { SeatUsage },
  data() {
    return {
      seatStats: [
        {
          label: '企业成员',
          value: 380,
          description: '核心开发团队人员',
          color: '#3b82f6'
        },
        {
          label: '外部协作者',
          value: 48,
          description: '外包及合作伙伴账户',
          color: '#6366f1'
        },
        {
          label: '待处理邀请',
          value: 12,
          description: '等待加入确认的用户',
          color: '#f59e0b'
        }
      ]
    }
  },
  methods: {
    handleManageSeats() {
      console.log('管理席位')
      // 跳转到席位管理页面
    }
  }
}
</script>
```

## 5. MetricCard 组件

```vue
<template>
  <div class="grid grid-cols-4 gap-8">
    <!-- 蓝色主题 -->
    <MetricCard
      title="代码提交量"
      value="12,840"
      :stats="[
        { label: '提交人数', value: '312' },
        { label: '人均提交', value: '41.2' }
      ]"
      chart-path="M0 30 L10 28 L20 32 L30 15 L40 20 L50 10 L60 18 L70 12 L80 16 L90 25 L100 20"
      color="blue"
    />

    <!-- 靛蓝主题 -->
    <MetricCard
      title="新增 Issue"
      value="856"
      :stats="[
        { label: '已关闭', value: '642' },
        { label: '活跃负责', value: '128' }
      ]"
      chart-path="M0 20 L15 22 L30 18 L45 25 L60 10 L75 15 L90 8 L100 12"
      color="indigo"
    />

    <!-- 绿色主题 -->
    <MetricCard
      title="合并请求 (MR)"
      value="425"
      :stats="[
        { label: '已合并', value: '380', colorClass: 'text-emerald-600 dark:text-emerald-400' },
        { label: '创建者', value: '94' }
      ]"
      chart-path="M0 35 L20 30 L40 25 L60 10 L80 15 L100 5"
      color="emerald"
    />

    <!-- 橙色主题 -->
    <MetricCard
      title="PR 评审 (CR)"
      value="1,120"
      :stats="[
        { label: '评审人数', value: '245' },
        { label: '覆盖率', value: '92%', colorClass: 'text-orange-500' }
      ]"
      chart-path="M0 25 L20 20 L40 28 L60 15 L80 10 L100 18"
      color="orange"
    />
  </div>
</template>

<script>
import MetricCard from './components/MetricCard.vue'

export default {
  components: { MetricCard }
}
</script>
```

## 6. DevMetrics 组件

```vue
<template>
  <DevMetrics
    :days="14"
    date-range="2023-10-25 ~ 2023-11-08"
    :metrics="devMetrics"
    @custom-date="handleCustomDate"
  />
</template>

<script>
import DevMetrics from './components/DevMetrics.vue'

export default {
  components: { DevMetrics },
  data() {
    return {
      devMetrics: [
        {
          title: '代码提交量',
          value: '12,840',
          stats: [
            { label: '提交人数', value: '312' },
            { label: '人均提交', value: '41.2' }
          ],
          chartPath: 'M0 30 L10 28 L20 32 L30 15 L40 20 L50 10 L60 18 L70 12 L80 16 L90 25 L100 20',
          color: 'blue'
        },
        // ... 更多指标
      ]
    }
  },
  methods: {
    handleCustomDate() {
      console.log('打开日期选择器')
      // 显示日期选择器
    }
  }
}
</script>
```

## 7. ResourceCard 组件

```vue
<template>
  <div class="space-y-8">
    <!-- 带徽章的资源卡片 -->
    <ResourceCard
      icon="storage"
      title="存储使用量"
      main-value="1.2"
      unit="TB"
      subtitle="周环比增长"
      :badge="{ text: '+4.2%', type: 'success' }"
      :show-chart="true"
      chart-path="M0 35 Q 50 30 100 20"
    />

    <!-- 不带徽章的资源卡片 -->
    <ResourceCard
      icon="code"
      title="项目总数"
      main-value="3,420"
      subtitle="本周新增: 12 个活跃项目"
      :show-chart="true"
      chart-path="M0 35 Q 30 35 100 25"
    />
  </div>
</template>

<script>
import ResourceCard from './components/ResourceCard.vue'

export default {
  components: { ResourceCard }
}
</script>
```

## 8. CIInsights 组件

```vue
<template>
  <CIInsights
    :days="14"
    total-runs="24,580"
    failure-rate="3.2"
    peak-value="230 jobs/h"
    :metrics="ciMetrics"
  />
</template>

<script>
import CIInsights from './components/CIInsights.vue'

export default {
  components: { CIInsights },
  data() {
    return {
      ciMetrics: [
        {
          label: '平均耗时',
          icon: 'schedule',
          value: '4m 12s',
          progressWidth: '66.67%',
          progressColor: 'bg-primary'
        },
        {
          label: '平均排队',
          icon: 'hourglass_empty',
          value: '18s',
          progressWidth: '25%',
          progressColor: 'bg-emerald-400'
        },
        {
          label: '失败耗时',
          icon: 'warning',
          value: '142h',
          warning: '资源浪费风险提示'
        }
      ]
    }
  }
}
</script>
```

## 9. ResourcesSection 组件

```vue
<template>
  <ResourcesSection
    :resource-cards="resourceCards"
    :ci-days="14"
    ci-total-runs="24,580"
    ci-failure-rate="3.2"
    ci-peak-value="230 jobs/h"
    :ci-metrics="ciMetrics"
  />
</template>

<script>
import ResourcesSection from './components/ResourcesSection.vue'

export default {
  components: { ResourcesSection },
  data() {
    return {
      resourceCards: [
        {
          icon: 'storage',
          title: '存储使用量',
          mainValue: '1.2',
          unit: 'TB',
          subtitle: '周环比增长',
          badge: { text: '+4.2%', type: 'success' },
          showChart: true,
          chartPath: 'M0 35 Q 50 30 100 20'
        },
        {
          icon: 'code',
          title: '项目总数',
          mainValue: '3,420',
          subtitle: '本周新增: 12 个活跃项目',
          showChart: true,
          chartPath: 'M0 35 Q 30 35 100 25'
        }
      ],
      ciMetrics: [
        // CI 指标数据
      ]
    }
  }
}
</script>
```

## 自定义主题

你可以通过修改 `tailwind.config.js` 来自定义主题颜色:

```javascript
export default {
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",  // 修改主色调
        "background-light": "#f3f4f6",
        "background-dark": "#0f172a",
        // ... 其他颜色
      },
    },
  },
}
```

## 暗黑模式切换

在根元素上添加或移除 `dark` 类即可切换暗黑模式:

```javascript
// 切换到暗黑模式
document.documentElement.classList.add('dark')

// 切换到亮色模式
document.documentElement.classList.remove('dark')

// 切换模式
document.documentElement.classList.toggle('dark')
```
