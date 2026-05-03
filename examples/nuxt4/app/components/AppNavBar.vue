<script setup lang="ts">
defineProps<{ cartCount: number }>()
</script>

<template>
  <header class="navbar">
    <nav class="navbar-left">
      <a href="#">Women</a>
      <a href="#">Men</a>
      <a href="#">New In</a>
      <a href="#">Sale</a>
    </nav>

    <a href="#" class="navbar-brand">HOLT</a>

    <nav class="navbar-right">
      <a href="#">Search</a>
      <a href="#" class="cart-link">
        Bag<span v-if="cartCount > 0" class="cart-count"> ({{ cartCount }})</span>
      </a>
    </nav>
  </header>
</template>

<style scoped>
.navbar {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 0 32px;
  height: 58px;
  background: #f8f6f1;
  border-bottom: 1px solid #e0dcd4;
  position: sticky;
  top: 0;
  z-index: 10;
}

.navbar-brand {
  font-family: 'Georgia', 'Times New Roman', serif;
  font-size: 20px;
  letter-spacing: 0.2em;
  font-weight: normal;
  text-decoration: none;
  text-align: center;
}

.navbar-left,
.navbar-right {
  display: flex;
  gap: 28px;
}

.navbar-right {
  justify-content: flex-end;
}

.navbar-left a,
.navbar-right a {
  text-decoration: none;
  font-size: 12.5px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.navbar-left a:hover,
.navbar-right a:hover {
  text-decoration: underline;
}

.cart-count {
  font-variant-numeric: tabular-nums;
}
</style>
