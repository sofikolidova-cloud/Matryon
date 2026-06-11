<script setup>
defineProps({
  name: String,
  description: String,
  image: String
})
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
    <div class="product-card__action">
      <span>ПОДРОБНЕЕ</span>
      <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M28.4375 16.6797H18.3203V6.5625C18.3203 6.07934 17.9832 5.6875 17.5 5.6875C17.0168 5.6875 16.6797 6.07934 16.6797 6.5625V16.6797H6.5625C6.07934 16.6797 5.6875 17.0168 5.6875 17.5C5.6875 17.9832 6.07934 18.3203 6.5625 18.3203H16.6797V28.4375C16.6797 28.9207 17.0168 29.3125 17.5 29.3125C17.9832 29.3125 18.3203 28.9207 18.3203 28.4375V18.3203H28.4375C28.9207 18.3203 29.3125 17.9832 29.3125 17.5C29.3125 17.0168 28.9207 16.6797 28.4375 16.6797Z" fill="white"/>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 44px;
}

.product-card__image {
  width: 238px;
  height: 397px;
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
  gap: 14px;
  width: 100%;
}

.product-card__name {
  font-size: 64px;
  font-family: 'Onest', sans-serif;
  font-weight: 500;
  color: black;
}

.product-card__desc {
  font-family: 'Roboto Mono', monospace;
  font-size: 20px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.7);
}

.product-card {
  transition: transform 0.3s ease;
}

.product-card:hover {
  transform: translateY(-6px);
}

.product-card__action {
  width: 280px;
  height: 120px;
  padding: 16px 10px;
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
  font-size: 20px;
  font-weight: 400;
  color: white;
}

@media (max-width: 768px) {
  .product-card__name {
    font-size: 36px;
  }
  .product-card__image {
    width: 180px;
    height: 300px;
  }
  .product-card__action {
    width: 220px;
    height: 90px;
  }
  .product-card {
    gap: 24px;
  }
}

@media (max-width: 480px) {
  .product-card__image {
    width: 140px;
    height: 233px;
  }
  .product-card__name {
    font-size: 28px;
  }
  .product-card__desc {
    font-size: 14px;
  }
  .product-card__action {
    width: 180px;
    height: 70px;
    padding: 10px;
  }
  .product-card__action span {
    font-size: 14px;
  }
  .product-card__action svg {
    width: 28px;
    height: 28px;
  }
  .product-card {
    gap: 16px;
  }
}
</style>
