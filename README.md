# vue-grab

Press `Cmd+C` (or `Ctrl+C`) on any empty selection to enter grab mode, then click any component on the page. Its AI-ready context prompt is copied to your clipboard instantly.

Inspired by [react-grab](https://github.com/aidenybai/react-grab).

## What it copies

```
In my Vue app, I want to talk about the <ProductCard> component.

Component: ProductCard
File: src/components/ProductCard.vue:42

Element:
```html
<article class="product-card">
  <div />
  <div />
</article>
```

Component stack:
  in ProductCard (at src/components/ProductCard.vue:42)
  in ProductGrid (at src/components/ProductGrid.vue:8)
  in HomePage (at src/views/HomePage.vue:3)
```

## Installation

```bash
npm i -D vue-grab
```

## Usage

### Vue (Vite)

```ts
// main.ts
import { createApp } from 'vue'
import { createVueGrab } from 'vue-grab'
import App from './App.vue'

const app = createApp(App)

if (import.meta.env.DEV) {
  app.use(createVueGrab())
}

app.mount('#app')
```

### Nuxt

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['vue-grab/nuxt'],
})
```

The Nuxt module is automatically disabled in production builds.

## How it works

- **Activates** on `Cmd+C` / `Ctrl+C` when there is no text selection — normal copy is unaffected
- **Hover** highlights the component with a blue outline and shows the component name
- **Click** resolves the Vue component tree via [`element-source`](https://github.com/aidenybai/element-source), generates a prompt, and writes it to the clipboard
- **Escape** or a second `Cmd+C` exits grab mode

## Source locations (line numbers)

By default vue-grab resolves the component name and file path from Vue's runtime metadata.
For precise **line numbers**, install [`vite-plugin-vue-inspector`](https://github.com/webfansplz/vite-plugin-vue-inspector) and use the bundled Vite plugin:

```bash
npm i -D vite-plugin-vue-inspector
```

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { vueGrabVitePlugin } from 'vue-grab/vite'

export default defineConfig({
  plugins: [vue(), ...vueGrabVitePlugin()],
})
```

Then enable it in the plugin options:

```ts
// Vite
app.use(createVueGrab({ showLines: true }))
```

```ts
// nuxt.config.ts
vueGrab: { showLines: true }
```

> If `showLines: true` is set but the Vite plugin is not detected, vue-grab logs a warning in the console.

## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `enabled` | `boolean` | `true` in dev, `false` in prod | Force enable or disable the plugin |
| `showLines` | `boolean` | `false` | Show `file:line` in hover label and prompt. Requires `vueGrabVitePlugin()`. |
| `prompt` | `string` | — | Custom prompt template. Use `{{ variable }}` placeholders (see below). |

## Custom prompt

Use the `prompt` option to change what gets copied. Write a plain string with `{{ variable }}` placeholders:

```ts
// Vite
app.use(createVueGrab({
  prompt: `Fix the <{{ component }}> component located at {{ file }}:{{ line }}.

{{ html }}`,
}))
```

```ts
// nuxt.config.ts
vueGrab: {
  prompt: `Fix the <{{ component }}> component located at {{ file }}:{{ line }}.

{{ html }}`,
}
```

### Available variables

| Variable | Example | Description |
|---|---|---|
| `{{ component }}` | `ProductCard` | Component name |
| `{{ file }}` | `src/components/ProductCard.vue` | Source file path. Empty if Vite plugin not installed. |
| `{{ line }}` | `42` | Line number. Empty if Vite plugin not installed. |
| `{{ html }}` | `<article class="...">…</article>` | HTML preview of the clicked element |
| `{{ stack }}` | `in ProductCard (at …)\n  in ProductGrid…` | Full component stack, one frame per line |
