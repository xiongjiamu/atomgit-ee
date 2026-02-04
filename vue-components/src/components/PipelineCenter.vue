<template>
  <div class="flex flex-1 overflow-hidden bg-background-light dark:bg-background-dark">
    <!-- Sidebar -->
    <PipelineSidebar
      :active-category="currentCategory"
      @category-change="handleCategoryChange"
    />

    <!-- Main Content Area -->
    <main class="flex-1 overflow-y-auto custom-scrollbar relative">
      <div class="max-w-[1920px] mx-auto p-8 min-h-full">
        <!-- Render current category component -->
        <template v-if="currentCategory === 'logs'">
          <ExecutionRecord 
            :selected-view="selectedView" 
            @view-change="handleViewChange" 
          />
        </template>
        <template v-else-if="currentCategory === 'usage'">
          <UsageReport 
            :selected-view="selectedView" 
            @view-change="handleViewChange" 
          />
        </template>
        <template v-else-if="currentCategory === 'quality'">
          <QualityReport 
            :selected-view="selectedView" 
            @view-change="handleViewChange" 
          />
        </template>
      </div>
    </main>
  </div>
</template>

<script>
import PipelineSidebar from './PipelineSidebar.vue'
import ExecutionRecord from './ExecutionRecord.vue'
import UsageReport from './UsageReport.vue'
import QualityReport from './QualityReport.vue'

export default {
  name: 'PipelineCenter',
  components: {
    PipelineSidebar,
    ExecutionRecord,
    UsageReport,
    QualityReport
  },
  data() {
    return {
      currentCategory: 'logs',
      selectedView: { id: 'enterprise', label: '全企业视图 (Enterprise)', orgId: 'enterprise' }
    }
  },
  methods: {
    handleCategoryChange(categoryId) {
      this.currentCategory = categoryId
      console.log('Pipeline category changed to:', categoryId)
    },
    handleViewChange(view) {
      this.selectedView = view
      console.log('Global view updated:', view)
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
