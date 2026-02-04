<template>
  <div class="ip-allowlist-management">
    <!-- Global Alerts -->
    <GlobalAlerts page-name="ip-allowlist" />

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
import GlobalAlerts from './GlobalAlerts.vue'

export default {
  name: 'IpAllowlistManagement',
  components: {
    NewIpModal,
    GlobalAlerts
  },
  data() {
    return {
      searchQuery: '',
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
