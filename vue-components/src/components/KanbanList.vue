<template>
  <div class="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <!-- Search Bar -->
    <div class="relative rounded-md shadow-sm">
      <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
        <span class="material-icons-round text-slate-400 text-xl">search</span>
      </div>
      <input
        type="text"
        class="focus:ring-primary focus:border-primary block w-full pl-10 pr-4 py-3 sm:text-sm border-slate-300 dark:border-slate-700 dark:bg-surface-dark dark:text-white rounded-lg transition-all shadow-sm placeholder-slate-400"
        placeholder="搜索看板..."
      />
    </div>

    <!-- Filter Toolbar -->
    <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-border-light dark:border-border-dark pb-4">
      <!-- Status Tabs -->
      <div class="flex items-center space-x-1 p-1 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800/50 w-fit">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
            activeTab === tab.id
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-900/5 dark:ring-slate-500/20'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700/50'
          ]"
        >
          <span>{{ tab.label }}</span>
          <span :class="[
            'px-1.5 py-0.5 rounded-md text-xs font-semibold',
            activeTab === tab.id ? 'bg-slate-100 dark:bg-slate-600' : 'bg-transparent text-slate-400'
          ]">{{ tab.count }}</span>
        </button>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-3">
        <button class="flex items-center space-x-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
          <span class="material-icons-round text-base">sort</span>
          <span>排序</span>
        </button>
        <div class="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>
        <button class="btn btn-primary !py-1.5 !px-4 !text-xs !rounded-full shadow-sm">
          <span class="material-icons-round text-sm">add</span>
          新建看板
        </button>
      </div>
    </div>

    <!-- Kanban List -->
    <div class="space-y-4">
      <div
        v-for="kanban in filteredKanbans"
        :key="kanban.id"
        @click="$emit('select-kanban', kanban)"
        class="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 hover:shadow-soft hover:border-primary dark:hover:border-slate-600 transition-all group relative cursor-pointer"
      >
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0 mt-0.5">
            <div :class="['w-10 h-10 rounded-lg flex items-center justify-center shadow-sm', kanban.colorClass]">
              <span class="material-icons-round text-xl">{{ kanban.icon }}</span>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-1.5">
              <div class="flex items-center gap-2 pr-20">
                <h3 class="text-base font-semibold text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">
                  {{ kanban.name }}
                </h3>
              </div>
              <div class="flex items-center text-xs text-slate-400 dark:text-slate-500 space-x-4 flex-shrink-0">
                <span class="flex items-center gap-1"><span class="material-icons-round text-sm">schedule</span> {{ kanban.updatedAt }}</span>
              </div>
            </div>
            
            <div class="flex items-center text-xs text-slate-500 dark:text-slate-400 space-x-2">
              <span class="font-medium text-slate-400 dark:text-slate-500 text-[11px] uppercase tracking-wider">#{{ kanban.id }}</span>
              <span class="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700"></span>
              <template v-if="kanban.members">
                <div class="flex -space-x-1.5 overflow-hidden">
                  <img
                    v-for="(member, idx) in kanban.members"
                    :key="idx"
                    :src="member"
                    class="inline-block h-4 w-4 rounded-full ring-2 ring-white dark:ring-slate-800 shadow-sm"
                  />
                </div>
                <span class="text-slate-400 ml-1">活跃</span>
              </template>
              <div v-else class="text-slate-400">暂无活跃成员</div>
            </div>
          </div>
        </div>
        
        <!-- Hover Actions -->
        <div class="hidden group-hover:flex items-center space-x-1 absolute right-4 top-3 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 rounded-md p-1 z-10">
          <button class="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-all rounded" @click.stop="handleClose(kanban)" title="关闭看板">
            <span class="material-icons-round text-lg">close</span>
          </button>
          <button class="p-1 text-slate-400 hover:text-blue-500 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all rounded" title="预览">
            <span class="material-icons-round text-lg">visibility</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="mt-8 flex justify-center pb-4">
      <nav aria-label="Pagination" class="flex items-center space-x-1">
        <button class="relative inline-flex items-center px-3 py-2 text-xs font-bold text-slate-500 bg-white dark:bg-surface-dark dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
          <span class="material-icons-round text-sm">chevron_left</span> 上一页
        </button>
        <button class="z-10 bg-primary text-white relative inline-flex items-center px-4 py-2 text-xs font-bold rounded-md shadow-sm">1</button>
        <button class="bg-white dark:bg-surface-dark text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 relative inline-flex items-center px-4 py-2 text-xs font-bold rounded-md transition-all">2</button>
        <button class="bg-white dark:bg-surface-dark text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hidden md:inline-flex relative items-center px-4 py-2 text-xs font-bold rounded-md transition-all">3</button>
        <span class="relative inline-flex items-center px-4 py-2 text-xs font-bold text-slate-400 bg-transparent">...</span>
        <button class="bg-white dark:bg-surface-dark text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hidden md:inline-flex relative items-center px-4 py-2 text-xs font-bold rounded-md transition-all">100</button>
        <button class="relative inline-flex items-center px-3 py-2 text-xs font-bold text-slate-500 bg-white dark:bg-surface-dark dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
          下一页 <span class="material-icons-round text-sm">chevron_right</span>
        </button>
      </nav>
    </div>
    
    <p class="text-center text-[11px] font-bold text-slate-400 mt-12 mb-4 uppercase tracking-widest">AtomGit Enterprise · © 2024</p>
  </div>
</template>

<script>
export default {
  name: 'KanbanList',
  data() {
    return {
      activeTab: 'open',
      tabs: [
        { id: 'open', label: '开启中', count: 895 },
        { id: 'closed', label: '已关闭', count: 96 },
        { id: 'all', label: '全部', count: 121 }
      ],
      kanbans: [
        {
          id: 1,
          name: '核心业务端研发看板',
          icon: 'view_kanban',
          colorClass: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
          updatedAt: '1 小时前',
          status: 'open',
          members: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXu Ca7BzYBNBBWe_HAb3kAt0PiSz1-TAOCbT1hUbJgrYgPj9Cp9IgbA5wX8orbHZqrp9b8bvXgFAZ7Jl9ahsxa5NhYcwSiozPxnvMJuIQbhlHfzV4Ukz_tysjBTqIOrrO_pGliaC9r2ZkVlyLOkPWSAkJ23lxE-Kn-xJHZu9QKyz4mBqv7G8oIw_wpYTgpyzosJ-WWdS-yniwzoJxCnJgl0YTPha_jSdaK0I7bUKI_iT2iCP5uLw25Y3hVM-GXLIg9DX9cpYkIMf77wpG',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCZvvXIwgEbm4Xj6Hd_qvYzUXIiX6BVvaXs_P0fzPXXUojHrPDWNDc0g1fldZ9BvMUoDPjYp0P1nasJrQlnaiIjk81F-0FO2fyPv2eVQYyd2U10kAfIzwS_Dsm4RJh0voIbYhfSE9vDA0gY-IIxUaxAzkP4H9mXlwFrWqGe_B83IUsqFPRaSATjY5zcDJKFs9NNW6cRXKvA5Az8GLr5nuB6I81sN51fgtGaJosHK4u5zfHSWt1u3Dr5iZN6UwM6uuu17fpwpy3TJZz8',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDKsmRdFvu1M_mOlfUcZ3CZUGGl_7cWxFzGMDpZjFrziGI_1WbqnzMQBn4VPJpeNaabIeRPFjH96H5EQg_LGLN5k3kL4dKueHyxCpednPy6tRwzECut4GXCpQ_2A6QfFYaZpAq44kHU3sy6U3ubLWdxMaiyiwTWL89_ZvFflM-ReZ_jEadAzUF_GK1wOJ6bV_X-xFVWnD2RfNhjFzjwYw1iv2RWUtsFsqj86UNfTD_xu_qQfbFesieu6OwjcvpmPgtak1Xp-1xBmj6X'
          ]
        },
        {
          id: 2,
          name: '移动端 UI 改版敏捷看板',
          icon: 'view_kanban',
          colorClass: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
          updatedAt: '2 小时前',
          status: 'open'
        },
        {
          id: 3,
          name: '后端架构重构工作流',
          icon: 'view_kanban',
          colorClass: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
          updatedAt: '昨天 14:20',
          status: 'open'
        },
        {
          id: 4,
          name: '企业级组件库维护看板',
          icon: 'view_kanban',
          colorClass: 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400',
          updatedAt: '3 天前',
          status: 'closed'
        }
      ]
    }
  },
  computed: {
    filteredKanbans() {
      if (this.activeTab === 'all') return this.kanbans
      return this.kanbans.filter(k => k.status === this.activeTab)
    }
  },
  methods: {
    handleClose(kanban) {
      console.log('Close kanban:', kanban.id)
    }
  }
}
</script>
