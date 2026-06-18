<script setup>
import { ref } from 'vue'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'

const paymentMethod = ref('card')
const submitted = ref(false)
const cardNumber = ref('')
const cardExpiry = ref('')

function formatCardNumber(value) {
  const digits = value.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ')
}

function formatCardExpiry(value) {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  if (digits.length > 2) return digits.slice(0, 2) + ' / ' + digits.slice(2)
  return digits
}

function onCardInput(e) {
  cardNumber.value = formatCardNumber(e.target.value)
}

function onExpiryInput(e) {
  cardExpiry.value = formatCardExpiry(e.target.value)
}

function submitOrder() {
  submitted.value = true
}
</script>

<template>
  <AppHeader />
  <main class="order-page">
    <section class="container">
      <h1 class="order-title">ОФОРМЛЕНИЕ ЗАКАЗА</h1>

      <div v-if="!submitted" class="order-form">
        <div class="order-section">
          <h2 class="order-section__title">Способ оплаты</h2>
          <div class="order-payment">
            <label :class="['order-payment__option', { 'order-payment__option--active': paymentMethod === 'card' }]">
              <input type="radio" v-model="paymentMethod" value="card" />
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect x="2" y="6" width="28" height="20" rx="3" stroke="currentColor" stroke-width="2" fill="none"/>
                <line x1="2" y1="14" x2="30" y2="14" stroke="currentColor" stroke-width="2"/>
                <line x1="8" y1="20" x2="16" y2="20" stroke="currentColor" stroke-width="2"/>
              </svg>
              <span>Банковская карта</span>
            </label>
            <label :class="['order-payment__option', { 'order-payment__option--active': paymentMethod === 'cash' }]">
              <input type="radio" v-model="paymentMethod" value="cash" />
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect x="2" y="8" width="28" height="16" rx="4" stroke="currentColor" stroke-width="2" fill="none"/>
                <circle cx="16" cy="16" r="4" stroke="currentColor" stroke-width="2" fill="none"/>
                <line x1="2" y1="12" x2="6" y2="12" stroke="currentColor" stroke-width="2"/>
                <line x1="26" y1="20" x2="30" y2="20" stroke="currentColor" stroke-width="2"/>
              </svg>
              <span>Наличные</span>
            </label>
          </div>
        </div>

        <div v-if="paymentMethod === 'card'" class="order-card">
          <h2 class="order-section__title">Данные карты</h2>
          <div class="order-card__fields">
            <div class="order-card__field order-card__field--full">
              <label class="order-card__label">Номер карты</label>
              <input class="order-card__input" type="text" placeholder="0000 0000 0000 0000" maxlength="19" :value="cardNumber" @input="onCardInput" />
            </div>
            <div class="order-card__field">
              <label class="order-card__label">Срок действия</label>
              <input class="order-card__input" type="text" placeholder="ММ / ГГ" maxlength="7" :value="cardExpiry" @input="onExpiryInput" />
            </div>
            <div class="order-card__field">
              <label class="order-card__label">CVV</label>
              <input class="order-card__input" type="text" placeholder="•••" maxlength="3" />
            </div>
          </div>
        </div>

        <button class="order-submit" @click="submitOrder">
          ОФОРМИТЬ ЗАКАЗ
        </button>
      </div>

      <div v-else class="order-success">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" stroke="#040404" stroke-width="2" fill="none"/>
          <path d="M20 32 L28 40 L44 24" stroke="#040404" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h2 class="order-success__title">Спасибо за заказ!</h2>
        <p class="order-success__text">Наш менеджер свяжется с вами в ближайшее время.</p>
        <p class="order-success__payment">
          Способ оплаты: <strong>{{ paymentMethod === 'card' ? 'Банковская карта' : 'Наличные' }}</strong>
        </p>
      </div>
    </section>
  </main>
  <AppFooter />
</template>

<style scoped>
.order-page {
  min-height: 70vh;
  padding: 80px 0;
}

.order-title {
  font-family: 'Onest', sans-serif;
  font-size: 64px;
  font-weight: 500;
  color: #040404;
  text-align: center;
  margin-bottom: 60px;
}

.order-form {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.order-section__title {
  font-family: 'Onest', sans-serif;
  font-size: 32px;
  font-weight: 500;
  color: #040404;
  margin-bottom: 24px;
}

.order-payment {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-payment__option {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  border: 2px solid #eee;
  border-radius: 12px;
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease;
  font-family: 'Onest', sans-serif;
  font-size: 20px;
  font-weight: 400;
  color: #040404;
}

.order-payment__option input {
  display: none;
}

.order-payment__option--active {
  border-color: #040404;
  background: #f8f8f8;
}

.order-payment__option:hover {
  border-color: #040404;
}

.order-card {
  background: #f8f8f8;
  border-radius: 12px;
  padding: 24px;
}

.order-card__fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.order-card__field--full {
  grid-column: 1 / -1;
}

.order-card__label {
  display: block;
  font-family: 'Roboto Mono', monospace;
  font-size: 12px;
  text-transform: uppercase;
  color: rgba(0,0,0,0.5);
  margin-bottom: 6px;
  letter-spacing: 0.5px;
}

.order-card__input {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: 'Roboto Mono', monospace;
  font-size: 18px;
  background: white;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.order-card__input:focus {
  outline: none;
  border-color: #040404;
}

.order-card__input::placeholder {
  color: #ccc;
}

.order-submit {
  width: 100%;
  padding: 20px;
  background: #040404;
  border: none;
  border-radius: 12px;
  font-family: 'Roboto Mono', monospace;
  font-size: 20px;
  font-weight: 500;
  text-transform: uppercase;
  color: white;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.order-submit:hover {
  opacity: 0.85;
}

.order-success {
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  text-align: center;
  padding: 60px 0;
}

.order-success__title {
  font-family: 'Onest', sans-serif;
  font-size: 40px;
  font-weight: 500;
  color: #040404;
}

.order-success__text {
  font-family: 'Roboto Mono', monospace;
  font-size: 18px;
  color: rgba(0,0,0,0.7);
}

.order-success__payment {
  font-family: 'Roboto Mono', monospace;
  font-size: 16px;
  color: rgba(0,0,0,0.7);
}

@media (max-width: 768px) {
  .order-title {
    font-size: 40px;
    margin-bottom: 40px;
  }
  .order-section__title {
    font-size: 24px;
  }
  .order-payment__option {
    font-size: 18px;
    padding: 16px 20px;
  }
}

@media (max-width: 480px) {
  .order-title {
    font-size: 28px;
  }
  .order-page {
    padding: 40px 0;
  }
  .order-success__title {
    font-size: 28px;
  }
}
</style>
