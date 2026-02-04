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
      style="min-height: 100vh; min-height: 100dvh; margin: 0 !important;"
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
                关联已有组织
              </h3>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Link Existing Organization</p>
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
            <!-- Org Search -->
            <div class="space-y-2 relative" ref="searchContainer">
              <label class="block text-xs font-black text-slate-500 uppercase tracking-widest">
                选择要关联的组织 <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <span class="absolute left-4 top-3.5 material-icons-round text-slate-400 text-lg">search</span>
                <input 
                  v-model="searchQuery"
                  @focus="showDropdown = true"
                  type="text" 
                  placeholder="搜索组织名称或 ID" 
                  class="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                >
              </div>
              
              <!-- Dropdown Results -->
              <div 
                v-if="showDropdown && filteredOrgs.length > 0"
                class="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-10 overflow-hidden max-h-48 overflow-y-auto custom-scrollbar"
              >
                <div 
                  v-for="org in filteredOrgs" 
                  :key="org.id"
                  @click="selectOrg(org)"
                  class="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer flex items-center justify-between group transition-colors"
                  :class="selectedOrg?.id === org.id ? 'bg-primary/5' : ''"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-black">
                      {{ org.initials }}
                    </div>
                    <div>
                      <p class="text-sm font-bold text-slate-900 dark:text-white">{{ org.name }}</p>
                      <p class="text-xs text-slate-500 dark:text-slate-400 font-mono">@{{ org.slug }}</p>
                    </div>
                  </div>
                  <span v-if="selectedOrg?.id === org.id" class="material-icons-round text-primary text-lg">check_circle</span>
                </div>
              </div>
            </div>

            <!-- Role Select -->
            <div class="space-y-2">
              <label class="block text-xs font-black text-slate-500 uppercase tracking-widest">冲突角色处理策略</label>
              <div class="relative">
                <select
                  v-model="role"
                  class="w-full appearance-none pl-4 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                >
                  <option value="member">成员 (Member)</option>
                  <option value="admin">管理员 (Admin)</option>
                  <option value="guest">访客 (Guest)</option>
                </select>
                <div class="absolute right-4 top-3.5 pointer-events-none">
                  <span class="material-icons-round text-slate-400">expand_more</span>
                </div>
              </div>
              <p class="text-[10px] text-slate-500 dark:text-slate-400 px-1">
                当受邀组织成员的角色无法匹配企业现有角色时，将自动为其分配上述企业角色。
              </p>
            </div>

            <!-- Info Box -->
            <div v-if="selectedOrg" class="rounded-xl bg-blue-50 dark:bg-blue-900/20 p-4 border border-blue-100 dark:border-blue-800/50 flex items-start gap-3 animate-in fade-in zoom-in duration-300">
              <span class="material-icons-round text-primary text-lg mt-0.5">info</span>
              <p class="text-sm font-medium text-blue-700 dark:text-blue-300 leading-relaxed">
                即将关联 <strong>{{ selectedOrg.name }}</strong> 到本企业。
              </p>
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
              <span class="material-icons-round text-lg">link</span>
              确定关联
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script>
export default {
  name: 'InviteOrgModal',
  props: {
    show: Boolean
  },
  emits: ['close', 'submit'],
  data() {
    return {
      searchQuery: '',
      showDropdown: false,
      selectedOrg: null,
      role: 'member',
      mockOrgs: [
        { id: 101, name: 'AI Research Lab', slug: 'ai-lab', initials: 'AI' },
        { id: 102, name: 'Mobile App Team', slug: 'mobile-team', initials: 'MO' },
        { id: 103, name: 'Design System', slug: 'design-sys', initials: 'DS' }
      ]
    }
  },
  computed: {
    filteredOrgs() {
      if (!this.searchQuery) return this.mockOrgs
      return this.mockOrgs.filter(org => 
        org.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
        org.slug.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    },
    isValid() {
      return !!this.selectedOrg
    }
  },
  watch: {
    show(newVal) {
      if (newVal) {
        this.searchQuery = ''
        this.selectedOrg = null
        this.role = 'member'
        this.showDropdown = false
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    selectOrg(org) {
      this.selectedOrg = org
      this.searchQuery = org.name
      this.showDropdown = false
    },
    handleClickOutside(e) {
      if (this.$refs.searchContainer && !this.$refs.searchContainer.contains(e.target)) {
        this.showDropdown = false
      }
    },
    handleSubmit() {
      this.$emit('submit', { 
        org: this.selectedOrg, 
        role: this.role 
      })
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
