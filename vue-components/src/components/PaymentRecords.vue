<template>
  <div class="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <!-- Alert Banners -->
    <div class="space-y-0">
      <AlertBanner
        v-model="showResourceAlert"
        type="warning"
        title="资源预警"
        icon="info"
        message="您企业当前的存储空间已使用 856GB (85%), 接近包年套餐上限，请关注资源消耗或及时扩容"
      />

      <AlertBanner
        v-model="showAnnouncementAlert"
        type="info"
        title="企业公告"
        icon="campaign"
        message="AtomGit 将于本周五 22:00 进行版本升级，届时 CI/CD 服务可能会有短时闪断，请知悉"
      />
    </div>

    <!-- Page Header -->
    <div class="flex items-center justify-between px-2">
      <div>
        <h1 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">付费流水记录</h1>
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Payment Records · Transaction History</p>
      </div>
    </div>

    <!-- Payment Records Table -->
    <div class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 dark:border-slate-800">
            <th class="px-8 py-5">交易时间</th>
            <th class="px-8 py-5">交易单号</th>
            <th class="px-8 py-5">关联账单</th>
            <th class="px-8 py-5">支付方式</th>
            <th class="px-8 py-5 text-right">金额</th>
            <th class="px-8 py-5 text-right">状态</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
          <tr v-for="(record, index) in paymentRecords" :key="index" class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
            <td class="px-8 py-6">
              <span class="text-sm font-bold text-slate-900 dark:text-white">{{ record.date }}</span>
            </td>
            <td class="px-8 py-6">
              <span class="text-sm font-mono text-slate-600 dark:text-slate-400">{{ record.transactionId }}</span>
            </td>
            <td class="px-8 py-6">
              <span class="text-sm font-bold text-slate-900 dark:text-white">{{ record.billPeriod }}</span>
            </td>
            <td class="px-8 py-6">
              <div class="flex items-center gap-2">
                <span class="material-icons-round text-slate-400 text-lg">{{ record.paymentIcon }}</span>
                <span class="text-sm font-bold text-slate-700 dark:text-slate-300">{{ record.paymentMethod }}</span>
              </div>
            </td>
            <td class="px-8 py-6 text-right">
              <span class="text-sm font-black text-slate-900 dark:text-white font-mono italic">{{ record.amount }}</span>
            </td>
            <td class="px-8 py-6 text-right">
              <span :class="[
                'inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border',
                record.status === 'success' 
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900'
                  : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900'
              ]">
                <span v-if="record.status === 'success'" class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span v-else class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                {{ record.statusText }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="px-8 py-6 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          显示 <span class="text-slate-900 dark:text-white">{{ paymentRecords.length }}</span> 条，共 <span class="text-slate-900 dark:text-white">{{ totalRecords }}</span> 条记录
        </p>
        <div class="flex items-center gap-2">
          <button class="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-300 text-[10px] font-black opacity-50 cursor-not-allowed">‹</button>
          <button class="w-8 h-8 rounded-lg bg-primary text-white text-[10px] font-black shadow-lg shadow-primary/20">1</button>
          <button class="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-black hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">2</button>
          <button class="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-black hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">›</button>
        </div>
      </div>
    </div>

    <!-- Helper Info -->
    <div class="flex items-start gap-3 p-6 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800">
      <span class="material-icons-round text-slate-400 text-lg mt-0.5">info</span>
      <p class="text-xs text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
        付费记录会在交易完成后 2-4 小时内更新。如有疑问，请联系企业客服。
      </p>
    </div>
  </div>
</template>

<script>
import AlertBanner from './AlertBanner.vue'

export default {
  name: 'PaymentRecords',
  components: {
    AlertBanner
  },
  data() {
    return {
      showResourceAlert: true,
      showAnnouncementAlert: true,
      totalRecords: 25,
      paymentRecords: [
        {
          date: '2023-10-05 14:30:22',
          transactionId: 'TRX_20231005_9982',
          billPeriod: '2023年09月账单',
          paymentMethod: '企业网银',
          paymentIcon: 'credit_card',
          amount: '¥ 11,800.00',
          status: 'success',
          statusText: '支付成功'
        },
        {
          date: '2023-09-03 09:15:10',
          transactionId: 'TRX_20230903_1123',
          billPeriod: '2023年08月账单',
          paymentMethod: '支付宝企业',
          paymentIcon: 'account_balance_wallet',
          amount: '¥ 10,500.00',
          status: 'success',
          statusText: '支付成功'
        },
        {
          date: '2023-08-02 16:45:33',
          transactionId: 'TRX_20230802_5567',
          billPeriod: '2023年07月账单',
          paymentMethod: '企业网银',
          paymentIcon: 'credit_card',
          amount: '¥ 9,200.00',
          status: 'success',
          statusText: '支付成功'
        },
        {
          date: '2023-07-05 11:20:15',
          transactionId: 'TRX_20230705_8834',
          billPeriod: '2023年06月账单',
          paymentMethod: '线下汇款',
          paymentIcon: 'account_balance',
          amount: '¥ 12,100.00',
          status: 'success',
          statusText: '支付成功'
        },
        {
          date: '2023-06-03 14:10:28',
          transactionId: 'TRX_20230603_2291',
          billPeriod: '2023年05月账单',
          paymentMethod: '企业网银',
          paymentIcon: 'credit_card',
          amount: '¥ 8,800.00',
          status: 'success',
          statusText: '支付成功'
        }
      ]
    }
  }
}
</script>
