<template>
  <div class="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <!-- View Selector & Title Header -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
      <div class="space-y-4">
        <div class="flex items-center gap-4">
          <ViewSelector :selected-view="selectedView" @change="$emit('view-change', $event)" />
          <div class="w-px h-8 bg-slate-200 dark:bg-slate-800"></div>
          <h1 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight" style="margin-bottom:0">软件成分分析 (SBOM)</h1>
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
      <AlertBanner
        v-model="showAssetAlert"
        type="warning"
        title="资产预警"
        icon="info"
      >
        当前扫描结果中包含 <span class="text-rose-500 font-black underline underline-offset-4">GPL-3.0</span> 等强传染性开源协议，可能对企业核心商业逻辑产生合规影响。
      </AlertBanner>
    </div>

    <!-- Main Content Area -->
    <div v-if="viewMode === 'table'" class="space-y-6">
      <!-- Search & Filter Bar -->
      <div class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 shadow-sm flex flex-col md:flex-row gap-3 items-center">
        <div class="relative flex-1 group w-full">
          <span class="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
          <input 
            type="text" 
            class="w-full pl-12 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all placeholder-slate-400"
            placeholder="搜索组件名称 (如 fastjson), 许可证, 或版本号..."
          />
        </div>
        <button class="px-5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2">
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
    <div 
      v-else 
      ref="canvasContainer"
      class="flex-1 min-h-[700px] relative bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden group shadow-inner cursor-grab active:cursor-grabbing"
      @mousedown="startPan"
      @mousemove="handleGlobalMove"
      @mouseup="handleGlobalUp"
      @mouseleave="handleGlobalUp"
      @wheel="handleWheel"
    >
      <!-- Infinite Canvas Grid Background -->
      <div 
        class="absolute inset-0 pointer-events-none"
        :style="{ 
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          color: 'rgba(148, 163, 184, 0.1)',
          transform: `translate(${canvasX}px, ${canvasY}px) scale(${canvasZoom})`,
          transformOrigin: '0 0',
          transition: isAnimating ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
        }"
      ></div>
      
      <!-- Transformable Content Area -->
      <div 
        ref="canvasContent"
        class="absolute inset-0 pointer-events-auto"
        :style="{ 
          transform: `translate(${canvasX}px, ${canvasY}px) scale(${canvasZoom})`,
          transformOrigin: '0 0',
          transition: isAnimating ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
        }"
      >
        <div class="relative w-full h-full">
          <svg class="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
            <defs>
              <linearGradient id="linkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="currentColor" stop-opacity="0.2" />
                <stop offset="100%" stop-color="currentColor" stop-opacity="0.5" />
              </linearGradient>
            </defs>
            <path 
              v-for="(link, idx) in visibleLinks" 
              :key="`link-${idx}`" 
              :d="generatePath(link.source, link.target)" 
              class="fill-none stroke-slate-300 dark:stroke-slate-700 stroke-[2.5px] transition-all duration-300 hover:stroke-primary/40"
            />
          </svg>
          
          <!-- Root Node -->
          <div 
            class="absolute select-none"
            :style="{ 
              top: rootNode.y + (rootNode.offsetY || 0) + 'px', 
              left: rootNode.x + (rootNode.offsetX || 0) + 'px',
              transition: isDragging ? 'none' : 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }"
            @mousedown.stop="startNodeDrag($event, 'root')"
            @mouseup.stop="handleNodeClick($event, rootNode)"
          >
            <div class="w-60 h-20 bg-slate-900 dark:bg-black rounded-xl shadow-2xl border border-slate-700 flex items-center p-4 ring-4 ring-primary/5 cursor-move active:scale-[0.98] transition-transform">
              <div class="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white mr-4">
                <span class="material-icons-round">dataset</span>
              </div>
              <div>
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 opacity-70">Root Project</p>
                <p class="text-xs font-black text-white tracking-tight">{{ rootNode.name }}</p>
              </div>
            </div>
          </div>
          
          <!-- Children & Sub-children Nodes -->
          <div 
            v-for="node in visibleNodes" 
            :key="node.id" 
            class="absolute select-none"
            :style="{ 
              top: node.y  + 'px', 
              left: node.x + 'px',
              transition: (isDragging && draggedNodeId === node.id) ? 'none' : 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }"
            @mousedown.stop="startNodeDrag($event, node.id)"
            @mouseup.stop="handleNodeClick($event, node)"
          >
            <div 
              :class="[
                'w-64 h-20 bg-white dark:bg-surface-dark rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 flex items-center p-4 cursor-move hover:border-primary transition-all group/node ring-offset-4 hover:ring-2 ring-primary/20 active:scale-[0.98]',
                node.isExpanded ? 'border-primary ring-2 ring-primary/10' : '',
                (isDragging && draggedNodeId === node.id) ? 'opacity-80 scale-105 z-50' : ''
              ]"
            >
              <div :class="['w-10 h-10 rounded-lg flex items-center justify-center mr-4 group-hover/node:scale-110 transition-transform shadow-sm', node.iconBg]">
                <span :class="['material-icons-round text-lg', node.iconColor]">{{ node.icon }}</span>
              </div>
              <div class="flex-1 overflow-hidden">
                 <p class="text-xs font-black text-slate-900 dark:text-white tracking-tight truncate">{{ node.name }}</p>
                 <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{{ node.version }}</p>
              </div>
              <div class="flex items-center gap-2">
                <div v-if="node.hasVuln" class="w-2 h-2 rounded-full bg-rose-500 animate-pulse ring-4 ring-rose-500/20"></div>
                <div 
                  v-if="node.children && node.children.length > 0" 
                  class="text-slate-400 hover:text-primary p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors pointer-events-auto"
                  @click.stop="toggleNode(node)"
                  @mousedown.stop
                  @mouseup.stop
                >
                  <span class="material-icons-round text-lg transition-transform duration-300" :class="{ 'rotate-180': node.isExpanded }">
                    {{ node.isExpanded ? 'remove_circle_outline' : 'add_circle_outline' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Controls -->
      <div class="absolute bottom-6 left-6 flex flex-col gap-2">
        <div class="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-1">
          <button @click="zoomIn" class="p-3 text-slate-400 hover:text-primary transition-colors"><span class="material-icons-round text-sm">add</span></button>
          <div class="h-px bg-slate-100 dark:bg-slate-700 mx-2"></div>
          <button @click="zoomOut" class="p-3 text-slate-400 hover:text-primary transition-colors"><span class="material-icons-round text-sm">remove</span></button>
        </div>
        <button 
          @click="fitView"
          class="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-3 text-slate-400 hover:text-primary transition-all active:scale-90"
        >
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
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-md" @click="showProjectsModal = false"></div>
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
import AlertBanner from './AlertBanner.vue'

export default {
  name: 'SbomAnalysis',
  components: {
    ViewSelector,
    SbomDetailDrawer,
    AlertBanner
  },
  props: {
    selectedView: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showAssetAlert: true,
      viewMode: 'table',
      selectedComponent: null,
      showDetailDrawer: false,
      showProjectsModal: false,
      // Canvas States
      canvasX: 200,
      canvasY: 150,
      canvasZoom: 0.9,
      isPanning: false,
      panStartX: 0,
      panStartY: 0,
      // Node Dragging States
      isDragging: false,
      draggedNodeId: null,
      dragStartX: 0,
      dragStartY: 0,
      initialOffsetX: 0,
      initialOffsetY: 0,
      dragThreshold: 5,
      hasMovedSignificant: false,
      isAnimating: false,
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
      rootNode: {
        id: 'root',
        name: 'AtomGit-Enterprise-Core',
        x: 0,
        y: 200,
        offsetX: 0,
        offsetY: 0,
        children: ['spring-boot-web', 'fastjson', 'lodash']
      },
      treeData: {
        'spring-boot-web': {
          id: 'spring-boot-web',
          name: 'spring-boot-starter-web', 
          version: 'v2.7.5', 
          icon: 'vignette', 
          iconBg: 'bg-emerald-50 dark:bg-emerald-900/20', 
          iconColor: 'text-emerald-500',
          hasVuln: false,
          isExpanded: true,
          offsetX: 0,
          offsetY: 0,
          children: ['spring-boot-json', 'tomcat-embed']
        },
        'spring-boot-json': {
          id: 'spring-boot-json',
          name: 'spring-boot-starter-json', 
          version: 'v2.7.5', 
          icon: 'data_object', 
          iconBg: 'bg-blue-50 dark:bg-blue-900/20', 
          iconColor: 'text-blue-500',
          isExpanded: true,
          children: ['jackson-databind']
        },
        'jackson-databind': {
          id: 'jackson-databind',
          name: 'jackson-databind',
          version: 'v2.13.4',
          icon: 'schema',
          iconBg: 'bg-indigo-50 dark:bg-indigo-900/20',
          iconColor: 'text-indigo-500',
          isExpanded: true,
          children: ['jackson-core', 'jackson-annotations']
        },
        'jackson-core': {
          id: 'jackson-core',
          name: 'jackson-core',
          version: 'v2.13.4',
          icon: 'memory',
          iconBg: 'bg-slate-100 dark:bg-slate-800',
          iconColor: 'text-slate-500',
          isExpanded: true,
          children: ['jackson-parent']
        },
        'jackson-parent': {
          id: 'jackson-parent',
          name: 'jackson-parent',
          version: 'v2.13',
          icon: 'account_tree',
          iconBg: 'bg-slate-100 dark:bg-slate-800',
          iconColor: 'text-slate-400',
          isExpanded: false,
          children: ['oss-parent']
        },
        'oss-parent': {
          id: 'oss-parent',
          name: 'oss-parent',
          version: 'v9',
          icon: 'hub',
          iconBg: 'bg-slate-50 dark:bg-slate-900',
          iconColor: 'text-slate-400',
          isExpanded: false
        },
        'fastjson': {
          id: 'fastjson',
          name: 'fastjson', 
          version: 'v1.2.68', 
          icon: 'warning', 
          iconBg: 'bg-rose-50 dark:bg-rose-900/20', 
          iconColor: 'text-rose-500',
          hasVuln: true,
          isExpanded: false,
          children: ['commons-lang']
        },
        'lodash': {
          id: 'lodash',
          name: 'lodash', 
          version: 'v4.17.21', 
          icon: 'bolt', 
          iconBg: 'bg-emerald-50 dark:bg-emerald-900/20', 
          iconColor: 'text-emerald-500',
          hasVuln: false,
          isExpanded: false,
          offsetX: 0,
          offsetY: 0
        },
        'tomcat-embed': {
          id: 'tomcat-embed',
          name: 'tomcat-embed-core',
          version: 'v9.0.68',
          icon: 'settings_input_component',
          iconBg: 'bg-slate-100 dark:bg-slate-800',
          iconColor: 'text-slate-500',
          hasVuln: false,
          children: ['tomcat-annotations-api']
        },
        'tomcat-annotations-api': {
          id: 'tomcat-annotations-api',
          name: 'tomcat-annotations-api',
          version: 'v9.0.68',
          icon: 'api',
          iconBg: 'bg-slate-100 dark:bg-slate-800',
          iconColor: 'text-slate-400'
        },
        'commons-lang': {
          id: 'commons-lang',
          name: 'commons-lang3',
          version: 'v3.12.0',
          icon: 'extension',
          iconBg: 'bg-indigo-50 dark:bg-indigo-900/20',
          iconColor: 'text-indigo-500',
          hasVuln: false,
          children: ['commons-parent']
        },
        'commons-parent': {
          id: 'commons-parent',
          name: 'commons-parent',
          version: 'v52',
          icon: 'inventory',
          iconBg: 'bg-slate-100 dark:bg-slate-800',
          iconColor: 'text-slate-400',
          children: ['apache-rat']
        },
        'apache-rat': {
          id: 'apache-rat',
          name: 'apache-rat-plugin',
          version: 'v0.13',
          icon: 'shield',
          iconBg: 'bg-slate-100 dark:bg-slate-800',
          iconColor: 'text-slate-400'
        }
      }
    }
  },
  computed: {
    visibleNodes() {
      const result = []
      
      const processNode = (nodeId, depth, verticalOffset, parentX, parentY) => {
        const node = this.treeData[nodeId]
        if (!node) return 0
        
        const x = (300 * depth) + (node.offsetX || 0)
        const y = parentY + verticalOffset + (node.offsetY || 0)
        
        const newNode = { ...node, x, y }
        result.push(newNode)
        
        if (node.isExpanded && node.children) {
          const childStep = 100
          const startOffset = -((node.children.length - 1) * childStep) / 2
          
          node.children.forEach((childId, index) => {
            processNode(childId, depth + 1, startOffset + (index * childStep), x, y)
          })
        }
      }
      
      const rootX = 0 + (this.rootNode.offsetX || 0)
      const rootY = 200 + (this.rootNode.offsetY || 0)
      const childStep = 120
      const startOffset = -((this.rootNode.children.length - 1) * childStep) / 2
      
      this.rootNode.children.forEach((childId, index) => {
        processNode(childId, 1, startOffset + (index * childStep), rootX, rootY)
      })
      
      return result
    },
    visibleLinks() {
      const links = []
      const nodes = this.visibleNodes
      
      const rootX = this.rootNode.x + (this.rootNode.offsetX || 0)
      const rootY = this.rootNode.y + (this.rootNode.offsetY || 0)
      this.rootNode.children.forEach(childId => {
        const targetNode = nodes.find(n => n.id === childId)
        if (targetNode) {
          links.push({ source: { x: rootX, y: rootY }, target: { x: targetNode.x, y: targetNode.y } })
        }
      })
      
      nodes.forEach(node => {
        if (node.isExpanded && node.children) {
          node.children.forEach(childId => {
            const targetNode = nodes.find(n => n.id === childId)
            if (targetNode) {
              links.push({ source: { x: node.x, y: node.y }, target: { x: targetNode.x, y: targetNode.y } })
            }
          })
        }
      })
      
      return links
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
    toggleNode(node) {
      if (node.children && node.children.length > 0) {
        this.treeData[node.id].isExpanded = !this.treeData[node.id].isExpanded
      }
    },
    generatePath(source, target) {
      const startX = source.x + 240
      const startY = source.y + 40
      const endX = target.x
      const endY = target.y + 40
      const cp1x = startX + (endX - startX) * 0.5
      const cp2x = startX + (endX - startX) * 0.5
      return `M ${startX} ${startY} C ${cp1x} ${startY}, ${cp2x} ${endY}, ${endX} ${endY}`
    },
    startPan(event) {
      if (event.target !== event.currentTarget) return 
      this.isPanning = true
      this.panStartX = event.clientX - this.canvasX
      this.panStartY = event.clientY - this.canvasY
    },
    handleWheel(event) {
      event.preventDefault()
      const zoomSpeed = 0.001
      const delta = -event.deltaY
      const newZoom = Math.min(Math.max(0.5, this.canvasZoom + delta * zoomSpeed), 2)
      this.canvasZoom = newZoom
    },
    startNodeDrag(event, nodeId) {
      this.isDragging = true
      this.draggedNodeId = nodeId
      this.dragStartX = event.clientX
      this.dragStartY = event.clientY
      this.hasMovedSignificant = false
      const node = nodeId === 'root' ? this.rootNode : this.treeData[nodeId]
      this.initialOffsetX = node.offsetX || 0
      this.initialOffsetY = node.offsetY || 0
    },
    handleGlobalMove(event) {
      if (this.isPanning) {
        this.canvasX = event.clientX - this.panStartX
        this.canvasY = event.clientY - this.panStartY
        return
      }
      if (this.isDragging) {
        const dx = (event.clientX - this.dragStartX) / this.canvasZoom
        const dy = (event.clientY - this.dragStartY) / this.canvasZoom
        if (Math.abs(dx) > this.dragThreshold || Math.abs(dy) > this.dragThreshold) {
          this.hasMovedSignificant = true
        }
        const node = this.draggedNodeId === 'root' ? this.rootNode : this.treeData[this.draggedNodeId]
        node.offsetX = this.initialOffsetX + dx
        node.offsetY = this.initialOffsetY + dy
      }
    },
    handleGlobalUp() {
      this.isPanning = false
      this.isDragging = false
      this.draggedNodeId = null
    },
    handleNodeClick(event, node) {
      if (!this.hasMovedSignificant) {
        this.openDetail(node)
      }
      this.isDragging = false
      this.draggedNodeId = null
    },
    zoomIn() {
      this.isAnimating = true
      const newZoom = Math.min(this.canvasZoom + 0.2, 2)
      this.canvasZoom = newZoom
      setTimeout(() => { this.isAnimating = false }, 500)
    },
    zoomOut() {
      this.isAnimating = true
      const newZoom = Math.max(this.canvasZoom - 0.2, 0.5)
      this.canvasZoom = newZoom
      setTimeout(() => { this.isAnimating = false }, 500)
    },
    fitView() {
      if (!this.visibleNodes.length) return
      
      this.isAnimating = true
      
      // Calculate Bounding Box of all nodes
      const nodes = [
        { x: this.rootNode.x + (this.rootNode.offsetX || 0), y: this.rootNode.y + (this.rootNode.offsetY || 0), w: 240, h: 80 },
        ...this.visibleNodes.map(n => ({ x: n.x, y: n.y, w: 256, h: 80 }))
      ]
      
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
      nodes.forEach(n => {
        minX = Math.min(minX, n.x); minY = Math.min(minY, n.y)
        maxX = Math.max(maxX, n.x + n.w); maxY = Math.max(maxY, n.y + n.h)
      })
      
      const padding = 60
      const contentWidth = maxX - minX + padding * 2
      const contentHeight = maxY - minY + padding * 2
      
      const container = this.$refs.canvasContainer
      const containerWidth = container.clientWidth
      const containerHeight = container.clientHeight
      
      // Calculate best zoom
      const zoomX = containerWidth / contentWidth
      const zoomY = containerHeight / contentHeight
      const newZoom = Math.min(Math.min(zoomX, zoomY), 1.2) // Cap zoom at 1.2
      
      this.canvasZoom = newZoom
      
      // Calculate center position
      this.canvasX = (containerWidth - (maxX + minX) * newZoom) / 2
      this.canvasY = (containerHeight - (maxY + minY) * newZoom) / 2
      
      setTimeout(() => {
        this.isAnimating = false
      }, 500)
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
