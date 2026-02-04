<template>
  <div class="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">荣誉勋章体系</h1>
        <p class="text-slate-500 dark:text-slate-400 mt-2 font-medium">设计成就任务，提升开发者的社区归属感与活跃度。</p>
      </div>
      <div class="flex items-center gap-3">
        <button 
          @click="showCreateModal = true"
          class="flex items-center justify-center px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
        >
          <span class="material-icons-round text-lg mr-2">add_circle_outline</span>
          创建勋章
        </button>
      </div>
    </div>

    <!-- Alert Banners -->
    <div class="grid grid-cols-1 gap-4">
      <div class="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 rounded-xl p-4 flex items-center justify-between">
        <div class="flex items-center text-sm text-blue-700 dark:text-blue-400">
          <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
            <span class="material-icons-round text-sm">info</span>
          </div>
          <span class="font-bold mr-2">公告：</span>
          <span class="font-medium">AtomGit 将于本周五 22:00 进行版本升级，届时 CI/CD 服务可能会有短时闪断。</span>
        </div>
        <button class="text-blue-400 hover:text-blue-600 transition-colors"><span class="material-icons-round">close</span></button>
      </div>
    </div>

    <!-- Medal Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div 
        v-for="medal in medals" 
        :key="medal.id"
        class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all relative group overflow-hidden"
      >
        <div class="absolute top-4 right-4 z-10">
          <span v-if="medal.auto" class="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black rounded-lg border border-blue-100 dark:border-blue-800 uppercase tracking-wider">Auto</span>
        </div>
        
        <!-- Background Decoration -->
        <div :class="['absolute -right-4 -top-4 w-24 h-24 blur-3xl opacity-10 rounded-full', medal.glowColor]"></div>

        <div class="flex flex-col items-center text-center relative z-10">
          <div :class="['w-20 h-20 rounded-xl flex items-center justify-center mb-5 rotate-3 group-hover:rotate-0 transition-transform duration-500 shadow-lg', medal.bgColor]">
            <span class="material-icons-round text-4xl text-white">{{ medal.icon }}</span>
          </div>
          <h3 class="text-lg font-black text-slate-900 dark:text-white mb-1 tracking-tight">{{ medal.name }}</h3>
          <p class="text-slate-400 dark:text-slate-500 text-xs mb-6 font-medium leading-relaxed">{{ medal.description }}</p>
          
          <div class="w-full space-y-2">
            <div class="flex justify-between items-center text-[11px] font-bold">
              <span class="text-slate-400 dark:text-slate-500">获取人数</span>
              <span class="text-slate-900 dark:text-white">{{ medal.count }}</span>
            </div>
            <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div 
                class="h-full rounded-full transition-all duration-1000"
                :class="medal.progressColor"
                :style="{ width: medal.progress + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Create New Card -->
      <button 
        @click="showCreateModal = true"
        class="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/5 transition-all min-h-[280px] group"
      >
        <div class="w-14 h-14 rounded-xl border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center mb-4 group-hover:border-primary/50 group-hover:scale-110 transition-all">
          <span class="material-icons-round text-slate-300 dark:text-slate-600 text-3xl group-hover:text-primary transition-colors">add</span>
        </div>
        <span class="text-slate-400 dark:text-slate-500 font-bold group-hover:text-primary transition-colors">创建新勋章任务</span>
      </button>
    </div>

    <!-- Create Medal Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div class="bg-white dark:bg-surface-dark w-full max-w-4xl rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh]">
        <!-- Modal Header -->
        <div class="px-10 py-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">创建勋章</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">按照指引设置勋章的基础信息、规则与奖励</p>
          </div>
          <button @click="closeModal" class="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <span class="material-icons-round">close</span>
          </button>
        </div>

        <!-- Stepper -->
        <div class="px-10 py-6 bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
          <div class="flex items-center justify-between max-w-2xl mx-auto relative">
            <div class="absolute top-5 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-700 -z-0"></div>
            <div 
              class="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500 -z-0"
              :style="{ width: ((currentStep - 1) / 2) * 100 + '%' }"
            ></div>

            <div v-for="step in 3" :key="step" class="z-10 bg-inherit flex flex-col items-center">
              <div 
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 font-bold text-sm',
                  currentStep >= step ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-slate-400'
                ]"
              >
                <span v-if="currentStep > step" class="material-icons-round text-lg">check</span>
                <span v-else>{{ step }}</span>
              </div>
              <span 
                :class="[
                  'text-[11px] font-bold mt-2 uppercase tracking-wider',
                  currentStep >= step ? 'text-primary' : 'text-slate-400'
                ]"
              >
                {{ ['基础信息', '规则配置', '奖励并发布'][step - 1] }}
              </span>
            </div>
          </div>
        </div>

        <!-- Modal Body -->
        <div class="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <!-- Step 1: Basic Info -->
          <div v-if="currentStep === 1" class="flex gap-10 animate-in slide-in-from-right-4 duration-500">
            <div class="w-1/3 space-y-6">
              <div class="flex items-center gap-2 mb-4">
                <span class="w-1.5 h-4 bg-primary rounded-full"></span>
                <p class="text-sm font-bold text-slate-500 uppercase tracking-wider">外观预览</p>
              </div>
              <div class="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-8 flex flex-col items-center">
                <div class="w-32 h-32 rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-700 flex items-center justify-center mb-6 relative group overflow-hidden">
                   <div class="absolute inset-x-0 bottom-0 h-1.5 bg-primary/20"></div>
                   <span class="material-icons-round text-6xl text-slate-200 dark:text-slate-700 group-hover:scale-110 transition-transform duration-500">military_tech</span>
                </div>
                <h3 class="text-xl font-black text-slate-900 dark:text-white mb-2">{{ newMedal.name || '勋章名称' }}</h3>
                <p class="text-xs text-slate-400 font-medium text-center leading-relaxed">未解锁勋章仅可见名称与占位描述</p>
              </div>
            </div>
            <div class="flex-1 space-y-8">
              <div class="space-y-4">
                <label class="text-sm font-bold text-slate-700 dark:text-slate-300">勋章名称 <span class="text-red-500">*</span></label>
                <input 
                  v-model="newMedal.name"
                  type="text" 
                  class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-900 dark:text-white"
                  placeholder="例如：开源先锋、Bug 杀手"
                />
              </div>
              <div class="space-y-4">
                <label class="text-sm font-bold text-slate-700 dark:text-slate-300">勋章描述</label>
                <textarea 
                  v-model="newMedal.description"
                  class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-900 dark:text-white min-h-[120px]"
                  placeholder="写下获取该勋章的成就感与意义..."
                ></textarea>
              </div>
              <div class="space-y-4">
                <label class="text-sm font-bold text-slate-700 dark:text-slate-300">上传图标</label>
                <div class="w-full h-40 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group">
                  <span class="material-icons-round text-3xl text-slate-300 group-hover:text-primary transition-colors mb-2">cloud_upload</span>
                  <p class="text-xs font-bold text-slate-400 group-hover:text-slate-600 transition-colors">点击上传 PNG/SVG (建议 512x512)</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 2: Trigger Rules -->
          <div v-if="currentStep === 2" class="space-y-10 animate-in slide-in-from-right-4 duration-500">
            <div class="grid grid-cols-2 gap-8">
              <div class="space-y-4">
                <label class="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  触发事件
                  <span class="material-icons-round text-sm text-slate-400">help_outline</span>
                </label>
                <select class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-bold text-slate-900 dark:text-white appearance-none">
                  <option>合并 Pull Request</option>
                  <option>提交 Issue</option>
                  <option>获得仓库 Star</option>
                  <option>提交代码 (Commit)</option>
                </select>
              </div>
              <div class="space-y-4">
                <label class="text-sm font-bold text-slate-700 dark:text-slate-300">完成次数</label>
                <div class="relative">
                  <input 
                    type="number" 
                    value="10"
                    class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-bold text-slate-900 dark:text-white"
                  />
                  <span class="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">次</span>
                </div>
              </div>
            </div>

            <div class="bg-primary/5 dark:bg-primary/10 rounded-xl p-6 flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <span class="material-icons-round text-primary">auto_awesome</span>
                </div>
                <div>
                  <p class="text-sm font-bold text-slate-900 dark:text-white">满足条件后自动发放</p>
                  <p class="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">用户达成目标后系统将立即下发勋章消息</p>
                </div>
              </div>
              <div class="w-12 h-6 bg-primary rounded-full relative shadow-inner">
                <div class="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
              </div>
            </div>

            <div class="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
               <label class="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  有效统计周期
                  <span class="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">可选</span>
                </label>
              <div class="flex items-center gap-4">
                <input type="date" class="flex-1 px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-900 dark:text-white" />
                <span class="text-slate-400 font-bold">至</span>
                <input type="date" class="flex-1 px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-900 dark:text-white" />
              </div>
            </div>
          </div>

          <!-- Step 3: Rewards -->
          <div v-if="currentStep === 3" class="space-y-8 animate-in slide-in-from-right-4 duration-500">
            <div class="grid grid-cols-2 gap-8">
              <div class="space-y-4">
                <label class="text-sm font-bold text-slate-700 dark:text-slate-300">额外奖励积分</label>
                <div class="relative">
                  <input 
                    type="number" 
                    value="100"
                    class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-bold text-slate-900 dark:text-white"
                  />
                  <span class="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">Points</span>
                </div>
              </div>
              <div class="space-y-4 flex flex-col justify-end">
                <div class="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 px-6 py-4 rounded-xl group cursor-pointer">
                  <div class="w-5 h-5 rounded-md border-2 border-primary bg-primary flex items-center justify-center text-white">
                    <span class="material-icons-round text-xs">check</span>
                  </div>
                  <span class="text-sm font-bold text-slate-700 dark:text-slate-300">在个人主页高亮显示</span>
                </div>
              </div>
            </div>

            <div class="bg-slate-900 dark:bg-black rounded-xl p-8 relative overflow-hidden group">
               <div class="absolute -right-20 -top-20 w-64 h-64 bg-primary/20 blur-[100px] rounded-full"></div>
               <h4 class="text-xs font-black text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                 <span class="material-icons-round text-sm">visibility</span>
                 发布前最终确认
               </h4>
               
               <div class="flex gap-8 items-center">
                 <div class="w-28 h-28 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 flex flex-col items-center justify-center shadow-2xl">
                    <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg mb-2 rotate-3 transform group-hover:rotate-0 transition-all duration-700 overflow-hidden relative">
                      <span class="material-icons-round text-white text-3xl z-10">military_tech</span>
                      <div class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <span class="text-[9px] text-blue-400 font-black tracking-widest">{{ newMedal.name || '勋章名称' }}</span>
                 </div>
                 
                 <div class="flex-1 space-y-4">
                    <div class="grid grid-cols-2 gap-6">
                      <div>
                        <p class="text-[10px] font-black text-slate-500 uppercase">勋章分类</p>
                        <p class="text-sm font-bold text-white mt-0.5">代码贡献先锋</p>
                      </div>
                      <div>
                        <p class="text-[10px] font-black text-slate-500 uppercase">奖励配置</p>
                        <p class="text-sm font-bold text-emerald-400 mt-0.5">+100 社区积分</p>
                      </div>
                    </div>
                    <div>
                      <p class="text-[10px] font-black text-slate-500 uppercase">获取规则</p>
                      <ul class="mt-1 space-y-1">
                        <li class="text-xs text-slate-300 flex items-center gap-2">
                          <span class="w-1 h-1 bg-primary rounded-full"></span>
                          累计合并 10 个 Pull Request
                        </li>
                        <li class="text-xs text-slate-300 flex items-center gap-2">
                          <span class="w-1 h-1 bg-primary rounded-full"></span>
                          仅统计近 30 天内活跃用户
                        </li>
                      </ul>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="px-10 py-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
           <button 
            v-if="currentStep > 1"
            @click="currentStep--"
            class="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all"
           >
            <span class="material-icons-round">arrow_back</span>
            上一步
          </button>
          <div v-else></div>

          <div class="flex items-center gap-4">
            <button @click="closeModal" class="px-6 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all">
              取消
            </button>
            <button 
              @click="handleNext"
              class="flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:shadow-lg hover:shadow-primary/20 transition-all shadow-md active:scale-95"
            >
              {{ currentStep === 3 ? '确认发布' : '下一步' }}
              <span class="material-icons-round text-lg">{{ currentStep === 3 ? 'rocket_launch' : 'arrow_forward' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MedalManagement',
  data() {
    return {
      showCreateModal: false,
      currentStep: 1,
      newMedal: {
        name: '',
        description: ''
      },
      medals: [
        {
          id: 1,
          name: 'Bug Hunter',
          description: '累计提交 10 个有效 Bug Issue',
          icon: 'bug_report',
          count: '128',
          progress: 35,
          progressColor: 'bg-emerald-500',
          bgColor: 'bg-emerald-500',
          glowColor: 'bg-emerald-500',
          auto: true
        },
        {
          id: 2,
          name: 'PR Master',
          description: '合并 Pull Request 数量超过 50 个',
          icon: 'merge',
          count: '42',
          progress: 65,
          progressColor: 'bg-blue-500',
          bgColor: 'bg-blue-500',
          glowColor: 'bg-blue-500',
          auto: true
        },
        {
          id: 3,
          name: 'Review Guru',
          description: '在 Pull Request 中提供高质量 Code Review',
          icon: 'rate_review',
          count: '15',
          progress: 20,
          progressColor: 'bg-purple-500',
          bgColor: 'bg-purple-500',
          glowColor: 'bg-purple-500',
          auto: false
        },
        {
          id: 4,
          name: 'Rising Star',
          description: '创新的项目被收藏数 (Star) 超过 100',
          icon: 'auto_awesome',
          count: '310',
          progress: 90,
          progressColor: 'bg-amber-500',
          bgColor: 'bg-amber-500',
          glowColor: 'bg-amber-500',
          auto: true
        }
      ]
    }
  },
  methods: {
    handleNext() {
      if (this.currentStep < 3) {
        this.currentStep++
      } else {
        // Handle final submission
        this.closeModal()
      }
    },
    closeModal() {
      this.showCreateModal = false
      this.currentStep = 1
      this.newMedal = { name: '', description: '' }
    }
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.1);
  border-radius: 0.75rem;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.2);
}
</style>
