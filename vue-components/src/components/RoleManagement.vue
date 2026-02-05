<template>
  <div class="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <!-- Global Alerts -->
    <GlobalAlerts page-name="role-management" />

    <!-- Header -->
    <div class="flex items-center justify-between px-2">
      <div>
        <h1 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">权限与角色</h1>
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Roles & Permissions · Access Control</p>
      </div>
      <button 
        class="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-lg active:scale-95 flex items-center gap-2"
        @click="handleCreateRole"
      >
        <span class="material-icons-round text-lg">verified_user</span>
        新建自定义角色
      </button>
    </div>

    <!-- Filters & List -->
    <div class="space-y-4">
      <!-- Filter Bar -->
      <div class="flex items-center justify-between gap-4 bg-white dark:bg-surface-dark p-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div class="flex items-center gap-2 flex-1">
          <div class="relative flex-1 max-w-md">
            <span class="material-icons-round absolute left-3 top-2.5 text-slate-400 text-lg">search</span>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="搜索角色名称或描述..." 
              class="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/20 transition-all"
            >
          </div>
          <div class="relative w-40">
            <select 
              v-model="filterType"
              class="w-full appearance-none pl-4 pr-10 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              <option value="all">所有类型</option>
              <option value="preset">系统预设</option>
              <option value="custom">自定义</option>
            </select>
            <div class="absolute right-3 top-2.5 pointer-events-none">
              <span class="material-icons-round text-slate-400 text-lg">expand_more</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Roles Table -->
      <div class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 dark:border-slate-800">
              <th class="px-8 py-5 w-3/12">角色名称</th>
              <th class="px-8 py-5 w-2/12">类型</th>
              <th class="px-8 py-5 w-4/12">描述</th>
              <th class="px-8 py-5 w-2/12">成员数量</th>
              <th class="px-8 py-5 w-1/12 text-right">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr v-for="role in paginatedRoles" :key="role.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
              <td class="px-8 py-6">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="role.type === 'custom' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'">
                    <span class="material-icons-round text-xl">{{ role.icon }}</span>
                  </div>
                  <span class="text-sm font-bold text-slate-900 dark:text-white">{{ role.name }}</span>
                </div>
              </td>
              <td class="px-8 py-6">
                <span :class="[
                  'inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border',
                  role.type === 'custom' 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                ]">
                  {{ role.type === 'custom' ? 'CUSTOM' : 'PRESET' }}
                </span>
              </td>
              <td class="px-8 py-6">
                <p class="text-sm text-slate-500 dark:text-slate-400 font-medium line-clamp-2">{{ role.description }}</p>
              </td>
              <td class="px-8 py-6">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-bold text-slate-900 dark:text-white">{{ role.memberCount }}</span>
                  <span class="text-xs text-slate-400">members</span>
                </div>
              </td>
              <td class="px-8 py-6 text-right">
                <button 
                  v-if="role.type === 'custom'"
                  class="text-slate-400 hover:text-primary dark:hover:text-primary transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                  @click="handleEditRole(role)"
                  title="编辑权限"
                >
                  <span class="material-icons-round text-xl">edit_note</span>
                </button>
                <div v-else class="h-8 flex items-center justify-end pr-2">
                  <span class="material-icons-round text-slate-200 dark:text-slate-700 text-lg" title="不可编辑">lock</span>
                </div>
              </td>
            </tr>
            <!-- Empty State -->
            <tr v-if="filteredRoles.length === 0">
              <td colspan="5" class="px-8 py-12 text-center text-slate-400 dark:text-slate-600">
                <div class="flex flex-col items-center gap-3">
                  <span class="material-icons-round text-4xl opacity-50">search_off</span>
                  <span class="text-xs font-bold uppercase tracking-widest">没有找到匹配的角色</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div class="px-8 py-6 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            显示 <span class="text-slate-900 dark:text-white">{{ paginatedRoles.length }}</span> 条，共 <span class="text-slate-900 dark:text-white">{{ totalItems }}</span> 条记录
          </p>
          <div class="flex items-center gap-2">
            <button 
              class="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-black hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="currentPage === 1"
              @click="currentPage--"
            >
              ‹
            </button>
            
            <button 
              v-for="page in totalPages" 
              :key="page"
              class="w-8 h-8 rounded-lg text-[10px] font-black transition-all"
              :class="currentPage === page ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'"
              @click="currentPage = page"
            >
              {{ page }}
            </button>

            <button 
              class="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-black hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="currentPage === totalPages"
              @click="currentPage++"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Role Edit Modal -->
    <RoleEditModal
      :show="showRoleModal"
      :role-data="currentRole"
      @close="showRoleModal = false"
      @submit="handleRoleSubmit"
    />
  </div>
</template>

<script>
import GlobalAlerts from './GlobalAlerts.vue'
import RoleEditModal from './RoleEditModal.vue'

export default {
  name: 'RoleManagement',
  components: {
    GlobalAlerts,
    RoleEditModal
  },
  data() {
    return {
      showRoleModal: false,
      currentRole: null,
      searchQuery: '',
      filterType: 'all',
      currentPage: 1,
      pageSize: 10,
      roles: [
        {
          id: 'admin',
          name: 'Owner',
          type: 'preset',
          icon: 'admin_panel_settings',
          description: '拥有企业所有资源的管理权限，包括账单支付和成员管理。',
          memberCount: 2
        },
        {
          id: 'maintainer',
          name: 'Maintainer',
          type: 'preset',
          icon: 'engineering',
          description: '负责项目的日常维护，可以管理代码库设置和成员权限。',
          memberCount: 5
        },
        {
          id: 'developer',
          name: 'Developer',
          type: 'preset',
          icon: 'code',
          description: '日常开发人员，可以提交代码、创建分支和管理 Issue。',
          memberCount: 86
        },
        {
          id: 'release_manager',
          name: 'Release Manager',
          type: 'custom',
          icon: 'rocket_launch',
          description: '专注于发布流程，拥有 Tag 管理和流水线执行权限。',
          memberCount: 3
        },
        {
          id: 'guest',
          name: 'Guest',
          type: 'preset',
          icon: 'visibility',
          description: '仅拥有只读权限，无法修改代码或配置。',
          memberCount: 25
        }
      ]
    }
  },
  computed: {
    filteredRoles() {
      return this.roles.filter(role => {
        const matchesSearch = role.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
                              role.description.toLowerCase().includes(this.searchQuery.toLowerCase())
        const matchesType = this.filterType === 'all' || role.type === this.filterType
        return matchesSearch && matchesType
      })
    },
    paginatedRoles() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.filteredRoles.slice(start, end)
    },
    totalItems() {
      return this.filteredRoles.length
    },
    totalPages() {
      return Math.ceil(this.totalItems / this.pageSize)
    }
  },
  methods: {
    handleCreateRole() {
      this.currentRole = null
      this.showRoleModal = true
    },
    handleEditRole(role) {
      this.currentRole = role
      this.showRoleModal = true
    },
    handleRoleSubmit(roleData) {
      if (this.currentRole) {
        // Edit existing
        const index = this.roles.findIndex(r => r.id === roleData.id)
        if (index !== -1) {
          // Merge existing data with new data (preserving icon and type)
          this.roles[index] = { ...this.roles[index], ...roleData }
        }
      } else {
        // Create new
        this.roles.push({
          ...roleData,
          icon: 'verified_user', // Default icon for new custom roles
          memberCount: 0
        })
      }
    }
  }
}
</script>
