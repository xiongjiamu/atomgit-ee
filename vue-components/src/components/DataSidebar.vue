<template>
  <aside class="w-64 flex-shrink-0 bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark hidden lg:block overflow-y-auto custom-scrollbar h-full">
    <div class="py-8 px-4">
      <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 px-2">企业数据视图</h3>
      <nav class="space-y-1">
        <a
          v-for="item in navItems"
          :key="item.id"
          href="#"
          @click.prevent="$emit('category-change', item.id)"
          :class="[
            activeCategory === item.id
              ? 'bg-amber-500 text-white shadow-lg shadow-amber-200 dark:shadow-amber-900/20 active'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
            'group flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all no-underline'
          ]"
        >
          <div
            :class="[
              'w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-colors',
              activeCategory === item.id ? 'bg-white/20' : 'bg-slate-50 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
            ]"
          >
            <span
              class="material-icons-round text-lg"
              :class="activeCategory === item.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-500'"
            >
              {{ item.icon }}
            </span>
          </div>
          {{ item.name }}
        </a>
      </nav>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'DataSidebar',
  props: {
    activeCategory: {
      type: String,
      default: 'traffic'
    }
  },
  data() {
    return {
      navItems: [
        { id: 'traffic', name: '流量与用户', icon: 'visibility' },
        { id: 'efficiency', name: '生产与效能', icon: 'bolt' },
        { id: 'ecology', name: '贡献与生态', icon: 'hub' },
        { id: 'cost', name: '资源与成本', icon: 'payments' }
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
