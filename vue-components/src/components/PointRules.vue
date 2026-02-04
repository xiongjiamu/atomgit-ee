<template>
  <div class="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <!-- Search Bar -->
    <div class="relative rounded-md shadow-sm">
      <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
        <span class="material-icons-round text-slate-400 text-xl">search</span>
      </div>
      <input
        type="text"
        class="focus:ring-primary focus:border-primary block w-full pl-10 pr-4 py-3 sm:text-sm border-slate-300 dark:border-slate-700 dark:bg-surface-dark dark:text-white rounded-xl transition-all shadow-sm placeholder-slate-400"
        placeholder="搜索奖励行为、事件名称或规则描述..."
      />
    </div>

    <!-- Filter Toolbar -->
    <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-border-light dark:border-border-dark pb-4">
      <!-- Status Tabs -->
      <div class="flex items-center space-x-1 p-1 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800/50 w-fit">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
            activeTab === tab.id
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-900/5 dark:ring-slate-500/20'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700/50'
          ]"
        >
          <span>{{ tab.label }}</span>
          <span :class="[
            'px-1.5 py-0.5 rounded-md text-xs font-semibold',
            activeTab === tab.id ? 'bg-slate-100 dark:bg-slate-600' : 'bg-transparent text-slate-400'
          ]">{{ tab.count }}</span>
        </button>
      </div>

      <!-- Actions & Extra Filters -->
      <div class="flex items-center flex-wrap gap-2">
        <div class="relative group">
          <button class="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all">
            <span>激励类型</span>
            <span class="material-icons-round text-sm opacity-50">expand_more</span>
          </button>
        </div>
        <div class="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>
        <button class="btn btn-primary !py-1.5 !px-4 !text-xs !rounded-full shadow-sm" @click="showAddRuleModal = true">
          <span class="material-icons-round text-sm">add</span>
          新增规则
        </button>
      </div>
    </div>

    <!-- Point Rules List -->
    <div class="space-y-3">
      <div
        v-for="rule in filteredRules"
        :key="rule.id"
        class="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-5 hover:shadow-soft hover:border-primary dark:hover:border-slate-600 transition-all group relative"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-start gap-4 flex-1 min-w-0">
            <div :class="[
              'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm transition-colors',
              rule.enabled ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
            ]">
              <span class="material-icons-round">{{ rule.enabled ? 'bolt' : 'flash_off' }}</span>
            </div>
            
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <h3 class="text-base font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors truncate">
                  {{ rule.event }}
                </h3>
                <span class="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black border border-emerald-100 dark:border-emerald-800/30">
                  +{{ rule.points }} 积分
                </span>
              </div>
              
              <div class="flex items-center text-xs text-slate-500 dark:text-slate-400 space-x-3 flex-wrap gap-y-2">
                <span class="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">{{ rule.code }}</span>
                <span class="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                <div class="flex items-center gap-2">
                  <span v-for="limit in rule.limits" :key="limit" class="flex items-center gap-1 opacity-80">
                    <span class="material-icons-round text-[14px]">info_outline</span>
                    {{ limit }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Toggle Switch & Actions -->
          <div class="flex items-center gap-6 ml-4">
            <div class="flex flex-col items-end">
              <span :class="['text-[10px] font-bold uppercase tracking-widest mb-1.5', rule.enabled ? 'text-emerald-500' : 'text-slate-400']">
                {{ rule.enabled ? '已启用' : '已停用' }}
              </span>
              <button 
                @click="rule.enabled = !rule.enabled"
                :class="[
                  'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow-sm',
                  rule.enabled ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
                ]"
              >
                <span 
                  :class="[
                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out',
                    rule.enabled ? 'translate-x-5' : 'translate-x-0'
                  ]"
                ></span>
              </button>
            </div>
            
            <div class="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
               <button class="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-all">
                <span class="material-icons-round text-lg">edit</span>
              </button>
              <button class="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded transition-all">
                <span class="material-icons-round text-lg">delete_outline</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="mt-8 flex justify-center pb-4">
      <nav aria-label="Pagination" class="flex items-center space-x-1">
        <button class="relative inline-flex items-center px-3 py-2 text-xs font-bold text-slate-500 bg-white dark:bg-surface-dark dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
          <span class="material-icons-round text-sm">chevron_left</span> 上一页
        </button>
        <button class="z-10 bg-primary text-white relative inline-flex items-center px-4 py-2 text-xs font-bold rounded-md shadow-sm">1</button>
        <button class="bg-white dark:bg-surface-dark text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 relative inline-flex items-center px-4 py-2 text-xs font-bold rounded-md transition-all">2</button>
        <button class="relative inline-flex items-center px-3 py-2 text-xs font-bold text-slate-500 bg-white dark:bg-surface-dark dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
          下一页 <span class="material-icons-round text-sm">chevron_right</span>
        </button>
      </nav>
    </div>
    
    <!-- Add Rule Modal -->
    <div v-if="showAddRuleModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" @click="closeModal"></div>
      <div class="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-border-light dark:border-border-dark w-full max-w-lg overflow-hidden relative z-10 animate-in zoom-in-95 duration-200">
        <div class="px-6 py-4 border-b border-border-light dark:border-border-dark flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span class="material-icons-round text-primary">add_circle</span>
            新增激励规则
          </h3>
          <button @click="closeModal" class="text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 transition-colors">
            <span class="material-icons-round text-xl">close</span>
          </button>
        </div>
        
        <div class="p-6 space-y-5">
          <!-- Event Name -->
          <div>
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">触发事件名称</label>
            <input 
              v-model="newRule.event"
              type="text" 
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
              placeholder="例如：提交高质量代码评论"
            />
          </div>

          <!-- Event Code -->
          <div>
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">事件代码 (Code)</label>
            <input 
              v-model="newRule.code"
              type="text" 
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-mono"
              placeholder="例如：code.comment.created"
            />
          </div>

          <!-- Points & Type -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">奖励数值</label>
              <div class="relative">
                <input 
                  v-model="newRule.points"
                  type="number" 
                  class="w-full pl-4 pr-12 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  placeholder="50"
                />
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span class="text-xs font-bold text-slate-400">PTS</span>
                </div>
              </div>
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">规则类型</label>
              <select class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm appearance-none">
                <option>行为激励 (Earning)</option>
                <option>惩罚扣除 (Penalty)</option>
              </select>
            </div>
          </div>

          <!-- Limits -->
          <div>
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">风控限制 (每行一个)</label>
            <textarea 
              v-model="newRule.limits"
              rows="3"
              class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm resize-none"
              placeholder="每日上限 10 次&#10;同 IP 冷却 5 分钟"
            ></textarea>
          </div>
        </div>

        <div class="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-border-light dark:border-border-dark flex justify-end gap-3">
          <button 
            @click="closeModal"
            class="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            取消
          </button>
          <button 
            @click="saveRule"
            class="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
          >
            <span class="material-icons-round text-lg">save</span>
            保存规则
          </button>
        </div>
      </div>
    </div>

    <p class="text-center text-[11px] font-bold text-slate-400 mt-12 mb-4 uppercase tracking-widest">AtomGit Enterprise · © 2024</p>
  </div>
</template>

<script>
export default {
  name: 'PointRules',
  data() {
    return {
      showAddRuleModal: false,
      newRule: {
        event: '',
        code: '',
        points: '',
        limits: ''
      },
      activeTab: 'all',
      tabs: [
        { id: 'all', label: '全部规则', count: 12 },
        { id: 'active', label: '已启用', count: 8 },
        { id: 'inactive', label: '已停用', count: 4 }
      ],
      earningRules: [
        { 
          id: 1, 
          event: '合并 Pull Request', 
          code: 'code.merged', 
          points: 50, 
          limits: ['每日上限 5 次', '同仓库冷却 10min'],
          enabled: true 
        },
        { 
          id: 2, 
          event: '提交 Issue (被标记为有效)', 
          code: 'issue.created', 
          points: 10, 
          limits: ['每日上限 10 次', '需仓库维护者标记'],
          enabled: true 
        },
        { 
          id: 3, 
          event: '完善个人简历 / 技能栈', 
          code: 'user.profile_complete', 
          points: 100, 
          limits: ['仅限一次', '由组织管理员审核'],
          enabled: false 
        },
        { 
          id: 4, 
          event: '技术文章投稿', 
          code: 'article.published', 
          points: 200, 
          limits: ['每日上限 1 次', '需通过社区审核层'],
          enabled: true 
        }
      ]
    }
  },
  computed: {
    filteredRules() {
      if (this.activeTab === 'all') return this.earningRules
      return this.earningRules.filter(r => r.enabled === (this.activeTab === 'active'))
    }
  },
  methods: {
    closeModal() {
      this.showAddRuleModal = false
      this.newRule = { event: '', code: '', points: '', limits: '' }
    },
    saveRule() {
      if (!this.newRule.event || !this.newRule.points) return // Simple validation

      const rule = {
        id: this.earningRules.length + 1,
        event: this.newRule.event,
        code: this.newRule.code,
        points: parseInt(this.newRule.points),
        limits: this.newRule.limits.split('\n').filter(l => l.trim()),
        enabled: true
      }
      
      this.earningRules.unshift(rule)
      this.closeModal()
    }
  }
}
</script>

<style scoped>
.shadow-soft {
  box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.04);
}
</style>
