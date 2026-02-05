<template>
  <div class="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <!-- Search Bar -->
    <div class="relative rounded-md shadow-sm">
      <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
        <span class="material-icons-round text-slate-400 text-xl">search</span>
      </div>
      <input
        type="text"
        v-model="searchQuery"
        class="focus:ring-primary focus:border-primary block w-full pl-10 pr-4 py-3 sm:text-sm border-slate-300 dark:border-slate-700 dark:bg-surface-dark dark:text-white rounded-lg transition-all shadow-sm placeholder-slate-400"
        placeholder="搜索 LFS 文件名称 或 SHA256..."
      />
    </div>

    <!-- Filter Toolbar -->
    <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-border-light dark:border-border-dark pb-4">
      <div class="flex items-center gap-2">
        <span class="text-sm font-semibold text-slate-900 dark:text-white px-2">企业 LFS 库</span>
        <span class="bg-slate-100 dark:bg-slate-800 text-slate-500 py-0.5 px-2 rounded-full text-xs font-bold">{{ lfsObjects.length }}</span>
      </div>

      <!-- Dimension Filters -->
      <div class="flex items-center flex-wrap gap-2">
        <div v-for="filter in dimensionFilters" :key="filter" class="relative group">
          <button class="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all">
            <span>{{ filter }}</span>
            <span class="material-icons-round text-sm opacity-50">expand_more</span>
          </button>
        </div>
        <div class="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>
        <button class="flex items-center space-x-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
          <span class="material-icons-round text-base">sort</span>
          <span>排序</span>
        </button>
      </div>
    </div>

    <!-- Batch Action Bar (Floating) -->
    <div v-if="selectedIds.length > 0" class="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div class="bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-full shadow-2xl px-6 py-3 flex items-center gap-6 border border-slate-700/50 dark:border-slate-200">
        <span class="font-bold text-sm whitespace-nowrap tracking-wide">已选中 {{ selectedIds.length }} 个项目</span>
        <div class="h-4 w-px bg-white/20 dark:bg-slate-900/20"></div>
        <button 
          @click="batchDelete"
          class="text-rose-400 hover:text-rose-300 dark:text-rose-600 dark:hover:text-rose-500 font-bold text-sm flex items-center gap-1.5 transition-colors"
        >
          <span class="material-icons-round text-lg">delete_sweep</span>
          批量删除 LFS
        </button>
        <button 
          @click="selectedIds = []"
          class="text-slate-400 hover:text-white dark:text-slate-500 dark:hover:text-slate-900 transition-colors"
        >
          <span class="material-icons-round text-xl">close</span>
        </button>
      </div>
    </div>

    <!-- Table Header (Visible only on lg screens) -->
    <div class="hidden lg:grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-t-xl border border-border-light dark:border-border-dark text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
      <div class="col-span-1 flex items-center gap-3">
        <input 
          type="checkbox" 
          :checked="isAllSelected" 
          @change="toggleSelectAll"
          class="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4 bg-white dark:bg-surface-dark cursor-pointer shadow-sm"
        />
      </div>
      <div class="col-span-3">文件名称</div>
      <div class="col-span-2">大小</div>
      <div class="col-span-2">所属项目</div>
      <div class="col-span-3">SHA256 / 更新时间</div>
      <div class="col-span-1 text-right">操作</div>
    </div>

    <!-- LFS List Container -->
    <div class="space-y-3">
      <div
        v-for="lfs in filteredLfs"
        :key="lfs.id"
        :class="[
          'bg-surface-light dark:bg-surface-dark border rounded-xl transition-all group relative cursor-pointer',
          selectedIds.includes(lfs.id) 
            ? 'border-primary ring-1 ring-primary/20 bg-primary/[0.02] dark:bg-primary/[0.05]' 
            : 'border-border-light dark:border-border-dark hover:border-primary dark:hover:border-slate-600 hover:shadow-soft'
        ]"
        @click="toggleSelect(lfs.id)"
      >
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 p-5 items-center">
          <!-- Selection & Name -->
          <div class="col-span-full lg:col-span-4 flex items-center gap-4 min-w-0">
            <input 
              type="checkbox" 
              :checked="selectedIds.includes(lfs.id)"
              @click.stop
              @change="toggleSelect(lfs.id)"
              class="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4 bg-white dark:bg-surface-dark cursor-pointer flex-shrink-0 shadow-sm"
            />
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="material-icons-round text-slate-400 text-lg">insert_drive_file</span>
                <h3 class="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">
                  {{ lfs.name }}
                </h3>
              </div>
            </div>
          </div>

          <!-- Size (Visible on lg, or mobile specific) -->
          <div class="col-span-full lg:col-span-2">
            <span class="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
              {{ lfs.size }}
            </span>
          </div>

          <!-- Project -->
          <div class="col-span-full lg:col-span-2 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
            <span class="material-icons-round text-base opacity-40">folder</span>
            <span class="truncate">{{ lfs.repo }}</span>
          </div>

          <!-- SHA256 & Meta -->
          <div class="col-span-full lg:col-span-3 min-w-0">
            <div class="text-[11px] font-mono text-slate-400 dark:text-slate-500 truncate" :title="lfs.sha">
              SHA256: {{ formatSha(lfs.sha) }}
            </div>
            <div class="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1">
              <span class="material-icons-round text-xs opacity-60">schedule</span>
              {{ lfs.updatedAt }}
            </div>
          </div>

          <!-- Actions -->
          <div class="col-span-full lg:col-span-1 flex justify-end">
            <button 
              @click.stop="handleDelete(lfs)"
              class="opacity-0 group-hover:opacity-100 transition-all p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg"
              title="确认删除 LFS 文件"
            >
              <span class="material-icons-round text-lg">delete_outline</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="mt-8 flex justify-center pb-4">
      <nav aria-label="Pagination" class="flex items-center space-x-1">
        <button class="relative inline-flex items-center px-3 py-2 text-xs font-bold text-slate-500 bg-white dark:bg-surface-dark dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
          <span class="material-icons-round text-sm">chevron_left</span> 上一页
        </button>
        <button class="z-10 bg-primary text-white relative inline-flex items-center px-4 py-2 text-xs font-bold rounded-md shadow-sm">1</button>
        <button class="bg-white dark:bg-surface-dark text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 relative inline-flex items-center px-4 py-2 text-xs font-bold rounded-md transition-all">2</button>
        <span class="relative inline-flex items-center px-4 py-2 text-xs font-bold text-slate-400 bg-transparent">...</span>
        <button class="bg-white dark:bg-surface-dark text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hidden md:inline-flex relative items-center px-4 py-2 text-xs font-bold rounded-md transition-all">100</button>
        <button class="relative inline-flex items-center px-3 py-2 text-xs font-bold text-slate-500 bg-white dark:bg-surface-dark dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
          下一页 <span class="material-icons-round text-sm">chevron_right</span>
        </button>
      </nav>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" @click="showDeleteModal = false"></div>
      <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-border-light dark:border-border-dark w-full max-w-md overflow-hidden relative z-10 animate-in zoom-in-95 duration-200">
        <div class="p-6">
          <div class="flex items-center gap-3 mb-4 text-rose-500">
            <span class="material-icons-round text-3xl">warning</span>
            <h3 class="text-lg font-bold">
              {{ isBatchDelete ? `确认批量彻底删除 ${selectedIds.length} 个 LFS 文件？` : '确认彻底删除 LFS 文件？' }}
            </h3>
          </div>
          
          <div v-if="!isBatchDelete" class="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 mb-5 border border-slate-100 dark:border-slate-800 font-mono text-sm text-slate-700 dark:text-slate-300">
            {{ itemToDelete?.name }}
          </div>
          <div v-else class="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 mb-5 border border-slate-100 dark:border-slate-800 max-h-32 overflow-y-auto custom-scrollbar">
            <ul class="space-y-1">
              <li v-for="id in selectedIds" :key="id" class="text-xs font-mono text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <span class="w-1 h-1 rounded-full bg-slate-400"></span>
                {{ lfsObjects.find(l => l.id === id)?.name }}
              </li>
            </ul>
          </div>

          <AlertBanner
            v-model="showSecurityAlert"
            type="warning"
            title="重要安全提示 (Repo Filter)"
            icon="security"
            :dismissible="false"
            class="mb-6"
          >
             <p class="text-xs leading-relaxed">直接删除 LFS 指针文件可能会导致该项目在后续拉取历史版本时报错。为了确保仓库健康，建议在删除后使用 <span class="font-bold">Repo Filter</span> 或 <span class="font-bold">BFG Repo-Cleaner</span> 清理所有分支的历史提交记录。</p>
          </AlertBanner>

          <div class="flex gap-3">
            <button 
              @click="showDeleteModal = false"
              class="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              我再想想
            </button>
            <button 
              @click="confirmDelete"
              class="flex-1 px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold shadow-lg shadow-rose-500/20 transition-all"
            >
              确认删除并知晓风险
            </button>
          </div>
        </div>
      </div>
    </div>

    <p class="text-center text-[11px] font-bold text-slate-400 mt-12 mb-4 uppercase tracking-widest">AtomGit Enterprise · © 2024</p>
  </div>
</template>

<script>
import AlertBanner from './AlertBanner.vue'

export default {
  name: 'LfsList',
  components: {
    AlertBanner
  },
  data() {
    return {
      showSecurityAlert: true,
      searchQuery: '',
      dimensionFilters: ['全部组织', '全部项目'],
      selectedIds: [],
      showDeleteModal: false,
      isBatchDelete: false,
      itemToDelete: null,
      lfsObjects: [
        {
          id: 1,
          name: 'training_model_v5.bin',
          size: '18.5 GB',
          repo: 'csdn / jupyter-notebook',
          sha: '90abe0d075755853145c96906a1300f57c167fcc9aad7221239b448abf54933c',
          updatedAt: '2024/01/26 11:15:58'
        },
        {
          id: 2,
          name: 'video_asset_final.mp4',
          size: '2.4 GB',
          repo: 'csdn / website-main',
          sha: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f',
          updatedAt: '2024/01/25 09:30:12'
        },
        {
          id: 3,
          name: 'large_dataset_2023.zip',
          size: '45.8 GB',
          repo: 'gitcode-dev / data-analysis',
          sha: 'f1e2d3c4b5a6987878787878787878787878787878787878787878787878787',
          updatedAt: '2024/01/24 16:45:00'
        },
        {
          id: 4,
          name: 'temp_backup_debug.log',
          size: '850 MB',
          repo: 'csdn / api-server',
          sha: '8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8',
          updatedAt: '2024/01/23 11:10:05'
        },
        {
          id: 5,
          name: 'android_build_v1.0.apk',
          size: '156 MB',
          repo: 'mobile-team / android-app',
          sha: '5d5d5d5d5d5d5d5d5d5d5d5d5d5d5d5d5d5d5d5d5d5d5d5d5d5d5d5d5d5d5d5',
          updatedAt: '2024/01/22 14:20:30'
        }
      ]
    }
  },
  computed: {
    filteredLfs() {
      if (!this.searchQuery) return this.lfsObjects
      const q = this.searchQuery.toLowerCase()
      return this.lfsObjects.filter(item => 
        item.name.toLowerCase().includes(q) || 
        item.sha.toLowerCase().includes(q)
      )
    },
    isAllSelected() {
      return this.lfsObjects.length > 0 && this.selectedIds.length === this.lfsObjects.length
    }
  },
  methods: {
    formatSha(sha) {
      return sha.substring(0, 10) + '...' + sha.substring(sha.length - 8)
    },
    toggleSelect(id) {
      const index = this.selectedIds.indexOf(id)
      if (index > -1) {
        this.selectedIds.splice(index, 1)
      } else {
        this.selectedIds.push(id)
      }
    },
    toggleSelectAll() {
      if (this.isAllSelected) {
        this.selectedIds = []
      } else {
        this.selectedIds = this.lfsObjects.map(item => item.id)
      }
    },
    handleDelete(lfs) {
      this.itemToDelete = lfs
      this.isBatchDelete = false
      this.showDeleteModal = true
    },
    confirmDelete() {
      if (this.isBatchDelete) {
        this.lfsObjects = this.lfsObjects.filter(item => !this.selectedIds.includes(item.id))
        this.selectedIds = []
      } else if (this.itemToDelete) {
        this.lfsObjects = this.lfsObjects.filter(item => item.id !== this.itemToDelete.id)
      }
      this.showDeleteModal = false
      this.itemToDelete = null
      this.isBatchDelete = false
    },
    batchDelete() {
      this.isBatchDelete = true
      this.itemToDelete = null
      this.showDeleteModal = true
    }
  }
}
</script>

<style scoped>
.shadow-soft {
  box-shadow: 0 4px 20px -5px rgba(0, 0, 0, 0.05);
}
@keyframes bounce-short {
  0%, 100% { transform: translate(-50%, 0); }
  50% { transform: translate(-50%, -5px); }
}
.animate-bounce-short {
  animation: bounce-short 2s infinite;
}
</style>
