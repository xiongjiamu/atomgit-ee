<template>
  <nav class="bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark sticky top-0 z-50 h-[60px]">
    <div class="layout-container py-3 flex items-center justify-between">
      <!-- Logo and Company Name -->
      <div class="flex items-center gap-4">
        <div class="w-9 h-9 rounded bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-bold text-sm">
          A
        </div>
        <div class="flex items-center gap-3">
          <span class="font-bold text-lg text-slate-900 dark:text-white">{{ companyName }}</span>
          <span class="text-xs border border-slate-200 dark:border-slate-600 px-2 py-0.5 rounded text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 font-medium">
            企业版
          </span>
        </div>
      </div>

      <!-- Search Bar -->
      <div class="flex-1 max-w-3xl mx-16">
        <div class="relative">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span class="material-icons-round text-slate-400 text-xl">search</span>
          </span>
          <input
            v-model="searchQuery"
            class="block w-full pl-11 pr-4 py-2 border border-border-light dark:border-border-dark rounded-md leading-5 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm shadow-sm"
            :placeholder="searchPlaceholder"
            type="text"
            @keyup.enter="handleSearch"
          />
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span class="text-slate-400 text-xs border border-slate-200 dark:border-slate-700 px-1.5 rounded bg-slate-100 dark:bg-slate-800">/</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-6">
        <button
          class="bg-slate-900 dark:bg-primary text-white px-5 py-2.5 rounded text-sm font-medium flex items-center gap-1.5 hover:opacity-90 transition shadow-sm"
          @click="handleCreateProject"
        >
          <span class="material-icons-round text-sm">add</span> 新建项目
        </button>
        <div class="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
        <div class="flex items-center gap-5">
          <button
            class="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 relative"
            @click="handleNotifications"
          >
            <span class="material-icons-round text-2xl">notifications_none</span>
            <span
              v-if="hasNotifications"
              class="absolute top-0.5 right-0.5 block h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-slate-800 bg-red-500"
            ></span>
          </button>
          <button
            class="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            @click="handleHelp"
          >
            <span class="material-icons-round text-2xl">help_outline</span>
          </button>
          <div
            class="w-9 h-9 rounded-full bg-pink-100 dark:bg-pink-900 flex items-center justify-center text-pink-600 dark:text-pink-300 font-bold text-sm cursor-pointer ring-2 ring-transparent hover:ring-pink-200 dark:hover:ring-pink-800 transition"
            @click="handleUserProfile"
          >
            {{ userInitials }}
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'AppHeader',
  props: {
    companyName: {
      type: String,
      default: 'Acme Corp'
    },
    userInitials: {
      type: String,
      default: 'JS'
    },
    hasNotifications: {
      type: Boolean,
      default: true
    },
    searchPlaceholder: {
      type: String,
      default: '在 AtomGit 中搜索项目、代码或成员...'
    }
  },
  data() {
    return {
      searchQuery: ''
    }
  },
  methods: {
    handleSearch() {
      this.$emit('search', this.searchQuery)
    },
    handleCreateProject() {
      this.$emit('create-project')
    },
    handleNotifications() {
      this.$emit('notifications')
    },
    handleHelp() {
      this.$emit('help')
    },
    handleUserProfile() {
      this.$emit('user-profile')
    }
  }
}
</script>
