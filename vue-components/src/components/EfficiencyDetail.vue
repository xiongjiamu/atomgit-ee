<template>
  <div class="h-full flex flex-col">
    <!-- Header Section -->
    <div class="flex items-center gap-2 text-sm text-slate-400 font-bold uppercase tracking-widest mb-6" v-if="!showBackButton">
       <!-- Breadcrumb placeholder if needed, or just strict title -->
    </div>
    <div class="flex items-center gap-2 text-sm text-slate-400 font-bold uppercase tracking-widest mb-6" v-else>
      <button @click="$emit('back')" class="hover:text-primary transition-colors flex items-center gap-1 relative z-10">
        <span class="material-icons-round text-base">arrow_back</span>
        返回生产与效能
      </button>
      <span class="text-slate-300">/</span>
      <span class="text-slate-900 dark:text-white">效能指标下钻</span>
    </div>

    <div class="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-8">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">生产与效能指标下钻分析</h1>
        <p class="mt-2 text-slate-500 dark:text-slate-400 max-w-2xl">
          深入分析代码提交趋势、Issue 处理效率及 PR 合并情况。数据每日更新。
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <!-- Project Filter -->
        <div class="relative group">
          <div class="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 cursor-pointer shadow-sm hover:border-primary/50 transition-colors min-w-[200px]">
            <span class="material-icons-round text-slate-400 text-lg">layers</span>
            <span class="text-sm font-medium text-slate-700 dark:text-slate-200 flex-1">项目: AtomGit-Core</span>
            <span class="material-icons-round text-slate-400 text-lg">arrow_drop_down</span>
          </div>
        </div>
        <!-- Date Range Picker -->
        <div class="relative group">
          <div class="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 cursor-pointer shadow-sm hover:border-primary/50 transition-colors">
            <span class="material-icons-round text-slate-400 text-lg">calendar_today</span>
            <span class="text-sm font-medium text-slate-700 dark:text-slate-200">最近 30 天</span>
            <span class="text-xs text-slate-400 border-l border-slate-200 dark:border-slate-600 pl-2 ml-2">10月01日 - 10月31日</span>
          </div>
        </div>
        <!-- Export Button -->
        <button class="flex items-center gap-2 bg-primary hover:bg-red-700 text-white px-4 py-2.5 rounded-lg shadow-sm transition-colors font-medium text-sm">
          <span class="material-icons-round text-lg">download</span>
          导出报表
        </button>
      </div>
    </div>

    <!-- Main Chart Section -->
    <section class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 class="text-lg font-semibold text-slate-900 dark:text-white">趋势概览</h2>
        <!-- Chart Legend / Toggles -->
        <div class="flex flex-wrap gap-4">
          <button class="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:opacity-80 transition-opacity">
            <span class="w-3 h-3 rounded-full bg-primary"></span>
            代码行数
          </button>
          <button class="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:opacity-80 transition-opacity">
            <span class="w-3 h-3 rounded-full bg-purple-500"></span>
            提交次数
          </button>
          <button class="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:opacity-80 transition-opacity">
            <span class="w-3 h-3 rounded-full bg-orange-500"></span>
            新增 Issue
          </button>
          <button class="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:opacity-80 transition-opacity">
            <span class="w-3 h-3 rounded-full bg-teal-500"></span>
            合并 PR
          </button>
        </div>
      </div>
      <!-- Chart Visual (SVG Representation) -->
      <div class="w-full h-[320px] relative">
        <!-- Y-Axis Lines -->
        <div class="absolute inset-0 flex flex-col justify-between text-xs text-slate-400 pointer-events-none">
          <div class="border-b border-slate-100 dark:border-slate-700 w-full h-0 relative"><span class="absolute -top-3 left-0">1200</span></div>
          <div class="border-b border-slate-100 dark:border-slate-700 w-full h-0 relative"><span class="absolute -top-3 left-0">900</span></div>
          <div class="border-b border-slate-100 dark:border-slate-700 w-full h-0 relative"><span class="absolute -top-3 left-0">600</span></div>
          <div class="border-b border-slate-100 dark:border-slate-700 w-full h-0 relative"><span class="absolute -top-3 left-0">300</span></div>
          <div class="border-b border-slate-100 dark:border-slate-700 w-full h-0 relative"><span class="absolute -top-3 left-0">0</span></div>
        </div>
        <!-- Chart Lines Container -->
        <svg class="absolute inset-0 w-full h-full pl-8" preserveAspectRatio="none" viewBox="0 0 1000 100">
          <!-- Line 1: Code Lines (Primary Blue) -->
          <path d="M0,80 C100,75 200,60 300,40 C400,20 500,50 600,30 C700,10 800,25 900,15 L1000,10" fill="none" class="stroke-primary" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"></path>
          <!-- Line 2: Commits (Purple) -->
          <path d="M0,90 C100,85 200,80 300,75 C400,70 500,65 600,70 C700,75 800,60 900,55 L1000,60" fill="none" opacity="0.8" class="stroke-purple-500" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"></path>
          <!-- Line 3: Issues (Orange) -->
          <path d="M0,95 C150,95 300,90 450,85 C600,80 750,90 900,85 L1000,88" fill="none" opacity="0.8" class="stroke-orange-500" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"></path>
          <!-- Line 4: PRs (Teal) -->
          <path d="M0,98 C120,95 240,92 360,88 C480,85 600,80 720,75 C840,70 960,65 L1000,60" fill="none" opacity="0.8" class="stroke-teal-500" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"></path>
        </svg>
        <!-- Tooltip Example (Floating) -->
        <div class="absolute left-[60%] top-[30%] bg-slate-900 text-white text-xs rounded-lg p-3 shadow-xl z-10 pointer-events-none transform -translate-x-1/2">
          <div class="font-semibold mb-2 text-slate-300">2023-10-18</div>
          <div class="flex items-center justify-between gap-4 mb-1">
            <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-primary"></span>代码行数</span>
            <span class="font-bold">842</span>
          </div>
          <div class="flex items-center justify-between gap-4 mb-1">
            <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-purple-500"></span>提交次数</span>
            <span class="font-bold">45</span>
          </div>
          <div class="flex items-center justify-between gap-4">
            <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-teal-500"></span>合并 PR</span>
            <span class="font-bold">12</span>
          </div>
        </div>
      </div>
      <!-- X-Axis Labels -->
      <div class="flex justify-between pl-8 pt-4 text-xs text-slate-400 font-medium">
        <span>10-01</span>
        <span>10-06</span>
        <span>10-11</span>
        <span>10-16</span>
        <span>10-21</span>
        <span>10-26</span>
        <span>10-31</span>
      </div>
    </section>

    <!-- Data Table Section -->
    <section class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col flex-1">
      <div class="p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
        <h2 class="text-lg font-semibold text-slate-900 dark:text-white">详细数据</h2>
        <div class="flex items-center gap-2">
          <div class="relative group">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 material-icons-round text-lg group-focus-within:text-primary transition-colors">search</span>
            <input class="pl-9 pr-4 py-1.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-48 text-slate-900 dark:text-white transition-all" placeholder="搜索日期..." type="text"/>
          </div>
        </div>
      </div>
      <div class="overflow-x-auto flex-1">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wide">
              <th class="px-6 py-4 border-b border-slate-200 dark:border-slate-700 min-w-[120px]">日期</th>
              <th class="px-6 py-4 border-b border-slate-200 dark:border-slate-700 text-right">总代码行数</th>
              <th class="px-6 py-4 border-b border-slate-200 dark:border-slate-700 text-right">日提交数</th>
              <th class="px-6 py-4 border-b border-slate-200 dark:border-slate-700 text-right">新增 Issue</th>
              <th class="px-6 py-4 border-b border-slate-200 dark:border-slate-700 text-right">已合并 PR</th>
              <th class="px-6 py-4 border-b border-slate-200 dark:border-slate-700 text-right">效能环比</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
            <tr v-for="(row, index) in tableData" :key="index" class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
              <td class="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{{ row.date }}</td>
              <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 text-right font-mono">{{ row.codeLines }}</td>
              <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 text-right font-mono">{{ row.commits }}</td>
              <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 text-right font-mono">{{ row.issues }}</td>
              <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 text-right font-mono">{{ row.prs }}</td>
              <td class="px-6 py-4 text-sm text-right">
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" :class="row.growthClass">
                  {{ row.growth }}
                  <span class="material-icons-round ml-0.5 text-[14px]">{{ row.growthIcon }}</span>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <p class="text-sm text-slate-500 dark:text-slate-400">
          显示第 <span class="font-medium text-slate-900 dark:text-white">1</span> 到 <span class="font-medium text-slate-900 dark:text-white">5</span> 条，共 <span class="font-medium text-slate-900 dark:text-white">31</span> 条
        </p>
        <div class="flex gap-2">
          <button class="px-3 py-1 text-sm border border-slate-200 dark:border-slate-700 rounded-md text-slate-500 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors" disabled="">上一页</button>
          <button class="px-3 py-1 text-sm border border-slate-200 dark:border-slate-700 rounded-md bg-primary text-white border-primary transition-colors">1</button>
          <button class="px-3 py-1 text-sm border border-slate-200 dark:border-slate-700 rounded-md text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">2</button>
          <button class="px-3 py-1 text-sm border border-slate-200 dark:border-slate-700 rounded-md text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">3</button>
          <span class="px-2 text-slate-400 flex items-center">...</span>
          <button class="px-3 py-1 text-sm border border-slate-200 dark:border-slate-700 rounded-md text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">7</button>
          <button class="px-3 py-1 text-sm border border-slate-200 dark:border-slate-700 rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">下一页</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'EfficiencyDetail',
  props: {
    showBackButton: {
      type: Boolean,
      default: false
    }
  },
  emits: ['back'],
  data() {
    return {
      tableData: [
        {
          date: '2023-10-31',
          codeLines: '12,450',
          commits: 42,
          issues: 8,
          prs: 12,
          growth: '+5.2%',
          growthIcon: 'trending_up',
          growthClass: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        },
        {
          date: '2023-10-30',
          codeLines: '11,203',
          commits: 38,
          issues: 5,
          prs: 9,
          growth: '+2.1%',
          growthIcon: 'trending_up',
          growthClass: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        },
        {
          date: '2023-10-29',
          codeLines: '8,930',
          commits: 12,
          issues: 2,
          prs: 3,
          growth: '-12.5%',
          growthIcon: 'trending_down',
          growthClass: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        },
        {
          date: '2023-10-28',
          codeLines: '9,540',
          commits: 15,
          issues: 4,
          prs: 5,
          growth: '0.0%',
          growthIcon: 'remove',
          growthClass: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
        },
        {
          date: '2023-10-27',
          codeLines: '10,890',
          commits: 55,
          issues: 12,
          prs: 18,
          growth: '+8.4%',
          growthIcon: 'trending_up',
          growthClass: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        }
      ]
    }
  }
}
</script>
