<template>
  <div class="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <!-- Header -->
    <div class="flex items-center justify-between px-2">
      <div>
        <h1 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">卡时核时管理</h1>
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">CANNLab Core/Card Hour Quota Management</p>
      </div>
      <button
        class="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-lg active:scale-95 flex items-center gap-2"
        @click="openAdjustModal()"
      >
        <span class="material-icons-round text-lg">tune</span>
        调整额度
      </button>
    </div>

    <!-- Info Note -->
    <div class="flex items-start gap-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/40 rounded-xl px-4 py-3">
      <span class="material-icons-round text-blue-500 text-lg mt-0.5">info</span>
      <p class="text-xs leading-relaxed text-blue-800 dark:text-blue-200">
        管理 CANNLab 开发环境的算力额度：核时（鲲鹏 CPU）与卡时（昇腾 NPU）按 GitCode 账号维度独立计量。仅名单内用户可申请对应资源的开发环境，超额或欠费将自动冻结新申请，存量实例按原生命周期管理。
      </p>
    </div>

    <!-- Stat cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="s in statCards" :key="s.label" class="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
        <div class="flex items-center justify-between">
          <span class="text-xs font-black text-slate-400 uppercase tracking-wider">{{ s.label }}</span>
          <span class="material-icons-round text-lg" :class="s.iconClass">{{ s.icon }}</span>
        </div>
        <div class="mt-2 text-2xl font-black text-slate-900 dark:text-white">{{ s.value }}</div>
        <div class="text-xs text-slate-500 dark:text-slate-400 mt-1">{{ s.sub }}</div>
      </div>
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
            placeholder="搜索账号名称 / GitCode 用户 ID..."
            class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <!-- Resource type filter -->
          <div class="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-lg">
            <button
              v-for="f in typeFilters"
              :key="f.value"
              @click="currentType = f.value"
              class="px-4 py-1.5 text-xs font-black rounded-md transition-all whitespace-nowrap"
              :class="currentType === f.value ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'"
            >
              {{ f.label }}
            </button>
          </div>
          <!-- Status filter -->
          <select
            v-model="currentStatus"
            class="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-2 px-3 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">全部状态</option>
            <option value="normal">正常</option>
            <option value="over">超额</option>
            <option value="frozen">已冻结</option>
          </select>
          <!-- Year filter -->
          <select
            v-model="currentYear"
            class="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-2 px-3 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option v-for="y in years" :key="y" :value="y">{{ y }} 年度</option>
          </select>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto custom-scrollbar">
        <table class="w-full text-left border-collapse min-w-[1280px]">
          <thead>
            <tr class="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100 dark:border-slate-800 whitespace-nowrap">
              <th class="px-3 py-4 text-center">序号</th>
              <th class="px-3 py-4">GitCode 账号</th>
              <th class="px-3 py-4">资源类型</th>
              <th class="px-3 py-4 text-right">总额度</th>
              <th class="px-3 py-4 text-right">已使用</th>
              <th class="px-3 py-4 text-right">剩余</th>
              <th class="px-3 py-4 text-center">使用率</th>
              <th class="px-3 py-4">年度</th>
              <th class="px-3 py-4">状态</th>
              <th class="px-3 py-4">更新时间</th>
              <th class="px-3 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr v-for="(q, index) in filteredQuotas" :key="q.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
              <td class="px-3 py-4 text-center text-sm text-slate-500 dark:text-slate-400">{{ index + 1 }}</td>
              <td class="px-3 py-4">
                <div class="flex items-center gap-2.5">
                  <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" :class="q.avatarClass">{{ q.initial }}</div>
                  <div class="min-w-0">
                    <div class="font-bold text-slate-900 dark:text-white text-sm whitespace-nowrap">{{ q.name }}</div>
                    <div class="text-[11px] font-mono text-slate-400 truncate max-w-[150px]">{{ q.gitcodeId }}</div>
                  </div>
                </div>
              </td>
              <td class="px-3 py-4">
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold whitespace-nowrap" :class="resTypeMeta(q.type).badge">
                  <span class="material-icons-round text-sm">{{ resTypeMeta(q.type).icon }}</span>
                  {{ resTypeMeta(q.type).label }}
                </span>
              </td>
              <td class="px-3 py-4 text-right text-sm font-bold text-slate-900 dark:text-white font-mono whitespace-nowrap">{{ formatNum(q.total) }}</td>
              <td class="px-3 py-4 text-right text-sm font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap">{{ formatNum(q.used) }}</td>
              <td class="px-3 py-4 text-right text-sm font-mono whitespace-nowrap" :class="q.remaining < 0 ? 'text-rose-500 font-bold' : 'text-slate-600 dark:text-slate-300'">{{ formatNum(q.remaining) }}</td>
              <td class="px-3 py-4">
                <div class="flex items-center gap-2 justify-center">
                  <div class="w-20 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div class="h-full rounded-full transition-all" :class="usageBar(q.usageRate)" :style="{ width: Math.min(100, q.usageRate) + '%' }"></div>
                  </div>
                  <span class="text-xs font-bold w-9 text-right" :class="usageText(q.usageRate)">{{ q.usageRate.toFixed(0) }}%</span>
                </div>
              </td>
              <td class="px-3 py-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">{{ q.year }}</td>
              <td class="px-3 py-4">
                <span class="inline-flex items-center gap-1.5 text-xs font-bold whitespace-nowrap" :class="statusMeta(q.status).text">
                  <span class="h-2 w-2 rounded-full" :class="statusMeta(q.status).dot"></span>
                  {{ statusMeta(q.status).label }}
                </span>
              </td>
              <td class="px-3 py-4 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{{ q.updatedAt }}</td>
              <td class="px-3 py-4 text-right whitespace-nowrap">
                <div class="flex items-center justify-end gap-3">
                  <button class="text-xs font-bold text-primary hover:underline" @click="openAdjustModal(q)">调整额度</button>
                  <button class="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:underline" @click="openDetailDrawer(q)">明细</button>
                  <button
                    v-if="q.status !== 'frozen'"
                    class="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
                    @click="handleToggleFreeze(q)"
                  >冻结</button>
                  <button
                    v-else
                    class="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                    @click="handleToggleFreeze(q)"
                  >解冻</button>
                </div>
              </td>
            </tr>
            <!-- Empty -->
            <tr v-if="filteredQuotas.length === 0">
              <td colspan="11" class="px-6 py-12 text-center text-slate-400 dark:text-slate-600">
                <div class="flex flex-col items-center gap-2">
                  <span class="material-icons-round text-3xl opacity-50">search_off</span>
                  <span class="text-xs font-bold uppercase tracking-widest">没有找到匹配的额度记录</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div class="text-xs text-slate-500 dark:text-slate-400">
          共 <span class="font-bold text-slate-700 dark:text-slate-200">{{ filteredQuotas.length }}</span> 条记录
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

    <!-- Adjust Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        enter-to-class="opacity-100 translate-y-0 sm:scale-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0 sm:scale-100"
        leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      >
        <div v-if="showAdjustModal" class="fixed z-[9999] inset-0 overflow-y-auto" role="dialog" aria-modal="true">
          <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-900/60 transition-opacity backdrop-blur-sm" aria-hidden="true" @click="showAdjustModal = false"></div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="inline-block align-bottom bg-white dark:bg-surface-dark rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-gray-200 dark:border-gray-700">
              <div class="px-6 pt-5 pb-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 class="text-lg leading-6 font-bold text-gray-900 dark:text-white">调整算力额度</h3>
                <button class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors" @click="showAdjustModal = false">
                  <span class="material-icons-round">close</span>
                </button>
              </div>
              <div class="px-6 py-5 space-y-5">
                <div v-if="adjustForm.target" class="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg px-4 py-3">
                  <div class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold" :class="adjustForm.target.avatarClass">{{ adjustForm.target.initial }}</div>
                  <div>
                    <div class="text-sm font-bold text-gray-900 dark:text-white">{{ adjustForm.target.name }}</div>
                    <div class="text-xs font-mono text-slate-400">{{ adjustForm.target.gitcodeId }} · 当前剩余 {{ formatNum(adjustForm.target.remaining) }} {{ resUnit(adjustForm.target.type) }}</div>
                  </div>
                </div>
                <div v-else>
                  <label class="block text-sm font-bold text-gray-900 dark:text-white mb-1.5">选择 GitCode 账号</label>
                  <select
                    v-model="adjustForm.targetId"
                    class="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2 px-3 transition-colors"
                  >
                    <option :value="null" disabled>请选择账号</option>
                    <option v-for="q in quotas" :key="q.id" :value="q.id">{{ q.name }}（{{ q.gitcodeId }}）</option>
                  </select>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-bold text-gray-900 dark:text-white mb-1.5">资源类型</label>
                    <select v-model="adjustForm.type" class="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2 px-3 transition-colors">
                      <option value="card">卡时（昇腾 NPU）</option>
                      <option value="core">核时（鲲鹏 CPU）</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-bold text-gray-900 dark:text-white mb-1.5">调整方式</label>
                    <select v-model="adjustForm.action" class="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2 px-3 transition-colors">
                      <option value="add">增补额度</option>
                      <option value="deduct">扣减额度</option>
                      <option value="reset">重置为指定值</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-bold text-gray-900 dark:text-white mb-1.5">数量（{{ resUnit(adjustForm.type) }}）</label>
                  <input
                    v-model.number="adjustForm.amount"
                    type="number"
                    min="0"
                    step="0.001"
                    placeholder="请输入额度数量"
                    class="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2 px-3 font-mono transition-colors"
                  />
                  <p class="mt-1.5 text-xs text-gray-400">支持 3 位小数；增补/扣减为相对值，重置为绝对值。</p>
                </div>
                <div>
                  <label class="block text-sm font-bold text-gray-900 dark:text-white mb-1.5">操作原因 / 备注</label>
                  <textarea
                    v-model="adjustForm.reason"
                    rows="2"
                    placeholder="如：季度额度增补、灰度试点补偿、误用扣除等"
                    class="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2 px-3 transition-colors resize-none"
                  ></textarea>
                </div>
              </div>
              <div class="bg-gray-50 dark:bg-gray-800/50 px-6 py-3 sm:flex sm:flex-row-reverse border-t border-gray-200 dark:border-gray-700">
                <button type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-blue-600 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm transition-colors active:scale-95" @click="handleAdjustSubmit">确定调整</button>
                <button type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-surface-dark text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm transition-colors" @click="showAdjustModal = false">取消</button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Detail Drawer -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="detailTarget" class="fixed z-[9999] inset-0 overflow-y-auto" role="dialog" aria-modal="true">
          <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" @click="detailTarget = null"></div>
          <div class="absolute right-0 top-0 bottom-0 w-full max-w-xl bg-white dark:bg-surface-dark shadow-2xl flex flex-col">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">用量明细</h3>
                <p class="text-xs text-slate-500 mt-0.5">{{ detailTarget.name }} · {{ detailTarget.gitcodeId }}</p>
              </div>
              <button class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors" @click="detailTarget = null">
                <span class="material-icons-round">close</span>
              </button>
            </div>
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 grid grid-cols-3 gap-4">
              <div>
                <div class="text-[10px] font-black text-slate-400 uppercase tracking-wider">资源类型</div>
                <div class="text-sm font-bold text-slate-900 dark:text-white mt-1">{{ resTypeMeta(detailTarget.type).label }}</div>
              </div>
              <div>
                <div class="text-[10px] font-black text-slate-400 uppercase tracking-wider">总额度</div>
                <div class="text-sm font-bold text-slate-900 dark:text-white mt-1 font-mono">{{ formatNum(detailTarget.total) }}</div>
              </div>
              <div>
                <div class="text-[10px] font-black text-slate-400 uppercase tracking-wider">剩余</div>
                <div class="text-sm font-bold mt-1 font-mono" :class="detailTarget.remaining < 0 ? 'text-rose-500' : 'text-slate-900 dark:text-white'">{{ formatNum(detailTarget.remaining) }}</div>
              </div>
            </div>
            <div class="flex-1 overflow-y-auto custom-scrollbar px-6 py-4">
              <table class="w-full text-left">
                <thead>
                  <tr class="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100 dark:border-slate-800">
                    <th class="py-2 pr-3">时间</th>
                    <th class="py-2 pr-3">模板</th>
                    <th class="py-2 pr-3 text-right">变更</th>
                    <th class="py-2">备注</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr v-for="r in detailRecords" :key="r.id" class="text-xs">
                    <td class="py-2.5 pr-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">{{ r.time }}</td>
                    <td class="py-2.5 pr-3 text-slate-700 dark:text-slate-200 whitespace-nowrap">{{ r.template }}</td>
                    <td class="py-2.5 pr-3 text-right font-mono font-bold whitespace-nowrap" :class="r.delta > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'">{{ r.delta > 0 ? '+' : '' }}{{ formatNum(r.delta) }}</td>
                    <td class="py-2.5 text-slate-500 dark:text-slate-400">{{ r.note }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script>
export default {
  name: 'DevCoreTimeList',
  data() {
    return {
      searchQuery: '',
      currentType: 'all',
      currentStatus: 'all',
      currentYear: 2026,
      years: [2026, 2025],
      typeFilters: [
        { label: '全部', value: 'all' },
        { label: '卡时 NPU', value: 'card' },
        { label: '核时 CPU', value: 'core' }
      ],
      showAdjustModal: false,
      detailTarget: null,
      adjustForm: {
        targetId: null,
        target: null,
        type: 'card',
        action: 'add',
        amount: null,
        reason: ''
      },
      quotas: [
        { id: 1, name: 'zhangsan_test', gitcodeId: 'u_503067ed456146e9', initial: '张', avatarClass: 'bg-blue-50 dark:bg-blue-900/30 text-primary', type: 'card', total: 4855.0, used: 2969.962, remaining: 1885.038, year: 2026, status: 'normal', updatedAt: '2026-06-30 10:05:00' },
        { id: 2, name: 'lisi_gray', gitcodeId: 'u_a7de826e8be94906', initial: '李', avatarClass: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600', type: 'card', total: 1440.0, used: 2751.488, remaining: -1311.488, year: 2026, status: 'over', updatedAt: '2026-06-30 10:08:00' },
        { id: 3, name: 'pilot_user03', gitcodeId: 'u_8058045195e4a13', initial: 'P', avatarClass: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600', type: 'card', total: 1211032.0, used: 12969.395, remaining: 1198062.605, year: 2026, status: 'normal', updatedAt: '2026-06-30 10:05:00' },
        { id: 4, name: 'wangwu_dev', gitcodeId: 'u_ad8dac0d6b4245d6', initial: 'W', avatarClass: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600', type: 'card', total: 720.0, used: 939.464, remaining: -219.464, year: 2026, status: 'over', updatedAt: '2026-06-30 10:05:00' },
        { id: 5, name: 'zhaoliu_beta', gitcodeId: 'u_d9872dc179e04638', initial: 'Z', avatarClass: 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600', type: 'card', total: 10220.0, used: 3294.876, remaining: 6925.124, year: 2026, status: 'normal', updatedAt: '2026-06-30 10:05:00' },
        { id: 6, name: 'cann_intern07', gitcodeId: 'u_b320fee8ba344f9a', initial: 'C', avatarClass: 'bg-rose-50 dark:bg-rose-900/30 text-rose-600', type: 'card', total: 1440.0, used: 2587.236, remaining: 8852.764, year: 2026, status: 'frozen', updatedAt: '2026-06-30 10:08:00' },
        { id: 7, name: 'sunqi_inner', gitcodeId: 'u_279226a92ad141a8', initial: '孙', avatarClass: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600', type: 'core', total: 8720.0, used: 2215.102, remaining: 6504.898, year: 2026, status: 'normal', updatedAt: '2026-06-30 10:05:00' },
        { id: 8, name: 'huangba_aes', gitcodeId: 'u_69929e00b4824838', initial: '黄', avatarClass: 'bg-teal-50 dark:bg-teal-900/30 text-teal-600', type: 'core', total: 99999999.0, used: 873.432, remaining: 999846.568, year: 2026, status: 'normal', updatedAt: '2026-06-30 10:05:00' },
        { id: 9, name: 'wujiu_pilot', gitcodeId: 'u_d0b86e6677874555', initial: '吴', avatarClass: 'bg-orange-50 dark:bg-orange-900/30 text-orange-600', type: 'core', total: 720.0, used: 10470.766, remaining: -9750.766, year: 2025, status: 'over', updatedAt: '2026-06-30 10:05:00' },
        { id: 10, name: 'shi_gray', gitcodeId: 'u_2948419956174574', initial: '史', avatarClass: 'bg-pink-50 dark:bg-pink-900/30 text-pink-600', type: 'core', total: 9999999.999, used: 4813.064, remaining: 9995186.935, year: 2026, status: 'normal', updatedAt: '2026-06-30 10:05:00' }
      ],
      detailRecords: []
    }
  },
  computed: {
    quotasWithMeta() {
      return this.quotas.map(q => ({
        ...q,
        remaining: this.calcRemaining(q),
        usageRate: q.total > 0 ? (q.used / q.total) * 100 : (q.used > 0 ? 100 : 0)
      }))
    },
    filteredQuotas() {
      const q = this.searchQuery.trim().toLowerCase()
      return this.quotasWithMeta.filter(item => {
        const matchesSearch = !q || item.name.toLowerCase().includes(q) || item.gitcodeId.toLowerCase().includes(q)
        const matchesType = this.currentType === 'all' ? true : item.type === this.currentType
        const matchesStatus = this.currentStatus === 'all' ? true : item.status === this.currentStatus
        const matchesYear = item.year === this.currentYear
        return matchesSearch && matchesType && matchesStatus && matchesYear
      })
    },
    statCards() {
      const list = this.quotasWithMeta
      const card = list.filter(q => q.type === 'card')
      const core = list.filter(q => q.type === 'core')
      const totalAlloc = list.reduce((s, q) => s + q.total, 0)
      const overCount = list.filter(q => q.status === 'over' || q.remaining < 0).length
      return [
        { label: '卡时账号', value: card.length, sub: `已用 ${card.reduce((s, q) => s + q.used, 0).toFixed(0)} 卡时`, icon: 'memory', iconClass: 'text-emerald-500' },
        { label: '核时账号', value: core.length, sub: `已用 ${core.reduce((s, q) => s + q.used, 0).toFixed(0)} 核时`, icon: 'developer_board', iconClass: 'text-blue-500' },
        { label: '额度总量', value: this.formatNum(totalAlloc), sub: '核时 + 卡时合计', icon: 'account_balance', iconClass: 'text-violet-500' },
        { label: '超额 / 冻结', value: overCount, sub: '需运营关注处理', icon: 'warning', iconClass: 'text-amber-500' }
      ]
    }
  },
  methods: {
    calcRemaining(q) {
      return q.total - q.used
    },
    formatNum(n) {
      if (n == null) return '-'
      const abs = Math.abs(n)
      if (abs >= 100000) return (n / 1000).toFixed(2) + 'k'
      return n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 3 })
    },
    resUnit(type) {
      return type === 'card' ? '卡时' : '核时'
    },
    resTypeMeta(type) {
      const map = {
        card: { label: '卡时 NPU', icon: 'memory', badge: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' },
        core: { label: '核时 CPU', icon: 'developer_board', badge: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' }
      }
      return map[type] || map.card
    },
    statusMeta(status) {
      const map = {
        normal: { label: '正常', text: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' },
        over: { label: '超额', text: 'text-rose-500', dot: 'bg-rose-500' },
        frozen: { label: '已冻结', text: 'text-slate-400', dot: 'bg-slate-400' }
      }
      return map[status] || map.normal
    },
    usageBar(rate) {
      if (rate >= 100) return 'bg-rose-500'
      if (rate >= 80) return 'bg-amber-500'
      return 'bg-primary'
    },
    usageText(rate) {
      if (rate >= 100) return 'text-rose-500'
      if (rate >= 80) return 'text-amber-600 dark:text-amber-400'
      return 'text-slate-600 dark:text-slate-300'
    },
    openAdjustModal(q) {
      this.adjustForm = {
        targetId: q ? q.id : null,
        target: q ? { ...q } : null,
        type: q ? q.type : 'card',
        action: 'add',
        amount: null,
        reason: ''
      }
      this.showAdjustModal = true
    },
    handleAdjustSubmit() {
      const target = this.quotas.find(q => q.id === (this.adjustForm.target ? this.adjustForm.target.id : this.adjustForm.targetId))
      if (!target) {
        alert('请选择要调整额度的账号')
        return
      }
      if (this.adjustForm.action !== 'reset' && (!this.adjustForm.amount || this.adjustForm.amount <= 0)) {
        alert('请输入有效的额度数量')
        return
      }
      const amt = Number(this.adjustForm.amount) || 0
      if (this.adjustForm.action === 'add') target.total += amt
      else if (this.adjustForm.action === 'deduct') target.total = Math.max(0, target.total - amt)
      else if (this.adjustForm.action === 'reset') target.total = amt
      if (target.type !== this.adjustForm.type) target.type = this.adjustForm.type
      target.updatedAt = '2026-06-30 10:12:00'
      this.recomputeStatus(target)
      this.showAdjustModal = false
    },
    recomputeStatus(target) {
      const remaining = target.total - target.used
      if (target.status === 'frozen') return
      target.status = remaining < 0 ? 'over' : 'normal'
    },
    handleToggleFreeze(q) {
      if (q.status === 'frozen') {
        q.status = q.remaining < 0 ? 'over' : 'normal'
      } else {
        if (confirm(`确认冻结 ${q.name} 的 ${this.resTypeMeta(q.type).label} 额度吗？冻结后该账号不可发起新申请。`)) {
          q.status = 'frozen'
          q.updatedAt = '2026-06-30 10:12:00'
          return
        }
        return
      }
      q.updatedAt = '2026-06-30 10:12:00'
    },
    openDetailDrawer(q) {
      this.detailTarget = q
      this.detailRecords = this.buildRecords(q)
    },
    buildRecords(q) {
      return [
        { id: 1, time: '2026-06-30 10:05:00', template: 'AI Agent 编程实战环境模板', delta: -(q.used * 0.18), note: '环境实例运行扣减' },
        { id: 2, time: '2026-06-29 14:22:08', template: '昇腾大模型微调模板', delta: -(q.used * 0.32), note: '微调任务运行' },
        { id: 3, time: '2026-06-25 09:30:41', template: '季度额度增补', delta: q.total * 0.4, note: 'Q2 算力补偿' },
        { id: 4, time: '2026-06-18 16:11:55', template: '昇腾训练基础模板', delta: -(q.used * 0.5), note: '训练任务运行' },
        { id: 5, time: '2026-06-10 11:02:17', template: '初始分配', delta: q.total, note: '账号开通初始额度' }
      ]
    }
  }
}
</script>
