<template>
  <div class="announcement-management space-y-6">
    <!-- Alerts (Unified Style) -->
    <div class="space-y-3 mb-6">
      <div v-if="showResourceAlert" class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md p-3 flex items-start gap-3">
        <span class="material-icons-outlined text-amber-600 dark:text-amber-500 text-lg mt-0.5">warning</span>
        <div class="flex-1 text-sm text-amber-800 dark:text-amber-400">
          <span class="font-bold">资源预警：</span> 您企业当前的存储空间已使用 856GB (85%)，接近包年套餐上限，请关注资源消耗或及时扩容
        </div>
        <button 
          class="text-amber-600 dark:text-amber-400 hover:opacity-75 transition-opacity"
          @click="showResourceAlert = false"
        >
          <span class="material-icons-outlined text-lg">close</span>
        </button>
      </div>

      <div v-if="showAnnouncementAlert" class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3 flex items-start gap-3">
        <span class="material-icons-outlined text-blue-600 dark:text-blue-400 text-lg mt-0.5">info</span>
        <div class="flex-1 text-sm text-blue-800 dark:text-blue-400">
          <span class="font-bold">企业公告：</span> AtomGit 将于本周五 22:00 进行版本升级，届时 CI/CD 服务会有短时闪断，请知悉
        </div>
        <button 
          class="text-blue-600 dark:text-blue-400 hover:opacity-75 transition-opacity"
          @click="showAnnouncementAlert = false"
        >
          <span class="material-icons-outlined text-lg">close</span>
        </button>
      </div>
    </div>

    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">企业公告管理</h1>
      <button 
        class="bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
        @click="showNewModal = true"
      >
        <span class="material-icons-outlined text-[18px]">add</span>
        发布新公告
      </button>
    </div>

    <!-- Filter Bar -->
    <div class="bg-white dark:bg-surface-dark p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-wrap gap-4 items-end shadow-sm mb-6">
      <div class="flex-1 min-w-[240px]">
        <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">关键词搜索</label>
        <div class="relative">
          <span class="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="搜索公告标题或内容..." 
            class="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all outline-none text-gray-900 dark:text-white"
          />
        </div>
      </div>
      <div class="w-48">
        <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">公告状态</label>
        <select 
          v-model="statusFilter" 
          class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all outline-none text-gray-900 dark:text-white"
        >
          <option value="all">全部状态</option>
          <option value="effective">生效中</option>
          <option value="top">仅置顶</option>
        </select>
      </div>
    </div>

    <!-- Announcement List -->
    <div class="space-y-4">
      <div v-if="filteredAnnouncements.length === 0" class="text-center py-12 bg-white dark:bg-surface-dark rounded-lg border border-gray-200 dark:border-gray-700">
        <span class="material-icons-outlined text-gray-300 text-6xl mb-4">notifications_off</span>
        <p class="text-gray-500 dark:text-gray-400">未找到符合条件的公告</p>
      </div>
      
      <div 
        v-for="item in filteredAnnouncements" 
        :key="item.id" 
        class="border border-blue-200 dark:border-blue-900 bg-white dark:bg-surface-dark rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden"
      >
        <!-- Status Indicator -->
        <div class="absolute top-0 left-0 w-1 h-full bg-blue-500" v-if="item.isTop"></div>
        
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <span v-if="item.isTop" class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-black bg-blue-500 text-white uppercase">
                置顶
              </span>
              <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 uppercase">
                生效中
              </span>
              <h2 class="text-base font-bold text-gray-900 dark:text-white">
                {{ item.title }}
              </h2>
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
              {{ item.content || '暂无内容预览' }}
            </div>
            <div class="flex items-center gap-4 mt-4 text-xs text-gray-400 dark:text-gray-500">
              <span class="flex items-center gap-1">
                <span class="material-icons-outlined text-xs">person</span>
                {{ item.author || 'Admin' }}
              </span>
              <span class="flex items-center gap-1">
                <span class="material-icons-outlined text-xs">schedule</span>
                {{ item.time || '刚刚' }}
              </span>
            </div>
          </div>
          <div class="ml-4">
            <button 
              class="text-slate-400 hover:text-red-500 dark:hover:text-red-400 text-sm font-bold flex items-center gap-1 transition-colors"
              @click="retractAnnouncement(item.id)"
            >
              <span class="material-icons-outlined text-sm">undo</span>
              撤回
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between mt-8 px-2" v-if="filteredAnnouncements.length > 0">
      <p class="text-xs font-bold text-slate-400 uppercase">共 {{ filteredAnnouncements.length }} 条记录</p>
      <div class="flex items-center gap-2">
        <button class="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 transition-all" disabled>
          <span class="material-icons-outlined text-sm">chevron_left</span>
        </button>
        <button class="w-8 h-8 rounded-lg bg-slate-900 text-white text-xs font-bold shadow-lg shadow-slate-200 dark:shadow-none">1</button>
        <button class="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
          <span class="material-icons-outlined text-sm">chevron_right</span>
        </button>
      </div>
    </div>

    <NewAnnouncementModal :show="showNewModal" @close="showNewModal = false" @submit="handleAddAnnouncement" />
  </div>
</template>

<script>
import NewAnnouncementModal from './NewAnnouncementModal.vue'

export default {
  name: 'AnnouncementManagement',
  components: { NewAnnouncementModal },
  data() {
    return {
      showResourceAlert: true,
      showAnnouncementAlert: true,
      showNewModal: false,
      searchQuery: '',
      statusFilter: 'all',
      announcements: [
        {
          id: 1,
          title: '系统维护通知',
          content: '预计停机时间：周六 02:00 ~ 04:00。届时所有存储服务将不可用。',
          author: '系统管理员',
          time: '2小时前',
          isTop: true
        },
        {
          id: 2,
          title: '新年假期服务支持安排',
          content: '新年期间人工客服在线时间调整为 10:00 - 18:00，紧急需求请提交工单。',
          author: '运营团队',
          time: '1天前',
          isTop: false
        },
        {
          id: 3,
          title: 'AtomGit 2.4 版本更新说明',
          content: '本次更新引入了全新的流水线设计引擎和多集群部署支持。',
          author: '产品团队',
          time: '3天前',
          isTop: false
        },
        {
          id: 4,
          title: '欢迎新企业级功能上线',
          content: '我们新增了 IP 白名单和审计日志功能，让您的代码资产更安全。',
          author: 'Admin',
          time: '1周前',
          isTop: true
        }
      ]
    }
  },
  computed: {
    filteredAnnouncements() {
      return this.announcements.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
                             item.content.toLowerCase().includes(this.searchQuery.toLowerCase())
        const matchesStatus = this.statusFilter === 'all' || 
                             (this.statusFilter === 'top' && item.isTop) ||
                             (this.statusFilter === 'effective') // All mock current are effective
        return matchesSearch && matchesStatus
      })
    }
  },
  methods: {
    handleAddAnnouncement(data) {
      this.announcements.unshift({
        id: data.id,
        title: data.title,
        content: data.content || '无内容预览',
        author: 'Admin',
        time: '刚刚',
        isTop: data.isTop
      })
    },
    retractAnnouncement(id) {
      if(confirm('确认撤回此公告吗？')) {
        this.announcements = this.announcements.filter(item => item.id !== id)
      }
    }
  }
}
</script>
