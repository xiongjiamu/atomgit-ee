<template>
  <div class="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <!-- Header -->
    <div class="flex items-center justify-between px-2">
      <div>
        <h1 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">模板管理</h1>
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">CANNLab Environment Template Management</p>
      </div>
      <button
        class="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-lg active:scale-95 flex items-center gap-2"
        @click="handleAdd"
      >
        <span class="material-icons-round text-lg">add</span>
        添加模板
      </button>
    </div>

    <!-- Info Note -->
    <div class="flex items-start gap-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/40 rounded-xl px-4 py-3">
      <span class="material-icons-round text-blue-500 text-lg mt-0.5">info</span>
      <p class="text-xs leading-relaxed text-blue-800 dark:text-blue-200">
        定义昇腾 / 鲲鹏实例模板，配置使用的镜像、实例规格、资源池、持久化挂盘与可见范围。镜像经过配置后成为用户可用的模板，用户申请环境时使用该模板实例化成开发环境；上架前可添加白名单（验证名单）进行灰度验证。
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
            placeholder="添加筛选条件（模板名称 / ID / 类型）..."
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
        <table class="w-full text-left border-collapse min-w-[1240px]">
          <thead>
            <tr class="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100 dark:border-slate-800 whitespace-nowrap">
              <th class="px-3 py-4 text-center">序号</th>
              <th class="px-3 py-4">模板ID</th>
              <th class="px-3 py-4">模板名称</th>
              <th class="px-3 py-4">模板描述</th>
              <th class="px-3 py-4">来源</th>
              <th class="px-3 py-4">模板类型</th>
              <th class="px-3 py-4">镜像</th>
              <th class="px-3 py-4">模板状态</th>
              <th class="px-3 py-4">更新时间</th>
              <th class="px-3 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr v-for="(tpl, index) in filteredTemplates" :key="tpl.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
              <td class="px-3 py-4 text-center text-sm text-slate-500 dark:text-slate-400">{{ index + 1 }}</td>
              <td class="px-3 py-4">
                <span class="text-xs font-mono font-bold text-primary">{{ tpl.tplId }}</span>
              </td>
              <td class="px-3 py-4">
                <span class="font-bold text-slate-900 dark:text-white text-sm whitespace-nowrap">{{ tpl.name }}</span>
              </td>
              <td class="px-3 py-4 max-w-xs">
                <span class="text-xs text-slate-500 dark:text-slate-400 line-clamp-1" :title="tpl.description">{{ tpl.description }}</span>
              </td>
              <td class="px-3 py-4 text-sm text-slate-600 dark:text-slate-300">{{ tpl.source }}</td>
              <td class="px-3 py-4">
                <span
                  class="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wider border whitespace-nowrap"
                  :class="typeBadgeClass(tpl.type)"
                >
                  {{ tpl.type }}
                </span>
              </td>
              <td class="px-3 py-4 text-xs font-mono text-slate-500 dark:text-slate-400"><span class="block max-w-[160px] truncate" :title="tpl.image">{{ tpl.image }}</span></td>
              <td class="px-3 py-4">
                <span class="inline-flex items-center gap-1.5 text-xs font-bold whitespace-nowrap" :class="statusMeta(tpl.status).text">
                  <span class="h-2 w-2 rounded-full" :class="statusMeta(tpl.status).dot"></span>
                  {{ statusMeta(tpl.status).label }}
                </span>
              </td>
              <td class="px-3 py-4 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{{ tpl.updatedAt }}</td>
              <td class="px-3 py-4 text-right whitespace-nowrap">
                <div class="flex items-center justify-end gap-3">
                  <button class="text-xs font-bold text-primary hover:underline" @click="handleEdit(tpl)">编辑</button>
                  <button class="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:underline" @click="handleWhitelist(tpl)">验证名单</button>
                  <button
                    v-if="tpl.status === 'published'"
                    class="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
                    @click="handleUnpublish(tpl)"
                  >
                    下架
                  </button>
                  <button
                    v-else
                    class="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                    @click="handlePublish(tpl)"
                  >
                    上架
                  </button>
                  <button v-if="tpl.status !== 'published'" class="text-xs font-bold text-rose-500 hover:underline" @click="handleDelete(tpl)">删除</button>
                </div>
              </td>
            </tr>
            <!-- Empty State -->
            <tr v-if="filteredTemplates.length === 0">
              <td colspan="10" class="px-6 py-12 text-center text-slate-400 dark:text-slate-600">
                <div class="flex flex-col items-center gap-2">
                  <span class="material-icons-round text-3xl opacity-50">search_off</span>
                  <span class="text-xs font-bold uppercase tracking-widest">没有找到匹配的模板</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div class="text-xs text-slate-500 dark:text-slate-400">
          共 <span class="font-bold text-slate-700 dark:text-slate-200">17</span> 条记录
        </div>
        <nav class="flex items-center space-x-1">
          <button class="inline-flex items-center px-3 py-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 rounded-md transition-all">
            <span class="material-icons-round text-sm">chevron_left</span> 上一页
          </button>
          <button class="bg-primary text-white inline-flex items-center px-3.5 py-1.5 text-xs font-bold rounded-md shadow-sm">1</button>
          <button class="text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 inline-flex items-center px-3.5 py-1.5 text-xs font-bold rounded-md transition-all">2</button>
          <button class="text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 inline-flex items-center px-3.5 py-1.5 text-xs font-bold rounded-md transition-all">3</button>
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
  name: 'DevTemplateList',
  emits: ['open-whitelist'],
  data() {
    return {
      searchQuery: '',
      currentFilter: 'all',
      filters: [
        { label: '全部', value: 'all' },
        { label: '已上架', value: 'published' },
        { label: '未上架', value: 'unpublished' }
      ],
      templates: [
        { id: 1, tplId: 'tpl-3a2b6457', name: 'AI Agent 编程实战环境模板', description: '预置 cann 算子生成 skill，GLM6 模型，开箱即用', source: 'CANN', type: 'KUNPENG_SIMULATE', image: 'cann_9.0.0-beta.3-py3.12-a5-arm', status: 'published', updatedAt: '2026-05-11 19:48:25' },
        { id: 2, tplId: 'tpl-7c1d92ef', name: '昇腾训练基础模板', description: '昇腾 910B 训练环境，预置 MindSpore 与 CANN 包升级脚本', source: 'CANN', type: 'ASCEND_INNER', image: 'mindspore_base-910b', status: 'published', updatedAt: '2026-05-10 14:21:08' },
        { id: 3, tplId: 'tpl-9e4f1a3c', name: '鲲鹏推理体验模板', description: '鲲鹏 CPU 推理环境，对外开放，按规格匹配外部资源池', source: 'CANN', type: 'KUNPENG_OUTER', image: 'cann_kunpeng-arm', status: 'unpublished', updatedAt: '2026-05-08 09:55:30' },
        { id: 4, tplId: 'tpl-2b8a07d5', name: '昇腾外部体验模板', description: '对外开放的昇腾体验环境，持久化挂盘，超时 4 小时自动释放', source: 'CANN', type: 'ASCEND_OUTER', image: 'pytorch_npu-a3', status: 'unpublished', updatedAt: '2026-05-05 16:40:12' },
        { id: 5, tplId: 'tpl-5d3c81fa', name: '昇腾大模型微调模板', description: '面向内部用户，CPU/NPU 无限额，内部资源池，支持 CANN 包升级', source: 'CANN', type: 'ASCEND_INNER', image: 'cann_agent-a5', status: 'published', updatedAt: '2026-05-03 11:02:47' }
      ]
    }
  },
  computed: {
    filteredTemplates() {
      const q = this.searchQuery.trim().toLowerCase()
      return this.templates.filter(tpl => {
        const matchesSearch = !q || tpl.name.toLowerCase().includes(q) || tpl.tplId.toLowerCase().includes(q) || tpl.type.toLowerCase().includes(q)
        const matchesFilter = this.currentFilter === 'all'
          ? true
          : this.currentFilter === 'published'
            ? tpl.status === 'published'
            : tpl.status !== 'published'
        return matchesSearch && matchesFilter
      })
    }
  },
  methods: {
    statusMeta(status) {
      const map = {
        published: { label: '已上架', text: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' },
        unpublished: { label: '未上架', text: 'text-slate-500 dark:text-slate-400', dot: 'bg-slate-400' }
      }
      return map[status] || map.unpublished
    },
    typeBadgeClass(type) {
      const map = {
        KUNPENG_SIMULATE: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-800',
        ASCEND_INNER: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-800',
        ASCEND_OUTER: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-100 dark:border-amber-800',
        KUNPENG_OUTER: 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 border-cyan-100 dark:border-cyan-800'
      }
      return map[type] || 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
    },
    handleAdd() {
      console.log('Add template')
    },
    handleEdit(tpl) {
      console.log('Edit template:', tpl.name)
    },
    handleWhitelist(tpl) {
      this.$emit('open-whitelist', { id: tpl.id, name: tpl.name, tplId: tpl.tplId })
    },
    handlePublish(tpl) {
      tpl.status = 'published'
    },
    handleUnpublish(tpl) {
      tpl.status = 'unpublished'
    },
    handleDelete(tpl) {
      if (confirm(`确认删除模板 ${tpl.name} 吗？`)) {
        this.templates = this.templates.filter(t => t.id !== tpl.id)
      }
    }
  }
}
</script>
