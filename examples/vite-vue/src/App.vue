<script setup lang="ts">
import { ref } from 'vue'
import NavBar from './components/NavBar.vue'
import HintBanner from './components/HintBanner.vue'
import ProductGrid from './components/ProductGrid.vue'

const cartCount = ref(0)
</script>

<template>
  <div class="app">
    <NavBar :cart-count="cartCount" />
    <HintBanner />
    <main>
      <ProductGrid @add-to-cart="cartCount++" />
    </main>
  </div>
</template>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
}
body {
  margin: 0;
  background: #f8f6f1;
  font-family:
    system-ui,
    -apple-system,
    'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  color: #1c1c1c;
}
a {
  color: inherit;
}
</style>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
