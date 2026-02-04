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
              <h3 class="text-xl font-black text-slate-900 dark:text-white tracking-tight">发票抬头设置</h3>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Invoice Title Settings</p>
            </div>
            <button
              class="text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl p-2 transition-all"
              @click="$emit('close')"
            >
              <span class="material-icons-round text-xl">close</span>
            </button>
          </div>

          <!-- Body -->
          <div class="p-8 overflow-y-auto custom-scrollbar">
            <div class="space-y-6">
              <!-- Type Selection -->
              <div class="space-y-3">
                <label class="text-xs font-black text-slate-500 uppercase tracking-widest">抬头类型</label>
                <div class="flex items-center gap-6">
                  <label class="flex items-center gap-3 cursor-pointer group p-3 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary transition-all flex-1" :class="{'bg-primary/5 border-primary ring-1 ring-primary/20': form.type === 'enterprise'}">
                    <div class="relative flex items-center">
                      <input type="radio" v-model="form.type" value="enterprise" class="sr-only">
                      <div class="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 transition-all flex items-center justify-center" :class="{'border-primary bg-primary': form.type === 'enterprise'}">
                        <span v-if="form.type === 'enterprise'" class="w-2 h-2 rounded-full bg-white"></span>
                      </div>
                    </div>
                    <div>
                      <span class="block text-sm font-bold text-slate-900 dark:text-white">企业</span>
                      <span class="text-xs text-slate-500">增值税专用/普通发票</span>
                    </div>
                  </label>
                  
                  <label class="flex items-center gap-3 cursor-pointer group p-3 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary transition-all flex-1" :class="{'bg-primary/5 border-primary ring-1 ring-primary/20': form.type === 'personal'}">
                    <div class="relative flex items-center">
                      <input type="radio" v-model="form.type" value="personal" class="sr-only">
                      <div class="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 transition-all flex items-center justify-center" :class="{'border-primary bg-primary': form.type === 'personal'}">
                        <span v-if="form.type === 'personal'" class="w-2 h-2 rounded-full bg-white"></span>
                      </div>
                    </div>
                    <div>
                      <span class="block text-sm font-bold text-slate-900 dark:text-white">个人/非企业单位</span>
                      <span class="text-xs text-slate-500">仅限增值税普通发票</span>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Main Fields -->
              <div class="grid grid-cols-1 gap-6">
                <div class="space-y-2">
                  <label class="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                    发票抬头 <span class="text-red-500">*</span>
                  </label>
                  <input 
                    v-model="form.title"
                    type="text" 
                    class="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="请填写营业执照上的法定名称"
                  >
                </div>

                <div v-if="form.type === 'enterprise'" class="space-y-2">
                  <label class="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                    纳税人识别号 <span class="text-red-500">*</span>
                  </label>
                  <input 
                    v-model="form.taxId"
                    type="text" 
                    class="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-black font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all uppercase"
                    placeholder="请填写纳税人识别号"
                  >
                </div>

                <!-- Bank Info Group -->
                <div v-if="form.type === 'enterprise'" class="grid grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label class="text-xs font-black text-slate-500 uppercase tracking-widest">开户银行</label>
                    <input 
                      v-model="form.bankName"
                      type="text" 
                      class="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="选填"
                    >
                  </div>
                  <div class="space-y-2">
                    <label class="text-xs font-black text-slate-500 uppercase tracking-widest">银行账号</label>
                    <input 
                      v-model="form.bankAccount"
                      type="text" 
                      class="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-mono font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="选填"
                    >
                  </div>
                </div>

                <!-- Address Group -->
                <div v-if="form.type === 'enterprise'" class="grid grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label class="text-xs font-black text-slate-500 uppercase tracking-widest">注册地址</label>
                    <input 
                      v-model="form.address"
                      type="text" 
                      class="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="选填"
                    >
                  </div>
                  <div class="space-y-2">
                    <label class="text-xs font-black text-slate-500 uppercase tracking-widest">注册电话</label>
                    <input 
                      v-model="form.phone"
                      type="text" 
                      class="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-mono font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="选填"
                    >
                  </div>
                </div>
              </div>

              <!-- Default Checkbox -->
              <div class="flex items-center gap-3 pt-2">
                <label class="relative flex items-center cursor-pointer group">
                  <input type="checkbox" v-model="form.isDefault" class="sr-only">
                  <div class="w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-600 transition-all flex items-center justify-center" :class="{'bg-primary border-primary': form.isDefault}">
                    <span v-if="form.isDefault" class="material-icons-round text-white text-xs font-bold">check</span>
                  </div>
                </label>
                <span class="text-sm font-bold text-slate-600 dark:text-slate-400 select-none cursor-pointer" @click="form.isDefault = !form.isDefault">设为默认抬头</span>
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
              class="rounded-xl px-6 py-3 bg-primary text-white text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all flex items-center gap-2"
              @click="saveTitle"
            >
              <span class="material-icons-round text-lg">save</span>
              保存抬头
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script>
export default {
  name: 'InvoiceTitleModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    editData: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'save'],
  data() {
    return {
      form: {
        type: 'enterprise',
        title: '',
        taxId: '',
        bankName: '',
        bankAccount: '',
        address: '',
        phone: '',
        isDefault: false
      }
    }
  },
  watch: {
    show(val) {
      if (val && this.editData) {
        this.form = { ...this.editData }
      } else if (val) {
        // Reset form
        this.form = {
          type: 'enterprise',
          title: '',
          taxId: '',
          bankName: '',
          bankAccount: '',
          address: '',
          phone: '',
          isDefault: false
        }
      }
    }
  },
  methods: {
    saveTitle() {
      // Basic validation
      if (!this.form.title) {
        alert('请填写发票抬头')
        return
      }
      if (this.form.type === 'enterprise' && !this.form.taxId) {
        alert('请填写纳税人识别号')
        return
      }

      this.$emit('save', { ...this.form })
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
