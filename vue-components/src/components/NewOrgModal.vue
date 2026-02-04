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
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
      @click.self="$emit('close')"
    >
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
          class="bg-white dark:bg-surface-dark w-full max-w-lg rounded-xl shadow-2xl flex flex-col overflow-hidden"
          @click.stop
        >
          <!-- Header -->
          <div class="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-surface-dark">
            <div>
              <h3 class="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                添加组织
              </h3>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Create New Organization</p>
            </div>
            <button
              class="text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl p-2 transition-all"
              @click="$emit('close')"
            >
              <span class="material-icons-round text-xl">close</span>
            </button>
          </div>

          <!-- Body -->
          <div class="p-6 space-y-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
            <!-- Org Name -->
            <div class="space-y-2">
              <label class="block text-xs font-black text-slate-500 uppercase tracking-widest">
                组织名称 <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="form.name"
                type="text" 
                placeholder="例如：技术研发中心" 
                class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
            </div>

            <!-- Org Slug -->
            <div class="space-y-2">
              <label class="block text-xs font-black text-slate-500 uppercase tracking-widest">
                组织标识 (URL路径) <span class="text-red-500">*</span>
              </label>
              <div class="flex rounded-xl shadow-sm overflow-hidden border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                <span class="inline-flex items-center px-4 bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm font-medium border-r border-slate-200 dark:border-slate-700">
                  atomgit.com/
                </span>
                <input 
                  v-model="form.slug"
                  type="text" 
                  placeholder="tech-center" 
                  class="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none text-sm font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                >
              </div>
              <p class="text-[10px] text-slate-400 dark:text-slate-500 px-1">
                仅支持小写字母、数字和连字符，设置后不可修改。
              </p>
            </div>

            <!-- Description -->
            <div class="space-y-2">
              <label class="block text-xs font-black text-slate-500 uppercase tracking-widest">组织描述</label>
              <textarea 
                v-model="form.description"
                rows="3" 
                placeholder="请输入组织简介..." 
                class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              ></textarea>
            </div>

            <!-- Visibility -->
            <div class="space-y-2">
              <label class="block text-xs font-black text-slate-500 uppercase tracking-widest">可见性设置</label>
              <div class="grid grid-cols-1 gap-3">
                <label class="relative flex items-start p-4 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:checked]:ring-1 has-[:checked]:ring-primary">
                  <div class="flex items-center h-5">
                    <input type="radio" v-model="form.visibility" value="public" class="focus:ring-primary h-4 w-4 text-primary border-slate-300 dark:border-slate-600 bg-transparent">
                  </div>
                  <div class="ml-3">
                    <span class="block text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span class="material-icons-round text-base text-slate-500">public</span> 公开组织
                    </span>
                    <span class="block text-slate-500 dark:text-slate-400 text-xs mt-0.5 font-medium">任何互联网用户都可以看到此组织。</span>
                  </div>
                </label>
                <label class="relative flex items-start p-4 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:checked]:ring-1 has-[:checked]:ring-primary">
                  <div class="flex items-center h-5">
                    <input type="radio" v-model="form.visibility" value="private" class="focus:ring-primary h-4 w-4 text-primary border-slate-300 dark:border-slate-600 bg-transparent">
                  </div>
                  <div class="ml-3">
                    <span class="block text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span class="material-icons-round text-base text-slate-500">lock</span> 私有组织
                    </span>
                    <span class="block text-slate-500 dark:text-slate-400 text-xs mt-0.5 font-medium">只有组织成员可以看到此组织。</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800 mt-auto">
            <button
              class="rounded-xl px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
              @click="$emit('close')"
            >
              取消
            </button>
            <button
              class="rounded-xl px-6 py-3 bg-primary text-white text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!isValid"
              @click="handleSubmit"
            >
              <span class="material-icons-round text-lg">check</span>
              确定创建
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script>
export default {
  name: 'NewOrgModal',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'submit'],
  data() {
    return {
      form: {
        name: '',
        slug: '',
        description: '',
        visibility: 'private'
      }
    }
  },
  computed: {
    isValid() {
      return this.form.name.trim().length > 0 && this.form.slug.trim().length > 0
    }
  },
  watch: {
    show(newVal) {
      if (newVal) {
        this.form = {
          name: '',
          slug: '',
          description: '',
          visibility: 'private'
        }
      }
    },
    'form.name'(newVal) {
      if (!this.form.slug && newVal) {
        // Simple auto-slug (optional enhancement)
        // this.form.slug = newVal.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      }
    }
  },
  methods: {
    handleSubmit() {
      this.$emit('submit', { ...this.form })
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
