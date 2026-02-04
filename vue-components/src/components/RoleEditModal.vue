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
          class="bg-white dark:bg-surface-dark w-full max-w-2xl rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
          @click.stop
        >
          <!-- Header -->
          <div class="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-surface-dark sticky top-0 z-10">
            <div>
              <h3 class="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {{ isEdit ? '编辑角色权限' : '新建自定义角色' }}
              </h3>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Role Configuration</p>
            </div>
            <button
              class="text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl p-2 transition-all"
              @click="$emit('close')"
            >
              <span class="material-icons-round text-xl">close</span>
            </button>
          </div>

          <!-- Body -->
          <div class="p-6 space-y-6 overflow-y-auto custom-scrollbar">
            <!-- Basic Info -->
            <div class="space-y-4">
              <div class="space-y-2">
                <label class="block text-xs font-black text-slate-500 uppercase tracking-widest">角色名称</label>
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="例如：Release Manager"
                  class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div class="space-y-2">
                <label class="block text-xs font-black text-slate-500 uppercase tracking-widest">角色描述</label>
                <textarea
                  v-model="form.description"
                  rows="2"
                  placeholder="简要描述该角色的职责和权限范围..."
                  class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                ></textarea>
              </div>
            </div>

            <!-- Permission Matrix -->
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <label class="block text-xs font-black text-slate-500 uppercase tracking-widest">权限配置</label>
                <button 
                  class="text-xs font-bold text-primary hover:text-primary-dark transition-colors"
                  @click="selectAllPermissions"
                >
                  全选
                </button>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  v-for="(group, groupKey) in permissionGroups" 
                  :key="groupKey"
                  class="border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-800/30"
                >
                  <h4 class="text-sm font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <span class="material-icons-round text-base text-slate-400">{{ group.icon }}</span>
                    {{ group.label }}
                  </h4>
                  <div class="space-y-2">
                    <label 
                      v-for="perm in group.items" 
                      :key="perm.key"
                      class="flex items-start gap-3 cursor-pointer group/item"
                    >
                      <div class="relative flex items-center mt-0.5">
                        <input 
                          type="checkbox" 
                          v-model="form.permissions" 
                          :value="perm.key"
                          class="peer appearance-none w-4 h-4 rounded border border-slate-300 dark:border-slate-600 checked:bg-primary checked:border-primary transition-all cursor-pointer"
                        />
                        <span class="material-icons-round absolute inset-0 text-white text-xs opacity-0 peer-checked:opacity-100 pointer-events-none">check</span>
                      </div>
                      <div>
                        <span class="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover/item:text-slate-900 dark:group-hover/item:text-white transition-colors block leading-tight">
                          {{ perm.label }}
                        </span>
                        <span class="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">{{ perm.desc }}</span>
                      </div>
                    </label>
                  </div>
                </div>
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
              <span class="material-icons-round text-lg">save</span>
              {{ isEdit ? '保存修改' : '创建角色' }}
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script>
export default {
  name: 'RoleEditModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    roleData: {
      type: Object,
      default: () => null
    }
  },
  emits: ['close', 'submit'],
  data() {
    return {
      form: {
        name: '',
        description: '',
        permissions: []
      },
      permissionGroups: {
        repo: {
          label: '代码库管理',
          icon: 'source',
          items: [
            { key: 'repo.read', label: '读取代码库', desc: '浏览代码和提交历史' },
            { key: 'repo.write', label: '推送代码', desc: '创建分支和推送提交' },
            { key: 'repo.admin', label: '管理设置', desc: '修改代码库设置和删除' }
          ]
        },
        members: {
          label: '成员管理',
          icon: 'group',
          items: [
            { key: 'member.invite', label: '邀请成员', desc: '邀请新成员加入' },
            { key: 'member.remove', label: '移除成员', desc: '移除现有成员' }
          ]
        },
        ci: {
          label: 'CI/CD',
          icon: 'alt_route',
          items: [
            { key: 'ci.run', label: '执行流水线', desc: '手动触发流水线' },
            { key: 'ci.config', label: '配置流水线', desc: '修改 .yml 配置文件' }
          ]
        },
        settings: {
          label: '企业设置',
          icon: 'settings',
          items: [
            { key: 'settings.basic', label: '基本信息', desc: '修改企业名称和头像' },
            { key: 'settings.billing', label: '账单管理', desc: '查看和支付账单' }
          ]
        }
      }
    }
  },
  computed: {
    isEdit() {
      return !!this.roleData
    },
    isValid() {
      return this.form.name.trim().length > 0 && this.form.permissions.length > 0
    }
  },
  watch: {
    show(newVal) {
      if (newVal) {
        if (this.roleData) {
          this.form = {
            name: this.roleData.name,
            description: this.roleData.description,
            // Mock permissions for edit mode
            permissions: ['repo.read', 'repo.write', 'ci.run'] 
          }
        } else {
          this.form = {
            name: '',
            description: '',
            permissions: []
          }
        }
      }
    }
  },
  methods: {
    selectAllPermissions() {
      const allPerms = []
      Object.values(this.permissionGroups).forEach(group => {
        group.items.forEach(item => allPerms.push(item.key))
      })
      this.form.permissions = allPerms
    },
    handleSubmit() {
      this.$emit('submit', { 
        ...this.form, 
        id: this.isEdit ? this.roleData.id : `custom_${Date.now()}`,
        type: 'custom',
        memberCount: this.isEdit ? this.roleData.memberCount : 0
      })
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.2);
  border-radius: 0.75rem;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.3);
}
</style>
