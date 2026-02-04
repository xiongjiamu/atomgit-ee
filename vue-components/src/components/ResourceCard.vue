<template>
  <div
    class="bg-surface-light dark:bg-surface-dark rounded-xl p-8 shadow-sm border border-border-light dark:border-border-dark flex justify-between items-end h-48 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
    @click="handleClick"
  >
    <div class="flex flex-col justify-between h-full">
      <div class="flex items-center gap-2.5 text-lg font-bold text-slate-600 dark:text-slate-300">
        <span class="material-icons-round text-xl">{{ icon }}</span>
        {{ title }}
      </div>
      <div>
        <div class="flex items-baseline gap-2">
          <span class="text-5xl font-bold text-slate-900 dark:text-white tracking-tight">{{ mainValue }}</span>
          <span v-if="unit" class="text-xl font-bold text-slate-500">{{ unit }}</span>
        </div>
        <div v-if="subtitle" class="flex items-center gap-2 mt-3 text-sm">
          <span
            v-if="badge"
            :class="[
              'px-2 py-1 rounded text-xs font-bold',
              badgeClasses[badge.type] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
            ]"
          >
            {{ badge.text }}
          </span>
          <span class="text-slate-400 font-medium">{{ subtitle }}</span>
        </div>
      </div>
    </div>
    <div v-if="showChart" class="w-40 mb-2">
      <svg
        class="w-full h-16 text-slate-300 dark:text-slate-600"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 100 40"
      >
        <path :d="chartPath"></path>
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResourceCard',
  props: {
    icon: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    mainValue: {
      type: [String, Number],
      required: true
    },
    unit: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    badge: {
      type: Object,
      default: null
    },
    showChart: {
      type: Boolean,
      default: true
    },
    chartPath: {
      type: String,
      default: 'M0 35 Q 50 30 100 20'
    }
  },
  emits: ['click'],
  methods: {
    handleClick() {
      this.$emit('click')
    }
  },
  data() {
    return {
      badgeClasses: {
        success: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400',
        warning: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-400',
        info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400',
        error: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400'
      }
    }
  }
}
</script>
