<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  name: String,
  description: String,
  image: String,
  productId: String
})

const router = useRouter()

function handleDetails(e) {
  e.stopPropagation()
  if (!props.productId) return
  router.push('/product/' + props.productId)
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
    <div class="product-card__action" @click="handleDetails">
      <span>ПОДРОБНЕЕ</span>
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
  width: 200px;
  height: 0;
  padding: 0 10px;
  background: black;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: height 0.3s ease, padding 0.3s ease, opacity 0.3s ease;
  opacity: 0;
  overflow: hidden;
  cursor: pointer;
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
    width: 170px;
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
    width: 150px;
  }
  .product-card:hover .product-card__action {
    height: 44px;
    padding: 0 12px;
  }
  .product-card__action span {
    font-size: 12px;
  }
  .product-card {
    gap: 14px;
  }
}
</style>
