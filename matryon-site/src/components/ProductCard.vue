<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '../lib/auth.js'
import { useCart } from '../lib/cart.js'
import { useNotification } from '../lib/notification.js'

const props = defineProps({
  name: String,
  description: String,
  image: String,
  productId: String
})

const router = useRouter()
const route = useRoute()
const { user } = useAuth()
const { addItem } = useCart()
const { show } = useNotification()
const adding = ref(false)

async function handleBuy(e) {
  e.stopPropagation()
  e.preventDefault()
  if (!user.value) {
    router.push('/login?redirect=' + encodeURIComponent(route.fullPath))
    return
  }
  if (!props.productId || adding.value) return
  adding.value = true
  try {
    await addItem(props.productId)
  } catch (e) {
    console.error('Cart add error:', e)
  }
  adding.value = false
  show('Товар добавлен в корзину')
  setTimeout(() => {
    router.push('/cart')
  }, 800)
}
</script>

<template>
  <div class="product-card">
    <div class="product-card__image">
      <img :src="image" :alt="name" />
    </div>
    <div class="product-card__info">
      <h3 class="product-card__name">{{ name }}</h3>
      <p class="product-card__desc">{{ description }}</p>
    </div>
    <div class="product-card__action" @click="handleBuy">
      <span>КУПИТЬ</span>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0020 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" fill="white"/>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.product-card__image {
  width: 200px;
  height: 320px;
  background: #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
}

.product-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-card__info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.product-card__name {
  font-size: 48px;
  font-family: 'Onest', sans-serif;
  font-weight: 500;
  color: black;
}

.product-card__desc {
  font-family: 'Roboto Mono', monospace;
  font-size: 16px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.7);
}

.product-card__action {
  width: 220px;
  height: 0;
  padding: 0 10px;
  background: black;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: height 0.3s ease, padding 0.3s ease, opacity 0.3s ease;
  opacity: 0;
  overflow: hidden;
}

.product-card:hover .product-card__action {
  height: 52px;
  padding: 0 16px;
  opacity: 1;
}

.product-card__action span {
  font-family: 'Roboto Mono', monospace;
  font-size: 14px;
  font-weight: 400;
  color: white;
}

@media (max-width: 768px) {
  .product-card__name {
    font-size: 32px;
  }
  .product-card__image {
    width: 160px;
    height: 260px;
  }
  .product-card__action {
    width: 180px;
  }
  .product-card {
    gap: 18px;
  }
}

@media (max-width: 480px) {
  .product-card__image {
    width: 130px;
    height: 210px;
  }
  .product-card__name {
    font-size: 24px;
  }
  .product-card__desc {
    font-size: 13px;
  }
  .product-card__action {
    width: 160px;
  }
  .product-card:hover .product-card__action {
    height: 44px;
    padding: 0 12px;
  }
  .product-card__action span {
    font-size: 12px;
  }
  .product-card__action svg {
    width: 22px;
    height: 22px;
  }
  .product-card {
    gap: 14px;
  }
}
</style>
