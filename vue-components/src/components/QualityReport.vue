<template>
  <div class="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <!-- Header Area -->
    <!-- View Selector & Header -->
    <div class="flex items-center justify-between mb-4">
      <ViewSelector :selected-view="selectedView" @change="$emit('view-change', $event)" />
      <div class="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest bg-slate-50 dark:bg-slate-800/40 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800/60 shadow-sm transition-all hover:bg-slate-100 dark:hover:bg-slate-800/60">
        <span class="material-icons-round text-primary text-sm">insights</span>
        <span class="font-black">交付效能洞察</span>
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

    <!-- Top Grid: SLA Score & Success Trend -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- SLA Score Card -->
      <div class="lg:col-span-5 bg-gradient-to-br from-indigo-600 to-blue-700 dark:from-indigo-900 dark:to-blue-900 rounded-xl p-10 text-white relative overflow-hidden shadow-2xl flex flex-col justify-between min-h-[380px] group transition-all hover:scale-[1.01]">
        <div class="absolute -right-20 -top-20 w-80 h-80 bg-white/10 blur-[100px] rounded-full group-hover:bg-white/20 transition-all"></div>
        <div class="absolute bottom-10 right-10 opacity-10 scale-[5] group-hover:scale-[6] transition-transform duration-1000">
          <span class="material-icons-round text-white text-[120px]">verified</span>
        </div>
        
        <div class="relative z-10">
          <h2 class="text-xs font-black uppercase tracking-[0.3em] text-white/90 mb-6">SLA 交付健康评分</h2>
          <div class="flex items-baseline gap-2 mb-4">
            <span class="text-8xl font-black tracking-tighter">94</span>
            <span class="text-xl font-bold text-white/60">/ 100</span>
          </div>
          <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
            <div class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span class="text-xs font-black uppercase tracking-widest">优秀 (Exceeds Goal)</span>
          </div>
        </div>

        <div class="relative z-10 mt-auto">
          <p class="text-[10px] font-bold text-white/80 uppercase tracking-widest leading-relaxed">
            评分基于成功率 (Success Rate)、平均排队时长 (Wait Time) 及 <br/> 故障恢复时长 (MTTR) 综合计算。
          </p>
        </div>
      </div>

      <!-- Success Rate Chart Placeholder Style -->
      <div class="lg:col-span-7 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-10 shadow-sm flex flex-col">
        <div class="flex justify-between items-center mb-10">
          <div>
            <h3 class="text-lg font-black text-slate-900 dark:text-white tracking-tight">构建成功率趋势</h3>
            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Past 14 Days Analytics</p>
          </div>
          <div class="flex items-center gap-6">
            <div class="flex items-center gap-2">
              <div class="w-2.5 h-2.5 rounded-full bg-primary/40"></div>
              <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Success</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-2.5 h-2.5 rounded-full bg-rose-400"></div>
              <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Failure</span>
            </div>
          </div>
        </div>
        
        <div class="flex-1 flex items-end justify-between gap-3 h-48 px-2 relative mb-6">
          <div 
            v-for="(bar, index) in trendBars" 
            :key="index"
            :class="['flex-1 rounded-xl transition-all duration-700 hover:scale-105 cursor-pointer shadow-sm', bar.color]"
            :style="{ height: bar.height + '%' }"
          ></div>
          <!-- Grid Lines (Faded) -->
          <div class="absolute inset-x-0 top-0 h-px bg-slate-100 dark:bg-slate-800/50"></div>
          <div class="absolute inset-x-0 top-1/2 h-px bg-slate-100 dark:bg-slate-800/50 border-dashed border-t"></div>
        </div>
        
        <div class="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
          <span>01/10</span>
          <span>01/17</span>
          <span class="text-primary">Today</span>
        </div>
      </div>
    </div>

    <!-- Bottom Grid: Efficiency & Error Breakdown -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Efficiency Indicators -->
      <div class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-10 shadow-sm">
        <div class="flex items-center gap-3 mb-10">
          <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <span class="material-icons-round text-primary">schedule</span>
          </div>
          <h3 class="text-lg font-black text-slate-900 dark:text-white tracking-tight">SLA 交付效率指标</h3>
        </div>
        
        <div class="space-y-10">
          <div v-for="metric in efficiencyMetrics" :key="metric.label">
            <div class="flex justify-between items-end mb-3">
              <div class="flex flex-col">
                <span class="text-sm font-bold text-slate-700 dark:text-slate-300">{{ metric.label }}</span>
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{{ metric.sublabel }}</span>
              </div>
              <div class="flex items-baseline gap-1">
                <span :class="['text-3xl font-black tracking-tight', metric.valueColor]">{{ metric.value }}</span>
                <span class="text-xs font-bold text-slate-400">{{ metric.unit }}</span>
              </div>
            </div>
            <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden relative">
              <div 
                :class="['h-full rounded-full transition-all duration-1000', metric.progressColor]" 
                :style="{ width: metric.percent + '%' }"
              ></div>
            </div>
            <div class="flex items-center gap-2 mt-3">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Goal: {{ metric.goal }}</span>
              <div class="w-1 h-1 rounded-full bg-slate-200"></div>
              <span :class="['text-[10px] font-black uppercase tracking-widest', metric.statusColor]">{{ metric.status }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Breakdown -->
      <div class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-10 shadow-sm">
        <div class="flex items-center gap-3 mb-10">
          <div class="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
            <span class="material-icons-round text-rose-500">warning_amber</span>
          </div>
          <h3 class="text-lg font-black text-slate-900 dark:text-white tracking-tight">失败原因分布</h3>
        </div>

        <div class="space-y-8">
          <div v-for="error in errors" :key="error.name" class="flex items-center gap-6">
            <div class="w-24 shrink-0">
              <span class="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-tighter">{{ error.name }}</span>
            </div>
            <div class="flex-1">
              <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden relative group">
                <div 
                  :class="['h-full rounded-full transition-all duration-1000', error.color]" 
                  :style="{ width: error.percent + '%' }"
                ></div>
              </div>
            </div>
            <div class="w-12 text-right">
              <span class="text-sm font-black text-slate-900 dark:text-white">{{ error.percent }}%</span>
            </div>
          </div>
        </div>
        
        <div class="mt-12 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
          <p class="text-xs font-bold text-slate-500 leading-relaxed">
            <span class="text-primary mr-1">💡 Insight:</span> 
            本周「环境基础设施」错误率上升 12%，主要集中在自建 Runner 的 Docker 镜像拉取超时，建议优化国内镜像源配置。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ViewSelector from './ViewSelector.vue'

export default {
  name: 'QualityReport',
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
      trendBars: [
        { height: 65, color: 'bg-primary/20' },
        { height: 75, color: 'bg-primary/30' },
        { height: 15, color: 'bg-rose-400 shadow-lg shadow-rose-200 dark:shadow-rose-900/20' },
        { height: 80, color: 'bg-primary/40' },
        { height: 70, color: 'bg-primary/30' },
        { height: 85, color: 'bg-primary/50' },
        { height: 90, color: 'bg-primary' },
        { height: 72, color: 'bg-primary/40' },
        { height: 68, color: 'bg-primary/30' },
        { height: 78, color: 'bg-primary/40' },
        { height: 82, color: 'bg-primary/45' },
        { height: 60, color: 'bg-primary/25' },
        { height: 92, color: 'bg-primary' },
        { height: 88, color: 'bg-primary/10' }
      ],
      efficiencyMetrics: [
        { 
          label: '平均排队耗时', 
          sublabel: 'Waiting for Runner', 
          value: '12', 
          unit: 's', 
          percent: 20, 
          goal: '< 1m', 
          status: '符合预期', 
          statusColor: 'text-emerald-500', 
          valueColor: 'text-slate-900 dark:text-white', 
          progressColor: 'bg-primary' 
        },
        { 
          label: '平均故障恢复时长', 
          sublabel: 'MTTR', 
          value: '2.4', 
          unit: 'h', 
          percent: 65, 
          goal: '< 1h', 
          status: '需关注', 
          statusColor: 'text-amber-500', 
          valueColor: 'text-amber-500', 
          progressColor: 'bg-amber-500' 
        }
      ],
      errors: [
        { name: '代码脚本错误', percent: 65, color: 'bg-rose-500' },
        { name: '环境基础设施', percent: 25, color: 'bg-amber-500' },
        { name: '第三方 API', percent: 10, color: 'bg-slate-400' }
      ]
    }
  }
}
</script>
