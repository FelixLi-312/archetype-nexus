import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
   resolve: {
     alias: {
      '@': path.resolve(__dirname, 'src'),
      '@nexus/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@nexus/utils': path.resolve(__dirname, '../../packages/utils/src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 自动注入全局变量和混合宏
        // 注意：结尾不要加分号，Vite 会将其作为内容插入到每个 scss 文件头部
        additionalData: `
          @use "@/styles/variables.scss" as *;
          @use "@/styles/mixins.scss" as *;
        `,
        // 如果使用的是 sass 1.33+，推荐使用 silenceDeprecations 忽略某些警告
        silenceDeprecations: ['legacy-js-api']
      }
    }
  }
})
