<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" @click.self="$emit('close')">
      <div class="bg-white dark:bg-surface-dark w-[900px] max-w-[95%] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col max-h-[90vh] animate-fade-in-up">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">发布新公告</h2>
          <button class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800" @click="$emit('close')">
            <span class="material-icons-outlined">close</span>
          </button>
        </div>

        <!-- Content -->
        <div class="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <form class="space-y-5" @submit.prevent="handleSubmit">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">公告标题</label>
              <input v-model="form.title" class="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:border-slate-900 focus:ring-slate-900 shadow-sm transition-colors py-2 px-3" placeholder="请输入公告标题，建议在30字以内" type="text" required/>
            </div>
            <div class="grid grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">公告范围</label>
                <select v-model="form.scope" class="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:border-slate-900 focus:ring-slate-900 shadow-sm py-2 px-3">
                  <option value="all">全员</option>
                  <option value="org">指定组织</option>
                  <option value="project">指定项目</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">公告类型</label>
                <select v-model="form.type" class="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:border-slate-900 focus:ring-slate-900 shadow-sm py-2 px-3">
                  <option value="maintenance">系统维护</option>
                  <option value="upgrade">业务升级</option>
                  <option value="activity">活动通知</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">公告内容</label>
              <div class="border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden bg-white dark:bg-gray-800 shadow-sm focus-within:ring-1 focus-within:ring-slate-900 focus-within:border-slate-900">
                <!-- Mock Toolbar -->
                <div class="flex items-center gap-1 p-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                  <button type="button" class="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded"><span class="material-icons-outlined text-[20px]">format_bold</span></button>
                  <button type="button" class="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded"><span class="material-icons-outlined text-[20px]">format_italic</span></button>
                  <button type="button" class="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded"><span class="material-icons-outlined text-[20px]">format_underlined</span></button>
                  <div class="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                  <button type="button" class="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded"><span class="material-icons-outlined text-[20px]">list</span></button>
                  <button type="button" class="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded"><span class="material-icons-outlined text-[20px]">format_list_numbered</span></button>
                  <div class="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                  <button type="button" class="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded"><span class="material-icons-outlined text-[20px]">link</span></button>
                  <button type="button" class="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded"><span class="material-icons-outlined text-[20px]">image</span></button>
                </div>
                <textarea v-model="form.content" class="w-full h-48 p-3 border-none focus:ring-0 text-sm text-gray-900 dark:text-gray-100 bg-transparent resize-none focus:outline-none" placeholder="在此输入公告正文内容..."></textarea>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-6 items-start">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">显示设置</label>
                <div class="space-y-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md border border-gray-100 dark:border-gray-700">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input v-model="form.isTop" class="rounded border-gray-300 text-slate-900 focus:ring-slate-900 h-4 w-4" type="checkbox"/>
                    <span class="text-sm text-gray-700 dark:text-gray-300">置顶显示</span>
                    <span class="text-xs text-gray-500 ml-1">(将在列表中置顶并高亮展示)</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input v-model="form.isPopup" class="rounded border-gray-300 text-slate-900 focus:ring-slate-900 h-4 w-4" type="checkbox"/>
                    <span class="text-sm text-gray-700 dark:text-gray-300">强制弹出提醒</span>
                    <span class="text-xs text-gray-500 ml-1">(用户登录后将看到弹窗)</span>
                  </label>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">有效期设置</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="material-icons-outlined text-gray-400 text-[20px]">calendar_today</span>
                  </div>
                  <input v-model="form.expiryDate" class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 sm:text-sm" placeholder="选择下线时间 (可选)" type="date"/>
                </div>
                <p class="mt-1 text-xs text-gray-500">不设置则默认永久有效，直到手动下线。</p>
              </div>
            </div>
          </form>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-900/50 rounded-b-xl">
          <div class="flex gap-3">
            <button class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm flex items-center gap-2">
              <span class="material-icons-outlined text-[18px]">visibility</span>
              预览
            </button>
            <button class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm" @click="$emit('close')">
              取消
            </button>
          </div>
          <button class="px-4 py-2 text-sm font-medium text-white bg-slate-900 dark:bg-white dark:text-gray-900 rounded-md hover:bg-slate-800 dark:hover:bg-gray-200 transition-colors shadow-sm flex items-center gap-2" @click="handleSubmit">
            <span class="material-icons-outlined text-[18px]">send</span>
            确定发布
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
export default {
  name: 'NewAnnouncementModal',
  props: {
    show: Boolean
  },
  emits: ['close', 'submit'],
  data() {
    return {
      form: {
        title: '',
        scope: 'all',
        type: 'maintenance',
        content: '',
        isTop: false,
        isPopup: false,
        expiryDate: ''
      }
    }
  },
  methods: {
    handleSubmit() {
      // Validate
      if (!this.form.title) return alert('请输入公告标题')
      this.$emit('submit', { ...this.form, id: Date.now() })
      this.resetForm()
      this.$emit('close')
    },
    resetForm() {
      this.form = {
        title: '',
        scope: 'all',
        type: 'maintenance',
        content: '',
        isTop: false,
        isPopup: false,
        expiryDate: ''
      }
    }
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 3px;
}
</style>
