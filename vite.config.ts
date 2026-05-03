import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    dts({ include: ['src'], tsconfigPath: './tsconfig.json' }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        vite: resolve(__dirname, 'src/vite.ts'),
        nuxt: resolve(__dirname, 'src/nuxt.ts'),
        'runtime/plugin': resolve(__dirname, 'src/runtime/plugin.ts'),
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) =>
        `${entryName}.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: [
        'vue',
        'vite',
        '#app',
        'nuxt/app',
        '@nuxt/kit',
        'nuxt',
        'element-source',
        'vite-plugin-vue-inspector',
      ],
      output: {
        globals: { vue: 'Vue' },
        chunkFileNames: 'chunks/[name]-[hash].[format]',
      },
    },
    sourcemap: true,
  },
})
