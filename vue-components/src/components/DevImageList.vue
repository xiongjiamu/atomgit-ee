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
        镜像制作流水线（CodeArts）制作完成后会自动推送至镜像管理服务，并自动解析填充元数据，仅需少量人工修改。安全扫描调用华为云镜像扫描服务检查合规信息，镜像无问题后由管理员上架；<span class="font-bold">已上架的镜像不可再修改信息</span>。
      </p>
    </div>

    <!-- Main Content -->
    <div class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
      <!-- Toolbar -->
      <div class="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="relative w-full md:w-96">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <span class="material-icons-round text-lg">search</span>
          </span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="输入关键字搜索、过滤（镜像名称 / 别名 / 类型）..."
            class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        <div class="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-lg">
          <button
            v-for="filter in filters"
            :key="filter.value"
            @click="currentFilter = filter.value"
            class="px-4 py-1.5 text-xs font-black rounded-md transition-all whitespace-nowrap"
            :class="currentFilter === filter.value ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'"
          >
            {{ filter.label }}
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto custom-scrollbar">
        <table class="w-full text-left border-collapse min-w-[1180px]">
          <thead>
            <tr class="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100 dark:border-slate-800 whitespace-nowrap">
              <th class="px-2.5 py-4">镜像名称</th>
              <th class="px-2.5 py-4">镜像版本</th>
              <th class="px-2.5 py-4">镜像别名</th>
              <th class="px-2.5 py-4">操作系统</th>
              <th class="px-2.5 py-4">镜像类型</th>
              <th class="px-2.5 py-4">所属组织</th>
              <th class="px-2.5 py-4">镜像状态</th>
              <th class="px-2.5 py-4">更新时间</th>
              <th class="px-2.5 py-4 text-center">排序</th>
              <th class="px-2.5 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr v-for="image in filteredImages" :key="image.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
              <td class="px-2.5 py-4">
                <div class="flex items-center gap-2">
                  <span class="material-icons-round text-slate-400 text-lg">dns</span>
                  <span class="font-bold text-slate-900 dark:text-white text-sm">{{ image.name }}</span>
                </div>
              </td>
              <td class="px-2.5 py-4 text-xs font-mono text-slate-500 dark:text-slate-400"><span class="block max-w-[88px] truncate" :title="image.version">{{ image.version }}</span></td>
              <td class="px-2.5 py-4 text-xs font-mono text-slate-500 dark:text-slate-400"><span class="block max-w-[88px] truncate" :title="image.alias">{{ image.alias }}</span></td>
              <td class="px-2.5 py-4 text-sm text-slate-600 dark:text-slate-300">{{ image.os }}</td>
              <td class="px-2.5 py-4">
                <span
                  class="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wider border"
                  :class="typeBadgeClass(image.type)"
                >
                  {{ image.type }}
                </span>
              </td>
              <td class="px-2.5 py-4 text-sm text-slate-600 dark:text-slate-300 font-mono text-xs">{{ image.org }}</td>
              <td class="px-2.5 py-4">
                <span class="inline-flex items-center gap-1.5 text-xs font-bold whitespace-nowrap" :class="statusMeta(image.status).text">
                  <span v-if="image.status === 'scanning'" class="material-icons-round text-[14px] animate-spin">progress_activity</span>
                  <span v-else-if="image.status === 'scan_failed'" class="material-icons-round text-[14px]">error</span>
                  <span v-else class="h-2 w-2 rounded-full" :class="statusMeta(image.status).dot"></span>
                  {{ statusMeta(image.status).label }}
                </span>
              </td>
              <td class="px-2.5 py-4 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{{ image.updatedAt }}</td>
              <td class="px-2.5 py-4 text-center text-sm text-slate-500 dark:text-slate-400">{{ image.order }}</td>
              <td class="px-2.5 py-4 text-right whitespace-nowrap">
                <div class="flex items-center justify-end gap-3">
                  <button
                    :disabled="image.status === 'scanning'"
                    class="text-xs font-bold text-primary hover:underline disabled:text-slate-300 dark:disabled:text-slate-600 disabled:no-underline disabled:cursor-not-allowed"
                    @click="handleScan(image)"
                  >
                    {{ image.status === 'scan_failed' ? '重新扫描' : '安全扫描' }}
                  </button>
                  <button
                    :disabled="!canModify(image)"
                    :title="canModify(image) ? '' : '已上架的镜像不可修改信息'"
                    class="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:underline disabled:text-slate-300 dark:disabled:text-slate-600 disabled:no-underline disabled:cursor-not-allowed"
                    @click="handleEdit(image)"
                  >
                    修改
                  </button>
                  <button
                    v-if="image.status === 'published'"
                    class="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
                    @click="handleUnpublish(image)"
                  >
                    下架
                  </button>
                  <button
                    v-else
                    :disabled="image.status !== 'scan_passed'"
                    title="仅扫描通过的镜像可上架"
                    class="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline disabled:text-slate-300 dark:disabled:text-slate-600 disabled:no-underline disabled:cursor-not-allowed"
                    @click="handlePublish(image)"
                  >
                    上架
                  </button>
                  <button v-if="image.status !== 'published'" class="text-xs font-bold text-rose-500 hover:underline" @click="handleDelete(image)">删除</button>
                </div>
              </td>
            </tr>
            <!-- Empty State -->
            <tr v-if="filteredImages.length === 0">
              <td colspan="10" class="px-6 py-12 text-center text-slate-400 dark:text-slate-600">
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
          共 <span class="font-bold text-slate-700 dark:text-slate-200">28</span> 条记录
        </div>
        <nav class="flex items-center space-x-1">
          <button class="inline-flex items-center px-3 py-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 rounded-md transition-all">
            <span class="material-icons-round text-sm">chevron_left</span> 上一页
          </button>
          <button class="bg-primary text-white inline-flex items-center px-3.5 py-1.5 text-xs font-bold rounded-md shadow-sm">1</button>
          <button class="text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 inline-flex items-center px-3.5 py-1.5 text-xs font-bold rounded-md transition-all">2</button>
          <button class="text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 inline-flex items-center px-3.5 py-1.5 text-xs font-bold rounded-md transition-all">3</button>
          <span class="px-2 text-xs font-bold text-slate-400">...</span>
          <button class="inline-flex items-center px-3 py-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 rounded-md transition-all">
            下一页 <span class="material-icons-round text-sm">chevron_right</span>
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DevImageList',
  data() {
    return {
      searchQuery: '',
      currentFilter: 'all',
      filters: [
        { label: '全部', value: 'all' },
        { label: '已上架', value: 'published' },
        { label: '未上架', value: 'unpublished' }
      ],
      images: [
        { id: 1, name: 'cann_master', version: 'py3.11-a2-arm-20260401', alias: 'cann_master-py3.11-A2-arm', os: 'hce', type: 'CANN', org: 'ci_cann', status: 'published', updatedAt: '2026-04-01 22:34:40', order: 1 },
        { id: 2, name: 'cann_dev', version: 'py3.10-a2-arm-20260330', alias: 'cann_dev-py3.10-A2-arm', os: 'euler', type: 'CANN', org: 'ci_cann', status: 'unpublished', updatedAt: '2026-03-30 10:12:00', order: 2 },
        { id: 3, name: 'mindspore_base', version: 'py3.9-910b-20260328', alias: 'mindspore-910b', os: 'ubuntu', type: 'MindSpore', org: 'ci_ms', status: 'scanning', updatedAt: '2026-03-28 09:05:11', order: 3 },
        { id: 4, name: 'pytorch_npu', version: 'py3.11-a3-arm-20260325', alias: 'pytorch-npu-a3', os: 'hce', type: 'PyTorch', org: 'ci_torch', status: 'scan_failed', updatedAt: '2026-03-25 14:20:33', order: 4 },
        { id: 5, name: 'cann_kunpeng', version: 'py3.11-kp-arm-20260320', alias: 'cann-kunpeng', os: 'hce', type: 'CANN', org: 'ci_cann', status: 'published', updatedAt: '2026-03-20 16:48:02', order: 5 },
        { id: 6, name: 'cann_agent', version: 'py3.12-a5-arm-20260318', alias: 'cann-agent-a5', os: 'euler', type: 'CANN', org: 'ci_cann', status: 'scan_passed', updatedAt: '2026-03-18 11:30:50', order: 6 }
      ]
    }
  },
  computed: {
    filteredImages() {
      const q = this.searchQuery.trim().toLowerCase()
      return this.images.filter(img => {
        const matchesSearch = !q || img.name.toLowerCase().includes(q) || img.alias.toLowerCase().includes(q) || img.type.toLowerCase().includes(q)
        const matchesFilter = this.currentFilter === 'all'
          ? true
          : this.currentFilter === 'published'
            ? img.status === 'published'
            : img.status !== 'published'
        return matchesSearch && matchesFilter
      })
    }
  },
  methods: {
    statusMeta(status) {
      const map = {
        published: { label: '已上架', text: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' },
        unpublished: { label: '未上架', text: 'text-slate-500 dark:text-slate-400', dot: 'bg-slate-400' },
        scanning: { label: '扫描中', text: 'text-blue-600 dark:text-blue-400', dot: 'bg-blue-500' },
        scan_failed: { label: '扫描失败', text: 'text-rose-600 dark:text-rose-400', dot: 'bg-rose-500' },
        scan_passed: { label: '扫描通过', text: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' }
      }
      return map[status] || map.unpublished
    },
    typeBadgeClass(type) {
      const map = {
        CANN: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border-indigo-100 dark:border-indigo-800',
        MindSpore: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-100 dark:border-purple-800',
        PyTorch: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-100 dark:border-orange-800'
      }
      return map[type] || 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
    },
    canModify(image) {
      // 只有未上架（含扫描中/失败/通过）的镜像可以修改信息，已上架不可修改
      return image.status !== 'published' && image.status !== 'scanning'
    },
    handleAdd() {
      console.log('Add image')
    },
    handleScan(image) {
      console.log('Scan image:', image.name)
    },
    handleEdit(image) {
      if (!this.canModify(image)) return
      console.log('Edit image:', image.name)
    },
    handlePublish(image) {
      console.log('Publish image:', image.name)
      image.status = 'published'
    },
    handleUnpublish(image) {
      console.log('Unpublish image:', image.name)
      image.status = 'unpublished'
    },
    handleDelete(image) {
      if (confirm(`确认删除镜像 ${image.name} 吗？`)) {
        this.images = this.images.filter(i => i.id !== image.id)
      }
    }
  }
}
</script>
