<script setup>
import { ref, onMounted } from 'vue'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import { fetchProducts } from '../lib/productData.js'
import { useMeta } from '../lib/useMeta.js'

useMeta('Каталог — Matryon | Умные колонки, лампы, розетки', 'Каталог умных устройств Matryon: колонки, лампы и розетки с голосовым управлением.')

const speakers = ref([])
const lamps = ref([])
const sockets = ref([])
const loading = ref(true)

onMounted(async () => {
  const all = await fetchProducts()
  speakers.value = all.filter(p => p.type === 'speaker')
  lamps.value = all.filter(p => p.type === 'lamp')
  sockets.value = all.filter(p => p.type === 'socket')
  loading.value = false
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

      <div class="catalog-card fade-in">
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
            <div class="product-card__action">
              <span>ПОДРОБНЕЕ</span>
              <svg width="35" height="35" viewBox="0 0 35 35" fill="none">
                <path d="M28.4375 16.6797H18.3203V6.5625C18.3203 6.07934 17.9832 5.6875 17.5 5.6875C17.0168 5.6875 16.6797 6.07934 16.6797 6.5625V16.6797H6.5625C6.07934 16.6797 5.6875 17.0168 5.6875 17.5C5.6875 17.9832 6.07934 18.3203 6.5625 18.3203H16.6797V28.4375C16.6797 28.9207 17.0168 29.3125 17.5 29.3125C17.9832 29.3125 18.3203 28.9207 18.3203 28.4375V18.3203H28.4375C28.9207 18.3203 29.3125 17.9832 29.3125 17.5C29.3125 17.0168 28.9207 16.6797 28.4375 16.6797Z" fill="white"/>
              </svg>
            </div>
          </router-link>
        </div>
      </div>

      <div class="catalog-card fade-in">
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
            <div class="product-card__action">
              <span>ПОДРОБНЕЕ</span>
              <svg width="35" height="35" viewBox="0 0 35 35" fill="none">
                <path d="M28.4375 16.6797H18.3203V6.5625C18.3203 6.07934 17.9832 5.6875 17.5 5.6875C17.0168 5.6875 16.6797 6.07934 16.6797 6.5625V16.6797H6.5625C6.07934 16.6797 5.6875 17.0168 5.6875 17.5C5.6875 17.9832 6.07934 18.3203 6.5625 18.3203H16.6797V28.4375C16.6797 28.9207 17.0168 29.3125 17.5 29.3125C17.9832 29.3125 18.3203 28.9207 18.3203 28.4375V18.3203H28.4375C28.9207 18.3203 29.3125 17.9832 29.3125 17.5C29.3125 17.0168 28.9207 16.6797 28.4375 16.6797Z" fill="white"/>
              </svg>
            </div>
          </router-link>
        </div>
      </div>

      <div class="catalog-card fade-in">
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
            <div class="product-card__action">
              <span>ПОДРОБНЕЕ</span>
              <svg width="35" height="35" viewBox="0 0 35 35" fill="none">
                <path d="M28.4375 16.6797H18.3203V6.5625C18.3203 6.07934 17.9832 5.6875 17.5 5.6875C17.0168 5.6875 16.6797 6.07934 16.6797 6.5625V16.6797H6.5625C6.07934 16.6797 5.6875 17.0168 5.6875 17.5C5.6875 17.9832 6.07934 18.3203 6.5625 18.3203H16.6797V28.4375C16.6797 28.9207 17.0168 29.3125 17.5 29.3125C17.9832 29.3125 18.3203 28.9207 18.3203 28.4375V18.3203H28.4375C28.9207 18.3203 29.3125 17.9832 29.3125 17.5C29.3125 17.0168 28.9207 16.6797 28.4375 16.6797Z" fill="white"/>
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
.catalog-page {
  background: #fff;
  overflow: hidden;
}

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
  background: #E7E7E7;
  border-radius: 30px;
  padding: 74px 80px 60px;
  margin-bottom: 118px;
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
  transition: transform 0.3s ease;
}

.product-card:hover {
  transform: translateY(-6px);
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
  height: 80px;
  padding: 12px 16px;
  background: black;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  transition: opacity 0.3s ease;
}

.product-card:hover .product-card__action {
  opacity: 0.85;
}

.product-card__action span {
  font-family: 'Roboto Mono', monospace;
  font-size: 16px;
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
  .product-card__action {
    height: 60px;
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
  .product-card__action {
    height: 52px;
    padding: 8px 12px;
  }
  .product-card__action span {
    font-size: 13px;
  }
  .product-card__action svg {
    width: 28px;
    height: 28px;
  }
}
</style>
