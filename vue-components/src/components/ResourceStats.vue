<template>
  <div class="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
    <!-- Header Summary -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          资源使用预警
          <span class="px-2 py-0.5 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-[10px] font-bold rounded uppercase tracking-wider">实时预警中</span>
        </h1>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-2xl italic">
          统计当前企业下全部项目的资源占用情况，数据每 10 分钟自动更新一次。
        </p>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-xs text-slate-400 font-medium">上次更新: 刚刚</span>
        <button class="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-all shadow-sm group">
          <span class="material-icons-round text-lg text-slate-400 group-hover:text-primary group-hover:rotate-180 transition-all duration-500">refresh</span>
        </button>
      </div>
    </div>

    <!-- Main Dashboard Grid -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <!-- Storage Trend Chart -->
      <div class="xl:col-span-2 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-8 shadow-soft relative overflow-hidden group">
        <div class="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-primary/10 transition-colors duration-700"></div>
        
        <div class="flex items-center justify-between mb-8 relative z-10">
          <div class="flex items-center gap-3">
            <div class="w-1 h-6 bg-primary rounded-full"></div>
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">企业存储空间趋势</h2>
          </div>
          <select class="text-xs font-semibold bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 focus:ring-primary focus:border-primary">
            <option>最近 30 天</option>
            <option>最近 90 天</option>
            <option>本年度统计</option>
          </select>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10">
          <!-- Chart Placeholder (SVG Based) -->
          <div class="lg:col-span-2 h-64 w-full flex flex-col justify-end">
            <svg class="w-full h-48" preserveAspectRatio="none" viewBox="0 0 600 200">
              <defs>
                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.2"></stop>
                  <stop offset="100%" stop-color="#3b82f6" stop-opacity="0"></stop>
                </linearGradient>
              </defs>
              <!-- Grid Lines -->
              <line v-for="i in 4" :key="i" stroke="currentColor" class="text-slate-100 dark:text-slate-800" stroke-dasharray="4" x1="0" :x2="600" :y1="i * 50" :y2="i * 50"></line>
              <!-- Area -->
              <path d="M0,160 Q75,150 150,130 T300,120 T450,90 T600,80 L600,200 L0,200 Z" fill="url(#chartGradient)"></path>
              <!-- Line -->
              <path d="M0,160 Q75,150 150,130 T300,120 T450,90 T600,80" fill="none" stroke="#3b82f6" stroke-width="3" stroke-linecap="round"></path>
              <!-- Data Points -->
              <circle cx="150" cy="130" r="4" fill="white" stroke="#3b82f6" stroke-width="2"></circle>
              <circle cx="300" cy="120" r="4" fill="white" stroke="#3b82f6" stroke-width="2"></circle>
              <circle cx="450" cy="90" r="4" fill="white" stroke="#3b82f6" stroke-width="2"></circle>
              <circle cx="600" cy="80" r="4" fill="white" stroke="#3b82f6" stroke-width="2"></circle>
            </svg>
            <div class="flex justify-between mt-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">
              <span>01/01</span>
              <span>01/08</span>
              <span>01/15</span>
              <span>01/22</span>
              <span class="text-primary">TODAY</span>
            </div>
          </div>

          <!-- Analysis Panel -->
          <div class="lg:border-l border-slate-100 dark:border-slate-800 lg:pl-10 flex flex-col justify-center space-y-6">
            <div class="space-y-2">
              <div class="flex justify-between items-end">
                <span class="text-xs font-bold text-slate-400 uppercase">总容量 30.0GB</span>
                <span class="text-xl font-black text-slate-900 dark:text-white">15.0GB</span>
              </div>
              <div class="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                <div class="h-full bg-blue-500 rounded-full" style="width: 50.0%"></div>
              </div>
              <p class="text-[10px] text-right text-blue-500 font-bold">已使用 50.0% · 预计可用 180 天</p>
            </div>

            <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
              <div class="flex items-start gap-3">
                <span class="material-icons-round text-blue-500 text-lg">insights</span>
                <div class="text-xs leading-relaxed text-blue-800 dark:text-blue-300">
                  <span class="font-bold block mb-1">智能分析结论：</span>
                  存储量平稳增长，相比上月环比增长 5.2%。建议清理废弃构建产物以释放空间。
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Critical Warning Widget -->
      <div class="bg-surface-light dark:bg-surface-dark border border-rose-100 dark:border-rose-900/30 rounded-2xl p-8 shadow-soft flex flex-col justify-between relative overflow-hidden">
        <div class="absolute top-0 right-0 p-3">
           <span class="flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.6)]"></span>
          </span>
        </div>

        <div>
          <h2 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-8">
            <span class="material-icons-round text-rose-500">warning_amber</span>
            LFS 空间预警
          </h2>
          
          <div class="relative flex justify-center items-center mb-8">
            <svg class="w-40 h-40 transform -rotate-90">
              <circle class="text-slate-100 dark:text-slate-800" cx="80" cy="80" r="70" fill="transparent" stroke="currentColor" stroke-width="12"></circle>
              <circle 
                class="text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]" 
                cx="80" cy="80" r="70" 
                fill="transparent" 
                stroke="currentColor" 
                stroke-width="12" 
                stroke-dasharray="440" 
                stroke-dashoffset="13"
                stroke-linecap="round"
              ></circle>
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-3xl font-black text-rose-600 dark:text-rose-500">97%</span>
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CRITICAL</span>
            </div>
          </div>

          <div class="space-y-2 mb-6">
            <div class="flex justify-between text-xs font-bold">
              <span class="text-slate-400">配额 500GB</span>
              <span class="text-rose-600">485GB</span>
            </div>
            <div class="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div class="h-full bg-rose-500" style="width: 97%"></div>
            </div>
          </div>
        </div>

        <div class="bg-rose-50 dark:bg-rose-900/20 rounded-xl p-4 border border-rose-100 dark:border-rose-900/30">
          <p class="text-xs text-rose-800 dark:text-rose-300 font-medium leading-relaxed">
            剩余空间不足 15GB，可能导致无法上传新的大文件。请归档历史项目或立即扩容。
          </p>
          <button class="mt-3 w-full py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-lg shadow-rose-500/20 transition-all">
            立即扩容
          </button>
        </div>
      </div>
    </div>

    <!-- Secondary Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Project Quotas -->
      <div class="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-8 shadow-soft">
        <div class="flex items-center justify-between mb-8">
          <div class="flex items-center gap-3">
            <div class="w-1 h-6 bg-emerald-500 rounded-full"></div>
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">项目与席位配额</h2>
          </div>
          <button class="text-xs font-bold text-primary hover:underline">管理配额 →</button>
        </div>

        <div class="space-y-6">
          <div v-for="quota in quotas" :key="quota.label" class="p-5 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:bg-white dark:hover:bg-slate-800">
            <div class="flex items-center gap-4">
              <div :class="['w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-sm', quota.bg]">
                <span class="material-icons-round px-2" :class="quota.color">{{ quota.icon }}</span>
              </div>
              <div class="flex-1">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm font-bold text-slate-700 dark:text-slate-300">{{ quota.label }}</span>
                  <span class="text-sm font-black text-slate-900 dark:text-white">{{ quota.current }} / {{ quota.total }}</span>
                </div>
                <div class="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div :class="['h-full rounded-full', quota.barColor]" :style="{ width: (quota.current / quota.total * 100) + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Build Minutes -->
      <div class="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-8 shadow-soft">
        <div class="flex items-center justify-between mb-8">
          <div class="flex items-center gap-3">
            <div class="w-1 h-6 bg-purple-500 rounded-full"></div>
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">构建分钟数 (CI/CD)</h2>
          </div>
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">本月周期记录</span>
        </div>

        <div class="space-y-8">
          <div>
            <div class="flex justify-between items-end mb-3">
              <span class="text-2xl font-black text-slate-900 dark:text-white">1,240 <span class="text-xs font-bold text-slate-400 ml-1">MINUTES</span></span>
              <span class="text-xs font-bold text-slate-400">总额度 2,000 分钟</span>
            </div>
            <div class="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner flex">
              <div class="h-full bg-purple-500 shadow-lg shadow-purple-500/20" style="width: 62%"></div>
            </div>
            <div class="flex justify-between mt-3">
              <span class="text-[10px] font-black text-purple-600 dark:text-purple-400 tracking-tighter uppercase">已消耗 62%</span>
              <span class="text-[10px] font-black text-slate-400 tracking-tighter uppercase">剩余 760 分钟</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800">
              <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">macOS 构建</div>
              <div class="text-lg font-black text-slate-900 dark:text-white">420 <span class="text-xs font-medium">min</span></div>
            </div>
            <div class="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800">
              <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Linux 构建</div>
              <div class="text-lg font-black text-slate-900 dark:text-white">820 <span class="text-xs font-medium">min</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <p class="text-center text-[11px] font-bold text-slate-400 mt-12 mb-4 uppercase tracking-widest">AtomGit Enterprise · © 2024</p>
  </div>
</template>

<script>
export default {
  name: 'ResourceStats',
  data() {
    return {
      quotas: [
        { 
          label: '席位授权', 
          icon: 'group', 
          current: 24, 
          total: 50, 
          bg: 'bg-blue-100 dark:bg-blue-900/30', 
          color: 'text-blue-600 dark:text-blue-400',
          barColor: 'bg-blue-500'
        },
        { 
          label: '企业项目', 
          icon: 'folder_open', 
          current: 65, 
          total: 200, 
          bg: 'bg-emerald-100 dark:bg-emerald-900/30', 
          color: 'text-emerald-600 dark:text-emerald-400',
          barColor: 'bg-emerald-500'
        }
      ]
    }
  }
}
</script>

<style scoped>
.shadow-soft {
  box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.04);
}
</style>
