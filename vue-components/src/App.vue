<template>
  <div class="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 transition-colors duration-200 h-screen overflow-hidden flex flex-col">
    <!-- Header -->
    <AppHeader
      :company-name="companyName"
      :user-initials="userInitials"
      :has-notifications="hasNotifications"
      @search="handleSearch"
      @create-project="handleCreateProject"
      @notifications="handleNotifications"
      @help="handleHelp"
      @user-profile="handleUserProfile"
    />

    <!-- Main Navigation -->
    <MainNavigation
      :active-nav="activeNav"
      @nav-change="handleNavChange"
    />

    <!-- Main Content -->
    <!-- Dashboard View -->
    <main v-if="activeNav === 'dashboard'" class="layout-container py-10 space-y-10 flex-1 overflow-y-auto custom-scrollbar">
      <!-- Alert Banners -->
      <div class="grid grid-cols-2 gap-8">
        <AlertBanner
          v-model="showResourceAlert"
          type="warning"
          title="资源告警"
          icon="info"
        >
          您当前的存储使用量为 856GB (85%), 接近套餐限额。建议您尽快清理冗余数据或进行服务扩容。
        </AlertBanner>

        <AlertBanner
          v-model="showMaintenanceAlert"
          type="info"
          title="系统维护公告"
          icon="info"
        >
          AtomGit 将于本周五 22:00 进行例行更新维护, 预计耗时 30 分钟。期间 CI/CD 服务可能会出现短暂中断, 请提前安排任务。
        </AlertBanner>
      </div>

      <!-- Seat Usage -->
      <SeatUsage
        :used-seats="seatData.used"
        :total-seats="seatData.total"
        :stats="seatData.stats"
        @manage-seats="handleManageSeats"
        @navigate-to-members="handleNavigateToMembers"
      />

      <!-- Dev Metrics -->
      <DevMetrics
        :days="14"
        :date-range="dateRange"
        :metrics="devMetrics"
        @custom-date="handleCustomDate"
        @navigate-to-efficiency-detail="handleNavigateToEfficiencyDetail"
      />

      <!-- Resources Section -->
      <ResourcesSection
        :resource-cards="resourceCards"
        :ci-days="14"
        :ci-total-runs="ciData.totalRuns"
        :ci-failure-rate="ciData.failureRate"
        :ci-peak-value="ciData.peakValue"
        :ci-metrics="ciData.metrics"
        @navigate-to-resource-center="handleNavigateToResourceCenter"
        @navigate-to-usage-report="handleNavigateToUsageReport"
      />
    </main>

    <!-- Resource Center View -->
    <ResourceCenter
      v-if="activeNav === 'resources'"
      :key="`resource-${resourceCategory}`"
      :initial-category="resourceCategory"
    />

    <!-- Operation Center View -->
    <OperationCenter v-if="activeNav === 'community'" />

    <!-- Pipeline Center View -->
    <PipelineCenter
      v-if="activeNav === 'pipeline'"
      :key="`pipeline-${pipelineCategory}`"
      :initial-category="pipelineCategory"
    />

    <!-- Compliance Center View -->
    <ComplianceCenter v-if="activeNav === 'security'" />

    <!-- Data Center View -->
    <DataCenter
      v-if="activeNav === 'data'"
      :key="`data-${dataCategory}-${dataView || 'overview'}`"
      :initial-category="dataCategory"
      :initial-view="dataView"
    />

    <!-- Billing Center View -->
    <BillingCenter v-if="activeNav === 'billing'" />

    <!-- Settings Center View -->
    <SettingsCenter
      v-if="activeNav === 'admin'"
      :initial-category="settingsCategory"
    />
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue'
import MainNavigation from './components/MainNavigation.vue'
import AlertBanner from './components/AlertBanner.vue'
import SeatUsage from './components/SeatUsage.vue'
import DevMetrics from './components/DevMetrics.vue'
import ResourcesSection from './components/ResourcesSection.vue'
import ResourceCenter from './components/ResourceCenter.vue'
import OperationCenter from './components/OperationCenter.vue'
import PipelineCenter from './components/PipelineCenter.vue'
import ComplianceCenter from './components/ComplianceCenter.vue'
import DataCenter from './components/DataCenter.vue'
import BillingCenter from './components/BillingCenter.vue'
import SettingsCenter from './components/SettingsCenter.vue'

export default {
  name: 'App',
  components: {
    AppHeader,
    MainNavigation,
    AlertBanner,
    SeatUsage,
    DevMetrics,
    ResourcesSection,
    ResourceCenter,
    OperationCenter,
    PipelineCenter,
    ComplianceCenter,
    DataCenter,
    BillingCenter,
    SettingsCenter
  },
  data() {
    return {
      companyName: 'Acme Corp',
      userInitials: 'JS',
      hasNotifications: true,
      activeNav: 'dashboard',
      settingsCategory: 'members',
      dataCategory: 'traffic',
      dataView: null,
      resourceCategory: 'issues',
      pipelineCategory: 'logs',
      showResourceAlert: true,
      showMaintenanceAlert: true,

      seatData: {
        used: 428,
        total: 500,
        stats: [
          { label: '企业成员', value: 380, description: '核心开发团队人员', color: '#3b82f6' },
          { label: '外部协作者', value: 48, description: '外包及合作伙伴账户', color: '#6366f1' },
          { label: '待处理邀请', value: 12, description: '等待加入确认的用户', color: '#f59e0b' }
        ]
      },
      dateRange: '2023-10-25 ~ 2023-11-08',
      devMetrics: [
        {
          title: '代码提交量',
          value: '12,840',
          stats: [
            { label: '提交人数', value: '312' },
            { label: '人均提交', value: '41.2' }
          ],
          chartPath: 'M0 30 L10 28 L20 32 L30 15 L40 20 L50 10 L60 18 L70 12 L80 16 L90 25 L100 20',
          color: 'blue'
        },
        {
          title: '新增 Issue',
          value: '856',
          stats: [
            { label: '已关闭', value: '642' },
            { label: '活跃负责', value: '128' }
          ],
          chartPath: 'M0 20 L15 22 L30 18 L45 25 L60 10 L75 15 L90 8 L100 12',
          color: 'indigo'
        },
        {
          title: '合并请求 (MR)',
          value: '425',
          stats: [
            { label: '已合并', value: '380', colorClass: 'text-emerald-600 dark:text-emerald-400' },
            { label: '创建者', value: '94' }
          ],
          chartPath: 'M0 35 L20 30 L40 25 L60 10 L80 15 L100 5',
          color: 'emerald'
        },
        {
          title: 'PR 评审 (CR)',
          value: '1,120',
          stats: [
            { label: '评审人数', value: '245' },
            { label: '覆盖率', value: '92%', colorClass: 'text-orange-500' }
          ],
          chartPath: 'M0 25 L20 20 L40 28 L60 15 L80 10 L100 18',
          color: 'orange'
        }
      ],
      resourceCards: [
        {
          icon: 'storage',
          title: '存储使用量',
          mainValue: '1.2',
          unit: 'TB',
          subtitle: '周环比增长',
          badge: { text: '+4.2%', type: 'success' },
          showChart: true,
          chartPath: 'M0 35 Q 50 30 100 20'
        },
        {
          icon: 'code',
          title: '项目总数',
          mainValue: '3,420',
          unit: '',
          subtitle: '本周新增: 12 个活跃项目',
          badge: null,
          showChart: true,
          chartPath: 'M0 35 Q 30 35 100 25'
        }
      ],
      ciData: {
        totalRuns: '24,580',
        failureRate: '3.2',
        peakValue: '230 jobs/h',
        metrics: [
          {
            label: '平均耗时',
            icon: 'schedule',
            value: '4m 12s',
            progressWidth: '66.67%',
            progressColor: 'bg-primary'
          },
          {
            label: '平均排队',
            icon: 'hourglass_empty',
            value: '18s',
            progressWidth: '25%',
            progressColor: 'bg-emerald-400'
          },
          {
            label: '失败耗时',
            icon: 'warning',
            value: '142h',
            warning: '资源浪费风险提示'
          }
        ]
      }
    }
  },
  methods: {
    handleSearch(query) {
      console.log('Search:', query)
    },
    handleCreateProject() {
      console.log('Create project')
    },
    handleNotifications() {
      console.log('Show notifications')
    },
    handleHelp() {
      console.log('Show help')
    },
    handleUserProfile() {
      console.log('Show user profile')
    },
    handleNavChange(navId) {
      this.activeNav = navId
      console.log('Nav changed to:', navId)
    },

    handleManageSeats() {
      console.log('Manage seats')
    },
    handleCustomDate() {
      console.log('Custom date picker')
    },
    handleNavigateToMembers() {
      this.settingsCategory = 'members'
      this.activeNav = 'admin'
    },
    handleNavigateToEfficiencyDetail() {
      this.dataCategory = 'efficiency'
      this.dataView = 'detail'
      this.activeNav = 'data'
    },
    handleNavigateToResourceCenter(category) {
      this.resourceCategory = category
      this.activeNav = 'resources'
    },
    handleNavigateToUsageReport() {
      this.pipelineCategory = 'usage'
      this.activeNav = 'pipeline'
    }
  }
}
</script>
