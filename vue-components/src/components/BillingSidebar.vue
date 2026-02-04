<template>
  <aside class="w-64 flex-shrink-0 bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark hidden lg:block overflow-y-auto custom-scrollbar h-full">
    <div class="py-8 px-4">
      <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 px-2">账单中心</h3>
      <nav class="space-y-1">
        <a
          v-for="item in navItems"
          :key="item.id"
          href="#"
          @click.prevent="$emit('category-change', item.id)"
          :class="[
            activeCategory === item.id
              ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 dark:shadow-slate-900/20 active:scale-95 active'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
            'group flex items-center px-4 py-3.5 text-sm font-bold rounded-xl transition-all no-underline'
          ]"
        >
          <span
            class="material-icons-round mr-3 text-xl"
            :class="activeCategory === item.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-500'"
          >
            {{ item.icon }}
          </span>
          {{ item.name }}
          <div v-if="activeCategory === item.id" class="ml-auto w-1.5 h-1.5 rounded-full bg-white"></div>
        </a>
      </nav>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'BillingSidebar',
  props: {
    activeCategory: {
      type: String,
      default: 'overview'
    }
  },
  data() {
    return {
      navItems: [
        { id: 'overview', name: '账单总览', icon: 'account_balance_wallet' },
        { id: 'records', name: '付费记录', icon: 'receipt' },
        { id: 'invoice', name: '发票管理', icon: 'description' },
        { id: 'payment', name: '支付设置', icon: 'credit_card' }
      ]
    }
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.15);
  border-radius: 0.75rem;
}
</style>
