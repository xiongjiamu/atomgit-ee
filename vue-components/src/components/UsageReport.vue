<template>
  <div class="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <!-- Header -->
    <!-- View Selector & Header -->
    <div class="flex items-center justify-between mb-4">
      <ViewSelector :selected-view="selectedView" @change="$emit('view-change', $event)" />
      <div class="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest bg-slate-50 dark:bg-slate-800/40 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800/60 shadow-sm transition-all hover:bg-slate-100 dark:hover:bg-slate-800/60">
        <span class="material-icons-round text-primary text-sm">calendar_today</span>
        <span class="font-black">最近 30 天消耗统计</span>
      </div>
    </div>

    <!-- Alert Banners -->
    <div class="space-y-3">
      <div class="bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-xl p-4 flex items-start">
        <span class="material-icons-round text-amber-500 text-lg mt-0.5 mr-3">info</span>
        <div class="flex-1 text-sm text-amber-800 dark:text-amber-200">
          <span class="font-bold mr-1">资源预警:</span> 您企业当前的存储空间已使用 856GB (85%), 接近包年套餐上限，请关注资源消耗或及时扩容
        </div>
        <button class="text-amber-400 hover:text-amber-600 transition-colors">
          <span class="material-icons-round text-lg">close</span>
        </button>
      </div>
      <div class="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 rounded-xl p-4 flex items-start">
        <span class="material-icons-round text-blue-600 dark:text-blue-400 text-lg mt-0.5 mr-3">campaign</span>
        <div class="flex-1 text-sm text-blue-800 dark:text-blue-200">
          <span class="font-bold mr-1">企业公告:</span> AtomGit 将于本周五 22:00 进行版本升级，届时 CI/CD 服务可能会有短时闪断，请知悉
        </div>
        <button class="text-blue-400 hover:text-blue-600 transition-colors">
          <span class="material-icons-round text-lg">close</span>
        </button>
      </div>
    </div>

    <!-- Metrics Cards -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Total Consumption -->
      <div class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm flex flex-col justify-between">
        <div class="flex justify-between items-start mb-6">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">总消耗时长 (MINUTES)</span>
          <span class="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase">This Month</span>
        </div>
        <div>
          <div class="flex items-baseline gap-2 mb-2">
            <span class="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">12,450</span>
            <span class="text-sm font-bold text-slate-400">/ 50k</span>
          </div>
          <p class="text-xs font-bold text-slate-500 mb-6">Pipeline execution time in minutes</p>
          <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden relative">
            <div class="absolute inset-0 bg-primary/10 animate-pulse"></div>
            <div class="h-full bg-primary rounded-full relative z-10 transition-all duration-1000" style="width: 25%"></div>
          </div>
        </div>
      </div>

      <!-- Runner Distribution (Pie Chart Style) -->
      <div class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm">
        <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 block">RUNNER 资源分布</span>
        <div class="flex items-center gap-10">
          <div class="relative w-32 h-32">
            <svg class="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="58" class="text-slate-100 dark:text-slate-800 stroke-current" stroke-width="12" fill="transparent" />
              <circle 
                cx="64" cy="64" r="58" 
                class="text-primary stroke-current transition-all duration-1000" 
                stroke-width="12" 
                stroke-dasharray="364.4" 
                stroke-dashoffset="127.5"
                fill="transparent" 
                stroke-linecap="round"
              />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-2xl font-black text-slate-900 dark:text-white leading-none">65%</span>
              <span class="text-[9px] font-bold text-primary uppercase tracking-widest mt-1">SaaS</span>
            </div>
          </div>
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-3 h-3 rounded-full bg-primary ring-4 ring-primary/10"></div>
              <div class="flex flex-col">
                <span class="text-xs font-black text-slate-900 dark:text-white">托管 Runner</span>
                <span class="text-[10px] text-slate-400 font-bold uppercase">Managed Hosts</span>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700"></div>
              <div class="flex flex-col">
                <span class="text-xs font-black text-slate-900 dark:text-white">自建 Runner</span>
                <span class="text-[10px] text-slate-400 font-bold uppercase">Self-hosted</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Platform Distribution -->
      <div class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm">
        <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 block">执行平台分布</span>
        <div class="space-y-6">
          <div v-for="platform in platforms" :key="platform.name" class="group">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-3">
                <span class="material-icons-round text-slate-400 group-hover:text-primary transition-colors">{{ platform.icon }}</span>
                <span class="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-tighter">{{ platform.name }}</span>
              </div>
              <span class="text-sm font-black text-slate-900 dark:text-white">{{ platform.percent }}%</span>
            </div>
            <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div 
                class="h-full bg-primary/60 rounded-full transition-all duration-1000 group-hover:bg-primary"
                :style="{ width: platform.percent + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Self-hosted Clusters Load -->
    <div class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-10 shadow-sm relative overflow-hidden group">
      <div class="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 blur-[100px] rounded-full transition-all group-hover:bg-primary/10"></div>
      
      <div class="flex items-center gap-3 mb-10">
        <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <span class="material-icons-round text-primary">dns</span>
        </div>
        <div>
          <h2 class="text-xl font-black text-slate-900 dark:text-white tracking-tight">企业自建 Runner 集群负载</h2>
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-0.5">Self-hosted Cluster Health Monitor</p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="cluster in clusterStats" :key="cluster.label" class="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-100 dark:border-slate-700/50 transition-all hover:shadow-xl hover:-translate-y-1">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{{ cluster.label }}</p>
          <div class="flex items-baseline gap-2">
            <span :class="['text-3xl font-black tracking-tight', cluster.valueClass]">{{ cluster.value }}</span>
            <span v-if="cluster.subtitle" class="text-[10px] font-bold text-slate-400 uppercase">{{ cluster.subtitle }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ViewSelector from './ViewSelector.vue'

export default {
  name: 'UsageReport',
  components: {
    ViewSelector
  },
  props: {
    selectedView: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      platforms: [
        { name: 'Linux', percent: 88, icon: 'grid_view' },
        { name: 'Windows', percent: 10, icon: 'desktop_windows' },
        { name: 'macOS', percent: 2, icon: 'laptop_mac' }
      ],
      clusterStats: [
        { label: '集群在线率', value: '100%', subtitle: '(24/24)', valueClass: 'text-emerald-500' },
        { label: '当前并发任务', value: '18', subtitle: '/ Max 50', valueClass: 'text-slate-900 dark:text-white' },
        { label: '峰值 CPU 使用率', value: '72%', valueClass: 'text-amber-500' },
        { label: '集群扩容预警', value: '正常', subtitle: '(Low)', valueClass: 'text-emerald-500' }
      ]
    }
  }
}
</script>
