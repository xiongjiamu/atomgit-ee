<template>
  <!-- Modal Overlay -->
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
      <!-- Modal Card -->
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
          class="bg-white dark:bg-surface-dark w-full max-w-[680px] rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
          @click.stop
        >
          <!-- Modal Header -->
          <div class="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-surface-dark sticky top-0 z-10">
            <div>
              <h3 class="text-xl font-black text-slate-900 dark:text-white tracking-tight">账单结算 - 线下汇款</h3>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Offline Bank Transfer</p>
            </div>
            <button
              class="text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl p-2 transition-all"
              @click="$emit('close')"
            >
              <span class="material-icons-round text-xl">close</span>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-6 overflow-y-auto custom-scrollbar">
            <!-- Amount Section -->
            <div class="text-center mb-8 p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">应付金额</p>
              <p class="text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                <span class="text-2xl align-top mr-1 relative top-1">¥</span>{{ amount }}
              </p>
            </div>

            <!-- Bank Information -->
            <div class="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 p-6 mb-6">
              <div class="flex items-center gap-3 mb-5">
                <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span class="material-icons-round text-primary text-xl">account_balance</span>
                </div>
                <h4 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">汇款信息</h4>
              </div>
              <div class="space-y-4">
                <div class="flex items-start gap-4">
                  <span class="text-sm text-slate-500 dark:text-slate-400 font-bold w-24 flex-shrink-0">开户名称</span>
                  <span class="text-sm text-slate-900 dark:text-white font-black select-all">{{ bankInfo.accountName }}</span>
                </div>
                <div class="flex items-start gap-4">
                  <span class="text-sm text-slate-500 dark:text-slate-400 font-bold w-24 flex-shrink-0">开户银行</span>
                  <span class="text-sm text-slate-900 dark:text-white font-black">{{ bankInfo.bankName }}</span>
                </div>
                <div class="flex items-start gap-4">
                  <span class="text-sm text-slate-500 dark:text-slate-400 font-bold w-24 flex-shrink-0">银行账号</span>
                  <div class="flex items-center gap-3 flex-1">
                    <span class="text-base font-mono font-black text-slate-900 dark:text-white select-all tracking-wide">{{ bankInfo.accountNumber }}</span>
                    <button
                      class="text-primary hover:text-primary-dark transition-colors flex items-center gap-1 text-xs font-black bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg"
                      @click="copyAccountNumber"
                    >
                      <span class="material-icons-round text-sm">content_copy</span>
                      {{ copied ? '已复制' : '复制' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Alert / Notice -->
            <AlertBanner
              type="warning"
              icon="warning"
              :dismissible="false"
              class="mb-6"
            >
              <span class="font-black">温馨提示：</span>请务必在转账备注中填写账单编号
              <span class="font-mono bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 rounded mx-1 font-black">{{ billNumber }}</span>
              或企业 ID，以便财务系统快速核销入账。
            </AlertBanner>

            <!-- Upload Section -->
            <div class="space-y-3">
              <label class="block text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">上传汇款凭证</label>
              <div
                class="mt-2 flex justify-center rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 px-6 py-10 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-primary/40 transition-all cursor-pointer group relative"
                @click="triggerFileInput"
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @drop.prevent="handleFileDrop"
                :class="{ 'border-primary bg-primary/5': isDragging }"
              >
                <div class="text-center">
                  <span class="material-icons-round mx-auto text-5xl text-slate-300 dark:text-slate-600 group-hover:text-primary transition-colors mb-4 block">cloud_upload</span>
                  <div class="flex text-sm leading-6 text-slate-600 dark:text-slate-400 justify-center mb-2">
                    <label class="relative cursor-pointer rounded-lg font-black text-primary hover:text-primary-dark">
                      <span>点击上传</span>
                      <input
                        ref="fileInput"
                        class="sr-only"
                        type="file"
                        accept="image/jpeg,image/png,application/pdf"
                        @change="handleFileSelect"
                      />
                    </label>
                    <p class="pl-1 font-bold">或拖拽文件到此处</p>
                  </div>
                  <p class="text-xs leading-5 text-slate-400 dark:text-slate-500">支持 JPG, PNG, PDF 格式，文件大小不超过 5MB</p>
                  
                  <!-- Selected File Display -->
                  <div v-if="selectedFile" class="mt-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="material-icons-round text-primary text-lg">description</span>
                      <span class="text-sm font-bold text-slate-900 dark:text-white">{{ selectedFile.name }}</span>
                      <span class="text-xs text-slate-500">({{ formatFileSize(selectedFile.size) }})</span>
                    </div>
                    <button
                      class="text-slate-400 hover:text-red-500 transition-colors"
                      @click.stop="removeFile"
                    >
                      <span class="material-icons-round text-lg">close</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
            <button
              class="rounded-xl px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
              @click="$emit('close')"
            >
              取消
            </button>
            <button
              class="rounded-xl px-6 py-3 bg-primary text-white text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!selectedFile"
              @click="submitVoucher"
            >
              <span class="material-icons-round text-lg">check_circle</span>
              提交凭证
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script>
import AlertBanner from './AlertBanner.vue'

export default {
  name: 'PaymentModal',
  components: {
    AlertBanner
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    amount: {
      type: String,
      default: '12,450.00'
    },
    billNumber: {
      type: String,
      default: 'BILL-20231001'
    }
  },
  emits: ['close', 'submit'],
  data() {
    return {
      copied: false,
      isDragging: false,
      selectedFile: null,
      bankInfo: {
        accountName: '深圳开源共创科技有限公司',
        bankName: '招商银行股份有限公司深圳坂雪岗支行',
        accountNumber: '7559 7916 6110 000'
      }
    }
  },
  methods: {
    copyAccountNumber() {
      navigator.clipboard.writeText(this.bankInfo.accountNumber.replace(/\s/g, ''))
      this.copied = true
      setTimeout(() => {
        this.copied = false
      }, 2000)
    },
    triggerFileInput() {
      this.$refs.fileInput.click()
    },
    handleFileSelect(event) {
      const file = event.target.files[0]
      if (file) {
        this.validateAndSetFile(file)
      }
    },
    handleFileDrop(event) {
      this.isDragging = false
      const file = event.dataTransfer.files[0]
      if (file) {
        this.validateAndSetFile(file)
      }
    },
    validateAndSetFile(file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
      if (!allowedTypes.includes(file.type)) {
        alert('仅支持 JPG, PNG, PDF 格式')
        return
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('文件大小不能超过 5MB')
        return
      }
      
      this.selectedFile = file
    },
    removeFile() {
      this.selectedFile = null
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = ''
      }
    },
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
    },
    submitVoucher() {
      if (!this.selectedFile) {
        alert('请先上传汇款凭证')
        return
      }
      
      this.$emit('submit', {
        file: this.selectedFile,
        billNumber: this.billNumber,
        amount: this.amount
      })
      
      // Reset
      this.removeFile()
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
