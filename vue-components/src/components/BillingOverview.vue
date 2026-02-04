<template>
  <div class="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <!-- Header Card -->
    <div class="relative bg-slate-900 dark:bg-black rounded-[2.5rem] p-12 text-white overflow-hidden shadow-2xl group transition-all hover:scale-[1.01]">
      <div class="absolute -right-20 -bottom-20 w-96 h-96 bg-primary/20 blur-[100px] rounded-full group-hover:bg-primary/30 transition-all duration-1000"></div>
      <div class="absolute top-0 right-0 opacity-5 group-hover:opacity-10 transition-opacity duration-1000">
        <span class="material-icons-round text-[320px]">account_balance_wallet</span>
      </div>
      
      <div class="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div class="space-y-6">
          <div class="flex items-center gap-3">
            <span class="text-xs font-black uppercase tracking-[0.3em] opacity-60">本期待支付账单</span>
            <span class="px-2.5 py-1 bg-red-500 text-white text-[10px] font-black rounded-lg uppercase tracking-widest shadow-lg shadow-red-500/30 animate-pulse">Pending</span>
          </div>
          <div class="flex items-baseline gap-4">
            <span class="text-6xl font-black tracking-tighter italic">¥ 12,450.00</span>
          </div>
          <div class="flex flex-wrap items-center gap-6">
            <div class="flex items-center gap-2">
              <span class="material-icons-round text-slate-500 text-sm">event</span>
              <span class="text-xs font-bold text-slate-400">账单周期: 10/01 - 10/31</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="material-icons-round text-rose-500 text-sm">schedule</span>
              <span class="text-xs font-black text-rose-400 uppercase tracking-widest">最后还款日: 11/10</span>
            </div>
          </div>
        </div>
        
        <div class="flex shrink-0">
          <button class="bg-primary hover:bg-primary-dark text-white px-10 py-5 rounded-[1.5rem] text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/40 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3">
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
            <select class="appearance-none bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white py-3 pl-6 pr-12 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm cursor-pointer">
              <option>2023 FY</option>
              <option>2022 FY</option>
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

      <div class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-sm">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 dark:border-slate-800">
              <th class="px-8 py-5">账单月份</th>
              <th class="px-8 py-5">总金额</th>
              <th class="px-8 py-5">结算状态</th>
              <th class="px-8 py-5">开票状态</th>
              <th class="px-8 py-5 text-right">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr v-for="bill in bills" :key="bill.month" class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
              <td class="px-8 py-6">
                <span class="text-sm font-black text-slate-900 dark:text-white tracking-tight uppercase">{{ bill.month }}</span>
              </td>
              <td class="px-8 py-6">
                <span class="text-sm font-black text-slate-900 dark:text-white font-mono italic">¥ {{ bill.amount.toLocaleString('zh-CN', {minimumFractionDigits: 2}) }}</span>
              </td>
              <td class="px-8 py-6">
                <div class="flex items-center gap-2">
                  <div :class="['w-1.5 h-1.5 rounded-full', bill.paid ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse']"></div>
                  <span :class="['text-[10px] font-black uppercase tracking-widest', bill.paid ? 'text-emerald-500' : 'text-rose-500']">
                    {{ bill.paid ? '已结清' : '待支付' }}
                  </span>
                </div>
              </td>
              <td class="px-8 py-6">
                <span v-if="bill.invoiced" class="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[9px] font-black rounded-lg uppercase tracking-widest border border-blue-100 dark:border-blue-900">
                  已开票
                </span>
                <span v-else class="text-[10px] font-black text-slate-300 uppercase tracking-widest">-</span>
              </td>
              <td class="px-8 py-6 text-right">
                <div class="flex items-center justify-end gap-3">
                  <button class="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-primary hover:text-white transition-all">详情</button>
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
  </div>
</template>

<script>
export default {
  name: 'BillingOverview',
  data() {
    return {
      bills: [
        { month: '2023年10月', amount: 12450.00, paid: false, invoiced: false },
        { month: '2023年09月', amount: 11800.00, paid: true, invoiced: true },
        { month: '2023年08月', amount: 10500.00, paid: true, invoiced: false }
      ]
    }
  }
}
</script>
