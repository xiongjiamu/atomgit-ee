<template>
  <aside class="w-64 flex-shrink-0 bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark hidden lg:block overflow-y-auto custom-scrollbar h-full shadow-sm">
    <div class="py-8 px-4 space-y-8">
      <div>
        <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-3 opacity-70">安全能力 · Capabilities</h3>
        <nav class="space-y-1.5">
          <a
            v-for="item in securityItems"
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

      <div>
        <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-3 opacity-70">治理结果 · Analytics</h3>
        <nav class="space-y-1.5">
          <a
            v-for="item in reportItems"
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
  name: 'ComplianceSidebar',
  props: {
    activeCategory: {
      type: String,
      default: 'sbom'
    }
  },
  data() {
    return {
      securityItems: [
        { id: 'overview', name: '安全总览', icon: 'shield' },
        { id: 'trust', name: '开源可信治理', icon: 'verified_user' }
      ],
      reportItems: [
        { id: 'sbom', name: '成分分析 (SBOM)', icon: 'flag' },
        { id: 'cve', name: '漏洞管理 (CVE)', icon: 'bug_report' },
        { id: 'cla', name: '合规 (CLA/DCO)', icon: 'rule' }
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
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.25);
}
</style>
