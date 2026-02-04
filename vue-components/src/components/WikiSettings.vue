<template>
  <div class="wiki-settings space-y-6">
    <!-- Global Alerts -->
    <GlobalAlerts page-name="wiki-settings" />

    <!-- Header & Tabs -->
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-2">
       <div>
         <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">知识库同步</h1>
         <p class="text-sm text-gray-500 dark:text-gray-400">配置外部文档接口及查看同步日志。</p>
       </div>
       <div class="mt-4 md:mt-0" v-if="activeTab === 'sources'">
          <button @click="showNewModal = true" class="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-slate-900 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors shadow-sm">
            <span class="material-icons-outlined text-sm">power</span>
            接入数据源
          </button>
       </div>
    </div>

    <!-- Tab Navigation -->
    <div class="border-b border-gray-200 dark:border-gray-700 mb-6">
      <nav class="-mb-px flex space-x-6">
        <button 
            @click="activeTab = 'sources'"
            :class="activeTab === 'sources' ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
            class="border-b-2 py-2 px-1 text-sm font-medium transition-colors"
        >
          数据源配置
        </button>
        <button 
            @click="activeTab = 'logs'"
            :class="activeTab === 'logs' ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
            class="border-b-2 py-2 px-1 text-sm font-medium transition-colors"
        >
          同步日志
        </button>
      </nav>
    </div>

    <!-- Tab Content: Data Sources -->
    <div v-if="activeTab === 'sources'" class="space-y-4">
        <div v-if="dataSources.length === 0" class="text-center py-12 bg-white dark:bg-surface-dark rounded-lg border border-gray-200 dark:border-gray-700">
             <span class="material-icons-outlined text-gray-300 text-6xl mb-4">cloud_off</span>
             <p class="text-gray-500 dark:text-gray-400">暂无数据源，请点击上方按钮接入</p>
        </div>
        
        <div v-for="source in dataSources" :key="source.id" class="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg p-5 flex items-center justify-between hover:shadow-sm transition-shadow">
            <div class="flex items-center">
                <div class="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mr-4 border border-blue-100 dark:border-blue-800 text-blue-500 dark:text-blue-400">
                    <span class="material-icons-outlined text-2xl">menu_book</span>
                </div>
                <div>
                    <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-1">{{ source.name }}</h3>
                    <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 font-mono">
                        {{ source.url }}
                    </div>
                </div>
            </div>
            <div class="flex items-center gap-4">
                 <div class="relative flex items-center justify-center w-6 h-6" title="Running">
                    <div class="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                    <div class="absolute w-full h-full bg-green-500 rounded-full opacity-0 animate-ping"></div>
                </div>
                <button class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <span class="material-icons-outlined">more_vert</span>
                </button>
            </div>
        </div>
    </div>

    <!-- Tab Content: Sync Logs -->
    <div v-if="activeTab === 'logs'" class="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm flex flex-col">
        <!-- Filters -->
        <div class="p-5 border-b border-gray-200 dark:border-gray-700 flex flex-wrap items-end gap-4">
            <div class="flex flex-col gap-1.5 min-w-[200px]">
                <label class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">数据源</label>
                <div class="relative">
                    <select class="w-full appearance-none rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 h-10 px-3 pr-8 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900">
                        <option value="">全部来源</option>
                        <option value="wiki">企业 Wiki</option>
                    </select>
                     <span class="material-icons-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-lg">expand_more</span>
                </div>
            </div>
            <div class="flex flex-col gap-1.5 h-10 justify-end ml-auto">
                 <button class="h-10 px-6 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-slate-900 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 shadow-sm">
                    <span class="material-icons-outlined text-sm">search</span>
                    筛选
                 </button>
            </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead class="bg-gray-50 dark:bg-gray-800/50">
                    <tr>
                        <th class="py-3 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">同步任务</th>
                        <th class="py-3 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">开始时间</th>
                        <th class="py-3 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">结果</th>
                        <th class="py-3 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">条数</th>
                        <th class="py-3 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">操作</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-for="log in logs" :key="log.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td class="py-4 px-6">
                            <div class="flex items-center gap-3">
                                <div :class="log.iconBg" class="p-2 rounded-lg">
                                    <span class="material-icons-outlined text-lg" :class="log.iconColor">{{ log.icon }}</span>
                                </div>
                                <div>
                                    <p class="text-sm font-medium text-gray-900 dark:text-white">{{ log.taskName }}</p>
                                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ log.source }}</p>
                                </div>
                            </div>
                        </td>
                        <td class="py-4 px-6 text-sm text-gray-500 dark:text-gray-400">{{ log.startTime }}</td>
                        <td class="py-4 px-6">
                            <span :class="log.status === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/30 dark:text-red-400'" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border">
                                <span class="w-1.5 h-1.5 rounded-full" :class="log.status === 'success' ? 'bg-emerald-500' : 'bg-red-500'"></span>
                                {{ log.status === 'success' ? '成功' : '失败' }}
                            </span>
                        </td>
                        <td class="py-4 px-6 text-sm text-gray-900 dark:text-white text-right font-medium">{{ log.count }}</td>
                        <td class="py-4 px-6 text-right">
                            <button @click="openLogDrawer(log)" class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium inline-flex items-center gap-1">
                                查看详情
                                <span class="material-icons-outlined text-sm">arrow_forward</span>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- Pagination (simplified) -->
        <div class="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
             <div class="text-sm text-gray-500 dark:text-gray-400">显示 1 到 4 条，共 4 条记录</div>
             <div class="flex gap-2">
                 <button class="w-8 h-8 flex items-center justify-center rounded border border-gray-300 dark:border-gray-600 text-gray-500" disabled><span class="material-icons-outlined text-sm">chevron_left</span></button>
                 <button class="w-8 h-8 flex items-center justify-center rounded bg-slate-900 text-white text-sm">1</button>
                 <button class="w-8 h-8 flex items-center justify-center rounded border border-gray-300 dark:border-gray-600 text-gray-500"><span class="material-icons-outlined text-sm">chevron_right</span></button>
             </div>
        </div>
    </div>

    <!-- Modals & Drawers -->
    <NewWikiModal :show="showNewModal" @close="showNewModal = false" @submit="handleAddDataSource" />
    <WikiSyncLogDrawer :show="showLogDrawer" :log-data="selectedLog" @close="showLogDrawer = false" />
  </div>
</template>

<script>
import NewWikiModal from './NewWikiModal.vue'
import WikiSyncLogDrawer from './WikiSyncLogDrawer.vue'
import GlobalAlerts from './GlobalAlerts.vue'

export default {
  name: 'WikiSettings',
  components: { 
    NewWikiModal, 
    WikiSyncLogDrawer,
    GlobalAlerts
  },
  data() {
    return {
      activeTab: 'sources',
      showNewModal: false,
      showLogDrawer: false,
      selectedLog: {},
      dataSources: [
        {
          id: 1,
          name: '企业内部 Wiki',
          url: 'https://wiki.internal.corp',
          type: 'wiki'
        }
      ],
      logs: [
        {
          id: 'SYNC_001',
          taskName: 'Enterprise Wiki Sync',
          source: 'Source: Internal Confluence',
          icon: 'article',
          iconBg: 'bg-blue-50 text-blue-600',
          iconColor: 'text-blue-600',
          startTime: '2023-10-27 10:00:00',
          status: 'success',
          count: 120
        },
        {
          id: 'SYNC_002',
          taskName: 'Design Assets Backup',
          source: 'Source: Shared Drive',
          icon: 'folder_zip',
          iconBg: 'bg-purple-50 text-purple-600',
          iconColor: 'text-purple-600',
          startTime: '2023-10-27 09:00:00',
          status: 'fail',
          count: 0
        },
        {
            id: 'SYNC_003',
            taskName: 'API Specifications',
            source: 'Source: SwaggerHub',
            icon: 'api',
            iconBg: 'bg-orange-50 text-orange-600',
            iconColor: 'text-orange-600',
            startTime: '2023-10-26 14:30:00',
            status: 'success',
            count: 45
        },
        {
            id: 'SYNC_004',
            taskName: 'Infrastructure Configs',
            source: 'Source: GitHub Enterprise',
            icon: 'terminal',
            iconBg: 'bg-teal-50 text-teal-600',
            iconColor: 'text-teal-600',
            startTime: '2023-10-26 08:30:00',
            status: 'success',
            count: 12
        }
      ]
    }
  },
  methods: {
    handleAddDataSource(data) {
      this.dataSources.push({
        id: Date.now(),
        name: data.name,
        url: data.url,
        type: data.type
      })
      this.activeTab = 'sources'
    },
    openLogDrawer(log) {
      this.selectedLog = log
      this.showLogDrawer = true
    }
  }
}
</script>
