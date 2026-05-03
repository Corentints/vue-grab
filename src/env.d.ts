/// <reference types="vite/client" />

// Type stub for Nuxt's virtual #app module used in runtime/plugin.ts.
// The real types are provided by Nuxt when this package is used inside a Nuxt project.
declare module '#app' {
  export function defineNuxtPlugin(fn: () => void): () => void
}
