<template>
  <div class="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <!-- Header Area -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">企业成员管理</h1>
        <p class="text-slate-500 dark:text-slate-400 mt-2 font-medium">统一管理企业内部成员、外部协作者及其对应的权限范围。</p>
      </div>
      <div class="flex items-center gap-3">
        <button class="px-6 py-3 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-black rounded-xl uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm">
          邀请外部协作者
        </button>
        <button class="px-6 py-3 bg-primary text-white text-xs font-black rounded-xl uppercase tracking-widest shadow-lg shadow-primary/20 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-2">
          <span class="material-icons-round text-lg">person_add</span>
          添加企业成员
        </button>
      </div>
    </div>

    <!-- Alert / Tips (Simplified) -->
    <div class="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-3xl px-8 py-5 flex items-start gap-4">
      <div class="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
        <span class="material-icons-round text-amber-500">info</span>
      </div>
      <div class="flex-1 pt-0.5">
        <p class="text-sm font-black text-amber-900 dark:text-amber-400">资源预警</p>
        <p class="text-xs text-amber-700/70 dark:text-amber-400/70 font-bold mt-0.5">您企业当前的成员席位已使用 121/150 (80.6%)，接近上限，请及时关注。</p>
      </div>
      <button class="text-amber-400 hover:text-amber-600 transition-colors"><span class="material-icons-round">close</span></button>
    </div>

    <!-- Search & Filter Bar -->
    <div class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-sm">
       <div class="flex flex-col md:flex-row gap-4">
          <div class="relative flex-1 group">
             <span class="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
             <input 
               type="text" 
               class="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-900 dark:text-white"
               placeholder="通过姓名、邮箱或用户名搜索成员..."
             />
          </div>
          <div class="flex items-center gap-2">
             <button class="px-6 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">所有角色</button>
             <button class="p-3.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                <span class="material-icons-round">filter_alt</span>
             </button>
          </div>
       </div>
    </div>

    <!-- Members Table -->
    <div class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-sm">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 dark:border-slate-800">
            <th class="px-8 py-5">用户信息</th>
            <th class="px-8 py-5">企业角色</th>
            <th class="px-8 py-5">组织机构</th>
            <th class="px-8 py-5">状态</th>
            <th class="px-8 py-5 text-right">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
          <tr v-for="member in members" :key="member.email" class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
            <td class="px-8 py-6">
              <div class="flex items-center gap-4">
                <div :class="['w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white font-black shadow-lg', member.avatarBg]">
                   {{ member.initials }}
                </div>
                <div class="flex flex-col">
                  <span class="text-sm font-black text-slate-900 dark:text-white tracking-tight">{{ member.name }}</span>
                  <span class="text-[10px] text-slate-400 font-bold font-mono">{{ member.email }}</span>
                </div>
              </div>
            </td>
            <td class="px-8 py-6">
               <span class="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-black rounded-lg uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                 {{ member.role }}
               </span>
            </td>
            <td class="px-8 py-6 text-sm font-bold text-slate-500 dark:text-slate-400">
               {{ member.org }}
            </td>
            <td class="px-8 py-6">
               <div class="flex items-center gap-2">
                 <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
                 <span class="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active</span>
               </div>
            </td>
            <td class="px-8 py-6 text-right">
               <button class="w-10 h-10 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-slate-400">
                  <span class="material-icons-round">more_horiz</span>
               </button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- Table Footer -->
      <div class="px-8 py-6 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
         <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
           Showing <span class="text-slate-900 dark:text-white">5</span> of 121 Members
         </p>
         <div class="flex gap-2">
           <button class="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 disabled:opacity-30" disabled>
             <span class="material-icons-round">chevron_left</span>
           </button>
           <button class="w-10 h-10 rounded-xl bg-primary text-white text-xs font-black shadow-lg shadow-primary/20">1</button>
           <button class="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400">
             <span class="material-icons-round">chevron_right</span>
           </button>
         </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MemberManagement',
  data() {
    return {
      members: [
        { name: 'Li Zhang', email: 'lizhang@atomgit.com', initials: 'LZ', role: '企业管理员', org: 'Root', avatarBg: 'from-blue-500 to-indigo-600' },
        { name: 'Wang Wei', email: 'wangwei@atomgit.com', initials: 'WW', role: '架构师', org: 'DevOps Team', avatarBg: 'from-emerald-500 to-teal-600' },
        { name: 'Chen Jie', email: 'chenjie@atomgit.com', initials: 'CJ', role: '研发工程师', org: 'Frontend Group', avatarBg: 'from-amber-500 to-orange-600' },
        { name: 'Liu Yang', email: 'liuyang@atomgit.com', initials: 'LY', role: '测试工程师', org: 'QA Team', avatarBg: 'from-rose-500 to-pink-600' },
        { name: 'Sun Bo', email: 'sunbo@atomgit.com', initials: 'SB', role: '运维人员', org: 'Cloud Infrastructure', avatarBg: 'from-violet-500 to-purple-600' }
      ]
    }
  }
}
</script>
