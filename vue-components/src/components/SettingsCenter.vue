<template>
  <div class="flex flex-1 overflow-hidden bg-background-light dark:bg-background-dark">
    <!-- Sidebar -->
    <SettingsSidebar
      :active-category="currentCategory"
      @category-change="handleCategoryChange"
    />

    <!-- Main Content Area -->
    <main class="flex-1 overflow-y-auto custom-scrollbar relative">
      <div class="max-w-[1920px] mx-auto p-12 h-full">
        <!-- Render current category component -->
        <template v-if="currentCategory === 'members'">
          <MemberManagement />
        </template>
        <!-- Placeholder for other categories -->
        <template v-else>
          <div class="flex flex-col items-center justify-center h-full py-20 text-center">
             <div class="relative mb-10">
                <div class="w-32 h-32 bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center shadow-inner">
                  <span class="material-icons-round text-5xl text-slate-300">settings_suggest</span>
                </div>
                <div class="absolute -right-2 -bottom-2 w-10 h-10 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
                  <span class="material-icons-round text-lg">build</span>
                </div>
             </div>
            <h2 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{{ categoryName }} 配置升级中</h2>
            <p class="text-slate-500 mt-4 font-medium max-w-lg mx-auto leading-relaxed">我们正致力于将该模块的配置体验升级到更高标准，以支撑更大规模的企业协同能力。</p>
            <button 
              @click="currentCategory = 'members'"
              class="mt-12 px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest shadow-2xl transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3"
            >
              <span class="material-icons-round text-sm">arrow_back</span>
              返回成员管理
            </button>
          </div>
        </template>
      </div>
    </main>
  </div>
</template>

<script>
import SettingsSidebar from './SettingsSidebar.vue'
import MemberManagement from './MemberManagement.vue'

export default {
  name: 'SettingsCenter',
  components: {
    SettingsSidebar,
    MemberManagement
  },
  data() {
    return {
      currentCategory: 'members'
    }
  },
  computed: {
    categoryName() {
      const names = {
        'members': '成员管理',
        'roles': '角色权限',
        'orgs': '组织管理',
        'runners': '构建资源',
        'webhooks': 'WebHooks',
        'tokens': 'Token 管理',
        'rulesets': '规则集',
        'ip_whitelist': 'IP 白名单',
        'cla_config': '合规设置',
        'audit_logs': '审计日志',
        'issue_conf': 'Issue 字段',
        'announcements': '企业公告'
      }
      return names[this.currentCategory] || '企业设置'
    }
  },
  methods: {
    handleCategoryChange(categoryId) {
      this.currentCategory = categoryId
      console.log('Settings category changed to:', categoryId)
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
