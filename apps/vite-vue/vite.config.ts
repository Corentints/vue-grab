import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { vueGrabVitePlugin } from 'vue-grab/vite'

export default defineConfig({
  plugins: [
    vue(),
    ...vueGrabVitePlugin(),
  ],
})
