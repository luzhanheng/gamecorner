import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // 生产环境关闭sourcemap
    minify: 'terser', // 使用terser压缩
    terserOptions: {
      compress: {
        drop_console: true, // 移除console.log
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        // 代码分割
        manualChunks: {
          vendor: ['vue', 'vue-router', 'vue-i18n'],
          phaser: ['phaser']
        },
        // 文件名优化
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    // 压缩阈值
    chunkSizeWarningLimit: 1000
  },
  // 预构建优化
  optimizeDeps: {
    include: ['vue', 'vue-router', 'vue-i18n', 'phaser']
  }
})