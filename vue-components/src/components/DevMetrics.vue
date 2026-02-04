<template>
  <section>
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-4">
        <div class="p-2.5 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
          <span class="material-icons-round text-green-500 text-2xl block">trending_up</span>
        </div>
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white">研发效能指标(近 {{ days }} 天)</h2>
      </div>
      <div class="flex items-center gap-5 text-sm bg-white dark:bg-slate-800 px-5 py-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
        <span class="text-slate-500 dark:text-slate-400 font-medium">统计范围:</span>
        <span class="font-bold text-slate-700 dark:text-slate-200">{{ dateRange }}</span>
        <span class="w-px h-5 bg-slate-300 dark:bg-slate-600 mx-1"></span>
        <button
          class="text-primary hover:text-primary-dark font-semibold flex items-center gap-1.5"
          @click="handleCustomDate"
        >
          自定义 <span class="material-icons-round text-sm">calendar_today</span>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-4 gap-8">
      <MetricCard
        v-for="metric in metrics"
        :key="metric.title"
        :title="metric.title"
        :value="metric.value"
        :stats="metric.stats"
        :chart-path="metric.chartPath"
        :color="metric.color"
        @click="handleMetricClick"
      />
    </div>
  </section>
</template>

<script>
import MetricCard from './MetricCard.vue'

export default {
  name: 'DevMetrics',
  components: {
    MetricCard
  },
  props: {
    days: {
      type: Number,
      default: 14
    },
    dateRange: {
      type: String,
      default: '2023-10-25 ~ 2023-11-08'
    },
    metrics: {
      type: Array,
      default: () => [
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
        {
          title: '新增 Issue',
          value: '856',
          stats: [
            { label: '已关闭', value: '642' },
            { label: '活跃负责', value: '128' }
          ],
          chartPath: 'M0 20 L15 22 L30 18 L45 25 L60 10 L75 15 L90 8 L100 12',
          color: 'indigo'
        },
        {
          title: '合并请求 (MR)',
          value: '425',
          stats: [
            { label: '已合并', value: '380', colorClass: 'text-emerald-600 dark:text-emerald-400' },
            { label: '创建者', value: '94' }
          ],
          chartPath: 'M0 35 L20 30 L40 25 L60 10 L80 15 L100 5',
          color: 'emerald'
        },
        {
          title: 'PR 评审 (CR)',
          value: '1,120',
          stats: [
            { label: '评审人数', value: '245' },
            { label: '覆盖率', value: '92%', colorClass: 'text-orange-500' }
          ],
          chartPath: 'M0 25 L20 20 L40 28 L60 15 L80 10 L100 18',
          color: 'orange'
        }
      ]
    }
  },
  methods: {
    handleCustomDate() {
      this.$emit('custom-date')
    },
    handleMetricClick() {
      this.$emit('navigate-to-efficiency-detail')
    }
  }
}
</script>
