<template>
  <div class="relative inline-block text-left" v-click-outside="close">
    <!-- Selector Trigger Button -->
    <button
      @click="toggleDropdown"
      class="flex items-center gap-2 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-xl text-slate-700 dark:text-slate-200 shadow-sm hover:border-primary transition-all group"
    >
      <span class="material-icons-round text-primary text-sm group-hover:scale-110 transition-transform">layers</span>
      <span class="font-bold text-sm tracking-tight">{{ selectedView.label }}</span>
      <span class="material-icons-round text-slate-400 text-sm transition-transform" :class="{ 'rotate-180': isOpen }">expand_more</span>
    </button>

    <!-- Dropdown Menu -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95 translate-y-2"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 translate-y-2"
    >
      <div
        v-if="isOpen"
        class="absolute left-0 mt-3 w-[420px] bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
      >
        <!-- Search Bar -->
        <div class="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <div class="relative group">
            <span class="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm group-focus-within:text-primary transition-colors">search</span>
            <input
              v-model="searchQuery"
              type="text"
              class="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder-slate-400"
              placeholder="搜索项目名称..."
              @click.stop
            />
          </div>
        </div>

        <div class="flex h-[320px]">
          <!-- Level 1: Organizations -->
          <template v-if="!searchQuery">
            <div class="w-1/2 border-r border-slate-100 dark:border-slate-800 overflow-y-auto custom-scrollbar">
              <div
                v-for="org in organizations"
                :key="org.id"
                @mouseenter="selectedOrgId = org.id"
                @click="handleOrgSelect(org)"
                :class="[
                  'px-4 py-3 text-sm font-bold cursor-pointer transition-colors flex items-center justify-between group',
                  selectedOrgId === org.id ? 'bg-primary/5 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                ]"
              >
                <div class="flex items-center gap-2">
                  <span class="material-icons-round text-lg opacity-70 group-hover:scale-110 transition-transform">
                    {{ org.type === 'all' ? 'corporate_fare' : 'hub' }}
                  </span>
                  <span class="truncate">{{ org.name }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <span v-if="selectedView.id === org.id" class="material-icons-round text-primary text-sm">check_circle</span>
                  <span v-else-if="org.projects.length" class="material-icons-round text-sm opacity-30 group-hover:translate-x-1 transition-transform">chevron_right</span>
                </div>
              </div>
            </div>

            <!-- Level 2: Projects -->
            <div class="w-1/2 overflow-y-auto custom-scrollbar bg-slate-50/30 dark:bg-slate-800/20">
              <div v-if="!currentOrgProjects.length" class="h-full flex flex-col items-center justify-center p-6 text-center opacity-40">
                <span class="material-icons-round text-3xl mb-2">analytics</span>
                <span class="text-xs font-bold uppercase tracking-widest">请选择组织</span>
              </div>
              <div
                v-for="project in currentOrgProjects"
                :key="project.id"
                @click="handleProjectSelect(project)"
                :class="[
                  'px-4 py-3 text-sm font-bold cursor-pointer flex items-center gap-2 transition-all hover:pl-5',
                  selectedView.id === project.id ? 'text-primary bg-white dark:bg-slate-700' : 'text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-white dark:hover:bg-slate-700'
                ]"
              >
                <span class="material-icons-round text-sm opacity-50">{{ selectedView.id === project.id ? 'check_circle' : 'topic' }}</span>
                <span class="truncate">{{ project.name }}</span>
              </div>
            </div>
          </template>

          <!-- Search Results View -->
          <template v-else>
            <div class="w-full overflow-y-auto custom-scrollbar">
              <div v-if="!filteredProjects.length" class="h-full flex flex-col items-center justify-center p-12 text-center opacity-40">
                <span class="material-icons-round text-4xl mb-3">search_off</span>
                <span class="text-sm font-bold uppercase tracking-widest">未找到匹配的项目</span>
              </div>
              <div
                v-for="result in filteredProjects"
                :key="result.id"
                @click="handleProjectSelect(result)"
                class="px-6 py-4 border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer flex items-center justify-between group"
              >
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <span class="material-icons-round text-sm">topic</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-sm font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors">{{ result.name }}</span>
                    <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{{ result.orgName }}</span>
                  </div>
                </div>
                <span v-if="selectedView.id === result.id" class="material-icons-round text-primary">check_circle</span>
                <span v-else class="material-icons-round text-primary text-lg opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">arrow_forward</span>
              </div>
            </div>
          </template>
        </div>

        <!-- Footer -->
        <div class="px-6 py-3 bg-slate-50 dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <span class="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">AtomGit Enterprise · View Engine</span>
          <button @click="resetToAll" class="text-[10px] font-black text-primary uppercase tracking-widest hover:underline transition-all">重置为全企业</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'ViewSelector',
  props: {
    selectedView: {
      type: Object,
      default: () => ({ id: 'enterprise', label: '全企业视图 (Enterprise)', orgId: 'enterprise' })
    }
  },
  directives: {
    'click-outside': {
      beforeMount(el, binding) {
        el.clickOutsideEvent = (event) => {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value(event);
          }
        };
        document.addEventListener('click', el.clickOutsideEvent);
      },
      unmounted(el) {
        document.removeEventListener('click', el.clickOutsideEvent);
      },
    },
  },
  data() {
    return {
      isOpen: false,
      searchQuery: '',
      selectedOrgId: 'enterprise',
      organizations: [
        {
          id: 'enterprise',
          name: '全企业视图',
          type: 'all',
          projects: []
        },
        {
          id: 'org1',
          name: 'Core Platform Group',
          projects: [
            { id: 'p1', name: 'atomgit-core', orgName: 'Core Platform Group', orgId: 'org1' },
            { id: 'p2', name: 'atomgit-ui', orgName: 'Core Platform Group', orgId: 'org1' },
            { id: 'p3', name: 'atomgit-cli', orgName: 'Core Platform Group', orgId: 'org1' }
          ]
        },
        {
          id: 'org2',
          name: 'Cloud Services Team',
          projects: [
            { id: 'p4', name: 'cloud-compute-engine', orgName: 'Cloud Services Team', orgId: 'org2' },
            { id: 'p5', name: 'serverless-v3', orgName: 'Cloud Services Team', orgId: 'org2' }
          ]
        },
        {
          id: 'org3',
          name: 'AI & Data Intelligence',
          projects: [
            { id: 'p6', name: 'training-scripts-llm', orgName: 'AI & Data Intelligence', orgId: 'org3' },
            { id: 'p7', name: 'data-lake-connector', orgName: 'AI & Data Intelligence', orgId: 'org3' }
          ]
        },
        {
          id: 'org4',
          name: 'Infrastructure & SRE',
          projects: [
            { id: 'p8', name: 'k8s-operator-utils', orgName: 'Infrastructure & SRE', orgId: 'org4' },
            { id: 'p9', name: 'terraform-modules', orgName: 'Infrastructure & SRE', orgId: 'org4' }
          ]
        }
      ]
    }
  },
  computed: {
    currentOrgProjects() {
      const org = this.organizations.find(o => o.id === this.selectedOrgId);
      return org ? org.projects : [];
    },
    filteredProjects() {
      if (!this.searchQuery) return [];
      const query = this.searchQuery.toLowerCase();
      let results = [];
      this.organizations.forEach(org => {
        org.projects.forEach(project => {
          if (project.name.toLowerCase().includes(query)) {
            results.push(project);
          }
        });
      });
      return results;
    }
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.syncSelectedOrg();
      }
    },
    syncSelectedOrg() {
      // Set the active organization to the one containing the current selection
      this.selectedOrgId = this.selectedView.orgId || 'enterprise';
    },
    close() {
      this.isOpen = false;
      this.searchQuery = '';
    },
    handleOrgSelect(org) {
      const selection = { 
        id: org.id, 
        label: org.type === 'all' ? '全企业视图 (Enterprise)' : `${org.name} (组织)`, 
        orgId: org.id, 
        isOrg: true 
      };
      this.isOpen = false;
      this.$emit('change', selection);
    },
    handleProjectSelect(project) {
      const selection = { id: project.id, label: project.name, orgId: project.orgId };
      this.isOpen = false;
      this.searchQuery = '';
      this.$emit('change', selection);
    },
    resetToAll() {
      const selection = { id: 'enterprise', label: '全企业视图 (Enterprise)', orgId: 'enterprise' };
      this.isOpen = false;
      this.searchQuery = '';
      this.$emit('change', selection);
    }
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
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
