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
                {{ type === 'member' ? '添加企业成员' : '邀请外部协作者' }}
              </h3>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Invitation & Access Control</p>
            </div>
            <button
              class="text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl p-2 transition-all"
              @click="$emit('close')"
            >
              <span class="material-icons-round text-xl">close</span>
            </button>
          </div>

          <!-- Body -->
          <div class="p-6 space-y-6">
            <!-- Identifier Input -->
            <div class="space-y-2">
              <label class="block text-xs font-black text-slate-500 uppercase tracking-widest">用户名或邮箱</label>
              <div class="relative group">
                <span class="absolute left-4 top-3.5 material-icons-round text-slate-400 group-focus-within:text-primary transition-colors text-lg">person_search</span>
                <input
                  v-model="form.identifier"
                  type="text"
                  placeholder="输入 GitCode 用户名或邮箱地址"
                  class="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <!-- Role Selection -->
            <div class="space-y-2">
              <label class="block text-xs font-black text-slate-500 uppercase tracking-widest">设置角色</label>
              <div class="grid grid-cols-2 gap-3">
                <label 
                  v-for="role in roles" 
                  :key="role.value"
                  class="cursor-pointer relative"
                >
                  <input 
                    type="radio" 
                    v-model="form.role" 
                    :value="role.value"
                    class="peer sr-only"
                  />
                  <div class="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:ring-1 peer-checked:ring-primary transition-all h-full">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="material-icons-round text-base" :class="form.role === role.value ? 'text-primary' : 'text-slate-400'">{{ role.icon }}</span>
                      <span class="text-sm font-black" :class="form.role === role.value ? 'text-primary' : 'text-slate-700 dark:text-slate-300'">{{ role.label }}</span>
                    </div>
                    <p class="text-[10px] text-slate-500 leading-tight">{{ role.desc }}</p>
                  </div>
                </label>
              </div>
            </div>

            <!-- Expiry Selection -->
            <div class="space-y-2">
              <label class="block text-xs font-black text-slate-500 uppercase tracking-widest">有效期</label>
              <div class="relative">
                <select
                  v-model="form.expiry"
                  class="w-full appearance-none pl-4 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                >
                  <option value="forever">永久有效</option>
                  <option value="30days">30 天</option>
                  <option value="90days">90 天</option>
                  <option value="180days">180 天</option>
                  <option value="1year">1 年</option>
                  <option value="custom">自定义日期...</option>
                </select>
                <div class="absolute right-4 top-3.5 pointer-events-none">
                  <span class="material-icons-round text-slate-400">expand_more</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
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
              <span class="material-icons-round text-lg">send</span>
              发出邀请
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script>
export default {
  name: 'InviteMemberModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'member' // 'member' or 'collaborator'
    }
  },
  emits: ['close', 'submit'],
  data() {
    return {
      form: {
        identifier: '',
        role: 'developer',
        expiry: 'forever'
      },
      roles: [
        { label: '企业管理员', value: 'admin', icon: 'admin_panel_settings', desc: '拥有企业所有资源的管理权限' },
        { label: '开发者', value: 'developer', icon: 'code', desc: '可以访问和操作被授权的项目' },
        { label: '运维工程师', value: 'ops', icon: 'dns', desc: '管理基础设施和部署流程' },
        { label: '访客', value: 'guest', icon: 'visibility', desc: '仅拥有只读权限' }
      ]
    }
  },
  computed: {
    isValid() {
      return this.form.identifier.trim().length > 0
    }
  },
  watch: {
    show(newVal) {
      if (newVal) {
        // Reset form when opened
        this.form = {
          identifier: '',
          role: this.type === 'member' ? 'developer' : 'guest',
          expiry: 'forever'
        }
      }
    }
  },
  methods: {
    handleSubmit() {
      this.$emit('submit', { ...this.form, type: this.type })
      this.$emit('close')
    }
  }
}
</script>
