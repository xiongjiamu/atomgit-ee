<template>
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
      class="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Overlay -->
        <div
          class="fixed inset-0 bg-slate-900/75 transition-opacity backdrop-blur-sm"
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
            class="inline-block align-bottom bg-white dark:bg-[#1C2128] rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-slate-200 dark:border-slate-700"
          >
            <!-- Header -->
            <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-[#161B22]">
              <h3 class="text-lg leading-6 font-bold text-slate-900 dark:text-white" id="modal-title">
                {{ isApproveMode ? '通过并签发 Token' : '新建企业 Token' }}
              </h3>
              <button
                class="text-slate-400 hover:text-slate-500 focus:outline-none transition-colors"
                @click="$emit('close')"
              >
                <span class="material-icons-round text-xl">close</span>
              </button>
            </div>

            <!-- Body -->
            <div class="px-8 py-6">
              <form class="space-y-6">
                <!-- Token Name -->
                <div>
                  <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1" for="token-name">
                    Token 名称
                  </label>
                  <div class="relative rounded-md shadow-sm">
                    <input
                      id="token-name"
                      v-model="formData.name"
                      type="text"
                      class="block w-full sm:text-sm border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary py-2.5 transition-colors disabled:bg-slate-100 disabled:dark:bg-slate-800/50 disabled:text-slate-500 disabled:cursor-not-allowed"
                      :disabled="isApproveMode"
                      :placeholder="isApproveMode ? '' : 'E.g., CI Pipeline, Deploy Bot'"
                    />
                    <div v-if="isApproveMode" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span class="material-icons-round text-slate-400 text-sm">lock</span>
                    </div>
                  </div>
                  <p v-if="isApproveMode" class="mt-1 text-xs text-slate-500">申请人指定的 Token 标识，不可修改。</p>
                </div>

                <!-- Expiry -->
                <div>
                  <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    有效期设置 <span class="text-red-500">*</span>
                  </label>
                  <div class="flex flex-wrap gap-3">
                    <label v-for="opt in expiryOptions" :key="opt.value" class="inline-flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        v-model="formData.expiry"
                        :value="opt.value"
                        class="form-radio text-primary border-slate-300 focus:ring-primary h-4 w-4 transition duration-150 ease-in-out"
                      />
                      <span class="ml-2 text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{{ opt.label }}</span>
                    </label>
                  </div>
                </div>

                <!-- Scopes -->
                <div>
                  <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    权限范围 (Scopes)
                  </label>
                  <div class="border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 p-4 space-y-3 max-h-56 overflow-y-auto custom-scrollbar">
                    <div v-for="scope in scopes" :key="scope.id" class="flex items-start">
                      <div class="flex items-center h-5">
                        <input
                          :id="scope.id"
                          v-model="formData.scopes"
                          :value="scope.value"
                          type="checkbox"
                          class="focus:ring-primary h-4 w-4 text-primary border-slate-300 rounded transition duration-150 ease-in-out cursor-pointer"
                        />
                      </div>
                      <div class="ml-3 text-sm">
                        <label :for="scope.id" class="font-bold text-slate-700 dark:text-slate-200 cursor-pointer">{{ scope.label }}</label>
                        <p class="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{{ scope.desc }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- IP Whitelist -->
                <div>
                  <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1" for="ip-whitelist">
                    安全加固 <span class="text-slate-400 font-normal ml-1">(可选)</span>
                  </label>
                  <div class="relative rounded-md shadow-sm">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span class="material-icons-round text-slate-400 text-sm">network_check</span>
                    </div>
                    <input
                      id="ip-whitelist"
                      v-model="formData.ipWhitelist"
                      type="text"
                      class="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white py-2.5 transition-colors placeholder-slate-400"
                      placeholder="输入允许访问的 IP 地址或 CIDR 网段，以逗号分隔"
                    />
                  </div>
                  <p class="mt-1 text-xs text-slate-500">限制该 Token 仅能从特定的网络环境调用 API。</p>
                </div>
              </form>
            </div>

            <!-- Footer -->
            <div class="px-6 py-4 bg-slate-50 dark:bg-[#161B22] border-t border-slate-200 dark:border-slate-700 flex justify-end space-x-3">
              <button
                class="inline-flex justify-center px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all active:scale-95"
                @click="$emit('close')"
              >
                取消
              </button>
              <button
                class="inline-flex justify-center px-4 py-2 text-sm font-bold text-white bg-green-500 hover:bg-green-600 border border-transparent rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all active:scale-95"
                @click="handleSubmit"
              >
                {{ isApproveMode ? '确认签发' : '创建 Token' }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </Transition>
</template>

<script>
export default {
  name: 'TokenModal',
  props: {
    show: Boolean,
    mode: {
      type: String,
      default: 'create', // 'create' or 'approve'
      validator: value => ['create', 'approve'].includes(value)
    },
    initialData: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['close', 'submit'],
  data() {
    return {
      formData: {
        name: '',
        expiry: '30',
        scopes: ['repo', 'workflow'],
        ipWhitelist: ''
      },
      expiryOptions: [
        { label: '7天', value: '7' },
        { label: '30天', value: '30' },
        { label: '90天', value: '90' },
        { label: '180天', value: '180' },
        { label: '永久', value: 'never' }
      ],
      scopes: [
        { id: 'scope-repo', value: 'repo', label: 'repo (full access)', desc: '授予对私有仓库、公开仓库的完整读写权限。' },
        { id: 'scope-workflow', value: 'workflow', label: 'workflow (write)', desc: '允许触发和管理 GitHub Actions 工作流。' },
        { id: 'scope-user', value: 'user', label: 'user (read)', desc: '仅读取用户个人资料数据。' },
        { id: 'scope-admin', value: 'admin:org', label: 'admin:org (read)', desc: '只读访问组织和团队成员信息。' }
      ]
    }
  },
  computed: {
    isApproveMode() {
      return this.mode === 'approve'
    }
  },
  watch: {
    show(val) {
      if (val) {
        // Reset or fill data
        this.formData = {
          name: this.initialData.name || '',
          expiry: '30',
          scopes: ['repo', 'workflow'],
          ipWhitelist: ''
        }
      }
    }
  },
  methods: {
    handleSubmit() {
      this.$emit('submit', { ...this.formData })
      this.$emit('close')
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
  background-color: #CBD5E1;
  border-radius: 20px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #475569;
}
</style>
