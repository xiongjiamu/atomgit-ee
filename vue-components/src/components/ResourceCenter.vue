<template>
  <div class="flex flex-1 overflow-hidden bg-background-light dark:bg-background-dark">
    <!-- Sidebar -->
    <ResourceSidebar v-if="!selectedKanban" :active-category="currentCategory" @category-change="handleCategoryChange" />

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto">
      <div v-if="!selectedKanban" class="px-6 pt-6 pb-2 space-y-3">
        <!-- Resource Alert -->
        <AlertBanner
          v-model="showResourceAlert"
          type="warning"
          title="资源预警"
          icon="info"
        >
          您企业当前的存储空间已使用 856GB (85%)，接近包年套餐上限，请关注资源消耗或及时扩容
        </AlertBanner>

        <!-- System Alert -->
        <AlertBanner
          v-model="showSystemAlert"
          type="info"
          title="企业公告"
          icon="info"
        >
          AtomGit 将于本周五 22:00 进行版本升级，届时 CI/CD 服务可能会有短时闪断，请知悉
        </AlertBanner>
      </div>

      <div class="px-6 py-4">
        <template v-if="currentCategory === 'issues'">
          <IssueList />
        </template>
        <template v-else-if="currentCategory === 'kanban'">
          <KanbanDetail
            v-if="selectedKanban"
            :kanban-id="selectedKanban.id"
            :kanban-name="selectedKanban.name"
            @back="selectedKanban = null"
          />
          <KanbanList v-else @select-kanban="handleSelectKanban" />
        </template>
        <template v-else-if="currentCategory === 'pull_requests'">
          <PullRequestList />
        </template>
        <template v-else-if="currentCategory === 'projects'">
          <ProjectList />
        </template>
        <template v-else-if="currentCategory === 'milestones'">
          <MilestoneList />
        </template>
        <template v-else-if="currentCategory === 'lfs'">
          <LfsList />
        </template>
        <template v-else-if="currentCategory === 'warning'">
          <ResourceStats />
        </template>
      </div>
    </main>
  </div>
</template>

<script>
import ResourceSidebar from './ResourceSidebar.vue'
import IssueList from './IssueList.vue'
import KanbanList from './KanbanList.vue'
import KanbanDetail from './KanbanDetail.vue'
import PullRequestList from './PullRequestList.vue'
import ProjectList from './ProjectList.vue'
import MilestoneList from './MilestoneList.vue'
import LfsList from './LfsList.vue'
import ResourceStats from './ResourceStats.vue'
import AlertBanner from './AlertBanner.vue'

export default {
  name: 'ResourceCenter',
  components: {
    ResourceSidebar,
    IssueList,
    KanbanList,
    KanbanDetail,
    PullRequestList,
    ProjectList,
    MilestoneList,
    LfsList,
    ResourceStats,
    AlertBanner
  },
  props: {
    initialCategory: {
      type: String,
      default: 'issues'
    }
  },
  data() {
    return {
      currentCategory: this.initialCategory,
      selectedKanban: null,
      showResourceAlert: true,
      showSystemAlert: true
    }
  },
  watch: {
    initialCategory: {
      handler(newVal) {
        if (newVal) {
          this.currentCategory = newVal
        }
      },
      immediate: true
    }
  },
  mounted() {
    // 确保在组件挂载时也检查 initialCategory
    if (this.initialCategory) {
      this.currentCategory = this.initialCategory
    }
  },
  methods: {
    handleCategoryChange(categoryId) {
      this.currentCategory = categoryId
      this.selectedKanban = null
    },
    handleSelectKanban(kanban) {
      this.selectedKanban = kanban
    }
  }
}
</script>
