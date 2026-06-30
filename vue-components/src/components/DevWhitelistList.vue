<template>
  <div class="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-1.5 text-xs text-slate-400 px-2">
      <a href="#" class="hover:text-primary font-bold no-underline" @click.prevent="$emit('back')">模板管理</a>
      <span class="material-icons-round text-sm">chevron_right</span>
      <span class="font-bold text-slate-500 dark:text-slate-400">验证名单</span>
    </div>

    <!-- Header -->
    <div class="flex items-center justify-between px-2">
      <div>
        <h1 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">CANNLab 用户名单管理</h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-2">
          当前模板：<span class="font-bold text-slate-700 dark:text-slate-200">{{ templateName }}</span>
          <span class="font-mono text-slate-400">（{{ templateId }}）</span> 的灰度验证账号名单
        </p>
      </div>
      <div class="flex items-center gap-3">
        <button
          class="px-4 py-3 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-black hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2"
          @click="openBatchModal"
        >
          <span class="material-icons-round text-lg">upload_file</span>
          批量导入
        </button>
        <button
          class="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-lg active:scale-95 flex items-center gap-2"
          @click="openModal"
        >
          <span class="material-icons-round text-lg">person_add</span>
          添加验证账号
        </button>
      </div>
    </div>

    <!-- Info Note -->
    <div class="flex items-start gap-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/40 rounded-xl px-4 py-3">
      <span class="material-icons-round text-blue-500 text-lg mt-0.5">info</span>
      <p class="text-xs leading-relaxed text-blue-800 dark:text-blue-200">
        用户名单用于模板上架前的灰度验证：仅名单内的试点 / 灰度用户可使用对应模板实例化开发环境。白名单以 GitCode 用户 ID 作为稳定主键，账号名称仅作展示；账号改名不会丢失权限。变更 1 分钟内对 Portal 可见性生效。
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
            placeholder="搜索账号名称 / GitCode 用户 ID..."
            class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        <div class="flex items-center gap-3">
          <select
            v-model="scopeFilter"
            class="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-2 px-3 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">全部适用范围</option>
            <option value="A5">A5 资源</option>
            <option value="gray">模板灰度</option>
            <option value="pilot">试点模板</option>
            <option value="inner">内部模板</option>
          </select>
          <select
            v-model="statusFilter"
            class="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-2 px-3 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">全部状态</option>
            <option value="active">启用</option>
            <option value="disabled">禁用</option>
          </select>
          <div class="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
            共 <span class="font-bold text-slate-700 dark:text-slate-200">{{ filteredAccounts.length }}</span> 个验证账号
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto custom-scrollbar">
        <table class="w-full text-left border-collapse min-w-[1080px]">
          <thead>
            <tr class="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100 dark:border-slate-800 whitespace-nowrap">
              <th class="px-4 py-4 text-center">序号</th>
              <th class="px-4 py-4">GitCode 账号</th>
              <th class="px-4 py-4">用户 ID</th>
              <th class="px-4 py-4">适用范围</th>
              <th class="px-4 py-4">关联模板</th>
              <th class="px-4 py-4">状态</th>
              <th class="px-4 py-4">添加人</th>
              <th class="px-4 py-4">添加时间</th>
              <th class="px-4 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr v-for="(acc, index) in filteredAccounts" :key="acc.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
              <td class="px-4 py-4 text-center text-sm text-slate-500 dark:text-slate-400">{{ index + 1 }}</td>
              <td class="px-4 py-4">
                <div class="flex items-center gap-2.5">
                  <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" :class="acc.avatarClass">{{ acc.initial }}</div>
                  <span class="font-bold text-slate-900 dark:text-white text-sm">{{ acc.name }}</span>
                </div>
              </td>
              <td class="px-4 py-4 text-xs font-mono text-slate-500 dark:text-slate-400">{{ acc.gitcodeId }}</td>
              <td class="px-4 py-4">
                <span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold whitespace-nowrap" :class="scopeMeta(acc.scope).badge">{{ scopeMeta(acc.scope).label }}</span>
              </td>
              <td class="px-4 py-4">
                <span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 whitespace-nowrap max-w-[180px] truncate" :title="acc.template">{{ acc.template }}</span>
              </td>
              <td class="px-4 py-4">
                <span class="inline-flex items-center gap-1.5 text-xs font-bold whitespace-nowrap" :class="acc.status === 'active' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'">
                  <span class="h-2 w-2 rounded-full" :class="acc.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'"></span>
                  {{ acc.status === 'active' ? '启用' : '禁用' }}
                </span>
              </td>
              <td class="px-4 py-4 text-xs text-slate-600 dark:text-slate-300 whitespace-nowrap">{{ acc.addedBy }}</td>
              <td class="px-4 py-4 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{{ acc.addedAt }}</td>
              <td class="px-4 py-4 text-right whitespace-nowrap">
                <div class="flex items-center justify-end gap-3">
                  <button
                    v-if="acc.status === 'active'"
                    class="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
                    @click="handleToggle(acc)"
                  >禁用</button>
                  <button
                    v-else
                    class="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                    @click="handleToggle(acc)"
                  >恢复</button>
                  <button class="text-xs font-bold text-rose-500 hover:underline" @click="handleRemove(acc)">移除</button>
                </div>
              </td>
            </tr>
            <!-- Empty -->
            <tr v-if="filteredAccounts.length === 0">
              <td colspan="9" class="px-6 py-12 text-center text-slate-400 dark:text-slate-600">
                <div class="flex flex-col items-center gap-2">
                  <span class="material-icons-round text-3xl opacity-50">person_off</span>
                  <span class="text-xs font-bold uppercase tracking-widest">暂无验证账号</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div class="text-xs text-slate-500 dark:text-slate-400">
          共 <span class="font-bold text-slate-700 dark:text-slate-200">{{ filteredAccounts.length }}</span> 条记录
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

    <!-- Add Account Modal -->
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
                <h3 class="text-lg leading-6 font-bold text-gray-900 dark:text-white">添加验证账号</h3>
                <button class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors" @click="showModal = false">
                  <span class="material-icons-round">close</span>
                </button>
              </div>
              <div class="px-6 py-5 space-y-5">
                <div>
                  <label class="block text-sm font-bold text-gray-900 dark:text-white mb-1.5">GitCode 用户 ID <span class="text-rose-500">*</span></label>
                  <input
                    v-model="formData.gitcodeId"
                    type="text"
                    placeholder="如 u_503067ed456146e9"
                    class="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2 px-3 font-mono transition-colors"
                  />
                  <p class="mt-1.5 text-xs text-gray-400">以 GitCode 用户 ID 作为白名单主键；保存前会校验账号存在性与重复记录。</p>
                </div>
                <div>
                  <label class="block text-sm font-bold text-gray-900 dark:text-white mb-1.5">账号名称 <span class="text-rose-500">*</span></label>
                  <input
                    v-model="formData.name"
                    type="text"
                    placeholder="请输入账号名称（仅展示）"
                    class="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2 px-3 transition-colors"
                  />
                </div>
                <div>
                  <label class="block text-sm font-bold text-gray-900 dark:text-white mb-1.5">适用范围 <span class="text-rose-500">*</span></label>
                  <select
                    v-model="formData.scope"
                    class="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2 px-3 transition-colors"
                  >
                    <option value="A5">A5 资源</option>
                    <option value="gray">模板灰度</option>
                    <option value="pilot">试点模板</option>
                    <option value="inner">内部模板</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-bold text-gray-900 dark:text-white mb-1.5">关联模板</label>
                  <input
                    v-model="formData.template"
                    type="text"
                    :placeholder="templateName"
                    class="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2 px-3 transition-colors"
                  />
                  <p class="mt-1.5 text-xs text-gray-400">默认关联当前模板，留空即关联「{{ templateName }}」。</p>
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

    <!-- Batch Import Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        enter-to-class="opacity-100 translate-y-0 sm:scale-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0 sm:scale-100"
        leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      >
        <div v-if="showBatchModal" class="fixed z-[9999] inset-0 overflow-y-auto" role="dialog" aria-modal="true">
          <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-900/60 transition-opacity backdrop-blur-sm" aria-hidden="true" @click="showBatchModal = false"></div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="inline-block align-bottom bg-white dark:bg-surface-dark rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full border border-gray-200 dark:border-gray-700">
              <div class="px-6 pt-5 pb-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 class="text-lg leading-6 font-bold text-gray-900 dark:text-white">批量导入验证账号</h3>
                <button class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors" @click="showBatchModal = false">
                  <span class="material-icons-round">close</span>
                </button>
              </div>
              <div class="px-6 py-5 space-y-4">
                <div class="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 rounded-lg px-4 py-2.5">
                  <span class="text-xs text-slate-500 dark:text-slate-400">每行一个 GitCode 用户 ID，支持「ID,账号名称」格式</span>
                  <button class="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                    <span class="material-icons-round text-sm">download</span> 模板
                  </button>
                </div>
                <textarea
                  v-model="batchText"
                  rows="8"
                  placeholder="u_503067ed456146e9,zhangsan_test&#10;u_a7de826e8be94906,lisi_gray&#10;u_8058045195e4a13"
                  class="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2 px-3 font-mono transition-colors resize-none"
                ></textarea>
                <div v-if="batchResult" class="rounded-lg p-3 text-xs space-y-1" :class="batchResult.fail === 0 ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'">
                  <div>导入完成：成功 <b>{{ batchResult.success }}</b> 条，失败 <b>{{ batchResult.fail }}</b> 条，重复 <b>{{ batchResult.duplicate }}</b> 条，账号不存在 <b>{{ batchResult.notExist }}</b> 条。</div>
                  <div v-if="batchResult.errors.length" class="mt-1 text-slate-500 dark:text-slate-400">失败明细：{{ batchResult.errors.join('；') }}</div>
                </div>
              </div>
              <div class="bg-gray-50 dark:bg-gray-800/50 px-6 py-3 sm:flex sm:flex-row-reverse border-t border-gray-200 dark:border-gray-700">
                <button type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-blue-600 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm transition-colors active:scale-95" @click="handleBatchSubmit">开始导入</button>
                <button type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-surface-dark text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm transition-colors" @click="showBatchModal = false">关闭</button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script>
export default {
  name: 'DevWhitelistList',
  emits: ['back'],
  props: {
    templateName: {
      type: String,
      default: 'AI Agent 编程实战环境模板'
    },
    templateId: {
      type: String,
      default: 'tpl-3a2b6457'
    }
  },
  data() {
    return {
      searchQuery: '',
      scopeFilter: 'all',
      statusFilter: 'all',
      showModal: false,
      showBatchModal: false,
      batchText: '',
      batchResult: null,
      formData: { gitcodeId: '', name: '', scope: 'gray', template: '' },
      accounts: [
        { id: 1, name: 'zhangsan_test', gitcodeId: 'u_503067ed456146e9', initial: '张', avatarClass: 'bg-blue-50 dark:bg-blue-900/30 text-primary', scope: 'gray', template: 'AI Agent 编程实战环境模板', status: 'active', addedBy: 'admin', addedAt: '2026-05-11 20:02:15' },
        { id: 2, name: 'lisi_gray', gitcodeId: 'u_a7de826e8be94906', initial: '李', avatarClass: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600', scope: 'gray', template: 'AI Agent 编程实战环境模板', status: 'active', addedBy: 'admin', addedAt: '2026-05-10 15:30:48' },
        { id: 3, name: 'pilot_user03', gitcodeId: 'u_8058045195e4a13', initial: 'P', avatarClass: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600', scope: 'pilot', template: 'AI Agent 编程实战环境模板', status: 'active', addedBy: 'ops_wang', addedAt: '2026-05-09 11:18:22' },
        { id: 4, name: 'wangwu_dev', gitcodeId: 'u_ad8dac0d6b4245d6', initial: 'W', avatarClass: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600', scope: 'A5', template: 'AI Agent 编程实战环境模板', status: 'active', addedBy: 'admin', addedAt: '2026-05-08 14:05:39' },
        { id: 5, name: 'zhaoliu_beta', gitcodeId: 'u_d9872dc179e04638', initial: 'Z', avatarClass: 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600', scope: 'inner', template: 'AI Agent 编程实战环境模板', status: 'disabled', addedBy: 'ops_wang', addedAt: '2026-05-07 09:42:10' }
      ]
    }
  },
  computed: {
    filteredAccounts() {
      const q = this.searchQuery.trim().toLowerCase()
      return this.accounts.filter(a => {
        const matchesSearch = !q || a.name.toLowerCase().includes(q) || a.gitcodeId.toLowerCase().includes(q)
        const matchesScope = this.scopeFilter === 'all' ? true : a.scope === this.scopeFilter
        const matchesStatus = this.statusFilter === 'all' ? true : a.status === this.statusFilter
        return matchesSearch && matchesScope && matchesStatus
      })
    }
  },
  methods: {
    scopeMeta(scope) {
      const map = {
        A5: { label: 'A5 资源', badge: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300' },
        gray: { label: '模板灰度', badge: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' },
        pilot: { label: '试点模板', badge: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300' },
        inner: { label: '内部模板', badge: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' }
      }
      return map[scope] || map.gray
    },
    openModal() {
      this.formData = { gitcodeId: '', name: '', scope: 'gray', template: '' }
      this.showModal = true
    },
    handleSubmit() {
      if (!this.formData.gitcodeId || !this.formData.name) {
        alert('请填写 GitCode 用户 ID 和账号名称')
        return
      }
      if (this.accounts.some(a => a.gitcodeId === this.formData.gitcodeId)) {
        alert('该 GitCode 用户 ID 已在名单中，请勿重复添加')
        return
      }
      this.accounts.push({
        id: Date.now(),
        name: this.formData.name,
        gitcodeId: this.formData.gitcodeId,
        initial: this.formData.name.charAt(0).toUpperCase(),
        avatarClass: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300',
        scope: this.formData.scope,
        template: this.formData.template || this.templateName,
        status: 'active',
        addedBy: 'admin',
        addedAt: '2026-06-30 10:00:00'
      })
      this.showModal = false
    },
    openBatchModal() {
      this.batchText = ''
      this.batchResult = null
      this.showBatchModal = true
    },
    handleBatchSubmit() {
      const lines = this.batchText.split('\n').map(l => l.trim()).filter(Boolean)
      let success = 0, fail = 0, duplicate = 0, notExist = 0
      const errors = []
      lines.forEach((line, i) => {
        const [id, name] = line.split(',').map(s => s && s.trim())
        if (!id) { fail++; errors.push(`第 ${i + 1} 行：用户 ID 为空`); return }
        if (this.accounts.some(a => a.gitcodeId === id)) { duplicate++; return }
        // 模拟：以 "notexist" 关键字触发不存在
        if (/notexist|invalid/i.test(id)) { notExist++; fail++; errors.push(`第 ${i + 1} 行：${id} 账号不存在`); return }
        this.accounts.push({
          id: Date.now() + i,
          name: name || id,
          gitcodeId: id,
          initial: (name || id).charAt(0).toUpperCase(),
          avatarClass: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300',
          scope: 'gray',
          template: this.templateName,
          status: 'active',
          addedBy: 'admin',
          addedAt: '2026-06-30 10:00:00'
        })
        success++
      })
      this.batchResult = { success, fail, duplicate, notExist, errors }
    },
    handleToggle(acc) {
      if (acc.status === 'active') {
        if (confirm(`确认禁用账号 ${acc.name} 吗？禁用后将立即影响新申请与模板可见性。`)) {
          acc.status = 'disabled'
        }
      } else {
        acc.status = 'active'
      }
    },
    handleRemove(acc) {
      if (confirm(`确认将验证账号 ${acc.name} 从名单中移除吗？移除后立即影响新申请和模板可见性，不影响已创建实例。`)) {
        this.accounts = this.accounts.filter(a => a.id !== acc.id)
      }
    }
  }
}
</script>
