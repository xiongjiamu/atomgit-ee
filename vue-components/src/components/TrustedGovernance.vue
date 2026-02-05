<template>
  <div class="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <!-- View Selector & Title Header -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
      <div class="space-y-4">
        <div class="flex items-center gap-4">
          <ViewSelector :selected-view="selectedView" @change="$emit('view-change', $event)" />
          <div class="w-px h-8 bg-slate-200 dark:bg-slate-800"></div>
          <h1 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight" style="margin-bottom:0">开源可信治理服务</h1>
        </div>
        <p class="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-2xl">
          配置并监控 AtomGit 底层安全引擎，通过全球开源治理知识库，为企业代码资产提供全链路供应链防护。
        </p>
      </div>
    </div>

    <!-- Alert Banners -->
    <AlertBanner
      v-model="showWarningAlert"
      type="warning"
      title="资源预警"
      icon="info"
    >
      您企业当前的存储空间已使用 856GB (85%), 接近包年套餐上限，请关注资源消耗或及时扩容
    </AlertBanner>

    <!-- Hero Section: Knowledge Base -->
    <div class="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-black dark:to-slate-900 rounded-xl p-10 text-white relative overflow-hidden shadow-2xl border border-slate-700/50 group hover:scale-[1.005] transition-transform">
      <div class="absolute inset-0 grid-bg opacity-20 pointer-events-none"></div>
      <div class="absolute -right-20 -top-20 w-80 h-80 bg-blue-500/10 blur-[100px] rounded-full group-hover:bg-blue-500/20 transition-all"></div>
      
      <div class="relative z-10 flex flex-col justify-center h-full">
        <div class="flex items-center space-x-4 mb-6">
          <div class="p-3 bg-blue-500/20 rounded-2xl border border-blue-400/30 shadow-inner group-hover:scale-110 transition-transform">
            <span class="material-icons-round text-blue-400 text-3xl">hub</span>
          </div>
          <div>
            <h2 class="text-2xl font-black text-white tracking-tight">全球开源治理知识库 · Global Knowledge Base</h2>
            <p class="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mt-1">Intelligence-Driven Security Engine</p>
          </div>
        </div>
        
        <p class="text-slate-300 text-sm mb-10 max-w-3xl leading-relaxed font-bold">
          AtomGit 治理引擎已覆盖全球主流开源生态。开启治理能力后，系统将自动对企业代码库进行深度的供应链分析与恶意检测，实时识别并阻断未知的安全威胁，保障交付链路的纯净与合规。
        </p>
        
        <div class="flex space-x-16">
          <div class="group/stat">
            <div class="text-4xl font-black text-blue-400 mb-2 font-display tracking-tighter group-hover/stat:translate-x-1 transition-transform">5,800+</div>
            <div class="text-[10px] text-slate-400 font-black uppercase tracking-widest">主流开源软件生态</div>
          </div>
          <div class="group/stat">
            <div class="text-4xl font-black text-emerald-400 mb-2 font-display tracking-tighter group-hover/stat:translate-x-1 transition-transform">230k+</div>
            <div class="text-[10px] text-slate-400 font-black uppercase tracking-widest">依赖治理组件库</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Section 1 -->
      <div class="bg-white dark:bg-surface-dark rounded-xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col">
        <div class="flex items-center space-x-3 mb-8 border-l-4 border-blue-500 pl-4">
          <div>
            <h3 class="text-lg font-black text-slate-900 dark:text-white tracking-tight">软件供应链分析系统</h3>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Supply Chain Intelligence</p>
          </div>
        </div>
        
        <div class="space-y-6">
          <div v-for="feature in supplyChainFeatures" :key="feature.title" class="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 flex items-center justify-between border border-transparent hover:border-blue-500/20 transition-all group">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 shadow-sm group-hover:scale-110 transition-transform">
                <span class="material-icons-round">{{ feature.icon }}</span>
              </div>
              <div>
                <div class="font-black text-slate-900 dark:text-white text-sm tracking-tight">{{ feature.title }}</div>
                <div class="text-xs text-slate-500 dark:text-slate-400 font-bold mt-1">{{ feature.desc }}</div>
              </div>
            </div>
            <!-- Custom Toggle -->
            <button 
              @click="feature.enabled = !feature.enabled"
              :class="['w-12 h-6 rounded-full p-1 transition-all duration-300 relative focus:outline-none', feature.enabled ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-slate-200 dark:bg-slate-700']"
            >
              <div :class="['w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm', feature.enabled ? 'translate-x-6' : 'translate-x-0']"></div>
            </button>
          </div>
        </div>
      </div>

      <!-- Section 2 -->
      <div class="bg-white dark:bg-surface-dark rounded-xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col">
        <div class="flex items-center space-x-3 mb-8 border-l-4 border-emerald-500 pl-4">
          <div>
            <h3 class="text-lg font-black text-slate-900 dark:text-white tracking-tight">可信检测与修复系统</h3>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Automated Trust Remediation</p>
          </div>
        </div>

        <div class="space-y-6">
          <div v-for="feature in remediationFeatures" :key="feature.title" class="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 flex items-center justify-between border border-transparent hover:border-emerald-500/20 transition-all group">
            <div class="flex items-center gap-4">
              <div :class="['w-10 h-10 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform', feature.isWarning ? 'bg-rose-50 dark:bg-rose-900/30 text-rose-500' : 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500']">
                <span class="material-icons-round">{{ feature.icon }}</span>
              </div>
              <div>
                <div :class="['font-black text-sm tracking-tight', feature.isWarning ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white']">{{ feature.title }}</div>
                <div class="text-xs text-slate-500 dark:text-slate-400 font-bold mt-1">{{ feature.desc }}</div>
              </div>
            </div>
            
            <template v-if="feature.type === 'toggle'">
              <button 
                @click="feature.enabled = !feature.enabled"
                :class="['w-12 h-6 rounded-full p-1 transition-all duration-300 relative focus:outline-none', feature.enabled ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-slate-200 dark:bg-slate-700']"
              >
                <div :class="['w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm', feature.enabled ? 'translate-x-6' : 'translate-x-0']"></div>
              </button>
            </template>
            <template v-else>
              <button 
                @click="showLLMModal = true"
                class="px-5 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 shadow-sm transition-all active:scale-95"
              >
                {{ feature.actionText }}
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- LLM Configuration Modal -->
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showLLMModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showLLMModal = false"></div>
        <transition
          appear
          enter-active-class="transition ease-out duration-300"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition ease-in duration-200"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div class="w-full max-w-3xl bg-white dark:bg-surface-dark rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-200 dark:border-slate-800 relative z-10">
            <!-- Modal Header -->
            <div class="flex items-center justify-between px-8 py-6 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div>
                <h2 class="text-slate-900 dark:text-white text-xl font-black tracking-tight">大模型漏洞修复配置</h2>
                <p class="text-slate-500 dark:text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest opacity-70">Configure AI Remediation Engine</p>
              </div>
              <button @click="showLLMModal = false" class="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400">
                <span class="material-icons-round">close</span>
              </button>
            </div>

            <!-- Modal Body -->
            <div class="overflow-y-auto custom-scrollbar p-8 space-y-10">
              <!-- Provider Selection -->
              <section>
                <label class="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">选择模型提供商 · Model Provider</label>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div 
                    v-for="provider in modelProviders" 
                    :key="provider.id"
                    @click="selectedModel = provider.id"
                    :class="[
                      'relative cursor-pointer rounded-xl p-5 border-2 transition-all group',
                      selectedModel === provider.id 
                        ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' 
                        : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-slate-200'
                    ]"
                  >
                    <div v-if="selectedModel === provider.id" class="absolute top-3 right-3 text-primary animate-in zoom-in duration-300">
                      <span class="material-icons-round text-lg">check_circle</span>
                    </div>
                    <div class="flex flex-col gap-4">
                      <div :class="['w-12 h-12 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform', provider.gradient]">
                        <span class="material-icons-round text-white text-xl">{{ provider.icon }}</span>
                      </div>
                      <div>
                        <p class="text-slate-900 dark:text-white text-sm font-black tracking-tight">{{ provider.name }}</p>
                        <p class="text-slate-500 dark:text-slate-400 text-[10px] font-bold mt-1 leading-relaxed">{{ provider.desc }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <!-- API Configuration -->
              <section class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-3">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">API Endpoint</label>
                  <input 
                    type="text" 
                    v-model="llmConfig.endpoint"
                    class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                  />
                </div>
                <div class="space-y-3">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">API Key</label>
                  <div class="relative">
                    <input 
                      :type="showKey ? 'text' : 'password'" 
                      v-model="llmConfig.apiKey"
                      class="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                    />
                    <button @click="showKey = !showKey" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                      <span class="material-icons-round text-sm">{{ showKey ? 'visibility' : 'visibility_off' }}</span>
                    </button>
                  </div>
                </div>
              </section>

              <!-- Advanced Parameters -->
              <section class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div class="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 space-y-4">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="material-icons-round text-slate-400 text-sm">thermostat</span>
                      <span class="text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">Temperature (随机性)</span>
                    </div>
                    <span class="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-lg">0.7</span>
                  </div>
                  <input type="range" min="0" max="1" step="0.1" v-model="llmConfig.temperature" class="w-full accent-primary h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer" />
                  <p class="text-[10px] text-slate-400 font-bold leading-relaxed">值越高随机性越强；值越低越倾向于确定的代码修复逻辑。</p>
                </div>

                <div class="space-y-3">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Max Tokens (最大长度)</label>
                  <div class="relative">
                    <input 
                      type="number" 
                      v-model="llmConfig.maxTokens"
                      class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                    />
                    <span class="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase">tokens</span>
                  </div>
                  <p class="text-[10px] text-slate-400 font-bold leading-relaxed">限制单次请求生成的最大代码行数与 Token 数量。</p>
                </div>
              </section>

              <!-- Permissions -->
              <section class="border-t border-slate-100 dark:border-slate-800 pt-8">
                <label class="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">自动化权限设置 · AI Permissions</label>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    v-for="perm in permissions" 
                    :key="perm.id"
                    @click="perm.enabled = !perm.enabled"
                    :class="['p-5 rounded-xl border transition-all cursor-pointer flex items-start gap-4 group', perm.enabled ? 'border-primary/30 bg-primary/5 shadow-sm' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-surface-dark hover:border-slate-200']"
                  >
                    <div :class="['w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors', perm.enabled ? 'bg-primary border-primary' : 'border-slate-200 dark:border-slate-600']">
                      <span v-if="perm.enabled" class="material-icons-round text-white text-xs">check</span>
                    </div>
                    <div>
                      <p class="text-sm font-black text-slate-900 dark:text-white tracking-tight">{{ perm.title }}</p>
                      <p class="text-[10px] text-slate-500 font-bold mt-1 leading-relaxed">{{ perm.desc }}</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <!-- Modal Footer -->
            <div class="px-8 py-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shrink-0 flex items-center justify-between">
              <button class="flex items-center gap-2 text-slate-500 hover:text-amber-500 transition-colors">
                <span class="material-icons-round text-sm">bolt</span>
                <span class="text-[10px] font-black uppercase tracking-widest">测试连接</span>
              </button>
              <div class="flex gap-4">
                <button @click="showLLMModal = false" class="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">取消</button>
                <button class="px-8 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">保存配置</button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script>
import ViewSelector from './ViewSelector.vue'
import AlertBanner from './AlertBanner.vue'

export default {
  name: 'TrustedGovernance',
  components: {
    ViewSelector,
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
      showWarningAlert: true,
      showLLMModal: false,
      showKey: false,
      selectedModel: 'atomgpt',
      llmConfig: {
        endpoint: 'https://api.atomgit.com/v1/chat/completions',
        apiKey: 'sk-1234567890abcdef1234567890abcdef',
        temperature: 0.7,
        maxTokens: 4096
      },
      modelProviders: [
        { id: 'atomgpt', name: 'AtomGPT-4', desc: '由企业安全团队微调，针对补丁修复高度优化。', icon: 'security', gradient: 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white' },
        { id: 'claude', name: 'Claude 3', desc: '全能型选手，擅长理解复杂长上下文与推理。', icon: 'psychology', gradient: 'bg-gradient-to-br from-orange-400 to-red-500 text-white' },
        { id: 'llama', name: 'Llama 3', desc: '性能卓越的开源模型，完美适配私有化部署。', icon: 'code_blocks', gradient: 'bg-gradient-to-br from-teal-400 to-emerald-600 text-white' }
      ],
      permissions: [
        { id: 'pr', title: '自动提交 PR', desc: '若置信度高于 90%，允许 AI 自动创建修复 PR。', enabled: false },
        { id: 'context', title: '代码上下文分析', desc: '允许读取相关上下文片段以增强推理准确性。', enabled: true }
      ],
      supplyChainFeatures: [
        { 
          title: '知识图谱构建', 
          desc: '绘制完整的依赖关系网，识别传递性风险。', 
          icon: 'hub',
          enabled: true 
        },
        { 
          title: '深度 SBOM 分析', 
          desc: '二进制与源代码双向关联，细粒度资产审计。', 
          icon: 'analytics',
          enabled: true 
        }
      ],
      remediationFeatures: [
        { 
          title: '大模型辅助漏洞修复', 
          desc: '基于 LLM 自动精准生成 PR 修复方案。', 
          icon: 'auto_awesome',
          type: 'action',
          actionText: '配置修复模型'
        },
        { 
          title: '恶意代码投毒检测', 
          desc: '实时拦截库、后门、挖矿脚本等已知风险。', 
          icon: 'security_update_warning',
          type: 'toggle',
          isWarning: true,
          enabled: false 
        }
      ]
    }
  }
}
</script>

<style scoped>
.grid-bg {
  background-size: 40px 40px;
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
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
