<template>
  <div class="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
    <!-- Breadcrumb Navigation -->
    <div class="flex items-center gap-3 text-sm">
      <button @click="$emit('back')" class="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors font-bold">
        账单管理
      </button>
      <span class="material-icons-round text-slate-300 text-xs">chevron_right</span>
      <button @click="$emit('back')" class="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors font-bold">
        账单总览
      </button>
      <span class="material-icons-round text-slate-300 text-xs">chevron_right</span>
      <span class="text-slate-900 dark:text-white font-black">{{ billDate }}账单详情</span>
    </div>

    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{{ billDate }}账单详情</h1>
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Billing Detail · Resource Usage Report</p>
      </div>
      <button class="bg-slate-900 dark:bg-primary text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3">
        <span class="material-icons-round">download</span>
        下载 PDF 账单
      </button>
    </div>

    <!-- Summary Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 hover:shadow-lg transition-all group">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform">
            <span class="material-icons-round">calendar_month</span>
          </div>
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">账单月份</span>
        </div>
        <p class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{{ billDate }}</p>
      </div>

      <div class="bg-gradient-to-br from-primary to-blue-600 rounded-xl p-6 text-white shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all group hover:scale-[1.02]">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <span class="material-icons-round">account_balance_wallet</span>
          </div>
          <span class="text-[10px] font-black uppercase tracking-widest opacity-90">应付总额</span>
        </div>
        <p class="text-3xl font-black text-white/100 tracking-tighter italic">{{ totalAmount }}</p>
      </div>

      <div class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 hover:shadow-lg transition-all group">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <span class="material-icons-round">check_circle</span>
          </div>
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">状态</span>
        </div>
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          已结清
        </span>
      </div>

      <div class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 hover:shadow-lg transition-all group">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform">
            <span class="material-icons-round">schedule</span>
          </div>
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">支付日期</span>
        </div>
        <p class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">2023-11-05</p>
      </div>
    </div>

    <!-- Fee Details Table -->
    <div class="space-y-6">
      <div class="flex items-center justify-between px-2">
        <div>
          <h3 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">费用明细</h3>
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Resource Usage Breakdown</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="relative group">
            <span class="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg group-focus-within:text-primary transition-colors"></span>
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="搜索费用项..."
              class="pl-12 pr-4 py-3 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm w-64"
            />
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
              <th class="px-8 py-5">费用项</th>
              <th class="px-8 py-5 text-right">计费单价</th>
              <th class="px-8 py-5 text-right">使用量/规格</th>
              <th class="px-8 py-5 text-right">折扣/抵扣</th>
              <th class="px-8 py-5 text-right">应付小计</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr v-for="(item, index) in feeItems" :key="index" class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
              <td class="px-8 py-6">
                <div class="flex items-center gap-4">
                  <div :class="['w-12 h-12 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform', item.iconBg]">
                    <span :class="['material-icons-round text-xl', item.iconColor]">{{ item.icon }}</span>
                  </div>
                  <div>
                    <p class="text-sm font-black text-slate-900 dark:text-white tracking-tight">{{ item.name }}</p>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{{ item.desc }}</p>
                  </div>
                </div>
              </td>
              <td class="px-8 py-6 text-right">
                <span class="text-sm font-bold text-slate-600 dark:text-slate-300 font-mono">{{ item.price }}</span>
              </td>
              <td class="px-8 py-6 text-right">
                <span class="text-sm font-black text-slate-900 dark:text-white">{{ item.usage }}</span>
              </td>
              <td class="px-8 py-6 text-right">
                <span :class="['text-sm font-black', item.discount === '¥0.00' ? 'text-slate-300' : 'text-emerald-500']">{{ item.discount }}</span>
              </td>
              <td class="px-8 py-6 text-right">
                <span class="text-sm font-black text-slate-900 dark:text-white font-mono italic">{{ item.total }}</span>
              </td>
            </tr>
          </tbody>
          <tfoot class="bg-slate-50 dark:bg-slate-800/50 border-t-2 border-slate-200 dark:border-slate-700">
            <tr>
              <td colspan="4" class="px-8 py-6 text-right text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">合计</td>
              <td class="px-8 py-6 text-right text-2xl font-black text-primary tracking-tight italic">{{ totalAmount }}</td>
            </tr>
          </tfoot>
        </table>

        <!-- Pagination -->
        <div class="px-8 py-6 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            显示 <span class="text-slate-900 dark:text-white">{{ feeItems.length }}</span> 条，共 <span class="text-slate-900 dark:text-white">12</span> 条记录
          </p>
          <div class="flex items-center gap-2">
            <button class="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-300 text-[10px] font-black opacity-50 cursor-not-allowed">‹</button>
            <button class="w-8 h-8 rounded-lg bg-primary text-white text-[10px] font-black shadow-lg shadow-primary/20">1</button>
            <button class="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-black hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">2</button>
            <button class="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-black hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">3</button>
            <button class="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-black hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">›</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Helper Info -->
    <div class="flex items-start gap-3 p-6 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800">
      <span class="material-icons-round text-slate-400 text-lg mt-0.5">info</span>
      <p class="text-xs text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
        账单数据可能会有 2-4 小时的延迟。如有疑问，请联系企业客服。
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BillingDetail',
  emits: ['back'],
  data() {
    return {
      billDate: '2023年10月',
      totalAmount: '¥ 12,450.00',
      searchQuery: '',
      feeItems: [
        {
          name: 'Git 存储',
          desc: 'Standard Storage',
          icon: 'database',
          iconBg: 'bg-orange-50 dark:bg-orange-900/30',
          iconColor: 'text-orange-500',
          price: '¥0.50 / GB / 月',
          usage: '1.2 TB',
          discount: '-¥100.00',
          total: '¥500.00'
        },
        {
          name: '流水线运行时长',
          desc: 'CI/CD Runner Linux',
          icon: 'rocket_launch',
          iconBg: 'bg-blue-50 dark:bg-blue-900/30',
          iconColor: 'text-blue-500',
          price: '¥0.15 / 分钟',
          usage: '15,000 分钟',
          discount: '¥0.00',
          total: '¥2,250.00'
        },
        {
          name: 'AI Token 消耗',
          desc: 'Generative AI Model V4',
          icon: 'smart_toy',
          iconBg: 'bg-purple-50 dark:bg-purple-900/30',
          iconColor: 'text-purple-500',
          price: '¥0.02 / 1k Tokens',
          usage: '5,000,000',
          discount: '-¥50.00',
          total: '¥50.00'
        },
        {
          name: 'LFS 大文件存储',
          desc: 'Large File Storage',
          icon: 'cloud_sync',
          iconBg: 'bg-teal-50 dark:bg-teal-900/30',
          iconColor: 'text-teal-500',
          price: '¥0.40 / GB / 月',
          usage: '500 GB',
          discount: '¥0.00',
          total: '¥200.00'
        },
        {
          name: 'API 调用 (高级版)',
          desc: 'Enterprise API Gateway',
          icon: 'api',
          iconBg: 'bg-slate-100 dark:bg-slate-700',
          iconColor: 'text-slate-600 dark:text-slate-300',
          price: '¥100 / 万次',
          usage: '94.5 万次',
          discount: '-¥500.00',
          total: '¥8,950.00'
        }
      ]
    }
  }
}
</script>
