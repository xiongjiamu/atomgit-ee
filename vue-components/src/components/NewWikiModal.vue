<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm" @click.self="$emit('close')">
      <div class="bg-white dark:bg-surface-dark w-full max-w-lg rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col max-h-[90vh] animate-fade-in-up">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-bold text-slate-900 dark:text-white">接入知识库数据源</h2>
          <button class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors rounded-full p-1 hover:bg-slate-100 dark:hover:bg-slate-800" @click="$emit('close')">
            <span class="material-icons-outlined">close</span>
          </button>
        </div>

        <!-- Content -->
        <div class="p-6 space-y-5 overflow-y-auto flex-1 custom-scrollbar">
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">数据源名称</label>
            <input v-model="form.name" class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm focus:border-slate-900 focus:ring-slate-900 sm:text-sm py-2.5 px-3" placeholder="例如：产品团队 Confluence" type="text"/>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">数据源类型</label>
            <select v-model="form.type" class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm focus:border-slate-900 focus:ring-slate-900 sm:text-sm py-2.5 px-3">
              <option value="wiki">Wiki</option>
              <option value="confluence">Confluence</option>
              <option value="notion">Notion</option>
              <option value="custom">Custom API</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">基础 URL</label>
            <div class="relative rounded-md shadow-sm">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <span class="material-icons-outlined text-lg">link</span>
              </span>
              <input v-model="form.url" class="w-full pl-10 rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm focus:border-slate-900 focus:ring-slate-900 sm:text-sm py-2.5 pr-3" placeholder="https://your-domain.atlassian.net/wiki" type="text"/>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">认证方式</label>
            <select v-model="form.authType" class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm focus:border-slate-900 focus:ring-slate-900 sm:text-sm py-2.5 px-3">
              <option value="token">Token (API Token)</option>
              <option value="oauth">OAuth 2.0</option>
              <option value="basic">Basic Auth (Username/Password)</option>
            </select>
          </div>
          
          <div class="border-t border-gray-200 dark:border-gray-700 my-4"></div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">同步频率</label>
              <select v-model="form.frequency" class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm focus:border-slate-900 focus:ring-slate-900 sm:text-sm py-2.5 px-3">
                <option value="hourly">每小时</option>
                <option value="daily">每天</option>
                <option value="weekly">每周</option>
              </select>
            </div>
            <div class="flex items-center justify-between border border-gray-200 dark:border-gray-700 rounded-lg px-4 bg-gray-50 dark:bg-slate-800/50">
              <span class="text-sm font-medium text-slate-700 dark:text-slate-300">增量同步</span>
              <div class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                  <input type="checkbox" name="toggle" id="inc-sync-toggle" v-model="form.incremental" class="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer left-[20px] transition-all duration-300"/>
                  <label for="inc-sync-toggle" class="toggle-label block overflow-hidden h-5 rounded-full bg-slate-900 cursor-pointer"></label>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-200 dark:border-gray-700 rounded-b-xl flex items-center justify-between">
          <button class="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm font-medium transition-colors">
            测试连接
          </button>
          <div class="flex gap-3">
            <button class="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors" @click="$emit('close')">
              取消
            </button>
            <button class="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 text-white rounded-lg text-sm font-medium shadow-sm transition-colors" @click="handleSubmit">
              保存配置
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
export default {
  name: 'NewWikiModal',
  props: {
    show: Boolean
  },
  emits: ['close', 'submit'],
  data() {
    return {
      form: {
        name: '',
        type: 'confluence',
        url: '',
        authType: 'token',
        frequency: 'daily',
        incremental: true
      }
    }
  },
  methods: {
    handleSubmit() {
        if (!this.form.name) return alert('请输入数据源名称');
        this.$emit('submit', { ...this.form, id: Date.now() });
        this.resetForm();
        this.$emit('close');
    },
    resetForm() {
        this.form = {
            name: '',
            type: 'confluence',
            url: '',
            authType: 'token',
            frequency: 'daily',
            incremental: true
        }
    }
  }
}
</script>

<style scoped>
.toggle-checkbox {
  right: auto;
  left: 0;
  transition: transform 0.2s ease-in-out, border-color 0.2s;
  transform: translateX(0);
  border-color: #cbd5e1;
}
.toggle-checkbox:checked {
  right: auto;
  left: 0;
  transform: translateX(100%);
  border-color: #0f172a; /* slate-900 */
}
.dark .toggle-checkbox:checked {
    border-color: #ffffff;
}

.toggle-checkbox:checked + .toggle-label {
  background-color: #0f172a;
}
.dark .toggle-checkbox:checked + .toggle-label {
    background-color: #ffffff;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 3px;
}
</style>
