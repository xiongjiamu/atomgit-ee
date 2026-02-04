<template>
  <div class="flex flex-1 overflow-hidden bg-background-light dark:bg-background-dark">
    <!-- Sidebar -->
    <ComplianceSidebar
      :active-category="currentCategory"
      @category-change="handleCategoryChange"
    />

    <!-- Main Content Area -->
    <main class="flex-1 overflow-y-auto custom-scrollbar relative">
      <div class="max-w-[1920px] mx-auto p-8 min-h-full">
        <!-- Render current category component -->
        <template v-if="currentCategory === 'overview'">
          <SecurityOverview 
            :selected-view="selectedView" 
            @view-change="handleViewChange" 
          />
        </template>
        <template v-else-if="currentCategory === 'trust'">
          <TrustedGovernance 
            :selected-view="selectedView" 
            @view-change="handleViewChange" 
          />
        </template>
        <template v-else-if="currentCategory === 'sbom'">
          <SbomAnalysis 
            :selected-view="selectedView" 
            @view-change="handleViewChange" 
          />
        </template>
        <template v-else-if="currentCategory === 'cve'">
          <CveManagement 
            :selected-view="selectedView" 
            @view-change="handleViewChange" 
          />
        </template>
        <template v-else-if="currentCategory === 'cla'">
          <ClaCompliance 
            :selected-view="selectedView" 
            @view-change="handleViewChange" 
          />
        </template>
        <!-- Placeholder for other categories -->
        <template v-else>
          <div class="flex flex-col items-center justify-center h-full py-20 text-center">
            <div class="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-6">
              <span class="material-icons-round text-4xl text-slate-400">construction</span>
            </div>
            <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{{ categoryName }} 模块开发中</h2>
            <p class="text-slate-500 mt-2 font-medium">我们正在全力构建 {{ categoryName }} 的可视化治理能力。</p>
            <button 
              @click="currentCategory = 'overview'"
              class="mt-8 px-6 py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 transition-all hover:-translate-y-1 active:scale-95"
            >
              返回安全总览
            </button>
          </div>
        </template>
      </div>
    </main>
  </div>
</template>

<script>
import ComplianceSidebar from './ComplianceSidebar.vue'
import SecurityOverview from './SecurityOverview.vue'
import TrustedGovernance from './TrustedGovernance.vue'
import SbomAnalysis from './SbomAnalysis.vue'
import CveManagement from './CveManagement.vue'
import ClaCompliance from './ClaCompliance.vue'

export default {
  name: 'ComplianceCenter',
  components: {
    ComplianceSidebar,
    SecurityOverview,
    TrustedGovernance,
    SbomAnalysis,
    CveManagement,
    ClaCompliance
  },
  data() {
    return {
      currentCategory: 'overview',
      selectedView: { id: 'enterprise', label: '全企业视图 (Enterprise)', orgId: 'enterprise' }
    }
  },
  computed: {
    categoryName() {
      const names = {
        'overview': '安全总览',
        'trust': '开源可信治理',
        'cve': '漏洞管理 (CVE)',
        'cla': '合规 (CLA/DCO)'
      }
      return names[this.currentCategory] || '合规管理'
    }
  },
  methods: {
    handleCategoryChange(categoryId) {
      this.currentCategory = categoryId
      console.log('Compliance category changed to:', categoryId)
    },
    handleViewChange(view) {
      this.selectedView = view
      console.log('Compliance view updated:', view)
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
