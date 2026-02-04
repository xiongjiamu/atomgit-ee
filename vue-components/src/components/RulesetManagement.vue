<template>
  <div class="ruleset-management space-y-8">
    <!-- Alerts -->
    <div class="flex flex-col gap-4">
      <div v-if="showResourceAlert" class="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-lg px-4 py-3 flex items-start justify-between text-sm transition-all shadow-sm">
        <div class="flex items-start text-amber-800 dark:text-amber-200">
          <span class="material-icons-outlined text-amber-600 dark:text-amber-400 mr-2 text-lg mt-0.5">warning</span>
          <span><span class="font-bold">资源预警：</span> 您企业当前的存储空间已使用 856GB (85%)，接近包年套餐上限，请关注资源消耗或及时扩容</span>
        </div>
        <button 
          class="text-amber-500 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-200 ml-2"
          @click="showResourceAlert = false"
        >
          <span class="material-icons-outlined text-lg">close</span>
        </button>
      </div>
      <div v-if="showAnnouncementAlert" class="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-lg px-4 py-3 flex items-start justify-between text-sm transition-all shadow-sm">
        <div class="flex items-start text-indigo-800 dark:text-indigo-200">
          <span class="material-icons-outlined text-indigo-600 dark:text-indigo-400 mr-2 text-lg mt-0.5">info</span>
          <span><span class="font-bold">企业公告：</span> AtomGit 将于本周五 22:00 进行版本升级，届时 CI/CD 服务可能会有短时闪断，请知悉</span>
        </div>
        <button 
          class="text-indigo-500 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-200 ml-2"
          @click="showAnnouncementAlert = false"
        >
          <span class="material-icons-outlined text-lg">close</span>
        </button>
      </div>
    </div>

    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Rulesets</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">分支保护规则集，用于统一管理和实施代码库的安全策略。</p>
      </div>
      <div class="flex items-center gap-3">
        <button 
          class="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg shadow-sm text-sm font-bold flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          @click="openPropertyModal"
        >
          <span class="material-icons-outlined text-lg">tune</span>
          自定义属性
        </button>
        <button 
          class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm text-sm font-bold flex items-center gap-2 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:outline-none active:scale-95"
          @click="openNewRuleModal"
        >
          <span class="material-icons text-sm">add</span>
          新建规则集
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="space-y-4">
      <!-- Ruleset Card -->
      <div 
        v-for="rule in rulesets" 
        :key="rule.id"
        class="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg p-6 flex items-start justify-between shadow-sm hover:shadow-md transition-shadow group"
      >
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0 w-12 h-12 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <span class="material-icons-outlined text-2xl">verified_user</span>
          </div>
          <div>
            <div class="flex items-center gap-3 mb-1">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors">{{ rule.name }}</h3>
              <span 
                v-if="rule.active"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 uppercase tracking-wide"
              >
                Active
              </span>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">
              {{ rule.desc }}
            </p>
          </div>
        </div>
        <button 
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="配置规则"
        >
          <span class="material-icons-outlined text-xl">settings</span>
        </button>
      </div>

      <!-- Empty State -->
      <div v-if="rulesets.length === 0" class="flex flex-col items-center justify-center py-24 bg-gray-50 dark:bg-gray-800/30 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
        <span class="material-icons-outlined text-5xl text-gray-300 dark:text-gray-600 mb-4">gpp_bad</span>
        <h3 class="text-base font-bold text-gray-900 dark:text-white">暂无规则集</h3>
        <p class="text-sm text-gray-500 mt-1">点击右上角新建规则集以开始保护您的分支。</p>
      </div>
    </div>

    <!-- Modals -->
    <new-rule-modal 
      :show="showNewRuleModal" 
      @close="closeNewRuleModal"
      @submit="handleNewRule"
    />

    <property-modal 
      :show="showPropertyModal" 
      @close="closePropertyModal"
      @save="handleSaveProperties"
    />

  </div>
</template>

<script>
import NewRuleModal from './NewRuleModal.vue'
import PropertyModal from './PropertyModal.vue'

export default {
  name: 'RulesetManagement',
  components: {
    NewRuleModal,
    PropertyModal
  },
  data() {
    return {
      showResourceAlert: true,
      showAnnouncementAlert: true,
      showNewRuleModal: false,
      showPropertyModal: false,
      rulesets: [
        { 
          id: 1, 
          name: '全员默认分支保护', 
          active: true, 
          desc: '强制开启 Code Review，必须 2 人以上批准，禁止强制推送。' 
        }
      ]
    }
  },
  methods: {
    openNewRuleModal() {
      console.log('Opening New Rule Modal')
      this.showNewRuleModal = true
    },
    closeNewRuleModal() {
      this.showNewRuleModal = false
    },
    openPropertyModal() {
      console.log('Opening Property Modal')
      this.showPropertyModal = true
    },
    closePropertyModal() {
      this.showPropertyModal = false
    },
    handleNewRule(data) {
      console.log('Creating New Rule:', data)
      this.rulesets.unshift({
        id: Date.now(),
        name: data.name,
        active: true,
        desc: this.generateDesc(data)
      })
    },
    handleSaveProperties(props) {
      console.log('Saved Properties:', props)
    },
    generateDesc(data) {
      const parts = []
      if (data.options.codeReview) parts.push('开启 Code Review')
      if (data.options.restrictPush) parts.push('限制推送')
      if (data.options.preventDelete) parts.push('禁止删除')
      return parts.join('，') || '自定义保护规则'
    }
  }
}
</script>
