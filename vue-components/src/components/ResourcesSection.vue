<template>
  <section class="pb-16">
    <div class="flex items-center gap-4 mb-8">
      <div class="p-2.5 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
        <span class="material-icons-round text-slate-600 dark:text-slate-300 text-2xl block">dns</span>
      </div>
      <h2 class="text-2xl font-bold text-slate-900 dark:text-white">资源与基础设施</h2>
    </div>

    <div class="grid grid-cols-12 gap-10">
      <!-- Left Column: Resource Cards -->
      <div class="col-span-4 space-y-8">
        <ResourceCard
          v-for="card in resourceCards"
          :key="card.title"
          :icon="card.icon"
          :title="card.title"
          :main-value="card.mainValue"
          :unit="card.unit"
          :subtitle="card.subtitle"
          :badge="card.badge"
          :show-chart="card.showChart"
          :chart-path="card.chartPath"
          @click="handleCardClick(card.icon)"
        />
      </div>

      <!-- Right Column: CI Insights -->
      <div class="col-span-8">
        <CIInsights
          :days="ciDays"
          :total-runs="ciTotalRuns"
          :failure-rate="ciFailureRate"
          :peak-value="ciPeakValue"
          :metrics="ciMetrics"
          @click="handleCIInsightsClick"
        />
      </div>
    </div>
  </section>
</template>

<script>
import ResourceCard from './ResourceCard.vue'
import CIInsights from './CIInsights.vue'

export default {
  name: 'ResourcesSection',
  components: {
    ResourceCard,
    CIInsights
  },
  props: {
    resourceCards: {
      type: Array,
      default: () => [
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
          unit: '',
          subtitle: '12 个活跃项目',
          badge: null,
          showChart: true,
          chartPath: 'M0 35 Q 30 35 100 25'
        }
      ]
    },
    ciDays: {
      type: Number,
      default: 14
    },
    ciTotalRuns: {
      type: String,
      default: '24,580'
    },
    ciFailureRate: {
      type: String,
      default: '3.2'
    },
    ciPeakValue: {
      type: String,
      default: '230 jobs/h'
    },
    ciMetrics: {
      type: Array,
      default: () => [
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
  },
  methods: {
    handleCardClick(icon) {
      if (icon === 'storage') {
        this.$emit('navigate-to-resource-center', 'warning')
      } else if (icon === 'code') {
        this.$emit('navigate-to-resource-center', 'projects')
      }
    },
    handleCIInsightsClick() {
      this.$emit('navigate-to-usage-report')
    }
  }
}
</script>
