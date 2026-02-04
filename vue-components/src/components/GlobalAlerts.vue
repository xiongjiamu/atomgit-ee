<template>
  <div v-if="visibleAlerts.length > 0" class="space-y-3 mb-6">
    <AlertBanner
      v-for="alert in visibleAlerts"
      :key="alert.id"
      :type="alert.type"
      :title="alert.title"
      :icon="alert.icon"
      :message="alert.message"
      :dismissible="alert.dismissible"
      :model-value="true"
      @close="handleDismiss(alert.id)"
    />
  </div>
</template>

<script>
import { useGlobalAlerts } from '../composables/useGlobalAlerts'
import AlertBanner from './AlertBanner.vue'

export default {
  name: 'GlobalAlerts',
  components: {
    AlertBanner
  },
  props: {
    // 可选：指定当前页面名称，用于过滤只在特定页面显示的 alerts
    pageName: {
      type: String,
      default: null
    }
  },
  setup(props) {
    const { visibleAlerts, dismissAlert } = useGlobalAlerts(props.pageName)

    const handleDismiss = (alertId) => {
      dismissAlert(alertId)
    }

    return {
      visibleAlerts,
      handleDismiss
    }
  }
}
</script>
