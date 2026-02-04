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
        placeholder="搜索 Pull Requests, Issues 或用户..."
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

      <!-- Dimension Filters -->
      <div class="flex items-center flex-wrap gap-2">
        <div v-for="filter in dimensionFilters" :key="filter" class="relative group">
          <button class="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all">
            <span>{{ filter }}</span>
            <span class="material-icons-round text-sm opacity-50">expand_more</span>
          </button>
        </div>
        <div class="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>
        <button class="flex items-center space-x-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
          <span class="material-icons-round text-base">sort</span>
          <span>排序</span>
        </button>
      </div>
    </div>

    <!-- Pull Request List -->
    <div class="space-y-4">
      <div
        v-for="pr in filteredPRs"
        :key="pr.id"
        class="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 hover:shadow-soft hover:border-primary dark:hover:border-slate-600 transition-all group relative cursor-pointer"
      >
        <div class="flex items-start gap-4">
          <div class="mt-1 flex-shrink-0">
            <span
              class="material-icons-round text-xl"
              :class="statusIconColor(pr.status)"
              :title="statusTitle(pr.status)"
            >{{ statusIcon(pr.status) }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-1.5">
              <div class="flex items-center gap-2 pr-20">
                <h3 class="text-base font-semibold text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">
                  {{ pr.title }}
                </h3>
                <span
                  v-for="label in pr.labels"
                  :key="label.name"
                  :class="[
                    'px-2 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap',
                    labelClasses(label.color)
                  ]"
                >
                  {{ label.name }}
                </span>
                <span v-if="pr.verified" class="material-icons-round text-xs text-emerald-500" title="已验证">check_circle</span>
              </div>
              <div class="flex items-center text-xs text-slate-400 dark:text-slate-500 space-x-4 flex-shrink-0">
                <span class="flex items-center gap-1"><span class="material-icons-round text-sm">chat_bubble_outline</span> {{ pr.comments }}</span>
                <span class="flex items-center gap-1"><span class="material-icons-round text-sm">schedule</span> {{ pr.updatedAt }}</span>
              </div>
            </div>
            
            <div class="flex items-center text-xs text-slate-500 dark:text-slate-400 space-x-2 flex-wrap gap-y-1">
              <span class="font-mono text-slate-400 dark:text-slate-500">{{ pr.repoPath }} #{{ pr.id }}</span>
              <span class="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700"></span>
              <div class="flex items-center gap-1">
                <div :class="['w-4 h-4 rounded-full shadow-sm', pr.authorBg]"></div>
                <span>{{ pr.authorName }} {{ pr.createdAt }}创建</span>
              </div>
              <span class="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700"></span>
              <span class="font-mono text-slate-400">{{ pr.sourceBranch }}</span>
              <span class="text-slate-300 dark:text-slate-600">合并到</span>
              <span class="font-mono px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-300">{{ pr.targetBranch }}</span>
              <div class="flex items-center gap-1 ml-2">
                <span v-if="pr.additions" class="text-emerald-500 dark:text-emerald-400">+{{ pr.additions }}</span>
                <span v-if="pr.deletions" class="text-rose-500 dark:text-rose-400">-{{ pr.deletions }}</span>
              </div>
            </div>

            <div v-if="pr.description" class="mt-2">
              <p class="text-xs text-slate-400 dark:text-slate-500 truncate max-w-3xl italic">
                {{ pr.description }}
              </p>
            </div>
          </div>
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
    <p class="text-center text-[11px] font-bold text-slate-400 mt-12 mb-4 uppercase tracking-widest">AtomGit Enterprise · © 2024</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PullRequestList',
  data() {
    return {
      activeTab: 'open',
      tabs: [
        { id: 'open', label: '开启中', count: 855 },
        { id: 'merged', label: '已合并', count: 56 },
        { id: 'closed', label: '已关闭', count: 370 },
        { id: 'all', label: '全部', count: 1281 }
      ],
      dimensionFilters: ['所属组织', '所属项目', '负责人', 'Label', '里程碑'],
      pullRequests: [
        {
          id: 1,
          status: 'open',
          title: '[Bug] The issue of occupying space in the non displayed part of a semicircle',
          labels: [{ name: 'duplicate', color: 'gray' }],
          comments: 23,
          updatedAt: '12小时前',
          repoPath: 'csdn / jupyter-notebook',
          authorName: 'Anon',
          authorBg: 'bg-gradient-to-r from-blue-400 to-cyan-300',
          createdAt: '1 周前',
          sourceBranch: 'dev-haclei-test',
          targetBranch: 'main',
          additions: 1,
          deletions: 1,
          verified: false
        },
        {
          id: 2,
          status: 'merged',
          title: 'removeData',
          labels: [{ name: 'documentation', color: 'blue' }],
          comments: 23,
          updatedAt: '12小时前',
          repoPath: 'csdn / jupyter-notebook',
          authorName: 'Anon',
          authorBg: 'bg-indigo-400',
          createdAt: '1 周前',
          sourceBranch: 'dev-haclei-test',
          targetBranch: 'main',
          additions: 1,
          deletions: 1,
          verified: false
        },
        {
          id: 3,
          status: 'open',
          title: '[Bug] Heatmap in some Size show a blank space at left top',
          labels: [
            { name: 'help wanted', color: 'green' },
            { name: 'feature', color: 'green' }
          ],
          comments: 23,
          updatedAt: '12小时前',
          repoPath: 'csdn / jupyter-notebook',
          authorName: 'Anon',
          authorBg: 'bg-orange-400',
          createdAt: '1 周前',
          sourceBranch: 'dev-haclei-test',
          targetBranch: 'main',
          additions: 1,
          verified: false
        },
        {
          id: 4,
          status: 'closed',
          title: 'generation process for the first time may come into idle until I re-generate.',
          description: '[Bug] The generation process for the first time may come into idle until I re-generate. The it gives me two times of response',
          labels: [
            { name: 'bug', color: 'red' },
            { name: 'help wanted', color: 'purple' }
          ],
          comments: 23,
          updatedAt: '12小时前',
          repoPath: 'csdn / jupyter-notebook',
          authorName: 'Anon',
          authorBg: 'bg-pink-400',
          createdAt: '1 周前',
          sourceBranch: 'dev-haclei-test',
          targetBranch: 'main',
          additions: 1,
          verified: false
        },
        {
          id: 5,
          status: 'open',
          title: 'Some issues about boxplots',
          comments: 23,
          updatedAt: '12小时前',
          repoPath: 'csdn / jupyter-notebook',
          authorName: 'Anon',
          authorBg: 'bg-teal-400',
          createdAt: '1 周前',
          sourceBranch: 'dev-haclei-test',
          targetBranch: 'main',
          additions: 1,
          deletions: 1,
          verified: true
        },
        {
          id: 6,
          status: 'open',
          title: 'Some issues about boxplots and datasets',
          comments: 23,
          updatedAt: '12小时前',
          repoPath: 'csdn / jupyter-notebook',
          authorName: 'Anon',
          authorBg: 'bg-blue-500',
          createdAt: '1 周前',
          sourceBranch: 'dev-haclei-test',
          targetBranch: 'main',
          additions: 1,
          deletions: 1,
          verified: true
        }
      ]
    }
  },
  computed: {
    filteredPRs() {
      if (this.activeTab === 'all') return this.pullRequests
      return this.pullRequests.filter(pr => pr.status === this.activeTab)
    }
  },
  methods: {
    statusIcon(status) {
      if (status === 'merged') return 'merge'
      if (status === 'closed') return 'block'
      return 'merge_type'
    },
    statusIconColor(status) {
      if (status === 'merged') return 'text-purple-500'
      if (status === 'closed') return 'text-rose-500'
      return 'text-emerald-500'
    },
    statusTitle(status) {
      if (status === 'merged') return 'Merged Pull Request'
      if (status === 'closed') return 'Closed Pull Request'
      return 'Open Pull Request'
    },
    labelClasses(color) {
      const map = {
        red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800',
        orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-800',
        blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800',
        purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-800',
        green: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800',
        gray: 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-700'
      }
      return map[color] || map.gray
    }
  }
}
</script>
