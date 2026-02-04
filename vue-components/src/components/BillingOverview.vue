<template>
  <div class="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <!-- Header Card -->
    <div class="relative bg-slate-900 dark:bg-black rounded-xl p-12 text-white overflow-hidden shadow-2xl group transition-all hover:scale-[1.01]">
      <div class="absolute -right-20 -bottom-20 w-96 h-96 bg-primary/20 blur-[100px] rounded-full group-hover:bg-primary/30 transition-all duration-1000"></div>
      <div class="absolute top-0 right-0 opacity-5 group-hover:opacity-10 transition-opacity duration-1000">
        <span class="material-icons-round text-[320px]">account_balance_wallet</span>
      </div>
      
      <div class="relative z-10 flex items-center justify-between">
        <div class="flex-1">
          <p class="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mb-4">当前账单</p>
          <h2 class="text-6xl font-black text-white/100 tracking-tighter mb-2 italic">¥ 12,450.00</h2>
          <p class="text-sm text-white/80 font-medium mb-8">2023年10月账单 · 待支付</p>
          
          <div class="flex items-center gap-6 text-sm">
            <div class="flex items-center gap-2">
              <span class="material-icons-round text-white/60">schedule</span>
              <span class="text-white/80 font-medium">到期日: 2023-11-15</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="material-icons-round text-white/60">receipt</span>
              <span class="text-white/80 font-medium">BILL-20231001</span>
            </div>
          </div>
        </div>
        
        <div class="flex shrink-0">
          <button 
            class="bg-primary hover:bg-primary-dark text-white px-10 py-5 rounded-xl text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/40 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3"
            @click="showPaymentModal = true"
          >
            立即结算
            <span class="material-icons-round">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Billing Table Section -->
    <div class="space-y-6">
      <div class="flex items-center justify-between px-2">
        <div>
          <h3 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">月度账单历史</h3>
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Monthly Billing History</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="relative group">
            <select v-model="selectedYear" class="appearance-none bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white py-3 pl-6 pr-12 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm cursor-pointer">
              <option value="2023 FY">2023 FY</option>
              <option value="2022 FY">2022 FY</option>
              <option value="2021 FY">2021 FY</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
              <span class="material-icons-round text-lg">expand_more</span>
            </div>
          </div>
          <button class="p-3 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-primary transition-all shadow-sm">
            <span class="material-icons-round">filter_list</span>
          </button>
        </div>
      </div>

      <div class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 dark:border-slate-800">
              <th class="px-8 py-5">账单月份</th>
              <th class="px-8 py-5 text-right">账单金额</th>
              <th class="px-8 py-5 text-right">支付状态</th>
              <th class="px-8 py-5 text-right">发票状态</th>
              <th class="px-8 py-5 text-right">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr v-for="(bill, index) in bills" :key="index" class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
              <td class="px-8 py-6">
                <span class="text-sm font-black text-slate-900 dark:text-white tracking-tight uppercase">{{ bill.month }}</span>
              </td>
              <td class="px-8 py-6 text-right">
                <span class="text-sm font-black text-slate-900 dark:text-white font-mono italic">¥ {{ bill.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) }}</span>
              </td>
              <td class="px-8 py-6 text-right">
                <span :class="[
                  'inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border',
                  bill.paid 
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900'
                    : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900'
                ]">
                  <span :class="['w-1.5 h-1.5 rounded-full', bill.paid ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse']"></span>
                  {{ bill.paid ? '已结清' : '待支付' }}
                </span>
              </td>
              <td class="px-8 py-6 text-right">
                <span :class="[
                  'inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border',
                  bill.invoiced 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                ]">
                  {{ bill.invoiced ? '已开票' : '未开票' }}
                </span>
              </td>
              <td class="px-8 py-6 text-right">
                <div class="flex items-center justify-end gap-3">
                  <button 
                    @click="$emit('view-detail', bill)"
                    class="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
                  >
                    详情
                  </button>
                  <button v-if="bill.paid" class="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                    <span class="material-icons-round text-lg">download</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Empty Space or Footer -->
        <div class="px-8 py-6 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800">
          <p class="text-[10px] font-black text-slate-400 text-center uppercase tracking-widest">
            账单系统将于每月初 3 号自动生成上月结对账单，如有异议请联系财务专员。
          </p>
        </div>
      </div>
    </div>

    <!-- Payment Modal -->
    <PaymentModal
      :show="showPaymentModal"
      amount="12,450.00"
      bill-number="BILL-20231001"
      @close="showPaymentModal = false"
      @submit="handlePaymentSubmit"
    />
  </div>
</template>

<script>
import PaymentModal from './PaymentModal.vue'

export default {
  name: 'BillingOverview',
  components: {
    PaymentModal
  },
  emits: ['view-detail'],
  data() {
    return {
      selectedYear: '2023 FY',
      showPaymentModal: false,
      bills: [
        { month: '2023年10月', amount: 12450.00, paid: false, invoiced: false },
        { month: '2023年09月', amount: 11800.00, paid: true, invoiced: true },
        { month: '2023年08月', amount: 10500.00, paid: true, invoiced: true },
        { month: '2023年07月', amount: 9200.00, paid: true, invoiced: false },
        { month: '2023年06月', amount: 8800.00, paid: true, invoiced: true }
      ]
    }
  },
  methods: {
    handlePaymentSubmit(data) {
      console.log('支付凭证提交:', data)
      // TODO: 调用 API 提交凭证
      // 提交成功后关闭弹窗
      this.showPaymentModal = false
      // 可以显示成功提示
      alert('汇款凭证已提交，我们将在 1-2 个工作日内完成核销')
    }
  }
}
</script>
