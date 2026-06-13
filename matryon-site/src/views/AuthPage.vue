<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getSupabase } from '../lib/supabase.js'
import { useAuth } from '../lib/auth.js'
import { useMeta } from '../lib/useMeta.js'

useMeta('Вход / Регистрация | Matryon', 'Войдите или зарегистрируйтесь в Matryon через email.')

const props = defineProps({
  initialTab: {
    type: String,
    default: 'login'
  }
})

const router = useRouter()
const { user } = useAuth()

const phone = ref('')
const email = ref('')
const fullName = ref('')
const isLogin = ref(true)
const loading = ref(false)
const errorMsg = ref('')
const sent = ref(false)

onMounted(() => {
  isLogin.value = props.initialTab === 'login'
})

watch(user, (u) => {
  if (u) router.push('/')
})

function formatPhone(digits) {
  const d = digits.replace(/\D/g, '')
  if (!d || d === '7') return '+7'
  let result = '+7 ('
  if (d.length > 1) result += d.slice(1, Math.min(4, d.length))
  if (d.length > 4) result += ') ' + d.slice(4, Math.min(7, d.length))
  if (d.length > 7) result += '-' + d.slice(7, Math.min(9, d.length))
  if (d.length > 9) result += '-' + d.slice(9, 11)
  return result
}

function onPhoneInput(e) {
  let raw = e.target.value.replace(/\D/g, '')
  if (raw.startsWith('8')) raw = '7' + raw.slice(1)
  if (!raw.startsWith('7')) raw = '7' + raw
  raw = raw.slice(0, 11)
  phone.value = raw
  e.target.value = formatPhone(raw)
}

async function sendMagicLink() {
  errorMsg.value = ''

  if (!email.value) {
    errorMsg.value = 'Введите email'
    return
  }

  loading.value = true
  const supabase = getSupabase()

  if (!supabase) {
    errorMsg.value = 'Сервис недоступен. Попробуйте позже.'
    loading.value = false
    return
  }

  try {
    if (!isLogin.value) {
      const { data: exists, error: checkErr } = await supabase
        .rpc('check_email_exists', { email_to_check: email.value })
      if (checkErr) throw checkErr
      if (exists) {
        throw new Error('Пользователь с таким email уже зарегистрирован')
      }
    }

    const { error } = await supabase.auth.signInWithOtp({
      email: email.value,
      options: {
        data: {
          full_name: fullName.value,
          phone: phone.value
        },
        shouldCreateUser: !isLogin.value,
        emailRedirectTo: window.location.origin
      }
    })
    if (error) throw error

    sent.value = true
  } catch (e) {
    errorMsg.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <button class="auth-back" @click="router.push('/')">
        <svg width="63" height="63" viewBox="0 0 63 63" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="63" height="63" rx="12" fill="white"/>
          <path d="M23.7414 24.37C23.7414 21.9565 25.5747 20 27.8362 20H31.069V28.74H27.8362C25.5747 28.74 23.7414 26.7835 23.7414 24.37Z" fill="black"/>
          <path d="M19 29.66H31.069V32.88C31.069 36.4367 28.3672 39.32 25.0345 39.32C21.7017 39.32 19 36.4367 19 32.88V29.66Z" fill="black"/>
          <path d="M31.931 26.44C31.931 22.8833 34.6328 20 37.9655 20C41.2983 20 44 22.8833 44 26.44V28.74H31.931V26.44Z" fill="black"/>
          <path d="M31.931 29.66H37.75C41.2018 29.66 44 32.6463 44 36.33C44 40.0137 41.2018 43 37.75 43H31.931V29.66Z" fill="black"/>
        </svg>
      </button>

      <h1 class="auth-title">// ВХОД/РЕГИСТРАЦИЯ</h1>

      <div class="auth-tabs">
        <button :class="['auth-tab', { active: isLogin }]" @click="isLogin = true">ВХОД</button>
        <button :class="['auth-tab', { active: !isLogin }]" @click="isLogin = false">РЕГИСТРАЦИЯ</button>
      </div>

      <div class="auth-form">
        <template v-if="!sent">
          <div class="auth-field">
            <label>НОМЕР ТЕЛЕФОНА</label>
            <input :value="formatPhone(phone)" type="tel" placeholder="+7 (___) ___-__-__" @input="onPhoneInput" />
          </div>
          <div class="auth-field">
            <label>ЭЛЕКТРОННАЯ ПОЧТА</label>
            <input v-model="email" type="email" placeholder="example@mail.ru" />
          </div>
          <div class="auth-field" v-if="!isLogin">
            <label>ФИО</label>
            <input v-model="fullName" type="text" placeholder="Иванов Иван Иванович" />
          </div>

          <p v-if="errorMsg" class="auth-error">{{ errorMsg }}</p>

          <button class="auth-submit" :disabled="loading" @click="sendMagicLink">
            {{ loading ? 'ОТПРАВКА...' : 'ПРОДОЛЖИТЬ' }}
          </button>
        </template>

        <template v-else>
          <div class="auth-sent">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <rect width="64" height="64" rx="32" fill="#040404"/>
              <path d="M20 33L28 41L44 25" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <h2 class="auth-sent-title">ПРОВЕРЬТЕ ПОЧТУ</h2>
            <p class="auth-sent-text">Мы отправили ссылку для входа на <strong>{{ email }}</strong></p>
            <p class="auth-sent-hint">Если письмо не пришло, проверьте папку «Спам»</p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: #E7E7E7;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.auth-card {
  position: relative;
  width: 1000px;
  min-height: 700px;
  background: #D9D9D9;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.auth-back {
  position: absolute;
  top: 18px;
  right: 18px;
  background: none;
  border: none;
  cursor: pointer;
}

.auth-title {
  position: absolute;
  top: 29px;
  left: 31px;
  font-family: 'Roboto Mono', monospace;
  font-size: 20px;
  font-weight: 400;
  color: black;
}

.auth-tabs {
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
}

.auth-tab {
  font-family: 'Roboto Mono', monospace;
  font-size: 20px;
  font-weight: 400;
  text-transform: uppercase;
  color: black;
  border: none;
  background: none;
  cursor: pointer;
  padding: 8px 0;
  border-bottom: 2px solid transparent;
}

.auth-tab.active {
  border-bottom-color: black;
}

.auth-form {
  width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.auth-field {
  width: 100%;
}

.auth-field label {
  display: block;
  font-family: 'Roboto Mono', monospace;
  font-size: 24px;
  font-weight: 400;
  color: black;
  margin-bottom: 6px;
}

.auth-field input {
  width: 100%;
  height: 76px;
  background: #E7E7E7;
  border: none;
  border-radius: 3px;
  padding: 0 16px;
  font-family: 'Roboto Mono', monospace;
  font-size: 20px;
  color: black;
  outline: none;
}

.auth-field input::placeholder {
  color: rgba(0, 0, 0, 0.4);
}

.auth-error {
  font-family: 'Roboto Mono', monospace;
  font-size: 16px;
  color: #d32f2f;
}

.auth-success {
  font-family: 'Roboto Mono', monospace;
  font-size: 16px;
  color: #2e7d32;
}

.auth-submit {
  width: 300px;
  height: 100px;
  background: #E7E7E7;
  border-radius: 3px;
  border: none;
  font-family: 'Roboto Mono', monospace;
  font-size: 24px;
  font-weight: 400;
  text-transform: uppercase;
  color: black;
  cursor: pointer;
  margin-top: 20px;
}

.auth-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.auth-sent {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
}

.auth-sent-title {
  font-family: 'Onest', sans-serif;
  font-size: 32px;
  font-weight: 500;
  color: #040404;
}

.auth-sent-text {
  font-family: 'Roboto Mono', monospace;
  font-size: 18px;
  color: rgba(0,0,0,0.8);
  max-width: 400px;
}

.auth-sent-hint {
  font-family: 'Roboto Mono', monospace;
  font-size: 14px;
  color: rgba(0,0,0,0.5);
}

@media (max-width: 768px) {
  .auth-card {
    width: 100%;
    min-height: auto;
    padding: 60px 20px 40px;
  }
  .auth-form {
    width: 100%;
  }
  .auth-field input {
    height: 56px;
  }
  .auth-submit {
    width: 100%;
    height: 72px;
  }
  .auth-field label {
    font-size: 18px;
  }
  .auth-tabs {
    gap: 16px;
    margin-bottom: 24px;
  }
}

@media (max-width: 480px) {
  .auth-card {
    padding: 50px 16px 30px;
    border-radius: 8px;
  }
  .auth-title {
    font-size: 16px;
    top: 16px;
    left: 16px;
  }
  .auth-tab {
    font-size: 16px;
  }
  .auth-field label {
    font-size: 16px;
  }
  .auth-field input {
    height: 48px;
    font-size: 16px;
    padding: 0 12px;
  }
  .auth-submit {
    height: 56px;
    font-size: 18px;
  }
  .auth-back svg {
    width: 48px;
    height: 48px;
  }
}
</style>
