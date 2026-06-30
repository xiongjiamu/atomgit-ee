<template>
  <div class="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <!-- Header -->
    <div class="flex items-center justify-between px-2">
      <div>
        <h1 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">开发环境镜像管理</h1>
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">CANNLab Container Image Management</p>
      </div>
      <button
        class="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-lg active:scale-95 flex items-center gap-2"
        @click="handleAdd"
      >
        <span class="material-icons-round text-lg">add</span>
        新增镜像
      </button>
    </div>

    <!-- Info Note -->
    <div class="flex items-start gap-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/40 rounded-xl px-4 py-3">
      <span class="material-icons-round text-blue-500 text-lg mt-0.5">info</span>
      <p class="text-xs leading-relaxed text-blue-800 dark:text-blue-200">
        面向已入库镜像提供运营维护：管理员可补充元数据、触发安全扫描并完成上下架。镜像上架后可被模板引用；已上架镜像不允许修改关键元数据（如需调整需先下架或创建新版本）；存在阻断风险时不可上架；仍被已上架模板引用的镜像不可直接删除。
      </p>
    </div>

    <!-- Main Content -->
    <div class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
      <!-- Toolbar -->
      <div class="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div class="relative w-full lg:w-80">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <span class="material-icons-round text-lg">search</span>
          </span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索镜像名称 / 地址 / 标签..."
            class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <select v-model="archFilter" class="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-2 px-3 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option value="all">全部架构</option>
            <option value="arm">ARM（鲲鹏）</option>
            <option value="x86">x86</option>
          </select>
          <select v-model="scanFilter" class="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-2 px-3 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option value="all">全部扫描状态</option>
            <option value="passed">扫描通过</option>
            <option value="scanning">扫描中</option>
            <option value="failed">扫描失败</option>
            <option value="blocked">高危阻断</option>
            <option value="pending">未扫描</option>
          </select>
          <div class="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-lg">
            <button
              v-for="f in filters"
              :key="f.value"
              @click="currentFilter = f.value"
              class="px-4 py-1.5 text-xs font-black rounded-md transition-all whitespace-nowrap"
              :class="currentFilter === f.value ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'"
            >{{ f.label }}</button>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto custom-scrollbar">
        <table class="w-full text-left border-collapse min-w-[1320px]">
          <thead>
            <tr class="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100 dark:border-slate-800 whitespace-nowrap">
              <th class="px-3 py-4 text-center">序号</th>
              <th class="px-3 py-4">镜像名称 / 地址</th>
              <th class="px-3 py-4">CANN 版本</th>
              <th class="px-3 py-4">架构</th>
              <th class="px-3 py-4">扫描状态</th>
              <th class="px-3 py-4">上架状态</th>
              <th class="px-3 py-4">引用模板</th>
              <th class="px-3 py-4">更新时间</th>
              <th class="px-3 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr v-for="(img, index) in filteredImages" :key="img.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
              <td class="px-3 py-4 text-center text-sm text-slate-500 dark:text-slate-400">{{ index + 1 }}</td>
              <td class="px-3 py-4">
                <div class="font-bold text-slate-900 dark:text-white text-sm whitespace-nowrap">{{ img.name }}</div>
                <div class="text-xs font-mono text-slate-400 truncate max-w-[220px]" :title="img.address">{{ img.address }}</div>
              </td>
              <td class="px-3 py-4 text-xs text-slate-600 dark:text-slate-300 whitespace-nowrap">{{ img.cannVersion }}</td>
              <td class="px-3 py-4">
                <span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold" :class="img.arch === 'arm' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'">{{ img.arch === 'arm' ? 'ARM' : 'x86' }}</span>
              </td>
              <td class="px-3 py-4">
                <span class="inline-flex items-center gap-1.5 text-xs font-bold whitespace-nowrap" :class="scanMeta(img.scan).text">
                  <span class="material-icons-round text-sm" v-if="img.scan === 'scanning'">autorenew</span>
                  <span v-else class="h-2 w-2 rounded-full" :class="scanMeta(img.scan).dot"></span>
                  {{ scanMeta(img.scan).label }}
                </span>
              </td>
              <td class="px-3 py-4">
                <span class="inline-flex items-center gap-1.5 text-xs font-bold whitespace-nowrap" :class="publishMeta(img.published).text">
                  <span class="h-2 w-2 rounded-full" :class="publishMeta(img.published).dot"></span>
                  {{ publishMeta(img.published).label }}
                </span>
              </td>
              <td class="px-3 py-4">
                <button class="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline" @click="openRefs(img)">
                  <span class="material-icons-round text-sm">link</span>{{ img.refs }} 个
                </button>
              </td>
              <td class="px-3 py-4 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{{ img.updatedAt }}</td>
              <td class="px-3 py-4 text-right whitespace-nowrap">
                <div class="flex items-center justify-end gap-3">
                  <button class="text-xs font-bold text-primary hover:underline" @click="handleEdit(img)">编辑</button>
                  <button
                    v-if="img.scan !== 'passed' && img.scan !== 'blocked'"
                    class="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline"
                    @click="handleScan(img)"
                  >扫描</button>
                  <span v-else-if="img.scan === 'scanning'" class="text-xs font-bold text-slate-300">扫描中</span>
                  <button
                    v-if="!img.published && img.scan === 'passed'"
                    class="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                    @click="handlePublish(img)"
                  >上架</button>
                  <button
                    v-if="img.published"
                    class="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
                    @click="handleUnpublish(img)"
                  >下架</button>
                  <button v-if="!img.published" class="text-xs font-bold text-rose-500 hover:underline" @click="handleDelete(img)">删除</button>
                </div>
              </td>
            </tr>
            <!-- Empty -->
            <tr v-if="filteredImages.length === 0">
              <td colspan="9" class="px-6 py-12 text-center text-slate-400 dark:text-slate-600">
                <div class="flex flex-col items-center gap-2">
                  <span class="material-icons-round text-3xl opacity-50">search_off</span>
                  <span class="text-xs font-bold uppercase tracking-widest">没有找到匹配的镜像</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div class="text-xs text-slate-500 dark:text-slate-400">
          共 <span class="font-bold text-slate-700 dark:text-slate-200">{{ filteredImages.length }}</span> 条记录
        </div>
        <nav class="flex items-center space-x-1">
          <button class="inline-flex items-center px-3 py-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 rounded-md transition-all">
            <span class="material-icons-round text-sm">chevron_left</span> 上一页
          </button>
          <button class="bg-primary text-white inline-flex items-center px-3.5 py-1.5 text-xs font-bold rounded-md shadow-sm">1</button>
          <button class="text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 inline-flex items-center px-3.5 py-1.5 text-xs font-bold rounded-md transition-all">2</button>
          <button class="inline-flex items-center px-3 py-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 rounded-md transition-all">
            下一页 <span class="material-icons-round text-sm">chevron_right</span>
          </button>
        </nav>
      </div>
    </div>

    <!-- Add / Edit Image Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        enter-to-class="opacity-100 translate-y-0 sm:scale-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0 sm:scale-100"
        leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      >
        <div v-if="showModal" class="fixed z-[9999] inset-0 overflow-y-auto" role="dialog" aria-modal="true">
          <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-900/60 transition-opacity backdrop-blur-sm" aria-hidden="true" @click="showModal = false"></div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="inline-block align-bottom bg-white dark:bg-surface-dark rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-gray-200 dark:border-gray-700">
              <div class="px-6 pt-5 pb-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 class="text-lg leading-6 font-bold text-gray-900 dark:text-white">{{ editingId ? '修改镜像' : '新增镜像' }}</h3>
                <button class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors" @click="showModal = false">
                  <span class="material-icons-round">close</span>
                </button>
              </div>
              <div class="px-6 py-5 space-y-5">
                <div v-if="editingId && isPublishedEditing" class="flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/40 rounded-lg px-4 py-3">
                  <span class="material-icons-round text-amber-500 text-lg">lock</span>
                  <p class="text-xs text-amber-800 dark:text-amber-200">镜像已上架，关键信息（地址 / 架构 / CANN 版本）置灰不可修改；如需调整请先下架或创建新版本。</p>
                </div>
                <div>
                  <label class="block text-sm font-bold text-gray-900 dark:text-white mb-1.5">镜像名称 <span class="text-rose-500">*</span></label>
                  <input v-model="form.name" type="text" placeholder="如 cann_9.0.0-beta.3-py3.12-a5-arm" class="block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2 px-3 font-mono transition-colors focus:ring-primary focus:border-primary" />
                </div>
                <div>
                  <label class="block text-sm font-bold text-gray-900 dark:text-white mb-1.5">镜像地址 <span class="text-rose-500">*</span></label>
                  <input v-model="form.address" type="text" :disabled="isPublishedEditing" placeholder="registry/cann/base:tag" class="block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2 px-3 font-mono transition-colors focus:ring-primary focus:border-primary disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-slate-700/50" />
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-bold text-gray-900 dark:text-white mb-1.5">CANN 版本</label>
                    <select v-model="form.cannVersion" :disabled="isPublishedEditing" class="block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2 px-3 transition-colors focus:ring-primary focus:border-primary disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-slate-700/50">
                      <option>CANN 9.0.0</option>
                      <option>CANN 8.0.0</option>
                      <option>CANN 7.0.0</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-bold text-gray-900 dark:text-white mb-1.5">架构</label>
                    <select v-model="form.arch" :disabled="isPublishedEditing" class="block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2 px-3 transition-colors focus:ring-primary focus:border-primary disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-slate-700/50">
                      <option value="arm">ARM（鲲鹏）</option>
                      <option value="x86">x86</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-bold text-gray-900 dark:text-white mb-1.5">适用场景</label>
                  <input v-model="form.scene" type="text" placeholder="如 训练 / 推理 / 编程" class="block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2 px-3 transition-colors focus:ring-primary focus:border-primary" />
                </div>
                <div>
                  <label class="block text-sm font-bold text-gray-900 dark:text-white mb-1.5">标签 / 备注</label>
                  <textarea v-model="form.tags" rows="2" placeholder="多个标签以逗号分隔" class="block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2 px-3 transition-colors focus:ring-primary focus:border-primary resize-none"></textarea>
                </div>
              </div>
              <div class="bg-gray-50 dark:bg-gray-800/50 px-6 py-3 sm:flex sm:flex-row-reverse border-t border-gray-200 dark:border-gray-700">
                <button type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-blue-600 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm transition-colors active:scale-95" @click="handleSubmit">确定</button>
                <button type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-surface-dark text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm transition-colors" @click="showModal = false">取消</button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Reference Drawer -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="refsTarget" class="fixed z-[9999] inset-0 overflow-y-auto" role="dialog" aria-modal="true">
          <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" @click="refsTarget = null"></div>
          <div class="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-surface-dark shadow-2xl flex flex-col">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">引用关系</h3>
                <p class="text-xs text-slate-500 mt-0.5 font-mono">{{ refsTarget.name }}</p>
              </div>
              <button class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors" @click="refsTarget = null">
                <span class="material-icons-round">close</span>
              </button>
            </div>
            <div class="flex-1 overflow-y-auto custom-scrollbar px-6 py-4 space-y-2">
              <div v-if="refsList.length === 0" class="text-center text-xs text-slate-400 py-8">该镜像暂未被任何模板引用</div>
              <div v-for="r in refsList" :key="r.id" class="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 rounded-lg px-4 py-3">
                <div>
                  <div class="text-sm font-bold text-slate-900 dark:text-white">{{ r.name }}</div>
                  <div class="text-xs font-mono text-slate-400">{{ r.tplId }}</div>
                </div>
                <span class="inline-flex items-center gap-1.5 text-xs font-bold" :class="r.published ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'">
                  <span class="h-2 w-2 rounded-full" :class="r.published ? 'bg-emerald-500' : 'bg-slate-400'"></span>
                  {{ r.published ? '已上架' : '未上架' }}
                </span>
              </div>
            </div>
            <div v-if="refsList.some(r => r.published)" class="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-amber-50 dark:bg-amber-900/20">
              <p class="text-xs text-amber-800 dark:text-amber-200">该镜像仍被已上架模板引用，不可直接删除；需先下架相关模板或更换镜像。</p>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script>
export default {
  name: 'DevImageList',
  data() {
    return {
      searchQuery: '',
      currentFilter: 'all',
      archFilter: 'all',
      scanFilter: 'all',
      filters: [
        { label: '全部', value: 'all' },
        { label: '已上架', value: 'published' },
        { label: '未上架', value: 'unpublished' }
      ],
      showModal: false,
      editingId: null,
      isPublishedEditing: false,
      refsTarget: null,
      form: { name: "", address: "", cannVersion: "CANN 9.0.0", arch: "arm", scene: "", tags: "" },
      images: [
        { id: 1, name: 'cann_9.0.0-beta.3-py3.12-a5-arm', address: 'swr.cn-east-3/cann/base:9.0.0-a5', cannVersion: 'CANN 9.0.0', arch: 'arm', scan: 'passed', published: true, refs: 2, updatedAt: '2026-06-17 19:50:44' },
        { id: 2, name: 'mindspore_base-910b', address: 'swr.cn-east-3/cann/mindspore:910b', cannVersion: 'CANN 8.0.0', arch: 'arm', scan: 'passed', published: true, refs: 1, updatedAt: '2026-06-15 10:22:36' },
        { id: 3, name: 'cann_kunpeng-arm', address: 'swr.cn-east-3/cann/kunpeng:arm', cannVersion: 'CANN 8.0.0', arch: 'arm', scan: 'failed', published: false, refs: 0, updatedAt: '2026-06-12 15:37:02' },
        { id: 4, name: 'pytorch_npu-a3', address: 'swr.cn-east-3/cann/pytorch:a3', cannVersion: 'CANN 9.0.0', arch: 'arm', scan: 'scanning', published: false, refs: 0, updatedAt: '2026-06-10 10:04:13' },
        { id: 5, name: 'cann_agent-a5', address: 'swr.cn-east-3/cann/agent:a5', cannVersion: 'CANN 9.0.0', arch: 'arm', scan: 'blocked', published: false, refs: 0, updatedAt: '2026-06-08 10:06:59' },
        { id: 6, name: 'cann_x86-base', address: 'swr.cn-east-3/cann/base:x86', cannVersion: 'CANN 7.0.0', arch: 'x86', scan: 'pending', published: false, refs: 0, updatedAt: '2026-06-05 18:44:38' }
      ],
      refMap: {
        1: [
          { id: 1, tplId: 'tpl-3a2b6457', name: 'AI Agent 编程实战环境模板', published: true },
          { id: 4, tplId: 'tpl-9e4f1a3c', name: '鲲鹏推理体验模板', published: false }
        ],
        2: [
          { id: 2, tplId: 'tpl-7c1d92ef', name: '昇腾训练基础模板', published: true }
        ]
      }
    }
  },
  computed: {
    filteredImages() {
      const q = this.searchQuery.trim().toLowerCase()
      return this.images.filter(img => {
        const matchesSearch = !q || img.name.toLowerCase().includes(q) || img.address.toLowerCase().includes(q)
        const matchesFilter = this.currentFilter === 'all' ? true : this.currentFilter === 'published' ? img.published : !img.published
        const matchesArch = this.archFilter === 'all' ? true : img.arch === this.archFilter
        const matchesScan = this.scanFilter === 'all' ? true : img.scan === this.scanFilter
        return matchesSearch && matchesFilter && matchesArch && matchesScan
      })
    },
    refsList() {
      if (!this.refsTarget) return []
      return this.refMap[this.refsTarget.id] || []
    }
  },
  methods: {
    emptyForm() {
      return { name: '', address: '', cannVersion: 'CANN 9.0.0', arch: 'arm', scene: '', tags: '' }
    },
    scanMeta(scan) {
      const map = {
        passed: { label: '扫描通过', text: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' },
        scanning: { label: '扫描中', text: 'text-blue-600 dark:text-blue-400', dot: 'bg-blue-500' },
        failed: { label: '扫描失败', text: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-500' },
        blocked: { label: '高危阻断', text: 'text-rose-500', dot: 'bg-rose-500' },
        pending: { label: '未扫描', text: 'text-slate-400', dot: 'bg-slate-400' }
      }
      return map[scan] || map.pending
    },
    publishMeta(published) {
      return published
        ? { label: '已上架', text: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' }
        : { label: '未上架', text: 'text-slate-500 dark:text-slate-400', dot: 'bg-slate-400' }
    },
    handleAdd() {
      this.form = this.emptyForm()
      this.editingId = null
      this.isPublishedEditing = false
      this.showModal = true
    },
    handleEdit(img) {
      this.editingId = img.id
      this.isPublishedEditing = img.published
      this.form = { name: img.name, address: img.address, cannVersion: img.cannVersion, arch: img.arch, scene: '', tags: '' }
      this.showModal = true
    },
    handleSubmit() {
      if (!this.form.name || !this.form.address) {
        alert('请填写镜像名称与地址')
        return
      }
      if (this.editingId) {
        const img = this.images.find(i => i.id === this.editingId)
        if (!this.isPublishedEditing) {
          img.name = this.form.name
          img.address = this.form.address
          img.cannVersion = this.form.cannVersion
          img.arch = this.form.arch
        }
        img.updatedAt = '2026-06-30 10:18:00'
      } else {
        this.images.unshift({
          id: Date.now(),
          name: this.form.name,
          address: this.form.address,
          cannVersion: this.form.cannVersion,
          arch: this.form.arch,
          scan: 'pending',
          published: false,
          refs: 0,
          updatedAt: '2026-06-30 10:18:00'
        })
      }
      this.showModal = false
    },
    handleScan(img) {
      img.scan = 'scanning'
      img.updatedAt = '2026-06-30 10:18:00'
      // 模拟异步扫描完成
      setTimeout(() => {
        img.scan = 'passed'
      }, 1800)
    },
    handlePublish(img) {
      if (confirm(`确认上架镜像「${img.name}」吗？上架后可被模板选择，关键元数据将不可直接修改。`)) {
        img.published = true
        img.updatedAt = '2026-06-30 10:18:00'
      }
    },
    handleUnpublish(img) {
      if (img.refs > 0 && this.refMap[img.id] && this.refMap[img.id].some(r => r.published)) {
        alert('该镜像仍被已上架模板引用，无法下架。请先下架相关模板或更换镜像。')
        return
      }
      if (confirm(`确认下架镜像「${img.name}」吗？下架后新模板不可引用，不影响历史实例。`)) {
        img.published = false
        img.updatedAt = '2026-06-30 10:18:00'
      }
    },
    handleDelete(img) {
      if (img.refs > 0 && this.refMap[img.id] && this.refMap[img.id].some(r => r.published)) {
        alert('该镜像仍被已上架模板引用，无法删除。请先下架相关模板或更换镜像。')
        return
      }
      if (confirm(`确认删除镜像「${img.name}」吗？此操作不可恢复，需记录审计日志。`)) {
        this.images = this.images.filter(i => i.id !== img.id)
      }
    },
    openRefs(img) {
      this.refsTarget = img
    }
  }
}
</script>
