<template>
  <div class="cla-config space-y-6">
    <!-- Global Alerts -->
    <GlobalAlerts page-name="cla-config" />

    <!-- Header Section -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">合规性设置</h1>
    </div>

    <!-- CLA Card -->
    <div class="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex items-start justify-between">
        <div>
          <h2 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            CLA (Contributor License Agreement)
          </h2>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            强制外部贡献者在提交 PR 前签署 CLA 协议。
          </p>
        </div>
        <div class="flex items-center">
          <div class="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
            <input 
              type="checkbox" 
              name="toggle" 
              id="toggle" 
              v-model="claEnabled"
              class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-gray-300 checked:border-blue-600 outline-none"
            />
            <label 
              for="toggle" 
              class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer checked:bg-blue-600"
            ></label>
          </div>
        </div>
      </div>

      <div class="p-6 space-y-8">
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2" for="check-url">外部 CLA 校验接口</label>
          <div class="flex rounded-md shadow-sm">
            <div class="relative flex-grow focus-within:z-10">
              <input 
                type="text" 
                id="check-url" 
                v-model="checkUrl"
                class="block w-full rounded-l-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3 border transition-colors"
              />
            </div>
            <button 
              type="button" 
              class="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
              @click="verifyConnection"
            >
              <span>验证连接</span>
            </button>
          </div>
          <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
            系统将向该地址发送 POST 请求以校验贡献者是否已签署协议。
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2" for="interface-secret">
            接口 Secret
            <span class="ml-1 text-xs font-normal text-gray-500 dark:text-gray-400">(用于签名校验)</span>
          </label>
          <div class="relative rounded-md shadow-sm max-w-lg">
            <input 
              :type="showSecret ? 'text' : 'password'" 
              id="interface-secret" 
              v-model="secret"
              placeholder="••••••••••••••••"
              class="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3 border transition-colors"
            />
            <div 
              class="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              @click="showSecret = !showSecret"
            >
              <span class="material-icons-outlined text-gray-400 text-sm">
                {{ showSecret ? 'visibility_off' : 'visibility' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GlobalAlerts from './GlobalAlerts.vue'

export default {
  name: 'ClaConfig',
  components: {
    GlobalAlerts
  },
  data() {
    return {
      claEnabled: true,
      checkUrl: 'https://cla.atomgit.com/check',
      secret: '',
      showSecret: false
    }
  },
  methods: {
    verifyConnection() {
      // Mock verification
      console.log('Verifying connection to:', this.checkUrl)
      alert('验证请求已发送')
    }
  }
}
</script>

<style scoped>
/* Toggle Switch Styles */
.toggle-checkbox {
  right: auto;
  left: 0;
  transition: transform 0.2s ease-in-out, border-color 0.2s;
  transform: translateX(0);
}
.toggle-checkbox:checked {
  right: auto;
  left: 0;
  transform: translateX(100%);
  border-color: #3b82f6;
}
.toggle-checkbox:checked + .toggle-label {
  background-color: #3b82f6;
}
</style>
