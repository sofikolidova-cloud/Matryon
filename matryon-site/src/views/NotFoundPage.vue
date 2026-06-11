<script setup>
import { useMeta } from '../lib/useMeta.js'
import { useRouter } from 'vue-router'

const router = useRouter()

useMeta('404 — Страница не найдена | Matryon', 'Страница не найдена. Вернитесь на главную Matryon.')
</script>

<template>
  <main class="not-found">
    <div class="container">
      <div class="not-found__card">
        <h1 class="not-found__title">404</h1>
        <p class="not-found__text">Страница не найдена</p>
        <button class="not-found__btn" @click="router.push('/')">НА ГЛАВНУЮ</button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
}
.not-found__card {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}
.not-found__title {
  font-family: 'Onest', sans-serif;
  font-size: 160px;
  font-weight: 500;
  color: #040404;
  line-height: 1;
}
.not-found__text {
  font-family: 'Roboto Mono', monospace;
  font-size: 24px;
  color: rgba(0,0,0,0.6);
}
.not-found__btn {
  font-family: 'Roboto Mono', monospace;
  font-size: 16px;
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
.not-found__btn:hover { opacity: 0.8; }
@media (max-width: 768px) {
  .not-found__title { font-size: 80px; }
  .not-found__text { font-size: 18px; }
}
</style>
