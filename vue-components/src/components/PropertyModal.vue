<template>
  <Teleport to="body">
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
        class="fixed inset-0 z-[9999] overflow-y-auto"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div class="flex items-center justify-center min-h-screen px-4 py-6 text-center sm:p-0">
          <!-- Overlay -->
          <div
            class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
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
              class="inline-block align-middle bg-white dark:bg-[#1C2128] rounded-xl text-left overflow-hidden shadow-2xl transform transition-all w-full max-w-4xl border border-gray-200 dark:border-gray-700 flex flex-col max-h-[85vh]"
            >
              <!-- Header -->
              <div class="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-700 shrink-0 bg-white dark:bg-[#1C2128]">
                <div>
                  <h2 class="text-lg font-bold text-gray-900 dark:text-white">自定义属性设置</h2>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">设置仓库元数据字段，这些属性可在 Rulesets 中作为条件使用。</p>
                </div>
                <button
                  class="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                  @click="$emit('close')"
                >
                  <span class="material-icons text-xl">close</span>
                </button>
              </div>

              <!-- Body -->
              <div class="p-6 overflow-y-auto custom-scrollbar bg-gray-50 dark:bg-[#0d1117]">
                <!-- Info Box -->
                <div class="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-3 flex items-start gap-3">
                  <span class="material-icons text-blue-500 text-sm mt-0.5">lightbulb</span>
                  <div class="text-sm text-blue-800 dark:text-blue-200">
                    <p class="font-bold mb-0.5">如何使用自定义属性？</p>
                    <p class="opacity-80">配置属性后，您可以在创建保护规则时，通过匹配仓库的属性值来批量圈选生效范围。例如：仅对 "Service Level = Critical" 的仓库生效。</p>
                  </div>
                </div>

                <div class="space-y-4">
                  <!-- Table Header -->
                  <div class="grid grid-cols-12 gap-4 text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider px-2">
                    <div class="col-span-4">属性名称 / Key</div>
                    <div class="col-span-3">类型</div>
                    <div class="col-span-4">可选值 / 说明</div>
                    <div class="col-span-1 text-right">操作</div>
                  </div>

                  <!-- Existing Items -->
                  <div 
                    v-for="(prop, index) in properties" 
                    :key="index"
                    class="group grid grid-cols-12 gap-4 items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500 rounded-lg p-3 transition-all shadow-sm"
                  >
                    <div class="col-span-4">
                      <label class="block text-[10px] font-bold text-gray-400 dark:text-gray-500 mb-1">名称</label>
                      <input 
                        v-model="prop.name"
                        type="text" 
                        class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded px-2 py-1.5 text-sm font-medium focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                      />
                    </div>
                    <div class="col-span-3">
                      <label class="block text-[10px] font-bold text-gray-400 dark:text-gray-500 mb-1">类型</label>
                      <select 
                        v-model="prop.type"
                        class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded px-2 py-1.5 text-sm font-medium focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors appearance-none"
                      >
                        <option value="Select">单选 (Select)</option>
                        <option value="Multi-select">多选 (Multi-select)</option>
                        <option value="Text">文本 (Text)</option>
                      </select>
                    </div>
                    <div class="col-span-4">
                      <label class="block text-[10px] font-bold text-gray-400 dark:text-gray-500 mb-1">可选值 (用逗号分隔)</label>
                      <input 
                        v-model="prop.values"
                        type="text" 
                        class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded px-2 py-1.5 text-sm font-medium focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                      />
                    </div>
                    <div class="col-span-1 flex justify-end items-end h-full pb-1">
                      <button 
                        class="text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                        @click="removeProperty(index)"
                      >
                        <span class="material-icons text-lg">delete</span>
                      </button>
                    </div>
                  </div>

                  <!-- New Item Row -->
                  <div v-if="showNewRow" class="group grid grid-cols-12 gap-4 items-center bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-3 transition-all animate-in fade-in slide-in-from-top-2">
                    <div class="col-span-4">
                      <input 
                        v-model="newProp.name"
                        type="text"
                        placeholder="输入属性名称 ex: Language" 
                        class="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-emerald-500 px-0 py-1.5 text-sm font-medium outline-none placeholder-gray-400 transition-colors"
                      />
                    </div>
                    <div class="col-span-3">
                      <select 
                        v-model="newProp.type"
                        class="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-emerald-500 px-0 py-1.5 text-sm font-medium outline-none text-gray-600 dark:text-gray-300 transition-colors"
                      >
                        <option value="" disabled selected>选择类型</option>
                        <option value="Select">单选 (Select)</option>
                        <option value="Multi-select">多选 (Multi-select)</option>
                        <option value="Text">文本 (Text)</option>
                      </select>
                    </div>
                    <div class="col-span-4">
                      <input 
                        v-model="newProp.values"
                        type="text"
                        placeholder="输入可选值" 
                        class="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-emerald-500 px-0 py-1.5 text-sm font-medium outline-none placeholder-gray-400 transition-colors"
                        :disabled="newProp.type === 'Text'"
                      />
                    </div>
                    <div class="col-span-1 flex justify-end">
                      <!-- Auto save or manual add logic could go here -->
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1C2128] shrink-0">
                <button 
                  class="text-emerald-500 hover:text-emerald-600 font-bold text-sm flex items-center transition-colors px-2 py-1 rounded hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                  @click="addNewRow"
                >
                  <span class="material-icons text-lg mr-1">add_circle_outline</span> 添加属性
                </button>
                <div class="flex items-center space-x-3">
                  <button 
                    class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    @click="handleCancel"
                  >
                    取消
                  </button>
                  <button 
                    class="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-sm transition-all active:scale-95"
                    @click="handleSave"
                  >
                    应用更改
                  </button>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
export default {
  name: 'PropertyModal',
  props: {
    show: Boolean
  },
  emits: ['close', 'save'],
  data() {
    return {
      properties: [
        { name: 'Service_Level', type: 'Select', values: 'P0, P1, P2, P3' },
        { name: 'Environment', type: 'Select', values: 'Prod, Staging, Dev' }
      ],
      showNewRow: true,
      newProp: {
        name: '',
        type: '',
        values: ''
      }
    }
  },
  watch: {
    show(val) {
      if (val) {
        this.resetNewProp()
        this.showNewRow = true
      }
    }
  },
  methods: {
    resetNewProp() {
      this.newProp = { name: '', type: '', values: '' }
    },
    removeProperty(index) {
      this.properties.splice(index, 1)
    },
    addNewRow() {
      if (this.newProp.name && this.newProp.type) {
        this.properties.push({ ...this.newProp })
        this.resetNewProp()
      }
      this.showNewRow = true
    },
    handleCancel() {
      this.$emit('close')
    },
    handleSave() {
      if (this.newProp.name && this.newProp.type) {
        this.properties.push({ ...this.newProp })
      }
      this.$emit('save', this.properties)
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
  background-color: #CBD5E1;
  border-radius: 20px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #4B5563;
}
</style>
