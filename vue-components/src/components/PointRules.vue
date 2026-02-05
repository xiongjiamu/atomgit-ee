<template>
  <div class="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <!-- Search Bar -->
    <div class="relative rounded-md shadow-sm">
      <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
        <span class="material-icons-round text-slate-400 text-xl">search</span>
      </div>
      <input
        type="text"
        class="focus:ring-primary focus:border-primary block w-full pl-10 pr-4 py-3 sm:text-sm border-slate-300 dark:border-slate-700 dark:bg-surface-dark dark:text-white rounded-xl transition-all shadow-sm placeholder-slate-400"
        placeholder="搜索奖励行为、事件名称或规则描述..."
      />
    </div>

    <!-- Filter Toolbar -->
    <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-border-light dark:border-border-dark pb-4">
      <!-- Status Tabs -->
      <div class="flex items-center space-x-1 p-1 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800/50 w-fit">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
            activeTab === tab.id
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-900/5 dark:ring-slate-500/20'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700/50'
          ]"
        >
          <span>{{ tab.label }}</span>
          <span :class="[
            'px-1.5 py-0.5 rounded-md text-xs font-semibold',
            activeTab === tab.id ? 'bg-slate-100 dark:bg-slate-600' : 'bg-transparent text-slate-400'
          ]">{{ tab.count }}</span>
        </button>
      </div>

      <!-- Actions & Extra Filters -->
      <div class="flex items-center flex-wrap gap-2">
        <div class="relative group">
          <button class="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all">
            <span>激励类型</span>
            <span class="material-icons-round text-sm opacity-50">expand_more</span>
          </button>
        </div>
        <div class="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>
        <button 
          @click="showThirdPartyModal = true"
          class="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all"
        >
          <span class="material-icons-round text-sm">hub</span>
          <span>第三方兑换</span>
        </button>
        <button class="btn btn-primary !py-1.5 !px-4 !text-xs !rounded-full shadow-sm" @click="showAddRuleModal = true">
          <span class="material-icons-round text-sm">add</span>
          新增规则
        </button>
      </div>
    </div>

    <!-- Point Rules List -->
    <div class="space-y-3">
      <div
        v-for="rule in filteredRules"
        :key="rule.id"
        class="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-5 hover:shadow-soft hover:border-primary dark:hover:border-slate-600 transition-all group relative"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-start gap-4 flex-1 min-w-0">
            <div :class="[
              'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm transition-colors',
              rule.enabled ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
            ]">
              <span class="material-icons-round">{{ rule.enabled ? 'bolt' : 'flash_off' }}</span>
            </div>
            
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <h3 class="text-base font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors truncate">
                  {{ rule.event }}
                </h3>
                <span class="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black border border-emerald-100 dark:border-emerald-800/30">
                  +{{ rule.points }} 积分
                </span>
              </div>
              
              <div class="flex items-center text-xs text-slate-500 dark:text-slate-400 space-x-3 flex-wrap gap-y-2">
                <span class="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">{{ rule.code }}</span>
                <span class="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                <div class="flex items-center gap-2">
                  <span v-for="limit in rule.limits" :key="limit" class="flex items-center gap-1 opacity-80">
                    <span class="material-icons-round text-[14px]">info_outline</span>
                    {{ limit }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Toggle Switch & Actions -->
          <div class="flex items-center gap-6 ml-4">
            <div class="flex flex-col items-end">
              <span :class="['text-[10px] font-bold uppercase tracking-widest mb-1.5', rule.enabled ? 'text-emerald-500' : 'text-slate-400']">
                {{ rule.enabled ? '已启用' : '已停用' }}
              </span>
              <button 
                @click="rule.enabled = !rule.enabled"
                :class="[
                  'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow-sm',
                  rule.enabled ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
                ]"
              >
                <span 
                  :class="[
                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out',
                    rule.enabled ? 'translate-x-5' : 'translate-x-0'
                  ]"
                ></span>
              </button>
            </div>
            
            <div class="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
               <button class="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-all">
                <span class="material-icons-round text-lg">edit</span>
              </button>
              <button class="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded transition-all">
                <span class="material-icons-round text-lg">delete_outline</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="mt-8 flex justify-center pb-4">
      <nav aria-label="Pagination" class="flex items-center space-x-1">
        <button class="relative inline-flex items-center px-3 py-2 text-xs font-bold text-slate-500 bg-white dark:bg-surface-dark dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
          <span class="material-icons-round text-sm">chevron_left</span> 上一页
        </button>
        <button class="z-10 bg-primary text-white relative inline-flex items-center px-4 py-2 text-xs font-bold rounded-md shadow-sm">1</button>
        <button class="bg-white dark:bg-surface-dark text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 relative inline-flex items-center px-4 py-2 text-xs font-bold rounded-md transition-all">2</button>
        <button class="relative inline-flex items-center px-3 py-2 text-xs font-bold text-slate-500 bg-white dark:bg-surface-dark dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
          下一页 <span class="material-icons-round text-sm">chevron_right</span>
        </button>
      </nav>
    </div>
    
    <!-- Add Rule Modal -->
    <div v-if="showAddRuleModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" @click="closeModal"></div>
      <div class="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-border-light dark:border-border-dark w-full max-w-lg overflow-hidden relative z-10 animate-in zoom-in-95 duration-200">
        <div class="px-6 py-4 border-b border-border-light dark:border-border-dark flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span class="material-icons-round text-primary">add_circle</span>
            新增激励规则
          </h3>
          <button @click="closeModal" class="text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 transition-colors">
            <span class="material-icons-round text-xl">close</span>
          </button>
        </div>
        
        <div class="p-6 space-y-5">
          <!-- Event Name -->
          <div>
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">触发事件名称</label>
            <input 
              v-model="newRule.event"
              type="text" 
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
              placeholder="例如：提交高质量代码评论"
            />
          </div>

          <!-- Event Code -->
          <div>
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">事件代码 (Code)</label>
            <input 
              v-model="newRule.code"
              type="text" 
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-mono"
              placeholder="例如：code.comment.created"
            />
          </div>

          <!-- Points & Type -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">奖励数值</label>
              <div class="relative">
                <input 
                  v-model="newRule.points"
                  type="number" 
                  class="w-full pl-4 pr-12 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  placeholder="50"
                />
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span class="text-xs font-bold text-slate-400">PTS</span>
                </div>
              </div>
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">规则类型</label>
              <select class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm appearance-none">
                <option>行为激励 (Earning)</option>
                <option>惩罚扣除 (Penalty)</option>
              </select>
            </div>
          </div>

          <!-- Limits -->
          <div>
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">风控限制 (每行一个)</label>
            <textarea 
              v-model="newRule.limits"
              rows="3"
              class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm resize-none"
              placeholder="每日上限 10 次&#10;同 IP 冷却 5 分钟"
            ></textarea>
          </div>
        </div>

        <div class="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-border-light dark:border-border-dark flex justify-end gap-3">
          <button 
            @click="closeModal"
            class="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            取消
          </button>
          <button 
            @click="saveRule"
            class="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
          >
            <span class="material-icons-round text-lg">save</span>
            保存规则
          </button>
        </div>
      </div>
    </div>

    <!-- Third Party Exchange Modal -->
    <div v-if="showThirdPartyModal" class="fixed inset-0 z-50 flex items-center justify-center p-4" style="min-height: 100vh; min-height: 100dvh; margin: 0 !important;">
      <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" @click="closeThirdPartyModal"></div>
      <div class="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-border-light dark:border-border-dark w-full max-w-4xl overflow-hidden relative z-10 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        <div class="px-6 py-4 border-b border-border-light dark:border-border-dark flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span class="material-icons-round text-primary">hub</span>
            第三方兑换接入配置
          </h3>
          <button @click="closeThirdPartyModal" class="text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 transition-colors">
            <span class="material-icons-round text-xl">close</span>
          </button>
        </div>
        
        <div class="p-6 space-y-6 overflow-y-auto flex-1">
          <!-- Description -->
          <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <div class="flex items-start gap-3">
              <span class="material-icons-round text-blue-600 dark:text-blue-400 text-xl">info</span>
              <div class="flex-1 text-sm text-blue-800 dark:text-blue-200">
                <p class="font-semibold mb-1">配置说明</p>
                <p class="text-xs leading-relaxed">配置外部服务 API，实现积分兑换虚拟商品或调用物流接口。支持标准 Webhook 及自定义鉴权。每个服务提供商可独立配置交易一致性保障策略。</p>
              </div>
            </div>
          </div>

          <!-- Provider List -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h4 class="text-sm font-bold text-slate-700 dark:text-slate-300">已配置的服务提供商 ({{ thirdPartyProviders.length }})</h4>
              <button 
                @click="addNewProvider"
                class="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-primary hover:bg-primary-dark rounded-lg transition-all shadow-sm"
              >
                <span class="material-icons-round text-sm">add</span>
                添加提供商
              </button>
            </div>

            <!-- Provider Cards -->
            <div v-if="thirdPartyProviders.length === 0" class="text-center py-12 bg-slate-50 dark:bg-slate-800/30 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700">
              <span class="material-icons-round text-5xl text-slate-300 dark:text-slate-600 mb-3 block">hub</span>
              <p class="text-sm font-medium text-slate-500 dark:text-slate-400">暂无配置的服务提供商</p>
              <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">点击上方按钮添加第一个服务提供商</p>
            </div>

            <div v-else class="space-y-3">
              <div 
                v-for="(provider, index) in thirdPartyProviders" 
                :key="provider.id"
                class="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:shadow-md transition-all group"
              >
                <div class="flex items-start justify-between mb-4">
                  <div class="flex items-start gap-3 flex-1">
                    <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white flex-shrink-0">
                      <span class="material-icons-round text-xl">webhook</span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-1">
                        <input 
                          v-model="provider.name"
                          type="text"
                          class="text-base font-bold text-slate-900 dark:text-white bg-transparent border-0 border-b-2 border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-primary focus:ring-0 px-0 py-0 transition-all"
                          placeholder="服务提供商名称"
                        />
                        <span 
                          :class="[
                            'px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider',
                            provider.active 
                              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' 
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                          ]"
                        >
                          {{ provider.active ? 'ACTIVE' : 'INACTIVE' }}
                        </span>
                      </div>
                      <div class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span class="material-icons-round text-sm">schedule</span>
                        <span>创建于 {{ provider.createdAt }}</span>
                        <span v-if="!provider.expanded && provider.endpoint" class="mx-1">•</span>
                        <span v-if="!provider.expanded && provider.endpoint" class="font-mono text-[10px] truncate max-w-[200px]">{{ provider.endpoint }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <button 
                      @click="toggleProviderExpand(provider)"
                      class="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-all"
                      :title="provider.expanded ? '收起' : '展开'"
                    >
                      <span class="material-icons-round text-lg transition-transform duration-200" :class="{ 'rotate-180': provider.expanded }">expand_more</span>
                    </button>
                    <button 
                      @click="provider.active = !provider.active"
                      :class="[
                        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow-sm',
                        provider.active ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
                      ]"
                    >
                      <span 
                        :class="[
                          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out',
                          provider.active ? 'translate-x-5' : 'translate-x-0'
                        ]"
                      ></span>
                    </button>
                    <button 
                      @click="deleteProvider(index)"
                      class="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded transition-all"
                    >
                      <span class="material-icons-round text-lg">delete_outline</span>
                    </button>
                  </div>
                </div>

                <!-- Provider Configuration (Collapsible) -->
                <transition
                  enter-active-class="transition-all duration-200 ease-out"
                  enter-from-class="opacity-0 max-h-0"
                  enter-to-class="opacity-100 max-h-[2000px]"
                  leave-active-class="transition-all duration-200 ease-in"
                  leave-from-class="opacity-100 max-h-[2000px]"
                  leave-to-class="opacity-0 max-h-0"
                >
                  <div v-if="provider.expanded" class="overflow-hidden">
                <div class="space-y-4">
                  <!-- API Endpoint -->
                  <div>
                    <label class="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">API 端点 (Webhook URL)</label>
                    <div class="relative">
                      <input 
                        v-model="provider.endpoint"
                        type="url"
                        class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-mono"
                        placeholder="https://api.partner.com/v1/redeem/callback"
                      />
                      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span class="material-icons-round text-slate-400 text-sm">link</span>
                      </div>
                    </div>
                  </div>

                  <!-- Auth Configuration -->
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">鉴权方式</label>
                      <select 
                        v-model="provider.authType"
                        class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                      >
                        <option value="none">无鉴权</option>
                        <option value="bearer">Bearer Token</option>
                        <option value="apikey">API Key</option>
                        <option value="oauth">OAuth 2.0</option>
                      </select>
                    </div>
                    <div v-if="provider.authType !== 'none'">
                      <label class="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                        {{ provider.authType === 'bearer' ? 'Token' : provider.authType === 'apikey' ? 'API Key' : '客户端 ID' }}
                      </label>
                      <input 
                        v-model="provider.authValue"
                        type="password"
                        class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-mono"
                        placeholder="••••••••••••••••"
                      />
                    </div>
                  </div>

                  <!-- Transaction Consistency -->
                  <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                    <div class="flex items-start gap-3">
                      <div class="flex items-center h-6">
                        <input 
                          v-model="provider.enableConsistency"
                          :id="`consistency-${provider.id}`"
                          type="checkbox"
                          class="focus:ring-primary h-5 w-5 text-primary border-slate-300 dark:border-slate-600 rounded cursor-pointer"
                        />
                      </div>
                      <div class="flex-1">
                        <label :for="`consistency-${provider.id}`" class="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white cursor-pointer">
                          <span class="material-icons-round text-blue-500 text-lg">verified_user</span>
                          开启交易一致性保障 (2PC)
                        </label>
                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                          在扣除用户积分前，系统将预先向第三方服务发送资源锁定请求。若三方库存不足，积分事务将自动回滚，确保数据零偏差。
                        </p>
                        <div v-if="provider.enableConsistency" class="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                          <div class="grid grid-cols-2 gap-3">
                            <div>
                              <label class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">超时时间 (秒)</label>
                              <input 
                                v-model="provider.consistencyTimeout"
                                type="number"
                                min="1"
                                max="60"
                                class="w-full px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                                placeholder="30"
                              />
                            </div>
                            <div>
                              <label class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">重试次数</label>
                              <input 
                                v-model="provider.consistencyRetry"
                                type="number"
                                min="0"
                                max="5"
                                class="w-full px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                                placeholder="3"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Test Connection -->
                  <div class="flex items-center justify-between pt-2">
                    <div class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span class="material-icons-round text-sm">info_outline</span>
                      <span>建议在高并发兑换场景下保持开启一致性保障</span>
                    </div>
                    <button class="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-all">
                      <span class="material-icons-round text-sm">cable</span>
                      测试连接
                    </button>
                  </div>
                </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </div>

        <div class="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-border-light dark:border-border-dark flex justify-end gap-3">
          <button 
            @click="closeThirdPartyModal"
            class="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            取消
          </button>
          <button 
            @click="saveThirdPartyConfig"
            class="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
          >
            <span class="material-icons-round text-lg">save</span>
            保存配置
          </button>
        </div>
      </div>
    </div>

    <p class="text-center text-[11px] font-bold text-slate-400 mt-12 mb-4 uppercase tracking-widest">AtomGit Enterprise · © 2024</p>
  </div>
</template>

<script>
export default {
  name: 'PointRules',
  data() {
    return {
      showAddRuleModal: false,
      showThirdPartyModal: false,
      newRule: {
        event: '',
        code: '',
        points: '',
        limits: ''
      },
      activeTab: 'all',
      tabs: [
        { id: 'all', label: '全部规则', count: 12 },
        { id: 'active', label: '已启用', count: 8 },
        { id: 'inactive', label: '已停用', count: 4 }
      ],
      earningRules: [
        { 
          id: 1, 
          event: '合并 Pull Request', 
          code: 'code.merged', 
          points: 50, 
          limits: ['每日上限 5 次', '同仓库冷却 10min'],
          enabled: true 
        },
        { 
          id: 2, 
          event: '提交 Issue (被标记为有效)', 
          code: 'issue.created', 
          points: 10, 
          limits: ['每日上限 10 次', '需仓库维护者标记'],
          enabled: true 
        },
        { 
          id: 3, 
          event: '完善个人简历 / 技能栈', 
          code: 'user.profile_complete', 
          points: 100, 
          limits: ['仅限一次', '由组织管理员审核'],
          enabled: false 
        },
        { 
          id: 4, 
          event: '技术文章投稿', 
          code: 'article.published', 
          points: 200, 
          limits: ['每日上限 1 次', '需通过社区审核层'],
          enabled: true 
        }
      ],
      thirdPartyProviders: [
        {
          id: 1,
          name: '通用 Webhook (生产环境)',
          endpoint: 'https://api.partner.com/v1/redeem/callback',
          authType: 'bearer',
          authValue: 'sk_live_xxxxxxxxxxxx',
          active: true,
          enableConsistency: true,
          consistencyTimeout: 30,
          consistencyRetry: 3,
          createdAt: '2024-01-15',
          expanded: false
        }
      ]
    }
  },
  computed: {
    filteredRules() {
      if (this.activeTab === 'all') return this.earningRules
      return this.earningRules.filter(r => r.enabled === (this.activeTab === 'active'))
    }
  },
  methods: {
    closeModal() {
      this.showAddRuleModal = false
      this.newRule = { event: '', code: '', points: '', limits: '' }
    },
    saveRule() {
      if (!this.newRule.event || !this.newRule.points) return // Simple validation

      const rule = {
        id: this.earningRules.length + 1,
        event: this.newRule.event,
        code: this.newRule.code,
        points: parseInt(this.newRule.points),
        limits: this.newRule.limits.split('\n').filter(l => l.trim()),
        enabled: true
      }
      
      this.earningRules.unshift(rule)
      this.closeModal()
    },
    closeThirdPartyModal() {
      this.showThirdPartyModal = false
    },
    addNewProvider() {
      const newProvider = {
        id: Date.now(),
        name: '新服务提供商',
        endpoint: '',
        authType: 'none',
        authValue: '',
        active: false,
        enableConsistency: false,
        consistencyTimeout: 30,
        consistencyRetry: 3,
        createdAt: new Date().toISOString().split('T')[0],
        expanded: true // 新添加的提供商默认展开
      }
      this.thirdPartyProviders.push(newProvider)
    },
    toggleProviderExpand(provider) {
      provider.expanded = !provider.expanded
    },
    deleteProvider(index) {
      if (confirm('确认删除此服务提供商配置吗？')) {
        this.thirdPartyProviders.splice(index, 1)
      }
    },
    saveThirdPartyConfig() {
      // Validate providers
      const invalidProviders = this.thirdPartyProviders.filter(p => 
        !p.name.trim() || !p.endpoint.trim()
      )
      
      if (invalidProviders.length > 0) {
        alert('请完善所有服务提供商的名称和 API 端点')
        return
      }

      // Save configuration (in real app, this would call an API)
      console.log('Saving third-party providers:', this.thirdPartyProviders)
      alert('第三方兑换配置已保存！')
      this.closeThirdPartyModal()
    }
  }
}
</script>

<style scoped>
.shadow-soft {
  box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.04);
}

.rotate-180 {
  transform: rotate(180deg);
}
</style>
