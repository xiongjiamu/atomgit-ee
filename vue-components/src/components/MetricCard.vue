<template>
  <div class="bg-surface-light dark:bg-surface-dark rounded-xl p-8 shadow-sm border border-border-light dark:border-border-dark hover:shadow-xl hover:-translate-y-1 transition duration-300 group">
    <div class="flex justify-between items-start mb-8">
      <div class="flex flex-col">
        <div class="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
          {{ title }}
        </div>
        <div
          class="text-4xl font-bold text-slate-900 dark:text-white transition-colors"
          :class="hoverColorClass"
        >
          {{ value }}
        </div>
      </div>
      <div :class="['p-3 rounded-lg', chartBgClass]">
        <svg
          class="w-24 h-12"
          :class="chartColorClass"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          viewBox="0 0 100 40"
        >
          <path :d="chartPath"></path>
        </svg>
      </div>
    </div>
    <div class="flex justify-between text-sm pt-6 border-t border-border-light dark:border-border-dark">
      <div v-for="(stat, index) in stats" :key="index" :class="index > 0 ? 'text-right' : ''">
        <span class="text-slate-400 block mb-1.5 text-xs font-bold uppercase tracking-widest">
          {{ stat.label }}
        </span>
        <span
          class="font-bold text-xl"
          :class="stat.colorClass || 'text-slate-700 dark:text-slate-200'"
        >
          {{ stat.value }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MetricCard',
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    },
    stats: {
      type: Array,
      default: () => []
    },
    chartPath: {
      type: String,
      default: 'M0 30 L10 28 L20 32 L30 15 L40 20 L50 10 L60 18 L70 12 L80 16 L90 25 L100 20'
    },
    color: {
      type: String,
      default: 'blue',
      validator: (value) => ['blue', 'indigo', 'emerald', 'orange'].includes(value)
    }
  },
  computed: {
    hoverColorClass() {
      const colorMap = {
        blue: 'group-hover:text-primary',
        indigo: 'group-hover:text-indigo-500',
        emerald: 'group-hover:text-emerald-500',
        orange: 'group-hover:text-orange-500'
      }
      return colorMap[this.color]
    },
    chartBgClass() {
      const bgMap = {
        blue: 'bg-blue-50 dark:bg-blue-900/30',
        indigo: 'bg-indigo-50 dark:bg-indigo-900/30',
        emerald: 'bg-emerald-50 dark:bg-emerald-900/30',
        orange: 'bg-orange-50 dark:bg-orange-900/30'
      }
      return bgMap[this.color]
    },
    chartColorClass() {
      const colorMap = {
        blue: 'text-blue-500',
        indigo: 'text-indigo-500',
        emerald: 'text-emerald-500',
        orange: 'text-orange-400'
      }
      return colorMap[this.color]
    }
  }
}
</script>
