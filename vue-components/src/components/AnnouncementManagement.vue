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

    <!-- Announcement List -->
    <div class="space-y-4">
      <div v-if="announcements.length === 0" class="text-center py-12 bg-white dark:bg-surface-dark rounded-lg border border-gray-200 dark:border-gray-700">
        <span class="material-icons-outlined text-gray-300 text-6xl mb-4">notifications_off</span>
        <p class="text-gray-500 dark:text-gray-400">暂无发布的公告</p>
      </div>
      
      <div 
        v-for="item in announcements" 
        :key="item.id" 
        class="border border-blue-200 dark:border-blue-900 bg-white dark:bg-surface-dark rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <span v-if="item.isTop" class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-500 text-white">
                置顶
              </span>
              <h2 class="text-base font-semibold text-gray-900 dark:text-white">
                {{ item.title }}
              </h2>
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-300 mt-2">
              {{ item.content || '暂无内容预览' }}
            </div>
            <div class="flex items-center gap-4 mt-4 text-xs text-gray-400 dark:text-gray-500">
              <span>发布人: {{ item.author || 'Admin' }}</span>
              <span>{{ item.time || '刚刚' }}</span>
            </div>
          </div>
          <div class="ml-4">
            <button 
              class="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 text-sm"
              @click="retractAnnouncement(item.id)"
            >
              撤回
            </button>
          </div>
        </div>
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
      announcements: [
        {
          id: 1,
          title: '系统维护通知',
          content: '预计停机时间：周六 02:00 ~ 04:00。',
          author: 'Admin',
          time: '2小时前',
          isTop: true
        }
      ]
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
