<template>
  <div class="flex flex-1 overflow-hidden bg-background-light dark:bg-background-dark">
    <!-- Sidebar -->
    <ResourceSidebar v-if="!selectedKanban" :active-category="currentCategory" @category-change="handleCategoryChange" />

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto">
      <div v-if="!selectedKanban" class="px-6 pt-6 pb-2 space-y-3">
        <!-- Resource Alert -->
        <div class="rounded-md bg-orange-50 dark:bg-orange-900/20 p-3 border border-orange-100 dark:border-orange-800 flex items-start">
          <div class="flex-shrink-0">
            <span class="material-icons-round text-orange-400 dark:text-orange-500 text-lg">info</span>
          </div>
          <div class="ml-3 flex-1 md:flex md:justify-between">
            <p class="text-sm text-orange-700 dark:text-orange-300">
              <span class="font-bold">资源预警：</span> 您企业当前的存储空间已使用 856GB (85%)，接近包年套餐上限，请关注资源消耗或及时扩容
            </p>
            <p class="mt-3 text-sm md:mt-0 md:ml-6">
              <button class="whitespace-nowrap font-medium text-orange-700 dark:text-orange-300 hover:text-orange-600 dark:hover:text-orange-200">
                <span class="material-icons-round text-sm align-middle">close</span>
              </button>
            </p>
          </div>
        </div>

        <!-- System Alert -->
        <div class="rounded-md bg-blue-50 dark:bg-blue-900/20 p-3 border border-blue-100 dark:border-blue-800 flex items-start">
          <div class="flex-shrink-0">
            <span class="material-icons-round text-blue-400 dark:text-blue-500 text-lg">info</span>
          </div>
          <div class="ml-3 flex-1 md:flex md:justify-between">
            <p class="text-sm text-blue-700 dark:text-blue-300">
              <span class="font-bold">企业公告：</span> AtomGit 将于本周五 22:00 进行版本升级，届时 CI/CD 服务可能会有短时闪断，请知悉
            </p>
            <p class="mt-3 text-sm md:mt-0 md:ml-6">
              <button class="whitespace-nowrap font-medium text-blue-700 dark:text-blue-300 hover:text-blue-600 dark:hover:text-blue-200">
                <span class="material-icons-round text-sm align-middle">close</span>
              </button>
            </p>
          </div>
        </div>
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
    ResourceStats
  },
  data() {
    return {
      currentCategory: 'issues',
      selectedKanban: null
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
