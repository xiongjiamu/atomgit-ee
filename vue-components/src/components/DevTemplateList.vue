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
        定义昇腾 / 鲲鹏实例模板，配置使用的镜像、实例规格、资源池、持久化挂盘、初始化/升级脚本与可见范围。镜像经过配置后成为用户可用的模板，用户申请环境时使用该模板实例化成开发环境；上架前可添加白名单（验证名单）进行灰度验证。模板上架需通过必填项、镜像状态、资源池状态、脚本配置与白名单策略校验。
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
        <div class="flex flex-wrap items-center gap-3">
          <select v-model="resTypeFilter" class="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-2 px-3 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option value="all">全部资源类型</option>
            <option value="ASCEND">昇腾</option>
            <option value="KUNPENG">鲲鹏</option>
          </select>
          <select v-model="visibilityFilter" class="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-2 px-3 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option value="all">全部可见范围</option>
            <option value="public">公开</option>
            <option value="inner">对内</option>
            <option value="gray">灰度白名单</option>
          </select>
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
      </div>

      <!-- Table -->
      <div class="overflow-x-auto custom-scrollbar">
        <table class="w-full text-left border-collapse min-w-[1400px]">
          <thead>
            <tr class="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100 dark:border-slate-800 whitespace-nowrap">
              <th class="px-3 py-4 text-center">序号</th>
              <th class="px-3 py-4">模板ID</th>
              <th class="px-3 py-4">模板名称</th>
              <th class="px-3 py-4">资源类型</th>
              <th class="px-3 py-4">镜像</th>
              <th class="px-3 py-4">实例规格</th>
              <th class="px-3 py-4">资源池</th>
              <th class="px-3 py-4">可见范围</th>
              <th class="px-3 py-4">状态</th>
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
                <div class="font-bold text-slate-900 dark:text-white text-sm whitespace-nowrap">{{ tpl.name }}</div>
                <div class="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 max-w-[220px]" :title="tpl.description">{{ tpl.description }}</div>
              </td>
              <td class="px-3 py-4">
                <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wider border whitespace-nowrap" :class="typeBadgeClass(tpl.type)">{{ tpl.type }}</span>
              </td>
              <td class="px-3 py-4 text-xs font-mono text-slate-500 dark:text-slate-400">
                <span class="block max-w-[160px] truncate" :title="tpl.image">{{ tpl.image }}</span>
              </td>
              <td class="px-3 py-4 text-xs text-slate-600 dark:text-slate-300 whitespace-nowrap">{{ tpl.spec }}</td>
              <td class="px-3 py-4 text-xs text-slate-600 dark:text-slate-300 whitespace-nowrap">{{ tpl.pool }}</td>
              <td class="px-3 py-4">
                <span class="inline-flex items-center gap-1 text-xs font-bold whitespace-nowrap" :class="visibilityMeta(tpl.visibility).text">
                  <span class="material-icons-round text-sm">{{ visibilityMeta(tpl.visibility).icon }}</span>
                  {{ visibilityMeta(tpl.visibility).label }}
                </span>
              </td>
              <td class="px-3 py-4">
                <span class="inline-flex items-center gap-1.5 text-xs font-bold whitespace-nowrap" :class="statusMeta(tpl.status).text">
                  <span class="h-2 w-2 rounded-full" :class="statusMeta(tpl.status).dot"></span>
                  {{ statusMeta(tpl.status).label }}
                </span>
              </td>
              <td class="px-3 py-4 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{{ tpl.updatedAt }}</td>
              <td class="px-3 py-4 text-right whitespace-nowrap">
                <div class="flex items-center justify-end gap-3">
                  <button class="text-xs font-bold text-primary hover:underline" @click="openDetailDrawer(tpl)">详情</button>
                  <button class="text-xs font-bold text-primary hover:underline" @click="handleEdit(tpl)">编辑</button>
                  <button class="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:underline" @click="handleCopy(tpl)">复制</button>
                  <button class="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:underline" @click="handleWhitelist(tpl)">验证名单</button>
                  <button
                    v-if="tpl.status === 'published'"
                    class="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
                    @click="handleUnpublish(tpl)"
                  >下架</button>
                  <button
                    v-else
                    class="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                    @click="openPublishModal(tpl)"
                  >上架</button>
                  <button v-if="tpl.status !== 'published'" class="text-xs font-bold text-rose-500 hover:underline" @click="handleDelete(tpl)">删除</button>
                </div>
              </td>
            </tr>
            <!-- Empty -->
            <tr v-if="filteredTemplates.length === 0">
              <td colspan="11" class="px-6 py-12 text-center text-slate-400 dark:text-slate-600">
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
          共 <span class="font-bold text-slate-700 dark:text-slate-200">{{ filteredTemplates.length }}</span> 条记录
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

    <!-- Add / Edit Template Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showModal" class="fixed z-[9999] inset-0 overflow-y-auto" role="dialog" aria-modal="true">
          <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" @click="showModal = false"></div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="inline-block align-bottom bg-white dark:bg-surface-dark rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full border border-gray-200 dark:border-gray-700 flex flex-col max-h-[90vh]">
              <!-- Header -->
              <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-[#161B22] shrink-0">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ editingId ? '编辑模板' : '添加模板' }}</h3>
                <button class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" @click="showModal = false">
                  <span class="material-icons-round">close</span>
                </button>
              </div>

              <!-- Stepper -->
              <div class="px-6 pt-4 shrink-0">
                <div class="flex items-center gap-2">
                  <button
                    v-for="(s, i) in steps"
                    :key="s.key"
                    @click="activeStep = i"
                    class="flex items-center gap-2 text-xs font-black transition-colors"
                  >
                    <span
                      class="w-6 h-6 rounded-full flex items-center justify-center text-[11px]"
                      :class="activeStep >= i ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'"
                    >{{ i + 1 }}</span>
                    <span :class="activeStep === i ? 'text-slate-900 dark:text-white' : 'text-slate-400'">{{ s.label }}</span>
                    <span v-if="i < steps.length - 1" class="material-icons-round text-slate-300 text-sm mx-1">chevron_right</span>
                  </button>
                </div>
              </div>

              <!-- Body -->
              <div class="px-6 py-5 overflow-y-auto custom-scrollbar flex-1">
                <!-- Step 0: 基础信息 -->
                <div v-show="activeStep === 0" class="space-y-4">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-bold text-gray-900 dark:text-white mb-1.5">模板名称 <span class="text-rose-500">*</span></label>
                      <input v-model="form.name" type="text" placeholder="模板名称需唯一" :disabled="isPublishedEditing" class="block w-full sm:text-sm rounded-md py-2 px-3 transition-colors disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-slate-700/50 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary focus:border-primary" />
                    </div>
                    <div>
                      <label class="block text-sm font-bold text-gray-900 dark:text-white mb-1.5">资源类型 <span class="text-rose-500">*</span></label>
                      <select v-model="form.resType" :disabled="isPublishedEditing" class="block w-full sm:text-sm rounded-md py-2 px-3 transition-colors disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-slate-700/50 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary focus:border-primary">
                        <option value="ASCEND">昇腾（NPU）</option>
                        <option value="KUNPENG">鲲鹏（CPU）</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-bold text-gray-900 dark:text-white mb-1.5">模板描述</label>
                    <textarea v-model="form.description" rows="2" placeholder="简述模板用途与适用场景" class="block w-full sm:text-sm rounded-md py-2 px-3 transition-colors border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary focus:border-primary resize-none"></textarea>
                  </div>
                  <div>
                    <label class="block text-sm font-bold text-gray-900 dark:text-white mb-1.5">适用场景（多选）</label>
                    <div class="flex flex-wrap gap-2">
                      <button
                        v-for="sc in sceneOptions"
                        :key="sc"
                        @click="toggleScene(sc)"
                        class="px-3 py-1.5 rounded-lg text-xs font-bold border transition-all"
                        :class="form.scenes.includes(sc) ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary'"
                      >{{ sc }}</button>
                    </div>
                  </div>
                </div>

                <!-- Step 1: 镜像与规格 -->
                <div v-show="activeStep === 1" class="space-y-4">
                  <div>
                    <label class="block text-sm font-bold text-gray-900 dark:text-white mb-1.5">镜像 <span class="text-rose-500">*</span></label>
                    <select v-model="form.image" :disabled="isPublishedEditing" class="block w-full sm:text-sm rounded-md py-2 px-3 transition-colors disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-slate-700/50 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary focus:border-primary">
                      <option value="">请选择已上架镜像</option>
                      <option v-for="img in imageOptions" :key="img" :value="img">{{ img }}</option>
                    </select>
                    <p class="mt-1.5 text-xs text-gray-400">仅可选已上架且架构匹配的镜像；镜像架构与资源类型不匹配时禁止保存。</p>
                  </div>
                  <div class="grid grid-cols-3 gap-4">
                    <div>
                      <label class="block text-sm font-bold text-gray-900 dark:text-white mb-1.5">CPU（核）</label>
                      <input v-model.number="form.cpu" type="number" min="1" class="block w-full sm:text-sm rounded-md py-2 px-3 transition-colors border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary focus:border-primary" />
                    </div>
                    <div>
                      <label class="block text-sm font-bold text-gray-900 dark:text-white mb-1.5">内存（GB）</label>
                      <input v-model.number="form.memory" type="number" min="1" class="block w-full sm:text-sm rounded-md py-2 px-3 transition-colors border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary focus:border-primary" />
                    </div>
                    <div>
                      <label class="block text-sm font-bold text-gray-900 dark:text-white mb-1.5">NPU 卡型</label>
                      <select v-model="form.npu" :disabled="form.resType !== 'ASCEND'" class="block w-full sm:text-sm rounded-md py-2 px-3 transition-colors disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-slate-700/50 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary focus:border-primary">
                        <option value="">不适用</option>
                        <option>Ascend 910B</option>
                        <option>Ascend 310P</option>
                        <option>Ascend A3</option>
                      </select>
                    </div>
                  </div>
                </div>

                <!-- Step 2: 资源池 -->
                <div v-show="activeStep === 2" class="space-y-4">
                  <div>
                    <label class="block text-sm font-bold text-gray-900 dark:text-white mb-1.5">资源池类型 <span class="text-rose-500">*</span></label>
                    <div class="flex gap-3">
                      <button
                        v-for="p in poolTypes"
                        :key="p.value"
                        @click="form.poolType = p.value"
                        class="flex-1 px-4 py-3 rounded-lg border text-left transition-all"
                        :class="form.poolType === p.value ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-slate-200 dark:border-slate-700 hover:border-primary'"
                      >
                        <div class="text-sm font-bold text-slate-900 dark:text-white">{{ p.label }}</div>
                        <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{{ p.desc }}</div>
                      </button>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-bold text-gray-900 dark:text-white mb-1.5">资源池标识 <span class="text-rose-500">*</span></label>
                    <select v-model="form.pool" class="block w-full sm:text-sm rounded-md py-2 px-3 transition-colors border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary focus:border-primary">
                      <option value="">请选择可实例化的资源池</option>
                      <option v-for="p in availablePools" :key="p" :value="p">{{ p }}</option>
                    </select>
                    <p class="mt-1.5 text-xs text-gray-400">资源池不可用时模板不可上架；上架前会校验资源池与规格有效性。</p>
                  </div>
                </div>

                <!-- Step 3: 持久化挂盘 -->
                <div v-show="activeStep === 3" class="space-y-4">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input v-model="form.mountEnabled" type="checkbox" class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                    <span class="text-sm font-bold text-gray-900 dark:text-white">开启持久化挂盘</span>
                  </label>
                  <div v-if="form.mountEnabled" class="grid grid-cols-3 gap-4">
                    <div>
                      <label class="block text-sm font-bold text-gray-900 dark:text-white mb-1.5">挂载路径</label>
                      <input v-model="form.mountPath" type="text" placeholder="/home/ma-user/work" class="block w-full sm:text-sm rounded-md py-2 px-3 font-mono transition-colors border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary focus:border-primary" />
                    </div>
                    <div>
                      <label class="block text-sm font-bold text-gray-900 dark:text-white mb-1.5">容量（GB）</label>
                      <input v-model.number="form.mountSize" type="number" min="10" class="block w-full sm:text-sm rounded-md py-2 px-3 transition-colors border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary focus:border-primary" />
                    </div>
                    <div>
                      <label class="block text-sm font-bold text-gray-900 dark:text-white mb-1.5">是否保留数据</label>
                      <select v-model="form.mountKeep" class="block w-full sm:text-sm rounded-md py-2 px-3 transition-colors border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary focus:border-primary">
                        <option :value="true">释放后保留</option>
                        <option :value="false">释放后销毁</option>
                      </select>
                    </div>
                  </div>
                  <p class="text-xs text-gray-400">支持不开启持久化、固定容量、按规格配置等模式；配置将在用户申请页明确展示。</p>
                </div>

                <!-- Step 4: 脚本配置 -->
                <div v-show="activeStep === 4" class="space-y-4">
                  <div>
                    <label class="block text-sm font-bold text-gray-900 dark:text-white mb-1.5">初始化脚本路径</label>
                    <input v-model="form.initScript" type="text" placeholder="obs://cannlab/scripts/init.sh" class="block w-full sm:text-sm rounded-md py-2 px-3 font-mono transition-colors border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary focus:border-primary" />
                  </div>
                  <div>
                    <label class="block text-sm font-bold text-gray-900 dark:text-white mb-1.5">启动脚本路径</label>
                    <input v-model="form.startScript" type="text" placeholder="obs://cannlab/scripts/start.sh" class="block w-full sm:text-sm rounded-md py-2 px-3 font-mono transition-colors border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary focus:border-primary" />
                  </div>
                  <div>
                    <label class="block text-sm font-bold text-gray-900 dark:text-white mb-1.5">CANN 包升级脚本路径</label>
                    <input v-model="form.upgradeScript" type="text" placeholder="obs://cannlab/scripts/cann-upgrade.sh" class="block w-full sm:text-sm rounded-md py-2 px-3 font-mono transition-colors border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary focus:border-primary" />
                  </div>
                  <p class="text-xs text-gray-400">需记录脚本来源、版本与执行顺序；保存时校验路径格式。脚本用于支持 CANN 包升级等能力。</p>
                </div>

                <!-- Step 5: 可见性与灰度白名单 -->
                <div v-show="activeStep === 5" class="space-y-4">
                  <div>
                    <label class="block text-sm font-bold text-gray-900 dark:text-white mb-1.5">可见范围 <span class="text-rose-500">*</span></label>
                    <div class="flex gap-3">
                      <button
                        v-for="v in visibilityOptions"
                        :key="v.value"
                        @click="form.visibility = v.value"
                        class="flex-1 px-4 py-3 rounded-lg border text-left transition-all"
                        :class="form.visibility === v.value ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-slate-200 dark:border-slate-700 hover:border-primary'"
                      >
                        <div class="text-sm font-bold text-slate-900 dark:text-white">{{ v.label }}</div>
                        <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{{ v.desc }}</div>
                      </button>
                    </div>
                  </div>
                  <div v-if="form.visibility === 'gray'" class="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/40 rounded-lg px-4 py-3 flex items-start gap-2">
                    <span class="material-icons-round text-blue-500 text-lg">verified_user</span>
                    <div class="text-xs text-blue-800 dark:text-blue-200">
                      灰度模式下仅白名单账号可见 / 可申请该模板。保存后可前往「验证名单」维护灰度账号；灰度通过后可切换为公开可见。
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-bold text-gray-900 dark:text-white mb-1.5">超时自动释放（小时）</label>
                    <input v-model.number="form.timeoutHours" type="number" min="0" placeholder="0 表示不自动释放" class="block w-full sm:text-sm rounded-md py-2 px-3 transition-colors border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary focus:border-primary" />
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="bg-gray-50 dark:bg-gray-800/50 px-6 py-3 flex justify-between items-center border-t border-gray-200 dark:border-gray-700 shrink-0">
                <button
                  v-if="activeStep > 0"
                  class="inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-surface-dark text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  @click="activeStep--"
                >
                  <span class="material-icons-round text-sm mr-1">chevron_left</span> 上一步
                </button>
                <div v-else></div>
                <div class="flex gap-3">
                  <button class="inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-surface-dark text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" @click="showModal = false">取消</button>
                  <button
                    v-if="activeStep < steps.length - 1"
                    class="inline-flex items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-sm font-medium text-white hover:bg-blue-600 transition-colors active:scale-95"
                    @click="activeStep++"
                  >下一步 <span class="material-icons-round text-sm ml-1">chevron_right</span></button>
                  <button
                    v-else
                    class="inline-flex items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-sm font-medium text-white hover:bg-blue-600 transition-colors active:scale-95"
                    @click="handleSubmit"
                  >保存模板</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Publish Precheck Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        enter-to-class="opacity-100 translate-y-0 sm:scale-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0 sm:scale-100"
        leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      >
        <div v-if="showPublishModal" class="fixed z-[9999] inset-0 overflow-y-auto" role="dialog" aria-modal="true">
          <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" aria-hidden="true" @click="showPublishModal = false"></div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="inline-block align-bottom bg-white dark:bg-surface-dark rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-gray-200 dark:border-gray-700">
              <div class="px-6 pt-5 pb-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 class="text-lg leading-6 font-bold text-gray-900 dark:text-white">上架校验</h3>
                <button class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors" @click="showPublishModal = false">
                  <span class="material-icons-round">close</span>
                </button>
              </div>
              <div class="px-6 py-5 space-y-4">
                <p class="text-xs text-slate-500 dark:text-slate-400">上架前需通过以下校验项，存在阻断项时不可上架。模板「<b class="text-slate-700 dark:text-slate-200">{{ publishTarget && publishTarget.name }}</b>」校验结果如下：</p>
                <ul class="space-y-2">
                  <li v-for="c in publishChecks" :key="c.key" class="flex items-start gap-2.5 text-sm">
                    <span class="material-icons-round text-lg flex-shrink-0 mt-0.5" :class="c.pass ? 'text-emerald-500' : 'text-rose-500'">{{ c.pass ? 'check_circle' : 'cancel' }}</span>
                    <div>
                      <div class="font-bold text-slate-900 dark:text-white">{{ c.label }}</div>
                      <div class="text-xs text-slate-500 dark:text-slate-400">{{ c.detail }}</div>
                    </div>
                  </li>
                </ul>
                <div v-if="publishBlockers > 0" class="flex items-start gap-2 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/40 rounded-lg px-4 py-3">
                  <span class="material-icons-round text-rose-500 text-lg mt-0.5">block</span>
                  <p class="text-xs text-rose-700 dark:text-rose-300">存在 {{ publishBlockers }} 项阻断校验未通过，请先修正后再上架。阻断项会阻止模板对用户开放。</p>
                </div>
                <div v-else class="flex items-start gap-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/40 rounded-lg px-4 py-3">
                  <span class="material-icons-round text-emerald-500 text-lg mt-0.5">task_alt</span>
                  <p class="text-xs text-emerald-700 dark:text-emerald-300">所有校验通过，可执行上架。上架后模板将呈现在 CANNLab Portal 申请页。</p>
                </div>
              </div>
              <div class="bg-gray-50 dark:bg-gray-800/50 px-6 py-3 sm:flex sm:flex-row-reverse border-t border-gray-200 dark:border-gray-700">
                <button type="button" :disabled="publishBlockers > 0" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm transition-colors active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed" @click="confirmPublish">确认上架</button>
                <button type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-surface-dark text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm transition-colors" @click="showPublishModal = false">取消</button>
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
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-start justify-between">
              <div class="min-w-0 pr-4">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white truncate">{{ detailTarget.name }}</h3>
                <p class="text-xs font-mono text-slate-400 mt-0.5">{{ detailTarget.tplId }}</p>
              </div>
              <button class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors" @click="detailTarget = null">
                <span class="material-icons-round">close</span>
              </button>
            </div>
            <div class="flex-1 overflow-y-auto custom-scrollbar px-6 py-5 space-y-6">
              <!-- Status -->
              <div class="flex items-center gap-3 flex-wrap">
                <span class="inline-flex items-center gap-1.5 text-xs font-bold" :class="statusMeta(detailTarget.status).text">
                  <span class="h-2 w-2 rounded-full" :class="statusMeta(detailTarget.status).dot"></span>{{ statusMeta(detailTarget.status).label }}
                </span>
                <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wider border" :class="typeBadgeClass(detailTarget.type)">{{ detailTarget.type }}</span>
                <span class="inline-flex items-center gap-1 text-xs font-bold" :class="visibilityMeta(detailTarget.visibility).text">
                  <span class="material-icons-round text-sm">{{ visibilityMeta(detailTarget.visibility).icon }}</span>{{ visibilityMeta(detailTarget.visibility).label }}
                </span>
              </div>
              <!-- Sections -->
              <div>
                <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-3">基础信息</h4>
                <dl class="space-y-2 text-sm">
                  <div class="flex justify-between gap-4"><dt class="text-slate-500 dark:text-slate-400">模板名称</dt><dd class="font-bold text-slate-900 dark:text-white text-right">{{ detailTarget.name }}</dd></div>
                  <div class="flex justify-between gap-4"><dt class="text-slate-500 dark:text-slate-400">模板描述</dt><dd class="text-slate-700 dark:text-slate-200 text-right">{{ detailTarget.description || '—' }}</dd></div>
                  <div class="flex justify-between gap-4"><dt class="text-slate-500 dark:text-slate-400">资源类型</dt><dd class="font-bold text-slate-900 dark:text-white">{{ detailTarget.resType === 'ASCEND' ? '昇腾（NPU）' : '鲲鹏（CPU）' }}</dd></div>
                </dl>
              </div>
              <div>
                <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-3">镜像与规格</h4>
                <dl class="space-y-2 text-sm">
                  <div class="flex justify-between gap-4"><dt class="text-slate-500 dark:text-slate-400">镜像</dt><dd class="font-mono text-xs text-slate-700 dark:text-slate-200 text-right">{{ detailTarget.image }}</dd></div>
                  <div class="flex justify-between gap-4"><dt class="text-slate-500 dark:text-slate-400">实例规格</dt><dd class="font-bold text-slate-900 dark:text-white">{{ detailTarget.spec }}</dd></div>
                  <div class="flex justify-between gap-4"><dt class="text-slate-500 dark:text-slate-400">资源池</dt><dd class="font-bold text-slate-900 dark:text-white">{{ detailTarget.pool }}</dd></div>
                </dl>
              </div>
              <div>
                <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-3">可见性与灰度</h4>
                <dl class="space-y-2 text-sm">
                  <div class="flex justify-between gap-4"><dt class="text-slate-500 dark:text-slate-400">可见范围</dt><dd class="font-bold text-slate-900 dark:text-white">{{ visibilityMeta(detailTarget.visibility).label }}</dd></div>
                  <div v-if="detailTarget.visibility === 'gray'" class="flex justify-between gap-4"><dt class="text-slate-500 dark:text-slate-400">灰度白名单</dt><dd class="text-slate-700 dark:text-slate-200">已绑定，仅白名单账号可见 / 可申请</dd></div>
                  <div class="flex justify-between gap-4"><dt class="text-slate-500 dark:text-slate-400">引用镜像状态</dt><dd class="text-emerald-600 dark:text-emerald-400 font-bold">已上架 · 可用</dd></div>
                </dl>
              </div>
              <div>
                <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-3">操作审计</h4>
                <dl class="space-y-2 text-sm">
                  <div class="flex justify-between gap-4"><dt class="text-slate-500 dark:text-slate-400">创建时间</dt><dd class="text-slate-700 dark:text-slate-200">{{ detailTarget.updatedAt }}</dd></div>
                  <div class="flex justify-between gap-4"><dt class="text-slate-500 dark:text-slate-400">最近操作人</dt><dd class="font-bold text-slate-900 dark:text-white">admin</dd></div>
                  <div class="flex justify-between gap-4"><dt class="text-slate-500 dark:text-slate-400">操作类型</dt><dd class="font-bold text-slate-900 dark:text-white">{{ detailTarget.status === 'published' ? '上架' : '配置维护' }}</dd></div>
                </dl>
              </div>
            </div>
            <div class="px-6 py-3 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button class="inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-surface-dark text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" @click="detailTarget = null">关闭</button>
              <button class="inline-flex items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-sm font-medium text-white hover:bg-blue-600 transition-colors" @click="handleWhitelist(detailTarget); detailTarget = null">管理验证名单</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
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
      resTypeFilter: 'all',
      visibilityFilter: 'all',
      filters: [
        { label: '全部', value: 'all' },
        { label: '已上架', value: 'published' },
        { label: '未上架', value: 'unpublished' }
      ],
      showModal: false,
      activeStep: 0,
      editingId: null,
      isPublishedEditing: false,
      showPublishModal: false,
      publishTarget: null,
      detailTarget: null,
      steps: [
        { key: 'basic', label: '基础信息' },
        { key: 'image', label: '镜像与规格' },
        { key: 'pool', label: '资源池' },
        { key: 'mount', label: '持久化挂盘' },
        { key: 'script', label: '脚本配置' },
        { key: 'visibility', label: '可见性与灰度' }
      ],
      sceneOptions: ['AI Agent 编程', '模型训练', '推理体验', '大模型微调', 'CANN 包升级'],
      imageOptions: ['cann_9.0.0-beta.3-py3.12-a5-arm', 'mindspore_base-910b', 'cann_kunpeng-arm', 'pytorch_npu-a3', 'cann_agent-a5'],
      poolTypes: [
        { value: 'inner', label: '内部资源池', desc: '内部测试资源池，限额管理' },
        { value: 'outer', label: '外部资源池', desc: '外部用户资源池，按规格匹配' }
      ],
      visibilityOptions: [
        { value: 'public', label: '公开可见', desc: '所有授权用户可申请' },
        { value: 'inner', label: '仅对内可见', desc: '仅内部用户可见' },
        { value: 'gray', label: '灰度白名单', desc: '仅白名单账号可见 / 可申请' }
      ],
      form: this.emptyForm(),
      templates: [
        { id: 1, tplId: 'tpl-3a2b6457', name: 'AI Agent 编程实战环境模板', description: '预置 cann 算子生成 skill，GLM6 模型，开箱即用', type: 'KUNPENG_SIMULATE', resType: 'KUNPENG', image: 'cann_9.0.0-beta.3-py3.12-a5-arm', spec: '8核 / 16GB', pool: '内部-KP-01', visibility: 'public', status: 'published', updatedAt: '2026-05-11 19:48:25' },
        { id: 2, tplId: 'tpl-7c1d92ef', name: '昇腾训练基础模板', description: '昇腾 910B 训练环境，预置 MindSpore 与 CANN 包升级脚本', type: 'ASCEND_INNER', resType: 'ASCEND', image: 'mindspore_base-910b', spec: '8核 / 64GB / 910B×1', pool: '内部-AS-01', visibility: 'inner', status: 'published', updatedAt: '2026-05-10 14:21:08' },
        { id: 3, tplId: 'tpl-9e4f1a3c', name: '鲲鹏推理体验模板', description: '鲲鹏 CPU 推理环境，对外开放，按规格匹配外部资源池', type: 'KUNPENG_OUTER', resType: 'KUNPENG', image: 'cann_kunpeng-arm', spec: '4核 / 8GB', pool: '外部-KP-公测', visibility: 'public', status: 'unpublished', updatedAt: '2026-05-08 09:55:30' },
        { id: 4, tplId: 'tpl-2b8a07d5', name: '昇腾外部体验模板', description: '对外开放的昇腾体验环境，持久化挂盘，超时 4 小时自动释放', type: 'ASCEND_OUTER', resType: 'ASCEND', image: 'pytorch_npu-a3', spec: '4核 / 32GB / A3×1', pool: '外部-AS-公测', visibility: 'gray', status: 'unpublished', updatedAt: '2026-05-05 16:40:12' },
        { id: 5, tplId: 'tpl-5d3c81fa', name: '昇腾大模型微调模板', description: '面向内部用户，CPU/NPU 无限额，内部资源池，支持 CANN 包升级', type: 'ASCEND_INNER', resType: 'ASCEND', image: 'cann_agent-a5', spec: '16核 / 128GB / 910B×2', pool: '内部-AS-01', visibility: 'inner', status: 'published', updatedAt: '2026-05-03 11:02:47' }
      ]
    }
  },
  computed: {
    filteredTemplates() {
      const q = this.searchQuery.trim().toLowerCase()
      return this.templates.filter(tpl => {
        const matchesSearch = !q || tpl.name.toLowerCase().includes(q) || tpl.tplId.toLowerCase().includes(q) || tpl.type.toLowerCase().includes(q)
        const matchesFilter = this.currentFilter === 'all' ? true : this.currentFilter === 'published' ? tpl.status === 'published' : tpl.status !== 'published'
        const matchesRes = this.resTypeFilter === 'all' ? true : tpl.resType === this.resTypeFilter
        const matchesVis = this.visibilityFilter === 'all' ? true : tpl.visibility === this.visibilityFilter
        return matchesSearch && matchesFilter && matchesRes && matchesVis
      })
    },
    availablePools() {
      if (this.form.poolType === 'inner') return ['内部-AS-01', '内部-AS-02', '内部-KP-01']
      return ['外部-AS-公测', '外部-KP-公测', '外部-AS-体验']
    },
    typeForForm() {
      if (this.form.resType === 'ASCEND') return this.form.poolType === 'outer' ? 'ASCEND_OUTER' : 'ASCEND_INNER'
      return this.form.poolType === 'outer' ? 'KUNPENG_OUTER' : 'KUNPENG_SIMULATE'
    },
    publishChecks() {
      const t = this.publishTarget
      if (!t) return []
      const hasImage = !!t.image
      const hasPool = !!t.pool
      return [
        { key: 'required', label: '必填项完整性', detail: hasImage && hasPool ? '名称 / 镜像 / 资源池等必填项已填写' : '存在缺失的必填项', pass: hasImage && hasPool },
        { key: 'image', label: '镜像状态', detail: hasImage ? '引用镜像已上架，架构与资源类型匹配' : '未选择镜像', pass: hasImage },
        { key: 'pool', label: '资源池状态', detail: hasPool ? '资源池可用，规格有效' : '未绑定资源池', pass: hasPool },
        { key: 'script', label: '脚本配置', detail: '初始化 / 启动 / CANN 升级脚本路径格式有效', pass: true },
        { key: 'whitelist', label: '白名单策略', detail: t.visibility === 'gray' ? '灰度模式：已绑定白名单账号' : '公开 / 对内可见，无需灰度白名单', pass: true }
      ]
    },
    publishBlockers() {
      return this.publishChecks.filter(c => !c.pass).length
    }
  },
  methods: {
    emptyForm() {
      return {
        name: '', resType: 'ASCEND', description: '', scenes: [],
        image: '', cpu: 8, memory: 32, npu: 'Ascend 910B',
        poolType: 'inner', pool: '',
        mountEnabled: false, mountPath: '/home/ma-user/work', mountSize: 50, mountKeep: true,
        initScript: '', startScript: '', upgradeScript: '',
        visibility: 'gray', timeoutHours: 4
      }
    },
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
    visibilityMeta(v) {
      const map = {
        public: { label: '公开', icon: 'public', text: 'text-emerald-600 dark:text-emerald-400' },
        inner: { label: '对内', icon: 'lock', text: 'text-slate-500 dark:text-slate-400' },
        gray: { label: '灰度', icon: 'verified_user', text: 'text-amber-600 dark:text-amber-400' }
      }
      return map[v] || map.gray
    },
    toggleScene(sc) {
      const i = this.form.scenes.indexOf(sc)
      if (i >= 0) this.form.scenes.splice(i, 1)
      else this.form.scenes.push(sc)
    },
    handleAdd() {
      this.form = this.emptyForm()
      this.editingId = null
      this.isPublishedEditing = false
      this.activeStep = 0
      this.showModal = true
    },
    handleEdit(tpl) {
      this.editingId = tpl.id
      this.isPublishedEditing = tpl.status === 'published'
      this.form = {
        name: tpl.name, resType: tpl.resType, description: tpl.description, scenes: [],
        image: tpl.image, cpu: 8, memory: 32, npu: 'Ascend 910B',
        poolType: tpl.type.includes('OUTER') ? 'outer' : 'inner', pool: tpl.pool,
        mountEnabled: false, mountPath: '/home/ma-user/work', mountSize: 50, mountKeep: true,
        initScript: '', startScript: '', upgradeScript: '',
        visibility: tpl.visibility, timeoutHours: 4
      }
      this.activeStep = 0
      this.showModal = true
    },
    handleSubmit() {
      if (!this.form.name) { alert('请填写模板名称'); this.activeStep = 0; return }
      if (!this.form.image) { alert('请选择镜像'); this.activeStep = 1; return }
      if (!this.form.pool) { alert('请选择资源池'); this.activeStep = 2; return }
      const spec = `${this.form.cpu}核 / ${this.form.memory}GB` + (this.form.resType === 'ASCEND' && this.form.npu ? ` / ${this.form.npu}×1` : '')
      const payload = {
        name: this.form.name,
        description: this.form.description,
        resType: this.form.resType,
        type: this.typeForForm,
        image: this.form.image,
        spec,
        pool: this.form.pool,
        visibility: this.form.visibility,
        updatedAt: '2026-06-30 10:15:00'
      }
      if (this.editingId) {
        const t = this.templates.find(x => x.id === this.editingId)
        Object.assign(t, payload)
      } else {
        this.templates.unshift({
          id: Date.now(),
          tplId: 'tpl-' + Math.random().toString(16).slice(2, 10),
          status: 'unpublished',
          ...payload
        })
      }
      this.showModal = false
    },
    handleWhitelist(tpl) {
      this.$emit('open-whitelist', { id: tpl.id, name: tpl.name, tplId: tpl.tplId })
    },
    handlePublish(tpl) {
      this.openPublishModal(tpl)
    },
    openPublishModal(tpl) {
      this.publishTarget = tpl
      this.showPublishModal = true
    },
    confirmPublish() {
      if (this.publishBlockers > 0) return
      const t = this.publishTarget
      t.status = 'published'
      t.updatedAt = '2026-06-30 10:15:00'
      this.showPublishModal = false
      this.publishTarget = null
    },
    handleCopy(tpl) {
      this.templates.unshift({
        id: Date.now(),
        tplId: 'tpl-' + Math.random().toString(16).slice(2, 10),
        name: tpl.name + ' (副本)',
        description: tpl.description,
        resType: tpl.resType,
        type: tpl.type,
        image: tpl.image,
        spec: tpl.spec,
        pool: tpl.pool,
        visibility: 'gray',
        status: 'unpublished',
        updatedAt: '2026-06-30 10:15:00'
      })
    },
    openDetailDrawer(tpl) {
      this.detailTarget = tpl
    },
    handleUnpublish(tpl) {
      if (confirm(`确认下架模板「${tpl.name}」吗？下架后 Portal 不再允许新申请，不影响存量实例。`)) {
        tpl.status = 'unpublished'
        tpl.updatedAt = '2026-06-30 10:15:00'
      }
    },
    handleDelete(tpl) {
      if (confirm(`确认删除模板 ${tpl.name} 吗？`)) {
        this.templates = this.templates.filter(t => t.id !== tpl.id)
      }
    }
  }
}
</script>
