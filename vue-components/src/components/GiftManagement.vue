<template>
  <div class="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <!-- Header Actions -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">兑换礼品管理</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">管理第三方服务商礼品和自定义礼品的兑换配置</p>
      </div>
      <div class="flex items-center gap-3">
        <button 
          @click="syncProviderGifts"
          class="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all shadow-sm"
        >
          <span class="material-icons-round text-lg">sync</span>
          同步服务商礼品
        </button>
        <button 
          @click="showAddGiftModal = true"
          class="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-primary hover:bg-primary-dark rounded-xl transition-all shadow-lg shadow-primary/20"
        >
          <span class="material-icons-round text-lg">add</span>
          添加自定义礼品
        </button>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="flex items-center justify-between border-b border-border-light dark:border-border-dark pb-4">
      <div class="flex items-center space-x-1 p-1 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800/50">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-bold transition-all',
            activeTab === tab.id
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          ]"
        >
          <span>{{ tab.label }}</span>
          <span :class="[
            'px-2 py-0.5 rounded-md text-xs font-bold',
            activeTab === tab.id ? 'bg-slate-100 dark:bg-slate-600' : 'bg-transparent'
          ]">{{ tab.count }}</span>
        </button>
      </div>

      <!-- Search -->
      <div class="relative w-64">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span class="material-icons-round text-slate-400 text-lg">search</span>
        </div>
        <input
          v-model="searchQuery"
          type="text"
          class="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          placeholder="搜索礼品名称..."
        />
      </div>
    </div>

    <!-- Gifts List Table -->
    <div class="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl overflow-hidden shadow-sm">
      <table class="w-full text-left border-collapse">
        <thead class="bg-slate-50 dark:bg-slate-800/50 border-b border-border-light dark:border-border-dark">
          <tr>
            <th class="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">礼品信息</th>
            <th class="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">兑换积分</th>
            <th class="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">库存</th>
            <th class="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">兑换数据</th>
            <th class="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">状态</th>
            <th class="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
          <tr v-if="filteredGifts.length === 0">
            <td colspan="6" class="px-6 py-16 text-center">
              <span class="material-icons-round text-5xl text-slate-300 dark:text-slate-600 mb-3 block">card_giftcard</span>
              <p class="text-sm font-bold text-slate-500 dark:text-slate-400">暂无礼品</p>
              <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">点击上方按钮添加礼品或同步服务商礼品</p>
            </td>
          </tr>
          <tr 
            v-for="gift in filteredGifts" 
            :key="gift.id"
            class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group"
          >
            <!-- Gift Info -->
            <td class="px-6 py-5">
              <div class="flex items-center gap-4">
                <!-- Image -->
                <div class="w-16 h-16 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 overflow-hidden flex-shrink-0">
                  <img 
                    v-if="gift.image" 
                    :src="gift.image" 
                    :alt="gift.name"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <span class="material-icons-round text-2xl text-slate-300 dark:text-slate-600">card_giftcard</span>
                  </div>
                </div>
                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <h3 class="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">
                      {{ gift.name }}
                    </h3>
                    <span 
                      v-if="gift.source === 'provider'"
                      class="px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex-shrink-0"
                    >
                      三方
                    </span>
                  </div>
                  <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mb-2">
                    {{ gift.description }}
                  </p>
                  <!-- Limits -->
                  <div v-if="gift.limits && gift.limits.length > 0" class="flex items-center gap-2 flex-wrap">
                    <div 
                      v-for="(limit, index) in gift.limits.slice(0, 2)" 
                      :key="index"
                      class="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded"
                    >
                      <span class="material-icons-round text-xs">rule</span>
                      {{ limit }}
                    </div>
                  </div>
                </div>
              </div>
            </td>

            <!-- Points Required -->
            <td class="px-6 py-5 text-center">
              <div class="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg font-bold text-sm">
                <span class="material-icons-round text-sm">bolt</span>
                {{ gift.pointsRequired }}
              </div>
            </td>

            <!-- Stock -->
            <td class="px-6 py-5 text-center">
              <div v-if="gift.stock !== null" class="inline-flex flex-col">
                <span 
                  :class="[
                    'text-sm font-bold',
                    gift.stock === 0 
                      ? 'text-rose-500' 
                      : gift.stock < 20 
                        ? 'text-orange-500' 
                        : 'text-slate-900 dark:text-white'
                  ]"
                >
                  {{ gift.stock }}
                </span>
                <span class="text-[10px] text-slate-400 uppercase tracking-wider font-bold">件</span>
              </div>
              <span v-else class="text-xs text-slate-400 font-medium">不限制</span>
            </td>

            <!-- Redeem Stats -->
            <td class="px-6 py-5 text-center">
              <div class="flex flex-col gap-1">
                <div class="flex items-center justify-center gap-2 text-xs">
                  <span class="text-slate-500 dark:text-slate-400">次数:</span>
                  <span class="font-bold text-slate-900 dark:text-white">{{ gift.redeemCount }}</span>
                </div>
                <div class="flex items-center justify-center gap-2 text-xs">
                  <span class="text-slate-500 dark:text-slate-400">人数:</span>
                  <span class="font-bold text-slate-900 dark:text-white">{{ gift.redeemUsers }}</span>
                </div>
              </div>
            </td>

            <!-- Status -->
            <td class="px-6 py-5 text-center">
              <span 
                :class="[
                  'inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider',
                  gift.status === 'active' 
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' 
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                ]"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="gift.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'"></span>
                {{ gift.status === 'active' ? '上架中' : '已下架' }}
              </span>
            </td>

            <!-- Actions -->
            <td class="px-6 py-5 text-right">
              <div class="flex items-center justify-end gap-2">
                <button 
                  @click="editGift(gift)"
                  class="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                  title="编辑"
                >
                  <span class="material-icons-round text-lg">edit</span>
                </button>
                <button 
                  @click="toggleGiftStatus(gift)"
                  :class="[
                    'p-2 rounded-lg transition-all',
                    gift.status === 'active'
                      ? 'text-slate-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20'
                      : 'text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                  ]"
                  :title="gift.status === 'active' ? '下架' : '上架'"
                >
                  <span class="material-icons-round text-lg">{{ gift.status === 'active' ? 'visibility_off' : 'visibility' }}</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div v-if="filteredGifts.length > 0" class="px-6 py-4 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <p class="text-xs font-bold text-slate-500 dark:text-slate-400">
          显示 <span class="text-slate-900 dark:text-white">{{ filteredGifts.length }}</span> 条礼品
        </p>
        <div class="flex items-center gap-2">
          <button class="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 text-xs font-black hover:bg-slate-100 dark:hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed" disabled>‹</button>
          <button class="w-8 h-8 rounded-lg bg-primary text-white text-xs font-black">1</button>
          <button class="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-black hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">2</button>
          <button class="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 text-xs font-black hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">›</button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Gift Modal -->
    <div v-if="showAddGiftModal || editingGift" class="fixed inset-0 z-50 flex items-center justify-center p-4" style="min-height: 100vh; min-height: 100dvh; margin: 0 !important;">
      <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" @click="closeGiftModal"></div>
      <div class="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-border-light dark:border-border-dark w-full max-w-2xl overflow-hidden relative z-10 max-h-[90vh] flex flex-col">
        <div class="px-6 py-4 border-b border-border-light dark:border-border-dark flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span class="material-icons-round text-primary">{{ editingGift ? 'edit' : 'add_circle' }}</span>
            {{ editingGift ? '编辑礼品' : '添加自定义礼品' }}
          </h3>
          <button @click="closeGiftModal" class="text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 transition-colors">
            <span class="material-icons-round text-xl">close</span>
          </button>
        </div>
        
        <div class="p-6 space-y-5 overflow-y-auto flex-1">
          <!-- Gift Name -->
          <div>
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">礼品名称 *</label>
            <input 
              v-model="giftForm.name"
              type="text" 
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
              placeholder="例如：100元京东购物卡"
            />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">礼品描述</label>
            <textarea 
              v-model="giftForm.description"
              rows="3"
              class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm resize-none"
              placeholder="简要描述礼品内容和使用说明"
            ></textarea>
          </div>

          <!-- Points & Stock -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">兑换积分 *</label>
              <div class="relative">
                <input 
                  v-model="giftForm.pointsRequired"
                  type="number" 
                  min="1"
                  class="w-full pl-4 pr-12 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  placeholder="1000"
                />
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span class="text-xs font-bold text-slate-400">PTS</span>
                </div>
              </div>
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">库存数量</label>
              <input 
                v-model="giftForm.stock"
                type="number" 
                min="0"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                placeholder="不限制留空"
              />
            </div>
          </div>

          <!-- Image URL -->
          <div>
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">礼品图片 URL</label>
            <input 
              v-model="giftForm.image"
              type="url" 
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-mono"
              placeholder="https://example.com/gift-image.jpg"
            />
          </div>

          <!-- Limits -->
          <div>
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">兑换限制 (每行一个)</label>
            <textarea 
              v-model="giftForm.limits"
              rows="3"
              class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm resize-none"
              placeholder="每人限兑 1 次&#10;每日限量 10 份&#10;需完成实名认证"
            ></textarea>
          </div>

          <!-- Provider (for editing provider gifts) -->
          <div v-if="editingGift && editingGift.source === 'provider'" class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <div class="flex items-start gap-3">
              <span class="material-icons-round text-blue-600 dark:text-blue-400 text-xl">info</span>
              <div class="flex-1 text-sm text-blue-800 dark:text-blue-200">
                <p class="font-semibold mb-1">第三方服务商礼品</p>
                <p class="text-xs">此礼品来自服务商 <span class="font-mono font-bold">{{ editingGift.provider }}</span>，仅可编辑兑换积分要求和限制条件。</p>
              </div>
            </div>
          </div>
        </div>

        <div class="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-border-light dark:border-border-dark flex justify-end gap-3">
          <button 
            @click="closeGiftModal"
            class="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            取消
          </button>
          <button 
            @click="saveGift"
            class="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
          >
            <span class="material-icons-round text-lg">save</span>
            保存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GiftManagement',
  data() {
    return {
      activeTab: 'all',
      searchQuery: '',
      showAddGiftModal: false,
      editingGift: null,
      tabs: [
        { id: 'all', label: '全部礼品', count: 38 },
        { id: 'active', label: '已上架', count: 25 },
        { id: 'inactive', label: '已下架', count: 13 }
      ],
      giftForm: {
        name: '',
        description: '',
        pointsRequired: '',
        stock: '',
        image: '',
        limits: ''
      },
      gifts: [
        {
          id: 1,
          name: '100元京东购物卡',
          description: '可在京东商城购买任意商品，有效期12个月',
          pointsRequired: 10000,
          stock: 50,
          redeemCount: 128,
          redeemUsers: 98,
          status: 'active',
          source: 'custom',
          image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400&h=300&fit=crop',
          limits: ['每人限兑 1 次', '需完成实名认证']
        },
        {
          id: 2,
          name: 'AtomGit 定制T恤',
          description: '纯棉材质，多种尺码可选',
          pointsRequired: 5000,
          stock: 200,
          redeemCount: 45,
          redeemUsers: 45,
          status: 'active',
          source: 'custom',
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop',
          limits: ['每人限兑 2 次', '需填写收货地址']
        },
        {
          id: 3,
          name: '腾讯视频VIP月卡',
          description: '享受海量高清影视内容，30天有效期',
          pointsRequired: 3000,
          stock: null,
          redeemCount: 256,
          redeemUsers: 189,
          status: 'active',
          source: 'provider',
          provider: '腾讯服务商',
          image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=300&fit=crop',
          limits: ['每人每月限兑 1 次']
        },
        {
          id: 4,
          name: '星巴克咖啡券',
          description: '可在全国星巴克门店使用，兑换中杯饮品一杯',
          pointsRequired: 2000,
          stock: 100,
          redeemCount: 89,
          redeemUsers: 76,
          status: 'active',
          source: 'provider',
          provider: '星巴克合作商',
          image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
          limits: ['每人每周限兑 2 次', '有效期30天']
        },
        {
          id: 5,
          name: '开发者专属鼠标垫',
          description: '超大尺寸，防滑底座，印有代码图案',
          pointsRequired: 1500,
          stock: 0,
          redeemCount: 67,
          redeemUsers: 67,
          status: 'inactive',
          source: 'custom',
          image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop',
          limits: ['每人限兑 1 次']
        }
      ]
    }
  },
  computed: {
    filteredGifts() {
      let result = this.gifts

      // Filter by tab
      if (this.activeTab === 'active') {
        result = result.filter(g => g.status === 'active')
      } else if (this.activeTab === 'inactive') {
        result = result.filter(g => g.status === 'inactive')
      }

      // Filter by search
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.trim().toLowerCase()
        result = result.filter(g => 
          g.name.toLowerCase().includes(query) || 
          g.description.toLowerCase().includes(query)
        )
      }

      return result
    }
  },
  methods: {
    syncProviderGifts() {
      // Simulate syncing from providers
      alert('正在从服务商同步礼品清单...\n\n此功能将拉取已配置的第三方服务商的最新礼品信息，包括名称、库存、价格等。')
    },
    editGift(gift) {
      this.editingGift = gift
      this.giftForm = {
        name: gift.name,
        description: gift.description,
        pointsRequired: gift.pointsRequired,
        stock: gift.stock || '',
        image: gift.image || '',
        limits: gift.limits ? gift.limits.join('\n') : ''
      }
    },
    closeGiftModal() {
      this.showAddGiftModal = false
      this.editingGift = null
      this.giftForm = {
        name: '',
        description: '',
        pointsRequired: '',
        stock: '',
        image: '',
        limits: ''
      }
    },
    saveGift() {
      if (!this.giftForm.name || !this.giftForm.pointsRequired) {
        alert('请填写礼品名称和兑换积分')
        return
      }

      const giftData = {
        name: this.giftForm.name,
        description: this.giftForm.description,
        pointsRequired: parseInt(this.giftForm.pointsRequired),
        stock: this.giftForm.stock ? parseInt(this.giftForm.stock) : null,
        image: this.giftForm.image,
        limits: this.giftForm.limits.split('\n').filter(l => l.trim())
      }

      if (this.editingGift) {
        // Update existing gift
        Object.assign(this.editingGift, giftData)
        alert('礼品信息已更新！')
      } else {
        // Add new gift
        const newGift = {
          id: Date.now(),
          ...giftData,
          redeemCount: 0,
          redeemUsers: 0,
          status: 'active',
          source: 'custom'
        }
        this.gifts.unshift(newGift)
        alert('自定义礼品已添加！')
      }

      this.closeGiftModal()
    },
    toggleGiftStatus(gift) {
      gift.status = gift.status === 'active' ? 'inactive' : 'active'
      const action = gift.status === 'active' ? '上架' : '下架'
      console.log(`礼品 "${gift.name}" 已${action}`)
    }
  }
}
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
