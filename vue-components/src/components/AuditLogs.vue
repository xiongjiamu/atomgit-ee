<template>
  <div class="audit-logs space-y-6">
    <!-- Global Alerts -->
    <GlobalAlerts page-name="audit-logs" />

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">审计日志</h1>
      <button class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-colors">
        <span class="material-icons-outlined text-lg mr-2">download</span>
        导出 CSV
      </button>
    </div>

    <!-- Filters -->
    <div class="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-wrap gap-4 items-end">
      <div class="flex-1 min-w-[200px]">
        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">用户</label>
        <div class="relative">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span class="material-icons-outlined text-gray-400 text-sm">person_search</span>
          </span>
          <input 
            type="text" 
            placeholder="搜索用户..." 
            class="block w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 sm:text-sm transition-colors"
          />
        </div>
      </div>
      <div class="w-full sm:w-auto min-w-[200px]">
        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">操作类型</label>
        <select class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
          <option>所有操作</option>
          <option>登录/登出</option>
          <option>设置更新</option>
          <option>组织变动</option>
          <option>权限修改</option>
        </select>
      </div>
      <div class="w-full sm:w-auto">
        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">操作时间</label>
        <div class="relative rounded-md shadow-sm">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span class="material-icons-outlined text-gray-400 text-sm">calendar_today</span>
          </div>
          <input 
            type="date" 
            class="focus:ring-rose-500 focus:border-rose-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2"
          />
        </div>
      </div>
      <div class="w-full sm:w-auto pb-[1px]">
        <button class="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-colors">
          筛选
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-surface-dark shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actor</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Target</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-surface-dark divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="log in logs" :key="log.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold" :class="log.avatarClass">
                    {{ log.initials }}
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-bold text-gray-900 dark:text-white">{{ log.user }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded font-mono" :class="log.actionClass">
                  {{ log.action }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono">
                {{ log.target }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ log.time }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="bg-white dark:bg-surface-dark px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700 dark:text-gray-400">
              显示第 <span class="font-medium">1</span> 到 <span class="font-medium">4</span> 条，共 <span class="font-medium">128</span> 条结果
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
                <span class="sr-only">Previous</span>
                <span class="material-icons-outlined text-sm">chevron_left</span>
              </a>
              <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-sm font-medium border-rose-500 z-10">1</a>
              <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium">2</a>
              <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium">3</a>
              <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-400 text-sm font-medium">...</span>
              <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
                <span class="sr-only">Next</span>
                <span class="material-icons-outlined text-sm">chevron_right</span>
              </a>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GlobalAlerts from './GlobalAlerts.vue'

export default {
  name: 'AuditLogs',
  components: {
    GlobalAlerts
  },
  data() {
    return {
      logs: [
        {
          id: 1,
          user: 'Admin',
          initials: 'A',
          avatarClass: 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300',
          action: 'settings.ip_allowlist.update',
          actionClass: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300',
          target: '203.0.113.0/24',
          time: '10m ago'
        },
        {
          id: 2,
          user: 'Li Zhang',
          initials: 'LZ',
          avatarClass: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300',
          action: 'org.create',
          actionClass: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
          target: 'Frontend Team',
          time: '2h ago'
        },
        {
          id: 3,
          user: 'Wang Wei',
          initials: 'WW',
          avatarClass: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300',
          action: 'member.remove',
          actionClass: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
          target: 'user_id: 88412',
          time: '5h ago'
        },
        {
          id: 4,
          user: 'System',
          initials: 'S',
          avatarClass: 'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300',
          action: 'backup.automatic',
          actionClass: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300',
          target: 'Daily Backup',
          time: '1d ago'
        }
      ]
    }
  }
}
</script>
