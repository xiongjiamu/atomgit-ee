<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 -translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-2"
  >
    <div 
      v-if="show" 
      :class="[
        'rounded-xl p-4 flex items-start border mb-4',
        type === 'warning' ? 'bg-amber-50/50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/20' : 
        type === 'info' ? 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/20' :
        type === 'error' ? 'bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-900/20' :
        'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
      ]"
    >
      <span 
        class="material-icons-round text-lg mt-0.5 mr-3"
        :class="[
          type === 'warning' ? 'text-amber-500' : 
          type === 'info' ? 'text-blue-500' :
          type === 'error' ? 'text-red-500' :
          'text-slate-500'
        ]"
      >{{ icon }}</span>
      
      <div 
        class="flex-1 text-sm"
        :class="[
          type === 'warning' ? 'text-amber-800 dark:text-amber-200' : 
          type === 'info' ? 'text-blue-800 dark:text-blue-200' :
          type === 'error' ? 'text-red-800 dark:text-red-200' :
          'text-slate-700 dark:text-slate-300'
        ]"
      >
        <span v-if="title" class="font-bold mr-1">{{ title }}:</span>
        <slot>{{ message }}</slot>
      </div>
      
      <button 
        v-if="dismissible"
        class="transition-colors ml-2"
        :class="[
          type === 'warning' ? 'text-amber-400 hover:text-amber-600' : 
          type === 'info' ? 'text-blue-400 hover:text-blue-600' :
          type === 'error' ? 'text-red-400 hover:text-red-600' :
          'text-slate-400 hover:text-slate-600'
        ]"
        @click="dismiss"
      >
        <span class="material-icons-round text-lg">close</span>
      </button>
    </div>
  </Transition>
</template>

<script>
export default {
  name: 'AlertBanner',
  props: {
    type: {
      type: String,
      default: 'info', // warning, info, error, default
      validator: (value) => ['warning', 'info', 'error', 'default'].includes(value)
    },
    title: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: 'info'
    },
    dismissible: {
      type: Boolean,
      default: true
    },
    modelValue: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:modelValue', 'close'],
  data() {
    return {
      internalShow: this.modelValue
    }
  },
  computed: {
    show: {
      get() {
        return this.modelValue !== undefined ? this.modelValue : this.internalShow
      },
      set(val) {
        this.internalShow = val
        this.$emit('update:modelValue', val)
      }
    }
  },
  watch: {
    modelValue(val) {
      this.internalShow = val
    }
  },
  methods: {
    dismiss() {
      this.show = false
      this.$emit('close')
    }
  }
}
</script>
