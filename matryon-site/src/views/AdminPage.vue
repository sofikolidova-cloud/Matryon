<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import { getSupabase } from '../lib/supabase.js'
import { useAuth } from '../lib/auth.js'
import { isAdminEmail } from '../lib/admin.js'
import { useMeta } from '../lib/useMeta.js'
useMeta('Админка | Matryon', 'Панель управления сайтом Matryon.')

const router = useRouter()
const { user, signOut } = useAuth()

const loading = ref(true)
const loadingError = ref('')

function withTimeout(promise, ms = 10000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms))
  ])
}

const tab = ref('reviews')

const reviews = ref([])
const products = ref([])

const newProductOpen = ref(false)
const editProductOpen = ref(false)
const editingProduct = ref(null)
const saving = ref(false)
const errorMsg = ref('')

const productForm = ref({
  id: '',
  type: 'speaker',
  name: '',
  desc: '',
  price: '',
  specs_display: '',
  specs_memory: '',
  specs_speaker: '',
  serial: '',
  image: ''
})

const typeOptions = ['speaker', 'lamp', 'socket']

watch(user, (u) => {
  if (!u) router.push('/admin/login')
})

async function checkAdmin() {
  const supabase = getSupabase()
  if (supabase) {
    const { data: { user: sessionUser } } = await supabase.auth.getUser()
    if (sessionUser) user.value = sessionUser
  }
  if (!user.value) {
    router.push('/admin/login')
    return
  }
  if (!isAdminEmail(user.value.email)) {
    router.push('/')
    return
  }
  const results = await Promise.allSettled([fetchReviews(), fetchProducts()])
  const errors = results.filter(r => r.status === 'rejected').map(r => r.reason)
  if (errors.length) {
    loadingError.value = 'Некоторые данные не загрузились'
    errors.forEach(e => console.error('Admin fetch error:', e))
  }
  loading.value = false
}

async function fetchReviews() {
  const supabase = getSupabase()
  if (!supabase) { console.warn('Supabase not configured'); return }
  const { data, error } = await withTimeout(supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false }))
  if (error) console.warn('fetchReviews error:', error)
  if (data) reviews.value = data
}

async function deleteReview(id) {
  try {
    const supabase = getSupabase()
    await supabase.from('reviews').delete().eq('id', id)
    await fetchReviews()
  } catch (e) {
    console.warn('deleteReview error:', e)
  }
}

async function fetchProducts() {
  const supabase = getSupabase()
  if (!supabase) { console.warn('Supabase not configured'); return }
  const { data, error } = await withTimeout(supabase
    .from('products')
    .select('*')
    .order('name'))
  if (error) console.warn('fetchProducts error:', error)
  if (data) products.value = data
}

function resetForm() {
  productForm.value = {
    id: '', type: 'speaker', name: '', desc: '', price: '',
    specs_display: '', specs_memory: '', specs_speaker: '', serial: '', image: ''
  }
}

function openNewProduct() {
  resetForm()
  newProductOpen.value = true
  editProductOpen.value = false
  errorMsg.value = ''
}

function openEditProduct(p) {
  editingProduct.value = p
  productForm.value = {
    id: p.id,
    type: p.type,
    name: p.name,
    desc: p.desc || '',
    price: p.price || '',
    specs_display: p.specs?.display || '',
    specs_memory: p.specs?.memory || '',
    specs_speaker: p.specs?.speaker || '',
    serial: p.serial || '',
    image: p.image || ''
  }
  editProductOpen.value = true
  newProductOpen.value = false
  errorMsg.value = ''
}

function closeProductForm() {
  newProductOpen.value = false
  editProductOpen.value = false
  editingProduct.value = null
}

async function saveNewProduct() {
  errorMsg.value = ''
  const f = productForm.value
  if (!f.id.trim() || !f.name.trim()) {
    errorMsg.value = 'ID и название обязательны'
    return
  }

  saving.value = true

  const specs = f.type === 'speaker' ? {
    display: f.specs_display,
    memory: f.specs_memory,
    speaker: f.specs_speaker
  } : null

  try {
    const supabase = getSupabase()
    const { error } = await supabase.from('products').insert({
      id: f.id.trim(),
      type: f.type,
      name: f.name.trim(),
      desc: f.desc.trim(),
      price: f.price.trim(),
      specs,
      serial: f.serial.trim() || null,
      image: f.image.trim() || null
    })
    if (error) throw new Error(error.message)
    closeProductForm()
    await fetchProducts()
  } catch (e) {
    errorMsg.value = e.message
  }
  saving.value = false
}

async function saveEditProduct() {
  errorMsg.value = ''
  const f = productForm.value
  if (!f.name.trim()) {
    errorMsg.value = 'Название обязательно'
    return
  }

  saving.value = true

  const specs = f.type === 'speaker' ? {
    display: f.specs_display,
    memory: f.specs_memory,
    speaker: f.specs_speaker
  } : null

  try {
    const supabase = getSupabase()
    const { error } = await supabase.from('products').update({
      type: f.type,
      name: f.name.trim(),
      desc: f.desc.trim(),
      price: f.price.trim(),
      specs,
      serial: f.serial.trim() || null,
      image: f.image.trim() || null
    }).eq('id', editingProduct.value.id)
    if (error) throw new Error(error.message)
    closeProductForm()
    await fetchProducts()
  } catch (e) {
    errorMsg.value = e.message
  }
  saving.value = false
}

async function deleteProduct(id) {
  try {
    const supabase = getSupabase()
    await supabase.from('products').delete().eq('id', id)
    await fetchProducts()
  } catch (e) {
    console.warn('deleteProduct error:', e)
  }
}

onMounted(checkAdmin)
</script>

<template>
  <AppHeader />
  <main class="admin-page">
    <div class="container">
      <div v-if="loading" class="admin-loading">
        <div class="admin-loading__spinner"></div>
        <p v-if="loadingError" class="admin-loading__error">{{ loadingError }}</p>
      </div>

      <template v-else>
        <h1 class="admin-title">АДМИНКА</h1>
        <router-link to="/" class="admin-back-link">НА САЙТ</router-link>

        <div class="admin-tabs">
          <button :class="['admin-tab', { active: tab === 'reviews' }]" @click="tab = 'reviews'">ОТЗЫВЫ ({{ reviews.length }})</button>
          <button :class="['admin-tab', { active: tab === 'products' }]" @click="tab = 'products'">ТОВАРЫ ({{ products.length }})</button>
        </div>

        <section v-if="tab === 'reviews'" class="admin-section fade-in">
          <div class="admin-card" v-for="r in reviews" :key="r.id">
            <div class="admin-card__info">
              <span class="admin-card__name">{{ r.name }}</span>
              <span v-if="r.model" class="admin-card__model">({{ r.model }})</span>
              <p class="admin-card__text">{{ r.text }}</p>
              <span class="admin-card__date">{{ new Date(r.created_at).toLocaleDateString() }}</span>
            </div>
            <button class="admin-card__delete" @click="deleteReview(r.id)">УДАЛИТЬ</button>
          </div>
          <p v-if="!reviews.length" class="admin-empty">Нет отзывов</p>
        </section>

        <section v-if="tab === 'products'" class="admin-section fade-in">
          <button class="admin-add-btn" @click="openNewProduct">+ ДОБАВИТЬ ТОВАР</button>

          <div class="admin-card" v-for="p in products" :key="p.id">
            <img v-if="p.image" :src="p.image" class="admin-card__thumb" @error="$event.target.style.display='none'" />
            <div class="admin-card__info">
              <span class="admin-card__name">{{ p.name }}</span>
              <span class="admin-card__model">{{ p.type }} — {{ p.id }}</span>
              <p class="admin-card__text">{{ p.desc }}</p>
              <span class="admin-card__price">{{ p.price }} ₽</span>
            </div>
            <div class="admin-card__actions">
              <button class="admin-card__edit" @click="openEditProduct(p)">РЕДАКТИРОВАТЬ</button>
              <button class="admin-card__delete" @click="deleteProduct(p.id)">УДАЛИТЬ</button>
            </div>
          </div>
          <p v-if="!products.length" class="admin-empty">Нет товаров</p>
        </section>
      </template>
    </div>

    <Teleport to="body">
      <div v-if="newProductOpen || editProductOpen" class="modal-overlay" @click.self="closeProductForm">
        <div class="modal-card">
          <button class="modal-close" @click="closeProductForm">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="black" stroke-width="2" stroke-linecap="round"/></svg>
          </button>
          <h2 class="modal-title">{{ editProductOpen ? 'РЕДАКТИРОВАТЬ ТОВАР' : 'НОВЫЙ ТОВАР' }}</h2>
          <div class="modal-form">
            <div v-if="newProductOpen" class="modal-field">
              <label>ID *</label>
              <input v-model="productForm.id" type="text" placeholder="sp-new" />
            </div>
            <div class="modal-field">
              <label>ТИП</label>
              <select v-model="productForm.type">
                <option v-for="t in typeOptions" :key="t" :value="t">{{ t }}</option>
              </select>
            </div>
            <div class="modal-field">
              <label>НАЗВАНИЕ *</label>
              <input v-model="productForm.name" type="text" placeholder="Matryon New" />
            </div>
            <div class="modal-field">
              <label>ОПИСАНИЕ</label>
              <textarea v-model="productForm.desc" placeholder="Описание..." rows="2"></textarea>
            </div>
            <div class="modal-field">
              <label>ЦЕНА</label>
              <input v-model="productForm.price" type="text" placeholder="15 690" />
            </div>
            <template v-if="productForm.type === 'speaker'">
              <div class="modal-field">
                <label>ДИСПЛЕЙ</label>
                <input v-model="productForm.specs_display" type="text" placeholder='1.7"' />
              </div>
              <div class="modal-field">
                <label>ПАМЯТЬ</label>
                <input v-model="productForm.specs_memory" type="text" placeholder="4 ГБ" />
              </div>
              <div class="modal-field">
                <label>ДИНАМИК</label>
                <input v-model="productForm.specs_speaker" type="text" placeholder="60 Вт" />
              </div>
            </template>
            <div class="modal-field">
              <label>СЕРИЙНЫЙ НОМЕР</label>
              <input v-model="productForm.serial" type="text" placeholder="MAT-XXX" />
            </div>
            <div class="modal-field">
              <label>ССЫЛКА НА ИЗОБРАЖЕНИЕ</label>
              <input v-model="productForm.image" type="text" placeholder="https://example.com/image.webp" />
              <img v-if="productForm.image" :src="productForm.image" class="admin-form-preview" @error="$event.target.style.display='none'" />
            </div>
            <p v-if="errorMsg" class="modal-error">{{ errorMsg }}</p>
            <button class="modal-submit" :disabled="saving" @click="editProductOpen ? saveEditProduct() : saveNewProduct()">
              {{ saving ? 'СОХРАНЕНИЕ...' : 'СОХРАНИТЬ' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </main>
  <AppFooter />
</template>

<style scoped>
.admin-page {
  background: #fff;
  min-height: 60vh;
  padding-top: 60px;
  padding-bottom: 80px;
}
.admin-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40vh;
}
.admin-loading__spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #E7E7E7;
  border-top-color: #040404;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
.admin-loading__error {
  font-family: 'Roboto Mono', monospace;
  font-size: 14px;
  color: #d32f2f;
  text-align: center;
  margin-top: 24px;
  max-width: 400px;
}
@keyframes spin { to { transform: rotate(360deg); } }
.admin-title {
  font-family: 'Onest', sans-serif;
  font-size: 48px;
  font-weight: 500;
  color: #040404;
  margin-bottom: 32px;
}
.admin-back-link {
  display: inline-block;
  font-family: 'Roboto Mono', monospace;
  font-size: 14px;
  color: rgba(0,0,0,0.5);
  text-decoration: underline;
  margin-bottom: 16px;
  transition: color 0.2s;
}
.admin-back-link:hover {
  color: #040404;
}
.admin-tabs {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  border-bottom: 1px solid #E7E7E7;
  padding-bottom: 16px;
}
.admin-tab {
  font-family: 'Roboto Mono', monospace;
  font-size: 18px;
  font-weight: 500;
  color: rgba(0,0,0,0.5);
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px 16px;
  transition: color 0.2s;
}
.admin-tab.active {
  color: #040404;
  text-decoration: underline;
}
.admin-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.admin-add-btn {
  font-family: 'Roboto Mono', monospace;
  font-size: 16px;
  font-weight: 500;
  color: white;
  background: #040404;
  border: none;
  border-radius: 3px;
  padding: 16px 24px;
  cursor: pointer;
  align-self: flex-start;
  transition: opacity 0.2s;
}
.admin-add-btn:hover { opacity: 0.8; }
.admin-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #E7E7E7;
  border-radius: 12px;
  padding: 20px 24px;
  transition: transform 0.2s;
}
.admin-card:hover { transform: translateX(4px); }
.admin-card__thumb {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
  background: #D9D9D9;
}
.admin-card__info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 0;
}
.admin-card__name {
  font-family: 'Onest', sans-serif;
  font-size: 20px;
  font-weight: 500;
  color: #040404;
}
.admin-card__model {
  font-family: 'Roboto Mono', monospace;
  font-size: 14px;
  color: rgba(0,0,0,0.6);
}
.admin-card__price {
  font-family: 'Roboto Mono', monospace;
  font-size: 16px;
  font-weight: 500;
  color: #040404;
}
.admin-card__text {
  font-family: 'Roboto Mono', monospace;
  font-size: 14px;
  color: rgba(0,0,0,0.7);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.admin-card__date {
  font-family: 'Roboto Mono', monospace;
  font-size: 12px;
  color: rgba(0,0,0,0.4);
}
.admin-card__actions {
  display: flex;
  gap: 8px;
}
.admin-card__edit {
  font-family: 'Roboto Mono', monospace;
  font-size: 13px;
  font-weight: 500;
  color: #040404;
  background: none;
  border: 1px solid #040404;
  border-radius: 3px;
  padding: 8px 16px;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s, color 0.2s;
}
.admin-card__edit:hover {
  background: #040404;
  color: white;
}
.admin-card__delete {
  font-family: 'Roboto Mono', monospace;
  font-size: 13px;
  font-weight: 500;
  color: #d32f2f;
  background: none;
  border: 1px solid #d32f2f;
  border-radius: 3px;
  padding: 8px 16px;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s, color 0.2s;
}
.admin-card__delete:hover {
  background: #d32f2f;
  color: white;
}
.admin-empty {
  font-family: 'Roboto Mono', monospace;
  font-size: 16px;
  color: rgba(0,0,0,0.4);
  text-align: center;
  padding: 40px;
}
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 20px;
}
.modal-card {
  position: relative;
  width: 100%;
  max-width: 560px;
  background: #D9D9D9;
  border-radius: 10px;
  padding: 40px;
  max-height: 90vh;
  overflow-y: auto;
}
.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  cursor: pointer;
}
.modal-title {
  font-family: 'Onest', sans-serif;
  font-size: 32px;
  font-weight: 500;
  color: #040404;
  margin-bottom: 24px;
}
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.modal-field label {
  display: block;
  font-family: 'Roboto Mono', monospace;
  font-size: 14px;
  font-weight: 400;
  color: rgba(0,0,0,0.7);
  margin-bottom: 4px;
}
.modal-field input,
.modal-field select,
.modal-field textarea {
  width: 100%;
  padding: 10px 14px;
  background: #E7E7E7;
  border: none;
  border-radius: 3px;
  font-family: 'Roboto Mono', monospace;
  font-size: 15px;
  color: #040404;
  outline: none;
}
.modal-field textarea { resize: vertical; min-height: 60px; }
.admin-form-preview {
  width: 100%;
  max-height: 160px;
  object-fit: contain;
  margin-top: 8px;
  border-radius: 6px;
  background: #D9D9D9;
}
.modal-error {
  font-family: 'Roboto Mono', monospace;
  font-size: 14px;
  color: #d32f2f;
}
.modal-submit {
  width: 100%;
  height: 56px;
  background: #040404;
  border: none;
  border-radius: 3px;
  font-family: 'Roboto Mono', monospace;
  font-size: 18px;
  font-weight: 500;
  text-transform: uppercase;
  color: white;
  cursor: pointer;
  margin-top: 8px;
}
.modal-submit:disabled { opacity: 0.5; cursor: not-allowed; }
@media (max-width: 768px) {
  .admin-page { padding-top: 30px; padding-bottom: 40px; }
  .admin-title { font-size: 32px; }
  .admin-card { flex-direction: column; align-items: flex-start; }
  .admin-card__actions { width: 100%; }
  .admin-card__edit, .admin-card__delete { flex: 1; text-align: center; }
  .modal-card { padding: 24px; }
}
</style>
