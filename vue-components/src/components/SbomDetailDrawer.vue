<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-50 overflow-hidden">
      <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>
      
      <div class="absolute inset-y-0 right-0 max-w-full flex">
        <div class="w-screen max-w-2xl transform transition ease-in-out duration-300 sm:duration-500" :class="show ? 'translate-x-0' : 'translate-x-full'">
          <div class="h-full flex flex-col bg-white dark:bg-background-dark shadow-xl overflow-hidden">
            <!-- Header -->
            <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex items-start justify-between bg-white dark:bg-background-dark/95 backdrop-blur sticky top-0 z-10">
              <div class="flex items-start gap-5">
                <div :class="['size-14 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xl transition-transform hover:rotate-6', component.avatarColor || 'bg-primary']">
                  <span class="material-icons-round text-3xl">{{ component.icon || 'settings_input_component' }}</span>
                </div>
                <div class="space-y-1.5">
                  <h2 class="text-xl font-black text-slate-900 dark:text-white tracking-tight">{{ component.name }}</h2>
                  <div class="flex items-center gap-2">
                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] font-mono opacity-70">{{ component.packageName }}</span>
                    <span class="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span class="text-[10px] font-black text-primary uppercase tracking-widest">{{ component.version }}</span>
                  </div>
                </div>
              </div>
              <button class="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 p-1 transition-colors" @click="$emit('close')">
                <span class="material-icons-round text-2xl">close</span>
              </button>
            </div>

            <!-- Content -->
            <div class="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
              <!-- Risk Banner -->
              <div 
                v-if="component.vulnerabilities?.length"
                class="rounded-xl bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20 p-5 flex gap-4"
              >
                <div class="size-8 rounded-lg bg-rose-500 flex items-center justify-center text-white shrink-0 animate-pulse">
                  <span class="material-icons-round text-lg">gpp_maybe</span>
                </div>
                <div>
                  <h4 class="text-sm font-black text-rose-800 dark:text-rose-300 font-bold">发现 {{ component.vulnerabilities.length }} 个安全漏洞</h4>
                  <p class="text-[10px] text-rose-600 dark:text-rose-400 mt-1.5 font-bold leading-relaxed uppercase tracking-wide">
                    建议尽快升级至 v{{ component.latestVersion }} 或更高版本以消除已知的安全风险。
                  </p>
                </div>
              </div>

              <!-- Basic Info Grid -->
              <section class="space-y-4">
                <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">组件情报 · Intelligence</h3>
                <div class="grid grid-cols-2 gap-4">
                  <div class="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1 group hover:border-primary/20 transition-colors">
                    <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block">当前版本</span>
                    <span class="text-sm font-black text-slate-900 dark:text-white font-mono">{{ component.version }}</span>
                  </div>
                  <div class="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1 group hover:border-primary/20 transition-colors">
                    <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block">最新版本</span>
                    <span class="text-sm font-black text-primary font-mono">{{ component.latestVersion }}</span>
                  </div>
                  <div class="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1 group hover:border-primary/20 transition-colors">
                    <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block">公开许可证</span>
                    <div class="flex items-center gap-1.5 text-slate-900 dark:text-white">
                      <span class="material-icons-round text-sm text-slate-400">balance</span>
                      <span class="text-sm font-black font-mono">{{ component.license }}</span>
                    </div>
                  </div>
                   <div class="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1 group hover:border-primary/20 transition-colors">
                    <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block">引用深度</span>
                    <span class="text-sm font-black text-slate-900 dark:text-white">Level {{ component.depth }}</span>
                  </div>
                </div>
              </section>

              <!-- Vulnerabilities -->
              <section class="space-y-4">
                <div class="flex items-center justify-between">
                  <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">安全漏洞 · CVE Alerts</h3>
                  <button v-if="component.vulnerabilities?.length" class="text-[9px] font-black text-primary uppercase tracking-widest hover:underline">查看全部详情</button>
                </div>
                
                <div v-if="component.vulnerabilities?.length" class="space-y-3">
                  <div 
                    v-for="v in component.vulnerabilities" 
                    :key="v.id"
                    class="group p-4 bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl hover:border-rose-500/30 hover:shadow-lg hover:shadow-rose-500/5 transition-all cursor-pointer"
                  >
                    <div class="flex justify-between items-start mb-2">
                       <span class="px-2 py-0.5 bg-rose-500 text-white text-[9px] font-black rounded uppercase tracking-widest">High ({{ v.score || '8.8' }})</span>
                       <span class="text-[9px] font-black text-slate-400 font-mono">{{ v.id }}</span>
                    </div>
                    <p class="text-xs font-black text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors leading-relaxed">
                      {{ v.title }}
                    </p>
                  </div>
                </div>
                <div v-else class="flex flex-col items-center justify-center py-10 opacity-30">
                  <span class="material-icons-round text-4xl mb-2 text-slate-400">verified_user</span>
                  <p class="text-[10px] font-black uppercase tracking-widest">该组件暂无已知安全漏洞</p>
                </div>
              </section>

              <!-- Projects Impacted -->
              <section class="space-y-4 pb-4">
                 <div class="flex items-center justify-between">
                  <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">关联受影响项目 · Assets</h3>
                  <button class="text-[9px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1 transition-all" @click="$emit('open-projects')">
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
                       <tr v-for="proj in (component.projects || []).slice(0, 3)" :key="proj.name" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group/proj">
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
            <div class="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-background-dark/95 backdrop-blur z-10 flex gap-3">
              <button class="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-white dark:hover:bg-slate-700 transition-all active:scale-95 shadow-sm" @click="$emit('close')">
                关闭
              </button>
              <button class="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2">
                <span class="material-icons-outlined text-sm">auto_awesome</span>
                开启修复加速
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
  name: 'SbomDetailDrawer',
  props: {
    show: Boolean,
    component: {
      type: Object,
      required: true
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
