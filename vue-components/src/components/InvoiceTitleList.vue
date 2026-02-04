<template>
  <div class="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <!-- Header -->
    <div class="flex items-center justify-between px-2">
      <div class="flex items-center gap-4">
        <button 
          @click="$emit('back')"
          class="w-10 h-10 rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 transition-all shadow-sm"
        >
          <span class="material-icons-round text-xl">arrow_back</span>
        </button>
        <div>
          <nav class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
            <span>账单管理</span>
            <span class="material-icons-round text-[10px]">chevron_right</span>
            <span>发票管理</span>
          </nav>
          <h1 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">发票抬头设置</h1>
        </div>
      </div>
      <button 
        @click="openModal()"
        class="bg-primary text-white px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-primary-dark transition-all shadow-lg active:scale-95 flex items-center gap-2"
      >
        <span class="material-icons-round text-lg">add</span>
        新建发票抬头
      </button>
    </div>

    <!-- Info Card -->
    <div class="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-6 flex items-center justify-between shadow-sm">
      <div>
        <h3 class="text-lg font-black text-slate-800 dark:text-blue-100 mb-2">发票抬头管理</h3>
        <p class="text-sm font-medium text-slate-600 dark:text-blue-300/80">管理您的企业增值税发票信息，确保开票准确无误。</p>
      </div>
      <div class="w-16 h-16 bg-white/50 dark:bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-inner">
        <span class="material-icons-round text-primary text-3xl">domain</span>
      </div>
    </div>

    <!-- Titles Table -->
    <div class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 dark:border-slate-800">
            <th class="px-8 py-5">发票抬头</th>
            <th class="px-8 py-5">纳税人识别号</th>
            <th class="px-8 py-5">累计开票金额</th>
            <th class="px-8 py-5">最后开票时间</th>
            <th class="px-8 py-5">状态</th>
            <th class="px-8 py-5 text-right">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
          <tr v-for="title in titles" :key="title.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
            <td class="px-8 py-6">
              <span class="text-sm font-bold text-slate-900 dark:text-white block">{{ title.name }}</span>
              <span v-if="title.isDefault" class="inline-block mt-1 scale-90 origin-left px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 text-[10px] font-black rounded uppercase tracking-widest border border-slate-200 dark:border-slate-600">默认</span>
            </td>
            <td class="px-8 py-6">
              <span class="text-sm font-black font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wide">{{ title.taxId || 'N/A' }}</span>
            </td>
            <td class="px-8 py-6">
              <span class="text-sm font-black text-slate-900 dark:text-white font-mono italic">¥ {{ title.totalAmount }}</span>
            </td>
            <td class="px-8 py-6">
              <span class="text-sm font-bold text-slate-500 dark:text-slate-400">{{ title.lastUsed }}</span>
            </td>
            <td class="px-8 py-6">
              <span 
                class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border"
                :class="title.status === 'valid' 
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900' 
                  : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900'"
              >
                {{ title.status === 'valid' ? '已验证' : '审核中' }}
              </span>
            </td>
            <td class="px-8 py-6 text-right">
              <div class="flex items-center justify-end gap-3">
                <button 
                  @click="openModal(title)"
                  class="text-slate-400 hover:text-primary transition-colors text-sm font-black uppercase tracking-widest"
                >
                  编辑
                </button>
                <div class="w-px h-3 bg-slate-200 dark:bg-slate-700"></div>
                <button 
                  class="text-slate-400 hover:text-red-500 transition-colors text-sm font-black uppercase tracking-widest"
                >
                  删除
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <InvoiceTitleModal 
      :show="showModal" 
      :edit-data="editingTitle"
      @close="showModal = false"
      @save="handleSave"
    />
  </div>
</template>

<script>
import InvoiceTitleModal from './InvoiceTitleModal.vue'

export default {
  name: 'InvoiceTitleList',
  components: {
    InvoiceTitleModal
  },
  emits: ['back'],
  data() {
    return {
      showModal: false,
      editingTitle: null,
      titles: [
        {
          id: 1,
          name: '北京某某科技有限公司',
          taxId: '91110108MA000000',
          totalAmount: '1,200.00',
          lastUsed: '2023-10-01',
          status: 'valid',
          isDefault: true,
          type: 'enterprise'
        },
        {
          id: 2,
          name: '个人',
          taxId: null,
          totalAmount: '50.00',
          lastUsed: '2023-09-28',
          status: 'pending',
          isDefault: false,
          type: 'personal'
        },
        {
          id: 3,
          name: '上海创新网络技术有限公司',
          taxId: '91310115MA1H2345',
          totalAmount: '8,500.00',
          lastUsed: '2023-09-15',
          status: 'valid',
          isDefault: false,
          type: 'enterprise'
        }
      ]
    }
  },
  methods: {
    openModal(title = null) {
      this.editingTitle = title ? { 
        type: title.type,
        title: title.name, 
        taxId: title.taxId,
        isDefault: title.isDefault,
        // Mock data for other fields
        bankName: '招商银行',
        bankAccount: '123456789',
        address: '北京市海淀区',
        phone: '010-12345678'
      } : null
      this.showModal = true
    },
    handleSave(formData) {
      console.log('Saved title:', formData)
      // Here you would call API to save
      this.showModal = false
      alert('发票抬头已保存')
    }
  }
}
</script>
