import { ref, computed } from 'vue'

// 全局 alert 配置
const globalAlerts = ref([
        {
                id: 'resource-warning',
                type: 'warning',
                title: '资源预警',
                icon: 'warning',
                message: '您企业当前的存储空间已使用 856GB (85%)，接近包年套餐上限，请关注资源消耗或及时扩容',
                show: true,
                dismissible: true,
                // 可以指定哪些页面显示这个 alert，留空表示所有页面
                pages: [] // 例如: ['audit-logs', 'wiki-settings']
        },
        {
                id: 'system-announcement',
                type: 'info',
                title: '企业公告',
                icon: 'info',
                message: 'AtomGit 将于本周五 22:00 进行版本升级，届时 CI/CD 服务会有短时闪断，请知悉',
                show: true,
                dismissible: true,
                pages: []
        }
])

// 已关闭的 alerts（存储在 localStorage）
const dismissedAlerts = ref(new Set(
        JSON.parse(localStorage.getItem('dismissedAlerts') || '[]')
))

export function useGlobalAlerts(pageName = null) {
        // 获取当前页面应该显示的 alerts
        const visibleAlerts = computed(() => {
                return globalAlerts.value.filter(alert => {
                        // 检查是否已被关闭
                        if (dismissedAlerts.value.has(alert.id)) {
                                return false
                        }

                        // 检查是否应该在当前页面显示
                        if (pageName && alert.pages.length > 0) {
                                return alert.pages.includes(pageName)
                        }

                        // 如果 pages 为空，则在所有页面显示
                        return alert.show
                })
        })

        // 关闭 alert
        const dismissAlert = (alertId) => {
                dismissedAlerts.value.add(alertId)
                localStorage.setItem('dismissedAlerts', JSON.stringify([...dismissedAlerts.value]))
        }

        // 重置所有已关闭的 alerts
        const resetDismissedAlerts = () => {
                dismissedAlerts.value.clear()
                localStorage.removeItem('dismissedAlerts')
        }

        // 添加新的 alert
        const addAlert = (alert) => {
                globalAlerts.value.push({
                        id: alert.id || `alert-${Date.now()}`,
                        type: alert.type || 'info',
                        title: alert.title || '',
                        icon: alert.icon || 'info',
                        message: alert.message || '',
                        show: true,
                        dismissible: alert.dismissible !== false,
                        pages: alert.pages || []
                })
        }

        // 移除 alert
        const removeAlert = (alertId) => {
                const index = globalAlerts.value.findIndex(a => a.id === alertId)
                if (index > -1) {
                        globalAlerts.value.splice(index, 1)
                }
        }

        return {
                visibleAlerts,
                dismissAlert,
                resetDismissedAlerts,
                addAlert,
                removeAlert,
                globalAlerts
        }
}
