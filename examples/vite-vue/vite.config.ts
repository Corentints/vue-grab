import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { vueGrabVitePlugin } from '../../src/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    ...vueGrabVitePlugin(), // injects data-v-inspector as real DOM attrs for line numbers
  ],
  resolve: {
    alias: {
      // Point directly at the plugin sources — no build step needed
      'vue-grab': resolve(__dirname, '../../src/index.ts'),
    },
  },
})
