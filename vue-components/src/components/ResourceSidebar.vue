<template>
  <aside class="w-64 flex-shrink-0 bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark hidden lg:block overflow-y-auto custom-scrollbar h-full shadow-sm">
    <div class="py-8 px-4 space-y-8">
      <div>
        <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-3 opacity-70">资源中心 · Resources</h3>
        <nav class="space-y-1">
          <a
            v-for="item in resourceItems"
            :key="item.id"
            href="#"
            @click.prevent="$emit('category-change', item.id)"
            :class="[
              activeCategory === item.id
                ? 'bg-primary text-white shadow-lg shadow-primary/20 active'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
              'group flex items-center justify-between px-4 py-3 text-sm font-bold rounded-xl transition-all no-underline'
            ]"
          >
            <div class="flex items-center">
              <span
                class="material-icons-round mr-3 text-lg"
                :class="activeCategory === item.id ? 'opacity-90' : 'text-slate-400 group-hover:text-slate-500'"
              >
                {{ item.icon }}
              </span>
              {{ item.name }}
            </div>
            <span
              :class="[
                activeCategory === item.id
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-600',
                'py-0.5 px-2 rounded-full text-xs transition-colors'
              ]"
            >
              {{ item.count }}
            </span>
          </a>
        </nav>
      </div>

      <div>
        <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-3 opacity-70">预警与治理 · Security</h3>
        <nav class="space-y-1">
          <a
            v-for="item in warningItems"
            :key="item.id"
            href="#"
            @click.prevent="$emit('category-change', item.id)"
            :class="[
              activeCategory === item.id
                ? 'bg-primary/10 text-primary hover:bg-primary/20 active'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
              'group flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-colors no-underline'
            ]"
          >
            <span
              class="material-icons-round mr-3 text-lg"
              :class="activeCategory === item.id ? 'text-primary' : 'text-slate-400 group-hover:text-slate-500'"
            >
              {{ item.icon }}
            </span>
            {{ item.name }}
          </a>
        </nav>
      </div>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'ResourceSidebar',
  props: {
    activeCategory: {
      type: String,
      default: 'issues'
    }
  },
  data() {
    return {
      resourceItems: [
        { id: 'issues', name: '企业 Issues', icon: 'adjust', count: 121 },
        { id: 'kanban', name: '企业看板', icon: 'view_kanban', count: 121 },
        { id: 'pull_requests', name: 'Pull Requests', icon: 'call_merge', count: 132 },
        { id: 'projects', name: '企业项目', icon: 'folder_copy', count: 65 },
        { id: 'milestones', name: '企业里程碑', icon: 'flag', count: 121 }
      ],
      warningItems: [
        { id: 'lfs', name: '企业 LFS', icon: 'storage' },
        { id: 'warning', name: '资源使用预警', icon: 'warning' }
      ]
    }
  }
}
</script>
