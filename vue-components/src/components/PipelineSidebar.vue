<template>
  <aside class="w-64 flex-shrink-0 bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark hidden lg:block overflow-y-auto custom-scrollbar h-full shadow-sm">
    <div class="py-8 px-4">
      <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-3 opacity-70">流水线管理 · Pipelines</h3>
      <nav class="space-y-1.5">
        <a
          v-for="item in navItems"
          :key="item.id"
          href="#"
          @click.prevent="$emit('category-change', item.id)"
          :class="[
            activeCategory === item.id
              ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02] active'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:pl-5',
            'group flex items-center px-4 py-3 text-sm font-black rounded-xl transition-all duration-300 no-underline'
          ]"
        >
          <span
            class="material-icons-round mr-3 text-xl"
            :class="activeCategory === item.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-500'"
          >
            {{ item.icon }}
          </span>
          {{ item.name }}
        </a>
      </nav>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'PipelineSidebar',
  props: {
    activeCategory: {
      type: String,
      default: 'logs'
    }
  },
  data() {
    return {
      navItems: [
        { id: 'logs', name: '运行记录', icon: 'history' },
        { id: 'usage', name: '用量报告', icon: 'insights' },
        { id: 'quality', name: '质量报告', icon: 'fact_check' }
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
