<template>
  <div class="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <!-- List View -->
    <div v-if="!showCreateView" class="space-y-10">
      <!-- Alert Banners -->
      <div class="space-y-0">
        <AlertBanner
          v-model="showResourceAlert"
          type="warning"
          title="资源预警"
          icon="warning"
          message="您目前的企业存储空间已使用 856GB (85%), 接近包年套餐上限, 请关注资源消耗或及时扩容"
        />
        <AlertBanner
          v-model="showAnnouncementAlert"
          type="info"
          title="企业公告"
          icon="info"
          message="AtomGit 将于本周五 22:00 进行版本升级, 届时 CI/CD 服务可能会有短时闪断, 请知悉"
        />
      </div>

      <!-- Header -->
      <div class="flex items-center justify-between px-2">
        <div>
          <h1 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Construct Resources</h1>
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Self-hosted Runners Management</p>
        </div>
        <button 
          class="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-lg active:scale-95 flex items-center gap-2"
          @click="showCreateView = true"
        >
          <span class="material-icons-round text-lg">add</span>
          接入新 Runner
        </button>
      </div>

      <!-- Main Content -->
      <div class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <!-- Toolbar -->
        <div class="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="relative w-full md:w-80">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <span class="material-icons-round text-lg">search</span>
            </span>
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="搜索 Runner..." 
              class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div class="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-lg">
            <button 
              v-for="filter in filters" 
              :key="filter.value"
              @click="currentFilter = filter.value"
              class="px-4 py-1.5 text-xs font-black rounded-md transition-all"
              :class="currentFilter === filter.value ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'"
            >
              {{ filter.label }}
            </button>
          </div>
        </div>

        <!-- Table -->
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 dark:border-slate-800">
              <th class="px-6 py-4 w-1/4">Runner 名称</th>
              <th class="px-6 py-4 w-1/6">状态</th>
              <th class="px-6 py-4 w-1/4">可见范围</th>
              <th class="px-6 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr v-for="runner in filteredRunners" :key="runner.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
              <td class="px-6 py-4">
                <div class="font-bold text-slate-900 dark:text-white font-mono text-sm">{{ runner.name }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <span class="h-2 w-2 rounded-full" :class="runner.status === 'idle' ? 'bg-green-500' : 'bg-blue-500 animate-pulse'"></span>
                  <span class="text-xs font-bold" :class="runner.status === 'idle' ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'">
                    {{ runner.status === 'idle' ? 'Idle' : 'Active' }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span 
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wider border"
                  :class="runner.scope === 'public' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'"
                >
                  <span class="material-icons-round text-[14px]">{{ runner.scope === 'public' ? 'public' : 'business' }}</span>
                  {{ runner.scope === 'public' ? '企业公共池' : runner.assignedTo }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    v-if="runner.scope === 'public'"
                    class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                    @click="handleAssign(runner)"
                  >
                    分配组织
                  </button>
                  <button 
                    v-else
                    class="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:underline"
                    @click="handleReclaim(runner)"
                  >
                    回收资源
                  </button>
                  <button 
                    class="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1"
                    title="删除 Runner"
                    @click="handleDelete(runner)"
                  >
                    <span class="material-icons-round text-lg">delete</span>
                  </button>
                </div>
              </td>
            </tr>
            <!-- Empty State -->
            <tr v-if="filteredRunners.length === 0">
              <td colspan="4" class="px-6 py-12 text-center text-slate-400 dark:text-slate-600">
                <div class="flex flex-col items-center gap-2">
                  <span class="material-icons-round text-3xl opacity-50">search_off</span>
                  <span class="text-xs font-bold uppercase tracking-widest">没有找到匹配的 Runner</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create View -->
    <CreateRunner v-else @back="showCreateView = false" />
  </div>
</template>

<script>
import AlertBanner from './AlertBanner.vue'
import CreateRunner from './CreateRunner.vue'

export default {
  name: 'RunnerManagement',
  components: {
    AlertBanner,
    CreateRunner
  },
  data() {
    return {
      showCreateView: false,
      showResourceAlert: true,
      showAnnouncementAlert: true,
      searchQuery: '',
      currentFilter: 'all',
      filters: [
        { label: '全部', value: 'all' },
        { label: '公共池', value: 'public' },
        { label: '已分配', value: 'assigned' }
      ],
      runners: [
        { id: 1, name: 'ubuntu-worker-01', status: 'idle', scope: 'public', assignedTo: null },
        { id: 2, name: 'gpu-trainer-04', status: 'active', scope: 'assigned', assignedTo: 'AI Research' },
        { id: 3, name: 'build-node-18', status: 'idle', scope: 'assigned', assignedTo: 'Frontend Team' }
      ]
    }
  },
  computed: {
    filteredRunners() {
      return this.runners.filter(runner => {
        const matchesSearch = runner.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        const matchesFilter = this.currentFilter === 'all' 
          ? true 
          : this.currentFilter === 'public' 
            ? runner.scope === 'public'
            : runner.scope === 'assigned'
        return matchesSearch && matchesFilter
      })
    }
  },
  methods: {
    handleAddRunner() {
      // Logic moved to template click handler
    },
    handleAssign(runner) {
      console.log('Assign runner:', runner.name)
    },
    handleReclaim(runner) {
      console.log('Reclaim runner:', runner.name)
      if (confirm(`确认回收 ${runner.name} 到公共池吗？`)) {
        runner.scope = 'public'
        runner.assignedTo = null
      }
    },
    handleDelete(runner) {
      console.log('Delete runner:', runner.name)
      if (confirm(`确认删除 Runner ${runner.name} 吗？`)) {
        this.runners = this.runners.filter(r => r.id !== runner.id)
      }
    }
  }
}
</script>
