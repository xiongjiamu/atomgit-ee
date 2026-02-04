<template>
  <div class="h-full flex flex-col">
    <div v-if="currentView === 'overview'" class="space-y-6 animate-in fade-in duration-500">
      <!-- Overview Header -->
      <div class="flex items-end justify-between mb-8">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white">贡献与生态排行</h1>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">核心贡献者画像、社区活跃度及企业 CLA 签署情况。</p>
        </div>
        <div class="flex items-center space-x-2">
          <div class="relative">
            <select class="appearance-none bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white py-1.5 pl-3 pr-8 rounded leading-tight focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm">
              <option>最近 7 天</option>
              <option>最近 30 天</option>
              <option>最近 90 天</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
              <span class="material-icons-round text-sm">expand_more</span>
            </div>
          </div>
          <button class="p-1.5 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400">
            <span class="material-icons-round text-sm">refresh</span>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-12 gap-6">
        <!-- Top Contributors Sidebar -->
        <div class="col-span-12 lg:col-span-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm h-full">
          <div class="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <h2 class="font-semibold text-slate-900 dark:text-white flex items-center">
              <span class="text-yellow-500 mr-2 material-icons-round">emoji_events</span>
              Top 核心贡献者
            </h2>
            <button class="text-xs text-blue-600 dark:text-blue-400 hover:underline" @click="currentView = 'list'">查看全部</button>
          </div>
          <div class="p-2 space-y-1">
            <div v-for="user in topContributors" :key="user.id" 
              class="flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors"
              :class="activeContributorId === user.id ? 'bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600' : 'hover:bg-slate-50 dark:hover:bg-slate-700/30 border border-transparent'"
              @click="activeContributorId = user.id">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg" :class="user.avatarBg + ' ' + user.avatarText">
                  {{ user.initial }}
                </div>
                <div>
                  <div class="font-medium text-slate-900 dark:text-white">{{ user.name }}</div>
                  <div class="text-xs text-slate-500 dark:text-slate-400">Commits: {{ user.commits }}</div>
                </div>
              </div>
              <span class="material-icons-round text-slate-400 text-sm">chevron_right</span>
            </div>
          </div>
        </div>

        <!-- Right Content Area -->
        <div class="col-span-12 lg:col-span-8 space-y-6">
          <!-- Micro View Card -->
          <div class="bg-white dark:bg-slate-800 rounded-lg border border-blue-200 dark:border-blue-900 shadow-sm relative overflow-hidden">
            <div class="absolute top-0 left-0 bg-blue-600 text-white text-xs px-3 py-1 rounded-br-lg font-medium">微观画像 (Micro View)</div>
            <div class="p-6 pt-8">
              <div class="flex justify-between items-start mb-6">
                <div class="flex items-center space-x-4">
                  <div class="w-16 h-16 rounded-full border-2 border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-3xl font-bold text-slate-700 dark:text-slate-200">
                    {{ activeContributor.initial }}
                  </div>
                  <div>
                    <h3 class="text-xl font-bold text-slate-900 dark:text-white">{{ activeContributor.name }}</h3>
                    <p class="text-slate-500 dark:text-slate-400">{{ activeContributor.role }}</p>
                  </div>
                </div>
                <button class="px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition" @click="viewDetail(activeContributor.id)">查看完整档案</button>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-100 dark:border-slate-700 pt-6">
                <div>
                  <h4 class="text-xs font-medium text-slate-500 mb-4">活跃时间分布</h4>
                  <div class="flex items-end space-x-1 h-16 w-full max-w-[200px]">
                    <div class="bg-slate-200 dark:bg-slate-600 w-1/6 rounded-sm h-[20%]"></div>
                    <div class="bg-blue-500 w-1/6 rounded-sm h-[80%]"></div>
                    <div class="bg-blue-400 w-1/6 rounded-sm h-[60%]"></div>
                    <div class="bg-slate-200 dark:bg-slate-600 w-1/6 rounded-sm h-[40%]"></div>
                    <div class="bg-slate-200 dark:bg-slate-600 w-1/6 rounded-sm h-[15%]"></div>
                    <div class="bg-slate-200 dark:bg-slate-600 w-1/6 rounded-sm h-[5%]"></div>
                  </div>
                </div>
                <div>
                  <h4 class="text-xs font-medium text-slate-500 mb-4">代码能力雷达</h4>
                  <div class="flex space-x-3 text-xs">
                    <div class="border border-slate-200 dark:border-slate-600 rounded px-3 py-2 bg-slate-50 dark:bg-slate-700/50">
                      <span class="text-slate-500 dark:text-slate-400 block mb-0.5">Code Quality</span>
                      <span class="font-bold text-slate-900 dark:text-white text-sm">S</span>
                    </div>
                    <div class="border border-slate-200 dark:border-slate-600 rounded px-3 py-2 bg-slate-50 dark:bg-slate-700/50">
                      <span class="text-slate-500 dark:text-slate-400 block mb-0.5">Review</span>
                      <span class="font-bold text-slate-900 dark:text-white text-sm">A+</span>
                    </div>
                    <div class="border border-slate-200 dark:border-slate-600 rounded px-3 py-2 bg-slate-50 dark:bg-slate-700/50">
                      <span class="text-slate-500 dark:text-slate-400 block mb-0.5">Velocity</span>
                      <span class="font-bold text-slate-900 dark:text-white text-sm">A</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Points Leaderboard -->
            <div class="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm p-4 flex flex-col h-full">
              <h3 class="font-semibold text-slate-900 dark:text-white flex items-center mb-4">
                <span class="text-pink-500 mr-2 material-icons-round">favorite</span>
                社区积分榜 Top 3
              </h3>
              <div class="space-y-3 flex-1">
                <div class="flex items-center justify-between text-sm">
                  <div class="flex items-center space-x-3">
                    <span class="w-5 h-5 flex items-center justify-center bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300 text-xs rounded font-bold">1</span>
                    <span class="font-medium text-slate-700 dark:text-slate-200">Li Ming</span>
                  </div>
                  <div class="font-mono text-slate-600 dark:text-slate-400">12,400 pts</div>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <div class="flex items-center space-x-3">
                    <span class="w-5 h-5 flex items-center justify-center bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded font-bold">2</span>
                    <span class="font-medium text-slate-700 dark:text-slate-200">Wang</span>
                  </div>
                  <div class="font-mono text-slate-600 dark:text-slate-400">9,200 pts</div>
                </div>
              </div>
              <div class="mt-4 pt-3">
                <button class="w-full py-2 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs text-slate-500 dark:text-slate-400 rounded transition text-center">
                  完整榜单
                </button>
              </div>
            </div>

            <!-- CLA Status -->
            <div class="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm p-4 flex flex-col h-full">
              <h3 class="font-semibold text-slate-900 dark:text-white flex items-center mb-4">
                <span class="text-slate-600 dark:text-slate-400 mr-2 material-icons-round">apartment</span>
                企业贡献榜 (CLA)
              </h3>
              <div class="space-y-3 flex-1">
                <div class="flex items-center justify-between text-sm">
                  <div class="flex items-center space-x-3">
                    <span class="material-icons-round text-slate-400 text-sm">business</span>
                    <span class="font-medium text-slate-700 dark:text-slate-200">Tencent</span>
                  </div>
                  <span class="px-2 py-0.5 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs rounded border border-green-100 dark:border-green-800">Signed</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <div class="flex items-center space-x-3">
                    <span class="material-icons-round text-slate-400 text-sm">business</span>
                    <span class="font-medium text-slate-700 dark:text-slate-200">Alibaba</span>
                  </div>
                  <span class="px-2 py-0.5 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs rounded border border-green-100 dark:border-green-800">Signed</span>
                </div>
              </div>
              <div class="mt-4 pt-3">
                <button class="w-full py-2 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs text-slate-500 dark:text-slate-400 rounded transition text-center">
                  完整榜单
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <ContributorList v-if="currentView === 'list'" @select-contributor="viewDetail" @back="currentView = 'overview'" />
    <ContributorDetail v-if="currentView === 'detail'" :contributor-id="selectedContributorId" @back="currentView = 'overview'" @to-list="currentView = 'list'" />

  </div>
</template>

<script>
import ContributorList from './ContributorList.vue'
import ContributorDetail from './ContributorDetail.vue'

export default {
  name: 'ContributionAnalysis',
  components: {
    ContributorList,
    ContributorDetail
  },
  data() {
    return {
      currentView: 'overview', // 'overview', 'list', 'detail'
      selectedContributorId: null,
      activeContributorId: 1,
      topContributors: [
        { id: 1, name: 'Alex Chen', initial: 'A', commits: 452, avatarBg: 'bg-blue-100 dark:bg-blue-900', avatarText: 'text-blue-600 dark:text-blue-300', role: 'Frontend Arch @ AtomGit' },
        { id: 2, name: 'Sarah Wu', initial: 'S', commits: 389, avatarBg: 'bg-purple-100 dark:bg-purple-900', avatarText: 'text-purple-600 dark:text-purple-300', role: 'Core Contributor' },
        { id: 3, name: 'Jason Li', initial: 'J', commits: 312, avatarBg: 'bg-green-100 dark:bg-green-900', avatarText: 'text-green-600 dark:text-green-300', role: 'DevOps Engineer' },
        { id: 4, name: 'Mike Zhang', initial: 'M', commits: 289, avatarBg: 'bg-yellow-100 dark:bg-yellow-900', avatarText: 'text-yellow-600 dark:text-yellow-300', role: 'Backend Developer' }
      ]
    }
  },
  computed: {
    activeContributor() {
      return this.topContributors.find(c => c.id === this.activeContributorId) || this.topContributors[0]
    }
  },
  methods: {
    viewDetail(id) {
      this.selectedContributorId = id
      this.currentView = 'detail'
    }
  }
}
</script>
