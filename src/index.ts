import { type App, createApp } from 'vue'
import type { ElementInfo } from 'element-source'
import GrabOverlay from './GrabOverlay.vue'

export type { ElementInfo }
export { generatePrompt } from './utils/prompt'

export interface VueGrabOptions {
  /** Explicitly enable or disable the plugin. Defaults to true in dev, false in prod. */
  enabled?: boolean
  /**
   * Show file:line info in the hover label and prompt.
   * Requires `vueGrabVitePlugin()` in your Vite config to inject source locations.
   * Default: false.
   */
  showLines?: boolean
  /**
   * Custom prompt template using {{ variable }} placeholders.
   *
   * Available variables:
   * - `{{ component }}` — component name, e.g. `ProductCard`
   * - `{{ file }}`      — source file path, e.g. `src/components/ProductCard.vue` (empty without vueGrabVitePlugin)
   * - `{{ line }}`      — line number, e.g. `42` (empty without vueGrabVitePlugin)
   * - `{{ html }}`      — HTML preview of the clicked element
   * - `{{ stack }}`     — component stack, one frame per line
   *
   * @example
   * prompt: `Fix the <{{ component }}> at {{ file }}:{{ line }}.\n\n{{ html }}`
   */
  prompt?: string
}

export function createVueGrab(options: VueGrabOptions = {}) {
  return {
    install(_app: App) {
      // Use process.env only — import.meta.env gets replaced at library build time
      const isProd = typeof process !== 'undefined' && process.env['NODE_ENV'] === 'production'

      if (isProd && options.enabled !== true) return
      if (options.enabled === false) return

      // Guard against double-mounting (e.g. HMR)
      if (document.querySelector('[data-vue-grab]')) return

      const container = document.createElement('div')
      container.setAttribute('data-vue-grab', 'true')
      document.body.appendChild(container)

      const overlayApp = createApp(GrabOverlay)
      overlayApp.provide('vue-grab-options', options)
      overlayApp.mount(container)
    },
  }
}
