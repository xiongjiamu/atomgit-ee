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
        <template v-else-if="currentCategory === 'roles'">
          <RoleManagement />
        </template>
        <template v-else-if="currentCategory === 'orgs'">
          <OrgManagement />
        </template>
        <template v-else-if="currentCategory === 'runners'">
          <RunnerManagement />
        </template>
        <template v-else-if="currentCategory === 'webhooks'">
          <WebhookManagement />
        </template>
        
        <!-- Placeholder for other categories -->
        <template v-else>
          <div class="flex flex-col items-center justify-center h-full py-20 text-center">
            <div class="w-32 h-32 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center mb-10 shadow-inner group">
              <span class="material-icons-round text-5xl text-slate-300 group-hover:text-primary transition-colors duration-500">construction</span>
            </div>
            <h2 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{{ categoryName }} 模块完善中</h2>
            <p class="text-slate-500 mt-4 font-medium max-w-md mx-auto">我们正在构建企业级设置功能，为您提供更精细的权限和资源控制。</p>
            <button 
              @click="currentCategory = 'members'"
              class="mt-12 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl transition-all hover:-translate-y-1 active:scale-95"
            >
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
import RoleManagement from './RoleManagement.vue'
import OrgManagement from './OrgManagement.vue'
import RunnerManagement from './RunnerManagement.vue'
import WebhookManagement from './WebhookManagement.vue'

export default {
  name: 'SettingsCenter',
  components: {
    SettingsSidebar,
    MemberManagement,
    RoleManagement,
    OrgManagement,
    RunnerManagement,
    WebhookManagement
  },
  data() {
    return {
      currentCategory: 'members'
    }
  },
  computed: {
    categoryName() {
      const names = {
        'members': '企业成员管理',
        'roles': '角色与权限',
        'orgs': '组织管理',
        'runners': '构建资源',
        'webhooks': '企业 WebHooks',
        'tokens': 'Token 管理',
        'rulesets': '规则集',
        'ip_whitelist': 'IP 白名单',
        'cla_config': '合规设置',
        'audit_logs': '审计日志',
        'issue_conf': 'Issue 配置',
        'announcements': '企业公告',
        'knowledge_sync': '知识库同步'
      }
      return names[this.currentCategory] || '设置'
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
  background: rgba(148, 163, 184, 0.2);
  border-radius: 0.75rem;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.3);
}
</style>
