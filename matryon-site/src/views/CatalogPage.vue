<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import { fetchProducts } from '../lib/productData.js'
import { useMeta } from '../lib/useMeta.js'
import { useAuth } from '../lib/auth.js'
import { useCart } from '../lib/cart.js'
import { useNotification } from '../lib/notification.js'

useMeta('Каталог — Matryon | Умные колонки, лампы, розетки', 'Каталог умных устройств Matryon: колонки, лампы и розетки с голосовым управлением.')

const route = useRoute()
const router = useRouter()
const { user } = useAuth()
const { addItem } = useCart()
const { show } = useNotification()
const speakers = ref([])
const lamps = ref([])
const sockets = ref([])
const loading = ref(true)

async function addToCart(productId) {
  if (!user.value) {
    router.push('/login?redirect=' + encodeURIComponent(route.fullPath))
    return
  }
  if (productId) {
    try {
      await addItem(productId)
    } catch (e) {
      console.error('Cart add error:', e)
    }
    show('Товар добавлен в корзину')
  }
}

onMounted(async () => {
  const all = await fetchProducts()
  speakers.value = all.filter(p => p.type === 'speaker')
  lamps.value = all.filter(p => p.type === 'lamp')
  sockets.value = all.filter(p => p.type === 'socket')
  loading.value = false
  await nextTick()
  const type = route.query.type
  if (type === 'speaker') {
    document.getElementById('section-speaker')?.scrollIntoView({ behavior: 'smooth' })
  } else if (type === 'lamp') {
    document.getElementById('section-lamp')?.scrollIntoView({ behavior: 'smooth' })
  } else if (type === 'socket') {
    document.getElementById('section-socket')?.scrollIntoView({ behavior: 'smooth' })
  }
})
</script>

<template>
  <AppHeader />
  <main class="catalog-page">
    <section v-if="loading" class="container catalog-loading">
      <div class="catalog-loading__spinner"></div>
    </section>
    <section v-else class="container catalog-hero fade-in">
      <h1 class="catalog-title">КАТАЛОГ</h1>

      <div id="section-speaker" class="catalog-card fade-in">
        <div class="section-label">//КОЛОНКИ</div>
        <div class="catalog-grid">
          <router-link v-for="(item, index) in speakers" :key="'sp'+index" :to="'/product/' + item.id" class="product-card">
            <div class="product-card__image">
              <img :src="item.image" :alt="item.name" />
            </div>
            <div class="product-card__info">
              <h3 class="product-card__name">{{ item.name }}</h3>
              <p class="product-card__desc">{{ item.desc }}</p>
            </div>
            <div class="product-card__action" @click.stop="addToCart(item.id)">
              <span>ДОБАВИТЬ В КОРЗИНУ</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0020 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" fill="white"/>
              </svg>
            </div>
          </router-link>
        </div>
      </div>

      <div id="section-lamp" class="catalog-card fade-in">
        <div class="section-label">//ЛАМПОЧКИ</div>
        <div class="catalog-grid">
          <router-link v-for="(item, index) in lamps" :key="'lamp'+index" :to="'/product/' + item.id" class="product-card">
            <div class="product-card__image">
              <img :src="item.image" :alt="item.name" />
            </div>
            <div class="product-card__info">
              <h3 class="product-card__name">{{ item.name }}</h3>
              <p class="product-card__desc">{{ item.desc }}</p>
            </div>
            <div class="product-card__action" @click.stop="addToCart(item.id)">
              <span>ДОБАВИТЬ В КОРЗИНУ</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0020 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" fill="white"/>
              </svg>
            </div>
          </router-link>
        </div>
      </div>

      <div id="section-socket" class="catalog-card fade-in">
        <div class="section-label">//РОЗЕТКИ</div>
        <div class="catalog-grid catalog-grid--3">
          <router-link v-for="(item, index) in sockets" :key="'socket'+index" :to="'/product/' + item.id" class="product-card">
            <div class="product-card__image">
              <img :src="item.image" :alt="item.name" />
            </div>
            <div class="product-card__info">
              <h3 class="product-card__name">{{ item.name }}</h3>
              <p class="product-card__desc">{{ item.desc }}</p>
            </div>
            <div class="product-card__action" @click.stop="addToCart(item.id)">
              <span>ДОБАВИТЬ В КОРЗИНУ</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0020 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" fill="white"/>
              </svg>
            </div>
          </router-link>
        </div>
      </div>
    </section>
  </main>
  <AppFooter />
</template>

<style scoped>
.catalog-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.catalog-loading__spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #E7E7E7;
  border-top-color: #040404;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.catalog-hero {
  padding-top: 43px;
  padding-bottom: 0;
}

.catalog-title {
  font-family: 'Onest', sans-serif;
  font-size: 128px;
  font-weight: 400;
  color: #7B7B85;
  line-height: 1;
  margin-bottom: 31px;
}

.catalog-card {
  background: #ffffff;
  border-radius: 30px;
  padding: 74px 80px 60px;
  margin-bottom: 118px;
  border: 1px solid #eee;
}

.section-label {
  font-family: 'Onest', sans-serif;
  font-size: 48px;
  font-weight: 400;
  color: #7B7B85;
  line-height: 1;
  margin-bottom: 60px;
}

.catalog-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
}

.catalog-grid--3 {
  grid-template-columns: repeat(3, 1fr);
}

.product-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  text-decoration: none;
  color: inherit;
}

.product-card__image {
  width: 100%;
  aspect-ratio: 1 / 1.6;
  background: #f0f0f0;
  border-radius: 12px;
  overflow: hidden;
}

.product-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-card__name {
  font-size: 28px;
  font-family: 'Onest', sans-serif;
  font-weight: 500;
  color: black;
  text-align: center;
}

.product-card__desc {
  font-family: 'Roboto Mono', monospace;
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.7);
  text-align: center;
  line-height: 1.4;
}

.product-card__info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.product-card__action {
  width: 100%;
  height: 0;
  padding: 0 16px;
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

@media (max-width: 1200px) {
  .catalog-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .catalog-grid--3 {
    grid-template-columns: repeat(2, 1fr);
  }
  .catalog-title {
    font-size: 72px;
  }
  .catalog-card {
    padding: 40px 40px 40px;
    margin-bottom: 60px;
  }
}

@media (max-width: 768px) {
  .catalog-title {
    font-size: 48px;
  }
  .catalog-card {
    padding: 30px 20px;
    margin-bottom: 40px;
  }
  .section-label {
    font-size: 32px;
  }
  .catalog-grid {
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
  .product-card__name {
    font-size: 20px;
  }
  .product-card__desc {
    font-size: 12px;
  }
  .catalog-hero {
    padding-top: 24px;
  }
}

@media (max-width: 480px) {
  .catalog-title {
    font-size: 32px;
    margin-bottom: 20px;
  }
  .catalog-card {
    padding: 20px 16px;
    margin-bottom: 30px;
    border-radius: 20px;
  }
  .section-label {
    font-size: 24px;
    margin-bottom: 30px;
  }
  .catalog-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .catalog-grid--3 {
    grid-template-columns: 1fr;
  }
  .product-card__name {
    font-size: 18px;
  }
  .product-card__desc {
    font-size: 11px;
  }
  .product-card__action span {
    font-size: 12px;
  }
  .product-card__action svg {
    width: 22px;
    height: 22px;
  }
}
</style>
