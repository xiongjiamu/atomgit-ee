<template>
  <section>
    <div class="flex items-center gap-4 mb-8">
      <div class="p-2.5 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
        <span class="material-icons-round text-primary text-2xl block">groups</span>
      </div>
      <h2 class="text-2xl font-bold text-slate-900 dark:text-white">席位使用情况</h2>
      <span class="bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 text-xs px-4 py-1.5 rounded-full border border-blue-200 dark:border-blue-800 flex items-center gap-1 font-medium ml-2">
        <span class="material-icons-round text-sm">auto_awesome</span> 智能分析
      </span>
      <div class="flex-1 border-b border-dashed border-slate-300 dark:border-slate-700 mx-4 mt-2"></div>
      <button class="text-sm text-primary hover:underline font-medium" @click="handleManageSeats">
        管理席位
      </button>
    </div>

    <div class="bg-surface-light dark:bg-surface-dark rounded-xl p-10 shadow-sm border border-border-light dark:border-border-dark">
      <div class="grid grid-cols-12 gap-16 items-center">
        <!-- Main Usage Display -->
        <div class="col-span-3">
          <div class="flex items-center justify-between mb-4">
            <div class="text-slate-500 dark:text-slate-400 font-medium text-base">已占用席位</div>
            <div class="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded uppercase tracking-wider">
              {{ statusLabel }}
            </div>
          </div>
          <div class="flex items-baseline gap-3 mb-6">
            <button
              @click="handleNavigateToMembers"
              class="text-5xl font-bold text-slate-900 dark:text-white tracking-tight hover:text-primary transition-colors cursor-pointer"
            >
              {{ usedSeats }}
            </button>
            <span class="text-2xl text-slate-400 font-medium">/ {{ totalSeats }}</span>
          </div>
          <div class="h-4 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-5">
            <div
              class="h-full bg-primary rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"
              :style="{ width: usagePercentage + '%' }"
            ></div>
          </div>
          <p class="text-base font-medium text-slate-700 dark:text-slate-300">
            使用率 <span class="text-primary font-bold">{{ usagePercentage }}%</span>
            <span class="mx-3 text-slate-300 dark:text-slate-600">|</span>
            <span class="text-slate-500 dark:text-slate-400 font-normal">
              剩余 <button
                @click="handleNavigateToMembers"
                class="font-bold text-slate-900 dark:text-white hover:text-primary transition-colors cursor-pointer"
              >{{ remainingSeats }}</button> 个可用
            </span>
          </p>
        </div>

        <!-- Breakdown Stats -->
        <div class="col-span-9 grid grid-cols-3 gap-10 border-l border-border-light dark:border-border-dark pl-16">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="bg-slate-50 dark:bg-slate-800/50 p-7 rounded-xl border border-slate-100 dark:border-slate-700/50"
          >
            <div class="flex items-center gap-2 mb-3">
              <span class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: stat.color }"></span>
              <div class="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">
                {{ stat.label }}
              </div>
            </div>
            <button
              v-if="stat.label !== '待处理邀请'"
              @click="handleNavigateToMembers"
              class="text-4xl font-bold text-slate-900 dark:text-white mb-2 hover:text-primary transition-colors cursor-pointer block"
            >
              {{ stat.value }}
            </button>
            <div
              v-else
              class="text-4xl font-bold text-slate-900 dark:text-white mb-2"
            >
              {{ stat.value }}
            </div>
            <div class="text-sm text-slate-400">{{ stat.description }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'SeatUsage',
  props: {
    usedSeats: {
      type: Number,
      default: 428
    },
    totalSeats: {
      type: Number,
      default: 500
    },
    stats: {
      type: Array,
      default: () => [
        { label: '企业成员', value: 380, description: '核心开发团队人员', color: '#3b82f6' },
        { label: '外部协作者', value: 48, description: '外包及合作伙伴账户', color: '#6366f1' },
        { label: '待处理邀请', value: 12, description: '等待加入确认的用户', color: '#f59e0b' }
      ]
    }
  },
  computed: {
    usagePercentage() {
      return ((this.usedSeats / this.totalSeats) * 100).toFixed(1)
    },
    remainingSeats() {
      return this.totalSeats - this.usedSeats
    },
    statusLabel() {
      const percentage = this.usagePercentage
      if (percentage < 70) return 'OK'
      if (percentage < 90) return 'WARN'
      return 'FULL'
    }
  },
  methods: {
    handleManageSeats() {
      this.$emit('manage-seats')
    },
    handleNavigateToMembers() {
      this.$emit('navigate-to-members')
    }
  }
}
</script>
