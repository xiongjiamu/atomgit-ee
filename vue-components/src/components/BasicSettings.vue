<template>
  <div class="basic-settings space-y-6">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">企业信息</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400">管理企业的基本资料、Logo 和联系方式。</p>
    </div>

    <!-- Main Card -->
    <div class="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
      <div class="p-8 space-y-8">
        
        <!-- Logo Section -->
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-4">企业 Logo</label>
          <div class="flex items-center gap-6">
            <div class="relative group">
              <div class="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden">
                <img v-if="formData.logo" :src="formData.logo" alt="Logo Preview" class="w-full h-full object-cover" />
                <span v-else class="material-icons-outlined text-4xl text-gray-300 dark:text-gray-600">business</span>
              </div>
              <div class="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" @click="triggerFileUpload">
                <span class="material-icons-outlined text-white">edit</span>
              </div>
            </div>
            <div>
              <button 
                class="px-4 py-2 bg-white dark:bg-surface-dark border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-md shadow-sm text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                @click="triggerFileUpload"
              >
                更换 Logo
              </button>
              <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">支持 JPG, PNG 格式，最大 2MB。</p>
              <input type="file" ref="fileInput" class="hidden" @change="handleFileChange" accept="image/*" />
            </div>
          </div>
        </div>

        <!-- Form Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Name -->
          <div>
            <label class="block text-sm font-medium text-gray-900 dark:text-white mb-1" for="ent-name">企业名称</label>
            <input 
              type="text" 
              id="ent-name" 
              v-model="formData.name"
              class="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 transition-colors"
            />
          </div>

          <!-- Website -->
          <div>
            <label class="block text-sm font-medium text-gray-900 dark:text-white mb-1" for="ent-website">官方网址</label>
            <div class="relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="text-gray-500 sm:text-sm">https://</span>
              </div>
              <input 
                type="text" 
                id="ent-website" 
                v-model="formData.website"
                class="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white pl-16 py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors"
                placeholder="www.example.com"
              />
            </div>
          </div>

          <!-- Contact Email -->
          <div>
            <label class="block text-sm font-medium text-gray-900 dark:text-white mb-1" for="ent-email">联系邮箱</label>
            <div class="relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="material-icons-outlined text-gray-400 text-sm">email</span>
              </div>
              <input 
                type="email" 
                id="ent-email" 
                v-model="formData.email"
                class="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white pl-10 py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors"
              />
            </div>
          </div>
          
            <!-- Introduction (Full Width) -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-900 dark:text-white mb-1" for="ent-desc">企业简介</label>
              <textarea 
                id="ent-desc" 
                v-model="formData.description"
                rows="3"
                class="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 transition-colors resizing-none"
                placeholder="简要介绍您的企业..."
              ></textarea>
            </div>
          </div>

          <!-- Address (Full Width) -->
          <div>
            <label class="block text-sm font-medium text-gray-900 dark:text-white mb-1" for="ent-address">联系地址</label>
            <div class="relative rounded-md shadow-sm">
               <div class="absolute top-3 left-3 flex items-center pointer-events-none">
                  <span class="material-icons-outlined text-gray-400 text-sm">place</span>
                </div>
              <textarea 
                id="ent-address" 
                v-model="formData.address"
                rows="2"
                class="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white pl-10 py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors resizing-none"
              ></textarea>
            </div>
          </div>
  
        </div>

      <!-- Footer -->
      <div class="px-8 py-5 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex justify-end">
        <button 
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          @click="saveSettings"
        >
          保存更改
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BasicSettings',
  data() {
    return {
      formData: {
        name: 'AtomGit Code Hosting',
        logo: null,
        website: 'atomgit.com',
        email: 'support@atomgit.com',
        address: '北京市朝阳区酒仙桥路 10 号',
        description: 'AtomGit 是由 CSDN 推出的新一代代码托管平台，致力于为开发者提供极致的 Git 代码托管体验。'
      }
    }
  },
  methods: {
    triggerFileUpload() {
      this.$refs.fileInput.click()
    },
    handleFileChange(event) {
      const file = event.target.files[0]
      if (file) {
        // Create preview URL
        this.formData.logo = URL.createObjectURL(file)
      }
    },
    saveSettings() {
      // Logic would go here
      console.log('Saving Basic Settings:', this.formData)
      alert('保存成功')
    }
  }
}
</script>
