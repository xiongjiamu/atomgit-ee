<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-50 overflow-hidden">
      <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>
      
      <div class="absolute inset-y-0 right-0 max-w-full flex">
        <div class="w-screen max-w-2xl transform transition ease-in-out duration-300 sm:duration-500" :class="show ? 'translate-x-0' : 'translate-x-full'">
          <div class="h-full flex flex-col bg-white dark:bg-background-dark shadow-xl overflow-y-scroll">
            <!-- Header -->
            <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex items-start justify-between">
              <div>
                 <div class="flex items-center gap-3 mb-1">
                    <h2 class="text-lg font-bold text-slate-900 dark:text-white">同步详情 - {{ logData.taskName || 'Enterprise Wiki' }}</h2>
                    <span :class="statusClasses" class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset">
                        状态: {{ logData.status === 'success' ? '成功' : '失败' }}
                    </span>
                 </div>
                 <p class="text-sm text-slate-500 dark:text-slate-400">
                    任务 ID: <span class="font-mono text-slate-700 dark:text-slate-300">{{ logData.id || 'SYNC_001' }}</span>
                 </p>
              </div>
              <button class="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 p-1" @click="$emit('close')">
                <span class="material-icons-outlined text-2xl">close</span>
              </button>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-3 gap-6 p-6 border-b border-gray-100 dark:border-gray-800/50">
                <div class="flex flex-col gap-1">
                    <span class="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">执行时间</span>
                    <span class="text-slate-900 dark:text-white text-sm font-semibold">{{ logData.startTime || '2023-10-27 10:45:00' }}</span>
                </div>
                <div class="flex flex-col gap-1">
                    <span class="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">耗时</span>
                    <span class="text-slate-900 dark:text-white text-sm font-semibold">2m 15s</span>
                </div>
                <div class="flex flex-col gap-1">
                    <span class="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">同步页面</span>
                    <div class="flex items-center gap-2">
                        <span class="text-slate-900 dark:text-white text-sm font-semibold">{{ logData.count || 50 }}</span>
                        <span class="text-xs text-slate-400">(240KB)</span>
                    </div>
                </div>
            </div>

            <!-- Log Output -->
            <div class="flex-1 p-6 flex flex-col min-h-[400px]">
                <div class="flex items-center justify-between mb-3">
                    <h3 class="text-slate-900 dark:text-white text-base font-bold">日志输出</h3>
                    <div class="flex gap-2">
                        <button class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                             <span class="material-icons-outlined text-[16px]">search</span>
                            <span>搜索</span>
                        </button>
                         <button class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                             <span class="material-icons-outlined text-[16px]">content_copy</span>
                            <span>复制日志</span>
                        </button>
                    </div>
                </div>
                
                <div class="flex-1 bg-slate-900 rounded-xl shadow-inner border border-slate-800 overflow-hidden flex flex-col">
                    <div class="flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-slate-800">
                         <div class="flex gap-1.5">
                            <div class="w-3 h-3 rounded-full bg-red-500/80"></div>
                            <div class="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                            <div class="w-3 h-3 rounded-full bg-green-500/80"></div>
                        </div>
                        <span class="text-[10px] text-slate-500 font-mono">live_tail.log</span>
                    </div>
                    <div class="p-4 overflow-y-auto log-scroll flex-1 font-mono text-xs sm:text-sm leading-6 sm:leading-7 text-slate-300">
                        <div class="hover:bg-white/5 px-2 -mx-2 rounded transition-colors">
                            <span class="text-slate-500 select-none mr-2">001</span>
                            <span class="text-blue-400 font-bold">[INFO]</span>
                            <span class="text-slate-500 mx-2">10:45:01</span>
                            <span>Initializing connection to AtomGit Enterprise...</span>
                        </div>
                        <div class="hover:bg-white/5 px-2 -mx-2 rounded transition-colors">
                            <span class="text-slate-500 select-none mr-2">002</span>
                            <span class="text-blue-400 font-bold">[INFO]</span>
                            <span class="text-slate-500 mx-2">10:45:01</span>
                            <span>Checking environment variables... <span class="text-green-400">OK</span></span>
                        </div>
                         <div class="hover:bg-white/5 px-2 -mx-2 rounded transition-colors bg-red-500/10 border-l-2 border-red-500 ml-0 pl-1 my-1" v-if="logData.status === 'fail'">
                            <span class="text-slate-500 select-none mr-2">009</span>
                            <span class="text-red-500 font-bold">[ERROR]</span>
                            <span class="text-slate-500 mx-2">10:45:15</span>
                            <span>Connection timed out on page 12. </span>
                            <div class="pl-[68px] text-slate-400 text-xs py-1">
                                Caused by: ETIMEDOUT 192.168.1.55:443
                            </div>
                        </div>
                        <div class="mt-2 flex items-center">
                            <span class="text-slate-500 mr-2">&gt;</span>
                            <span class="w-2 h-4 bg-slate-400 animate-pulse"></span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
             <div class="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-background-dark/95 backdrop-blur z-10 flex justify-end gap-3">
                 <button class="px-5 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-white dark:hover:bg-slate-700 transition-colors" @click="$emit('close')">
                    关闭
                 </button>
                 <button class="px-5 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold shadow-sm hover:opacity-90 transition-colors flex items-center gap-2">
                    <span class="material-icons-outlined text-[18px]">refresh</span>
                    重新同步
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
  name: 'WikiSyncLogDrawer',
  props: {
    show: Boolean,
    logData: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    statusClasses() {
        if (this.logData.status === 'success') {
            return 'bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-900/30 dark:text-emerald-400'
        } else {
            return 'bg-red-50 text-red-700 ring-red-600/10 dark:bg-red-900/30 dark:text-red-400'
        }
    }
  }
}
</script>

<style scoped>
.log-scroll::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}
.log-scroll::-webkit-scrollbar-track {
    background: #1e293b; 
    border-radius: 4px;
}
.log-scroll::-webkit-scrollbar-thumb {
    background: #475569; 
    border-radius: 4px;
}
</style>
