<template>
  <div class="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <!-- Global Alerts -->
    <GlobalAlerts page-name="webhook-management" />

    <!-- Header -->
    <div class="flex items-center justify-between px-2">
      <div>
        <h1 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">企业级 Webhooks</h1>
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Enterprise Webhooks</p>
      </div>
      <button 
        class="px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-gray-300 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-95 flex items-center gap-2"
        @click="handleAddWebhook"
      >
        <span class="material-icons-round text-lg">add</span>
        添加 Webhook
      </button>
    </div>

    <!-- Main Content -->
    <div class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
      <!-- Toolbar -->
      <div class="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="relative w-full md:w-96">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <span class="material-icons-round text-lg">search</span>
          </span>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="搜索 URL..." 
            class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>

      <!-- Table -->
      <table class="w-full text-left border-collapse">
        <tbody>
          <tr 
            v-for="hook in paginatedHooks" 
            :key="hook.id" 
            class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group border-b border-slate-100 dark:border-slate-800 last:border-0"
          >
            <td class="px-6 py-5 w-16 align-top">
              <span 
                class="material-icons-round text-2xl"
                :class="hook.active ? 'text-green-500' : 'text-slate-300'"
              >{{ hook.active ? 'check_circle_outline' : 'highlight_off' }}</span>
            </td>
            <td class="px-6 py-5">
              <div class="flex flex-col">
                <span class="text-sm font-bold text-slate-900 dark:text-white font-mono break-all">{{ hook.url }}</span>
                <span class="text-xs text-slate-500 mt-1 font-medium">Events: {{ hook.events.join(', ') }}</span>
                <span class="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">{{ hook.createdAt }}</span>
              </div>
            </td>
            <td class="px-6 py-5 text-right align-top">
              <div class="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  class="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                  @click="handleEdit(hook)"
                >
                  编辑
                </button>
                <button 
                  class="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                  @click="handleTest(hook)"
                >
                  测试推送
                </button>
                <button 
                  class="text-slate-400 hover:text-red-500 transition-colors p-1"
                  @click="handleDelete(hook)"
                  title="删除"
                >
                  <span class="material-icons-round text-lg">delete</span>
                </button>
              </div>
            </td>
          </tr>
          <!-- Empty State -->
          <tr v-if="filteredHooks.length === 0">
            <td colspan="3" class="px-6 py-12 text-center text-slate-400 dark:text-slate-600">
              <div class="flex flex-col items-center gap-2">
                <span class="material-icons-round text-3xl opacity-50">webhook</span>
                <span class="text-xs font-bold uppercase tracking-widest">暂无 Webhooks</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="px-6 py-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          显示 {{ paginatedHooks.length }} / {{ filteredHooks.length }} 条记录
        </p>
        <div class="flex items-center gap-2">
          <button 
            class="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-black hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            <span class="material-icons-round text-base">chevron_left</span>
          </button>
          
          <button 
            v-for="page in totalPages" 
            :key="page"
            class="w-8 h-8 rounded-lg text-[10px] font-black transition-all flex items-center justify-center"
            :class="currentPage === page ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md' : 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'"
            @click="currentPage = page"
          >
            {{ page }}
          </button>

          <button 
            class="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-black hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >
            <span class="material-icons-round text-base">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GlobalAlerts from './GlobalAlerts.vue'

export default {
  name: 'WebhookManagement',
  components: {
    GlobalAlerts
  },
  data() {
    return {
      searchQuery: '',
      currentPage: 1,
      pageSize: 5,
      items: [
        { 
          id: 1, 
          url: 'https://jenkins.internal/hooks/gitcode-ci', 
          active: true, 
          events: ['push', 'pull_request'], 
          createdAt: '2023-10-15' 
        },
        { 
          id: 2, 
          url: 'https://slack.com/api/webhooks/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX', 
          active: true, 
          events: ['issues', 'note'], 
          createdAt: '2023-11-02' 
        },
        { 
          id: 3, 
          url: 'https://example.com/hooks/audit-log', 
          active: false, 
          events: ['*'], 
          createdAt: '2023-09-20' 
        },
        { 
          id: 4, 
          url: 'https://prod-deploy.internal/trigger', 
          active: true, 
          events: ['release'], 
          createdAt: '2023-12-01' 
        },
        { 
          id: 5, 
          url: 'https://notify.dingtalk.com/robot/send?access_token=xxxx', 
          active: true, 
          events: ['push'], 
          createdAt: '2023-12-05' 
        },
        { 
          id: 6, 
          url: 'https://api.my-service.com/webhooks/gitcode', 
          active: true, 
          events: ['pull_request', 'merge_request'], 
          createdAt: '2023-12-10' 
        }
      ]
    }
  },
  computed: {
    filteredHooks() {
      if (!this.searchQuery) return this.items
      return this.items.filter(item => 
        item.url.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    },
    totalPages() {
      return Math.ceil(this.filteredHooks.length / this.pageSize)
    },
    paginatedHooks() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.filteredHooks.slice(start, end)
    }
  },
  watch: {
    searchQuery() {
      this.currentPage = 1
    }
  },
  methods: {
    handleAddWebhook() {
      console.log('Add Webhook')
    },
    handleEdit(hook) {
      console.log('Edit Webhook', hook.id)
    },
    handleTest(hook) {
      console.log('Test Webhook', hook.id)
      alert(`已发送测试事件到 ${hook.url}`)
    },
    handleDelete(hook) {
      if (confirm('确认删除此 Webhook 吗？')) {
        this.items = this.items.filter(i => i.id !== hook.id)
      }
    }
  }
}
</script>
