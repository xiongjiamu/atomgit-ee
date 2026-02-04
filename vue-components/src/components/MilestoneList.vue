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
        placeholder="搜索里程碑标题或内容..."
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
          <span class="material-icons-round text-base">filter_list</span>
          <span>更多筛选</span>
        </button>
        <div class="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>
        <button class="btn btn-primary !py-1.5 !px-4 !text-xs !rounded-full shadow-sm">
          <span class="material-icons-round text-sm">add_circle_outline</span>
          新建里程碑
        </button>
      </div>
    </div>

    <!-- Milestone List -->
    <div class="space-y-4">
      <div
        v-for="milestone in filteredMilestones"
        :key="milestone.id"
        class="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-5 hover:shadow-soft hover:border-primary dark:hover:border-slate-600 transition-all group relative cursor-pointer"
      >
        <div class="flex flex-col md:flex-row md:items-center gap-6">
          <!-- Main Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center mb-1.5">
              <span class="material-icons-round text-primary mr-2 text-xl">flag</span>
              <h3 class="text-base font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors truncate max-w-2xl">
                {{ milestone.title }}
              </h3>
              <span :class="[
                'ml-3 px-2 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap',
                statusClasses(milestone.status)
              ]">
                {{ milestone.statusLabel }}
              </span>
            </div>
            
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-3 line-clamp-1 italic">
              {{ milestone.description }}
            </p>
            
            <div class="flex items-center text-xs text-slate-400 dark:text-slate-500 space-x-5">
              <div class="flex items-center gap-1.5">
                <span class="material-icons-round text-sm">event</span>
                <span>截止于 {{ milestone.dueDate }}</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="material-icons-round text-sm">account_tree</span>
                <span>关联项目 {{ milestone.linkedProjects }}</span>
              </div>
            </div>
          </div>

          <!-- Progress Section -->
          <div class="w-full md:w-64 space-y-2 flex-shrink-0">
            <div class="flex justify-between items-center text-[11px] font-bold">
              <span class="text-slate-400 uppercase tracking-wider">总体进度</span>
              <div class="space-x-2">
                <span class="text-slate-900 dark:text-white">{{ milestone.progress }}%</span>
                <span class="text-primary">{{ milestone.completedIssues }}/{{ milestone.totalIssues }} Issues</span>
              </div>
            </div>
            <div class="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
              <div 
                class="bg-primary h-full rounded-full transition-all duration-1000 ease-out" 
                :style="{ width: milestone.progress + '%' }"
              ></div>
            </div>
          </div>
          
          <!-- Hover Actions -->
          <div class="hidden group-hover:flex items-center space-x-1 absolute right-5 top-5 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button class="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-all" title="Edit">
              <span class="material-icons-round text-lg">edit</span>
            </button>
            <button class="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-all" title="Details">
              <span class="material-icons-round text-lg">arrow_forward</span>
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
        <span class="relative inline-flex items-center px-4 py-2 text-xs font-bold text-slate-400 bg-transparent">...</span>
        <button class="bg-white dark:bg-surface-dark text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hidden md:inline-flex relative items-center px-4 py-2 text-xs font-bold rounded-md transition-all">10</button>
        <button class="relative inline-flex items-center px-3 py-2 text-xs font-bold text-slate-500 bg-white dark:bg-surface-dark dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
          下一页 <span class="material-icons-round text-sm">chevron_right</span>
        </button>
      </nav>
    </div>
    
    <p class="text-center text-xs text-slate-400 mt-6 mb-4">AtomGit © 2024</p>
  </div>
</template>

<script>
export default {
  name: 'MilestoneList',
  data() {
    return {
      activeTab: 'active',
      tabs: [
        { id: 'active', label: '进行中', count: 4 },
        { id: 'completed', label: '已完成', count: 8 },
        { id: 'all', label: '全部', count: 12 }
      ],
      milestones: [
        {
          id: 1,
          title: '2024 Q1 核心架构升级',
          description: '全面升级企业级核心组件，包含数据库连接池优化、微服务治理框架更新，提升整体并发处理能力。',
          status: 'active',
          statusLabel: '进行中',
          dueDate: '2024-03-31',
          linkedProjects: 8,
          progress: 65,
          completedIssues: 12,
          totalIssues: 18
        },
        {
          id: 2,
          title: '移动端 2.0 版本发布计划',
          description: 'iOS 与 Android 客户端大版本更新，重点优化暗色模式表现，并重构核心交互引擎，适配触控反馈。',
          status: 'active',
          statusLabel: '进行中',
          dueDate: '2024-04-15',
          linkedProjects: 3,
          progress: 28,
          completedIssues: 5,
          totalIssues: 18
        },
        {
          id: 3,
          title: '安全合规性年度审计',
          description: '针对企业所有私有化部署的代码库进行安全扫描与漏洞修复，确保符合 ISO27001 信息安全管理规范。',
          status: 'active',
          statusLabel: '进行中',
          dueDate: '2024-05-30',
          linkedProjects: 42,
          progress: 12,
          completedIssues: 18,
          totalIssues: 150
        },
        {
          id: 4,
          title: '开发者门户 (DevPortal) 上线',
          description: '全新的内部开发者门户网站，集成 API 文档自动化生成与权限自助申请流程，降低跨团队沟通成本。',
          status: 'active',
          statusLabel: '进行中',
          dueDate: '2024-06-20',
          linkedProjects: 5,
          progress: 82,
          completedIssues: 24,
          totalIssues: 29
        }
      ]
    }
  },
  computed: {
    filteredMilestones() {
      if (this.activeTab === 'all') return this.milestones
      return this.milestones.filter(m => m.status === (this.activeTab === 'active' ? 'active' : 'completed'))
    }
  },
  methods: {
    statusClasses(status) {
      if (status === 'completed') {
        return 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800'
      }
      return 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800'
    }
  }
}
</script>
