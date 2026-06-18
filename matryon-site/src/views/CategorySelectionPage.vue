<script setup>
import { useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'

const router = useRouter()

function goToCategory(type) {
  router.push({ path: '/catalog', query: { type } })
}
</script>

<template>
  <AppHeader />
  <main class="category-page">
    <section class="container">
      <h1 class="category-title">ВЫБЕРИТЕ КАТЕГОРИЮ</h1>
      <div class="category-grid">
        <button class="category-card" @click="goToCategory('speaker')">
          <div class="category-card__icon">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <rect x="8" y="4" width="48" height="56" rx="8" stroke="currentColor" stroke-width="2" fill="none"/>
              <circle cx="32" cy="36" r="12" stroke="currentColor" stroke-width="2" fill="none"/>
              <circle cx="32" cy="36" r="4" fill="currentColor"/>
              <line x1="32" y1="20" x2="32" y2="24" stroke="currentColor" stroke-width="2"/>
              <line x1="32" y1="48" x2="32" y2="52" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <h2 class="category-card__title">Матрешки</h2>
          <p class="category-card__desc">Умные колонки для дома, учебы и работы</p>
        </button>
        <button class="category-card" @click="goToCategory('lamp')">
          <div class="category-card__icon">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <path d="M32 4 L40 28 L24 28 Z" stroke="currentColor" stroke-width="2" fill="none"/>
              <rect x="28" y="28" width="8" height="8" fill="currentColor"/>
              <rect x="26" y="36" width="12" height="16" rx="2" stroke="currentColor" stroke-width="2" fill="none"/>
              <line x1="32" y1="52" x2="32" y2="60" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <h2 class="category-card__title">Лампочки</h2>
          <p class="category-card__desc">Умные лампы с голосовым управлением</p>
        </button>
        <button class="category-card" @click="goToCategory('socket')">
          <div class="category-card__icon">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <rect x="12" y="8" width="40" height="48" rx="6" stroke="currentColor" stroke-width="2" fill="none"/>
              <circle cx="32" cy="26" r="4" fill="currentColor"/>
              <rect x="28" y="34" width="8" height="12" rx="2" fill="currentColor"/>
              <line x1="12" y1="16" x2="4" y2="16" stroke="currentColor" stroke-width="2"/>
              <line x1="12" y1="24" x2="4" y2="24" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <h2 class="category-card__title">Розетки</h2>
          <p class="category-card__desc">Умные розетки с дистанционным управлением</p>
        </button>
      </div>
    </section>
  </main>
  <AppFooter />
</template>

<style scoped>
.category-page {
  min-height: 70vh;
  padding: 80px 0;
}

.category-title {
  font-family: 'Onest', sans-serif;
  font-size: 64px;
  font-weight: 500;
  color: #040404;
  text-align: center;
  margin-bottom: 60px;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  max-width: 1100px;
  margin: 0 auto;
}

.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 48px 32px;
  background: #ffffff;
  border: 2px solid #eee;
  border-radius: 20px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  color: #040404;
}

.category-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.08);
  border-color: #040404;
}

.category-card__icon {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #040404;
}

.category-card__title {
  font-family: 'Onest', sans-serif;
  font-size: 36px;
  font-weight: 500;
  color: #040404;
}

.category-card__desc {
  font-family: 'Roboto Mono', monospace;
  font-size: 16px;
  font-weight: 400;
  color: rgba(0,0,0,0.7);
  text-align: center;
}

@media (max-width: 768px) {
  .category-title {
    font-size: 40px;
    margin-bottom: 40px;
  }
  .category-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .category-card {
    padding: 32px 24px;
  }
  .category-card__title {
    font-size: 28px;
  }
}

@media (max-width: 480px) {
  .category-title {
    font-size: 28px;
    margin-bottom: 30px;
  }
  .category-page {
    padding: 40px 0;
  }
}
</style>
