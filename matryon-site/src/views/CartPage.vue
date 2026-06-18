<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import { useAuth } from '../lib/auth.js'
import { useCart } from '../lib/cart.js'
import { getFallbackProducts, fetchProducts } from '../lib/productData.js'

const router = useRouter()
const { user, init } = useAuth()
const { items, totalItems, load, removeItem, updateQuantity, clearCart } = useCart()

const products = ref({})

watch(user, (val) => {
  if (!val) {
    router.push('/login')
  }
})

onMounted(async () => {
  await init()
  if (!user.value) {
    return
  }

  for (const p of getFallbackProducts()) {
    products.value[p.id] = p
  }

  const [, all] = await Promise.all([load(), fetchProducts()])
  for (const p of all) {
    products.value[p.id] = p
  }
})

const totalPrice = computed(() => {
  let sum = 0
  for (const item of items.value) {
    const p = products.value[item.product_id]
    if (p) {
      const price = parseInt(p.price.replace(/\s/g, ''))
      sum += price * item.quantity
    }
  }
  return sum.toLocaleString('ru-RU')
})

async function handleRemove(itemId) {
  await removeItem(itemId)
}

async function handleQuantity(itemId, delta) {
  const item = items.value.find(i => i.id === itemId)
  if (!item) return
  const newQty = item.quantity + delta
  if (newQty < 1) {
    await handleRemove(itemId)
  } else {
    await updateQuantity(itemId, newQty)
  }
}

function goToCheckout() {
  router.push('/checkout')
}
</script>

<template>
  <AppHeader />
  <main class="cart-page">
    <section class="container">
      <div class="cart-header">
        <h1 class="cart-title">КОРЗИНА</h1>
        <button v-if="items.length" class="cart-clear" @click="clearCart">ОЧИСТИТЬ</button>
      </div>

      <div v-if="!items.length" class="cart-empty">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5">
          <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0020 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" fill="#ccc"/>
        </svg>
        <p class="cart-empty__text">Корзина пуста</p>
        <router-link to="/catalog" class="cart-empty__link">ПЕРЕЙТИ В КАТАЛОГ</router-link>
      </div>

      <div v-else class="cart-items">
        <div v-for="item in items" :key="item.id" class="cart-item">
          <div class="cart-item__image">
            <img v-if="products[item.product_id]" :src="products[item.product_id].image" :alt="products[item.product_id].name" />
          </div>
          <div class="cart-item__info">
            <router-link :to="'/product/' + item.product_id" class="cart-item__name">
              {{ products[item.product_id]?.name || item.product_id }}
            </router-link>
            <p class="cart-item__price">{{ products[item.product_id]?.price || '—' }} ₽</p>
          </div>
          <div class="cart-item__qty">
            <button class="cart-item__qty-btn" @click="handleQuantity(item.id, -1)">−</button>
            <span class="cart-item__qty-value">{{ item.quantity }}</span>
            <button class="cart-item__qty-btn" @click="handleQuantity(item.id, 1)">+</button>
          </div>
          <button class="cart-item__remove" @click="handleRemove(item.id)">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <div class="cart-footer">
          <div class="cart-total">
            <span class="cart-total__label">ИТОГО:</span>
            <span class="cart-total__price">{{ totalPrice }} ₽</span>
          </div>
          <button class="cart-checkout" @click="goToCheckout">ОФОРМИТЬ ЗАКАЗ</button>
        </div>
      </div>
    </section>
  </main>
  <AppFooter />
</template>

<style scoped>
.cart-page {
  min-height: 70vh;
  padding: 80px 0;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.cart-title {
  font-family: 'Onest', sans-serif;
  font-size: 64px;
  font-weight: 500;
  color: #040404;
}

.cart-clear {
  font-family: 'Roboto Mono', monospace;
  font-size: 14px;
  text-transform: uppercase;
  color: rgba(0,0,0,0.5);
  background: none;
  border: 1px solid rgba(0,0,0,0.2);
  border-radius: 8px;
  padding: 10px 20px;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
}

.cart-clear:hover {
  color: #040404;
  border-color: #040404;
}

.cart-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 80px 0;
}

.cart-empty__text {
  font-family: 'Onest', sans-serif;
  font-size: 28px;
  color: rgba(0,0,0,0.5);
}

.cart-empty__link {
  font-family: 'Roboto Mono', monospace;
  font-size: 16px;
  text-transform: uppercase;
  color: white;
  background: #040404;
  border-radius: 100px;
  padding: 14px 32px;
  text-decoration: none;
  transition: opacity 0.2s;
}

.cart-empty__link:hover {
  opacity: 0.8;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 12px;
  transition: border-color 0.2s;
}

.cart-item:hover {
  border-color: #ccc;
}

.cart-item__image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  background: #f0f0f0;
  flex-shrink: 0;
}

.cart-item__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cart-item__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cart-item__name {
  font-family: 'Onest', sans-serif;
  font-size: 22px;
  font-weight: 500;
  color: #040404;
  text-decoration: none;
}

.cart-item__name:hover {
  text-decoration: underline;
}

.cart-item__price {
  font-family: 'Roboto Mono', monospace;
  font-size: 16px;
  color: rgba(0,0,0,0.7);
}

.cart-item__qty {
  display: flex;
  align-items: center;
  gap: 12px;
}

.cart-item__qty-btn {
  width: 36px;
  height: 36px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: none;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s, background 0.2s;
  color: #040404;
}

.cart-item__qty-btn:hover {
  border-color: #040404;
  background: #f5f5f5;
}

.cart-item__qty-value {
  font-family: 'Onest', sans-serif;
  font-size: 18px;
  font-weight: 500;
  min-width: 24px;
  text-align: center;
}

.cart-item__remove {
  background: none;
  border: none;
  cursor: pointer;
  color: #ccc;
  transition: color 0.2s;
  padding: 4px;
}

.cart-item__remove:hover {
  color: #d32f2f;
}

.cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 0;
  border-top: 1px solid #eee;
  margin-top: 16px;
}

.cart-total {
  display: flex;
  align-items: center;
  gap: 16px;
}

.cart-total__label {
  font-family: 'Onest', sans-serif;
  font-size: 28px;
  font-weight: 500;
  color: #040404;
}

.cart-total__price {
  font-family: 'Onest', sans-serif;
  font-size: 32px;
  font-weight: 500;
  color: #040404;
}

.cart-checkout {
  font-family: 'Roboto Mono', monospace;
  font-size: 18px;
  font-weight: 500;
  text-transform: uppercase;
  color: white;
  background: #040404;
  border: none;
  border-radius: 100px;
  padding: 16px 40px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.cart-checkout:hover {
  opacity: 0.85;
}

@media (max-width: 768px) {
  .cart-title {
    font-size: 40px;
  }
  .cart-item {
    flex-wrap: wrap;
  }
  .cart-item__info {
    min-width: 120px;
  }
  .cart-footer {
    flex-direction: column;
    gap: 20px;
    align-items: stretch;
  }
  .cart-total {
    justify-content: center;
  }
  .cart-page {
    padding: 40px 0;
  }
}

@media (max-width: 480px) {
  .cart-title {
    font-size: 28px;
  }
  .cart-item__name {
    font-size: 18px;
  }
  .cart-total__label {
    font-size: 22px;
  }
  .cart-total__price {
    font-size: 24px;
  }
}
</style>
