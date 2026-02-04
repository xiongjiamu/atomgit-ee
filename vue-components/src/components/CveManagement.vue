<template>
  <div class="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <!-- View Selector & Title Header -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
      <div class="space-y-4">
        <div class="flex items-center gap-4">
          <ViewSelector :selected-view="internalSelectedView" @change="handleViewChange" />
          <div class="w-px h-8 bg-slate-200 dark:bg-slate-800"></div>
          <div>
            <h1 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight" style="margin-bottom: 0px;">漏洞管理 (CVE)</h1>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <div class="relative group">
          <span class="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="搜索 CVE ID 或相关组件..."
            class="pl-10 pr-4 py-2.5 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-primary focus:border-primary transition-all w-64 shadow-sm"
          />
        </div>
        <button class="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-black uppercase tracking-widest hover:border-primary/50 transition-all shadow-sm group">
          <span class="material-icons-round text-slate-400 group-hover:text-primary transition-colors">filter_list</span>
          筛选
        </button>
      </div>
    </div>

    <!-- Alert Banners -->
    <div class="space-y-3">
      <div class="bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl p-4 flex items-start group relative overflow-hidden">
        <div class="absolute -right-4 -top-4 w-24 h-24 bg-red-500/5 blur-2xl rounded-full"></div>
        <span class="material-icons-round text-red-500 text-lg mt-0.5 mr-3">report_problem</span>
        <div class="flex-1 text-sm text-red-800 dark:text-red-200 relative z-10">
          <span class="font-black mr-1 uppercase tracking-tighter">关键警报:</span> 
          检测到 <span class="font-black underline underline-offset-4 decoration-red-500/30">CVE-2023-44487</span> 影响了企业 12% 的核心项目，请优先处理。
        </div>
        <button class="text-red-400 hover:text-red-600 transition-colors relative z-10"><span class="material-icons-round">close</span></button>
      </div>
    </div>

    <!-- CVE List Table -->
    <div class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden group">
      <div class="px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-900/50">
        <h3 class="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">漏洞列表 · Scanning Result</h3>
        <div class="flex items-center gap-2">
          <span class="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-lg font-black tracking-widest uppercase">Live Scan</span>
          <span class="text-[10px] text-slate-300 font-bold ml-2">Total: 124 Results</span>
        </div>
      </div>
      <div class="overflow-x-auto custom-scrollbar">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 dark:border-slate-800">
              <th class="px-8 py-5">CVE ID · 漏洞编号</th>
              <th class="px-8 py-5">CWE · 漏洞类型</th>
              <th class="px-8 py-5">受影响组件 · Component</th>
              <th class="px-8 py-5">严重程度 · Severity</th>
              <th class="px-8 py-5">受影响项目 · Projects</th>
              <th class="px-8 py-5">检测状态 · Status</th>
              <th class="px-8 py-5 text-right">操作 · Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 dark:divide-slate-800">
            <tr v-for="cve in cveData" :key="cve.id" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors group/row cursor-pointer" @click="openDetail(cve)">
              <td class="px-8 py-6">
                <div class="flex flex-col">
                  <span class="text-sm font-black text-slate-900 dark:text-white group-hover/row:text-primary transition-colors tracking-tight">{{ cve.id }}</span>
                  <span class="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Scanned {{ cve.lastSeen }}</span>
                </div>
              </td>
              <td class="px-8 py-6">
                <span class="text-xs font-bold text-slate-600 dark:text-slate-400">{{ cve.type }}</span>
              </td>
              <td class="px-8 py-6">
                <div class="flex items-center gap-2 font-mono text-xs font-bold text-slate-500">
                  <span class="material-icons-round text-sm">inventory_2</span>
                  {{ cve.component }}
                </div>
              </td>
              <td class="px-8 py-6">
                <div :class="['inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black border', cve.severityClass]">
                  <span class="material-icons-round text-xs">{{ cve.severityIcon }}</span>
                  {{ cve.severityLabel }} ({{ cve.score }})
                </div>
              </td>
              <td class="px-8 py-6">
                <div class="flex items-center gap-2 group/link">
                  <div class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover/row:bg-primary/10 group-hover/row:text-primary transition-colors">
                    <span class="material-icons-round text-sm">reorder</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-xs font-black text-slate-700 dark:text-slate-300">{{ cve.projectCount }} 个项目</span>
                    <span class="text-[9px] text-primary font-bold uppercase tracking-widest hidden group-hover/row:block">查看清单</span>
                  </div>
                </div>
              </td>
              <td class="px-8 py-6">
                <div class="flex items-center gap-2">
                  <div :class="['w-1.5 h-1.5 rounded-full shadow-[0_0_8px]', cve.statusColor]"></div>
                  <span class="text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">{{ cve.status }}</span>
                </div>
              </td>
              <td class="px-8 py-6 text-right">
                <div class="flex items-center justify-end gap-2" @click.stop>
                  <button v-if="cve.score >= 7" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-lg hover:shadow-blue-500/20 transition-all shadow-sm">
                    <span class="material-icons-round text-xs">auto_awesome</span>
                    AI 修复建议
                  </button>
                  <button class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                    <span class="material-icons-round text-sm">more_vert</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- CVE Detail Drawer (Popup Animation) -->
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div v-if="showDetail && selectedCve" class="fixed inset-y-0 right-0 w-[800px] bg-white dark:bg-surface-dark shadow-high-end z-[150] border-l border-slate-100 dark:border-slate-800 flex flex-col pointer-events-auto overflow-hidden">
        <!-- Drawer Header -->
        <div class="px-10 py-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-start bg-slate-50/20 dark:bg-slate-900/20">
          <div class="space-y-2">
            <div class="flex items-center gap-3">
              <span class="w-2 h-8 bg-primary rounded-full"></span>
              <h2 class="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{{ selectedCve.id }}</h2>
              <span :class="['px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-[0.2em] ml-2', selectedCve.severityClass]">
                {{ selectedCve.severityLabel }}
              </span>
            </div>
            <div class="flex items-center gap-6 text-xs font-bold text-slate-400">
              <span class="flex items-center gap-1.5 uppercase tracking-widest">
                <span class="material-icons-round text-sm">event</span>
                Detected: {{ selectedCve.lastSeen }}
              </span>
              <span class="flex items-center gap-1.5 uppercase tracking-widest">
                <span class="material-icons-round text-sm">category</span>
                Type: {{ selectedCve.type }}
              </span>
            </div>
          </div>
          <button @click="showDetail = false" class="p-3 bg-white dark:bg-slate-800 rounded-2xl hover:text-primary transition-all border border-slate-100 dark:border-slate-700 shadow-sm">
            <span class="material-icons-round">close</span>
          </button>
        </div>

        <!-- Drawer Content -->
        <div class="flex-1 overflow-y-auto px-10 py-10 space-y-12 custom-scrollbar">
          <!-- Summary Section -->
          <section class="space-y-8">
            <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">漏洞摘要 · Summary</h3>
            
            <div class="space-y-6">
              <!-- Name & Intro -->
              <div class="grid grid-cols-1 gap-6">
                <div>
                  <h4 class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">漏洞名称 · Vulnerability Name</h4>
                  <p class="text-base font-black text-slate-900 dark:text-white leading-tight underline decoration-primary/20 underline-offset-4">
                    {{ selectedCve.name || 'Rapid Reset: HTTP/2 Stream Multiplexing Resource Exhaustion' }}
                  </p>
                </div>
                <div>
                  <h4 class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">详情简介 · Description</h4>
                  <p class="text-sm leading-relaxed text-slate-600 dark:text-slate-300 font-medium bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                    {{ selectedCve.fullDescription || '该漏洞利用了 HTTP/2 协议中的流复用机制。攻击者可以通过发送大量的 RST_STREAM 帧来快速重置流，从而在不建立完整连接的情况下消耗服务器端的大量 CPU 和内存资源。这种“快速重置”攻击比传统的 DDoS 攻击效率更高。' }}
                  </p>
                </div>
              </div>

              <!-- Associated & Links -->
              <div class="grid grid-cols-2 gap-8 pt-4">
                <div>
                  <h4 class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span class="material-icons-round text-xs">link</span>
                    关联漏洞编号 · Ref IDs
                  </h4>
                  <div class="flex flex-wrap gap-2">
                    <span v-for="ref in (selectedCve.associatedCves || ['GHSA-m425-mqhc-4p43'])" :key="ref" class="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-[10px] font-mono font-black text-slate-500 rounded-lg">
                      {{ ref }}
                    </span>
                  </div>
                </div>
                <div>
                  <h4 class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span class="material-icons-round text-xs">launch</span>
                    额外参考信息 · External Links
                  </h4>
                  <div class="flex flex-col gap-2">
                    <a v-for="link in (selectedCve.externalLinks || [{label: 'Official Advisory', url: '#'}])" :key="link.label" :href="link.url" target="_blank" class="text-[11px] font-bold text-primary hover:underline flex items-center gap-1">
                      {{ link.label }}
                      <span class="material-icons-round text-[10px]">open_in_new</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <!-- Affected Component Card -->
            <div class="grid grid-cols-2 gap-4 mt-6">
              <div class="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 group hover:border-primary/20 transition-all">
                <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Affected Component</span>
                <span class="text-sm font-black text-slate-900 dark:text-white font-mono">{{ selectedCve.component }}</span>
              </div>
              <div class="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 group hover:border-primary/20 transition-all">
                <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Fix Version Target</span>
                <span class="text-sm font-black text-emerald-500 uppercase">>= v2.3.4 (Next Release)</span>
              </div>
            </div>
          </section>

          <!-- Severity Details -->
          <section class="space-y-6">
            <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">危害评估 · Severity Assessment</h3>
            <div class="grid grid-cols-4 gap-4">
              <div v-for="metric in selectedCve.vectorMetrics" :key="metric.label" class="flex flex-col gap-2 p-5 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-center shadow-sm">
                <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">{{ metric.label }}</span>
                <span :class="['text-sm font-black uppercase tracking-tight', metric.color]">{{ metric.value }}</span>
              </div>
            </div>
            <!-- CVSS Scale -->
            <div class="p-6 bg-slate-900 dark:bg-black rounded-3xl relative overflow-hidden group">
              <div class="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-primary/10 to-transparent"></div>
              <div class="flex items-center justify-between relative z-10">
                <div>
                  <h4 class="text-lg font-black text-white tracking-tighter">CVSS 3.1 Base Score</h4>
                  <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Vector: AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H</p>
                </div>
                <div class="flex items-center gap-4">
                  <span class="text-5xl font-black text-white tracking-tighter">{{ selectedCve.score }}</span>
                  <div class="w-px h-12 bg-white/20"></div>
                  <span class="text-xl font-black uppercase tracking-widest text-primary">{{ selectedCve.severityLabel }}</span>
                </div>
              </div>
            </div>
          </section>

          <!-- Affected Projects List -->
          <section class="space-y-6 pb-10">
            <div class="flex items-center justify-between">
              <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">关联受影响项目 · Impacted Assets</h3>
              <div class="flex items-center gap-4">
                <span class="text-[10px] font-bold text-slate-400">Showing {{ impactProjects.length }} Critical Projects</span>
                <button @click="showProjectsModal = true" class="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1 transition-all">
                  查看全部
                  <span class="material-icons-round text-sm">open_in_new</span>
                </button>
              </div>
            </div>
            <div class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
               <table class="w-full text-left text-sm">
                 <thead class="bg-slate-50 dark:bg-slate-900/50 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                   <tr>
                     <th class="px-6 py-4">Project Repository</th>
                     <th class="px-6 py-4">Scan Build</th>
                     <th class="px-6 py-4 text-right">Action</th>
                   </tr>
                 </thead>
                 <tbody class="divide-y divide-slate-50 dark:divide-slate-800">
                   <tr v-for="proj in impactProjects" :key="proj.name" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group/proj">
                     <td class="px-6 py-4">
                       <div class="flex items-center gap-3">
                         <div class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover/proj:text-primary transition-colors">
                           <span class="material-icons-round text-sm">folder_open</span>
                         </div>
                         <span class="text-sm font-black text-slate-900 dark:text-white group-hover/proj:text-primary transition-colors">{{ proj.name }}</span>
                       </div>
                     </td>
                     <td class="px-6 py-4 font-bold text-xs text-slate-400">{{ proj.build }}</td>
                     <td class="px-6 py-4 text-right">
                       <button class="text-xs font-black text-primary uppercase tracking-widest hover:underline">Inspect</button>
                     </td>
                   </tr>
                 </tbody>
               </table>
            </div>
          </section>
        </div>

        <!-- Drawer Footer -->
        <div class="px-10 py-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
          <div class="flex gap-4">
            <button class="px-6 py-3 bg-slate-900 dark:bg-slate-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-xl shadow-slate-900/20 active:scale-95 transition-all">导出完整报告</button>
            <button class="px-6 py-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 active:scale-95 transition-all shadow-sm">忽略漏洞</button>
          </div>
          <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">GitCode Premium Security Agent</p>
        </div>
      </div>
    </transition>

    <!-- Drawer Backdrop -->
    <div v-if="showDetail" class="fixed inset-0 bg-slate-900/20 dark:bg-black/60 backdrop-blur-sm z-[140]" @click="showDetail = false"></div>

    <!-- Projects Full List Modal (Same as SBOM) -->
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="showProjectsModal" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-md" @click="showProjectsModal = false"></div>
        <div class="relative w-full max-w-md bg-white dark:bg-surface-dark rounded-3xl shadow-high-end border border-slate-200 dark:border-slate-800 overflow-hidden transform-gpu flex flex-col max-h-[70vh]">
          <!-- Modal Header -->
          <div class="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/30 dark:bg-slate-900/30">
            <div>
              <h3 class="text-xl font-black text-slate-900 dark:text-white tracking-tight">全部关联项目清单</h3>
              <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Full Impact Assessment for {{ selectedCve.id }}</p>
            </div>
            <button @click="showProjectsModal = false" class="w-10 h-10 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400 hover:text-primary transition-all shadow-sm">
              <span class="material-icons-round text-lg">close</span>
            </button>
          </div>
          
          <!-- Modal Body -->
          <div class="p-6 overflow-y-auto custom-scrollbar space-y-3">
             <div v-for="p in impactProjects" :key="p.name" class="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl border border-transparent hover:border-slate-100 dark:hover:border-slate-700 flex items-center gap-4 group transition-all cursor-pointer">
              <div class="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:border-primary/20 transition-all">
                <span class="material-icons-round text-xl">folder</span>
              </div>
              <div class="flex-1 overflow-hidden">
                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest opacity-70 truncate">{{ p.org || 'GitCode Solution' }}</p>
                <p class="text-sm font-black text-slate-900 dark:text-white tracking-tight truncate">{{ p.name.split('/').pop().trim() }}</p>
              </div>
              <span class="material-icons-round text-slate-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span>
            </div>
          </div>
          
          <!-- Modal Footer -->
          <div class="p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shrink-0 flex gap-4">
            <button class="flex-1 py-4 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-sm">
              <span class="material-icons-round text-sm">download</span>
              导出 CSV 清单
            </button>
            <button @click="showProjectsModal = false" class="flex-1 py-4 bg-slate-900 dark:bg-slate-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-slate-900/20 active:scale-95 transition-all">确认关闭</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import ViewSelector from './ViewSelector.vue'

export default {
  name: 'CveManagement',
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
      showDetail: false,
      showProjectsModal: false,
      selectedCve: null,
      searchQuery: '',
      internalSelectedView: this.selectedView || { id: 'enterprise', label: '全企业视图 (Enterprise)', orgId: 'enterprise' },
      cveData: [
        {
          id: 'CVE-2023-44487',
          type: 'CWE-400',
          component: 'http-server@14.1.1',
          score: 9.8,
          severityLabel: 'CRITICAL',
          severityIcon: 'error',
          severityClass: 'bg-red-500/10 text-red-500 border-red-500/20',
          projectCount: 4,
          status: 'Exploitable',
          statusColor: 'bg-red-500 shadow-red-500/40',
          lastSeen: '2 hours ago',
          name: 'HTTP/2 "Rapid Reset" Attack',
          fullDescription: '该漏洞利用了 HTTP/2 协议中的流复用机制。攻击者可以通过发送大量的 RST_STREAM 帧来快速重置流，从而在不建立完整连接的情况下消耗服务器端的大量 CPU 和内存资源。',
          associatedCves: ['CVE-2023-44487', 'GHSA-m425-mqhc-4p43'],
          externalLinks: [
            { label: 'Google Security Blog', url: 'https://security.googleblog.com' },
            { label: 'Cloudflare Technical Analysis', url: 'https://blog.cloudflare.com' },
            { label: 'NVD Details', url: 'https://nvd.nist.gov' }
          ],
          vectorMetrics: [
            { label: 'Attack Vector', value: 'Network', color: 'text-red-500' },
            { label: 'Complexity', value: 'Low', color: 'text-emerald-500' },
            { label: 'Privileges', value: 'None', color: 'text-emerald-500' },
            { label: 'Interaction', value: 'None', color: 'text-emerald-500' }
          ]
        },
        {
          id: 'CVE-2023-30533',
          type: 'CWE-79',
          component: 'lodash@4.17.21',
          score: 7.5,
          severityLabel: 'HIGH',
          severityIcon: 'warning',
          severityClass: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
          projectCount: 12,
          status: 'Under Review',
          statusColor: 'bg-amber-500 shadow-amber-500/40',
          lastSeen: '1 day ago',
          vectorMetrics: [
            { label: 'Attack Vector', value: 'Network', color: 'text-red-500' },
            { label: 'Complexity', value: 'High', color: 'text-amber-500' },
            { label: 'Privileges', value: 'None', color: 'text-emerald-500' },
            { label: 'Interaction', value: 'Required', color: 'text-amber-500' }
          ]
        },
        {
          id: 'CVE-2024-22872',
          type: 'CWE-20',
          component: 'golang.org/x/net',
          score: 6.5,
          severityLabel: 'MEDIUM',
          severityIcon: 'info',
          severityClass: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
          projectCount: 1,
          status: 'Resolved',
          statusColor: 'bg-emerald-500 shadow-emerald-500/40',
          lastSeen: 'Feb 4, 2026',
          vectorMetrics: [
            { label: 'Attack Vector', value: 'Network', color: 'text-red-500' },
            { label: 'Complexity', value: 'High', color: 'text-amber-500' },
            { label: 'Privileges', value: 'None', color: 'text-emerald-500' },
            { label: 'Interaction', value: 'None', color: 'text-emerald-500' }
          ]
        }
      ],
      impactProjects: [
        { name: 'GitCode-Solution / premium-core', build: 'Build #921324' },
        { name: 'GitCode-Solution / cloud-compute', build: 'Build #921320' },
        { name: 'Infrastructure / sso-manager', build: 'Build #921318' },
        { name: 'AI-Ops / data-lake-connector', build: 'Build #921315' }
      ]
    }
  },
  methods: {
    handleViewChange(view) {
      this.internalSelectedView = view
      this.$emit('view-change', view)
    },
    openDetail(cve) {
      this.selectedCve = cve
      this.showDetail = true
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
.shadow-high-end {
  box-shadow: -20px 0 50px -12px rgba(0, 0, 0, 0.15);
}
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
