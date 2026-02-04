<template>
  <div class="flex flex-1 overflow-hidden bg-background-light dark:bg-background-dark">
    <!-- Sidebar -->
    <BillingSidebar
      :active-category="currentCategory"
      @category-change="handleCategoryChange"
    />

    <!-- Main Content Area -->
    <main class="flex-1 overflow-y-auto custom-scrollbar relative">
      <div class="max-w-[1920px] mx-auto p-12 h-full">
        <!-- Render current category component -->
        <template v-if="currentCategory === 'overview'">
          <BillingOverview />
        </template>
        <!-- Placeholder for other categories -->
        <template v-else>
          <div class="flex flex-col items-center justify-center h-full py-20 text-center">
            <div class="w-32 h-32 bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-inner group">
              <span class="material-icons-round text-5xl text-slate-300 group-hover:text-primary transition-colors duration-500">payments</span>
            </div>
            <h2 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{{ categoryName }} 模块完善中</h2>
            <p class="text-slate-500 mt-4 font-medium max-w-md mx-auto">我们正在优化财务结算流程，为您提供更清晰、更高效的账单管理体验。</p>
            <button 
              @click="currentCategory = 'overview'"
              class="mt-12 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest shadow-2xl transition-all hover:-translate-y-1 active:scale-95"
            >
              返回账单总览
            </button>
          </div>
        </template>
      </div>
    </main>
  </div>
</template>

<script>
import BillingSidebar from './BillingSidebar.vue'
import BillingOverview from './BillingOverview.vue'

export default {
  name: 'BillingCenter',
  components: {
    BillingSidebar,
    BillingOverview
  },
  data() {
    return {
      currentCategory: 'overview'
    }
  },
  computed: {
    categoryName() {
      const names = {
        'overview': '账单总览',
        'records': '付费记录',
        'invoice': '发票管理',
        'payment': '支付设置'
      }
      return names[this.currentCategory] || '账单管理'
    }
  },
  methods: {
    handleCategoryChange(categoryId) {
      this.currentCategory = categoryId
      console.log('Billing category changed to:', categoryId)
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
