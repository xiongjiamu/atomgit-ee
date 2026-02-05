<template>
  <aside class="w-64 flex-shrink-0 bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark hidden lg:block overflow-y-auto custom-scrollbar h-full shadow-sm">
    <div class="py-8 px-4 space-y-8">
      <div>
        <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-3 opacity-70">激励体系 · Incentives</h3>
        <nav class="space-y-1.5">
          <a
            v-for="item in activeItems"
            :key="item.id"
            href="#"
            @click.prevent="$emit('category-change', item.id)"
            :class="[
              activeCategory === item.id
                ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02] active'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:pl-5',
              'group flex items-center justify-between px-4 py-3 text-sm font-black rounded-xl transition-all duration-300 no-underline'
            ]"
          >
            <div class="flex items-center">
              <span
                class="material-icons-round mr-3 text-xl transition-transform group-hover:scale-110"
                :class="activeCategory === item.id ? 'text-white' : 'text-slate-400'"
              >
                {{ item.icon }}
              </span>
              <span class="tracking-tight">{{ item.name }}</span>
            </div>
            <span
              v-if="item.count"
              :class="[
                activeCategory === item.id
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-slate-200 dark:group-hover:bg-slate-700',
                'py-0.5 px-2 rounded-lg text-[10px] font-black transition-colors'
              ]"
            >
              {{ item.count }}
            </span>
          </a>
        </nav>
      </div>

      <div>
        <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-3 opacity-70">荣誉体系 · Recognition</h3>
        <nav class="space-y-1.5">
          <a
            v-for="item in honorItems"
            :key="item.id"
            href="#"
            @click.prevent="$emit('category-change', item.id)"
            :class="[
              activeCategory === item.id
                ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02] active'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:pl-5',
              'group flex items-center px-4 py-3 text-sm font-black rounded-xl transition-all duration-300 no-underline'
            ]"
          >
            <span
              class="material-icons-round mr-3 text-xl transition-transform group-hover:scale-110"
              :class="activeCategory === item.id ? 'text-white' : 'text-slate-400'"
            >
              {{ item.icon }}
            </span>
            <span class="tracking-tight">{{ item.name }}</span>
          </a>
        </nav>
      </div>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'OperationSidebar',
  props: {
    activeCategory: {
      type: String,
      default: 'points'
    }
  },
  data() {
    return {
      activeItems: [
        { id: 'points', name: '积分规则', icon: 'flag', count: 121 },
        { id: 'user_points', name: '用户积分管理', icon: 'person_outline' },
        { id: 'gift_management', name: '兑换礼品管理', icon: 'redeem', count: 38 },
        { id: 'fulfillment', name: '兑换履约管理', icon: 'inventory_2' }
      ],
      honorItems: [
        { id: 'medals', name: '勋章与任务', icon: 'emoji_events' }
      ]
    }
  }
}
</script>
