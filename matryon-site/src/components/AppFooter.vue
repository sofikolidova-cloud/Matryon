<script setup>
import { ref } from 'vue'
import { getSupabase } from '../lib/supabase.js'

const email = ref('')
const consent = ref(false)
const status = ref('')

const subscribe = async () => {
  if (!email.value || !consent.value) return
  status.value = 'sending'
  try {
    const supabase = getSupabase()
    if (!supabase) {
      status.value = 'error'
      return
    }
    const { error } = await supabase
      .from('subscribers')
      .insert({ email: email.value })
    if (error) throw error
    status.value = 'success'
    email.value = ''
    consent.value = false
  } catch (e) {
    status.value = 'error'
  }
}
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="footer__cols">
        <div class="footer__col footer__col--left">
          <h2 class="footer__title">Matryon OS</h2>
          <p class="footer__tagline">СДЕЛАНО В РОССИИ, ПОНЯТНО ВО ВСЕМ МИРЕ</p>
        </div>
        <div class="footer__col footer__col--center">
          <span class="footer__products-title">Matryon</span>
          <ul class="footer__products-list">
            <li><router-link to="/product/sp-base">Matryon Base</router-link></li>
            <li><router-link to="/product/sp-light">Matryon Light</router-link></li>
            <li><router-link to="/product/sp-pro">Matryon Pro</router-link></li>
            <li><router-link to="/product/sp-mini">Matryon Mini</router-link></li>
            <li><router-link to="/product/sp-air">Matryon Air</router-link></li>
            <li><router-link to="/product/sp-max">Matryon Max</router-link></li>
          </ul>
        </div>
        <div class="footer__col footer__col--right">
          <p class="footer__newsletter-text">Пишем редко, но метко. Только важные новости и обновления</p>
          <form class="footer__form" @submit.prevent="subscribe">
            <div class="footer__input-wrap">
              <input
                v-model="email"
                type="email"
                placeholder="e-mail"
                class="footer__input"
              />
              <button type="submit" class="footer__submit">
                <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M25.3704 16.9097H18.0903V9.62963C18.0903 9.28196 17.8477 9 17.5 9C17.1523 9 16.9097 9.28196 16.9097 9.62963V16.9097H9.62963C9.28196 16.9097 9 17.1523 9 17.5C9 17.8477 9.28196 18.0903 9.62963 18.0903H16.9097V25.3704C16.9097 25.718 17.1523 26 17.5 26C17.8477 26 18.0903 25.718 18.0903 25.3704V18.0903H25.3704C25.718 18.0903 26 17.8477 26 17.5C26 17.1523 25.718 16.9097 25.3704 16.9097Z" fill="black"/>
                </svg>
              </button>
            </div>
            <div class="footer__consent">
              <label class="footer__checkbox">
                <input type="checkbox" v-model="consent" />
                <span class="footer__checkmark"></span>
              </label>
              <p class="footer__consent-text">
                Даю согласие на обработку персональных данных и рекламных сообщений на условиях
                <a href="#">Политики конфиденциальности</a>
              </p>
            </div>
          </form>
          <p v-if="status === 'success'" class="footer__status">Благодарим, что остаётесь с нами! Будем сообщать о новинках.</p>
          <p v-else-if="status === 'error'" class="footer__status footer__status--error">Ошибка. Попробуйте ещё раз.</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  padding: 80px 0 40px;
  border-top: 1px solid rgba(0,0,0,0.05);
}

.footer__cols {
  display: flex;
  justify-content: space-between;
  gap: 40px;
}

.footer__col {
  flex: 1;
}

.footer__col--left {
  max-width: 300px;
}

.footer__col--center {
  max-width: 200px;
}

.footer__col--right {
  max-width: 420px;
}

.footer__title {
  font-size: 64px;
  font-family: 'Onest', sans-serif;
  font-weight: 500;
  color: #040404;
}

.footer__tagline {
  font-family: 'Roboto Mono', monospace;
  font-size: 20px;
  font-weight: 400;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.7);
  max-width: 277px;
  margin-top: 16px;
}

.footer__products-title {
  font-size: 32px;
  font-family: 'Onest', sans-serif;
  font-weight: 500;
  color: #040404;
  display: block;
  margin-bottom: 12px;
}

.footer__products-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.footer__products-list li {
  font-family: 'Roboto Mono', monospace;
  font-size: 20px;
  font-weight: 400;
  text-transform: uppercase;
}

.footer__products-list li a {
  color: rgba(0, 0, 0, 0.7);
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer__products-list li a:hover {
  color: #040404;
}

.footer__newsletter-text {
  font-size: 32px;
  font-family: 'Onest', sans-serif;
  font-weight: 500;
  line-height: 35.2px;
  color: #040404;
  margin-bottom: 30px;
}

.footer__input-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 419px;
  padding: 10px 20px;
  background: rgba(159, 159, 159, 0.15);
  border-radius: 8px;
  outline: 2px solid #9F9F9F;
  outline-offset: -2px;
}

.footer__input {
  flex: 1;
  border: none;
  background: transparent;
  font-family: 'Roboto Mono', monospace;
  font-size: 20px;
  font-weight: 400;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.7);
  outline: none;
}

.footer__input::placeholder {
  color: rgba(0, 0, 0, 0.7);
}

.footer__consent {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 16px;
  max-width: 400px;
}

.footer__checkbox {
  position: relative;
  width: 25px;
  height: 25px;
  flex-shrink: 0;
}

.footer__checkbox input {
  opacity: 0;
  position: absolute;
}

.footer__checkmark {
  display: block;
  width: 25px;
  height: 25px;
  border: 1px solid #9F9F9F;
  border-radius: 5px;
  background: #D9D9D9;
}

.footer__checkbox input:checked + .footer__checkmark {
  background: #040404;
  border-color: #040404;
}

.footer__consent-text {
  font-size: 14px;
  font-family: 'Roboto Mono', monospace;
  font-weight: 400;
  color: #9F9F9F;
}

.footer__consent-text a {
  text-decoration: underline;
  color: #9F9F9F;
}

.footer__status {
  margin-top: 16px;
  font-family: 'Roboto Mono', monospace;
  font-size: 14px;
  color: green;
}

.footer__status--error {
  color: red;
}

@media (max-width: 768px) {
  .footer__cols {
    flex-direction: column;
    gap: 40px;
  }
  .footer__col--left,
  .footer__col--center,
  .footer__col--right {
    max-width: none;
  }
  .footer__title {
    font-size: 36px;
  }
  .footer__input-wrap {
    width: 100%;
  }
  .footer__newsletter-text {
    font-size: 24px;
    line-height: 1.3;
  }
  .footer {
    padding: 40px 0 30px;
  }
}

@media (max-width: 480px) {
  .footer__title {
    font-size: 28px;
  }
  .footer__tagline {
    font-size: 14px;
  }
  .footer__products-title {
    font-size: 24px;
  }
  .footer__products-list li {
    font-size: 16px;
  }
  .footer__newsletter-text {
    font-size: 20px;
    line-height: 1.3;
    max-width: 100%;
  }
  .footer__input {
    font-size: 16px;
  }
  .footer__input-wrap {
    padding: 8px 14px;
  }
  .footer__cols {
    gap: 24px;
  }
}
</style>
