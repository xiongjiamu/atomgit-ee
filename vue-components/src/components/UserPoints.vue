<template>
  <div class="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <!-- Header Area -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">用户积分管理</h1>
        <p class="text-slate-500 dark:text-slate-400 mt-2 font-medium">查看、调整社区活跃用户的积分资产，激励企业内部开源贡献。</p>
      </div>
      <div class="flex items-center gap-3">
        <button class="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-black rounded-xl uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
          积分流水导出
        </button>
        <button class="px-6 py-3 bg-primary text-white text-xs font-black rounded-xl uppercase tracking-widest shadow-lg shadow-primary/20 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-2">
          <span class="material-icons-round text-lg">add_circle</span>
          批量赠送积分
        </button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="stat in mainStats" :key="stat.label" class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
        <div class="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
          <span class="material-icons-round text-8xl">{{ stat.icon }}</span>
        </div>
        <div class="flex items-center justify-between mb-6">
           <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{{ stat.label }}</span>
           <div :class="['w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110', stat.iconBg]">
              <span :class="['material-icons-round text-lg', stat.iconColor]">{{ stat.icon }}</span>
           </div>
        </div>
        <div class="flex items-baseline gap-2">
          <span :class="['text-4xl font-black tracking-tighter', stat.valueColor || 'text-slate-900 dark:text-white']">{{ stat.value }}</span>
        </div>
        <p class="text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-widest">{{ stat.description }}</p>
      </div>
    </div>

    <!-- Table Section -->
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row gap-4 items-center justify-between px-2">
        <div class="relative flex-1 w-full group">
          <span class="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <span class="material-icons-round text-slate-400 text-lg group-focus-within:text-primary transition-colors">search</span>
          </span>
          <input 
            type="text"
            class="block w-full pl-14 pr-6 py-4 text-sm bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder-slate-400 dark:text-white shadow-sm"
            placeholder="通过用户名、UID 或 邮箱地址进行模糊搜索..." 
          />
        </div>
        <div class="flex items-center gap-3 shrink-0">
          <button class="px-6 py-4 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2">
            高级筛选
            <span class="material-icons-round text-base">filter_list</span>
          </button>
        </div>
      </div>

      <div class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 dark:border-slate-800">
              <th class="px-8 py-6">用户信息</th>
              <th class="px-8 py-6">当前余额</th>
              <th class="px-8 py-6">累计获取</th>
              <th class="px-8 py-6">活跃状态</th>
              <th class="px-8 py-6 text-right">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr v-for="user in users" :key="user.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
              <td class="px-8 py-6">
                <div class="flex items-center gap-4">
                  <div v-if="user.avatar" class="w-12 h-12 rounded-xl overflow-hidden shadow-md group-hover:scale-105 transition-transform">
                     <img :src="user.avatar" alt="User" class="w-full h-full object-cover" />
                  </div>
                  <div v-else :class="['w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shadow-md group-hover:scale-105 transition-transform', user.avatarBg, user.avatarColor]">
                    {{ user.name.charAt(0).toUpperCase() }}
                  </div>
                  <div class="flex flex-col">
                    <span class="text-sm font-black text-slate-900 dark:text-white tracking-tight">{{ user.name }}</span>
                    <span class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">ID: {{ user.id }}</span>
                  </div>
                </div>
              </td>
              <td class="px-8 py-6">
                <div class="flex flex-col">
                  <span class="text-sm font-black text-slate-900 dark:text-white italic">¥ {{ user.balance.toLocaleString() }}</span>
                </div>
              </td>
              <td class="px-8 py-6 text-sm font-bold text-slate-500 dark:text-slate-400">
                {{ user.totalEarned.toLocaleString() }}
              </td>
              <td class="px-8 py-6">
                <div class="flex items-center gap-2">
                  <div :class="['w-2 h-2 rounded-full', user.online ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse' : 'bg-slate-300']"></div>
                  <span :class="['text-[10px] font-black uppercase tracking-widest', user.online ? 'text-emerald-500' : 'text-slate-400']">
                    {{ user.lastActive }}
                  </span>
                </div>
              </td>
              <td class="px-8 py-6 text-right">
                <div class="flex items-center justify-end gap-3">
                  <button class="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-black text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-primary hover:text-white transition-all">调整积分</button>
                  <button class="w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 transition-colors">
                    <span class="material-icons-round text-lg">more_vert</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Table Footer -->
        <div class="px-8 py-6 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
           <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">显示 <span class="text-slate-900 dark:text-white">{{ users.length }}</span> 位核心贡献者</p>
           <div class="flex gap-2">
             <button class="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 disabled:opacity-30" disabled>
               <span class="material-icons-round text-base">chevron_left</span>
             </button>
             <button class="w-10 h-10 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black text-xs font-black">1</button>
             <button class="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400">
               <span class="material-icons-round text-base">chevron_right</span>
             </button>
           </div>
        </div>
      </div>
    </div>
    
    <!-- Page Footer -->
    <p class="text-center text-[11px] font-bold text-slate-400 mt-12 mb-4 uppercase tracking-widest">AtomGit Enterprise · © 2024</p>
  </div>
</template>

<script>
export default {
  name: 'UserPoints',
  data() {
    return {
      mainStats: [
        { 
          label: '全社区总积分', 
          value: '2,485,900', 
          description: '企业内部累计发放资产', 
          icon: 'savings', 
          iconBg: 'bg-indigo-50 dark:bg-indigo-900/20', 
          iconColor: 'text-indigo-500' 
        },
        { 
          label: '今日发放', 
          value: '+12,450', 
          valueColor: 'text-emerald-500',
          description: '较昨日增长 12.5%', 
          icon: 'trending_up', 
          iconBg: 'bg-emerald-50 dark:bg-emerald-900/20', 
          iconColor: 'text-emerald-500' 
        },
        { 
          label: '今日兑换', 
          value: '-3,200', 
          valueColor: 'text-rose-500',
          description: '包含 5 笔实物履约', 
          icon: 'shopping_bag', 
          iconBg: 'bg-rose-50 dark:bg-rose-900/20', 
          iconColor: 'text-rose-500' 
        },
        { 
          label: '高净值用户', 
          value: '156', 
          description: '积分超过 10,000 的开发者', 
          icon: 'verified', 
          iconBg: 'bg-amber-50 dark:bg-amber-900/20', 
          iconColor: 'text-amber-500' 
        }
      ],
      users: [
        {
          id: '889201',
          name: 'Developer_Alpha',
          avatar: null,
          avatarBg: 'from-blue-500 to-indigo-600',
          avatarColor: 'text-white',
          balance: 12450,
          totalEarned: 45000,
          lastActive: 'Online',
          online: true
        },
        {
          id: '912042',
          name: 'CodeWizard_88',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAM3VLjidOwxKVJUCCEfKrqDNfWgnGxolnBpFqRfUV8dTp2C3sSXRVY0oxitGFLBP7BKkJq9b-seT80sAgxJt1o64lUVp7y-E5qLC2H_UvoDqdB8aJT6fBKJ1a8HLdW8ylK0XNjbCgQF5lPMsnFKQjyiCTinsWT32l2MgHDbygAC64Yv3KanjONifiRrqKWOkWsHKqkXOK-ACYIGYQ65BvEx7WfBYHySzsjnFaJMXvqlkRHoPNvsAGs0jAWzJWQAkL1gJX9qUILy4lt',
          balance: 8920,
          totalEarned: 22400,
          lastActive: '2 Hours Ago',
          online: false
        },
        {
          id: '772109',
          name: 'LinuxMaster',
          avatar: null,
          avatarBg: 'from-purple-500 to-pink-600',
          avatarColor: 'text-white',
          balance: 5100,
          totalEarned: 5100,
          lastActive: 'Yesterday',
          online: false
        }
      ]
    }
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.15);
  border-radius: 0.75rem;
}
</style>
