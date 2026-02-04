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
        class="fixed inset-0 z-[9999] overflow-y-auto"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <!-- Overlay -->
          <div
            class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
            @click="$emit('close')"
          ></div>

          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <!-- Panel -->
          <Transition
            enter-active-class="transition-all duration-200 ease-out"
            enter-from-class="opacity-0 scale-95 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 scale-100 translate-y-0 sm:scale-100"
            leave-active-class="transition-all duration-150 ease-in"
            leave-from-class="opacity-100 scale-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 scale-95 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              class="inline-block align-bottom bg-white dark:bg-[#1C2128] rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-gray-200 dark:border-gray-700 flex flex-col max-h-[90vh]"
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
      formData: {
        name: '',
        target: 'default',
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
      this.$emit('submit', { ...this.formData })
      this.$emit('close')
    }
  }
}
</script>
