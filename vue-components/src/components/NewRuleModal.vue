<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="show"
        class="fixed top-0 left-0 right-0 bottom-0 z-[9999] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm overflow-y-auto"
        style="min-height: 100vh; min-height: 100dvh; margin: 0 !important;"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
        @click.self="$emit('close')"
      >
        <!-- Panel -->
        <Transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition-all duration-150 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div
            v-if="show"
            class="bg-white dark:bg-[#1C2128] rounded-xl text-left overflow-hidden shadow-2xl transform transition-all w-full max-w-2xl border border-gray-200 dark:border-gray-700 flex flex-col max-h-[90vh]"
            @click.stop
          >
              <!-- Header -->
              <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-[#161B22] shrink-0">
                <h3 class="text-lg leading-6 font-semibold text-gray-900 dark:text-white" id="modal-title">
                  新建规则集
                </h3>
                <button
                  class="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                  @click="$emit('close')"
                >
                  <span class="material-icons text-xl">close</span>
                </button>
              </div>

              <!-- Body -->
              <div class="px-6 py-6 overflow-y-auto">
                <form class="space-y-6">
                  <!-- Ruleset Name -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" for="ruleset-name">
                      规则集名称 <span class="text-red-500">*</span>
                    </label>
                    <input
                      id="ruleset-name"
                      v-model="formData.name"
                      type="text"
                      class="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                      placeholder="例如：Release 分支保护规则"
                    />
                    <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">为这个规则集起一个容易识别的名称。</p>
                  </div>

                  <!-- Target Repositories -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      目标项目 <span class="text-red-500">*</span>
                    </label>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">选择此规则集应用到哪些项目</p>
                    
                    <div class="space-y-3 border border-gray-200 dark:border-gray-700 rounded-md p-4 bg-gray-50 dark:bg-gray-800/50">
                      <!-- Option 1: All Repositories -->
                      <div class="relative flex items-start">
                        <div class="flex h-5 items-center">
                          <input
                            id="repo-all"
                            v-model="formData.repositoryTarget"
                            type="radio"
                            value="all"
                            class="h-4 w-4 border-gray-300 text-emerald-600 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 cursor-pointer"
                          />
                        </div>
                        <div class="ml-3 text-sm">
                          <label class="font-medium text-gray-700 dark:text-gray-200 cursor-pointer" for="repo-all">全部项目</label>
                          <p class="text-gray-500 dark:text-gray-400 text-xs mt-0.5">Include all current and future repositories</p>
                        </div>
                      </div>

                      <!-- Option 2: Specific Repositories -->
                      <div class="relative flex items-start">
                        <div class="flex h-5 items-center">
                          <input
                            id="repo-specific"
                            v-model="formData.repositoryTarget"
                            type="radio"
                            value="specific"
                            class="h-4 w-4 border-gray-300 text-emerald-600 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 cursor-pointer"
                          />
                        </div>
                        <div class="ml-3 text-sm flex-1">
                          <label class="font-medium text-gray-700 dark:text-gray-200 cursor-pointer" for="repo-specific">指定项目</label>
                          <p class="text-gray-500 dark:text-gray-400 text-xs mt-0.5">Applies only to specifically selected repositories</p>
                          
                          <!-- Specific Repository Selector -->
                          <div v-if="formData.repositoryTarget === 'specific'" class="mt-3">
                            <div class="relative">
                              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span class="material-icons text-gray-400 text-sm">search</span>
                              </div>
                              <input
                                type="text"
                                class="block w-full rounded-md pl-10 sm:text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-emerald-500 py-2"
                                placeholder="搜索并选择项目..."
                                @keydown.enter.prevent="addSpecificRepo"
                              />
                            </div>
                            <div class="mt-2 flex flex-wrap gap-2">
                              <span 
                                v-for="(repo, index) in formData.specificRepositories" 
                                :key="index"
                                class="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 py-0.5 pl-2.5 pr-1 text-xs font-medium text-emerald-700 dark:text-emerald-300"
                              >
                                <span class="material-icons text-[12px] mr-1">folder</span>
                                {{ repo }}
                                <button
                                  type="button"
                                  class="ml-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-800 hover:text-emerald-500 focus:bg-emerald-500 focus:text-white focus:outline-none transition-colors"
                                  @click="removeSpecificRepo(index)"
                                >
                                  <span class="sr-only">Remove</span>
                                  <span class="material-icons text-[10px]">close</span>
                                </button>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Option 3: Attribute-based Matching -->
                      <div class="relative flex items-start">
                        <div class="flex h-5 items-center">
                          <input
                            id="repo-attribute"
                            v-model="formData.repositoryTarget"
                            type="radio"
                            value="attribute"
                            class="h-4 w-4 border-gray-300 text-emerald-600 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 cursor-pointer"
                          />
                        </div>
                        <div class="ml-3 text-sm flex-1">
                          <label class="font-medium text-gray-700 dark:text-gray-200 cursor-pointer" for="repo-attribute">按规则匹配项目</label>
                          <p class="text-gray-500 dark:text-gray-400 text-xs mt-0.5">Applies to repositories that match now and in the future</p>
                          
                          <!-- Attribute Matching Rules -->
                          <div v-if="formData.repositoryTarget === 'attribute'" class="mt-3 space-y-2">
                            <div v-for="(rule, index) in formData.attributeRules" :key="index" class="flex flex-col gap-2">
                              <div class="flex gap-2">
                                <select
                                  v-model="rule.attribute"
                                  class="flex-1 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm text-gray-900 dark:text-white"
                                >
                                  <option value="visibility">可见性 (Visibility)</option>
                                  <option value="language">主语言 (Language)</option>
                                  <option value="organization">所属组织 (Organization)</option>
                                  <option value="tag">标签 (Tag)</option>
                                  <option value="custom">自定义属性 (Custom Attribute)</option>
                                </select>
                                <button
                                  type="button"
                                  class="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                  @click="removeAttributeRule(index)"
                                >
                                  <span class="material-icons text-sm">delete</span>
                                </button>
                              </div>
                              
                              <!-- Custom Attribute Name Selector -->
                              <div v-if="rule.attribute === 'custom'" class="flex gap-2 pl-2 border-l-2 border-emerald-500">
                                <select
                                  v-model="rule.customAttributeName"
                                  class="flex-1 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm text-gray-900 dark:text-white"
                                >
                                  <option value="" disabled>选择自定义属性...</option>
                                  <option v-for="attr in availableCustomAttributes" :key="attr.key" :value="attr.key">
                                    {{ attr.label }}
                                  </option>
                                </select>
                              </div>
                              
                              <!-- Operator and Value (only show when attribute is selected and if custom, customAttributeName is selected) -->
                              <div v-if="rule.attribute !== 'custom' || rule.customAttributeName" class="flex gap-2">
                                <select
                                  v-model="rule.operator"
                                  class="w-24 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm text-gray-900 dark:text-white"
                                >
                                  <option value="equals">等于</option>
                                  <option value="contains">包含</option>
                                  <option value="startsWith">开头</option>
                                </select>
                                <input
                                  v-model="rule.value"
                                  type="text"
                                  class="flex-1 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm text-gray-900 dark:text-white placeholder-gray-400"
                                  placeholder="值"
                                />
                              </div>
                            </div>
                            <button
                              type="button"
                              class="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium flex items-center gap-1"
                              @click="addAttributeRule"
                            >
                              <span class="material-icons text-sm">add</span>
                              添加规则
                            </button>
                          </div>
                        </div>
                      </div>

                      <!-- Option 4: Name Pattern Matching -->
                      <div class="relative flex items-start">
                        <div class="flex h-5 items-center">
                          <input
                            id="repo-pattern"
                            v-model="formData.repositoryTarget"
                            type="radio"
                            value="pattern"
                            class="h-4 w-4 border-gray-300 text-emerald-600 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 cursor-pointer"
                          />
                        </div>
                        <div class="ml-3 text-sm flex-1">
                          <label class="font-medium text-gray-700 dark:text-gray-200 cursor-pointer" for="repo-pattern">按项目路径匹配</label>
                          <p class="text-gray-500 dark:text-gray-400 text-xs mt-0.5">Target repositories based on name</p>
                          
                          <!-- Name Pattern Input -->
                          <div v-if="formData.repositoryTarget === 'pattern'" class="mt-3">
                            <input
                              v-model="formData.repositoryPattern"
                              type="text"
                              class="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-mono"
                              placeholder="例如：org/project-*, */backend-*, frontend/*"
                            />
                            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                              支持通配符：<code class="bg-gray-100 dark:bg-gray-700 px-1 rounded">*</code> 匹配任意字符，多个模式用逗号分隔
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Target Branch -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" for="target-branch">
                      目标分支 <span class="text-red-500">*</span>
                    </label>
                    <select
                      id="target-branch"
                      v-model="formData.target"
                      class="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm text-gray-900 dark:text-white transition-colors"
                    >
                      <option value="all">所有分支 (All Branches)</option>
                      <option value="default">默认分支 (Default Branch)</option>
                      <option value="protected">保护分支 (Protected Branches)</option>
                      <option value="fnmatch">自定义模式 (fnmatch)</option>
                    </select>
                    <!-- Custom Pattern Input -->
                    <div v-if="formData.target === 'fnmatch'" class="mt-3">
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" for="custom-pattern">
                        通配符模式 <span class="text-red-500">*</span>
                      </label>
                      <input
                        id="custom-pattern"
                        v-model="formData.customPattern"
                        type="text"
                        class="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors font-mono"
                        placeholder="例如：release/*, feature/*, hotfix/*"
                      />
                      <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        支持通配符：<code class="bg-gray-100 dark:bg-gray-700 px-1 rounded">*</code> 匹配任意字符，<code class="bg-gray-100 dark:bg-gray-700 px-1 rounded">?</code> 匹配单个字符，多个模式用逗号分隔
                      </p>
                    </div>
                  </div>

                  <!-- Protection Options -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      保护选项
                    </label>
                    <div class="space-y-3 border border-gray-200 dark:border-gray-700 rounded-md p-4 bg-gray-50 dark:bg-gray-800/50">
                      <div class="relative flex items-start">
                        <div class="flex h-5 items-center">
                          <input
                            id="option-cr"
                            v-model="formData.options.codeReview"
                            type="checkbox"
                            class="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 cursor-pointer"
                          />
                        </div>
                        <div class="ml-3 text-sm">
                          <label class="font-medium text-gray-700 dark:text-gray-200 cursor-pointer" for="option-cr">强制代码评审 (Code Review)</label>
                          <p class="text-gray-500 dark:text-gray-400 text-xs mt-0.5">合并前必须经过至少 1 人的批准。</p>
                        </div>
                      </div>

                      <div class="relative flex items-start">
                        <div class="flex h-5 items-center">
                          <input
                            id="option-push"
                            v-model="formData.options.restrictPush"
                            type="checkbox"
                            class="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 cursor-pointer"
                          />
                        </div>
                        <div class="ml-3 text-sm">
                          <label class="font-medium text-gray-700 dark:text-gray-200 cursor-pointer" for="option-push">限制推送 (Restrict Push)</label>
                          <p class="text-gray-500 dark:text-gray-400 text-xs mt-0.5">仅特定人员或角色可以直接推送代码到此分支。</p>
                        </div>
                      </div>

                      <div class="relative flex items-start">
                        <div class="flex h-5 items-center">
                          <input
                            id="option-delete"
                            v-model="formData.options.preventDelete"
                            type="checkbox"
                            class="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 cursor-pointer"
                          />
                        </div>
                        <div class="ml-3 text-sm">
                          <label class="font-medium text-gray-700 dark:text-gray-200 cursor-pointer" for="option-delete">禁止删除分支</label>
                        </div>
                      </div>

                      <div class="relative flex items-start">
                        <div class="flex h-5 items-center">
                          <input
                            id="option-sign"
                            v-model="formData.options.signedCommits"
                            type="checkbox"
                            class="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 cursor-pointer"
                          />
                        </div>
                        <div class="ml-3 text-sm">
                          <label class="font-medium text-gray-700 dark:text-gray-200 cursor-pointer" for="option-sign">要求签署提交 (Signed Commits)</label>
                          <p class="text-gray-500 dark:text-gray-400 text-xs mt-0.5">必须使用 GPG 签名。</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Bypass List -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      豁免列表 (Bypass List)
                    </label>
                    <div class="mt-1 flex rounded-md shadow-sm">
                      <div class="relative flex-grow focus-within:z-10">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span class="material-icons text-gray-400 text-sm">people</span>
                        </div>
                        <input
                          type="text"
                          class="block w-full rounded-md pl-10 sm:text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-emerald-500 py-2"
                          placeholder="搜索用户或角色"
                          @keydown.enter.prevent="addBypass"
                        />
                      </div>
                    </div>
                    <div class="mt-2 flex flex-wrap gap-2">
                      <span 
                        v-for="(item, index) in formData.bypassList" 
                        :key="index"
                        class="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700 py-0.5 pl-2.5 pr-1 text-xs font-medium text-gray-700 dark:text-gray-300"
                      >
                        {{ item }}
                        <button
                          type="button"
                          class="ml-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-500 focus:bg-gray-500 focus:text-white focus:outline-none transition-colors"
                          @click="removeBypass(index)"
                        >
                          <span class="sr-only">Remove</span>
                          <span class="material-icons text-[10px]">close</span>
                        </button>
                      </span>
                    </div>
                  </div>
                </form>
              </div>

              <!-- Footer -->
              <div class="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end gap-3 shrink-0 rounded-b-xl">
                <button
                  class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all"
                  @click="$emit('close')"
                >
                  取消
                </button>
                <button
                  class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all active:scale-95"
                  @click="handleSubmit"
                >
                  保存并启用
                </button>
              </div>
            </div>
          </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
export default {
  name: 'NewRuleModal',
  props: {
    show: Boolean
  },
  emits: ['close', 'submit'],
  data() {
    return {
      availableCustomAttributes: [
        { key: 'business_unit', label: '业务单元 (Business Unit)' },
        { key: 'cost_center', label: '成本中心 (Cost Center)' },
        { key: 'security_level', label: '安全等级 (Security Level)' },
        { key: 'compliance_status', label: '合规状态 (Compliance Status)' },
        { key: 'deployment_env', label: '部署环境 (Deployment Environment)' },
        { key: 'product_line', label: '产品线 (Product Line)' }
      ],
      formData: {
        name: '',
        repositoryTarget: 'all', // 'all', 'specific', 'attribute', 'pattern'
        specificRepositories: [],
        attributeRules: [
          { attribute: 'visibility', operator: 'equals', value: '', customAttributeName: '' }
        ],
        repositoryPattern: '',
        target: 'default',
        customPattern: '',
        options: {
          codeReview: true,
          restrictPush: false,
          preventDelete: true,
          signedCommits: false
        },
        bypassList: ['管理员 (Admin)']
      }
    }
  },
  watch: {
    show(val) {
      if (val) {
        // Form resets or initialization
      }
    }
  },
  methods: {
    addSpecificRepo(e) {
      const val = e.target.value.trim()
      if (val && !this.formData.specificRepositories.includes(val)) {
        this.formData.specificRepositories.push(val)
        e.target.value = ''
      }
    },
    removeSpecificRepo(index) {
      this.formData.specificRepositories.splice(index, 1)
    },
    addAttributeRule() {
      this.formData.attributeRules.push({
        attribute: 'visibility',
        operator: 'equals',
        value: '',
        customAttributeName: ''
      })
    },
    removeAttributeRule(index) {
      if (this.formData.attributeRules.length > 1) {
        this.formData.attributeRules.splice(index, 1)
      }
    },
    addBypass(e) {
      const val = e.target.value.trim()
      if (val && !this.formData.bypassList.includes(val)) {
        this.formData.bypassList.push(val)
        e.target.value = ''
      }
    },
    removeBypass(index) {
      this.formData.bypassList.splice(index, 1)
    },
    handleSubmit() {
      if (!this.formData.name) {
        alert('请输入规则集名称')
        return
      }
      
      // Validate repository target
      if (this.formData.repositoryTarget === 'specific' && this.formData.specificRepositories.length === 0) {
        alert('请至少选择一个项目')
        return
      }
      if (this.formData.repositoryTarget === 'attribute') {
        const hasEmptyRule = this.formData.attributeRules.some(rule => !rule.value.trim())
        if (hasEmptyRule) {
          alert('请完善所有属性匹配规则')
          return
        }
      }
      if (this.formData.repositoryTarget === 'pattern' && !this.formData.repositoryPattern.trim()) {
        alert('请输入项目路径匹配模式')
        return
      }
      
      if (this.formData.target === 'fnmatch' && !this.formData.customPattern.trim()) {
        alert('请输入通配符模式')
        return
      }
      this.$emit('submit', { ...this.formData })
      this.$emit('close')
    }
  }
}
</script>
