<template>
  <main class="flex-1 flex flex-col p-4 md:px-6 md:py-4 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <!-- Header with Back Button and Title -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <button
          @click="$emit('back')"
          class="text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
        >
          <span class="material-icons-round text-lg">arrow_back</span>
        </button>
        <div class="h-6 w-6 rounded bg-red-100 dark:bg-red-900/50 flex items-center justify-center text-red-600 dark:text-red-400 text-xs font-bold">看板</div>
        <h1 class="text-lg font-semibold text-slate-900 dark:text-white">{{ kanbanName }}</h1>
        <span class="text-slate-400 text-xs px-2 py-0.5 border border-slate-200 dark:border-slate-700 rounded-full bg-slate-50 dark:bg-slate-800">企业级</span>
      </div>
      <div class="flex items-center gap-3">
        <div class="relative">
          <span class="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
            <span class="material-icons-round text-slate-400 text-sm">search</span>
          </span>
          <input
            class="pl-8 pr-4 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-sm focus:ring-1 focus:ring-primary dark:text-slate-300 w-64 transition-all"
            placeholder="搜下 / 快速开启搜索"
            type="text"
          />
          <div class="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
            <span class="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-400 px-1 rounded border border-slate-200 dark:border-slate-600">/</span>
          </div>
        </div>
        <button class="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-1 text-xs border border-slate-200 dark:border-slate-700 rounded px-3 py-1.5 bg-white dark:bg-slate-800 shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-slate-700">
          <span class="material-icons-round text-sm">settings</span> 看板设置
        </button>
      </div>
    </div>

    <!-- View Switcher -->
    <div class="flex flex-col gap-3">
      <div class="flex items-center justify-between border-b border-border-light dark:border-border-dark pb-3">
        <div class="flex items-center gap-1 overflow-x-auto">
          <button
            v-for="view in views"
            :key="view.id"
            @click="activeView = view.id"
            :class="[
              'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap',
              activeView === view.id
                ? 'text-primary bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            ]"
          >
            <span class="material-icons-round text-sm">{{ view.icon }}</span>
            {{ view.label }}
          </button>
        </div>
      </div>

      <!-- Filters Row -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="relative">
            <button class="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
              全部事项 <span class="material-icons-round text-sm">expand_more</span>
            </button>
          </div>
          <div class="relative">
            <button class="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
              我的项目 <span class="material-icons-round text-sm">expand_more</span>
            </button>
          </div>
          <div class="relative ml-2">
            <span class="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
              <span class="material-icons-round text-slate-400 text-sm">filter_alt</span>
            </span>
            <input
              class="pl-8 pr-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded focus:ring-1 focus:ring-primary dark:text-slate-300 w-64 placeholder-slate-500"
              placeholder="输入关键词筛选表格"
              type="text"
            />
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button v-for="icon in ['filter_list', 'swap_vert', 'more_horiz']" :key="icon" class="p-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white rounded hover:bg-slate-100 dark:hover:bg-slate-700">
            <span class="material-icons-round text-lg">{{ icon }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Data Grid Table -->
    <div class="bg-white dark:bg-slate-800 border border-border-light dark:border-border-dark rounded-lg shadow-sm overflow-visible flex-1 flex flex-col relative z-0">
      <!-- Grid Header -->
      <div class="grid grid-cols-[40px_minmax(300px,3fr)_120px_200px_200px_150px_1fr] bg-slate-50 dark:bg-slate-900/50 border-b border-border-light dark:border-border-dark text-xs font-semibold text-slate-500 dark:text-slate-400 sticky top-0 z-10 transition-colors">
        <div class="p-3 flex items-center justify-center">
          <input class="rounded border-slate-300 text-primary focus:ring-primary bg-transparent" type="checkbox" />
        </div>
        <div class="p-3 flex items-center">标题</div>
        <div class="p-3 flex items-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">负责人 <span class="material-icons-round text-sm ml-1 text-slate-400">unfold_more</span></div>
        <div class="p-3 flex items-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">标签 <span class="material-icons-round text-sm ml-1 text-slate-400">unfold_more</span></div>
        
        <!-- Date Filter Column with Dropdown -->
        <div class="relative p-3 flex items-center cursor-pointer transition-colors"
             :class="showDateFilter ? 'bg-white dark:bg-slate-800 shadow-inner text-primary' : 'hover:bg-slate-100 dark:hover:bg-slate-800'"
             @click="showDateFilter = !showDateFilter">
          创建时间 
          <span class="material-icons-round text-sm ml-1" :class="showDateFilter ? 'text-primary' : 'text-slate-400'">filter_alt</span>
          
          <!-- Date Filter Dropdown -->
          <div v-if="showDateFilter" 
               class="absolute top-full left-0 mt-2 w-[480px] bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-50 flex flex-col animate-in fade-in zoom-in-95 duration-200"
               @click.stop>
            <div class="flex border-b border-slate-100 dark:border-slate-700">
              <button class="flex-1 py-2.5 text-center text-xs font-semibold text-primary border-b-2 border-primary">创建时间</button>
              <button class="flex-1 py-2.5 text-center text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">更新时间</button>
              <button class="flex-1 py-2.5 text-center text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">截止时间</button>
            </div>
            <div class="p-4 flex gap-4">
              <div class="w-24 flex flex-col gap-1 border-r border-slate-100 dark:border-slate-700 pr-2">
                <button v-for="range in dateRanges" :key="range" 
                        class="text-left px-2 py-1.5 text-xs rounded transition-colors"
                        :class="range === '今天' ? 'text-primary bg-blue-50 dark:bg-blue-900/30 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'">
                  {{ range }}
                </button>
              </div>
              <div class="flex-1 flex flex-col gap-3 text-slate-900 dark:text-slate-200">
                <div class="flex items-center gap-2">
                  <div class="flex-1">
                    <label class="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">开始日期</label>
                    <input class="w-full text-xs border border-slate-200 dark:border-slate-600 rounded p-1.5 dark:bg-slate-700 dark:text-white focus:ring-1 focus:ring-primary outline-none transition-all" type="date" value="2024-05-01"/>
                  </div>
                  <span class="text-slate-400 mt-4">-</span>
                  <div class="flex-1">
                    <label class="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">结束日期</label>
                    <input class="w-full text-xs border border-slate-200 dark:border-slate-600 rounded p-1.5 dark:bg-slate-700 dark:text-white focus:ring-1 focus:ring-primary outline-none transition-all" type="date"/>
                  </div>
                </div>
                <div class="text-[10px] text-slate-400 italic">
                  筛选 2024-05-01 之后的创建记录
                </div>
              </div>
            </div>
            <div class="p-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 flex justify-between rounded-b-lg">
              <button class="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">重置</button>
              <button class="px-4 py-1.5 text-xs bg-slate-900 dark:bg-primary hover:opacity-90 text-white rounded shadow-sm font-semibold transition-all">查询确认</button>
            </div>
          </div>
        </div>
        
        <div class="p-3 flex items-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">所属项目 <span class="material-icons-round text-sm ml-1 text-slate-400">unfold_more</span></div>
        <div class="p-3 flex items-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">筛选条件</div>
      </div>

      <!-- Grid Body -->
      <div class="overflow-y-auto flex-1 text-[13px]">
        <div
          v-for="item in tasks"
          :key="item.id"
          class="grid grid-cols-[40px_minmax(300px,3fr)_120px_200px_200px_150px_1fr] border-b border-border-light dark:border-border-dark hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
        >
          <div class="p-3 flex items-start justify-center pt-4">
            <input class="rounded border-slate-300 text-primary focus:ring-primary bg-transparent" type="checkbox" />
          </div>
          <div class="p-3 pr-6">
            <div class="flex items-center gap-2 mb-1 text-xs">
              <span class="material-icons-round text-base" :class="item.typeColor">{{ item.typeIcon }}</span>
              <span class="text-slate-400 font-medium tracking-tight">#{{ item.id }}</span>
            </div>
            <a class="text-slate-900 dark:text-slate-100 font-semibold hover:text-primary transition-colors line-clamp-2 leading-relaxed" href="#" @click.prevent>
              {{ item.title }}
            </a>
            <div v-if="item.subtasks" class="mt-1.5 flex items-center gap-2 text-slate-400">
              <span class="material-icons-round text-xs">subdirectory_arrow_right</span>
              <span class="text-[10px] font-bold uppercase tracking-wider">子任务: {{ item.subtasks.done }}/{{ item.subtasks.total }} 完成</span>
            </div>
          </div>
          <div class="p-3 flex items-start pt-4">
            <div v-if="item.assignees" class="flex -space-x-2">
              <img v-for="(avatar, idx) in item.assignees" :key="idx" 
                   :alt="'负责人 ' + (idx + 1)" 
                   class="w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 shadow-sm" 
                   :src="avatar" 
              />
              <div v-if="item.extraAssignees" class="w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-[10px] text-slate-600 dark:text-slate-300 font-bold">
                +{{ item.extraAssignees }}
              </div>
            </div>
            <div v-else-if="item.team" class="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 rounded px-1.5 py-0.5 text-[10px] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 font-bold uppercase">
              <span class="material-icons-round text-[10px]">group</span> Team
            </div>
          </div>
          <div class="p-3 flex flex-wrap gap-1.5 items-start pt-4 content-start">
            <span v-for="tag in item.tags" :key="tag.name"
                  :class="[
                    'px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors',
                    tag.classes
                  ]">
              {{ tag.name }}
            </span>
          </div>
          <div class="p-3 text-slate-500 dark:text-slate-400 pt-4 leading-tight">
            <div class="font-medium text-slate-600 dark:text-slate-300">{{ item.date }}</div>
            <div class="text-[10px] opacity-60">{{ item.time }}</div>
          </div>
          <div class="p-3 flex items-start pt-4 gap-1.5 text-slate-600 dark:text-slate-400 overflow-hidden">
            <span class="material-icons-round text-sm opacity-50 shrink-0">folder</span>
            <span class="truncate font-medium">{{ item.projectPath }}</span>
          </div>
          <div class="p-3 pt-4 flex items-center justify-between">
            <span :class="['px-2 py-0.5 rounded border text-[10px] font-bold shadow-sm transition-colors', item.statusClasses]">
              {{ item.status }}
            </span>
            <button class="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-primary transition-all p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700">
              <span class="material-icons-round text-base">edit</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Footer / Pagination -->
      <div class="border-t border-border-light dark:border-border-dark p-3 flex items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-b-lg">
        <nav class="flex items-center gap-1 text-[11px] font-bold text-slate-600 dark:text-slate-400">
          <button class="px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors flex items-center gap-0.5">
            <span class="material-icons-round text-sm">chevron_left</span> 上一页
          </button>
          <button class="w-6 h-6 flex items-center justify-center rounded bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm">1</button>
          <button class="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">2</button>
          <button class="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">3</button>
          <span class="px-1 text-slate-400">...</span>
          <button class="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">100</button>
          <button class="px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-0.5">
            下一页 <span class="material-icons-round text-sm">chevron_right</span>
          </button>
        </nav>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: 'KanbanDetail',
  props: {
    kanbanId: {
      type: [String, Number],
      default: 1
    },
    kanbanName: {
      type: String,
      default: '这是一个企业看板名称'
    }
  },
  data() {
    return {
      activeView: 'table',
      showDateFilter: false,
      dateRanges: ['今天', '昨天', '近7天', '近30天', '自定义范围'],
      views: [
        { id: 'table', label: '数据表格视图', icon: 'table_chart' },
        { id: 'analytics', label: '数据分布统计视图', icon: 'bar_chart' },
        { id: 'users', label: '用户视图', icon: 'people' },
        { id: 'labels', label: '标签分组', icon: 'label' },
        { id: 'text', label: '文本视图', icon: 'description' }
      ],
      tasks: [
        {
          id: 223,
          typeIcon: 'check_circle_outline',
          typeColor: 'text-emerald-500',
          title: '第一版 UI 设计界面列表 - 需要跟进设计稿的复核工作',
          subtasks: { done: 3, total: 5 },
          assignees: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCQx2Va1PVoek9btg-BJURsWBQ5zUz_oGT5s0xTdTKGUAOPUL0XFBluqx5QrJddYtasjmBoLbzObQf4zn8FBfYP7rcNNXJPFGKxdLsfxr1R1WSKbMJtDjCoJuQK5ObX_zHF-7hxW00fFNpd_0pQG54su5DyQCOSXYKVUdhblS7mZuc_oUbxrroqxDho8KH_62duPy1CIkcnpu4B2-AiFzjUQu-vG5S3oNEgKjfoSK5awmcK7zCCnrYuYp75pEL3jCf9zeR5zrdu1qLd'
          ],
          extraAssignees: 2,
          tags: [
            { name: 'bug', classes: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800' },
            { name: 'high priority', classes: 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800' }
          ],
          date: '24/04/05',
          time: '14:20',
          projectPath: 'gitoc/design-sys',
          status: '完成',
          statusClasses: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
        },
        {
          id: 224,
          typeIcon: 'radio_button_checked',
          typeColor: 'text-primary',
          title: '项目进度看板组件开发 #223',
          assignees: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBDWGsrN6O7Sc5B1uD4yWFueZaXADUl6grk2hLjsccOD7e7Nk_6iifQF3_mTeu2_-mIx1EEsav4NzdnNX3YqEHXy-kl8MkjTPYHzeIsnDXrs_8erTNz-V-Q5GGIgtU3T_RU1YtX5yyLkabngdeYMHoP-NiwadcufZYiMJa4NAZo93-BnjaCMN-01_DmBXCqB_jzstq40Tqq9Xw3uxJwBc4KjHWJhOj7ZeWeg50iHIqGiSEo5g6W72-SrihoN1LbbDhzt-63EVuGvnTe'
          ],
          tags: [
            { name: 'feature', classes: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
            { name: 'assigned', classes: 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800' }
          ],
          date: '24/04/05',
          time: '11:00',
          projectPath: 'gitoc/frontend',
          status: '进行中',
          statusClasses: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800'
        },
        {
          id: 225,
          typeIcon: 'remove_circle_outline',
          typeColor: 'text-slate-400',
          title: '通用项目卡片组件 #225',
          team: true,
          tags: [
            { name: 'duplicate', classes: 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700' },
            { name: 'help wanted', classes: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' }
          ],
          date: '24/04/05',
          time: '09:15',
          projectPath: 'gitoc/common-ui',
          status: '已取消',
          statusClasses: 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
        },
        {
          id: 226,
          typeIcon: 'check_circle_outline',
          typeColor: 'text-emerald-500',
          title: '新建资源警告逻辑 #226',
          assignees: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDaYI-r7pQqUbRizMLvSmm1JB-HFwJdrwK06udYUlznOeFDbyHuE8oyky-kqGrGu4nG5QF7qoFkZi0Zxw-XJdGAqmVvFIhIfdIAQ0jSyDYENFOiAnwcVV1yOl04NcVNfzro6fVwYHhc1WVGzBRPjjn2tPxuZ987Ke4l2C1Y1dxgw0qyURmJvT-3Ff_7joSgyiNyqpcgwdObJO2C1Rlj1BBE7dNo-8n94ACcGvY6O5B6RgOP9k03V-_0WqCCCT1dCeN8a5jV9HJvIjzx'
          ],
          tags: [
            { name: 'backend', classes: 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800' }
          ],
          date: '24/04/04',
          time: '18:00',
          projectPath: 'gitoc/backend-api',
          status: '完成',
          statusClasses: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
        },
        {
          id: 228,
          typeIcon: 'check_circle_outline',
          typeColor: 'text-emerald-500',
          title: '通用 commit 信息卡片 (Commit) #228',
          assignees: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAHH8d3kqlg7VVoj3H7jVF17CJR7Jx1ts8Gu0p51zDG10iS2rxQ4TK28krDUs7F5LMjc_i1D3NuPK87O9yHDMb53Kmv8SrPym5US0CDTt-UB3mcVGVVZL2uQk0qCjqreVZFno16SxYaLj9j5zqCS3U37HXafh5lBS5OIp5CgBdhMA_bndR3blIrS4Z4MsqZTSGK6-X_9rQBweRPoXaBtDxxMPlv1luU5ZN3Jkb6EAIayyQm8XdHRA1NNTLgZS5OmMRvwUlsSoSL6PmQ'
          ],
          tags: [
            { name: 'documentation', classes: 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800' }
          ],
          date: '24/04/04',
          time: '12:00',
          projectPath: 'gitoc/docs',
          status: '完成',
          statusClasses: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
        }
      ]
    }
  }
}
</script>
