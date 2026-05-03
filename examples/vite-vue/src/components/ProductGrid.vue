<script setup lang="ts">
import { ref, computed } from 'vue'
import ProductCard from './ProductCard.vue'

const emit = defineEmits<{ 'add-to-cart': [] }>()

const products = [
  {
    id: 1,
    name: 'Brushed Wool Overshirt',
    category: 'Knitwear',
    price: 185,
    color: '#c4a882',
    colorName: 'Camel',
    isNew: true,
  },
  {
    id: 2,
    name: 'Wide-Leg Cargo Trousers',
    category: 'Trousers',
    price: 125,
    color: '#5d6b4e',
    colorName: 'Moss',
  },
  {
    id: 3,
    name: 'Midi Cotton Slip Dress',
    category: 'Dresses',
    price: 145,
    color: '#ded6c6',
    colorName: 'Ecru',
    isNew: true,
  },
  {
    id: 4,
    name: 'Washed Denim Jacket',
    category: 'Outerwear',
    price: 119,
    originalPrice: 165,
    color: '#8ba5bc',
    colorName: 'Faded Blue',
  },
  {
    id: 5,
    name: 'Ribbed Roll-Neck',
    category: 'Knitwear',
    price: 95,
    color: '#2e2e2e',
    colorName: 'Charcoal',
    isNew: true,
  },
  {
    id: 6,
    name: 'Double-Breasted Overcoat',
    category: 'Outerwear',
    price: 295,
    color: '#1a1a1a',
    colorName: 'Black',
  },
  {
    id: 7,
    name: 'Cotton Poplin Shirt',
    category: 'Shirts',
    price: 89,
    color: '#ece8e0',
    colorName: 'Chalk',
    soldOut: true,
  },
  {
    id: 8,
    name: 'Merino Boxy Cardigan',
    category: 'Knitwear',
    price: 69,
    originalPrice: 110,
    color: '#c4856a',
    colorName: 'Brick',
  },
  {
    id: 9,
    name: 'Pleated Midi Skirt',
    category: 'Dresses',
    price: 115,
    color: '#8a7967',
    colorName: 'Tobacco',
    isNew: true,
  },
  {
    id: 10,
    name: 'Linen Relaxed Blazer',
    category: 'Outerwear',
    price: 210,
    color: '#d4c9b0',
    colorName: 'Sand',
  },
  {
    id: 11,
    name: 'Straight-Leg Chinos',
    category: 'Trousers',
    price: 99,
    originalPrice: 135,
    color: '#b5a898',
    colorName: 'Stone',
  },
  {
    id: 12,
    name: 'Crinkle Cotton Shirt',
    category: 'Shirts',
    price: 79,
    color: '#c6d0c8',
    colorName: 'Sage',
    isNew: true,
  },
]

type Filter =
  | 'All'
  | 'New In'
  | 'Sale'
  | 'Knitwear'
  | 'Outerwear'
  | 'Trousers'
  | 'Dresses'
  | 'Shirts'
const filters: Filter[] = [
  'All',
  'New In',
  'Sale',
  'Knitwear',
  'Outerwear',
  'Trousers',
  'Dresses',
  'Shirts',
]
const activeFilter = ref<Filter>('All')

const filteredProducts = computed(() => {
  if (activeFilter.value === 'All') return products
  if (activeFilter.value === 'New In') return products.filter(p => p.isNew)
  if (activeFilter.value === 'Sale') return products.filter(p => p.originalPrice)
  return products.filter(p => p.category === activeFilter.value)
})
</script>

<template>
  <div class="container">
    <div class="filter-bar">
      <button
        v-for="f in filters"
        :key="f"
        class="filter-btn"
        :class="{ active: activeFilter === f }"
        @click="activeFilter = f"
      >
        {{ f }}
        <span v-if="f === 'New In'" class="filter-count">
          {{ products.filter(p => p.isNew).length }}
        </span>
        <span v-else-if="f === 'Sale'" class="filter-count">
          {{ products.filter(p => p.originalPrice).length }}
        </span>
      </button>
    </div>

    <p class="result-count">{{ filteredProducts.length }} items</p>

    <div class="product-grid">
      <ProductCard
        v-for="p in filteredProducts"
        :key="p.id"
        v-bind="p"
        @add-to-cart="emit('add-to-cart')"
      />
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 32px 64px;
}

.filter-bar {
  display: flex;
  gap: 0;
  border-bottom: 1px solid #e0dcd4;
  margin-bottom: 8px;
  overflow-x: auto;
  scrollbar-width: none;
}

.filter-bar::-webkit-scrollbar {
  display: none;
}

.filter-btn {
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  padding: 18px 18px 16px;
  font-size: 12.5px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #888;
  cursor: pointer;
  white-space: nowrap;
  font-family: inherit;
  transition:
    color 0.15s,
    border-color 0.15s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.filter-btn:hover {
  color: #1c1c1c;
}

.filter-btn.active {
  color: #1c1c1c;
  border-bottom-color: #1c1c1c;
}

.filter-count {
  background: #e0dcd4;
  color: #666;
  font-size: 10px;
  padding: 1px 5px;
  border-radius: 10px;
  font-variant-numeric: tabular-nums;
}

.result-count {
  margin: 0 0 24px;
  font-size: 12px;
  color: #999;
  letter-spacing: 0.03em;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px 16px;
}

@media (max-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 680px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .container {
    padding: 0 16px 48px;
  }
}
</style>
