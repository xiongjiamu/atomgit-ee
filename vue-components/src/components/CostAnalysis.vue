<template>
  <div class="h-full flex flex-col">
    <!-- Header Section -->
    <div class="flex justify-between items-start mb-6">
      <div class="space-y-4">
        <div class="flex items-center gap-4">
           <ViewSelector :selected-view="selectedView" @change="handleViewChange" />
           <div class="w-px h-8 bg-slate-200 dark:bg-slate-800"></div>
           <div>
             <h1 class="text-2xl font-bold text-slate-900 dark:text-white" style="margin-bottom: 0px;">资源与成本统计详情</h1>
           </div>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <div class="relative">
          <select class="appearance-none bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 py-2 pl-4 pr-10 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm">
            <option>最近 30 天</option>
            <option>最近 7 天</option>
            <option>最近 90 天</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
            <span class="material-icons-round text-[20px]">expand_more</span>
          </div>
        </div>
        <button class="p-2 border border-slate-300 dark:border-slate-600 rounded-md text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 dark:text-slate-400 bg-white dark:bg-slate-800 shadow-sm transition">
          <span class="material-icons-round text-[20px]">refresh</span>
        </button>
      </div>
    </div>

    <!-- Cards Row -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center gap-2 mb-2">
          <span class="material-icons-round text-slate-400 dark:text-slate-500">database</span>
          <span class="text-sm font-medium text-slate-500 dark:text-slate-400">Git 存储</span>
        </div>
        <div class="text-3xl font-bold text-slate-900 dark:text-white mb-1">1.2 TB</div>
        <div class="text-xs text-slate-400 dark:text-slate-500">带宽: 45MB/s</div>
      </div>
      <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center gap-2 mb-2">
          <span class="material-icons-round text-slate-400 dark:text-slate-500">inventory_2</span>
          <span class="text-sm font-medium text-slate-500 dark:text-slate-400">LFS 存储</span>
        </div>
        <div class="text-3xl font-bold text-slate-900 dark:text-white mb-1">485 GB</div>
        <div class="text-xs text-slate-400 dark:text-slate-500">带宽: 120MB/s</div>
      </div>
      <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center gap-2 mb-2">
          <span class="material-icons-round text-slate-400 dark:text-slate-500">api</span>
          <span class="text-sm font-medium text-slate-500 dark:text-slate-400">API 调用</span>
        </div>
        <div class="text-3xl font-bold text-slate-900 dark:text-white mb-1">8.5 M</div>
        <div class="text-xs text-slate-400 dark:text-slate-500">Error Rate: 0.02%</div>
      </div>
      <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center gap-2 mb-2">
          <span class="material-icons-round text-slate-400 dark:text-slate-500 text-[20px]">auto_awesome</span>
          <span class="text-sm font-medium text-slate-500 dark:text-slate-400">AI Token</span>
        </div>
        <div class="text-3xl font-bold text-primary dark:text-red-400 mb-1">14.2 M</div>
        <div class="text-xs text-slate-400 dark:text-slate-500">Top User: Dev_A</div>
      </div>
    </div>

    <!-- Chart Section -->
    <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 mb-8 shadow-sm">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-white">资源使用趋势 (Resource Usage Trends)</h3>
        <div class="flex items-center gap-4 text-xs">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-blue-500"></span>
            <span class="text-slate-600 dark:text-slate-400">Git 存储</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-green-500"></span>
            <span class="text-slate-600 dark:text-slate-400">LFS 存储</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-purple-500"></span>
            <span class="text-slate-600 dark:text-slate-400">API 调用</span>
          </div>
        </div>
      </div>
      <div class="w-full h-80 relative">
        <div class="absolute left-0 top-0 bottom-0 w-10 flex flex-col justify-between text-xs text-slate-400 text-right pr-2">
          <span>2.0T</span>
          <span>1.5T</span>
          <span>1.0T</span>
          <span>0.5T</span>
          <span>0</span>
        </div>
        <div class="absolute left-10 right-0 top-2 bottom-6 border-l border-b border-slate-200 dark:border-slate-700">
          <div class="w-full h-1/4 border-t border-dashed border-slate-100 dark:border-slate-700 absolute top-0"></div>
          <div class="w-full h-1/4 border-t border-dashed border-slate-100 dark:border-slate-700 absolute top-[25%]"></div>
          <div class="w-full h-1/4 border-t border-dashed border-slate-100 dark:border-slate-700 absolute top-[50%]"></div>
          <div class="w-full h-1/4 border-t border-dashed border-slate-100 dark:border-slate-700 absolute top-[75%]"></div>
          
          <svg class="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
            <path d="M0,80 Q50,75 100,70 T200,60 T300,55 T400,50 T500,45 T600,40 T700,35 T800,30 T900,25 T1000,20 L1200,10" fill="none" stroke="#3B82F6" stroke-width="3" vector-effect="non-scaling-stroke"></path>
            <path d="M0,80 Q50,75 100,70 T200,60 T300,55 T400,50 T500,45 T600,40 T700,35 T800,30 T900,25 T1000,20 L1200,10 L1200,300 L0,300 Z" fill="url(#blueGradient)" opacity="0.1"></path>
            <defs>
              <linearGradient id="blueGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stop-color="#3B82F6"></stop>
                <stop offset="100%" stop-color="#3B82F6" stop-opacity="0"></stop>
              </linearGradient>
            </defs>
          </svg>
          <svg class="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
            <path d="M0,200 Q150,190 300,180 T600,170 T900,165 T1200,160" fill="none" stroke="#10B981" stroke-dasharray="5,5" stroke-width="3" vector-effect="non-scaling-stroke"></path>
          </svg>
          <svg class="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
             <path d="M0,250 L100,240 L200,260 L300,220 L400,230 L500,210 L600,225 L700,200 L800,215 L900,190 L1000,205 L1100,180 L1200,195" fill="none" stroke="#A855F7" stroke-width="2" vector-effect="non-scaling-stroke"></path>
          </svg>

          <!-- Mock Tooltip -->
          <div class="absolute left-[60%] top-[30%] w-[1px] h-[70%] bg-slate-400 dark:bg-slate-500 border-l border-dashed border-slate-400">
            <div class="absolute -top-1 -left-[5px] w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white dark:border-slate-800 shadow"></div>
            <div class="absolute top-4 left-4 bg-white dark:bg-slate-700 shadow-lg rounded-lg p-3 text-xs border border-slate-200 dark:border-slate-600 min-w-[140px] z-10 pointer-events-none">
              <div class="font-bold mb-1 text-slate-900 dark:text-white">2023-10-15</div>
              <div class="flex justify-between py-0.5"><span class="text-blue-500">Git:</span> <span class="text-slate-700 dark:text-slate-300">1.12 TB</span></div>
              <div class="flex justify-between py-0.5"><span class="text-green-500">LFS:</span> <span class="text-slate-700 dark:text-slate-300">460 GB</span></div>
              <div class="flex justify-between py-0.5"><span class="text-purple-500">API:</span> <span class="text-slate-700 dark:text-slate-300">420k</span></div>
            </div>
          </div>
        </div>
        <div class="absolute left-10 right-0 bottom-0 flex justify-between text-xs text-slate-400 pt-2">
          <span>10-01</span>
          <span>10-05</span>
          <span>10-10</span>
          <span>10-15</span>
          <span>10-20</span>
          <span>10-25</span>
          <span>10-30</span>
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col flex-1">
      <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
        <h3 class="text-base font-semibold text-slate-900 dark:text-white">每日详情数据 (Daily Breakdown)</h3>
        <button class="text-sm text-primary hover:text-red-700 font-medium flex items-center gap-1">
          <span class="material-icons-round text-[16px]">download</span> 导出报表
        </button>
      </div>
      <div class="overflow-x-auto flex-1">
        <table class="w-full text-sm text-left">
          <thead class="bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-600">
            <tr>
              <th class="px-6 py-3 whitespace-nowrap">日期</th>
              <th class="px-6 py-3 whitespace-nowrap text-right">Git 存储 (TB)</th>
              <th class="px-6 py-3 whitespace-nowrap text-right">LFS 存储 (GB)</th>
              <th class="px-6 py-3 whitespace-nowrap text-right">API 调用量</th>
              <th class="px-6 py-3 whitespace-nowrap text-right">AI Token 消耗</th>
              <th class="px-6 py-3 whitespace-nowrap text-right">预计费用 (CNY)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 dark:divide-slate-700 text-slate-700 dark:text-slate-300">
            <tr v-for="(row, index) in tableData" :key="index" class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <td class="px-6 py-3 whitespace-nowrap font-medium text-slate-900 dark:text-white">{{ row.date }}</td>
              <td class="px-6 py-3 whitespace-nowrap text-right font-mono">{{ row.git }}</td>
              <td class="px-6 py-3 whitespace-nowrap text-right font-mono">{{ row.lfs }}</td>
              <td class="px-6 py-3 whitespace-nowrap text-right font-mono">{{ row.api }}</td>
              <td class="px-6 py-3 whitespace-nowrap text-right font-mono text-primary">{{ row.ai }}</td>
              <td class="px-6 py-3 whitespace-nowrap text-right font-mono">{{ row.cost }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="px-6 py-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
        <span class="text-sm text-slate-500 dark:text-slate-400">显示 1 至 6 共 30 条</span>
        <div class="flex gap-1">
          <button class="px-3 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-sm hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50">上一页</button>
          <button class="px-3 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-sm hover:bg-slate-50 dark:hover:bg-slate-600">下一页</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ViewSelector from './ViewSelector.vue'

export default {
  name: 'CostAnalysis',
  components: {
    ViewSelector
  },
  data() {
    return {
      selectedView: { id: 'enterprise', label: '全企业视图 (Enterprise)', orgId: 'enterprise' },
      tableData: [
        { date: '2023-10-24', git: '1.20', lfs: '485.2', api: '285,420', ai: '540,200', cost: '¥ 124.50' },
        { date: '2023-10-23', git: '1.19', lfs: '482.1', api: '271,110', ai: '512,800', cost: '¥ 119.20' },
        { date: '2023-10-22', git: '1.19', lfs: '480.5', api: '180,300', ai: '220,100', cost: '¥ 95.40' },
        { date: '2023-10-21', git: '1.18', lfs: '480.2', api: '155,200', ai: '180,400', cost: '¥ 88.60' },
        { date: '2023-10-20', git: '1.18', lfs: '478.9', api: '298,550', ai: '610,230', cost: '¥ 132.10' },
        { date: '2023-10-19', git: '1.17', lfs: '475.4', api: '310,200', ai: '590,400', cost: '¥ 129.80' }
      ]
    }
  },
  methods: {
    handleViewChange(view) {
      this.selectedView = view
    }
  }
}
</script>
