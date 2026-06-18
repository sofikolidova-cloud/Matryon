<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import { fetchProductById, fetchProductsByType } from '../lib/productData.js'
import { useAuth } from '../lib/auth.js'
import { useCart } from '../lib/cart.js'
import { useNotification } from '../lib/notification.js'

const route = useRoute()
const router = useRouter()
const { user } = useAuth()
const { addItem } = useCart()
const { show } = useNotification()
const adding = ref(false)

const product = ref(null)
const relatedProducts = ref([])

const activeModel = ref('')
const selectedDisplay = ref('')
const selectedMemory = ref('')
const selectedSpeaker = ref('')

const displayOptions = ['1.7"', '2.1"', '2.8"']
const memoryOptions = ['4 ГБ', '8 ГБ', '16 ГБ', '32 ГБ']
const speakerOptions = ['60 Вт', '65 Вт']

function switchModel(id) {
  router.push({ params: { id } })
}

async function loadProduct(id) {
  product.value = await fetchProductById(id)
  if (product.value) {
    document.title = `${product.value.name} — Купить | Matryon`
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.name = 'description'
      document.head.appendChild(metaDesc)
    }
    metaDesc.content = `${product.value.name} — ${product.value.desc}. Цена: ${product.value.price} ₽. Закажите на Matryon.`
    relatedProducts.value = await fetchProductsByType(product.value.type)
    activeModel.value = product.value.id
    selectedDisplay.value = product.value.specs?.display || ''
    selectedMemory.value = product.value.specs?.memory || ''
    selectedSpeaker.value = product.value.specs?.speaker || ''
  }
}

watch(() => route.params.id, (id) => {
  if (id) loadProduct(id)
})

onMounted(() => {
  loadProduct(route.params.id)
})

const isSpeaker = computed(() => product.value?.type === 'speaker')
const isLamp = computed(() => product.value?.type === 'lamp')
const isSocket = computed(() => product.value?.type === 'socket')

const displayPrice = computed(() => {
  if (!product.value) return ''
  const base = parseInt(product.value.price.replace(/\s/g, ''))
  let extra = 0
  if (selectedDisplay.value === '2.1"') extra += 2000
  if (selectedDisplay.value === '2.8"') extra += 5000
  if (selectedMemory.value === '8 ГБ') extra += 3000
  if (selectedMemory.value === '16 ГБ') extra += 7000
  if (selectedMemory.value === '32 ГБ') extra += 12000
  if (selectedSpeaker.value === '65 Вт') extra += 4000
  return (base + extra).toLocaleString('ru-RU')
})

async function handleBuy() {
  if (!user.value) {
    router.push('/login?redirect=' + encodeURIComponent(route.fullPath))
    return
  }
  if (!product.value?.id || adding.value) return
  adding.value = true
  try {
    await addItem(product.value.id)
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
  <AppHeader />
  <main v-if="product" class="product-page">
    <!-- Speaker Layout -->
    <section v-if="isSpeaker" class="container product-layout fade-in">
      <div class="product-image">
        <img :src="product.image" :alt="product.name" />
      </div>
      <div class="product-details">
        <div class="details-card">
          <h1 class="product-title">{{ product.name.toUpperCase() }}</h1>

          <div class="model-tabs">
            <button
              v-for="item in relatedProducts"
              :key="item.id"
              :class="['model-tab', { active: activeModel === item.id }]"
              @click="switchModel(item.id)"
            >
              {{ item.name.replace('Matryon ', '').replace('Lampochka ', '').replace('Rozetka ', '').toUpperCase() }}
            </button>
          </div>

          <div class="specs-section">
            <div class="spec-group">
              <span class="spec-label">ДИСПЛЕЙ</span>
              <div class="spec-options">
                <button
                  v-for="opt in displayOptions"
                  :key="opt"
                  :class="['spec-btn', { active: selectedDisplay === opt }]"
                  @click="selectedDisplay = opt"
                >{{ opt }}</button>
              </div>
            </div>

            <div class="spec-group">
              <span class="spec-label">ПАМЯТЬ</span>
              <div class="spec-options">
                <button
                  v-for="opt in memoryOptions"
                  :key="opt"
                  :class="['spec-btn', { active: selectedMemory === opt }]"
                  @click="selectedMemory = opt"
                >{{ opt }}</button>
              </div>
            </div>

            <div class="spec-group">
              <span class="spec-label">SPEAKER</span>
              <div class="spec-options">
                <button
                  v-for="opt in speakerOptions"
                  :key="opt"
                  :class="['spec-btn', { active: selectedSpeaker === opt }]"
                  @click="selectedSpeaker = opt"
                >{{ opt }}</button>
              </div>
            </div>
          </div>

          <div class="price-section">
            <span class="price">{{ displayPrice }} РУБЛЕЙ</span>
            <button class="buy-btn" @click="handleBuy">КУПИТЬ</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Lamp Layout -->
    <section v-else-if="isLamp" class="container lamp-layout fade-in">
      <div class="lamp-selector">
        <h2 class="selector-heading">//ВЫБЕРИТЕ МОДЕЛЬ MATRYON</h2>
        <div class="lamp-model-tabs">
          <button
            v-for="item in relatedProducts"
            :key="item.id"
            :class="['lamp-model-tab', { active: activeModel === item.id }]"
            @click="switchModel(item.id)"
          >
            {{ item.name.replace('Matryon ', '').replace('Lampochka ', '').replace('Rozetka ', '').toUpperCase() }}
          </button>
        </div>
      </div>

      <div class="lamp-image">
        <img :src="product.image" :alt="product.name" />
      </div>

      <div class="lamp-details">
        <div class="lamp-details-card">
          <h1 class="lamp-title">{{ product.name }}</h1>
          <span class="lamp-serial">СЕРИЙНЫЙ НОМЕР: {{ product.serial }}</span>
          <div class="lamp-desc-card">
            <p class="lamp-desc">{{ product.desc }}</p>
          </div>
          <div class="lamp-price-section">
            <span class="lamp-price">{{ product.price }} РУБЛЕЙ</span>
            <button class="lamp-buy-btn" @click="handleBuy">КУПИТЬ</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Socket Layout -->
    <section v-else-if="isSocket" class="container socket-layout fade-in">
      <div class="socket-selector">
        <h2 class="selector-heading">//ВЫБЕРИТЕ МОДЕЛЬ MATRYON</h2>
        <div class="socket-model-tabs">
          <button
            v-for="item in relatedProducts"
            :key="item.id"
            :class="['socket-model-tab', { active: activeModel === item.id }]"
            @click="switchModel(item.id)"
          >
            {{ item.name.replace('Matryon ', '').replace('Lampochka ', '').replace('Rozetka ', '').toUpperCase() }}
          </button>
        </div>
      </div>

      <div class="socket-image">
        <img :src="product.image" :alt="product.name" />
      </div>

      <div class="socket-details">
        <div class="socket-details-card">
          <h1 class="socket-title">{{ product.name }}</h1>
          <span class="socket-serial">СЕРИЙНЫЙ НОМЕР: {{ product.serial }}</span>
          <div class="socket-desc-card">
            <p class="socket-desc">{{ product.desc }}</p>
          </div>
          <div class="socket-price-bar">
            <span class="socket-price">{{ product.price }} РУБЛЕЙ</span>
            <span class="socket-buy-text" @click="handleBuy">КУПИТЬ</span>
          </div>
        </div>
      </div>
    </section>
  </main>
  <main v-else class="product-page">
    <section class="container not-found fade-in">
      <h2>Товар не найден</h2>
      <router-link to="/catalog" class="back-link">Вернуться в каталог</router-link>
    </section>
  </main>
  <AppFooter />
</template>

<style scoped>
.product-page {
  background: #fff;
  min-height: 60vh;
}

.product-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  padding-top: 60px;
  padding-bottom: 80px;
}

.product-image {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 500px;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.product-details {
  display: flex;
  flex-direction: column;
}

.details-card {
  background: #E7E7E7;
  border-radius: 30px;
  padding: 60px 50px;
  display: flex;
  flex-direction: column;
  gap: 36px;
}

.product-title {
  font-family: 'Onest', sans-serif;
  font-size: 64px;
  font-weight: 500;
  color: black;
  line-height: 1.1;
}

.model-tabs {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.model-tab {
  padding: 12px 28px;
  border-radius: 40px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  background: transparent;
  font-family: 'Roboto Mono', monospace;
  font-size: 16px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.6);
  cursor: pointer;
  transition: all 0.2s ease;
}

.model-tab:hover {
  border-color: black;
  color: black;
}

.model-tab.active {
  background: black;
  color: white;
  border-color: black;
}

.specs-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.product-desc {
  font-family: 'Roboto Mono', monospace;
  font-size: 16px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.7);
  line-height: 1.5;
}

.spec-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.spec-label {
  font-family: 'Roboto Mono', monospace;
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.5);
  letter-spacing: 1px;
}

.spec-options {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.spec-btn {
  padding: 10px 24px;
  border-radius: 40px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  background: white;
  font-family: 'Roboto Mono', monospace;
  font-size: 15px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.6);
  cursor: pointer;
  transition: all 0.2s ease;
}

.spec-btn:hover {
  border-color: black;
  color: black;
}

.spec-btn.active {
  background: black;
  color: white;
  border-color: black;
}

.price-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 8px;
}

.price {
  font-family: 'Onest', sans-serif;
  font-size: 48px;
  font-weight: 500;
  color: black;
}

.buy-btn {
  width: 100%;
  padding: 20px;
  background: black;
  color: white;
  font-family: 'Onest', sans-serif;
  font-size: 24px;
  font-weight: 500;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.buy-btn:hover {
  opacity: 0.85;
}

.lamp-layout {
  display: grid;
  grid-template-columns: 280px 1fr 380px;
  gap: 40px;
  padding-top: 60px;
  padding-bottom: 80px;
  align-items: start;
}

.lamp-selector {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.selector-heading {
  font-family: 'Roboto Mono', monospace;
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.4);
  letter-spacing: 1px;
  line-height: 1.4;
}

.lamp-model-tabs {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.lamp-model-tab {
  padding: 14px 24px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  background: transparent;
  font-family: 'Roboto Mono', monospace;
  font-size: 15px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.5);
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
}

.lamp-model-tab:hover {
  border-color: black;
  color: black;
}

.lamp-model-tab.active {
  background: black;
  color: white;
  border-color: black;
}

.lamp-image {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 450px;
}

.lamp-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.lamp-details {
  display: flex;
  flex-direction: column;
}

.lamp-details-card {
  background: #E7E7E7;
  border-radius: 30px;
  padding: 40px 36px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.lamp-title {
  font-family: 'Onest', sans-serif;
  font-size: 36px;
  font-weight: 500;
  color: black;
  line-height: 1.1;
}

.lamp-serial {
  font-family: 'Roboto Mono', monospace;
  font-size: 12px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.4);
  letter-spacing: 0.5px;
}

.lamp-desc-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
}

.lamp-desc {
  font-family: 'Roboto Mono', monospace;
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.7);
  line-height: 1.5;
  margin: 0;
}

.lamp-price-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 4px;
}

.lamp-price {
  font-family: 'Onest', sans-serif;
  font-size: 36px;
  font-weight: 500;
  color: black;
}

.lamp-buy-btn {
  width: 100%;
  padding: 18px;
  background: black;
  color: white;
  font-family: 'Onest', sans-serif;
  font-size: 22px;
  font-weight: 500;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.lamp-buy-btn:hover {
  opacity: 0.85;
}

.socket-layout {
  display: grid;
  grid-template-columns: 280px 1fr 380px;
  gap: 40px;
  padding-top: 60px;
  padding-bottom: 80px;
  align-items: start;
}

.socket-selector {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.socket-model-tabs {
  display: flex;
  flex-direction: row;
  gap: 8px;
  flex-wrap: wrap;
}

.socket-model-tab {
  padding: 14px 24px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  background: transparent;
  font-family: 'Roboto Mono', monospace;
  font-size: 15px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  transition: all 0.2s ease;
}

.socket-model-tab:hover {
  border-color: black;
  color: black;
}

.socket-model-tab.active {
  background: black;
  color: white;
  border-color: black;
}

.socket-image {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 450px;
}

.socket-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.socket-details {
  display: flex;
  flex-direction: column;
}

.socket-details-card {
  background: #E7E7E7;
  border-radius: 30px;
  padding: 40px 36px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.socket-title {
  font-family: 'Onest', sans-serif;
  font-size: 36px;
  font-weight: 500;
  color: black;
  line-height: 1.1;
}

.socket-serial {
  font-family: 'Roboto Mono', monospace;
  font-size: 12px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.4);
  letter-spacing: 0.5px;
}

.socket-desc-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
}

.socket-desc {
  font-family: 'Roboto Mono', monospace;
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.7);
  line-height: 1.5;
  margin: 0;
}

.socket-price-bar {
  background: black;
  border-radius: 14px;
  padding: 18px 24px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
}

.socket-price {
  font-family: 'Onest', sans-serif;
  font-size: 22px;
  font-weight: 500;
  color: white;
}

.socket-buy-text {
  font-family: 'Onest', sans-serif;
  font-size: 22px;
  font-weight: 500;
  color: white;
  cursor: pointer;
}

.socket-buy-text:hover {
  opacity: 0.85;
}

.not-found {
  text-align: center;
  padding-top: 120px;
  padding-bottom: 120px;
}

.not-found h2 {
  font-family: 'Onest', sans-serif;
  font-size: 48px;
  margin-bottom: 24px;
}

.back-link {
  font-family: 'Roboto Mono', monospace;
  font-size: 18px;
  color: black;
  text-decoration: underline;
}

@media (max-width: 1200px) {
  .lamp-layout {
    grid-template-columns: 240px 1fr 320px;
    gap: 30px;
  }
  .socket-layout {
    grid-template-columns: 240px 1fr 320px;
    gap: 30px;
  }
}

@media (max-width: 1024px) {
  .product-layout {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .product-title {
    font-size: 48px;
  }
  .details-card {
    padding: 40px 30px;
  }
  .lamp-layout {
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }
  .lamp-selector {
    grid-column: 1 / -1;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
  }
  .selector-heading {
    flex-shrink: 0;
  }
  .lamp-model-tabs {
    flex-direction: row;
    flex-wrap: wrap;
  }
  .lamp-title {
    font-size: 30px;
  }
  .socket-layout {
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }
  .socket-selector {
    grid-column: 1 / -1;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
  }
  .socket-model-tabs {
    flex-direction: row;
    flex-wrap: wrap;
  }
  .socket-title {
    font-size: 30px;
  }
}

@media (max-width: 768px) {
  .product-layout {
    padding-top: 30px;
    padding-bottom: 40px;
    gap: 30px;
  }
  .product-title {
    font-size: 36px;
  }
  .product-image {
    height: 350px;
  }
  .details-card {
    padding: 30px 20px;
    gap: 24px;
  }
  .price {
    font-size: 36px;
  }
  .lamp-layout {
    grid-template-columns: 1fr;
    gap: 24px;
    padding-top: 30px;
    padding-bottom: 40px;
  }
  .lamp-selector {
    flex-direction: column;
    align-items: flex-start;
  }
  .lamp-image {
    height: 320px;
  }
  .lamp-details-card {
    padding: 30px 24px;
  }
  .lamp-title {
    font-size: 28px;
  }
  .lamp-price {
    font-size: 30px;
  }
  .socket-layout {
    grid-template-columns: 1fr;
    gap: 24px;
    padding-top: 30px;
    padding-bottom: 40px;
  }
  .socket-selector {
    flex-direction: column;
    align-items: flex-start;
  }
  .socket-image {
    height: 320px;
  }
  .socket-details-card {
    padding: 30px 24px;
  }
  .socket-title {
    font-size: 28px;
  }
  .socket-price {
    font-size: 18px;
  }
  .socket-buy-text {
    font-size: 18px;
  }
  .model-tab {
    padding: 10px 20px;
    font-size: 14px;
  }
  .spec-btn {
    padding: 8px 18px;
    font-size: 13px;
  }
  .buy-btn {
    padding: 16px;
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .product-layout {
    padding-top: 20px;
    padding-bottom: 30px;
    gap: 20px;
  }
  .product-title {
    font-size: 28px;
  }
  .product-image {
    height: 280px;
  }
  .details-card {
    padding: 20px 16px;
    gap: 20px;
    border-radius: 20px;
  }
  .price {
    font-size: 28px;
  }
  .buy-btn {
    padding: 14px;
    font-size: 18px;
  }
  .lamp-layout {
    padding-top: 20px;
    padding-bottom: 30px;
    gap: 16px;
  }
  .lamp-image {
    height: 260px;
  }
  .lamp-details-card {
    padding: 20px 16px;
    border-radius: 20px;
  }
  .lamp-title {
    font-size: 24px;
  }
  .lamp-price {
    font-size: 24px;
  }
  .lamp-buy-btn {
    padding: 14px;
    font-size: 18px;
  }
  .socket-layout {
    padding-top: 20px;
    padding-bottom: 30px;
    gap: 16px;
  }
  .socket-image {
    height: 260px;
  }
  .socket-details-card {
    padding: 20px 16px;
    border-radius: 20px;
  }
  .socket-title {
    font-size: 24px;
  }
  .socket-price {
    font-size: 16px;
  }
  .socket-buy-text {
    font-size: 16px;
  }
  .socket-price-bar {
    padding: 14px 18px;
  }
  .model-tab {
    padding: 8px 16px;
    font-size: 13px;
  }
  .model-tabs {
    gap: 8px;
  }
  .spec-btn {
    padding: 6px 14px;
    font-size: 12px;
  }
  .spec-options {
    gap: 6px;
  }
  .selector-heading {
    font-size: 12px;
  }
}
</style>
