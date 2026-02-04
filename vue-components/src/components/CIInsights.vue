<template>
  <div class="bg-surface-light dark:bg-surface-dark rounded-xl p-10 shadow-sm border border-border-light dark:border-border-dark relative flex flex-col justify-between min-h-[420px]">
    <!-- Header -->
    <div class="flex flex-row items-start justify-between mb-12">
      <div class="flex items-center gap-4">
        <div class="bg-primary/10 p-3 rounded-xl">
          <span class="material-symbols-outlined text-primary text-3xl block">play_circle</span>
        </div>
        <div>
          <h3 class="text-2xl font-bold text-slate-900 dark:text-white">CI 构建洞察</h3>
          <p class="text-base text-slate-500 dark:text-slate-400">基于最近 {{ days }} 天全量数据分析报告</p>
        </div>
      </div>
      <div class="flex gap-16">
        <div class="text-right">
          <div class="text-sm font-bold text-slate-400 mb-2 uppercase tracking-widest">总运行次数</div>
          <div class="text-4xl font-bold text-slate-900 dark:text-white">{{ totalRuns }}</div>
        </div>
        <div class="text-right">
          <div class="text-sm font-bold text-slate-400 mb-2 uppercase tracking-widest">构建失败率</div>
          <div class="text-4xl font-bold text-red-500">{{ failureRate }}%</div>
        </div>
      </div>
    </div>

    <!-- Metrics and Chart -->
    <div class="grid grid-cols-2 gap-20 items-end">
      <!-- Metrics Grid -->
      <div class="grid grid-cols-3 gap-12 w-full">
        <div v-for="metric in metrics" :key="metric.label">
          <div class="flex items-center gap-1.5 text-sm font-bold text-slate-500 dark:text-slate-400 mb-3">
            <span class="material-icons-round text-base">{{ metric.icon }}</span>
            {{ metric.label }}
          </div>
          <div class="text-3xl font-bold text-slate-800 dark:text-slate-100">{{ metric.value }}</div>
          <div v-if="metric.progressWidth" class="w-full h-2 bg-slate-100 dark:bg-slate-700 mt-4 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full"
              :class="metric.progressColor || 'bg-primary'"
              :style="{ width: metric.progressWidth }"
            ></div>
          </div>
          <div v-if="metric.warning" class="text-xs font-bold text-red-500 mt-3 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-red-500 block"></span>
            {{ metric.warning }}
          </div>
        </div>
      </div>

      <!-- Trend Chart -->
      <div class="w-full pl-10">
        <div class="flex items-center justify-between mb-3">
          <div class="text-xs font-bold text-slate-400 uppercase tracking-widest">实时活动趋势 (24h)</div>
          <div class="text-xs text-primary font-bold">峰值: {{ peakValue }}</div>
        </div>
        <svg
          class="w-full h-24 text-primary opacity-60"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          viewBox="0 0 200 50"
        >
          <defs>
            <linearGradient id="trendGradientWide" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stop-color="currentColor" stop-opacity="0.25"></stop>
              <stop offset="100%" stop-color="currentColor" stop-opacity="0"></stop>
            </linearGradient>
          </defs>
          <path
            d="M0 45 L20 45 L40 40 L60 30 L80 35 L100 25 L120 28 L140 20 L160 30 L180 25 L200 35 V 50 H 0 Z"
            fill="url(#trendGradientWide)"
            stroke="none"
          ></path>
          <path
            d="M0 45 L20 45 L40 40 L60 30 L80 35 L100 25 L120 28 L140 20 L160 30 L180 25 L200 35"
            fill="none"
          ></path>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CIInsights',
  props: {
    days: {
      type: Number,
      default: 14
    },
    totalRuns: {
      type: String,
      default: '24,580'
    },
    failureRate: {
      type: String,
      default: '3.2'
    },
    peakValue: {
      type: String,
      default: '230 jobs/h'
    },
    metrics: {
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
  }
}
</script>
