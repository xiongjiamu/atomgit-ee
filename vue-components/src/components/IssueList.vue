<template>
  <div class="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <!-- Search Bar -->
    <div class="relative rounded-md shadow-sm">
      <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
        <span class="material-icons-round text-slate-400 text-xl">search</span>
      </div>
      <input
        type="text"
        class="focus:ring-primary focus:border-primary block w-full pl-10 pr-4 py-3 sm:text-sm border-slate-300 dark:border-slate-700 dark:bg-surface-dark dark:text-white rounded-lg transition-all shadow-sm placeholder-slate-400"
        placeholder="搜索 Issues..."
      />
    </div>
    <!-- Filter Toolbar -->
    <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-border-light dark:border-border-dark pb-4">
      <!-- Status Tabs -->
      <div class="flex items-center space-x-1 p-1 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800/50 w-fit">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
            activeTab === tab.id
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-900/5 dark:ring-slate-500/20'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700/50'
          ]"
        >
          <span>{{ tab.label }}</span>
          <span :class="[
            'px-1.5 py-0.5 rounded-md text-xs font-semibold',
            activeTab === tab.id ? 'bg-slate-100 dark:bg-slate-600' : 'bg-transparent text-slate-400'
          ]">{{ tab.count }}</span>
        </button>
      </div>

      <!-- Dimension Filters -->
      <div class="flex items-center flex-wrap gap-2">
        <div v-for="filter in dimensionFilters" :key="filter" class="relative group">
          <button class="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all">
            <span>{{ filter }}</span>
            <span class="material-icons-round text-sm opacity-50">expand_more</span>
          </button>
        </div>
        <div class="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>
        <button class="flex items-center space-x-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
          <span class="material-icons-round text-base">sort</span>
          <span>排序</span>
        </button>
      </div>
    </div>

    <!-- Issue List -->
    <div class="space-y-4">
      <div
        v-for="issue in filteredIssues"
        :key="issue.id"
        class="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 hover:shadow-soft hover:border-primary dark:hover:border-slate-600 transition-all group relative cursor-pointer"
      >
        <div class="flex items-start gap-4">
          <div class="mt-1 flex-shrink-0">
            <span
              class="material-icons-round text-xl"
              :class="statusColorClass(issue.status)"
            >
              {{ statusIcon(issue.status) }}
            </span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-1.5">
              <div class="flex items-center gap-2 pr-20">
                <h3 class="text-base font-semibold text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">
                  {{ issue.title }}
                </h3>
                <span
                  v-for="label in issue.labels"
                  :key="label.name"
                  :class="[
                    'px-2 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap',
                    labelClasses(label.color)
                  ]"
                >
                  <span v-if="label.icon" class="material-icons-round text-[10px] mr-1">{{ label.icon }}</span>
                  {{ label.name }}
                </span>
              </div>
              <div class="flex items-center text-xs text-slate-400 dark:text-slate-500 space-x-4 flex-shrink-0">
                <span class="flex items-center gap-1"><span class="material-icons-round text-sm">chat_bubble_outline</span> {{ issue.comments }}</span>
                <span class="flex items-center gap-1"><span class="material-icons-round text-sm">schedule</span> {{ issue.updatedAt }}</span>
              </div>
            </div>
            
            <div class="flex items-center text-xs text-slate-500 dark:text-slate-400 space-x-2 flex-wrap gap-y-1">
              <span class="font-mono text-slate-400 dark:text-slate-500">{{ issue.repo }} #{{ issue.number }}</span>
              <span class="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700"></span>
              <div class="flex items-center gap-1">
                <img v-if="issue.author.avatar" :src="issue.author.avatar" alt="" class="w-4 h-4 rounded-full shadow-sm">
                <span v-else class="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-[8px] font-bold text-slate-500">{{ issue.author.name[0] }}</span>
                <span>{{ issue.author.name }} {{ issue.createdAt }}</span>
              </div>
              
              <template v-if="issue.assignees && issue.assignees.length">
                <span class="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                <div class="flex -space-x-1.5 overflow-hidden">
                  <img
                    v-for="(assignee, idx) in issue.assignees.slice(0, 3)"
                    :key="idx"
                    :src="assignee.avatar"
                    alt=""
                    class="inline-block h-4 w-4 rounded-full ring-2 ring-white dark:ring-slate-800"
                  />
                </div>
                <span class="text-slate-400 ml-1" v-if="issue.assignees.length > 3">+{{ issue.assignees.length - 3 }} 负责</span>
                <span class="text-slate-400 ml-1" v-else>负责</span>
              </template>
            </div>
          </div>
        </div>
        
        <!-- Hover Actions -->
        <div class="hidden group-hover:flex items-center space-x-1 absolute right-4 top-3 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 rounded-md p-1 z-10">
          <button class="p-1 text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-700 transition-all rounded" title="Assign to me">
            <span class="material-icons-round text-lg">person_add</span>
          </button>
          <button class="p-1 text-slate-400 hover:text-blue-500 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all rounded" title="Preview">
            <span class="material-icons-round text-lg">visibility</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="mt-8 flex justify-center pb-4">
      <nav aria-label="Pagination" class="flex items-center space-x-1">
        <button class="relative inline-flex items-center px-3 py-2 text-xs font-bold text-slate-500 bg-white dark:bg-surface-dark dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
          <span class="material-icons-round text-sm">chevron_left</span> 上一页
        </button>
        <button class="z-10 bg-primary text-white relative inline-flex items-center px-4 py-2 text-xs font-bold rounded-md shadow-sm">1</button>
        <button class="bg-white dark:bg-surface-dark text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 relative inline-flex items-center px-4 py-2 text-xs font-bold rounded-md transition-all">2</button>
        <button class="bg-white dark:bg-surface-dark text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hidden md:inline-flex relative items-center px-4 py-2 text-xs font-bold rounded-md transition-all">3</button>
        <span class="relative inline-flex items-center px-4 py-2 text-xs font-bold text-slate-400 bg-transparent">...</span>
        <button class="bg-white dark:bg-surface-dark text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hidden md:inline-flex relative items-center px-4 py-2 text-xs font-bold rounded-md transition-all">100</button>
        <button class="relative inline-flex items-center px-3 py-2 text-xs font-bold text-slate-500 bg-white dark:bg-surface-dark dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
          下一页 <span class="material-icons-round text-sm">chevron_right</span>
        </button>
      </nav>
    </div>
    
    <p class="text-center text-[11px] font-bold text-slate-400 mt-12 mb-4 uppercase tracking-widest">AtomGit Enterprise · © 2024</p>
  </div>
</template>

<script>
import AlertBanner from './AlertBanner.vue'

export default {
  name: 'IssueList',
  components: {
    AlertBanner
  },
  data() {
    return {
      showAlert: true,
      activeTab: 'open',
      tabs: [
        { id: 'open', label: '开启中', count: 65 },
        { id: 'closed', label: '已关闭', count: 56 },
        { id: 'all', label: '全部', count: 121 }
      ],
      dimensionFilters: ['所属组织', '所属项目', '负责人', 'Label'],
      issues: [
        {
          id: 1,
          title: '[Bug] The issue of occupying space in the non displayed part of a semicircle pie chart',
          status: 'open',
          repo: 'csdn / jupyter',
          number: 1,
          labels: [
            { name: 'bug', color: 'red' }
          ],
          author: { name: 'Aresn', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBC6hl4O-drgAKltrTuPrT_UIJm3lYmpVEdMEO4xtCA9KiG04QS4vKLa9JoMOpNeiwLO0sJt9AQ1FpOCwo4dY3kdoJ47jiYeW1CywweZjIiaLfmD_hfauRat5F-WM1sbstNDeyt99ViSEyfU9GKjr187krzy5Yizyeh4keJdNmjTka4eI-r9ZCrN8zOM-0tt49nimuQ0GfwizeFyXNam-hO8Ajjx8DyPLN7TRzQHQllj5cv4oyc7w90kaYCj6PSd5_pBft4HPzUwvsN' },
          createdAt: '1 周前创建',
          updatedAt: '12小时前',
          comments: 23,
          assignees: [
            { avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCa7BzYBNBBWe_HAb3kAt0PiSz1-TAOCbT1hUbJgrYgPj9Cp9IgbA5wX8orbHZqrp9b8bvXgFAZ7Jl9ahsxa5NhYcwSiozPxnvMJuIQbhlHfzV4Ukz_tysjBTqIOrrO_pGliaC9r2ZkVlyLOkPWSAkJ23lxE-Kn-xJHZu9QKyz4mBqv7G8oIw_wpYTgpyzosJ-WWdS-yniwzoJxCnJgl0YTPha_jSdaK0I7bUKI_iT2iCP5uLw25Y3hVM-GXLIg9DX9cpYkIMf77wpG' },
            { avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNoIeLPTpEOTg9Zng1308IrI8s0Z_0MOENFiEqivkFUIN3MMQIzldRs3lyJme30Oqmy9qfEeCiVvnh957kYEYoHwLIEDvrQ9JEJuDFbqFe_7xeBwdgeWJijM2b31JenJyobfbDu_hbKxiuPMMFo6VpSR9GLoBwYgEtTZTPCugdAD-MGIqRRN3xdFkYiqWrDV7LlEPxvwBCQu4bUYlekYXeEM9mCMvWFOjRgocQs9wYvAUAUoTQBDjzyAPIPMi4xoqSr1YdRFTKwvw5' },
            { avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjKmL03hzI-7lS5ZFKDZD3L84sxMgmugW1HOqy9oXBBedJeRyhUAJfgMaoKX5nHWs_SmeLJaxOWakO5lFau1L6xnhWMPIwXS73DE6ffYI9ERj5X6gxvtRvdZQkJO6HxMA6R6uSj6_DX-CuFvS3S93miJONIwsEt29BZ1YD82D10JiX5DSdMWkIySa79TTPXx1dpONHwMxs9WsYVc8-RlkandDgRivf4d73hQsZa4O6brEr8s_F6nCntcFebDZEAn6Tqqc888G7fTZq' }
          ]
        },
        {
          id: 2,
          title: 'removeData',
          status: 'open',
          repo: 'csdn / jupyter-notebook',
          number: 1,
          labels: [],
          author: { name: 'Aresn', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1sGRrFm-G6emY_jIxBAlDrVRQalyMwPN9qnmv0zZxzgCeSqFAxbH5OSRvG7Ul0u0aboBXJazYfIOeCT402ybwf3ordpXpwxqZHpLy_lKi6jeroIYXQMSyxeNEO2DsU7JpIxZCArU4GKWa_otZX9ghu6txfMVhpiYhqyPVbD3lamzUIJi7vBc8Lj3KWO_spWxDbZsZbQME1QCX3-FKs9N9Md7OQ1TURt2bL-lxNqfNMzgkxgFCS_mBCPOUcCS2ytPmkWl5w7A79TjR' },
          createdAt: '1 周前创建',
          updatedAt: '12小时前',
          comments: 23,
          assignees: [
            { avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZvvXIwgEbm4Xj6Hd_qvYzUXIiX6BVvaXs_P0fzPXXUojHrPDWNDc0g1fldZ9BvMUoDPjYp0P1nasJrQlnaiIjk81F-0FO2fyPv2eVQYyd2U10kAfIzwS_Dsm4RJh0voIbYhfSE9vDA0gY-IIxUaxAzkP4H9mXlwFrWqGe_B83IUsqFPRaSATjY5zcDJKFs9NNW6cRXKvA5Az8GLr5nuB6I81sN51fgtGaJosHK4u5zfHSWt1u3Dr5iZN6UwM6uuu17fpwpy3TJZz8' }
          ]
        },
        {
          id: 3,
          title: '[Bug] Heatmap in some Size show a blank space at left top',
          status: 'resolved',
          repo: 'csdn / jupyter-notebook',
          number: 1,
          labels: [
            { name: 'documentation', color: 'blue' },
            { name: 'help wanted', color: 'green' }
          ],
          author: { name: 'Aresn', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBC6hl4O-drgAKltrTuPrT_UIJm3lYmpVEdMEO4xtCA9KiG04QS4vKLa9JoMOpNeiwLO0sJt9AQ1FpOCwo4dY3kdoJ47jiYeW1CyweZjIiaLfmD_hfauRat5F-WM1sbstNDeyt99ViSEyfU9GKjr187krzy5Yizyeh4keJdNmjTka4eI-r9ZCrN8zOM-0tt49nimuQ0GfwizeFyXNam-hO8Ajjx8DyPLN7TRzQHQllj5cv4oyc7w90kaYCj6PSd5_pBft4HPzUwvsN' },
          createdAt: '1 周前创建',
          updatedAt: '12小时前',
          comments: 23,
          assignees: []
        },
        {
          id: 4,
          title: 'Issue 详情头部描述组件需要适配移动端触屏反馈',
          status: 'open',
          repo: 'csdn / jupyter-notebook',
          number: 1,
          labels: [
            { name: 'verified', color: 'green', icon: 'check' },
            { name: 'bug', color: 'red' }
          ],
          author: { name: 'Aresn', avatar: null },
          createdAt: '昨天创建',
          updatedAt: '刚才',
          comments: 5,
          assignees: [
            { avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKsmRdFvu1M_mOlfUcZ3CZUGGl_7cWxFzGMDpZjFrziGI_1WbqnzMQBn4VPJpeNaabIeRPFjH96H5EQg_LGLN5k3kL4dKueHyxCpednPy6tRwzECut4GXCpQ_2A6QfFYaZpAq44kHU3sy6U3ubLWdxMaiyiwTWL89_ZvFflM-ReZ_jEadAzUF_GK1wOJ6bV_X-xFVWnD2RfNhjFzjwYw1iv2RWUtsFsqj86UNfTD_xu_qQfbFesieu6OwjcvpmPgtak1Xp-1xBmj6X' }
          ]
        }
      ]
    }
  },
  computed: {
    filteredIssues() {
      if (this.activeTab === 'all') return this.issues
      return this.issues.filter(i => i.status === this.activeTab)
    }
  },
  methods: {
    statusIcon(status) {
      if (status === 'resolved') return 'check_circle'
      return 'adjust'
    },
    statusColorClass(status) {
      if (status === 'resolved') return 'text-purple-500'
      return 'text-emerald-500'
    },
    labelClasses(color) {
      const map = {
        red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800',
        green: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800',
        blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800',
        gray: 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-700',
        purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-800'
      }
      return map[color] || map.gray
    }
  }
}
</script>
