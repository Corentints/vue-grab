<script setup lang="ts">
import { ref, shallowRef, watch, onMounted, onUnmounted, inject } from 'vue'
import { resolveElementInfo } from './utils/resolve'
import { generatePrompt } from './utils/prompt'
import type { VueGrabOptions } from './index'

type Status = 'idle' | 'active' | 'copied'

interface LabelInfo {
  name: string
  file: string | null // shortened: "components/Foo.vue"
  line: number | null
}

const opts = inject<VueGrabOptions>('vue-grab-options', {})
// undefined/true = show lines if data-v-inspector is in the DOM; false = always hide
const showLines = opts.showLines !== false

// Warn once when showLines was explicitly set to true but the Vite plugin isn't detected
let _warnedLines = false
const warnIfMissingVitePlugin = () => {
  if (_warnedLines || opts.showLines !== true) return
  if (!document.querySelector('[data-v-inspector]')) {
    console.warn(
      '[vue-grab] showLines: true is set but vite-plugin-vue-inspector was not detected.\n' +
        'Add vueGrabVitePlugin() to your vite.config.ts to enable source locations.',
    )
    _warnedLines = true
  }
}

const status = ref<Status>('idle')
const hoveredEl = shallowRef<Element | null>(null)
const bounds = ref<DOMRect | null>(null)
const labelInfo = ref<LabelInfo | null>(null)

// Cancel token so stale async label lookups don't overwrite newer ones
let labelToken = 0

// Keep last 2 path segments: "src/components/Foo.vue:17" → "components/Foo.vue"
const shortenPath = (filePath: string) => filePath.split('/').slice(-2).join('/')

// --- Activation ---

const activate = () => {
  warnIfMissingVitePlugin()
  status.value = 'active'
}

const deactivate = () => {
  status.value = 'idle'
  hoveredEl.value = null
  bounds.value = null
  labelInfo.value = null
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (status.value !== 'idle' && e.key === 'Escape') {
    deactivate()
    return
  }
  // Cmd+C / Ctrl+C with nothing selected → toggle grab mode
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'c' && !e.shiftKey && !e.altKey) {
    const selection = window.getSelection()?.toString() ?? ''
    if (!selection) {
      e.preventDefault()
      if (status.value === 'active') deactivate()
      else activate()
    }
  }
}

// --- Hover tracking ---

const updateHover = (e: MouseEvent) => {
  const el = document.elementFromPoint(e.clientX, e.clientY)
  if (!el || el === document.body || el === document.documentElement) {
    hoveredEl.value = null
    bounds.value = null
    labelInfo.value = null
    return
  }

  bounds.value = el.getBoundingClientRect()

  if (hoveredEl.value !== el) {
    hoveredEl.value = el
    labelInfo.value = null
    const token = ++labelToken
    resolveElementInfo(el).then(info => {
      if (token !== labelToken) return
      const filePath = info.source?.filePath ?? null
      labelInfo.value = {
        name: info.componentName ?? `<${info.tagName}>`,
        file: filePath ? shortenPath(filePath) : null,
        line: info.source?.lineNumber ?? null,
      }
    })
  }
}

// --- Click to copy ---

const handleClick = async (e: MouseEvent) => {
  const el = hoveredEl.value
  if (!el) return
  e.preventDefault()
  e.stopPropagation()

  const info = await resolveElementInfo(el)
  const prompt = generatePrompt(el, info, { showLines, prompt: opts.prompt })

  try {
    await navigator.clipboard.writeText(prompt)
  } catch {
    // Clipboard API not available (non-secure context), fallback
    const ta = document.createElement('textarea')
    ta.value = prompt
    ta.style.cssText = 'position:fixed;opacity:0'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    ta.remove()
  }

  status.value = 'copied'
  setTimeout(deactivate, 1200)
}

// --- Lifecycle ---

watch(status, (s, prev) => {
  if (s === 'active') {
    window.addEventListener('mousemove', updateHover)
    window.addEventListener('click', handleClick, true)
    document.documentElement.style.cursor = 'crosshair'
  } else if (prev === 'active') {
    window.removeEventListener('mousemove', updateHover)
    window.removeEventListener('click', handleClick, true)
    document.documentElement.style.cursor = ''
  }
})

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown, true)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown, true)
  window.removeEventListener('mousemove', updateHover)
  window.removeEventListener('click', handleClick, true)
  document.documentElement.style.cursor = ''
})
</script>

<template>
  <Teleport to="body">
    <!-- Highlight box around hovered element -->
    <div
      v-if="status !== 'idle' && bounds"
      :style="{
        position: 'fixed',
        left: bounds.left + 'px',
        top: bounds.top + 'px',
        width: bounds.width + 'px',
        height: bounds.height + 'px',
        pointerEvents: 'none',
        zIndex: '2147483645',
        boxSizing: 'border-box',
        border: '2px solid #3b82f6',
        background: 'rgba(59,130,246,0.08)',
        borderRadius: '3px',
        transition: 'all 50ms linear',
      }"
    />

    <!-- Component name + source label above the highlight -->
    <div
      v-if="status !== 'idle' && bounds && labelInfo"
      :style="{
        position: 'fixed',
        left: bounds.left + 'px',
        top: Math.max(0, bounds.top - (showLines && labelInfo.file ? 44 : 26)) + 'px',
        pointerEvents: 'none',
        zIndex: '2147483646',
        background: '#1e293b',
        color: '#fff',
        fontFamily: 'ui-monospace, monospace',
        padding: '4px 8px',
        borderRadius: '5px',
        whiteSpace: 'nowrap',
        maxWidth: '320px',
        overflow: 'hidden',
        lineHeight: '1',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      }"
    >
      <div :style="{ fontSize: '12px', fontWeight: '600', color: '#93c5fd' }">
        {{ labelInfo.name }}
      </div>
      <div
        v-if="showLines && labelInfo.file"
        :style="{ fontSize: '11px', color: '#94a3b8', marginTop: '3px' }"
      >
        {{ labelInfo.file }}{{ labelInfo.line != null ? `:${labelInfo.line}` : '' }}
      </div>
    </div>

    <!-- Top status bar -->
    <div
      v-if="status !== 'idle'"
      :style="{
        position: 'fixed',
        top: '0',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: '2147483647',
        background: status === 'copied' ? '#22c55e' : '#3b82f6',
        color: '#fff',
        fontSize: '13px',
        fontFamily: 'system-ui, sans-serif',
        fontWeight: '500',
        padding: '5px 18px',
        borderRadius: '0 0 10px 10px',
        pointerEvents: 'none',
        transition: 'background 200ms',
        whiteSpace: 'nowrap',
      }"
    >
      {{ status === 'copied' ? '✓ Prompt copied!' : 'Click a component — Esc to cancel' }}
    </div>
  </Teleport>
</template>
