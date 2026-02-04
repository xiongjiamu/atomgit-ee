<template>
  <div class="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <!-- Breadcrumbs & Breadcrumb-like Header -->
    <!-- View Selector & Header -->
    <div class="flex items-center justify-between mb-4">
      <ViewSelector :selected-view="selectedView" @change="$emit('view-change', $event)" />
      <div class="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest bg-slate-50 dark:bg-slate-800/40 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800/60">
        <span class="material-icons-round text-sm">schedule</span>
        最近 24 小时运行记录
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

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="stat in stats" :key="stat.label" :class="['p-5 rounded-xl border transition-all duration-300', stat.bgClass, stat.borderClass]">
        <p :class="['text-xs font-black uppercase mb-1 tracking-widest', stat.labelClass]">{{ stat.label }}</p>
        <div class="flex items-baseline gap-2">
          <span class="text-3xl font-black text-slate-900 dark:text-white">{{ stat.value }}</span>
          <span v-if="stat.percent" :class="['text-xs font-bold', stat.labelClass]">{{ stat.percent }}</span>
        </div>
      </div>
    </div>

    <!-- Main Content Table Card -->
    <div class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <div class="p-6 border-b border-slate-100 dark:border-slate-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex flex-1 items-center gap-3">
          <div class="relative flex-1 max-w-md group">
            <span class="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
            <input 
              type="text" 
              class="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-900 dark:text-white"
              placeholder="搜索工作流名称、Commit SHA 或 分支..."
            />
          </div>
          <button class="flex items-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
            <span>所有状态</span>
            <span class="material-icons-round text-lg">expand_more</span>
          </button>
        </div>

      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 dark:bg-slate-800/30 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 dark:border-slate-800">
              <th class="px-6 py-4">状态 (Status)</th>
              <th class="px-6 py-4">工作流名称</th>
              <th class="px-6 py-4">作用域 (Scope)</th>
              <th class="px-6 py-4">触发者</th>
              <th class="px-6 py-4">运行时长</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr v-for="record in records" :key="record.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
              <td class="px-6 py-5">
                <div class="flex items-center gap-3">
                  <span :class="['material-icons-round text-xl', record.statusIconColor]">{{ record.statusIcon }}</span>
                  <span :class="['text-sm font-bold', record.statusTextColor]">#{{ record.id }} {{ record.status }}</span>
                </div>
              </td>
              <td class="px-6 py-5">
                <div class="flex flex-col">
                  <span class="text-sm font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors tracking-tight">{{ record.workflow }}</span>
                  <span class="text-[11px] text-slate-400 font-medium mt-1 inline-flex items-center gap-1">
                    <span class="material-icons-round text-xs">commit</span>
                    {{ record.commit }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-5">
                <span class="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-black rounded-lg border border-slate-200 dark:border-slate-700 uppercase tracking-wider">
                  {{ record.scope }}
                </span>
              </td>
              <td class="px-6 py-5">
                <div class="flex items-center gap-2">
                  <div :class="['w-7 h-7 rounded-xl flex items-center justify-center text-[10px] font-black text-white shadow-sm', record.avatarBg]">
                    {{ record.initials }}
                  </div>
                  <span class="text-xs font-bold text-slate-700 dark:text-slate-300">{{ record.author }}</span>
                </div>
              </td>
              <td class="px-6 py-5">
                <div class="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-mono text-xs font-bold">
                  <span class="material-icons-round text-sm opacity-50">timer</span>
                  {{ record.duration }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-5 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
          Showing <span class="text-slate-900 dark:text-white">1 - 10</span> of <span class="text-slate-900 dark:text-white">2,480</span> entries
        </p>
        <div class="flex items-center gap-2">
          <button class="p-2 rounded-xl text-slate-300 cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
            <span class="material-icons-round">chevron_left</span>
          </button>
          <div class="flex items-center gap-1">
            <button class="w-8 h-8 rounded-xl bg-primary text-white text-xs font-black shadow-lg shadow-primary/25">1</button>
            <button class="w-8 h-8 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-black transition-all">2</button>
            <button class="w-8 h-8 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-black transition-all">3</button>
          </div>
          <button class="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
            <span class="material-icons-round">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ViewSelector from './ViewSelector.vue'

export default {
  name: 'ExecutionRecord',
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
      stats: [
        { 
          label: '今日成功', 
          value: '1,248', 
          percent: '98.2%', 
          bgClass: 'bg-emerald-50/50 dark:bg-emerald-900/10', 
          borderClass: 'border-emerald-100 dark:border-emerald-900/20',
          labelClass: 'text-emerald-600 dark:text-emerald-400'
        },
        { 
          label: '今日失败', 
          value: '24', 
          percent: '1.8%', 
          bgClass: 'bg-rose-50/50 dark:bg-rose-900/10', 
          borderClass: 'border-rose-100 dark:border-rose-900/20',
          labelClass: 'text-rose-600 dark:text-rose-400'
        },
        { 
          label: '正在运行', 
          value: '12', 
          bgClass: 'bg-blue-50/50 dark:bg-blue-900/10', 
          borderClass: 'border-blue-100 dark:border-blue-900/20',
          labelClass: 'text-blue-600 dark:text-blue-400'
        },
        { 
          label: '平均时长', 
          value: '4m 12s', 
          bgClass: 'bg-indigo-50/50 dark:bg-indigo-900/10', 
          borderClass: 'border-indigo-100 dark:border-indigo-900/20',
          labelClass: 'text-indigo-600 dark:text-indigo-400'
        }
      ],
      records: [
        {
          id: '241',
          status: 'Success',
          statusIcon: 'check_circle',
          statusIconColor: 'text-emerald-500',
          statusTextColor: 'text-emerald-600 dark:text-emerald-400',
          workflow: 'Deploy-Production',
          commit: 'feat: 新增支付网关 (4a2b1c8)',
          scope: 'AtomGit-Core',
          author: 'Li Zhang',
          initials: 'LZ',
          avatarBg: 'bg-blue-500',
          duration: '4m 12s'
        },
        {
          id: '240',
          status: 'Failure',
          statusIcon: 'cancel',
          statusIconColor: 'text-rose-500',
          statusTextColor: 'text-rose-600 dark:text-rose-400',
          workflow: 'Unit-Test-Suite',
          commit: 'fix: 修复同步逻辑 Bug (8f1e2d3)',
          scope: 'Frontend',
          author: 'Wang Wu',
          initials: 'WW',
          avatarBg: 'bg-slate-600',
          duration: '1m 05s'
        },
        {
          id: '239',
          status: 'Success',
          statusIcon: 'check_circle',
          statusIconColor: 'text-emerald-500',
          statusTextColor: 'text-emerald-600 dark:text-emerald-400',
          workflow: 'Build-Docker-Image',
          commit: 'chore: 更新依赖项 (d9c8b7a)',
          scope: 'Infrastructure',
          author: 'Sun Chao',
          initials: 'SC',
          avatarBg: 'bg-indigo-500',
          duration: '2m 45s'
        }
      ]
    }
  }
}
</script>
