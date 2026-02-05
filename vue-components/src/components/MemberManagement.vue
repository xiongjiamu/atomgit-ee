<template>
  <div class="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <!-- Global Alerts -->
    <GlobalAlerts page-name="member-management" />

    <!-- Header -->
    <div class="flex items-center justify-between px-2">
      <div>
        <h1 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">成员管理</h1>
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Member Management · Organization</p>
      </div>
      <div class="flex items-center gap-3">
        <button 
          @click="openInviteModal('collaborator')"
          class="px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-95"
        >
          邀请外部协作者
        </button>
        <button 
          @click="openInviteModal('member')"
          class="px-6 py-3 bg-primary text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-primary-dark transition-all shadow-lg shadow-primary/30 active:scale-95 flex items-center gap-2"
        >
          <span class="material-icons-round text-lg">person_add</span>
          添加企业成员
        </button>
      </div>
    </div>

    <!-- Search and Filter Section -->
    <div class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 shadow-sm flex flex-col md:flex-row gap-3 items-center">
      <!-- Search Input -->
      <div class="relative flex-1 group w-full">
        <span class="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
        <input 
          v-model="searchQuery"
          type="text" 
          class="w-full pl-12 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all placeholder-slate-400"
          placeholder="搜索用户名、昵称或企业别名..."
        />
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          <span class="material-icons-round text-lg">close</span>
        </button>
      </div>

      <!-- Role Filter -->
      <div class="flex items-center gap-2">
        <div class="relative group">
          <select
            v-model="selectedRole"
            class="appearance-none bg-slate-50 dark:bg-slate-800/50 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-slate-900 dark:text-white py-2.5 pl-10 pr-10 rounded-xl text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm cursor-pointer min-w-[160px]"
          >
            <option value="">全部角色 · All Roles</option>
            <option v-for="role in availableRoles" :key="role" :value="role">{{ role }}</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400 group-hover:text-primary transition-colors">
            <span class="material-icons-round text-lg">filter_list</span>
          </div>
          <div class="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
            <span class="material-icons-round text-lg">expand_more</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Members Table -->
    <div class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <table class="w-full text-left border-collapse">
        <!-- ... (table content unchanged) ... -->
        <thead>
          <tr class="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 dark:border-slate-800">
            <th class="px-8 py-5 w-4/12">用户</th>
            <th class="px-8 py-5 w-2/12">角色</th>
            <th class="px-8 py-5 w-2/12">组织</th>
            <th class="px-8 py-5 w-2/12">有效期</th>
            <th class="px-8 py-5 w-2/12 text-right">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
          <tr v-if="filteredMembers.length === 0" class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
            <td colspan="5" class="px-8 py-12 text-center">
              <div class="flex flex-col items-center justify-center">
                <span class="material-icons-round text-5xl text-slate-300 dark:text-slate-600 mb-3">search_off</span>
                <p class="text-sm font-bold text-slate-500 dark:text-slate-400">未找到匹配的成员</p>
                <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">请尝试调整搜索条件或筛选条件</p>
              </div>
            </td>
          </tr>
          <tr v-for="member in filteredMembers" :key="member.email" class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
            <td class="px-8 py-6">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 font-black text-xs ring-2 ring-white dark:ring-slate-800">
                  {{ member.initials }}
                </div>
                <div class="ml-4">
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-bold text-slate-900 dark:text-white">{{ member.name }}</span>
                    <span v-if="member.alias" class="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[9px] font-bold text-slate-500 truncate max-w-[80px]">
                      {{ member.alias }}
                    </span>
                  </div>
                  <div class="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">{{ member.email }}</div>
                </div>
              </div>
            </td>
            <td class="px-8 py-6">
              <span :class="[
                'inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border',
                member.role === '企业管理员' 
                  ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
              ]">
                {{ member.role }}
              </span>
            </td>
            <td class="px-8 py-6">
              <span class="text-sm font-bold text-slate-700 dark:text-slate-300 font-mono">{{ member.organization }}</span>
            </td>
            <td class="px-8 py-6">
              <div class="flex items-center gap-2">
                <span class="material-icons-round text-base text-slate-400">event</span>
                <span :class="[
                  'text-sm font-bold',
                  member.expiry === '永久有效' ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'
                ]">
                  {{ member.expiry }}
                </span>
                <span v-if="member.isExpiring" class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" title="即将过期"></span>
              </div>
            </td>
            <td class="px-8 py-6 text-right">
              <div class="flex items-center justify-end gap-2">
                <button 
                  class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                  title="设置企业别名"
                  @click="handleSetAlias(member)"
                >
                  <span class="material-icons-round text-lg">badge</span>
                </button>
                <button 
                  class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                  title="设置有效期"
                  @click="handleSetExpiry(member)"
                >
                  <span class="material-icons-round text-lg">edit_calendar</span>
                </button>
                <button 
                  class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                  title="移除成员"
                  @click="handleRemoveMember(member)"
                >
                  <span class="material-icons-round text-lg">person_remove</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- Pagination -->
      <div class="px-8 py-6 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          显示 <span class="text-slate-900 dark:text-white">{{ filteredMembers.length }}</span> 条
          <span v-if="hasActiveFilters" class="text-slate-500 dark:text-slate-500">
            （共 <span class="text-slate-900 dark:text-white">{{ totalRecords }}</span> 条记录）
          </span>
          <span v-else>
            ，共 <span class="text-slate-900 dark:text-white">{{ totalRecords }}</span> 条记录
          </span>
        </p>
        <div class="flex items-center gap-2">
          <button class="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-300 text-[10px] font-black opacity-50 cursor-not-allowed">‹</button>
          <button class="w-8 h-8 rounded-lg bg-primary text-white text-[10px] font-black shadow-lg shadow-primary/20">1</button>
          <button class="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-black hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">2</button>
          <button class="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-black hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">›</button>
        </div>
      </div>
    </div>

    <!-- Invite Modal -->
    <InviteMemberModal
      :show="showInviteModal"
      :type="inviteType"
      @close="showInviteModal = false"
      @submit="handleInviteSubmit"
    />
  </div>
</template>

<script>
import GlobalAlerts from './GlobalAlerts.vue'
import InviteMemberModal from './InviteMemberModal.vue'

export default {
  name: 'MemberManagement',
  components: {
    GlobalAlerts,
    InviteMemberModal
  },
  data() {
    return {
      showInviteModal: false,
      inviteType: 'member',
      searchQuery: '',
      selectedRole: '',
      totalRecords: 128,
      members: [
        {
          id: 1,
          name: 'Li Zhang',
          email: 'lizhang@atomgit.com',
          initials: 'LZ',
          role: '企业管理员',
          organization: 'Root',
          alias: '总负责人',
          expiry: '永久有效',
          isExpiring: false
        },
        {
          id: 2,
          name: 'Wang Wei',
          email: 'wangwei@atomgit.com',
          initials: 'WW',
          role: '开发者',
          organization: 'Backend',
          alias: '',
          expiry: '2024-12-31',
          isExpiring: false
        },
        {
          id: 3,
          name: 'Sarah Chen',
          email: 'sarah@external.com',
          initials: 'SC',
          role: '外部协作者',
          organization: 'Design',
          alias: 'UI 设计顾问',
          expiry: '2023-11-30',
          isExpiring: true
        },
        {
          id: 4,
          name: 'Mike Ross',
          email: 'mike@partner.com',
          initials: 'MR',
          role: '访客',
          organization: 'Legal',
          alias: '',
          expiry: '2023-12-15',
          isExpiring: true
        },
        {
          id: 5,
          name: 'Yu Liu',
          email: 'yuliu@atomgit.com',
          initials: 'YL',
          role: '运维工程师',
          organization: 'Infra',
          alias: '',
          expiry: '永久有效',
          isExpiring: false
        }
      ]
    }
  },
  computed: {
    availableRoles() {
      const roles = new Set(this.members.map(m => m.role))
      return Array.from(roles).sort()
    },
    filteredMembers() {
      let result = this.members

      // Role filter
      if (this.selectedRole) {
        result = result.filter(member => member.role === this.selectedRole)
      }

      // Search filter
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.trim().toLowerCase()
        result = result.filter(member => {
          const nameMatch = member.name.toLowerCase().includes(query)
          const emailMatch = member.email.toLowerCase().includes(query)
          const aliasMatch = member.alias && member.alias.toLowerCase().includes(query)
          return nameMatch || emailMatch || aliasMatch
        })
      }

      return result
    },
    hasActiveFilters() {
      return this.searchQuery.trim() !== '' || this.selectedRole !== ''
    }
  },
  methods: {
    openInviteModal(type) {
      this.inviteType = type
      this.showInviteModal = true
    },
    handleInviteSubmit(data) {
      console.log('Invite submitted:', data)
      // Mock adding the member
      const newMember = {
        name: data.identifier.split('@')[0], // Simple mock name
        email: data.identifier.includes('@') ? data.identifier : `${data.identifier}@atomgit.com`,
        initials: data.identifier.substring(0, 2).toUpperCase(),
        role: data.role === 'admin' ? '企业管理员' : 
              data.role === 'developer' ? '开发者' : 
              data.role === 'ops' ? '运维工程师' : '访客',
        organization: 'Pending',
        alias: '',
        expiry: data.expiry === 'forever' ? '永久有效' : data.expiry,
        isExpiring: false
      }
      this.members.unshift(newMember)
      // Trigger a success alert (optional, but good UX)
      // alert(`Invitation sent to ${data.identifier}`)
    },
    handleSetAlias(member) {
      console.log('Set alias for:', member.name)
    },
    handleSetExpiry(member) {
      console.log('Set expiry for:', member.name)
    },
    handleRemoveMember(member) {
      console.log('Remove member:', member.name)
    }
  }
}
</script>
