<template>
  <div class="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <!-- View Selector & Title Header -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
      <div class="space-y-4">
        <div class="flex items-center gap-4">
          <ViewSelector :selected-view="internalSelectedView" @change="handleViewChange" />
          <div class="w-px h-8 bg-slate-200 dark:bg-slate-800"></div>
          <div>
            <h1 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight" style="margin-bottom: 0px;">开源合规 (Compliance)</h1>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <button class="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-black uppercase tracking-widest hover:border-primary/50 transition-all shadow-sm group">
          <span class="material-icons-round text-slate-400 group-hover:text-primary transition-colors">settings</span>
          通用合规设置
        </button>
      </div>
    </div>

    <!-- Info Banner -->
    <AlertBanner
      v-model="showInfoBanner"
      type="info"
      title="合规提示"
      icon="gpp_good"
      :dismissible="false"
    >
      管理企业内部及开源项目的 CLA 签署与 DCO 认证，有效降低知识产权合规法律风险。
    </AlertBanner>

    <!-- Toggle Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- CLA Card -->
      <div class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm group transition-all hover:scale-[1.01]">
        <div class="flex justify-between items-start mb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <span class="material-icons-round">edit_document</span>
            </div>
            <div>
              <h3 class="text-lg font-black text-slate-900 dark:text-white tracking-tight">CLA 协议签署</h3>
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Contributor License Agreement</p>
            </div>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="claEnabled" class="sr-only peer">
            <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary transition-colors"></div>
          </label>
        </div>
        <p class="text-sm text-slate-600 dark:text-slate-400 font-medium mb-6">
          开启后，强制外部贡献者在提交 PR 前必须签署企业指定的法律协议。
        </p>
        <div class="flex flex-col gap-3">
          <div class="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
            <span>签署回调 Hook</span>
            <button class="text-primary hover:underline">复制</button>
          </div>
          <div class="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-xl p-3 flex items-center group/code">
            <span class="text-[9px] bg-slate-200 dark:bg-slate-700 text-slate-500 font-black px-1.5 py-0.5 rounded mr-3 uppercase select-none">Auth</span>
            <code class="text-xs font-mono text-slate-600 dark:text-slate-300 truncate tracking-tight">https://cla.atomgit.com/v1/verify/ent-921</code>
          </div>
        </div>
      </div>

      <!-- DCO Card -->
      <div class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm group transition-all hover:scale-[1.01]">
        <div class="flex justify-between items-start mb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <span class="material-icons-round">verified</span>
            </div>
            <div>
              <h3 class="text-lg font-black text-slate-900 dark:text-white tracking-tight">DCO 原创认证</h3>
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Developer Certificate of Origin</p>
            </div>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="dcoEnabled" class="sr-only peer">
            <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-amber-500 transition-colors"></div>
          </label>
        </div>
        <p class="text-sm text-slate-600 dark:text-slate-400 font-medium mb-6">
          要求所有 Commit 必须包含 <code>Signed-off-by</code> 签名，以确认代码来源真实。
        </p>
        <div class="bg-amber-50/50 dark:bg-amber-900/10 p-4 rounded-xl border border-dashed border-amber-200 dark:border-amber-900/40">
          <div class="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-1">
            <span class="material-icons-round text-sm">lightbulb</span>
            <span class="text-[10px] font-black uppercase tracking-widest">Best Practice</span>
          </div>
          <p class="text-[11px] font-medium text-amber-700 dark:text-amber-300 leading-relaxed">
            建议在大型开源组件镜像或涉及核心算法的项目上强制启用 DCO。
          </p>
        </div>
      </div>
    </div>

    <!-- Recent Records Table -->
    <div class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden group">
      <div class="px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-900/50">
        <h3 class="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">最近签署记录 · Signing Logs</h3>
        <div class="flex items-center gap-2">
          <button class="text-[10px] font-black text-primary uppercase tracking-widest hover:underline transition-all">
            管理所有签署人
          </button>
        </div>
      </div>
      <div class="overflow-x-auto custom-scrollbar">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 dark:border-slate-800">
              <th class="px-8 py-5">签署用户 · Contributor</th>
              <th class="px-8 py-5">电子邮箱 · Email</th>
              <th class="px-8 py-5">签署类型 · Type</th>
              <th class="px-8 py-5 text-right">签署时间 · Time</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 dark:divide-slate-800">
            <tr v-for="log in signingLogs" :key="log.id" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors group/row">
              <td class="px-8 py-6">
                <div class="flex items-center gap-3">
                  <div :class="['w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-black shadow-sm', log.avatarColor]">
                    {{ log.user.charAt(0).toUpperCase() }}
                  </div>
                  <div class="flex flex-col">
                    <span class="text-sm font-black text-slate-900 dark:text-white tracking-tight">{{ log.user }}</span>
                    <span class="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Verified Profile</span>
                  </div>
                </div>
              </td>
              <td class="px-8 py-6">
                <span class="text-xs font-bold text-slate-500 font-mono">{{ log.email }}</span>
              </td>
              <td class="px-8 py-6">
                <div class="flex items-center gap-2">
                  <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                  <span class="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">{{ log.type }}</span>
                </div>
              </td>
              <td class="px-8 py-6 text-right">
                <span class="text-[11px] font-black text-slate-400 tracking-tighter">{{ log.time }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import ViewSelector from './ViewSelector.vue'
import AlertBanner from './AlertBanner.vue'

export default {
  name: 'ClaCompliance',
  components: {
    ViewSelector,
    AlertBanner
  },
  props: {
    selectedView: {
      type: Object,
      default: () => ({ id: 'enterprise', label: '全企业视图 (Enterprise)', orgId: 'enterprise' })
    }
  },
  data() {
    return {
      showInfoBanner: true,
      claEnabled: true,
      dcoEnabled: false,
      internalSelectedView: this.selectedView || { id: 'enterprise', label: '全企业视图 (Enterprise)', orgId: 'enterprise' },
      signingLogs: [
        { id: 1, user: 'miykael_dev', email: 'miykael@gitcode.com', type: 'CLA Signed', time: '2 mins ago', avatarColor: 'bg-primary' },
        { id: 2, user: 'zhang_san', email: 'san.zhang@corp.com', type: 'CLA Signed', time: '45 mins ago', avatarColor: 'bg-blue-500' },
        { id: 3, user: 'external_contributor', email: 'ext@github.com', type: 'DCO Verified', time: '2 hours ago', avatarColor: 'bg-slate-700' },
        { id: 4, user: 'li_si_test', email: 'lisi@alibaba-inc.com', type: 'CLA Signed', time: '1 day ago', avatarColor: 'bg-indigo-500' }
      ]
    }
  },
  methods: {
    handleViewChange(view) {
      this.internalSelectedView = view
      this.$emit('view-change', view)
    }
  },
  watch: {
    selectedView: {
      handler(newVal) {
        if (newVal) this.internalSelectedView = newVal
      },
      deep: true
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
