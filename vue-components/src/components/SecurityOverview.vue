<template>
  <div class="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <!-- View Selector & Title Header -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
      <div class="space-y-4">
        <!-- Subtitle / Breadcrumb Info -->
        <div class="flex items-center gap-4">
          <ViewSelector :selected-view="selectedView" @change="$emit('view-change', $event)" />
          <div class="w-px h-8 bg-slate-200 dark:bg-slate-800"></div>
          <div>
            <h1 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight" style="margin-bottom:0">企业安全风险总览</h1>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <button class="px-6 py-3 bg-slate-900 dark:bg-slate-700 text-white text-[10px] font-black rounded-xl uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20 transition-all hover:-translate-y-1 active:scale-95 border border-slate-800 dark:border-slate-600">
          立即开始全量扫描
        </button>
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

    <!-- KPI Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Security Score Card -->
      <div class="bg-slate-900 dark:bg-black rounded-xl p-8 text-white relative overflow-hidden shadow-2xl group transition-all hover:scale-[1.02]">
        <div class="absolute -right-10 -top-10 opacity-10 group-hover:opacity-20 transition-opacity">
          <span class="material-icons-round text-[180px]">shield</span>
        </div>
        <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">安全评分 · Security Score</h3>
        <div class="flex items-center gap-4 relative z-10">
          <span class="text-6xl font-black italic tracking-tighter">85</span>
          <div class="flex flex-col">
            <span class="text-emerald-400 text-xs font-black uppercase tracking-widest">B+ Grade</span>
            <span class="text-[10px] text-slate-500 font-bold mt-1 uppercase">良好的 (Healthy)</span>
          </div>
        </div>
        <div class="mt-8 w-full bg-slate-800 rounded-full h-2 overflow-hidden relative z-10">
          <div class="bg-emerald-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(16,185,129,0.5)]" style="width: 85%"></div>
        </div>
      </div>

      <!-- Detail KPI Cards -->
      <div v-for="stat in securityStats" :key="stat.label" class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm hover:shadow-xl transition-all group">
         <div class="flex items-center justify-between mb-4">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{{ stat.label }}</span>
            <div :class="['w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 shadow-sm', stat.iconBg]">
               <span :class="['material-icons-round text-lg', stat.iconColor]">{{ stat.icon }}</span>
            </div>
         </div>
         <div class="flex items-baseline gap-2">
            <span class="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{{ stat.value }}</span>
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ stat.unit }}</span>
         </div>
         <p :class="['text-[10px] font-bold mt-4 leading-relaxed uppercase tracking-wider', stat.descColor || 'text-slate-400']">{{ stat.description }}</p>
      </div>
    </div>

    <!-- Analytics & Risks Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Trend Chart Section -->
      <div class="lg:col-span-2 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-10 shadow-sm flex flex-col h-[500px]">
        <div class="flex items-center justify-between mb-10">
           <div class="space-y-1">
             <h3 class="text-xl font-black text-slate-900 dark:text-white tracking-tight">扫描漏洞趋势 (近30天)</h3>
             <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Security Vulnerability Analytics</p>
           </div>
           <div class="flex gap-4">
              <div class="flex items-center gap-2">
                 <div class="w-2.5 h-2.5 rounded-full bg-slate-100 dark:bg-slate-800"></div>
                 <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">扫描次数</span>
              </div>
              <div class="flex items-center gap-2">
                 <div class="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                 <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">检出漏洞</span>
              </div>
           </div>
        </div>
        
        <div class="flex-1 flex items-end justify-between gap-4 px-2 pb-8">
           <div v-for="(val, i) in trendData" :key="i" class="flex-1 group flex flex-col items-center gap-4 h-full justify-end">
              <div class="w-full relative bg-slate-50 dark:bg-slate-800/50 rounded-lg overflow-hidden transition-all group-hover:bg-slate-100 dark:group-hover:bg-slate-800" :style="{ height: (val.total / 1.5) + 'px' }">
                 <div class="absolute bottom-0 w-full bg-rose-500/80 transition-all duration-1000 group-hover:bg-rose-500" :style="{ height: (val.vuln / 1.5) + 'px' }"></div>
              </div>
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">{{ val.date }}</span>
           </div>
        </div>
      </div>

      <!-- Critical Risks List Section -->
      <div class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-10 shadow-sm flex flex-col h-[500px]">
        <h3 class="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-8">待处理高优风险</h3>
        <div class="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
           <div v-for="risk in risks" :key="risk.id" class="group bg-slate-50 dark:bg-slate-800/30 p-6 rounded-2xl border border-transparent hover:border-primary/20 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer shadow-sm hover:shadow-md">
              <div class="flex items-center gap-4 mb-4">
                 <div :class="['w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm', risk.iconBg]">
                    <span :class="['material-icons-round text-lg', risk.iconColor]">{{ risk.icon }}</span>
                 </div>
                 <div class="flex flex-col overflow-hidden">
                    <span class="text-sm font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors tracking-tight truncate">{{ risk.id }}</span>
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 truncate">{{ risk.repo }}</span>
                 </div>
              </div>
              <div class="h-px bg-slate-100 dark:bg-slate-800/60 mb-4"></div>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed uppercase tracking-wide group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">{{ risk.desc }}</p>
           </div>
        </div>
        <button class="mt-6 w-full py-4 border border-slate-100 dark:border-slate-800 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all hover:text-slate-600 dark:hover:text-slate-200">
           查看全部 12 条风险记录
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import ViewSelector from './ViewSelector.vue'

export default {
  name: 'SecurityOverview',
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
      securityStats: [
        { 
          label: '高危漏洞 · CVEs', 
          value: '12', 
          unit: 'Issues', 
          description: 'Critical: 2, High: 10', 
          descColor: 'text-rose-500',
          icon: 'bug_report', 
          iconBg: 'bg-rose-50/50 dark:bg-rose-900/10', 
          iconColor: 'text-rose-500' 
        },
        { 
          label: '合规风险 · License', 
          value: '5', 
          unit: 'Risks', 
          description: 'GPL License detected', 
          descColor: 'text-amber-500',
          icon: 'gavel', 
          iconBg: 'bg-amber-50/50 dark:bg-amber-900/10', 
          iconColor: 'text-amber-500' 
        },
        { 
          label: '检测覆盖率 · Coverage', 
          value: '98%', 
          unit: 'Total', 
          description: '56/58 Repositories', 
          descColor: 'text-blue-500',
          icon: 'verified_user', 
          iconBg: 'bg-blue-50/50 dark:bg-blue-900/10', 
          iconColor: 'text-blue-500' 
        }
      ],
      trendData: [
        { date: '10/01', total: 120, vuln: 20 },
        { date: '10/05', total: 140, vuln: 40 },
        { date: '10/10', total: 110, vuln: 15 },
        { date: '10/15', total: 180, vuln: 60 },
        { date: '10/20', total: 160, vuln: 25 },
        { date: 'Today', total: 100, vuln: 10 }
      ],
      risks: [
        { 
          id: 'CVE-2023-44487', 
          repo: 'AtomGit-Core / http-server', 
          desc: 'HTTP/2 Rapid Reset Attack vulnerability discovered in core server module.', 
          icon: 'error', 
          iconBg: 'bg-rose-50 dark:bg-rose-900/20', 
          iconColor: 'text-rose-500' 
        },
        { 
          id: 'GPL-3.0 License', 
          repo: 'Frontend / old-parser-lib', 
          desc: 'Contagious open source license mismatch detected in production bundle.', 
          icon: 'balance', 
          iconBg: 'bg-amber-50 dark:bg-amber-900/20', 
          iconColor: 'text-amber-500' 
        }
      ]
    }
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.15);
  border-radius: 0.75rem;
}
</style>
