<template>
  <div class="ip-allowlist-management">
    <!-- Banners Section -->
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

    <!-- Header Section -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">IP 白名单</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">控制允许访问企业代码库的 IP 范围。</p>
      </div>
      <div class="flex items-center gap-3">
        <!-- Search -->
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span class="material-icons-outlined text-gray-400 text-lg">search</span>
          </div>
          <input 
            v-model="searchQuery"
            type="text" 
            class="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 w-64 transition-all"
            placeholder="按名称或 IP 搜索..."
          />
        </div>
        <!-- Add Button -->
        <button 
          class="flex items-center gap-1 bg-white hover:bg-gray-50 dark:bg-surface-dark dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded shadow-sm text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          @click="showNewIpModal = true"
        >
          <span class="material-icons-outlined text-sm">add</span> 添加 IP 段
        </button>
      </div>
    </div>

    <!-- Table Section -->
    <div class="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">
              备注名称
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">
              CIDR IP 范围
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">
              状态
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">
              操作
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-surface-dark divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="ip in filteredIpList" :key="ip.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
              <span v-if="ip.type === 'deny'" class="text-red-600 mr-2 font-bold">[拒绝]</span>{{ ip.name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 font-mono">
              {{ ip.cidr }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                Active
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" @click="deleteIp(ip.id)">删除</button>
            </td>
          </tr>
          <tr v-if="filteredIpList.length === 0">
            <td colspan="4" class="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
              <span v-if="searchQuery">未找到匹配 "{{ searchQuery }}" 的结果</span>
              <span v-else>暂无 IP 规则</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modals -->
    <new-ip-modal 
      :show="showNewIpModal" 
      @close="showNewIpModal = false"
      @submit="handleNewIp"
    />
  </div>
</template>

<script>
import NewIpModal from './NewIpModal.vue'

export default {
  name: 'IpAllowlistManagement',
  components: {
    NewIpModal
  },
  data() {
    return {
      searchQuery: '',
      showResourceAlert: true,
      showAnnouncementAlert: true,
      showNewIpModal: false,
      ipList: [
        { id: 1, name: '北京办公室 VPN', cidr: '203.0.113.0/24', type: 'allow' },
        { id: 2, name: '上海研发中心', cidr: '203.0.114.0/24', type: 'allow' },
        { id: 3, name: '恶意扫描 IP', cidr: '192.168.100.0/24', type: 'deny' }
      ]
    }
  },
  computed: {
    filteredIpList() {
      if (!this.searchQuery) return this.ipList
      const query = this.searchQuery.toLowerCase()
      return this.ipList.filter(ip => 
        ip.name.toLowerCase().includes(query) || 
        ip.cidr.toLowerCase().includes(query)
      )
    }
  },
  methods: {
    handleNewIp(data) {
      this.ipList.unshift({
        id: Date.now(),
        name: data.name,
        cidr: data.cidr,
        type: data.type
      })
    },
    deleteIp(id) {
      this.ipList = this.ipList.filter(ip => ip.id !== id)
    }
  }
}
</script>
