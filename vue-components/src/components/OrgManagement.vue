<template>
  <div class="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <!-- Alert Banners -->
    <div class="space-y-0">
      <AlertBanner
        v-model="showResourceAlert"
        type="warning"
        title="资源预警"
        icon="info"
        message="您企业当前的存储空间已使用 856GB (85%)，接近包年套餐上限，请关注资源消耗或及时扩容"
      />

      <AlertBanner
        v-model="showAnnouncementAlert"
        type="info"
        title="企业公告"
        icon="campaign"
        message="AtomGit 将于本周五 22:00 进行版本升级，届时 CI/CD 服务可能会有短时闪断，请知悉"
      />
    </div>

    <!-- Header -->
    <div class="flex items-center justify-between px-2">
      <div>
        <h1 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">组织管理</h1>
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Organization Management</p>
      </div>
      <div class="flex items-center gap-3">
        <button 
          class="px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-95 flex items-center gap-2"
          @click="showInviteModal = true"
        >
          <span class="material-icons-round text-lg">link</span>
          关联已有组织
        </button>
        <button 
          class="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-lg active:scale-95 flex items-center gap-2"
          @click="showCreateModal = true"
        >
          <span class="material-icons-round text-lg">add_business</span>
          添加组织
        </button>
      </div>
    </div>

    <!-- Org List Table -->
    <div class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 dark:border-slate-800">
            <th class="px-8 py-5 w-4/12">组织名称</th>
            <th class="px-8 py-5 w-2/12">可见性</th>
            <th class="px-8 py-5 w-2/12">成员数量</th>
            <th class="px-8 py-5 w-2/12">创建时间</th>
            <th class="px-8 py-5 w-2/12 text-right">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
          <tr v-for="org in orgs" :key="org.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
            <td class="px-8 py-6">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-lg bg-slate-900 dark:bg-slate-700 flex items-center justify-center text-white font-black text-sm shadow-md">
                   {{ org.initials }}
                </div>
                <div>
                   <h3 class="text-sm font-bold text-slate-900 dark:text-white">{{ org.name }}</h3>
                   <p class="text-[10px] text-slate-500 font-mono mt-0.5">atomgit.com/{{ org.slug }}</p>
                </div>
              </div>
            </td>
            <td class="px-8 py-6">
               <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border"
                 :class="org.visibility === 'public' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'"
               >
                 <span class="material-icons-round text-[14px]">{{ org.visibility === 'public' ? 'public' : 'lock' }}</span>
                 {{ org.visibility === 'public' ? 'PUBLIC' : 'PRIVATE' }}
               </span>
            </td>
            <td class="px-8 py-6">
               <div class="flex items-center gap-2">
                 <span class="text-sm font-bold text-slate-900 dark:text-white">{{ org.memberCount }}</span>
                 <span class="text-xs text-slate-400">members</span>
               </div>
            </td>
            <td class="px-8 py-6">
               <span class="text-xs font-medium text-slate-500 dark:text-slate-400">{{ org.createdAt }}</span>
            </td>
            <td class="px-8 py-6 text-right">
              <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button 
                  class="p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-all" 
                  title="成员管理" 
                  @click="handleManageMembers(org)"
                 >
                    <span class="material-icons-round text-lg">group</span>
                 </button>
                 <button 
                  class="p-2 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all" 
                  title="组织设置" 
                  @click="handleManageSettings(org)"
                 >
                    <span class="material-icons-round text-lg">settings</span>
                 </button>
                 <button 
                  class="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all" 
                  title="删除组织" 
                  @click="handleDelete(org)"
                 >
                    <span class="material-icons-round text-lg">delete</span>
                 </button>
              </div>
            </td>
          </tr>
          <!-- Empty State -->
          <tr v-if="orgs.length === 0">
            <td colspan="5" class="px-8 py-12 text-center text-slate-400 dark:text-slate-600">
              <div class="flex flex-col items-center gap-3">
                <span class="material-icons-round text-4xl opacity-50">domain_disabled</span>
                <span class="text-xs font-bold uppercase tracking-widest">暂无组织，请点击右上角新建</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- New Org Modal -->
    <NewOrgModal
      :show="showCreateModal"
      @close="showCreateModal = false"
      @submit="handleCreateOrg"
    />

    <!-- Invite Org Modal -->
    <InviteOrgModal
      :show="showInviteModal"
      @close="showInviteModal = false"
      @submit="handleInviteOrg"
    />
  </div>
</template>

<script>
import AlertBanner from './AlertBanner.vue'
import NewOrgModal from './NewOrgModal.vue'
import InviteOrgModal from './InviteOrgModal.vue'

export default {
  name: 'OrgManagement',
  components: {
    AlertBanner,
    NewOrgModal,
    InviteOrgModal
  },
  data() {
    return {
      showResourceAlert: true,
      showAnnouncementAlert: true,
      showCreateModal: false,
      showInviteModal: false,
      orgs: [
        {
          id: 1,
          name: 'Frontend Team',
          slug: 'frontend-team',
          initials: 'FE',
          memberCount: 24,
          visibility: 'private',
          createdAt: '2023-11-15'
        },
        {
          id: 2,
          name: 'Backend Group',
          slug: 'backend-group',
          initials: 'BE',
          memberCount: 42,
          visibility: 'private',
          createdAt: '2023-10-22'
        },
        {
          id: 3,
          name: 'Open Source Community',
          slug: 'opensource',
          initials: 'OS',
          memberCount: 156,
          visibility: 'public',
          createdAt: '2023-09-01'
        }
      ]
    }
  },
  methods: {
    handleCreateOrg(orgData) {
      console.log('Create org:', orgData)
      const initials = orgData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
      const today = new Date().toISOString().split('T')[0]
      this.orgs.unshift({
        id: Date.now(),
        name: orgData.name,
        slug: orgData.slug,
        initials: initials || 'OR',
        memberCount: 1,
        visibility: orgData.visibility || 'private',
        createdAt: today
      })
    },
    handleInviteOrg(inviteData) {
      console.log('Invite org:', inviteData)
      const { org, role } = inviteData
      const today = new Date().toISOString().split('T')[0]
      // Check if already linked
      if (this.orgs.some(o => o.slug === org.slug)) {
        alert('This organization is already linked.')
        return
      }
      this.orgs.unshift({
        id: Date.now(),
        name: org.name,
        slug: org.slug,
        initials: org.initials,
        memberCount: 0, // Should come from API usually
        visibility: 'private', // Default or from API
        createdAt: today
      })
    },
    handleManageMembers(org) {
      console.log('Manage members for:', org.name)
    },
    handleManageSettings(org) {
      console.log('Manage settings for:', org.name)
    },
    handleDelete(org) {
      console.log('Delete org:', org.name)
      if(confirm(`Are you sure you want to delete ${org.name}?`)) {
        this.orgs = this.orgs.filter(o => o.id !== org.id)
      }
    }
  }
}
</script>
