<template>
  <div class="h-full flex flex-col">
    <div v-if="currentView === 'overview'" class="space-y-6 animate-in fade-in duration-500">
      <!-- Overview Header -->
      <div class="flex justify-between items-start mb-6">
        <div class="space-y-4">
          <div class="flex items-center gap-4">
             <ViewSelector :selected-view="selectedView" @change="handleViewChange" />
             <div class="w-px h-8 bg-slate-200 dark:bg-slate-800"></div>
             <div>
               <h1 class="text-2xl font-bold text-slate-900 dark:text-white" style="margin-bottom: 0px;">生产与效能统计</h1>
             </div>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <div class="relative">
            <button class="flex items-center justify-between w-32 px-3 py-1.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-md text-slate-900 dark:text-white hover:border-slate-400 dark:hover:border-slate-500 transition-colors">
              最近 30 天
              <span class="material-icons-round text-sm ml-2 text-slate-400">expand_more</span>
            </button>
          </div>
          <button class="p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-md text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
            <span class="material-icons-round text-lg">refresh</span>
          </button>
        </div>
      </div>

      <!-- KPI Cards Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Card 1: Code Lines -->
        <div class="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 hover:border-primary/50 cursor-pointer transition-all shadow-sm group" @click="openDetail('lines')">
          <div class="flex flex-col h-full justify-between">
            <div>
              <h3 class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide group-hover:text-primary transition-colors">仓库总代码行数</h3>
              <div class="mt-2 flex items-baseline">
                <span class="text-3xl font-bold text-slate-900 dark:text-white">45.2M</span>
              </div>
            </div>
            <div class="mt-4 h-16 w-full relative overflow-hidden">
               <!-- Simple Sparkline Mock -->
               <svg class="absolute bottom-0 left-0 w-full h-full text-blue-500" preserveAspectRatio="none" viewBox="0 0 100 40">
                  <path d="M0,35 Q10,38 20,30 T40,25 T60,20 T80,30 T100,10" fill="none" stroke="currentColor" stroke-width="2"></path>
                  <path d="M0,35 Q10,38 20,30 T40,25 T60,20 T80,30 T100,10 V40 H0 Z" fill="currentColor" opacity="0.1" stroke="none"></path>
               </svg>
            </div>
          </div>
        </div>

        <!-- Card 2: Commits -->
        <div class="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 hover:border-purple-500/50 cursor-pointer transition-all shadow-sm group" @click="openDetail('commits')">
          <div class="flex flex-col h-full justify-between">
            <div>
              <h3 class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide group-hover:text-purple-500 transition-colors">本周 Commits</h3>
              <div class="mt-2 flex items-baseline">
                <span class="text-3xl font-bold text-slate-900 dark:text-white">2,341</span>
              </div>
            </div>
            <div class="mt-4 h-16 w-full relative overflow-hidden">
               <!-- Simple Sparkline Mock -->
               <svg class="absolute bottom-0 left-0 w-full h-full text-purple-500" preserveAspectRatio="none" viewBox="0 0 100 40">
                  <path d="M0,20 L10,30 L20,10 L30,25 L40,15 L50,35 L60,5 L70,20 L80,10 L90,15 L100,20" fill="none" stroke="currentColor" stroke-width="2"></path>
                   <path d="M0,20 L10,30 L20,10 L30,25 L40,15 L50,35 L60,5 L70,20 L80,10 L90,15 L100,20 V40 H0 Z" fill="currentColor" opacity="0.1" stroke="none"></path>
               </svg>
            </div>
          </div>
        </div>

        <!-- Card 3: Issues -->
        <div class="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 hover:border-orange-500/50 cursor-pointer transition-all shadow-sm group" @click="openDetail('issues')">
          <div class="flex flex-col h-full justify-between">
            <div>
              <h3 class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide group-hover:text-orange-500 transition-colors">Issue 总数</h3>
              <div class="mt-2 flex items-baseline">
                <span class="text-3xl font-bold text-slate-900 dark:text-white">12,050</span>
              </div>
            </div>
            <div class="mt-4 h-16 w-full relative overflow-hidden">
               <!-- Simple Sparkline Mock -->
               <svg class="absolute bottom-0 left-0 w-full h-full text-orange-500" preserveAspectRatio="none" viewBox="0 0 100 40">
                  <path d="M0,25 Q25,35 50,15 T100,20" fill="none" stroke="currentColor" stroke-width="2"></path>
                  <path d="M0,25 Q25,35 50,15 T100,20 V40 H0 Z" fill="currentColor" opacity="0.1" stroke="none"></path>
               </svg>
            </div>
          </div>
        </div>

        <!-- Card 4: PR Rate -->
        <div class="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 cursor-pointer transition-all shadow-sm group" @click="openDetail('prs')">
          <div class="flex flex-col h-full justify-between">
            <div>
              <h3 class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide group-hover:text-emerald-500 transition-colors">PR 合入率</h3>
              <div class="mt-2 flex items-baseline">
                <span class="text-3xl font-bold text-emerald-600 dark:text-emerald-400">96.8%</span>
              </div>
            </div>
            <div class="mt-4 h-16 w-full relative overflow-hidden">
               <!-- Simple Sparkline Mock -->
               <svg class="absolute bottom-0 left-0 w-full h-full text-emerald-500" preserveAspectRatio="none" viewBox="0 0 100 40">
                 <path d="M0,15 L20,15 L25,10 L35,15 L50,15 L55,20 L70,15 L100,15" fill="none" stroke="currentColor" stroke-width="2"></path>
                 <path d="M0,15 L20,15 L25,10 L35,15 L50,15 L55,20 L70,15 L100,15 V40 H0 Z" fill="currentColor" opacity="0.1" stroke="none"></path>
               </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- SLA Monitoring Section -->
      <div class="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
        <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex justify-between items-center">
          <div class="flex items-center space-x-2">
            <span class="material-icons-round text-blue-500">schedule</span>
            <h2 class="text-base font-semibold text-slate-900 dark:text-white">研发效能 SLA 监控</h2>
          </div>
          <span class="text-xs text-slate-500 dark:text-slate-400 cursor-pointer hover:underline hover:text-primary">点击卡片查看超时工单详情</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-800">
          <!-- Issue SLA -->
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <h3 class="font-semibold text-slate-900 dark:text-white">Issue 响应</h3>
              <span class="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs font-medium px-2 py-0.5 rounded border border-blue-100 dark:border-blue-800">Goal: 24h</span>
            </div>
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">平均耗时</p>
                <p class="text-2xl font-bold text-slate-900 dark:text-white">4.2h</p>
              </div>
              <div>
                <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">达标率</p>
                <p class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">98%</p>
              </div>
            </div>
            <div class="mt-4 bg-red-50 dark:bg-red-900/20 rounded p-2 flex items-center text-xs text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30">
              <span class="material-icons-round text-sm mr-1.5">error_outline</span>
              3 个严重超时工单待处理
            </div>
          </div>
          <!-- PR SLA -->
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <h3 class="font-semibold text-slate-900 dark:text-white">PR 合入周期</h3>
              <span class="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs font-medium px-2 py-0.5 rounded border border-blue-100 dark:border-blue-800">Goal: 48h</span>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">平均耗时</p>
                <p class="text-2xl font-bold text-slate-900 dark:text-white">36h</p>
              </div>
              <div>
                <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">达标率</p>
                <p class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">92%</p>
              </div>
            </div>
            <div class="mt-4 h-[34px]"></div>
          </div>
          <!-- Code Review SLA -->
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <h3 class="font-semibold text-slate-900 dark:text-white">Code Review</h3>
              <span class="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs font-medium px-2 py-0.5 rounded border border-blue-100 dark:border-blue-800">Goal: 8h</span>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">平均耗时</p>
                <p class="text-2xl font-bold text-orange-500 dark:text-orange-400">12h</p>
              </div>
              <div>
                <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">达标率</p>
                <p class="text-2xl font-bold text-orange-500 dark:text-orange-400">78%</p>
              </div>
            </div>
            <div class="mt-4 h-[34px]"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detail View -->
    <EfficiencyDetail v-if="currentView === 'detail'" :show-back-button="true" @back="currentView = 'overview'" />
  </div>
</template>

<script>
import EfficiencyDetail from './EfficiencyDetail.vue'
import ViewSelector from './ViewSelector.vue'

export default {
  name: 'EfficiencyAnalysis',
  components: {
    EfficiencyDetail,
    ViewSelector
  },
  data() {
    return {
      currentView: 'overview', // 'overview' or 'detail'
      selectedView: { id: 'enterprise', label: '全企业视图 (Enterprise)', orgId: 'enterprise' }
    }
  },
  methods: {
    handleViewChange(view) {
      this.selectedView = view
      // In a real app, you would fetch new data here based on the selected view
    },
    openDetail(type) {
      console.log('Opening detail for:', type)
      this.currentView = 'detail'
    }
  }
}
</script>
