<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getSupabase } from '../lib/supabase.js'
import { isAdminEmail } from '../lib/admin.js'

const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

async function handleLogin() {
  errorMsg.value = ''
  if (!email.value.trim() || !password.value) {
    errorMsg.value = 'Введите email и пароль'
    return
  }

  loading.value = true
  const supabase = getSupabase()
  if (!supabase) { loading.value = false; return }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value.trim(),
    password: password.value
  })

  if (error) {
    errorMsg.value = error.message
    loading.value = false
    return
  }

  if (!isAdminEmail(data.user?.email)) {
    await supabase.auth.signOut()
    errorMsg.value = 'Доступ запрещён'
    loading.value = false
    return
  }

  router.push('/admin')
}
</script>

<template>
  <main class="admin-login">
    <div class="admin-login__card">
      <h1 class="admin-login__title">АДМИН</h1>

      <div class="admin-login__fields">
        <div class="admin-login__field">
          <label>EMAIL</label>
          <input v-model="email" type="email" placeholder="admin@matryon.ru" />
        </div>
        <div class="admin-login__field">
          <label>ПАРОЛЬ</label>
          <input v-model="password" type="password" placeholder="••••••" />
        </div>
      </div>

      <p v-if="errorMsg" class="admin-login__error">{{ errorMsg }}</p>

      <button class="admin-login__btn" :disabled="loading" @click="handleLogin">
        {{ loading ? 'ВХОД...' : 'ВОЙТИ' }}
      </button>

      <router-link to="/" class="admin-login__back">НА САЙТ</router-link>
    </div>
  </main>
</template>

<style scoped>
.admin-login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  padding: 20px;
}
.admin-login__card {
  width: 100%;
  max-width: 420px;
  background: #E7E7E7;
  border-radius: 30px;
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.admin-login__title {
  font-family: 'Onest', sans-serif;
  font-size: 48px;
  font-weight: 500;
  color: #040404;
  text-align: center;
}
.admin-login__fields {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.admin-login__field label {
  display: block;
  font-family: 'Roboto Mono', monospace;
  font-size: 14px;
  font-weight: 400;
  color: rgba(0,0,0,0.7);
  margin-bottom: 6px;
}
.admin-login__field input {
  width: 100%;
  height: 60px;
  background: white;
  border: none;
  border-radius: 3px;
  padding: 0 16px;
  font-family: 'Roboto Mono', monospace;
  font-size: 18px;
  color: #040404;
  outline: none;
}
.admin-login__error {
  font-family: 'Roboto Mono', monospace;
  font-size: 14px;
  color: #d32f2f;
  text-align: center;
}
.admin-login__btn {
  width: 100%;
  height: 60px;
  background: #040404;
  border: none;
  border-radius: 3px;
  font-family: 'Roboto Mono', monospace;
  font-size: 18px;
  font-weight: 500;
  text-transform: uppercase;
  color: white;
  cursor: pointer;
}
.admin-login__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.admin-login__back {
  font-family: 'Roboto Mono', monospace;
  font-size: 14px;
  color: rgba(0,0,0,0.5);
  text-align: center;
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.2s;
}
.admin-login__back:hover {
  color: #040404;
}
@media (max-width: 768px) {
  .admin-login__card { padding: 40px 24px; }
  .admin-login__title { font-size: 32px; }
  .admin-login__field input { height: 48px; font-size: 16px; }
}
</style>
