<template>
  <div class="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
    <!-- Header -->
    <div class="border-b border-slate-200 dark:border-slate-800 pb-6">
      <div class="flex items-center gap-2 mb-2 text-sm text-slate-500 font-bold">
        <a href="#" @click.prevent="$emit('back')" class="hover:text-primary transition-colors">构建资源列表</a>
        <span>/</span>
        <span class="text-slate-900 dark:text-white">接入 Self-hosted Runner</span>
      </div>
      <p class="text-sm text-slate-600 dark:text-slate-400 max-w-4xl leading-relaxed">
        添加 Self-hosted Runner 需要下载、配置并运行 Runner 程序。如果不具备现有的批量许可协议，下载并配置 Runner 即表示您同意相关的客户协议。
      </p>
    </div>

    <!-- Runner Image (OS Selection) -->
    <div class="space-y-3">
      <h3 class="text-sm font-black text-slate-900 dark:text-white">Runner 镜像</h3>
      <div class="flex flex-col sm:flex-row gap-4">
        <label 
          v-for="os in osList" 
          :key="os.id"
          class="flex-1 relative cursor-pointer group"
        >
          <input type="radio" v-model="selectedOS" :value="os.id" class="peer sr-only">
          <div class="px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:ring-1 peer-checked:ring-primary transition-all flex items-center justify-center gap-2 h-full">
             <span class="material-icons-round text-lg" :class="selectedOS === os.id ? 'text-primary' : 'text-slate-400'">{{ os.icon }}</span>
             <span class="font-bold text-sm" :class="selectedOS === os.id ? 'text-primary' : 'text-slate-700 dark:text-slate-300'">{{ os.name }}</span>
             <span v-if="selectedOS === os.id" class="material-icons-round text-primary text-base absolute right-3 top-1/2 -translate-y-1/2">check_circle</span>
          </div>
        </label>
      </div>
    </div>

    <!-- Architecture -->
    <div class="space-y-3">
      <h3 class="text-sm font-black text-slate-900 dark:text-white">系统架构</h3>
      <div class="relative w-48">
        <select class="w-full appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-bold rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all">
          <option>x64</option>
          <option>ARM64</option>
          <option>ARM32</option>
        </select>
        <span class="material-icons-round absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-lg">expand_more</span>
      </div>
    </div>

    <!-- Download -->
    <div class="space-y-3">
      <h3 class="text-sm font-black text-slate-900 dark:text-white">下载</h3>
      <div class="bg-slate-900 rounded-xl p-5 font-mono text-xs text-slate-300 overflow-x-auto relative group shadow-inner border border-slate-800">
        <button class="absolute right-3 top-3 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white opacity-0 group-hover:opacity-100 transition-all" title="复制">
          <span class="material-icons-round text-base">content_copy</span>
        </button>
        <div class="space-y-1.5 selection:bg-primary/30">
          <div class="flex gap-2">
            <span class="text-slate-500 select-none">#</span>
            <span class="text-slate-500">创建文件夹</span>
          </div>
          <div class="flex gap-2 pl-2 border-l-2 border-transparent hover:border-slate-700">
            <span class="text-slate-500 select-none">$</span>
            <span class="text-white">mkdir actions-runner && cd actions-runner</span>
          </div>
          
          <div class="h-2"></div>
          
          <div class="flex gap-2">
            <span class="text-slate-500 select-none">#</span>
            <span class="text-slate-500">下载最新的 runner 包</span>
          </div>
          <div class="flex gap-2 pl-2 border-l-2 border-transparent hover:border-slate-700">
            <span class="text-slate-500 select-none">$</span>
            <span class="text-white break-all">curl -o actions-runner-osx-x64-2.331.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.331.0/actions-runner-osx-x64-2.331.0.tar.gz</span>
          </div>
          
          <div class="h-2"></div>

          <div class="flex gap-2">
            <span class="text-slate-500 select-none">#</span>
            <span class="text-slate-500">可选：验证哈希值</span>
          </div>
          <div class="flex gap-2 pl-2 border-l-2 border-transparent hover:border-slate-700">
            <span class="text-slate-500 select-none">$</span>
            <span class="text-white break-all">echo "0bcba2dd55eb429620f3184cebaa2e403e99dbf2b621e5858203c3aca3900878  actions-runner-osx-x64-2.331.0.tar.gz" | shasum -a 256 -c</span>
          </div>

          <div class="h-2"></div>

          <div class="flex gap-2">
            <span class="text-slate-500 select-none">#</span>
            <span class="text-slate-500">解压安装包</span>
          </div>
          <div class="flex gap-2 pl-2 border-l-2 border-transparent hover:border-slate-700">
            <span class="text-slate-500 select-none">$</span>
            <span class="text-white">tar xzf ./actions-runner-osx-x64-2.331.0.tar.gz</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Configure -->
    <div class="space-y-3">
      <h3 class="text-sm font-black text-slate-900 dark:text-white">配置</h3>
      <div class="bg-slate-900 rounded-xl p-5 font-mono text-xs text-slate-300 overflow-x-auto relative group shadow-inner border border-slate-800">
         <button class="absolute right-3 top-3 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white opacity-0 group-hover:opacity-100 transition-all" title="复制">
          <span class="material-icons-round text-base">content_copy</span>
        </button>
        <div class="space-y-1.5 selection:bg-primary/30">
          <div class="flex gap-2">
            <span class="text-slate-500 select-none">#</span>
            <span class="text-slate-500">创建 runner 并开始配置</span>
          </div>
          <div class="flex gap-2 pl-2 border-l-2 border-transparent hover:border-slate-700">
            <span class="text-slate-500 select-none">$</span>
            <span class="text-white break-all">./config.sh --url https://github.com/gitcode-com --token AB4AWA7BE2XQKY23JHUIOGLJQMX62</span>
          </div>

          <div class="h-2"></div>

          <div class="flex gap-2">
            <span class="text-slate-500 select-none">#</span>
            <span class="text-slate-500">最后一步，运行它！</span>
          </div>
          <div class="flex gap-2 pl-2 border-l-2 border-transparent hover:border-slate-700">
            <span class="text-slate-500 select-none">$</span>
            <span class="text-white">./run.sh</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Using -->
    <div class="space-y-3">
      <h3 class="text-sm font-black text-slate-900 dark:text-white">使用您的 Self-hosted Runner</h3>
      <div class="bg-slate-900 rounded-xl p-5 font-mono text-xs text-slate-300 overflow-x-auto relative group shadow-inner border border-slate-800">
         <button class="absolute right-3 top-3 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white opacity-0 group-hover:opacity-100 transition-all" title="复制">
          <span class="material-icons-round text-base">content_copy</span>
        </button>
        <div class="space-y-1.5 selection:bg-primary/30">
          <div class="flex gap-2">
            <span class="text-slate-500 select-none">#</span>
            <span class="text-slate-500">在 workflow 文件的每个 job 中使用此 YAML</span>
          </div>
          <div class="flex gap-2 pl-2 border-l-2 border-transparent hover:border-slate-700">
            <span class="text-white">runs-on: self-hosted</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="pt-6 border-t border-slate-200 dark:border-slate-800">
       <p class="text-sm text-slate-600 dark:text-slate-400">
         有关配置、运行或关闭 Runner 的更多详细信息，请查看我们的 <a href="#" class="text-primary hover:underline">产品文档</a>。
       </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreateRunner',
  emits: ['back'],
  data() {
    return {
      selectedOS: 'macos',
      osList: [
        { id: 'macos', name: 'macOS', icon: 'laptop_mac' },
        { id: 'linux', name: 'Linux', icon: 'terminal' },
        { id: 'windows', name: 'Windows', icon: 'window' }
      ]
    }
  }
}
</script>
