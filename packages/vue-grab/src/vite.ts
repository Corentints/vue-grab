import type { Plugin, PluginOption } from 'vite'
import VueInspector from 'vite-plugin-vue-inspector'

/**
 * Vite plugin that injects precise line/column source locations as real DOM
 * attributes (data-v-inspector="file:line:col"), enabling vue-grab to show
 * exact line numbers when hovering over components.
 *
 * Uses vite-plugin-vue-inspector for the template transform, but skips its
 * post-transform — that post step moves the attribute from the DOM to a
 * non-enumerable vnode property, which breaks element-source's DOM lookup.
 * Without it, the attribute stays in the actual DOM where element-source
 * can find it via element.closest('[data-v-inspector]').
 *
 * Requires: npm i -D vite-plugin-vue-inspector
 */
export function vueGrabVitePlugin(): PluginOption {
  const raw = VueInspector({ toggleButtonVisibility: 'never', toggleComboKey: false })
  const plugins = (Array.isArray(raw) ? raw : [raw]) as Plugin[]

  // The "post" plugin moves data-v-inspector out of the DOM into a non-enumerable
  // vnode property (__v_inspector). We drop it so the attribute stays as a real
  // DOM attribute that element-source can read.
  return plugins.filter(p => p.name !== 'vite-plugin-vue-inspector:post')
}
