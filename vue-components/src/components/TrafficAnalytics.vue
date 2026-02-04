<template>
  <div class="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <!-- Navigation Header -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
      <div class="space-y-4">
        <div class="flex items-center gap-2 text-sm text-slate-400 font-bold uppercase tracking-widest" v-if="viewMode === 'detail'">
          <button @click="viewMode = 'overview'" class="hover:text-primary transition-colors flex items-center gap-1">
            <span class="material-icons-round text-base">arrow_back</span>
            返回概览
          </button>
          <span class="text-slate-300">/</span>
          <span class="text-slate-900 dark:text-white">
            {{ activeDetailType === 'geo' ? '用户地域分布' : (activeDetailType === 'stack' ? '技术栈分布' : '流量趋势下钻') }}
          </span>
        </div>
        <div class="flex items-center gap-4">
          <ViewSelector :selected-view="internalSelectedView" @change="handleViewChange" />
          <div class="w-px h-8 bg-slate-200 dark:bg-slate-800"></div>
          <div>
            <h1 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight" style="margin-bottom: 0px;">
              {{ viewMode === 'overview' ? '流量与用户数据' : (activeDetailType === 'geo' ? '用户地域分布' : (activeDetailType === 'stack' ? '技术栈分布' : '流量趋势分析')) }}
            </h1>
          </div>
        </div>
        <p class="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
          <span v-if="viewMode === 'overview'">监控企业社区访问趋势、用户活跃度及画像分布。</span>
          <span v-else-if="activeDetailType === 'trend'">查看详细的 PV、UV 及 DAU 变化趋势与每日明细数据。</span>
          <span v-else-if="activeDetailType === 'geo'">分析全球用户来源地域分布与访问延迟数据。</span>
          <span v-else-if="activeDetailType === 'stack'">洞察项目技术栈构成与语言趋势变化。</span>
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <!-- Date Range Filter -->
        <div class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 p-1 rounded-xl shadow-sm flex">
          <button class="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white text-xs font-black rounded-lg transition-all">最近 30 天</button>
          <button class="px-4 py-2 text-slate-500 text-xs font-black rounded-lg hover:text-slate-900 dark:hover:text-white transition-all">本季度</button>
          <button class="px-4 py-2 text-slate-500 text-xs font-black rounded-lg hover:text-slate-900 dark:hover:text-white transition-all max-sm:hidden">自定义</button>
        </div>
        <!-- Export Button (Only in Detail) -->
        <button 
          v-if="viewMode === 'detail'"
          class="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-slate-700 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:shadow-lg transition-all active:scale-95"
        >
          <span class="material-icons-round text-sm">download</span>
          导出数据
        </button>
        <button class="p-2.5 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-primary rounded-xl transition-all shadow-sm">
          <span class="material-icons-round">refresh</span>
        </button>
      </div>
    </div>

    <!-- Overview Content -->
    <div v-if="viewMode === 'overview'" class="space-y-8 animate-in fade-in duration-500">
      <!-- Stats Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="stat in mainStats" :key="stat.label" class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 group cursor-pointer" @click="openDetail('trend')">
          <div class="flex items-center justify-between mb-6">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{{ stat.label }}</span>
            <span :class="['material-icons-round text-slate-300 group-hover:scale-110 transition-transform', stat.iconColor]">{{ stat.icon }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">{{ stat.value }}</span>
            <div class="flex items-center gap-2 mt-2">
              <div :class="['flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-black', stat.trendClass]">
                <span class="material-icons-round text-xs">{{ stat.trendIcon }}</span>
                {{ stat.trend }}
              </div>
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vs Last Month</span>
            </div>
          </div>
          
          <!-- Sparkline -->
          <div class="mt-8 h-12 w-full relative overflow-hidden rounded-xl bg-slate-50/50 dark:bg-slate-900/30">
             <svg class="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 24">
               <path 
                 :d="stat.sparkline" 
                 fill="none" 
                 :class="['stroke-[2.5] transition-all duration-1000', stat.strokeColor]" 
                 stroke-linecap="round" 
                 stroke-linejoin="round"
               />
               <path 
                 :d="stat.sparkline + ' V 24 H 0 Z'" 
                 :class="['opacity-5 transition-all duration-1000 font-black', stat.fillColor]"
               />
             </svg>
             <div class="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white dark:from-surface-dark to-transparent"></div>
          </div>
          <div class="mt-4 flex items-center justify-end text-[10px] font-black text-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
            查看趋势下钻 <span class="material-icons-round text-xs ml-1">arrow_forward</span>
          </div>
        </div>
      </div>

      <!-- Secondary Metrics Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Geographic Distribution -->
        <div class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-10 shadow-sm relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1" @click="openDetail('geo')">
          <div class="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full group-hover:bg-blue-500/10 transition-all"></div>
          <div class="flex items-center justify-between mb-10 relative z-10">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <span class="material-icons-round text-blue-500">public</span>
              </div>
              <h3 class="text-xl font-black text-slate-900 dark:text-white tracking-tight">用户地域分布</h3>
            </div>
            <button class="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Full Report</button>
          </div>
          
          <div class="space-y-8 relative z-10">
            <div v-for="city in regions" :key="city.name">
              <div class="flex justify-between items-center mb-3">
                <span class="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">{{ city.name }}</span>
                <span class="text-sm font-black text-slate-900 dark:text-white font-mono">{{ city.percent }}%</span>
              </div>
              <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div 
                  class="h-full bg-blue-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                  :style="{ width: city.percent + '%' }"
                ></div>
              </div>
            </div>
          </div>
          
          <div class="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
             <p class="text-[10px] font-bold text-slate-400 text-center uppercase tracking-[0.2em] leading-relaxed">
               Data based on <span class="text-slate-900 dark:text-white">56,820</span> global access events.
             </p>
          </div>
        </div>

        <!-- Tech Stack Distribution -->
        <div class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-10 shadow-sm relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1" @click="openDetail('stack')">
          <div class="absolute -left-20 -bottom-20 w-64 h-64 bg-amber-500/5 blur-[100px] rounded-full group-hover:bg-amber-500/10 transition-all"></div>
          <div class="flex items-center gap-3 mb-10 relative z-10">
            <div class="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <span class="material-icons-round text-amber-500">code</span>
            </div>
            <h3 class="text-xl font-black text-slate-900 dark:text-white tracking-tight">用户技术栈分布</h3>
          </div>

          <div class="flex flex-col md:flex-row items-center justify-center gap-12 relative z-10">
            <!-- Donut Chart -->
            <div class="relative w-48 h-48">
              <svg class="w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="75" class="text-slate-100 dark:text-slate-800 stroke-current" stroke-width="22" fill="transparent" />
                <circle 
                  cx="96" cy="96" r="75" 
                  class="text-blue-500 stroke-current transition-all duration-1000 drop-shadow-md" 
                  stroke-width="22" 
                  stroke-dasharray="471.2" 
                  stroke-dashoffset="259.1"
                  fill="transparent" 
                  stroke-linecap="round"
                />
                <circle 
                  cx="96" cy="96" r="75" 
                  class="text-amber-500 stroke-current transition-all duration-1000 drop-shadow-md" 
                  stroke-width="22" 
                  stroke-dasharray="471.2" 
                  stroke-dashoffset="376.9"
                  fill="transparent" 
                  stroke-linecap="round"
                  transform="rotate(162, 96, 96)"
                />
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center transform group-hover:scale-110 transition-transform">
                 <span class="text-3xl font-black text-slate-900 dark:text-white">Java</span>
                 <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Leading</span>
              </div>
            </div>
            
            <div class="space-y-6">
              <div v-for="lang in techStack" :key="lang.name" class="flex items-center gap-4 group/lang cursor-pointer translate-x-0 hover:translate-x-2 transition-transform">
                <div :class="['w-5 h-5 rounded-lg shadow-sm', lang.color]"></div>
                <div class="flex flex-col">
                  <span class="text-xs font-black text-slate-900 dark:text-white group-hover/lang:text-primary transition-colors tracking-tight">{{ lang.name }}</span>
                  <div class="flex items-center gap-2 mt-0.5">
                    <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">{{ lang.value }}% 占比</span>
                    <span v-if="lang.growth" class="text-[8px] font-black text-emerald-500 bg-emerald-500/10 px-1 rounded flex items-center tracking-tighter">
                      <span class="material-icons-round text-[10px]">arrow_upward</span>
                      {{ lang.growth }}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
             <div class="flex items-center justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest">
               <span>TOP PERFORMANCE STACK</span>
               <span class="text-blue-500">AI RECOMMENDED</span>
             </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detail Content -->
    <div v-else class="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      
      <!-- Trend Detail (Existing) -->
      <template v-if="activeDetailType === 'trend'">
        <!-- Main Trend Chart -->
        <div class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
            <h3 class="text-lg font-black text-slate-900 dark:text-white flex items-center gap-3">
              <span class="w-1.5 h-6 bg-primary rounded-full"></span>
              流量走势深度分析
              <span class="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-500 tracking-widest">2023-10-01 ~ 10-30</span>
            </h3>
            <div class="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/50 p-1 rounded-xl border border-slate-100 dark:border-slate-800">
              <button v-for="metric in metrics" :key="metric.id" @click="activeMetric = metric.id" :class="['px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-2', activeMetric === metric.id ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600']">
                <span class="w-2.5 h-2.5 rounded-full" :class="metric.color"></span>
                {{ metric.name }}
              </button>
            </div>
          </div>

          <div class="relative h-[420px] w-full select-none mt-10" id="chart-detail-container">
            <!-- Floating Tooltip Simulation -->
            <div class="absolute left-[65%] top-12 z-20 group">
              <div class="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl shadow-2xl rounded-xl border border-slate-200 dark:border-slate-700 p-5 text-xs w-64 ring-4 ring-primary/5 animate-in zoom-in-95 duration-200">
                <div class="text-slate-400 mb-4 font-black border-b border-slate-100 dark:border-slate-700 pb-3 flex justify-between items-center uppercase tracking-widest">
                  <span>2023-10-24 (周二)</span>
                  <span class="text-[9px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded font-black tracking-tighter">PEAK DAY</span>
                </div>
                <div class="space-y-4">
                  <div v-for="m in metrics" :key="m.id" class="flex justify-between items-center group/tooltip">
                    <div class="flex items-center gap-3">
                      <span :class="['w-2.5 h-2.5 rounded-full shadow-sm', m.color]"></span>
                      <span class="text-slate-500 dark:text-slate-400 font-bold">{{ m.name }}</span>
                    </div>
                    <span class="font-black text-slate-900 dark:text-white text-sm tabular-nums transition-transform group-hover/tooltip:scale-110">{{ m.mockValue }}</span>
                  </div>
                </div>
              </div>
              <div class="absolute left-0 top-[160px] h-[200px] w-px bg-gradient-to-b from-primary/40 to-transparent mx-auto -ml-px"></div>
            </div>

            <svg class="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1200 400">
              <!-- Grid Lines -->
              <g class="stroke-slate-100 dark:stroke-slate-800/50" stroke-dasharray="6 4" stroke-width="1">
                <line v-for="i in 5" :key="i" x1="0" x2="1200" :y1="i * 80 - 40" :y2="i * 80 - 40" />
              </g>
              <!-- Labels -->
              <g class="text-[10px] fill-slate-400 font-black uppercase tracking-tighter select-none">
                <text v-for="(val, idx) in ['60K', '45K', '30K', '15K', '0']" :key="val" x="0" :y="idx * 80 + 45">{{ val }}</text>
              </g>
              <!-- Curves -->
              <defs>
                <linearGradient id="grad-primary-main" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" style="stop-color:#D92D20;stop-opacity:0.25" />
                  <stop offset="100%" style="stop-color:#D92D20;stop-opacity:0" />
                </linearGradient>
              </defs>
              <path d="M0 250 C150 220, 300 100, 450 120 C600 140, 750 80, 816 190 C900 240, 1050 100, 1200 80 V 400 H 0 Z" fill="url(#grad-primary-main)"></path>
              <path d="M0 250 C150 220, 300 100, 450 120 C600 140, 750 80, 816 190 C900 240, 1050 100, 1200 80" fill="none" class="stroke-primary" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"></path>
              <path d="M0 300 C150 290, 300 220, 450 240 C600 260, 750 220, 816 270 C900 300, 1050 200, 1200 180" fill="none" class="stroke-blue-400" stroke-dasharray="10 6" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"></path>
              <path d="M0 340 C150 335, 300 280, 450 300 C600 320, 750 290, 816 325 C900 340, 1050 280, 1200 260" fill="none" class="stroke-emerald-400" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"></path>
            </svg>
            
            <div class="flex justify-between mt-8 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 border-t border-slate-50 dark:border-slate-800 pt-4">
              <span v-for="d in ['10-01', '10-08', '10-15', '10-22', '10-24', '10-30']" :key="d" :class="d === '10-24' ? 'text-primary' : ''">{{ d }}</span>
            </div>
          </div>
        </div>

        <!-- Data Details Table -->
        <div class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden group">
          <div class="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
            <div class="flex items-center gap-3">
              <span class="material-icons-round text-slate-400">table_rows</span>
              <h3 class="font-black text-slate-900 dark:text-white tracking-tight">每日数据明细 · Time-Series Log</h3>
            </div>
            <div class="flex items-center gap-4">
              <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Live Sync Enabled
              </div>
              <button class="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                <span class="material-icons-round">filter_list</span>
              </button>
            </div>
          </div>
          <div class="overflow-x-auto custom-scrollbar">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 dark:border-slate-800">
                  <th class="px-8 py-5">日期 · Time</th>
                  <th class="px-8 py-5 text-right">浏览量 (PV)</th>
                  <th class="px-8 py-5 text-right">独立访客 (UV)</th>
                  <th class="px-8 py-5 text-right">日活 (DAU)</th>
                  <th class="px-8 py-5 text-right">周环比 (WoW)</th>
                  <th class="px-8 py-5 text-right">月同比 (MoM)</th>
                  <th class="px-8 py-5 text-center">状态</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50 dark:divide-slate-800">
                <tr v-for="day in dailyStats" :key="day.date" class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group/row cursor-default">
                  <td class="px-8 py-5">
                    <div class="flex items-center gap-3">
                      <span class="text-sm font-black text-slate-900 dark:text-white">{{ day.date }}</span>
                      <span :class="['text-[9px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded', day.isWeekend ? 'bg-slate-100 text-slate-400' : 'bg-primary/10 text-primary']">
                        {{ day.weekday }}
                      </span>
                    </div>
                  </td>
                  <td class="px-8 py-5 text-right font-black text-slate-700 dark:text-slate-300 font-mono text-sm tabular-nums">{{ day.pv }}</td>
                  <td class="px-8 py-5 text-right font-black text-slate-700 dark:text-slate-300 font-mono text-sm tabular-nums">{{ day.uv }}</td>
                  <td class="px-8 py-5 text-right font-black text-slate-700 dark:text-slate-300 font-mono text-sm tabular-nums">{{ day.dau }}</td>
                  <td class="px-8 py-5 text-right">
                    <div :class="['inline-flex items-center gap-1 px-3 py-1 rounded-lg text-[10px] font-black', day.wow > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500']">
                      <span class="material-icons-round text-xs">{{ day.wow > 0 ? 'trending_up' : 'trending_down' }}</span>
                      {{ Math.abs(day.wow) }}%
                    </div>
                  </td>
                  <td class="px-8 py-5 text-right">
                    <div :class="['inline-flex items-center gap-1 px-3 py-1 rounded-lg text-[10px] font-black', day.mom > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500']">
                      <span class="material-icons-round text-xs">{{ day.mom > 0 ? 'trending_up' : 'trending_down' }}</span>
                      {{ Math.abs(day.mom) }}%
                    </div>
                  </td>
                  <td class="px-8 py-5 text-center">
                    <span class="w-2 h-2 rounded-full bg-emerald-500 inline-block shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Pagination -->
          <div class="px-8 py-4 bg-slate-50/50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Rows per page: <span class="text-slate-900 dark:text-white">10</span>
            </p>
            <div class="flex gap-2">
              <button class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-white transition-all disabled:opacity-30" disabled>
                <span class="material-icons-round text-sm">chevron_left</span>
              </button>
              <button class="w-8 h-8 rounded-lg flex items-center justify-center text-white bg-slate-900 dark:bg-primary shadow-lg shadow-primary/20 text-xs font-black">1</button>
              <button class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-all text-xs font-black">2</button>
              <button class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-white transition-all">
                <span class="material-icons-round text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </template>

      <!-- Geo Detail -->
      <template v-else-if="activeDetailType === 'geo'">
        <div class="grid grid-cols-3 gap-6">
          <div class="col-span-2 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
             <span class="material-icons-round text-9xl text-slate-200 dark:text-slate-700 mb-4">public</span>
             <p class="text-slate-400 font-medium">Interactive World Map Visualization</p>
             <p class="text-xs text-slate-500 mt-2">Loading Map Data...</p>
          </div>
          <div class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm overflow-hidden">
             <h3 class="text-sm font-black text-slate-900 dark:text-white mb-6 uppercase tracking-widest">City Ranking</h3>
             <div class="space-y-4">
                <div v-for="(city, idx) in regions" :key="city.name" class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                   <div class="flex items-center gap-3">
                      <span class="text-xs font-black text-slate-300">#{{ idx + 1 }}</span>
                      <span class="text-sm font-bold text-slate-700 dark:text-slate-200">{{ city.name }}</span>
                   </div>
                   <span class="text-xs font-mono font-black text-primary">{{ city.percent }}%</span>
                </div>
             </div>
          </div>
        </div>
      </template>

      <!-- Stack Detail -->
      <template v-else-if="activeDetailType === 'stack'">
        <div class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm">
           <div class="flex items-center justify-between mb-8">
             <h3 class="text-lg font-black text-slate-900 dark:text-white">用户技术栈偏好详情</h3>
             <button class="text-primary text-xs font-black uppercase tracking-widest hover:underline">Scan User Profiles</button>
           </div>
           <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div v-for="lang in techStack" :key="lang.name" class="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800">
                 <div class="flex items-center gap-3 mb-4">
                    <div :class="['w-3 h-3 rounded-full', lang.color]"></div>
                    <span class="font-bold text-slate-700 dark:text-slate-200">{{ lang.name }}</span>
                 </div>
                 <div class="text-2xl font-black text-slate-900 dark:text-white mb-1">{{ lang.value }}%</div>
                 <div class="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                   <span class="material-icons-round text-xs">trending_up</span>
                   Growth {{ lang.growth }}%
                 </div>
              </div>
           </div>
        </div>
      </template>

    </div>
  </div>
</template>

<script>
import ViewSelector from './ViewSelector.vue'

export default {
  name: 'TrafficAnalytics',
  components: {
    ViewSelector
  },
  props: {
    selectedView: {
      type: Object,
      default: () => ({ id: 'enterprise', label: '全企业视图 (Enterprise)', orgId: 'enterprise' })
    }
  },
  data() {
    return {
      viewMode: 'overview', // 'overview' or 'detail'
      activeMetric: 'pv',
      activeDetailType: 'trend', // 'trend', 'geo', 'stack'
      internalSelectedView: this.selectedView || { id: 'enterprise', label: '全企业视图 (Enterprise)', orgId: 'enterprise' },
      mainStats: [
        { 
          label: '浏览量 (PV)', 
          value: '1.2M', 
          trend: '+12.5%', 
          trendIcon: 'north_east',
          trendClass: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
          icon: 'visibility',
          iconColor: 'group-hover:text-blue-500',
          sparkline: 'M0 12 Q 10 12, 20 18 T 40 8 T 60 14 T 80 10 T 100 12',
          strokeColor: 'stroke-blue-400',
          fillColor: 'fill-blue-400'
        },
        { 
          label: '独立访客 (UV)', 
          value: '85.4K', 
          trend: '+5.2%', 
          trendIcon: 'north_east',
          trendClass: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
          icon: 'person_outline',
          iconColor: 'group-hover:text-amber-500',
          sparkline: 'M0 18 Q 20 20, 40 10 T 70 14 T 100 10',
          strokeColor: 'stroke-amber-400',
          fillColor: 'fill-amber-400'
        },
        { 
          label: '活跃用户 (DAU)', 
          value: '12.8K', 
          trend: '-2.1%', 
          trendIcon: 'south_east',
          trendClass: 'bg-rose-100 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400',
          icon: 'groups',
          iconColor: 'group-hover:text-indigo-500',
          sparkline: 'M0 10 Q 25 24, 50 14 T 80 18 T 100 12',
          strokeColor: 'stroke-indigo-400',
          fillColor: 'fill-indigo-400'
        }
      ],
      regions: [
        { name: 'Beijing', percent: 32 },
        { name: 'Shenzhen', percent: 21 },
        { name: 'Shanghai', percent: 18 },
        { name: 'Hangzhou', percent: 14 }
      ],
      techStack: [
        { name: 'Vue.js Developers', value: 42, color: 'bg-emerald-500', growth: 15 },
        { name: 'React Developers', value: 35, color: 'bg-blue-500', growth: 8 },
        { name: 'Java/Spring', value: 12, color: 'bg-amber-500', growth: -2 },
        { name: 'Python/AI', value: 11, color: 'bg-purple-500', growth: 24 }
      ],
      metrics: [
        { id: 'pv', name: '浏览量 (PV)', color: 'bg-primary', mockValue: '42,538' },
        { id: 'uv', name: '独立访客 (UV)', color: 'bg-blue-400', mockValue: '5,102' },
        { id: 'dau', name: '日活 (DAU)', color: 'bg-emerald-400', mockValue: '1,890' }
      ],
      dailyStats: [
        { date: '2023-10-24', weekday: 'TUE', pv: '42,538', uv: '5,102', dau: '1,890', wow: 12.5, mom: 5.3, isWeekend: false },
        { date: '2023-10-23', weekday: 'MON', pv: '40,120', uv: '4,980', dau: '1,750', wow: 8.2, mom: -1.2, isWeekend: false },
        { date: '2023-10-22', weekday: 'SUN', pv: '28,500', uv: '3,200', dau: '1,100', wow: -5.5, mom: 2.1, isWeekend: true },
        { date: '2023-10-21', weekday: 'SAT', pv: '30,100', uv: '3,450', dau: '1,250', wow: 0.0, mom: 3.4, isWeekend: true },
        { date: '2023-10-20', weekday: 'FRI', pv: '45,600', uv: '5,800', dau: '2,100', wow: 15.2, mom: 8.9, isWeekend: false }
      ]
    }
  },
  methods: {
    handleViewChange(view) {
      this.internalSelectedView = view
      this.$emit('view-change', view)
    },
    openDetail(type) {
      this.activeDetailType = type
      this.viewMode = 'detail'
    }
  },
  watch: {
    selectedView: {
      handler(newVal) {
        if (newVal) this.internalSelectedView = newVal
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.15);
  border-radius: 0.75rem;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.3);
}
</style>
