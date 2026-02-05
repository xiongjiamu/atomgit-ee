<template>
  <div class="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <!-- Info Alerts -->
    <div class="space-y-0">
      <AlertBanner
        v-model="showAlert"
        type="warning"
        title="资源预警"
        icon="info"
        message="您企业当前的存储空间已使用 856GB (85%)，接近包年套餐上限，请关注资源消耗或及时扩容"
      />

      <AlertBanner
        v-model="showNotice"
        type="info"
        title="企业公告"
        icon="campaign"
        message="AtomGit 将于本周五 22:00 进行版本升级，届时 CI/CD 服务可能会有短时闪断，请知悉"
      />
    </div>

    <!-- Header -->
    <div class="flex items-center justify-between px-2">
      <div>
        <h1 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">发票管理</h1>
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Invoice Management · Tax & Billing</p>
      </div>
      <button 
        @click="$emit('manage-titles')"
        class="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-lg active:scale-95"
      >
        管理发票抬头
      </button>
    </div>

    <!-- Pending Invoices Section -->
    <div class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
      <h2 class="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-6 flex items-center gap-2">
        <span class="material-icons-round text-primary">receipt</span>
        待开票账单
      </h2>
      
      <div 
        v-for="bill in pendingBills" 
        :key="bill.id"
        class="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 p-5 mb-6 flex items-center justify-between hover:border-primary/30 transition-all group cursor-pointer"
        @click="toggleSelection(bill)"
      >
        <div class="flex items-center">
          <div 
            class="w-5 h-5 rounded border border-slate-300 dark:border-slate-600 mr-4 flex items-center justify-center transition-all"
            :class="bill.selected ? 'bg-primary border-primary' : 'bg-white dark:bg-slate-700'"
          >
            <span v-if="bill.selected" class="material-icons-round text-white text-sm">check</span>
          </div>
          <div>
            <div class="font-bold text-sm text-slate-900 dark:text-white">{{ bill.period }}账单</div>
            <div class="text-xs text-slate-500 dark:text-slate-400 mt-1 font-bold">可开票金额: <span class="text-slate-900 dark:text-white font-mono">¥ {{ bill.amount.toLocaleString('zh-CN', {minimumFractionDigits: 2}) }}</span></div>
          </div>
        </div>
        <span class="text-[10px] font-black px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg uppercase tracking-widest border border-emerald-100 dark:border-emerald-900/30">
          已结清
        </span>
      </div>

      <div class="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 mt-6">
        <div class="text-sm">
          <span class="text-slate-500 dark:text-slate-400 font-bold mr-2">已选金额:</span>
          <span class="text-2xl font-black text-primary tracking-tight">¥ {{ totalSelectedAmount.toLocaleString('zh-CN', {minimumFractionDigits: 2}) }}</span>
        </div>
        <button 
          class="px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center gap-2"
          :class="totalSelectedAmount > 0 ? 'bg-primary text-white hover:bg-primary-dark shadow-primary/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'"
          :disabled="totalSelectedAmount === 0"
        >
          <span class="material-icons-round text-lg">post_add</span>
          申请合并开票
        </button>
      </div>
    </div>

    <!-- Invoice History -->
    <div class="space-y-6">
      <h2 class="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
        <span class="material-icons-round text-slate-400">history</span>
        开票历史
      </h2>
      <div class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 dark:border-slate-800">
              <th class="px-8 py-5">申请时间</th>
              <th class="px-8 py-5">发票内容</th>
              <th class="px-8 py-5">金额</th>
              <th class="px-8 py-5">类型</th>
              <th class="px-8 py-5">状态</th>
              <th class="px-8 py-5 text-right">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr v-for="(invoice, index) in invoiceHistory" :key="index" class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
              <td class="px-8 py-6">
                <span class="text-sm font-bold text-slate-900 dark:text-white">{{ invoice.date }}</span>
              </td>
              <td class="px-8 py-6">
                <span class="text-sm font-bold text-slate-700 dark:text-slate-300">{{ invoice.content }}</span>
              </td>
              <td class="px-8 py-6">
                <span class="text-sm font-black text-slate-900 dark:text-white font-mono italic">¥ {{ invoice.amount }}</span>
              </td>
              <td class="px-8 py-6">
                <span class="text-xs font-bold text-slate-500 dark:text-slate-400">{{ invoice.type }}</span>
              </td>
              <td class="px-8 py-6">
                <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900">
                  {{ invoice.status }}
                </span>
              </td>
              <td class="px-8 py-6 text-right">
                <button class="text-primary hover:text-blue-700 dark:hover:text-blue-300 text-sm font-black uppercase tracking-widest flex items-center justify-end gap-1 ml-auto">
                  <span class="material-icons-round text-base">download</span>
                  下载 PDF
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import AlertBanner from './AlertBanner.vue'

export default {
  name: 'InvoiceManagement',
  components: {
    AlertBanner
  },
  emits: ['manage-titles'],
  data() {
    return {
      showAlert: true,
      showNotice: true,
      pendingBills: [
        {
          id: 1,
          period: '2023年08月',
          amount: 10500.00,
          status: '已结清',
          selected: false
        },
        {
          id: 2,
          period: '2023年07月',
          amount: 9200.00,
          status: '已结清',
          selected: false
        }
      ],
      invoiceHistory: [
        {
          date: '2023-10-06',
          content: '软件服务费 (202309账单)',
          amount: '11,800.00',
          type: '增值税专用发票',
          status: '已开具'
        },
        {
          date: '2023-09-08',
          content: '软件服务费 (202308账单)',
          amount: '10,500.00',
          type: '增值税普通发票',
          status: '已开具'
        }
      ]
    }
  },
  computed: {
    totalSelectedAmount() {
      return this.pendingBills
        .filter(bill => bill.selected)
        .reduce((sum, bill) => sum + bill.amount, 0)
    }
  },
  methods: {
    toggleSelection(bill) {
      bill.selected = !bill.selected
    }
  }
}
</script>
