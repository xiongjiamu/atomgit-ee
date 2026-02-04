<template>
  <div class="bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark shadow-sm/50 sticky top-[60px] z-40 h-[56px]">
    <div class="layout-container flex h-full gap-12 text-sm min-w-max">
        <a
          v-for="item in navItems"
          :key="item.id"
          :href="item.href"
          :class="[
            'flex items-center gap-2 px-1 h-full border-b-2 transition no-underline',
            item.active
              ? 'text-primary font-semibold border-primary'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-transparent hover:border-slate-300 dark:hover:border-slate-600'
          ]"
          @click.prevent="handleNavClick(item)"
        >
        <span class="material-icons-round text-xl">{{ item.icon }}</span>
        {{ item.label }}
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainNavigation',
  props: {
    activeNav: {
      type: String,
      default: 'dashboard'
    }
  },
  data() {
    return {
      navItems: [
        { id: 'dashboard', label: '概览', icon: 'space_dashboard', href: '#', active: true },
        { id: 'resources', label: '资源中心', icon: 'inventory_2', href: '#', active: false },
        { id: 'community', label: '社区运营', icon: 'groups', href: '#', active: false },
        { id: 'pipeline', label: '流水线', icon: 'alt_route', href: '#', active: false },
        { id: 'security', label: '安全与合规', icon: 'shield', href: '#', active: false },
        { id: 'data', label: '数据看板', icon: 'analytics', href: '#', active: false },
        { id: 'billing', label: '账单管理', icon: 'payments', href: '#', active: false },
        { id: 'admin', label: '企业管理', icon: 'settings_suggest', href: '#', active: false }
      ]
    }
  },
  watch: {
    activeNav: {
      immediate: true,
      handler(newVal) {
        this.navItems.forEach(item => {
          item.active = item.id === newVal
        })
      }
    }
  },
  methods: {
    handleNavClick(item) {
      this.$emit('nav-change', item.id)
    }
  }
}
</script>
