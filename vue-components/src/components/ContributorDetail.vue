<template>
  <div class="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
    <!-- Header Bar -->
    <div class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border rounded-xl border-slate-200 dark:border-slate-700 px-8 py-4 flex items-center justify-between">
      <!-- Breadcrumbs -->
      <nav class="flex items-center text-sm">
        <button class="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" @click="$emit('back')">贡献与生态</button>
        <span class="mx-2 text-slate-300 dark:text-slate-600">/</span>
        <button class="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" @click="$emit('to-list')">全部核心贡献者</button>
        <span class="mx-2 text-slate-300 dark:text-slate-600">/</span>
        <span class="font-medium text-slate-800 dark:text-white">开发者详情</span>
      </nav>
      <div class="flex items-center gap-4">
        <button class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
          <span class="material-icons-round text-lg">download</span>
          导出报告
        </button>
        <button class="flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition-colors">
          <span class="material-icons-round text-lg">notifications</span>
        </button>
      </div>
    </div>

    <!-- Profile & Stats Combined Section -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Profile Card -->
      <div class="lg:col-span-8 flex flex-col sm:flex-row gap-6 p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
        <div class="shrink-0">
          <div class="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-cover bg-center border-4 border-slate-50 dark:border-slate-700 shadow-inner" :style="{ backgroundImage: `url(${contributor.avatar})` }"></div>
        </div>
        <div class="flex flex-col justify-center flex-1">
          <div class="flex flex-wrap items-center gap-3 mb-1">
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">{{ contributor.name }}</h1>
            <span class="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-primary dark:text-blue-400 text-xs font-semibold border border-blue-100 dark:border-blue-800">{{ contributor.role }}</span>
            <span class="text-slate-400 text-sm">ID: {{ contributor.id }}</span>
          </div>
          <p class="text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-1.5">
            <span class="material-icons-round text-slate-400 text-lg">business</span>
            {{ contributor.department }}
          </p>
          <div class="flex flex-wrap gap-4 mt-auto text-slate-800 dark:text-slate-200">
            <div class="flex items-center gap-2 pr-4 border-r border-slate-100 dark:border-slate-700">
              <span class="material-icons-round text-slate-400">calendar_today</span>
              <div>
                <p class="text-xs text-slate-500 dark:text-slate-400">加入日期</p>
                <p class="text-sm font-semibold">{{ contributor.joinDate }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2 pr-4 border-r border-slate-100 dark:border-slate-700">
              <span class="material-icons-round text-slate-400">terminal</span>
              <div>
                <p class="text-xs text-slate-500 dark:text-slate-400">主要语言</p>
                <p class="text-sm font-semibold">{{ contributor.languages }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="material-icons-round text-slate-400">location_on</span>
              <div>
                <p class="text-xs text-slate-500 dark:text-slate-400">办公地点</p>
                <p class="text-sm font-semibold">{{ contributor.location }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- KPI Cards -->
      <div class="lg:col-span-4 grid grid-cols-1 gap-4 h-full">
        <!-- Card 1 -->
        <div class="flex items-center justify-between p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:border-primary/30 transition-colors">
          <div>
            <p class="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">累计代码提交</p>
            <div class="flex items-baseline gap-2">
              <span class="text-2xl font-bold text-slate-900 dark:text-white">{{ contributor.stats.commits }}</span>
              <span class="text-xs font-medium text-emerald-600 flex items-center bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded">
                <span class="material-icons-round text-xs">arrow_upward</span> {{ contributor.stats.commitsGrowth }}
              </span>
            </div>
          </div>
          <div class="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-primary">
            <span class="material-icons-round">commit</span>
          </div>
        </div>
        <!-- Card 2 -->
        <div class="flex items-center justify-between p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:border-primary/30 transition-colors">
          <div>
            <p class="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">PR 合入率</p>
            <div class="flex items-baseline gap-2">
              <span class="text-2xl font-bold text-slate-900 dark:text-white">{{ contributor.stats.prRate }}</span>
              <span class="text-xs font-medium text-emerald-600 flex items-center bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded">
                <span class="material-icons-round text-xs">arrow_upward</span> {{ contributor.stats.prGrowth }}
              </span>
            </div>
          </div>
          <div class="h-10 w-10 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <span class="material-icons-round">merge_type</span>
          </div>
        </div>
        <!-- Card 3 -->
        <div class="flex items-center justify-between p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:border-primary/30 transition-colors">
          <div>
            <p class="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">社区积分</p>
            <div class="flex items-baseline gap-2">
              <span class="text-2xl font-bold text-slate-900 dark:text-white">{{ contributor.stats.points }}</span>
              <span class="text-xs font-medium text-primary flex items-center bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded">
                Top {{ contributor.stats.rankTop }}
              </span>
            </div>
          </div>
          <div class="h-10 w-10 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <span class="material-icons-round">workspace_premium</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Visualization Row -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <!-- Contribution Heatmap -->
      <div class="xl:col-span-2 p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm flex flex-col">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">贡献热力图</h3>
          <select class="text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white border-slate-200 rounded-md text-slate-600 py-1 pl-2 pr-8 focus:ring-primary focus:border-primary outline-none">
            <option>2023</option>
            <option>2022</option>
          </select>
        </div>
        <div class="overflow-x-auto pb-2 flex-1 flex flex-col justify-center">
          <!-- Simulated Heatmap using Grid -->
          <div class="heatmap-grid min-w-[700px] h-[160px] grid grid-rows-7 grid-flow-col gap-1">
            <div v-for="i in 364" :key="i" 
              class="w-full h-full rounded-sm hover:ring-2 ring-offset-1 ring-slate-300 dark:ring-slate-600 transition-all cursor-pointer" 
              :class="getHeatmapColor(i)"
              :title="'Contributions day ' + i">
            </div>
          </div>
          <div class="flex items-center gap-2 mt-4 text-xs text-slate-500 dark:text-slate-400 justify-end">
            <span>Less</span>
            <div class="w-3 h-3 bg-slate-100 dark:bg-slate-700 rounded-sm"></div>
            <div class="w-3 h-3 bg-blue-100 dark:bg-blue-900/40 rounded-sm"></div>
            <div class="w-3 h-3 bg-blue-300 dark:bg-blue-600 rounded-sm"></div>
            <div class="w-3 h-3 bg-blue-500 dark:bg-blue-500 rounded-sm"></div>
            <div class="w-3 h-3 bg-blue-700 dark:bg-blue-400 rounded-sm"></div>
            <span>More</span>
          </div>
        </div>
      </div>
      
      <!-- Skills Radar Chart -->
      <div class="p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm flex flex-col items-center justify-center relative">
        <div class="w-full flex justify-between items-center mb-2 absolute top-6 px-6 left-0">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">能力模型</h3>
          <button class="text-slate-400 hover:text-primary"><span class="material-icons-round">info</span></button>
        </div>
        <div class="mt-8 w-full max-w-[320px] aspect-square relative flex items-center justify-center">
          <svg class="w-full h-full" viewBox="0 0 200 200">
            <!-- Background Pentagons -->
            <g fill="none" class="stroke-slate-200 dark:stroke-slate-600" stroke-width="1">
              <polygon points="100,20 176,76 147,164 53,164 24,76"></polygon>
              <polygon points="100,40 157,82 135,148 65,148 43,82"></polygon>
              <polygon points="100,60 138,88 123,132 77,132 62,88"></polygon>
              <polygon points="100,80 119,94 111,116 89,116 81,94"></polygon>
            </g>
            <!-- Axes -->
            <g class="stroke-slate-200 dark:stroke-slate-600" stroke-width="1">
              <line x1="100" x2="100" y1="100" y2="20"></line>
              <line x1="100" x2="176" y1="100" y2="76"></line>
              <line x1="100" x2="147" y1="100" y2="164"></line>
              <line x1="100" x2="53" y1="100" y2="164"></line>
              <line x1="100" x2="24" y1="100" y2="76"></line>
            </g>
            <!-- Data Polygon: User (Primary) -->
            <polygon class="fill-primary/20 stroke-primary" points="100,25 165,79 135,150 70,140 35,85" stroke-width="2"></polygon>
            <!-- Data Polygon: Average (Gray) -->
            <polygon fill="none" class="stroke-slate-400 dark:stroke-slate-500" points="100,50 140,85 120,130 80,130 60,85" stroke-dasharray="4 2" stroke-width="2"></polygon>
            <!-- Labels -->
            <text class="fill-slate-500 dark:fill-slate-400 text-[8px] font-semibold" text-anchor="middle" x="100" y="15">Coding</text>
            <text class="fill-slate-500 dark:fill-slate-400 text-[8px] font-semibold" text-anchor="start" x="185" y="76">Review</text>
            <text class="fill-slate-500 dark:fill-slate-400 text-[8px] font-semibold" text-anchor="middle" x="155" y="175">Comm.</text>
            <text class="fill-slate-500 dark:fill-slate-400 text-[8px] font-semibold" text-anchor="middle" x="45" y="175">Reliability</text>
            <text class="fill-slate-500 dark:fill-slate-400 text-[8px] font-semibold" text-anchor="end" x="15" y="76">Leadership</text>
          </svg>
        </div>
        <div class="flex gap-4 mt-4">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-primary/40 border border-primary"></div>
            <span class="text-xs text-slate-600 dark:text-slate-400">个人数据</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full border border-slate-400 border-dashed"></div>
            <span class="text-xs text-slate-600 dark:text-slate-400">社区平均</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity Timeline -->
    <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
        <h3 class="text-lg font-bold text-slate-900 dark:text-white">最近动态</h3>
        <button class="text-sm text-primary hover:underline">查看全部</button>
      </div>
      <div class="p-6">
        <div class="relative pl-8 border-l border-slate-200 dark:border-slate-700 space-y-8">
          <div v-for="(activity, index) in activities" :key="index" class="relative group">
            <span 
              class="absolute -left-[41px] flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-white dark:ring-slate-800"
              :class="activity.iconBg"
            >
              <span class="material-icons-round text-sm" :class="activity.iconColor">{{ activity.icon }}</span>
            </span>
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div class="flex flex-col">
                <p class="text-sm font-medium text-slate-900 dark:text-white">
                   {{ activity.type }} <a class="text-primary hover:underline font-mono" href="#">{{ activity.ref }}</a>
                </p>
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">{{ activity.desc }}</p>
              </div>
              <span class="text-xs text-slate-400 whitespace-nowrap">{{ activity.time }}</span>
            </div>
            <div v-if="activity.tags" class="mt-2 flex gap-2">
              <span v-for="tag in activity.tags" :key="tag" class="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">{{ tag }}</span>
            </div>
            <div v-if="activity.codeSnippet" class="mt-2 p-2 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-600 dark:text-slate-400 truncate max-w-lg">
              {{ activity.codeSnippet }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContributorDetail',
  props: {
    contributorId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      contributor: {
        id: '88291',
        name: 'Alex Chen',
        role: '后端开发专家',
        department: '云原生基础设施部',
        joinDate: '2021-03-15',
        languages: 'Go, Rust',
        location: '杭州 HZ-2',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTV5Fq3Asmwu3aEa6RMrVV4CfP9WLI4i5h6UMzu_zdjuJViq0p7xag_Mo2NJAEW7T8ZO0pS08SkxfrJV8n44d3EshtnHCxNAqv1SavdiwqXW9A56ZeKfiaxDOGA5ythMJLmXI3apZxTMJ7GJVLNG5S1-RgyNRpVPuO2ADy52KqoGBQ-j9y9ifco8EoSR9QpFwYQZtr4BfNfkP3fbcxR-EOqUzEXY-YlVzRlZA-NQ089Unj2mZPdbYz7YZy8PCTP5MayB0V2bweGEdm',
        stats: {
          commits: '3,450',
          commitsGrowth: '12%',
          prRate: '92%',
          prGrowth: '2.5%',
          points: '12,500',
          rankTop: '5%'
        }
      },
      activities: [
        {
          type: '代码合并',
          ref: '#PR-3422',
          desc: '优化了大规模并发下的 Redis 缓存策略，减少了 30% 的延迟。',
          time: '2小时前',
          icon: 'call_merge',
          iconBg: 'bg-purple-100 dark:bg-purple-900/30',
          iconColor: 'text-purple-600 dark:text-purple-400',
          tags: ['backend', 'performance']
        },
        {
          type: '提交代码到',
          ref: 'infrastructure/core',
          desc: 'feat: add new metric collector for kubernetes pods',
          time: '昨天 14:30',
          icon: 'commit',
          iconBg: 'bg-blue-100 dark:bg-blue-900/30',
          iconColor: 'text-primary',
          codeSnippet: '7c8f9a2 fix(collector): resolve nil pointer exception in metrics...'
        },
        {
          type: 'Code Review 通过',
          ref: '#PR-3418',
          desc: 'Review 了 Sarah Li 提交的关于用户认证模块的重构代码。',
          time: '2天前',
          icon: 'rate_review',
          iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
          iconColor: 'text-emerald-600 dark:text-emerald-400'
        },
        {
          type: '创建 Issue',
          ref: '#ISSUE-881',
          desc: 'Worker Node 内存泄漏问题调查报告',
          time: '3天前',
          icon: 'bug_report',
          iconBg: 'bg-amber-100 dark:bg-amber-900/30',
          iconColor: 'text-amber-600 dark:text-amber-400'
        }
      ]
    }
  },
  methods: {
    getHeatmapColor(index) {
      // Simulate random heatmap data
      const random = Math.random();
      if (random > 0.85) return 'bg-blue-800 dark:bg-blue-300';
      if (random > 0.60) return 'bg-blue-600 dark:bg-blue-500';
      if (random > 0.35) return 'bg-blue-400 dark:bg-blue-700';
      if (random > 0.15) return 'bg-blue-200 dark:bg-blue-900/50';
      return 'bg-slate-100 dark:bg-slate-700/50';
    }
  }
}
</script>
