<template>
  <aside class="w-64 flex-shrink-0 bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark hidden lg:block overflow-y-auto custom-scrollbar h-full">
    <div class="py-8 px-4 space-y-8">
      <div v-for="section in sections" :key="section.title">
        <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">{{ section.title }}</h3>
        <nav class="space-y-1">
          <a
            v-for="item in section.items"
            :key="item.id"
            href="#"
            @click.prevent="$emit('category-change', item.id)"
            :class="[
              activeCategory === item.id
                ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 dark:shadow-slate-900/20 active:scale-95 active'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
              'group flex items-center justify-between px-4 py-3.5 text-sm font-bold rounded-xl transition-all no-underline'
            ]"
          >
            <div class="flex items-center">
              <span
                class="material-icons-round mr-3 text-xl"
                :class="activeCategory === item.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-500'"
              >
                {{ item.icon }}
              </span>
              {{ item.name }}
            </div>
            <span 
              v-if="item.count" 
              :class="[
                'text-[10px] px-1.5 py-0.5 rounded-lg font-black',
                activeCategory === item.id ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              ]"
            >
              {{ item.count }}
            </span>
          </a>
        </nav>
      </div>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'SettingsSidebar',
  props: {
    activeCategory: {
      type: String,
      default: 'members'
    }
  },
  data() {
    return {
      sections: [
        {
          title: '组织与成员',
          items: [
            { id: 'members', name: '企业成员管理', icon: 'group', count: 121 },
            { id: 'roles', name: '角色与权限', icon: 'badge', count: 12 },
            { id: 'orgs', name: '组织管理', icon: 'domain', count: 121 }
          ]
        },
        {
          title: 'DevOps 基础设施',
          items: [
            { id: 'runners', name: '构建资源 (Runners)', icon: 'layers' },
            { id: 'webhooks', name: '企业 WebHooks', icon: 'webhook' },
            { id: 'tokens', name: '企业 Token 管理', icon: 'key' }
          ]
        },
        {
          title: '安全与策略',
          items: [
            { id: 'rulesets', name: 'Rulesets 规则集', icon: 'policy', count: 20 },
            { id: 'ip_whitelist', name: 'IP 白名单', icon: 'network_check' },
            { id: 'cla_config', name: '合规设置 (CLA)', icon: 'gavel' },
            { id: 'audit_logs', name: '审计日志', icon: 'receipt_long' }
          ]
        },
        {
          title: '运营配置',
          items: [
            { id: 'issue_conf', name: 'Issue 字段配置', icon: 'settings_applications' },
            { id: 'announcements', name: '企业公告', icon: 'campaign' }
          ]
        }
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
