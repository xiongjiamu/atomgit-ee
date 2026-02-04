<template>
  <div
    v-if="!dismissed"
    :class="[
      'flex items-start gap-4 p-5 rounded-lg text-sm relative shadow-sm',
      alertClasses[type]
    ]"
  >
    <span :class="['material-icons-round text-2xl mt-0.5', iconClasses[type]]">
      {{ icons[type] }}
    </span>
    <div class="flex-1 pr-8">
      <span class="font-bold block mb-1 text-base">{{ title }}</span>
      {{ message }}
    </div>
    <button
      :class="['absolute top-5 right-5', closeButtonClasses[type]]"
      @click="handleDismiss"
    >
      <span class="material-icons-round text-xl">close</span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'AlertBanner',
  props: {
    type: {
      type: String,
      default: 'info',
      validator: (value) => ['warning', 'info', 'success', 'error'].includes(value)
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    dismissible: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dismissed: false,
      icons: {
        warning: 'warning_amber',
        info: 'info',
        success: 'check_circle',
        error: 'error'
      },
      alertClasses: {
        warning: 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/50 text-orange-800 dark:text-orange-200',
        info: 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 text-blue-800 dark:text-blue-200',
        success: 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 text-green-800 dark:text-green-200',
        error: 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-800 dark:text-red-200'
      },
      iconClasses: {
        warning: 'text-orange-500',
        info: 'text-blue-500',
        success: 'text-green-500',
        error: 'text-red-500'
      },
      closeButtonClasses: {
        warning: 'text-orange-400 hover:text-orange-600 dark:hover:text-orange-100',
        info: 'text-blue-400 hover:text-blue-600 dark:hover:text-blue-100',
        success: 'text-green-400 hover:text-green-600 dark:hover:text-green-100',
        error: 'text-red-400 hover:text-red-600 dark:hover:text-red-100'
      }
    }
  },
  methods: {
    handleDismiss() {
      if (this.dismissible) {
        this.dismissed = true
        this.$emit('dismiss')
      }
    }
  }
}
</script>
