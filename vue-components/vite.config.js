import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
        plugins: [vue()],
        // GitHub Pages 部署配置
        // 如果部署到 https://<USERNAME>.github.io/<REPO>/
        // 则 base 应该设置为 '/<REPO>/'
        // 如果部署到 https://<USERNAME>.github.io/
        // 则 base 应该设置为 '/'
        base: process.env.NODE_ENV === 'production' ? '/atomgit-ee/' : '/',
        server: {
                port: 3000,
                open: true
        },
        build: {
                outDir: 'dist',
                assetsDir: 'assets',
                // 生成 sourcemap 以便调试
                sourcemap: false,
                // 优化构建
                rollupOptions: {
                        output: {
                                manualChunks: {
                                        'vue-vendor': ['vue']
                                }
                        }
                }
        }
})
