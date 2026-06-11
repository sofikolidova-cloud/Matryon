<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import { getSupabase } from '../lib/supabase.js'
import { useAuth } from '../lib/auth.js'
import { useMeta } from '../lib/useMeta.js'

useMeta('Профиль | Matryon', 'Ваш профиль в Matryon.')

const router = useRouter()
const { user, signOut } = useAuth()

const fullName = ref('')
const email = ref('')
const phone = ref('')
const loading = ref(true)
const saving = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

watch(user, (u) => {
  if (!u) router.push('/login')
})

async function loadProfile() {
  if (!user.value) return
  const meta = user.value.user_metadata || {}
  fullName.value = meta.full_name || ''
  email.value = user.value.email || meta.email || ''
  phone.value = meta.phone || ''
  loading.value = false
}

async function saveProfile() {
  errorMsg.value = ''
  successMsg.value = ''
  saving.value = true
  const supabase = getSupabase()
  if (!supabase) { saving.value = false; return }

  const { error: profileErr } = await supabase
    .from('profiles')
    .update({ full_name: fullName.value })
    .eq('id', user.value.id)

  if (profileErr) {
    errorMsg.value = profileErr.message
  } else {
    const { error: metaErr } = await supabase.auth.updateUser({
      data: { full_name: fullName.value }
    })
    if (metaErr) {
      errorMsg.value = metaErr.message
    } else {
      successMsg.value = 'Профиль сохранён'
    }
  }
  saving.value = false
}

async function handleSignOut() {
  await signOut()
  router.push('/')
}

onMounted(loadProfile)
</script>

<template>
  <AppHeader />
  <main class="profile-page">
    <div class="container">
      <div v-if="loading" class="profile-loading">
        <div class="profile-loading__spinner"></div>
      </div>
      <div v-else class="profile-card fade-in">
        <h1 class="profile-title">ПРОФИЛЬ</h1>

        <div class="profile-avatar">
          <div class="profile-avatar__circle">{{ fullName.charAt(0) || '?' }}</div>
        </div>

        <div class="profile-fields">
          <div class="profile-field">
            <label>ФИО</label>
            <input v-model="fullName" type="text" placeholder="Иванов Иван Иванович" />
          </div>
          <div class="profile-field">
            <label>ЭЛЕКТРОННАЯ ПОЧТА</label>
            <input :value="email" type="email" disabled />
          </div>
          <div class="profile-field">
            <label>НОМЕР ТЕЛЕФОНА</label>
            <input :value="phone" type="text" disabled />
          </div>
        </div>

        <p v-if="errorMsg" class="profile-error">{{ errorMsg }}</p>
        <p v-if="successMsg" class="profile-success">{{ successMsg }}</p>

        <button class="profile-save" :disabled="saving" @click="saveProfile">
          {{ saving ? 'СОХРАНЕНИЕ...' : 'СОХРАНИТЬ' }}
        </button>

        <button class="profile-signout" @click="handleSignOut">ВЫЙТИ</button>
      </div>
    </div>
  </main>
  <AppFooter />
</template>

<style scoped>
.profile-page {
  background: #fff;
  min-height: 60vh;
  padding-top: 60px;
  padding-bottom: 80px;
}
.profile-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40vh;
}
.profile-loading__spinner {
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
.profile-card {
  max-width: 600px;
  margin: 0 auto;
  background: #E7E7E7;
  border-radius: 30px;
  padding: 60px 50px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.profile-title {
  font-family: 'Onest', sans-serif;
  font-size: 48px;
  font-weight: 500;
  color: #040404;
}
.profile-avatar {
  display: flex;
  align-items: center;
}
.profile-avatar__circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #040404;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Onest', sans-serif;
  font-size: 44px;
  color: white;
  flex-shrink: 0;
}
.profile-fields {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.profile-field label {
  display: block;
  font-family: 'Roboto Mono', monospace;
  font-size: 14px;
  font-weight: 400;
  color: rgba(0,0,0,0.7);
  margin-bottom: 6px;
}
.profile-field input {
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
.profile-field input:disabled {
  opacity: 0.5;
}
.profile-error {
  font-family: 'Roboto Mono', monospace;
  font-size: 14px;
  color: #d32f2f;
}
.profile-success {
  font-family: 'Roboto Mono', monospace;
  font-size: 14px;
  color: #2e7d32;
}
.profile-save {
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
.profile-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.profile-signout {
  width: 100%;
  height: 60px;
  background: transparent;
  border: 2px solid #040404;
  border-radius: 3px;
  font-family: 'Roboto Mono', monospace;
  font-size: 18px;
  font-weight: 500;
  text-transform: uppercase;
  color: #040404;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.profile-signout:hover {
  background: #040404;
  color: white;
}
@media (max-width: 768px) {
  .profile-page { padding-top: 30px; padding-bottom: 40px; }
  .profile-card { padding: 30px 20px; gap: 24px; }
  .profile-title { font-size: 32px; }
  .profile-avatar__circle { width: 72px; height: 72px; font-size: 32px; }
  .profile-field input { height: 48px; font-size: 16px; }
}
</style>
