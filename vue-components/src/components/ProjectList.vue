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
        placeholder="搜索项目名称、描述或语言..."
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
          <span v-if="tab.dot" :class="['w-2 h-2 rounded-full', tab.dotColor]"></span>
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

    <!-- Project List -->
    <div class="space-y-4">
      <div
        v-for="project in filteredProjects"
        :key="project.id"
        class="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-5 hover:shadow-soft hover:border-primary dark:hover:border-slate-600 transition-all group relative cursor-pointer"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1 min-w-0 pr-4">
            <div class="flex items-center mb-1.5">
              <h3 class="text-base font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors truncate max-w-2xl">
                {{ project.owner }} / {{ project.name }}
              </h3>
              <span class="ml-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                {{ project.visibilityText }}
              </span>
              <span class="ml-2 material-icons-round text-slate-400 text-sm" :title="project.visibilityText">
                {{ project.visibility === 'private' ? 'lock' : 'lock_open' }}
              </span>
            </div>
            
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-3 line-clamp-1 italic">
              {{ project.description }}
            </p>
            
            <div class="flex items-center text-xs text-slate-400 dark:text-slate-500 space-x-5">
              <div class="flex items-center">
                <span :class="['w-2.5 h-2.5 rounded-full mr-2 shadow-sm', project.langColor]"></span>
                <span class="font-medium text-slate-600 dark:text-slate-300">{{ project.language }}</span>
              </div>
              <div class="flex items-center gap-1">
                <span class="material-icons-round text-sm">star_border</span>
                <span>{{ project.stars }}</span>
              </div>
              <div class="flex items-center gap-1">
                <span class="material-icons-round text-sm">call_split</span>
                <span>{{ project.forks }}</span>
              </div>
              <div class="flex items-center gap-1">
                <span class="material-icons-round text-sm">history</span>
                <span>{{ project.commits }}</span>
              </div>
              <div class="flex items-center gap-1">
                <span class="material-icons-round text-sm">schedule</span>
                <span>{{ project.updatedAt }}更新</span>
              </div>
            </div>
          </div>
          
          <!-- Hover Actions -->
          <div class="hidden group-hover:flex items-center space-x-2 absolute right-5 top-5 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button class="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-all" title="Edit">
              <span class="material-icons-round text-lg">edit</span>
            </button>
            <button class="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-all" title="Settings">
              <span class="material-icons-round text-lg">settings</span>
            </button>
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
    </div>
    
    <p class="text-center text-[11px] font-bold text-slate-400 mt-12 mb-4 uppercase tracking-widest">AtomGit Enterprise · © 2024</p>
  </div>
</template>

<script>
export default {
  name: 'ProjectList',
  data() {
    return {
      activeTab: 'all',
      tabs: [
        { id: 'all', label: '全部', count: 65 },
        { id: 'active', label: '活跃中', count: 42, dot: true, dotColor: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' },
        { id: 'archived', label: '已归档', count: 23, dot: true, dotColor: 'bg-slate-400 shadow-[0_0_8px_rgba(148,163,184,0.4)]' }
      ],
      dimensionFilters: ['可见性', '所属组织', '项目类型'],
      projects: [
        {
          id: 1,
          owner: 'csdn',
          name: 'awesome-chatgpt-prompts-zh',
          description: 'ChatGPT 中文调教指南。各种场景使用指南。学习怎么让它听你的话。',
          visibility: 'internal',
          visibilityText: '内部',
          language: 'Java',
          langColor: 'bg-yellow-400',
          stars: 185,
          forks: '1.2k',
          commits: '22k',
          updatedAt: '1 小时前',
          status: 'active'
        },
        {
          id: 2,
          owner: 'PlexPt2',
          name: 'awesome-chatgpt-prompts-zh',
          description: 'ChatGPT 中文调教指南。各种场景使用指南。学习怎么让它听你的话。',
          visibility: 'private',
          visibilityText: '私有',
          language: 'Java',
          langColor: 'bg-yellow-400',
          stars: 185,
          forks: '1.2k',
          commits: '22k',
          updatedAt: '1 小时前',
          status: 'active'
        },
        {
          id: 3,
          owner: 'AtomGit-dev',
          name: 'oh-my-zsh',
          description: 'A delightful community-driven (with 2,100+ contributors) framework for managing your zsh configuration.',
          visibility: 'private',
          visibilityText: '私有',
          language: 'Shell',
          langColor: 'bg-blue-500',
          stars: '152k',
          forks: '24k',
          commits: '22k',
          updatedAt: '1 小时前',
          status: 'active'
        },
        {
          id: 4,
          owner: 'AtomGit-dev',
          name: 'CVE-2024-21413-Microsoft-Outlook-Remote-Code-Execution-Vulnerability',
          description: 'Microsoft Outlook 远程代码执行漏洞分析与复现环境。',
          visibility: 'private',
          visibilityText: '私有',
          language: 'Python',
          langColor: 'bg-blue-400',
          stars: 45,
          forks: 12,
          commits: 156,
          updatedAt: '昨天',
          status: 'archived'
        },
        {
          id: 5,
          owner: 'AtomGit-dev',
          name: 'UI设计',
          description: 'AtomGit 企业版设计方案与 UI 规范。',
          visibility: 'private',
          visibilityText: '私有',
          language: 'Figma',
          langColor: 'bg-rose-400',
          stars: 12,
          forks: 0,
          commits: 85,
          updatedAt: '3 天前',
          status: 'active'
        }
      ]
    }
  },
  computed: {
    filteredProjects() {
      if (this.activeTab === 'all') return this.projects
      return this.projects.filter(p => p.status === this.activeTab)
    }
  }
}
</script>
