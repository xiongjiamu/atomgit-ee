<template>
  <div class="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">兑换履约管理</h1>
        <p class="text-slate-500 dark:text-slate-400 mt-2 font-medium">第三方履约状态监控及记录一致性对账</p>
      </div>
      <div class="flex items-center gap-3">
        <button class="flex items-center justify-center px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all shadow-sm">
          <span class="material-icons-round text-lg mr-2">download</span>
          导出记录
        </button>
      </div>
    </div>

    <!-- Alert Banners (Optional, keeping consistent with design) -->
    <AlertBanner
      v-model="showErrorAlert"
      type="warning"
      title="异常提醒"
      icon="warning"
    >
      当前有 3 条兑换记录第三方接口返回异常，请及时处理。
    </AlertBanner>

    <!-- Filter Bar -->
    <div class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="relative flex-1">
          <span class="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg rotated-0">search</span>
          <input 
            type="text" 
            class="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all"
            placeholder="搜索记录 ID、用户、商品名称..."
          />
        </div>
        <div class="flex items-center gap-2">
          <div class="relative">
            <span class="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">calendar_today</span>
            <input 
              type="text" 
              class="pl-10 pr-4 py-2.5 w-64 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="2023-10-01 至 2023-10-31"
            />
          </div>
          <button class="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
            <span class="material-icons-round">filter_list</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
            <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">记录 ID</th>
            <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">兑换详情</th>
            <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">第三方状态</th>
            <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">对账状态</th>
            <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
          <tr v-for="order in orders" :key="order.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
            <td class="px-6 py-5">
              <span class="text-sm font-mono text-slate-400 dark:text-slate-500 font-medium">{{ order.id }}</span>
            </td>
            <td class="px-6 py-5">
              <div class="flex flex-col">
                <span class="text-sm font-bold text-slate-900 dark:text-white">{{ order.itemName }}</span>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-[11px] text-slate-400 font-medium">用户: {{ order.user }}</span>
                </div>
              </div>
            </td>
            <td class="px-6 py-5">
              <div class="flex items-center" :class="order.statusColor">
                <span class="material-icons-round text-sm mr-1.5">{{ order.statusIcon }}</span>
                <span class="text-sm font-semibold">{{ order.statusText }}</span>
              </div>
            </td>
            <td class="px-6 py-5">
              <span 
                :class="[
                  'inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all',
                  order.reconcileColor
                ]"
              >
                {{ order.reconcileStatus }}
              </span>
            </td>
            <td class="px-6 py-5 text-right">
              <button 
                v-if="order.canRetry"
                class="bg-primary text-white px-4 py-1.5 rounded-xl text-xs font-bold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
              >
                手动重试
              </button>
              <button 
                v-else
                class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <span class="material-icons-round">more_horiz</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="px-6 py-4 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <p class="text-xs font-bold text-slate-500 dark:text-slate-400">
          共 <span class="text-slate-900 dark:text-white">{{ orders.length }}</span> 条记录
        </p>
        <div class="flex items-center gap-1">
          <button class="p-2 text-slate-400 cursor-not-allowed"><span class="material-icons-round text-sm">chevron_left</span></button>
          <button class="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white text-xs font-bold">1</button>
          <button class="p-2 text-slate-400 cursor-not-allowed"><span class="material-icons-round text-sm">chevron_right</span></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AlertBanner from './AlertBanner.vue'

export default {
  name: 'FulfillmentManagement',
  components: {
    AlertBanner
  },
  data() {
    return {
      showErrorAlert: true,
      orders: [
        {
          id: 'REDEEM_99012',
          itemName: '华为云 $100 代金券',
          user: 'Dev_Pro',
          statusText: '接口调用超时',
          statusIcon: 'cancel',
          statusColor: 'text-rose-500',
          reconcileStatus: '数据不一致',
          reconcileColor: 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-900/30',
          canRetry: true
        },
        {
          id: 'REDEEM_99011',
          itemName: '京东 E 卡 ￥500',
          user: 'TechLead_CN',
          statusText: '已成功发放',
          statusIcon: 'check_circle',
          statusColor: 'text-emerald-500',
          reconcileStatus: '对账成功',
          reconcileColor: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30',
          canRetry: false
        },
        {
          id: 'REDEEM_99010',
          itemName: 'AtomGit 认证专家勋章',
          user: 'Miykael_Code',
          statusText: '处理中',
          statusIcon: 'sync',
          statusColor: 'text-blue-500',
          reconcileStatus: '待对账',
          reconcileColor: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30',
          canRetry: false
        }
      ]
    }
  }
}
</script>
