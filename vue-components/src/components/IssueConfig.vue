<template>
  <div class="issue-config space-y-6">
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
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Issue 高级功能</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">企业下新加入组织的 issue 高级功能设置</p>
      <div class="flex items-center gap-2">
        <input 
          type="checkbox" 
          id="enable-advanced" 
          v-model="advancedEnabled"
          class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-zinc-800 dark:border-zinc-600"
        />
        <label for="enable-advanced" class="text-sm text-gray-900 dark:text-white">
          启用 Issue 高级功能后，支持 Issue 配置自定义类型及状态，为项目管理提供更精细的分类和处理方式。
        </label>
      </div>
    </div>

    <!-- Tabs -->
    <div class="border-b border-gray-200 dark:border-gray-700 mb-6">
      <nav class="-mb-px flex space-x-6">
        <a href="#" class="border-b-2 border-black dark:border-white py-2 px-1 text-sm font-medium text-gray-900 dark:text-white">
          类型配置
        </a>
        <a href="#" class="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 transition-colors">
          优先级配置
        </a>
        <a href="#" class="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 transition-colors">
          状态配置
        </a>
        <a href="#" class="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 transition-colors">
          自定义字段配置
        </a>
      </nav>
    </div>

    <!-- Type Config Section -->
    <div class="mb-6">
      <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Issue 类型配置</h2>
      <div class="flex gap-3 mb-6">
        <button class="bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 text-white text-sm px-4 py-2 rounded-md flex items-center gap-2 transition-colors shadow-sm font-medium">
          <span class="material-icons-outlined text-sm">add</span>
          新增 issue 类型
        </button>
        <button class="bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 text-sm px-4 py-2 rounded-md flex items-center gap-2 transition-colors border border-transparent">
          <span class="material-icons-outlined text-sm">add</span>
          安全 issue 类型
        </button>
      </div>

      <!-- List Card -->
      <div class="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-surface-dark overflow-hidden shadow-sm">
        <div class="bg-gray-50 dark:bg-gray-800/50 px-6 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-sm font-bold text-gray-900 dark:text-white">3 Issue 类型</h3>
        </div>
        <ul class="divide-y divide-gray-200 dark:divide-gray-700">
          <li v-for="type in issueTypes" :key="type.id" class="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
            <div class="flex items-center gap-4 flex-1">
              <span class="material-icons-outlined text-gray-400 cursor-move opacity-0 group-hover:opacity-100 transition-opacity">drag_indicator</span>
              <span class="text-sm font-bold w-24 text-gray-900 dark:text-white">{{ type.name }}</span>
              <span class="text-sm text-gray-500 dark:text-gray-400">{{ type.desc }}</span>
            </div>
            <div class="flex items-center gap-6">
               <!-- Toggle -->
              <div class="relative inline-block w-12 align-middle select-none h-6">
                <input 
                  type="checkbox" 
                  :id="'toggle-' + type.id" 
                  v-model="type.enabled"
                  class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer outline-none border-gray-300"
                />
                <label 
                  :for="'toggle-' + type.id" 
                  class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                ></label>
              </div>
              
              <div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <button class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">编辑</button>
                <button class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">状态设置</button>
                <button class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">优先级设置</button>
                <button class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">工作流设置</button>
                <button class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">自定义字段设置</button>
                <button class="hover:text-red-600 dark:hover:text-red-400 transition-colors">删除</button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

     <!-- Pagination (Simplified for visual match) -->
    <div class="flex items-center justify-end gap-2 text-sm text-gray-500 dark:text-gray-400 pb-2">
        <button class="flex items-center hover:text-gray-900 dark:hover:text-white disabled:opacity-50" disabled>
            <span class="material-icons-outlined text-sm">chevron_left</span>
            上一页
        </button>
        <button class="w-8 h-8 flex items-center justify-center rounded bg-black dark:bg-white text-white dark:text-black font-medium">1</button>
        <button class="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800">2</button>
        <button class="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800">3</button>
        <span class="w-8 h-8 flex items-center justify-center">...</span>
        <button class="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800">100</button>
        <button class="flex items-center hover:text-gray-900 dark:hover:text-white">
            下一页
            <span class="material-icons-outlined text-sm">chevron_right</span>
        </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IssueConfig',
  data() {
    return {
      showResourceAlert: true,
      showAnnouncementAlert: true,
      advancedEnabled: true,
      issueTypes: [
        { id: 1, name: '需求', desc: 'something isn’t working', enabled: true },
        { id: 2, name: '缺陷', desc: 'something isn’t working', enabled: true },
        { id: 3, name: '咨询', desc: 'something isn’t working', enabled: true },
        { id: 4, name: '安全漏洞', desc: 'something isn’t working', enabled: true }
      ]
    }
  }
}
</script>

<style scoped>
/* Unified Smooth Toggle */
.toggle-checkbox {
  right: auto;
  left: 0;
  transition: transform 0.2s ease-in-out, border-color 0.2s;
  transform: translateX(0);
}
.toggle-checkbox:checked {
  right: auto;
  left: 0;
  transform: translateX(100%);
  border-color: #3b82f6; /* Blue-500 */
}
.toggle-checkbox:checked + .toggle-label {
  background-color: #3b82f6;
}
</style>
