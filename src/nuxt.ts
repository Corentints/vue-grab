import { defineNuxtModule, addPluginTemplate, createResolver } from '@nuxt/kit'
import type { VueGrabOptions } from './index'

export interface ModuleOptions extends Pick<VueGrabOptions, 'enabled' | 'showLines' | 'prompt'> {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'vue-grab',
    configKey: 'vueGrab',
    compatibility: { nuxt: '>=3' },
  },
  defaults: {},
  setup(options: ModuleOptions, nuxt: { options: { dev: boolean } }) {
    // Only active in dev mode
    if (!nuxt.options.dev || options.enabled === false) return

    const { resolve } = createResolver(import.meta.url)
    const grabOverlayPath = resolve('./GrabOverlay.vue')
    const serializedOptions = JSON.stringify({
      showLines: options.showLines ?? false,
      ...(options.prompt ? { prompt: options.prompt } : {}),
    })

    addPluginTemplate({
      filename: 'vue-grab-plugin.mjs',
      mode: 'client',
      getContents: () => `
import { defineNuxtPlugin } from '#app'
import { createApp } from 'vue'
import GrabOverlay from '${grabOverlayPath}'

export default defineNuxtPlugin(() => {
  if (document.querySelector('[data-vue-grab]')) return

  const options = ${serializedOptions}
  const container = document.createElement('div')
  container.setAttribute('data-vue-grab', 'true')
  document.body.appendChild(container)

  const app = createApp(GrabOverlay)
  app.provide('vue-grab-options', options)
  app.mount(container)
})
`,
    })
  },
})
