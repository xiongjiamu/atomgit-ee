<template>
  <div class="flex flex-1 overflow-hidden bg-background-light dark:bg-background-dark">
    <!-- Sidebar -->
    <OperationSidebar
      :active-category="currentCategory"
      @category-change="handleCategoryChange"
    />

    <!-- Main Content Area -->
    <main class="flex-1 overflow-y-auto custom-scrollbar relative">
      <div class="max-w-[1920px] mx-auto p-8 min-h-full">
        <!-- Render current category component -->
        <template v-if="currentCategory === 'points'">
          <PointRules />
        </template>
        <template v-else-if="currentCategory === 'user_points'">
          <UserPoints />
        </template>
        <template v-else-if="currentCategory === 'fulfillment'">
          <FulfillmentManagement />
        </template>
        <template v-else-if="currentCategory === 'medals'">
          <MedalManagement />
        </template>
        <template v-else>
          <div class="py-32 flex flex-col items-center justify-center text-center">
            <div class="relative mb-8">
              <div class="absolute inset-0 bg-primary/5 rounded-full blur-3xl scale-150 animate-pulse"></div>
              <div class="relative w-24 h-24 bg-surface-light dark:bg-surface-darkborder border-border-light dark:border-border-darkrounded-xl shadow-soft flex items-center justify-center">
                <span class="material-icons-round text-5xl text-slate-300 dark:text-slate-600 animate-bounce">construction</span>
              </div>
            </div>
            <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
              该功能正在全力构建中
            </h2>
            <p class="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed font-medium">
              我们正在为您打造更强大的社区治理工具，包括用户画像管理与进阶勋章体系，敬请期待。
            </p>
            <div class="mt-10 flex gap-4">
              <div class="h-1.5 w-12 bg-primary/20 rounded-full overflow-hidden">
                <div class="h-full bg-primary animate-[shimmer_2s_infinite]"></div>
              </div>
              <div class="h-1.5 w-12 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
              <div class="h-1.5 w-12 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
            </div>
          </div>
        </template>
      </div>
    </main>
  </div>
</template>

<script>
import OperationSidebar from './OperationSidebar.vue'
import PointRules from './PointRules.vue'
import UserPoints from './UserPoints.vue'
import FulfillmentManagement from './FulfillmentManagement.vue'
import MedalManagement from './MedalManagement.vue'

export default {
  name: 'OperationCenter',
  components: {
    OperationSidebar,
    PointRules,
    UserPoints,
    FulfillmentManagement,
    MedalManagement
  },
  data() {
    return {
      currentCategory: 'points'
    }
  },
  methods: {
    handleCategoryChange(categoryId) {
      this.currentCategory = categoryId
      console.log('Operation category changed to:', categoryId)
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
