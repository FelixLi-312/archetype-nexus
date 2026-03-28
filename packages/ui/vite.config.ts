import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      include: ['src/**/*.ts', 'src/**/*.vue'],
    })
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'NexusUI',
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: ['vue', 'element-plus', 'leaflet', '@element-plus/icons-vue'],
      output: {
        globals: {
          vue: 'Vue',
          'element-plus': 'ElementPlus',
          leaflet: 'L',
          '@element-plus/icons-vue': 'ElementPlusIcons'
        }
      }
    }
  }
})
