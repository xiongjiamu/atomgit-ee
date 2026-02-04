<template>
  <div class="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <!-- View Selector & Title Header -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
      <div class="space-y-4">
        <div class="flex items-center gap-4">
          <ViewSelector :selected-view="selectedView" @change="$emit('view-change', $event)" />
          <div class="w-px h-8 bg-slate-200 dark:bg-slate-800"></div>
          <h1 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight" style="margin-bottom:0">软件成分分析 (SBOM)</h1>
        </div>
        <p class="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-2xl">
          基于 SPDX 标准生成的软件物料清单，透明化展现第三方依赖关系与潜在安全水位。
        </p>
      </div>
      <div class="flex items-center gap-3">
        <div class="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button 
            @click="viewMode = 'table'"
            :class="[
              'px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-2 uppercase tracking-widest',
              viewMode === 'table' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            ]"
          >
            <span class="material-icons-round text-sm">table_rows</span>
            列表视图
          </button>
          <button 
            @click="viewMode = 'tree'"
            :class="[
              'px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-2 uppercase tracking-widest',
              viewMode === 'tree' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            ]"
          >
            <span class="material-icons-round text-sm">account_tree</span>
            依赖树
          </button>
        </div>
        <button class="flex items-center justify-center px-5 py-3 text-[10px] font-black text-white bg-slate-900 dark:bg-slate-700 rounded-xl hover:shadow-xl transition-all active:scale-95 shadow-md uppercase tracking-[0.2em]">
          <span class="material-icons-round text-lg mr-2">download</span>
          导出 SPDX
        </button>
      </div>
    </div>

    <!-- Alert Banners -->
    <div class="space-y-3">
      <div class="bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-xl p-4 flex items-start">
        <span class="material-icons-round text-amber-500 text-lg mt-0.5 mr-3">info</span>
        <div class="flex-1 text-sm text-amber-800 dark:text-amber-200">
          <span class="font-bold mr-1">资产预警:</span> 当前扫描结果中包含 <span class="text-rose-500 font-black underline underline-offset-4">GPL-3.0</span> 等强传染性开源协议，可能对企业核心商业逻辑产生合规影响。
        </div>
        <button class="text-amber-400 hover:text-amber-600 transition-colors">
          <span class="material-icons-round text-lg">close</span>
        </button>
      </div>
    </div>

    <!-- Main Content Area -->
    <div v-if="viewMode === 'table'" class="space-y-6">
      <!-- Search & Filter Bar -->
      <div class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div class="relative flex-1 group w-full">
          <span class="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
          <input 
            type="text" 
            class="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all placeholder-slate-400"
            placeholder="搜索组件名称 (如 fastjson), 许可证, 或版本号..."
          />
        </div>
        <button class="px-5 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2">
          <span class="material-icons-round text-base">filter_alt</span>
          详细筛选
        </button>
      </div>

      <!-- Component Table -->
      <div class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 dark:bg-slate-900/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 dark:border-slate-800">
              <th class="px-8 py-5">组件名称 · Name</th>
              <th class="px-8 py-5">当前版本 · Version</th>
              <th class="px-8 py-5">公开许可证 · License</th>
              <th class="px-8 py-5">关联项目 · Projects</th>
              <th class="px-8 py-5">风险等级 · Risk</th>
              <th class="px-8 py-5 text-right">管理 · Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr v-for="comp in components" :key="comp.name" class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
              <td class="px-8 py-6">
                <div class="flex flex-col">
                  <span class="text-sm font-black text-slate-900 dark:text-white font-mono tracking-tight group-hover:text-primary transition-colors">{{ comp.name }}</span>
                  <span class="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">{{ comp.packageName }}</span>
                </div>
              </td>
              <td class="px-8 py-6">
                <div class="flex items-center gap-3">
                  <span class="text-sm font-bold text-slate-600 dark:text-slate-300 font-mono">{{ comp.version }}</span>
                  <span v-if="comp.isOutdated" class="text-[9px] font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-lg uppercase tracking-widest border border-amber-500/20">Outdated</span>
                </div>
              </td>
              <td class="px-8 py-6">
                <span class="inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 uppercase tracking-widest font-mono">
                  {{ comp.license }}
                </span>
              </td>
              <td class="px-8 py-6">
                <button 
                  @click.stop="openProjectsModal(comp)"
                  class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-primary/30 hover:bg-white dark:hover:bg-slate-800 transition-all group/proj"
                >
                  <span class="text-sm font-black text-slate-700 dark:text-slate-300">{{ comp.projectCount || 0 }}</span>
                  <span class="material-icons-round text-xs text-slate-400 group-hover/proj:text-primary transition-colors">launch</span>
                </button>
              </td>
              <td class="px-8 py-6">
                <span :class="['inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm', comp.riskClass]">
                  {{ comp.risk }}
                </span>
              </td>
              <td class="px-8 py-6 text-right">
                <button 
                  @click="openDetail(comp)"
                  class="text-[10px] font-black text-primary hover:text-primary-dark transition-colors uppercase tracking-widest flex items-center justify-end gap-1 ml-auto group/btn"
                >
                  查看详情
                  <span class="material-icons-round text-sm group-hover/btn:translate-x-1 transition-transform">chevron_right</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Pagination Placeholder -->
        <div class="px-8 py-5 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Showing <span class="text-slate-900 dark:text-white">{{ components.length }}</span> of <span class="text-slate-900 dark:text-white">56</span> Components Found
          </p>
          <div class="flex items-center gap-2">
            <button class="w-8 h-8 rounded-lg bg-primary text-white text-[10px] font-black shadow-lg shadow-primary/20">1</button>
            <button class="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 text-[10px] font-black hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">2</button>
            <button class="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 text-[10px] font-black hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-mono">...</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tree View (Interactive dependenccy visualization) -->
    <div v-else class="flex-1 min-h-[600px] relative bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden group shadow-inner">
      <!-- Logic of Tree View preserved from previous implementation -->
      <div class="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
      
      <div class="absolute inset-0 flex items-center justify-center p-20 overflow-auto custom-scrollbar">
        <div class="relative w-[800px] h-[400px]">
          <svg class="absolute inset-0 w-full h-full pointer-events-none">
            <path v-for="i in 3" :key="i" :d="getPath(i)" class="fill-none stroke-slate-200 dark:stroke-slate-800 stroke-[3px] transition-all group-hover:stroke-primary/20" />
            <path :d="getPath(2)" class="fill-none stroke-primary/40 stroke-[4px] shadow-2xl" />
          </svg>
          
          <!-- Root -->
          <div class="absolute top-[160px] left-0">
            <div class="w-60 h-20 bg-slate-900 dark:bg-black rounded-xl shadow-2xl shadow-primary/10 border border-slate-700 flex items-center p-4 ring-4 ring-primary/5">
              <div class="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white mr-4">
                <span class="material-icons-round">dataset</span>
              </div>
              <div>
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 opacity-70">Root Project</p>
                <p class="text-xs font-black text-white tracking-tight">AtomGit-Premium-Core</p>
              </div>
            </div>
          </div>
          
          <!-- Children Nodes -->
          <div v-for="(node, idx) in nodes" :key="node.name" :class="['absolute w-64 h-20 bg-white dark:bg-surface-dark rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 flex items-center p-4 cursor-pointer hover:border-primary transition-all group/node ring-offset-4 ring-primary/0 hover:ring-2 ring-primary/20', node.position]">
            <div :class="['w-10 h-10 rounded-lg flex items-center justify-center mr-4 group-hover/node:scale-110 transition-transform shadow-sm', node.iconBg]">
              <span :class="['material-icons-round text-lg', node.iconColor]">{{ node.icon }}</span>
            </div>
            <div class="flex-1 overflow-hidden">
               <p class="text-xs font-black text-slate-900 dark:text-white tracking-tight truncate">{{ node.name }}</p>
               <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{{ node.version }}</p>
            </div>
            <div v-if="node.hasVuln" class="w-2 h-2 rounded-full bg-rose-500 animate-pulse ml-2 ring-4 ring-rose-500/20"></div>
          </div>
        </div>
      </div>

      <!-- Controls -->
      <div class="absolute bottom-6 left-6 flex flex-col gap-2">
        <div class="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-1">
          <button class="p-3 text-slate-400 hover:text-primary transition-colors"><span class="material-icons-round text-sm">add</span></button>
          <div class="h-px bg-slate-100 dark:bg-slate-700 mx-2"></div>
          <button class="p-3 text-slate-400 hover:text-primary transition-colors"><span class="material-icons-round text-sm">remove</span></button>
        </div>
        <button class="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-3 text-slate-400 hover:text-primary transition-all active:scale-90">
          <span class="material-icons-round text-sm">center_focus_strong</span>
        </button>
      </div>
    </div>

    <!-- Detail Drawer (Unified Style) -->
    <SbomDetailDrawer 
      :show="showDetailDrawer" 
      :component="selectedComponent || {}" 
      @close="showDetailDrawer = false"
      @open-projects="openProjectsModal(selectedComponent)"
    />

    <!-- Associated Projects Modal -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 pb-10"
      enter-to-class="opacity-100 pb-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 pb-0"
      leave-to-class="opacity-0 pb-10"
    >
      <div v-if="showProjectsModal" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-md" @click="showProjectsModal = false"></div>
        <div class="relative w-full max-w-md bg-white dark:bg-surface-dark rounded-xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-slate-800 overflow-hidden transform-gpu flex flex-col max-h-[70vh]">
          <!-- Modal Header -->
          <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
            <div>
              <h3 class="text-lg font-black text-slate-900 dark:text-white tracking-tight">关联项目列表</h3>
              <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Projects using this component</p>
            </div>
            <button @click="showProjectsModal = false" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
              <span class="material-icons-round text-lg">close</span>
            </button>
          </div>
          
          <!-- Modal Body -->
          <div class="p-4 overflow-y-auto custom-scrollbar space-y-2">
            <div v-for="p in selectedComponent.projects" :key="p.name" class="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl border border-transparent hover:border-slate-100 dark:hover:border-slate-700 flex items-center gap-4 group transition-all cursor-pointer">
              <div class="size-10 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:border-primary/20 transition-all">
                <span class="material-symbols-outlined text-xl">folder</span>
              </div>
              <div class="flex-1 overflow-hidden">
                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest opacity-70 truncate">{{ p.org }}</p>
                <p class="text-sm font-black text-slate-900 dark:text-white tracking-tight truncate">{{ p.name }}</p>
              </div>
              <span class="material-icons-round text-slate-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span>
            </div>
          </div>
          
          <!-- Modal Footer -->
          <div class="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shrink-0 flex gap-3">
            <button class="flex-1 py-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
              <span class="material-icons-round text-sm">download</span>
              导出列表
            </button>
            <button @click="showProjectsModal = false" class="flex-1 py-3 bg-slate-900 dark:bg-slate-700 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-slate-900/20 active:scale-95 transition-all">关闭窗口</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import ViewSelector from './ViewSelector.vue'
import SbomDetailDrawer from './SbomDetailDrawer.vue'

export default {
  name: 'SbomAnalysis',
  components: {
    ViewSelector,
    SbomDetailDrawer
  },
  props: {
    selectedView: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      viewMode: 'table',
      selectedComponent: null,
      showDetailDrawer: false,
      showProjectsModal: false,
      components: [
        { 
          name: 'fastjson', 
          packageName: 'com.alibaba:fastjson', 
          version: '1.2.68', 
          latestVersion: '1.2.83',
          license: 'Apache-2.0', 
          risk: 'Critical', 
          riskClass: 'bg-rose-500 text-white font-black',
          depth: 1,
          projectCount: 12,
          projects: [
            { org: 'Platform-Security', name: 'Identity-Service' },
            { org: 'Platform-Security', name: 'Access-Manager' },
            { org: 'AI-Ops-Center', name: 'Log-Insite' },
            { org: 'Core-Dev', name: 'Payment-Gateway' },
            { org: 'Mobile-SDK', name: 'iOS-Bridge-Native' },
            { org: 'Cloud-Infrastructure', name: 'Node-Provisoner' }
          ],
          icon: 'warning',
          avatarColor: 'bg-rose-500 shadow-rose-500/30',
          isOutdated: true,
          vulnerabilities: [
            { id: 'CVE-2022-25845', severity: 'High', score: 9.8, title: 'Deserialization of Untrusted Data via AutoType bypass' },
            { id: 'CVE-2020-11111', severity: 'High', score: 8.1, title: 'Deserialization of Untrusted Data' }
          ]
        },
        { 
          name: 'old-parser', 
          packageName: 'org.legacy:parser', 
          version: '0.9.1', 
          latestVersion: '1.2.0',
          license: 'GPL-3.0', 
          risk: 'High', 
          riskClass: 'bg-amber-500 text-white font-black',
          depth: 2,
          projectCount: 4,
          projects: [
            { org: 'Legacy-Systems', name: 'Old-Worker-Node' },
            { org: 'Legacy-Systems', name: 'Backup-Server' },
            { org: 'Platform-Archive', name: 'History-Loader' },
            { org: 'Tools', name: 'CSV-Converter' }
          ],
          icon: 'history',
          avatarColor: 'bg-amber-500 shadow-amber-500/30',
          isOutdated: true,
          vulnerabilities: [
            { id: 'CVE-2021-99999', severity: 'Medium', title: 'Buffer overflow in legacy parsing engine' }
          ]
        },
        { 
          name: 'lodash', 
          packageName: 'npm:lodash', 
          version: '4.17.21', 
          latestVersion: '4.17.21',
          license: 'MIT', 
          risk: 'Safe', 
          riskClass: 'bg-emerald-500 text-white font-black',
          depth: 1,
          projectCount: 42,
          projects: [
            { org: 'Main-App', name: 'Dashboard-UI' },
            { org: 'Main-App', name: 'Admin-Panel' },
            { org: 'Mobile', name: 'Android-App' },
            { org: 'Marketing', name: 'Campaign-Site' }
          ],
          icon: 'bolt',
          avatarColor: 'bg-emerald-500 shadow-emerald-500/30',
          isOutdated: false,
          vulnerabilities: []
        }
      ],
      nodes: [
        { name: 'spring-boot-starter', version: 'v2.7.5', icon: 'deployed_code', iconBg: 'bg-emerald-50 dark:bg-emerald-900/20', iconColor: 'text-emerald-500', position: 'top-[60px] left-[300px]', hasVuln: false },
        { name: 'fastjson', version: 'v1.2.68', icon: 'warning', iconBg: 'bg-rose-50 dark:bg-rose-900/20', iconColor: 'text-rose-500', position: 'top-[160px] left-[300px]', hasVuln: true },
        { name: 'lodash', version: 'v4.17.21', icon: 'bolt', iconBg: 'bg-emerald-50 dark:bg-emerald-900/20', iconColor: 'text-emerald-500', position: 'top-[260px] left-[300px]', hasVuln: false }
      ]
    }
  },
  methods: {
    openDetail(comp) {
      this.selectedComponent = comp
      this.showDetailDrawer = true
    },
    openProjectsModal(comp) {
      this.selectedComponent = comp
      this.showDetailDrawer = false
      this.showProjectsModal = true
    },
    getPath(i) {
      const paths = {
        1: 'M 120 200 C 200 200, 200 100, 300 100',
        2: 'M 120 200 C 200 200, 200 200, 300 200',
        3: 'M 120 200 C 200 200, 200 300, 300 300'
      }
      return paths[i]
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
  background: rgba(148, 163, 184, 0.15);
  border-radius: 0.75rem;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.3);
}
</style>
