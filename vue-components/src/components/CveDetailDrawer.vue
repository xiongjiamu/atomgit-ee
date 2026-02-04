<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-50 overflow-hidden">
      <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>
      
      <div class="absolute inset-y-0 right-0 max-w-full flex">
        <div class="w-screen max-w-2xl transform transition ease-in-out duration-300 sm:duration-500" :class="show ? 'translate-x-0' : 'translate-x-full'">
          <div class="h-full flex flex-col bg-white dark:bg-background-dark shadow-xl overflow-hidden">
            <!-- Header -->
            <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex items-start justify-between bg-white dark:bg-background-dark/95 backdrop-blur sticky top-0 z-10">
              <div>
                 <div class="flex items-center gap-3 mb-1">
                    <h2 class="text-xl font-black text-slate-900 dark:text-white tracking-tighter">{{ cveData.id }}</h2>
                    <span :class="severityClasses" class="inline-flex items-center rounded-md px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest ring-1 ring-inset">
                        {{ cveData.severityLabel }} ({{ cveData.score }})
                    </span>
                 </div>
                 <div class="flex items-center gap-4 text-xs font-bold text-slate-500">
                    <span class="flex items-center gap-1.5 uppercase tracking-widest">
                        <span class="material-icons-outlined text-sm">event</span>
                        检测于: {{ cveData.lastSeen }}
                    </span>
                    <span class="flex items-center gap-1.5 uppercase tracking-widest">
                        <span class="material-icons-outlined text-sm">category</span>
                        类型: {{ cveData.type }}
                    </span>
                 </div>
              </div>
              <button class="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 p-1 transition-colors" @click="$emit('close')">
                <span class="material-icons-outlined text-2xl">close</span>
              </button>
            </div>

            <!-- Content -->
            <div class="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
              <!-- Summary Section -->
              <section class="space-y-4">
                <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">漏洞摘要 · Summary</h3>
                <div class="space-y-6">
                  <div>
                    <h4 class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">漏洞名称 · Vulnerability Name</h4>
                    <p class="text-base font-black text-slate-900 dark:text-white leading-tight underline decoration-primary/20 underline-offset-4">
                      {{ cveData.name || 'Rapid Reset: HTTP/2 Stream Multiplexing Resource Exhaustion' }}
                    </p>
                  </div>
                  <div>
                    <h4 class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">详情简介 · Description</h4>
                    <p class="text-sm leading-relaxed text-slate-600 dark:text-slate-300 font-medium bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                      {{ cveData.fullDescription || '该漏洞利用了 HTTP/2 协议中的流复用机制。攻击者可以通过发送大量的 RST_STREAM 帧来快速重置流。' }}
                    </p>
                  </div>
                </div>

                <!-- Affected Component Grid -->
                <div class="grid grid-cols-2 gap-4 mt-6 text-center lg:text-left">
                  <div class="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 group hover:border-primary/20 transition-all">
                    <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">受影响组件</span>
                    <span class="text-sm font-black text-slate-900 dark:text-white font-mono">{{ cveData.component }}</span>
                  </div>
                  <div class="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 group hover:border-primary/20 transition-all">
                    <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">修复版本目标</span>
                    <span class="text-sm font-black text-emerald-500 uppercase">>= v2.3.4 (Next)</span>
                  </div>
                </div>
              </section>

              <!-- Severity Details -->
              <section class="space-y-4">
                <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">危害评估 · Severity</h3>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div v-for="metric in cveData.vectorMetrics" :key="metric.label" class="flex flex-col gap-1.5 p-4 bg-white dark:bg-slate-900/30 rounded-2xl border border-slate-100 dark:border-slate-800 text-center shadow-sm">
                    <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">{{ metric.label }}</span>
                    <span :class="['text-xs font-black uppercase tracking-tight', metric.color]">{{ metric.value }}</span>
                  </div>
                </div>
                <!-- CVSS Score Widget -->
                <div class="p-6 bg-slate-900 dark:bg-black rounded-2xl relative overflow-hidden group border border-slate-800">
                  <div class="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-primary/10 to-transparent"></div>
                  <div class="flex items-center justify-between relative z-10">
                    <div>
                      <h4 class="text-base font-black text-white tracking-tighter">CVSS 3.1 Base Score</h4>
                      <p class="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">Vector: AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H</p>
                    </div>
                    <div class="flex items-center gap-4">
                      <span class="text-4xl font-black text-white tracking-tighter">{{ cveData.score }}</span>
                      <div class="w-px h-10 bg-white/20"></div>
                      <span class="text-lg font-black uppercase tracking-widest text-primary">{{ cveData.severityLabel }}</span>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Impacted Assets -->
              <section class="space-y-4 pb-4">
                <div class="flex items-center justify-between">
                  <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">受影响项目 · Assets</h3>
                  <button class="text-[9px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1 transition-all">
                    查看全部清单
                    <span class="material-icons-outlined text-sm">open_in_new</span>
                  </button>
                </div>
                <div class="bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                   <table class="w-full text-left text-sm">
                     <thead class="bg-slate-50 dark:bg-slate-900/50 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                       <tr>
                         <th class="px-6 py-4">Project Repository</th>
                         <th class="px-6 py-4 text-right">Action</th>
                       </tr>
                     </thead>
                     <tbody class="divide-y divide-slate-50 dark:divide-slate-800">
                       <tr v-for="proj in impactProjects" :key="proj.name" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group/proj">
                         <td class="px-6 py-4">
                           <div class="flex items-center gap-3">
                             <div class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover/proj:text-primary transition-colors">
                               <span class="material-icons-round text-sm">folder_open</span>
                             </div>
                             <span class="text-xs font-bold text-slate-900 dark:text-white group-hover/proj:text-primary transition-colors truncate max-w-[180px]">{{ proj.name }}</span>
                           </div>
                         </td>
                         <td class="px-6 py-4 text-right">
                           <button class="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Inspect</button>
                         </td>
                       </tr>
                     </tbody>
                   </table>
                </div>
              </section>
            </div>

            <!-- Footer -->
            <div class="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-background-dark/95 backdrop-blur z-10 flex flex-col sm:flex-row gap-3">
               <div class="flex flex-1 gap-3">
                  <button class="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-white dark:hover:bg-slate-700 transition-all active:scale-95 shadow-sm" @click="$emit('close')">
                    关闭
                  </button>
                  <button class="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2">
                    <span class="material-icons-outlined text-sm">auto_awesome</span>
                    AI 修复建议
                  </button>
               </div>
               <button class="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest hover:bg-white dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2">
                 <span class="material-icons-outlined text-sm">download</span>
                 导出报告
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
export default {
  name: 'CveDetailDrawer',
  props: {
    show: Boolean,
    cveData: {
      type: Object,
      required: true
    },
    impactProjects: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    severityClasses() {
      if (!this.cveData || !this.cveData.severityLabel) return ''
      
      const label = this.cveData.severityLabel.toUpperCase()
      if (label === 'CRITICAL') {
        return 'bg-red-50 text-red-700 ring-red-600/10 dark:bg-red-900/30 dark:text-red-400'
      } else if (label === 'HIGH') {
        return 'bg-amber-50 text-amber-700 ring-amber-600/10 dark:bg-amber-900/30 dark:text-amber-400'
      } else if (label === 'MEDIUM') {
        return 'bg-blue-50 text-blue-700 ring-blue-600/10 dark:bg-blue-900/30 dark:text-blue-400'
      }
      return 'bg-slate-50 text-slate-700 ring-slate-600/10 dark:bg-slate-900/30 dark:text-slate-400'
    }
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.1);
  border-radius: 0.75rem;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.2);
}
</style>
