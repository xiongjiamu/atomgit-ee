<template>
  <div class="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <!-- Global Alerts -->
    <GlobalAlerts page-name="token-management" />

    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">企业 Token 管理</h1>
        <button 
          class="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-black flex items-center gap-2 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-md active:scale-95"
          @click="openCreateModal"
        >
          <span class="material-icons-round text-lg">add</span>
          新建
        </button>
      </div>

      <!-- Tabs -->
      <div class="border-b border-slate-200 dark:border-slate-800">
        <nav class="-mb-px flex space-x-8">
          <a
            href="#"
            @click.prevent="activeTab = 'pending'"
            class="px-1 pb-3 text-sm font-bold flex items-center border-b-2 transition-colors"
            :class="activeTab === 'pending' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'"
          >
            待审批申请
            <span class="ml-2 text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full font-black">
              {{ pendingRequests.length }}
            </span>
          </a>
          <a
            href="#"
            @click.prevent="activeTab = 'active'"
            class="px-1 pb-3 text-sm font-bold flex items-center border-b-2 transition-colors"
            :class="activeTab === 'active' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'"
          >
            生效中
          </a>
        </nav>
      </div>

      <!-- Content -->
      <div class="space-y-4 min-h-[300px]">
        
        <!-- Pending List -->
        <div v-if="activeTab === 'pending'" class="space-y-4">
          <div 
            v-for="req in pendingRequests" 
            :key="req.id" 
            class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm hover:shadow-md transition-all duration-200 group"
          >
            <div class="flex items-start">
              <div class="flex-shrink-0 mr-4">
                <div class="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/50 flex items-center justify-center">
                  <span class="material-icons-round text-orange-400 dark:text-orange-500 text-2xl rotate-45">vpn_key</span>
                </div>
              </div>
              <div>
                <h3 class="text-base font-black text-slate-900 dark:text-white mb-1">{{ req.name }}</h3>
                <div class="text-sm text-slate-500 dark:text-slate-400 flex flex-wrap gap-x-2 items-center font-medium">
                  <span>申请人: <span class="text-slate-700 dark:text-slate-300 font-bold">{{ req.applicant }}</span></span>
                  <span class="text-slate-300 dark:text-slate-600">•</span>
                  <span>用途: {{ req.purpose }}</span>
                  <span class="text-slate-300 dark:text-slate-600">•</span>
                  <span class="text-xs text-slate-400">{{ req.date }}</span>
                </div>
              </div>
            </div>
            <div class="mt-4 md:mt-0 flex items-center space-x-3 w-full md:w-auto">
              <button 
                class="flex-1 md:flex-none px-4 py-1.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-sm font-bold transition-colors"
                @click="handleReject(req)"
              >
                拒绝
              </button>
              <button 
                class="flex-1 md:flex-none px-4 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-bold shadow-md shadow-green-500/20 transition-all active:scale-95"
                @click="openApproveModal(req)"
              >
                通过并签发
              </button>
            </div>
          </div>
          
          <!-- Empty Pending -->
          <div v-if="pendingRequests.length === 0" class="flex flex-col items-center justify-center py-16 text-slate-400">
            <span class="material-icons-round text-4xl opacity-50 mb-2">task_alt</span>
            <span class="text-xs font-bold uppercase tracking-widest">暂无待审批申请</span>
          </div>
        </div>

        <!-- Active List -->
        <div v-else class="space-y-4">
           <div 
            v-for="token in activeTokens" 
            :key="token.id" 
            class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm hover:shadow-md transition-all duration-200"
          >
             <div class="flex items-start">
              <div class="flex-shrink-0 mr-4">
                <div class="w-12 h-12 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/50 flex items-center justify-center">
                  <span class="material-icons-round text-green-500 text-2xl">check_circle</span>
                </div>
              </div>
              <div>
                <h3 class="text-base font-black text-slate-900 dark:text-white mb-1">{{ token.name }}</h3>
                <div class="text-sm text-slate-500 dark:text-slate-400 flex flex-wrap gap-x-2 items-center font-medium">
                  <span class="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-xs font-mono text-slate-600 dark:text-slate-400">
                    {{ token.prefix }}...
                  </span>
                  <span class="text-slate-300 dark:text-slate-600">•</span>
                  <span>Expires in {{ token.expiresIn }} days</span>
                </div>
              </div>
            </div>
             <div class="mt-4 md:mt-0 flex items-center space-x-3 w-full md:w-auto">
              <button 
                class="text-slate-400 hover:text-red-500 transition-colors p-2"
                title="撤销 Token"
                @click="handleRevoke(token)"
              >
                <span class="material-icons-round text-lg">delete_forever</span>
              </button>
            </div>
           </div>

           <!-- Empty Active -->
           <div v-if="activeTokens.length === 0" class="flex flex-col items-center justify-center py-16 text-slate-400">
            <span class="material-icons-round text-4xl opacity-50 mb-2">vpn_key_off</span>
            <span class="text-xs font-bold uppercase tracking-widest">暂无生效 Token</span>
          </div>
        </div>

      </div>
    </div>

    <!-- Token Modal -->
    <TokenModal
      :show="showModal"
      :mode="modalMode"
      :initial-data="selectedRequest"
      @close="showModal = false"
      @submit="handleModalSubmit"
    />
  </div>
</template>

<script>
import GlobalAlerts from './GlobalAlerts.vue'
import TokenModal from './TokenModal.vue'

export default {
  name: 'TokenManagement',
  components: {
    GlobalAlerts,
    TokenModal
  },
  data() {
    return {
      activeTab: 'pending',
      showModal: false,
      modalMode: 'create',
      selectedRequest: {},
      pendingRequests: [
        { id: 101, name: 'CI Pipeline Access', applicant: 'DevOps Bot', purpose: 'Jenkins 构建', date: '2 mins ago' },
        { id: 102, name: 'Audit Log Export', applicant: 'Security Team', purpose: 'Daily Logs', date: '1 hour ago' }
      ],
      activeTokens: [
        { id: 201, name: 'Release Bot Token', prefix: 'atk_8f92', expiresIn: 28 },
        { id: 202, name: 'Test Runner Key', prefix: 'atk_1a2b', expiresIn: 180 }
      ]
    }
  },
  methods: {
    openCreateModal() {
      this.modalMode = 'create'
      this.selectedRequest = {}
      this.showModal = true
    },
    openApproveModal(req) {
      this.modalMode = 'approve'
      this.selectedRequest = req
      this.showModal = true
    },
    handleReject(req) {
      if(confirm(`确认拒绝 ${req.name} 的申请吗？`)) {
        this.pendingRequests = this.pendingRequests.filter(r => r.id !== req.id)
      }
    },
    handleRevoke(token) {
      if(confirm(`确认撤销 Token ${token.name} 吗？此操作不可恢复。`)) {
        this.activeTokens = this.activeTokens.filter(t => t.id !== token.id)
      }
    },
    handleModalSubmit(data) {
      console.log('Token Submitted', data, this.modalMode)
      if (this.modalMode === 'approve') {
        // Remove from pending, add to active
        this.pendingRequests = this.pendingRequests.filter(r => r.id !== this.selectedRequest.id)
        this.activeTokens.unshift({
          id: Date.now(),
          name: this.selectedRequest.name,
          prefix: 'atk_' + Math.random().toString(36).substring(7),
          expiresIn: parseInt(data.expiry) || 30
        })
      } else {
        // Create new
        this.activeTokens.unshift({
          id: Date.now(),
          name: data.name,
          prefix: 'atk_' + Math.random().toString(36).substring(7),
          expiresIn: parseInt(data.expiry) || 30
        })
        this.activeTab = 'active'
      }
    }
  }
}
</script>
