<template>
  <div class="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
    <!-- Page Header & Actions -->
    <div class="flex flex-col gap-6">
      <div class="flex items-center gap-2 text-sm text-slate-400 font-bold uppercase tracking-widest">
        <button @click="$emit('back')" class="hover:text-primary transition-colors flex items-center gap-1 relative z-10">
          <span class="material-icons-round text-base">arrow_back</span>
          返回贡献与生态
        </button>
        <span class="text-slate-300">/</span>
        <span class="text-slate-900 dark:text-white">全部核心贡献者列表</span>
      </div>
      
      <div class="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
      <div class="space-y-2">
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">全部核心贡献者列表</h1>
        <p class="text-slate-500 dark:text-slate-400 max-w-2xl">
          查看社区贡献者的详细排名与各项指标数据，基于代码提交、Issue 处理及代码评审的综合评估。
        </p>
      </div>
      <!-- Toolbar -->
      <div class="flex flex-wrap items-center gap-3">
        <!-- Search -->
        <div class="relative group">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors material-icons-round text-lg">search</span>
          <input class="h-10 pl-10 pr-4 w-64 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 dark:text-white placeholder:text-slate-400" placeholder="搜索开发者姓名或 ID" type="text" v-model="searchQuery" />
        </div>
        <!-- Date Picker -->
        <div class="relative">
          <button class="h-10 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-primary/50 transition-colors">
            <span class="material-icons-round text-lg text-slate-500">calendar_today</span>
            <span>近30天</span>
            <span class="material-icons-round text-lg text-slate-400">arrow_drop_down</span>
          </button>
        </div>
        <!-- Export Button -->
        <button class="h-10 px-5 bg-primary hover:bg-red-700 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-sm shadow-red-500/20">
          <span class="material-icons-round text-lg">download</span>
          导出榜单
        </button>
      </div>
    </div>
    </div>
    
    <!-- Data Table Card -->
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 dark:bg-slate-700/30 border-b border-slate-200 dark:border-slate-700">
              <th class="py-4 pl-6 pr-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-20 text-center">排名</th>
              <th class="py-4 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 min-w-[240px]">开发者</th>
              <th class="py-4 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 min-w-[200px]">代码贡献量</th>
              <th class="py-4 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">PR 提交/合入</th>
              <th class="py-4 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Issue 处理</th>
              <th class="py-4 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">代码评审量</th>
              <th class="py-4 pr-6 pl-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">综合贡献分</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
            <tr v-for="(contributor, index) in contributors" :key="contributor.id" class="hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors group cursor-pointer" @click="$emit('select-contributor', contributor.id)">
              <!-- Rank -->
              <td class="py-4 pl-6 pr-4 text-center">
                <div v-if="index < 3" class="size-8 mx-auto flex items-center justify-center rounded-full" 
                  :class="[
                    index === 0 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' : 
                    (index === 1 ? 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300' : 
                    'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400')
                  ]">
                  <span class="material-icons-round text-sm" v-if="index === 0">emoji_events</span>
                  <span class="material-icons-round text-sm" v-else>workspace_premium</span>
                </div>
                <span v-else class="text-sm font-semibold text-slate-500 dark:text-slate-400">{{ index + 1 }}</span>
              </td>
              <!-- Developer -->
              <td class="py-4 px-4">
                <div class="flex items-center gap-3">
                  <div class="size-10 rounded-full bg-cover bg-center border border-slate-100 dark:border-slate-600" :style="{ backgroundImage: `url(${contributor.avatar})` }">
                     <div v-if="!contributor.avatar" class="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-700 text-slate-500 font-bold">{{ contributor.initials }}</div>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{{ contributor.name }}</span>
                    <span class="text-xs text-slate-500 dark:text-slate-400">{{ contributor.role }} • {{ contributor.company }}</span>
                  </div>
                </div>
              </td>
              <!-- Code Volume -->
              <td class="py-4 px-4">
                <div class="flex flex-col gap-1.5 w-full max-w-[160px]">
                  <span class="text-sm font-medium text-slate-900 dark:text-white">{{ contributor.lines }} lines</span>
                  <div class="h-1.5 w-full bg-slate-100 dark:bg-slate-600 rounded-full overflow-hidden">
                    <div class="h-full bg-primary rounded-full" :style="{ width: contributor.linesPercent + '%' }"></div>
                  </div>
                </div>
              </td>
              <!-- PR Stats -->
              <td class="py-4 px-4 text-sm text-slate-700 dark:text-slate-300 font-medium">{{ contributor.prSubmitted }} <span class="text-slate-400 mx-1">/</span> {{ contributor.prMerged }}</td>
              <!-- Issues -->
              <td class="py-4 px-4 text-sm text-slate-700 dark:text-slate-300 font-medium">{{ contributor.issues }}</td>
              <!-- Reviews -->
              <td class="py-4 px-4 text-sm text-slate-700 dark:text-slate-300 font-medium">{{ contributor.reviews }}</td>
              <!-- Score -->
              <td class="py-4 pr-6 pl-4 text-right">
                <span class="text-base font-bold" :class="index < 3 ? 'text-primary' : 'text-slate-900 dark:text-white'">{{ contributor.score }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="border-t border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
        <span class="text-sm text-slate-500 dark:text-slate-400">
          显示第 <span class="font-medium text-slate-900 dark:text-white">1</span> 到 <span class="font-medium text-slate-900 dark:text-white">10</span> 条，共 <span class="font-medium text-slate-900 dark:text-white">498</span> 条结果
        </span>
        <div class="flex items-center gap-1">
          <button class="size-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors" disabled>
            <span class="material-icons-round text-lg">chevron_left</span>
          </button>
          <button class="size-8 flex items-center justify-center rounded-lg bg-primary text-white font-medium shadow-sm shadow-red-500/30 transition-colors">1</button>
          <button class="size-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">2</button>
          <button class="size-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">3</button>
          <span class="px-2 text-slate-400">...</span>
          <button class="size-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <span class="material-icons-round text-lg">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContributorList',
  emits: ['back', 'select-contributor'],
  data() {
    return {
      searchQuery: '',
      contributors: [
        {
          id: '1',
          name: 'Sarah Chen',
          role: 'Platform Engineering',
          company: 'Alibaba',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXhyZKBAfRHylBx1WiEnAmhP8zhxlUZqpuJ0nYru3Titvz6IQUOUluTrZp536t86Y3axYRN70AwczUIxm4aUC7QBPJB8FK2IkiUCBXGvR1wdFyxfaKDmN2cAD-6vd0_fMWiZntu2LfMQb8TSRc-CXkn7yfj9lxRVwj5vkK_G0bGPaFG4D1Zm7Q6ueu327MwI5brCoBB5muiEv9sra3pw4AZlclLHvAFcmfrtxj6DIJ-sRKuZOe-LP2smZjS44Ly-L4DQDkkhdoAgHx',
          lines: '12,450',
          linesPercent: 95,
          prSubmitted: 142,
          prMerged: 138,
          issues: 89,
          reviews: 324,
          score: 98.5
        },
        {
          id: '2',
          name: 'Mike Ross',
          role: 'Core Infra',
          company: 'Tencent',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAn5ywixAJUCo2AaNznEv9dfNXAr3aabmdWOF6kBxzcCzmLMKOtKCWrkfY5bFlVg9BdMbpTYEKWt92G8tNpl62J84T0cCAzYTGXgnwwajhD5CU6NVs9tRmrU1pSHFeBTBkqDfrpvgkaQq94QwDvnVxaGTz2ZSpS2bpul41rSyj0EhDbxEMaCpWdwtSOPXnvMkmz-0L4ffQvuew6RO4RHvizDvm0P2LjLo69ZTzBpZiU-dIO2JvKivMzciO4secT1wr4_5zsZHtVDtHT',
          lines: '9,820',
          linesPercent: 82,
          prSubmitted: 115,
          prMerged: 110,
          issues: 67,
          reviews: 210,
          score: 94.2
        },
        {
          id: '3',
          name: 'David Kim',
          role: 'Open Source',
          company: 'ByteDance',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCuIc1i3RpGUjAeTgCE9v896cAZoxYG1dBmUH_rwae4qOjsnVuRwOjjULA1QikW-ARR7yImQ3AnNTFp7_d38v8E6ov6Bdyy_He5WBXVDtEZf9khjJgUoO8GULqwP4C9g7FcxnfglsQm22S_2_g5j2bnxWAR_gtHs89AlYl-axf7__-GL531qXUAb9TN-MWAVK-lc-8Cno-XzhovMzx_e2iIhKZtRiZm5tcXbHZh7v0YngpE6MC3dWOtg2XBcT-hFAYq4bJ0fSfQ5zzT',
          lines: '8,150',
          linesPercent: 70,
          prSubmitted: 98,
          prMerged: 92,
          issues: 124,
          reviews: 185,
          score: 91.8
        },
        {
          id: '4',
          name: 'Emily Wang',
          role: 'Frontend',
          company: 'Meituan',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrbns3bkg-cwu6Or7I6m_PWJjK6XmGWTVq0F9RBF1DuBdGz7MCme6PC4runl-L4_Is8LtMg-jRwTl5Nd-4n5vpU6lKpKkg7RdXXKiLc1jEyksuKgadprMsPeA4WfDBpMps-H_cgA7KwDeB__fFaEIz_F7YP1KkBN60EhBrGk3FoQi156s6AQzVe2ekJwwSkKa2emSLsDFkcBaIGQpxAuSYc335-Prn2Iu27Lujb13Rwz--3wSn0gvu6uYx1AiVnhl9Py_1BOGZmKNr',
          lines: '6,240',
          linesPercent: 55,
          prSubmitted: 76,
          prMerged: 75,
          issues: 45,
          reviews: 160,
          score: 88.4
        },
        {
          id: '5',
          name: 'James Lee',
          role: 'Backend',
          company: 'Huawei',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCStBy-jwGZPYYnpkChhr7D7DlxcT1Z5JmUGZHWpNnthxSPvs_GcqMGVtYdgMf7Fi8MkDmAUO8WekD6fGlrFsniiroBuOh8gSnsbmEh3LR2_5EbXcnJujdtVq6vSqhOifc739q0AS4rW7nfW_uZgIgraJypaiCuwl0y0LPvPTJE_ThDkEq7fAkBx0FQftKiwqrY3Jg_yM5ldWiXeQPDEdvOc9SEDWaT1S8qFWCBbGpB5eaANbCX9zJDUNG3jEX67u_n351fMpCYjXji',
          lines: '5,900',
          linesPercent: 50,
          prSubmitted: 62,
          prMerged: 60,
          issues: 92,
          reviews: 130,
          score: 85.1
        },
        {
          id: '6',
          name: 'Alex Liu',
          role: 'Independent Contributor',
          company: '',
          avatar: '',
          initials: 'AL',
          lines: '4,120',
          linesPercent: 35,
          prSubmitted: 40,
          prMerged: 38,
          issues: 23,
          reviews: 95,
          score: 80.5
        }
      ]
    }
  }
}
</script>
