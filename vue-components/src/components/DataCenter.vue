<template>
  <div class="flex flex-1 overflow-hidden bg-background-light dark:bg-background-dark">
    <!-- Sidebar -->
    <DataSidebar
      :active-category="currentCategory"
      @category-change="handleCategoryChange"
    />

    <!-- Main Content Area -->
    <main class="flex-1 overflow-y-auto custom-scrollbar relative">
      <div class="max-w-[1920px] mx-auto p-8 min-h-full">
        <!-- Render current category component -->
        <template v-if="currentCategory === 'traffic'">
          <TrafficAnalytics />
        </template>
        <!-- Placeholder for other categories -->
        <template v-else>
          <div class="flex flex-col items-center justify-center h-full py-20 text-center">
            <div class="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-6">
              <span class="material-icons-round text-4xl text-slate-400">analytics</span>
            </div>
            <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{{ categoryName }} 深度洞察建设中</h2>
            <p class="text-slate-500 mt-2 font-medium">我们正在接入更多维度的数据源，为您提供全方位的企业研发洞察。</p>
            <button 
              @click="currentCategory = 'traffic'"
              class="mt-8 px-6 py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 transition-all hover:-translate-y-1 active:scale-95"
            >
              返回流量与用户分析
            </button>
          </div>
        </template>
      </div>
    </main>
  </div>
</template>

<script>
import DataSidebar from './DataSidebar.vue'
import TrafficAnalytics from './TrafficAnalytics.vue'

export default {
  name: 'DataCenter',
  components: {
    DataSidebar,
    TrafficAnalytics
  },
  data() {
    return {
      currentCategory: 'traffic'
    }
  },
  computed: {
    categoryName() {
      const names = {
        'traffic': '流量与用户',
        'efficiency': '生产与效能',
        'ecology': '贡献与生态',
        'cost': '资源与成本'
      }
      return names[this.currentCategory] || '数据分析'
    }
  },
  methods: {
    handleCategoryChange(categoryId) {
      this.currentCategory = categoryId
      console.log('Data category changed to:', categoryId)
    }
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.1);
  border-radius: 0.75rem;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.2);
}
</style>
