<script setup lang="ts">
const cartCount = ref(0)
</script>

<template>
  <div class="page">
    <AppNavBar :cart-count="cartCount" />
    <AppHintBanner />
    <main>
      <AppProductGrid @add-to-cart="cartCount++" />
    </main>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
