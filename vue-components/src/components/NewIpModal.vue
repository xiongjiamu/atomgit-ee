<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      enter-to-class="opacity-100 translate-y-0 sm:scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0 sm:scale-100"
      leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    >
      <div
        v-if="show"
        class="fixed z-[9999] inset-0 overflow-y-auto"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-900/60 transition-opacity backdrop-blur-sm" aria-hidden="true" @click="$emit('close')"></div>

          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <div class="inline-block align-bottom bg-white dark:bg-[#1C2128] rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-gray-200 dark:border-gray-700">
            <!-- Header -->
            <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-[#1C2128]">
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                添加 IP 规则
              </h3>
              <button
                class="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-300 focus:outline-none transition-colors"
                @click="$emit('close')"
              >
                <span class="material-icons-outlined">close</span>
              </button>
            </div>

            <!-- Body -->
            <div class="px-4 py-5 sm:p-6 space-y-5 bg-white dark:bg-[#1C2128]">
              <!-- Rule Type -->
              <div>
                <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  规则类型
                </label>
                <div class="flex items-center space-x-6">
                  <div class="flex items-center">
                    <input
                      id="rule-allow"
                      v-model="formData.type"
                      type="radio"
                      value="allow"
                      class="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500 dark:border-gray-600 dark:bg-gray-800"
                    />
                    <label class="ml-2 block text-sm text-gray-900 dark:text-white cursor-pointer" for="rule-allow">
                      允许访问
                    </label>
                  </div>
                  <div class="flex items-center">
                    <input
                      id="rule-deny"
                      v-model="formData.type"
                      type="radio"
                      value="deny"
                      class="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500 dark:border-gray-600 dark:bg-gray-800"
                    />
                    <label class="ml-2 block text-sm text-gray-900 dark:text-white cursor-pointer" for="rule-deny">
                      拒绝访问
                    </label>
                  </div>
                </div>
              </div>

              <!-- Name -->
              <div>
                <label class="block text-sm font-medium text-gray-900 dark:text-white mb-1" for="ip-name">
                  备注名称
                </label>
                <input
                  id="ip-name"
                  v-model="formData.name"
                  type="text"
                  class="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2 px-3 transition-colors"
                  placeholder="例如：上海分公司"
                />
              </div>

              <!-- CIDR -->
              <div>
                <label class="block text-sm font-medium text-gray-900 dark:text-white mb-1" for="ip-cidr">
                  CIDR IP 范围
                </label>
                <input
                  id="ip-cidr"
                  v-model="formData.cidr"
                  type="text"
                  class="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2 px-3 font-mono transition-colors"
                  placeholder="192.168.1.0/24"
                />
                <p class="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-start gap-1">
                  <span class="material-icons-outlined text-sm pt-0.5">info</span>
                  <span>请使用标准的 CIDR 格式（例如：192.168.1.0/24）。根据所选类型，该 IP 段将被允许或拒绝访问您的企业代码库。</span>
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div class="bg-gray-50 dark:bg-[#161B22] px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors active:scale-95"
                @click="handleSubmit"
              >
                确定添加
              </button>
              <button
                type="button"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-[#1C2128] text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                @click="$emit('close')"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
export default {
  name: 'NewIpModal',
  props: {
    show: Boolean
  },
  emits: ['close', 'submit'],
  data() {
    return {
      formData: {
        type: 'allow',
        name: '',
        cidr: ''
      }
    }
  },
  watch: {
    show(val) {
      if (val) {
        this.formData = {
          type: 'allow',
          name: '',
          cidr: ''
        }
      }
    }
  },
  methods: {
    handleSubmit() {
      if (!this.formData.name || !this.formData.cidr) {
        alert('请填写完整信息')
        return
      }
      this.$emit('submit', { ...this.formData })
      this.$emit('close')
    }
  }
}
</script>
