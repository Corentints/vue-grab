<script setup lang="ts">
const props = defineProps<{
  name: string
  category: string
  price: number
  originalPrice?: number
  color: string
  colorName: string
  isNew?: boolean
  soldOut?: boolean
}>()

const emit = defineEmits<{ 'add-to-cart': [] }>()
</script>

<template>
  <article class="product-card">
    <div class="product-image">
      <div class="image-sheen" />
      <span v-if="isNew" class="badge badge-new">New In</span>
      <span v-else-if="originalPrice" class="badge badge-sale">Sale</span>
      <span v-if="soldOut" class="badge badge-soldout">Sold Out</span>
      <span class="color-label">● {{ colorName }}</span>
    </div>

    <div class="product-info">
      <p class="product-category">{{ category }}</p>
      <h3 class="product-name">{{ name }}</h3>
      <div class="product-footer">
        <div class="product-pricing">
          <span v-if="originalPrice" class="price-original">£{{ originalPrice }}</span>
          <span class="price" :class="{ 'price-sale': originalPrice }">£{{ price }}</span>
        </div>
        <button class="add-btn" :disabled="soldOut" @click="emit('add-to-cart')">
          {{ soldOut ? 'Sold out' : 'Add to bag →' }}
        </button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  cursor: default;
}

.product-image {
  position: relative;
  background-color: v-bind(color);
  aspect-ratio: 3 / 4;
  overflow: hidden;
  transition: opacity 0.2s;
}

.product-card:hover .product-image {
  opacity: 0.92;
}

.image-sheen {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    140deg,
    rgba(255, 255, 255, 0.14) 0%,
    transparent 55%,
    rgba(0, 0, 0, 0.07) 100%
  );
  pointer-events: none;
}

.badge {
  position: absolute;
  top: 12px;
  left: 12px;
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 3px 7px;
  font-weight: 600;
}

.badge-new {
  background: #1c1c1c;
  color: #f8f6f1;
}
.badge-sale {
  background: #b84040;
  color: #fff;
}
.badge-soldout {
  background: rgba(248, 246, 241, 0.85);
  color: #1c1c1c;
}

.color-label {
  position: absolute;
  bottom: 10px;
  left: 12px;
  font-size: 10.5px;
  letter-spacing: 0.04em;
  color: rgba(255, 255, 255, 0.75);
  mix-blend-mode: overlay;
  filter: invert(1);
  opacity: 0.6;
}

.product-info {
  padding: 12px 0 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.product-category {
  margin: 0;
  font-size: 11px;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: #888;
}

.product-name {
  margin: 0;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.35;
  color: #1c1c1c;
}

.product-footer {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-top: 6px;
}

.product-pricing {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.price {
  font-size: 14px;
  font-weight: 500;
  color: #1c1c1c;
}

.price-sale {
  color: #b84040;
}

.price-original {
  font-size: 12.5px;
  color: #aaa;
  text-decoration: line-through;
}

.add-btn {
  background: none;
  border: none;
  padding: 0;
  font-size: 12px;
  letter-spacing: 0.04em;
  color: #555;
  cursor: pointer;
  font-family: inherit;
  transition: color 0.15s;
}

.add-btn:hover:not(:disabled) {
  color: #1c1c1c;
}
.add-btn:disabled {
  color: #bbb;
  cursor: default;
}
</style>
