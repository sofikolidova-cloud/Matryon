<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import ProductCard from '../components/ProductCard.vue'
import { getSupabase } from '../lib/supabase.js'
import { useAuth } from '../lib/auth.js'
import { getProductNames } from '../lib/productData.js'
import { useMeta } from '../lib/useMeta.js'
import heroBg from '/src/assets/images/hero.webp'

useMeta('Matryon — Умная колонка для дома, учёбы и работы', 'Matryon — мультифункциональная умная колонка с голосовым управлением. Создана в России, понятна во всём мире.')
import img from '/src/assets/images/matreshka_1.webp'
import img_1 from '/src/assets/images/matreshka_2.webp'
import img_2 from '/src/assets/images/matreshka_3.webp'
import homeImg from '/src/assets/images/home.webp'
import studiesImg from '/src/assets/images/studies.webp'
import workImg from '/src/assets/images/work.webp'

import alarmSvg from '/src/assets/icons/alarm_clock.svg?raw'

const router = useRouter()
const { user } = useAuth()

const popularProducts = [
  { name: 'Matryon Base', image: img, productId: 'sp-base', description: 'СОЗДАНА ДЛЯ ТЕХ, КТО ЦЕНИТ БАЛАНС МЕЖДУ ТЕХНОЛОГИЙ И ТИШИНОЙ, МЕЖДУ ВНИМАНИЕМ И ДЕЛИКАТНОСТЬЮ' },
  { name: 'Matryon Light', image: img_1, productId: 'sp-light', description: 'СОЗДАНА ДЛЯ ТЕХ, КТО ЦЕНИТ СВЕТ И АТМОСФЕРУ В КАЖДОМ МГНОВЕНИИ' },
  { name: 'Matryon Pro', image: img_2, productId: 'sp-pro', description: 'СОЗДАНА ДЛЯ ТЕХ, КТО СТРЕМИТСЯ К ПРОФЕССИОНАЛЬНОМУ ЗВУЧАНИЮ' }
]

const cases = [
  { title: 'Для дома', img: homeImg },
  { title: 'Для учебы', img: studiesImg },
  { title: 'Для работы', img: workImg }
]

const features = [
  { number: '01', title: '- Мартрёшка, проверь мою загруженность', desc: 'Напоминания, встречи,календарь,полнаяя синхронизацция с телефоном' },
  { number: '01', title: '- Мартрёшка, проверь мою загруженность', desc: 'Напоминания, встречи,календарь,полнаяя синхронизацция с телефоном' },
  { number: '01', title: '- Мартрёшка, проверь мою загруженность', desc: 'Напоминания, встречи,календарь,полнаяя синхронизацция с телефоном' }
]

const dbReviews = ref([])
const showReviewModal = ref(false)
const reviewName = ref('')
const reviewModel = ref('')
const reviewText = ref('')
const reviewLoading = ref(false)
const reviewError = ref('')

const productModels = computed(() => {
  return getProductNames()
})

const allReviews = computed(() => {
  return dbReviews.value.map(r => ({
    name: r.name,
    model: r.model ? `(${r.model})` : '',
    text: r.text.startsWith('-') ? r.text : `-${r.text}`
  }))
})

const useCaseCurrent = ref(0)
const visibleCases = computed(() => {
  const len = cases.length
  const result = []
  for (let i = -1; i <= 1; i++) {
    const idx = (useCaseCurrent.value + i + len) % len
    result.push({ ...cases[idx], pos: i === 0 ? 'center' : 'side' })
  }
  return result
})
const perPage = 3
const currentPage = ref(0)
const totalPages = computed(() => Math.ceil(allReviews.value.length / perPage))
const visibleReviews = computed(() => {
  const start = currentPage.value * perPage
  return allReviews.value.slice(start, start + perPage)
})

async function fetchReviews() {
  const supabase = getSupabase()
  if (!supabase) return
  const { data } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false })
  if (data) dbReviews.value = data
}

function openReviewModal() {
  if (!user.value) {
    router.push('/login')
    return
  }
  reviewName.value = user.value?.user_metadata?.full_name || ''
  reviewModel.value = ''
  reviewText.value = ''
  reviewError.value = ''
  showReviewModal.value = true
}

async function submitReview() {
  reviewError.value = ''
  if (!reviewName.value.trim()) {
    reviewError.value = 'Введите имя'
    return
  }
  if (!reviewText.value.trim()) {
    reviewError.value = 'Введите текст отзыва'
    return
  }

  reviewLoading.value = true

  try {
    const supabase = getSupabase()
    const { error } = await supabase.from('reviews').insert({
      user_id: user.value.id,
      name: reviewName.value.trim(),
      model: reviewModel.value,
      text: reviewText.value.trim()
    })
    if (error) throw new Error(error.message)
    showReviewModal.value = false
    await fetchReviews()
  } catch (e) {
    reviewError.value = e.message
  } finally {
    reviewLoading.value = false
  }
}

onMounted(fetchReviews)

function useCasePrev() { useCaseCurrent.value = useCaseCurrent.value === 0 ? cases.length - 1 : useCaseCurrent.value - 1 }
function useCaseNext() { useCaseCurrent.value = useCaseCurrent.value === cases.length - 1 ? 0 : useCaseCurrent.value + 1 }
function useCaseGoTo(index) { useCaseCurrent.value = index }
function goTo(page) { currentPage.value = page }
function prevReview() { if (currentPage.value > 0) currentPage.value-- }
function nextReview() { if (currentPage.value < totalPages.value - 1) currentPage.value++ }
</script>

<template>
  <AppHeader transparent />
  <main>
    <section class="hero fade-in" :style="{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${heroBg})` }">
      <div class="container">
        <div class="hero__content">
          <div class="hero__text">
            <h1 class="hero__title">Matryon OS</h1>
            <p class="hero__subtitle">Добро пожаловать в будущее, где технологии делают жизнь проще, комфортнее и безопаснее.</p>
          </div>
          <div class="hero__display">
            <div class="hero__display-box">
              <span class="hero__display-label">2.41"LED</span>
              <div class="hero__display-info">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_4043_206)">
                    <path d="M0 21.973V30.639C0 31.316 0.549 31.864 1.226 31.864H9.89C10.568 31.864 11.116 31.316 11.116 30.639C11.116 29.961 10.568 29.413 9.89 29.413H4.185L14.075 19.522C14.554 19.043 14.554 18.267 14.075 17.789C13.835 17.55 13.522 17.431 13.209 17.431C12.895 17.431 12.582 17.55 12.342 17.789L2.452 27.681V21.973C2.452 21.297 1.904 20.748 1.226 20.748C0.549 20.748 0 21.297 0 21.973ZM27.814 2.58799H22.109C21.431 2.58799 20.884 2.03899 20.884 1.36199C20.884 0.684986 21.431 0.135986 22.109 0.135986H30.774C31.451 0.136986 32 0.685986 32 1.36199V10.027C32 10.704 31.451 11.252 30.774 11.252C30.096 11.252 29.548 10.704 29.548 10.027V4.32199L19.522 14.347C19.042 14.825 18.267 14.825 17.789 14.347C17.31 13.868 17.31 13.094 17.789 12.615L27.814 2.58799Z" fill="white"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_4043_206">
                      <rect width="32" height="32" fill="white" transform="matrix(-1 0 0 1 32 0)"/>
                    </clipPath>
                  </defs>
                </svg>
                <span class="hero__display-text">ИНТЕЛЛЕКТУАЛЬНЫЙ ДИСПЛЕЙ ПРЯМО В ЦЕНТРЕ МАТРЕШКИ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="about fade-in">
      <div class="container">
        <div class="about__header">
          <div class="about__header-left">
            <span class="section-label">// О МАТРЕШКЕ</span>
            <p class="about__quote">"создана в россии, понятно во всем мире"</p>
          </div>
          <p class="about__description">Мультифункциональная умная колонка в культовом стиле. Все модули объединены в одну систему, управляемую голосом и касанием</p>
        </div>
        <div class="about__stats">
          <div class="about__stat">
            <span class="about__stat-number">15</span>
            <span class="about__stat-label">функций</span>
          </div>
          <div class="about__stat">
            <span class="about__stat-number">3</span>
            <span class="about__stat-label">девайса</span>
          </div>
          <div class="about__stat">
            <span class="about__stat-number">17</span>
            <span class="about__stat-label">раскрасок</span>
          </div>
        </div>
      </div>
    </section>

    <section class="popular fade-in">
      <div class="container">
        <p class="popular__intro">Самые популярные умные колонки, помогающие настроить твой день на успех</p>
        <span class="section-label">// ПОПУЛЯРНЫЕ</span>
        <div class="popular__grid">
          <router-link v-for="(product, index) in popularProducts" :key="index" :to="'/product/' + product.productId" class="popular__link">
            <ProductCard :name="product.name" :description="product.description" :image="product.image" />
          </router-link>
        </div>
      </div>
    </section>

    <section class="usecases fade-in">
      <div class="container">
        <p class="usecases__intro">Культурное наследие и умные решения в одном устройстве</p>
        <p class="usecases__sub">Выбирайте атмосферу в которой будете работать в Matryon</p>
        <span class="section-label">// НАЙДИ СВОЁ ПРИМЕНЕНИЕ</span>
          <div class="usecases__slider">
            <TransitionGroup name="usecase" tag="div" class="usecases__track">
              <div v-for="(item, index) in visibleCases" :key="item.title" :class="['usecases__card', `usecases__card--${item.pos}`]" :style="{ backgroundImage: `url(${item.img})` }">
                <div class="usecases__card-title">{{ item.title }}</div>
              </div>
            </TransitionGroup>
          <button class="usecases__arrow usecases__arrow--prev" @click="useCasePrev">
            <svg width="35" height="15" viewBox="0 0 35 15" fill="none"><path d="M0.29282 6.65666C-0.097702 7.04719 -0.097702 7.68035 0.29282 8.07088L6.65678 14.4348C7.04731 14.8254 7.68047 14.8254 8.071 14.4348C8.46152 14.0443 8.46152 13.4111 8.071 13.0206L2.41414 7.36377L8.071 1.70692C8.46152 1.31639 8.46152 0.683226 8.071 0.292702C7.68047 -0.0978227 7.04731 -0.0978227 6.65678 0.292702L0.29282 6.65666ZM34.6709 7.36377V6.36377L0.999928 6.36377V7.36377V8.36377L34.6709 8.36377V7.36377Z" fill="#040404"/></svg>
          </button>
          <button class="usecases__arrow usecases__arrow--next" @click="useCaseNext">
            <svg width="35" height="15" viewBox="0 0 35 15" fill="none"><path d="M34.3781 8.07088C34.7686 7.68035 34.7686 7.04719 34.3781 6.65666L28.0141 0.292702C27.6236 -0.0978227 26.9904 -0.0978227 26.5999 0.292702C26.2094 0.683226 26.2094 1.31639 26.5999 1.70692L32.2568 7.36377L26.5999 13.0206C26.2094 13.4111 26.2094 14.0443 26.5999 14.4348C26.9904 14.8254 27.6236 14.8254 28.0141 14.4348L34.3781 8.07088ZM0 7.36377L0 8.36377H33.671V7.36377V6.36377H0L0 7.36377Z" fill="#040404"/></svg>
          </button>
          <div class="usecases__dots">
            <button v-for="(_, index) in cases" :key="index" :class="['usecases__dot', { 'usecases__dot--active': useCaseCurrent === index }]" @click="useCaseGoTo(index)" />
          </div>
        </div>
      </div>
    </section>

    <section class="features fade-in">
      <div class="container">
        <div v-for="(feature, index) in features" :key="index" class="features__item">
          <span class="features__number">{{ feature.number }}</span>
          <div class="features__content">
            <div class="features__icon" v-html="alarmSvg"></div>
            <div class="features__text">
              <h3 class="features__title">{{ feature.title }}</h3>
              <p class="features__desc">{{ feature.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="reviews fade-in">
      <div class="container">
        <div class="reviews__header">
          <span class="section-label">// ИЗУЧАЙ ОТЗЫВЫ</span>
          <h2 class="reviews__title">ЧИТАЙТЕ И ДЕЛИТЕСЬ СВОИМИ ЭМОЦИЯМИ ОТ УМНОЙ КОЛОНКИ MATRYON</h2>
        </div>
        <div class="reviews__grid">
          <Transition name="review">
            <div :key="currentPage" class="reviews__page">
              <div v-for="(review, index) in visibleReviews" :key="index" class="reviews__card">
                <div class="reviews__author">
                  <div class="reviews__author-info">
                    <span class="reviews__author-name">{{ review.name }}</span>
                    <span class="reviews__author-model">{{ review.model }}</span>
                  </div>
                  <div class="reviews__avatar"><span class="reviews__avatar-letter">{{ review.name.charAt(0) }}</span></div>
                </div>
                <p class="reviews__text">{{ review.text }}</p>
              </div>
            </div>
          </Transition>
        </div>
        <div class="reviews__nav">
          <div class="reviews__nav-controls">
            <button class="reviews__arrow" :disabled="currentPage === 0" @click="prevReview">
              <svg width="35" height="15" viewBox="0 0 35 15" fill="none"><path d="M0.29282 6.65666C-0.097702 7.04719 -0.097702 7.68035 0.29282 8.07088L6.65678 14.4348C7.04731 14.8254 7.68047 14.8254 8.071 14.4348C8.46152 14.0443 8.46152 13.4111 8.071 13.0206L2.41414 7.36377L8.071 1.70692C8.46152 1.31639 8.46152 0.683226 8.071 0.292702C7.68047 -0.0978227 7.04731 -0.0978227 6.65678 0.292702L0.29282 6.65666ZM34.6709 7.36377V6.36377L0.999928 6.36377V7.36377V8.36377L34.6709 8.36377V7.36377Z" fill="currentColor"/></svg>
            </button>
            <div class="reviews__dots">
              <button v-for="page in totalPages" :key="page" :class="['reviews__dot', { active: currentPage === page - 1 }]" @click="goTo(page - 1)">
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none"><circle cx="25" cy="25" r="24.5" :stroke="currentPage === page - 1 ? 'white' : '#040404'" :fill="currentPage === page - 1 ? '#040404' : 'none'"/></svg>
              </button>
            </div>
            <button class="reviews__arrow" :disabled="currentPage === totalPages - 1" @click="nextReview">
              <svg width="35" height="15" viewBox="0 0 35 15" fill="none"><path d="M34.3781 8.07088C34.7686 7.68035 34.7686 7.04719 34.3781 6.65666L28.0141 0.292702C27.6236 -0.0978227 26.9904 -0.0978227 26.5999 0.292702C26.2094 0.683226 26.2094 1.31639 26.5999 1.70692L32.2568 7.36377L26.5999 13.0206C26.2094 13.4111 26.2094 14.0443 26.5999 14.4348C26.9904 14.8254 27.6236 14.8254 28.0141 14.4348L34.3781 8.07088ZM0 7.36377L0 8.36377H33.671V7.36377V6.36377H0L0 7.36377Z" fill="currentColor"/></svg>
            </button>
          </div>
          <button class="reviews__leave-btn" @click="openReviewModal">{{ user ? 'ОСТАВИТЬ ОТЗЫВ' : 'ВОЙТИ, ЧТОБЫ ОСТАВИТЬ ОТЗЫВ' }}</button>
        </div>
      </div>
    </section>

    <Teleport to="body">
      <div v-if="showReviewModal" class="modal-overlay" @click.self="showReviewModal = false">
        <div class="modal-card">
          <button class="modal-close" @click="showReviewModal = false">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="black" stroke-width="2" stroke-linecap="round"/></svg>
          </button>
          <h2 class="modal-title">ОСТАВИТЬ ОТЗЫВ</h2>
          <div class="modal-form">
            <div class="modal-field">
              <label>ВАШЕ ИМЯ</label>
              <input v-model="reviewName" type="text" placeholder="Иван Иванов" />
            </div>
            <div class="modal-field">
              <label>МОДЕЛЬ</label>
              <select v-model="reviewModel">
                <option value="" disabled>Выберите модель</option>
                <option v-for="m in productModels" :key="m" :value="m">{{ m }}</option>
              </select>
            </div>
            <div class="modal-field">
              <label>ОТЗЫВ</label>
              <textarea v-model="reviewText" placeholder="Напишите ваш отзыв..." rows="4"></textarea>
            </div>
            <p v-if="reviewError" class="modal-error">{{ reviewError }}</p>
            <button class="modal-submit" :disabled="reviewLoading" @click="submitReview">
              {{ reviewLoading ? 'ОТПРАВКА...' : 'ОТПРАВИТЬ' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </main>
  <AppFooter />
</template>

<style scoped>
.section-label {
  font-family: 'Roboto Mono', monospace;
  font-size: 20px;
  font-weight: 400;
  color: black;
  display: block;
}

.hero {
  padding: 100px 0 60px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: #fff;
  display: flex;
  flex-direction: column;
  min-height: 800px;
}
.hero .container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.hero__display-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: rgba(255, 255, 255, 0.3);
  padding: 20px 24px;
  border-radius: 12px;
}
.hero__content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 40px;
  margin-top: auto;
}
.hero__title {
  font-size: 96px;
  font-weight: 400;
  font-family: 'Onest', sans-serif;
  color: #fff;
  line-height: 1;
}
.hero__subtitle {
  font-size: 16px;
  color: #fff;
  max-width: 400px;
  margin-top: 20px;
  line-height: 1.5;
}
.hero__display {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.hero__display-label {
  font-size: 96px;
  font-family: 'Onest', sans-serif;
  font-weight: 400;
  color: white;
}
.hero__display-info {
  display: flex;
  align-items: center;
  gap: 16px;
  max-width: 335px;
}
.hero__display-text {
  font-family: 'Roboto Mono', monospace;
  font-size: 20px;
  font-weight: 500;
  text-transform: uppercase;
  color: white;
}

.about {
  padding: 80px 0;
}
.about__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 60px;
}
.about__quote {
  font-family: 'Roboto Mono', monospace;
  font-size: 24px;
  font-weight: 500;
  text-transform: uppercase;
  color: black;
  max-width: 304px;
  margin-top: 16px;
}
.about__description {
  font-size: 48px;
  font-family: 'Onest', sans-serif;
  font-weight: 500;
  line-height: 1.3;
  color: #040404;
  max-width: 700px;
}
.about__stats {
  display: flex;
  gap: 24px;
  margin-top: 60px;
  justify-content: center;
}
.about__stat {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 16px;
  width: 584px;
  transition: transform 0.3s ease;
}
.about__stat:hover { transform: translateY(-8px); }
.about__stat-number {
  font-size: 400px;
  font-family: 'Onest', sans-serif;
  font-weight: 500;
  text-transform: uppercase;
  color: black;
  line-height: 0.8;
}
.about__stat-label {
  font-family: 'Roboto Mono', monospace;
  font-size: 24px;
  font-weight: 500;
  text-transform: uppercase;
  color: black;
  white-space: nowrap;
}

.popular {
  padding: 80px 0;
}
.popular__intro {
  font-size: 24px;
  color: #040404;
  max-width: 600px;
  margin-bottom: 40px;
}
.popular__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  margin-top: 40px;
}
.popular .section-label { margin-top: 40px; }
.popular__link {
  display: block;
  text-decoration: none;
  color: inherit;
}

.usecases {
  padding: 80px 0;
}
.usecases__intro {
  font-size: 24px;
  color: #040404;
  margin-bottom: 12px;
}
.usecases__sub {
  font-size: 16px;
  color: rgba(0,0,0,0.7);
  margin-bottom: 40px;
}
.usecases .section-label { margin-top: 40px; }
.usecases__slider {
  position: relative;
  overflow: hidden;
  margin-top: 40px;
}
.usecases__track {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.usecases__card {
  height: 500px;
  border-radius: 20px;
  display: flex;
  align-items: flex-end;
  background-size: cover;
  background-position: center;
  background-color: #333;
  overflow: hidden;
  transition: transform 0.4s ease, opacity 0.4s ease, filter 0.4s ease, flex 0.4s ease;
}
.usecases__card--center {
  flex: 0 0 50%;
  transform: scale(1.05);
  opacity: 1;
  filter: none;
}
.usecases__card--side {
  flex: 0 0 20%;
  transform: scale(0.95);
  opacity: 0.4;
  filter: blur(2px);
}
.usecases__card-title {
  font-size: 48px;
  font-family: 'Onest', sans-serif;
  font-weight: 500;
  line-height: 52.8px;
  color: white;
  padding: 24px;
}
.usecase-move { transition: transform 0.5s ease; }
.usecase-enter-active { transition: opacity 0.4s ease, transform 0.4s ease; }
.usecase-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; position: absolute; }
.usecase-enter-from { opacity: 0; transform: scale(0.8) translateX(40px); }
.usecase-leave-to { opacity: 0; transform: scale(0.8) translateX(-40px); }
.usecases__arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.8);
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
}
.usecases__arrow--prev { left: 16px; }
.usecases__arrow--next { right: 16px; }
.usecases__dots {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 24px;
}
.usecases__dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ccc;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}
.usecases__dot--active { background: #040404; }

.features {
  padding: 80px 0;
}
.features__item {
  display: flex;
  flex-direction: column;
  gap: 100px;
  margin-bottom: 80px;
  transition: transform 0.3s ease;
}
.features__item:hover { transform: translateX(8px); }
.features__number {
  font-family: 'Roboto Mono', monospace;
  font-size: 20px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.7);
}
.features__content {
  display: flex;
  gap: 60px;
  align-items: flex-start;
}
.features__icon {
  width: 230px;
  height: 230px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.features__text {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.features__title {
  font-size: 48px;
  font-family: 'Onest', sans-serif;
  font-weight: 500;
  line-height: 52.8px;
  color: #040404;
}
.features__desc {
  font-family: 'Roboto Mono', monospace;
  font-size: 20px;
  font-weight: 400;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.7);
}

.reviews {
  padding: 80px 0;
}
.reviews__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 40px;
}
.reviews__title {
  font-size: 64px;
  font-family: 'Onest', sans-serif;
  font-weight: 500;
  line-height: 70.4px;
  color: #040404;
  max-width: 887px;
}
.reviews__leave-btn {
  flex-shrink: 0;
  font-family: 'Roboto Mono', monospace;
  font-size: 16px;
  font-weight: 500;
  text-transform: uppercase;
  color: white;
  background: #040404;
  border: none;
  border-radius: 100px;
  padding: 16px 32px;
  cursor: pointer;
  transition: opacity 0.2s ease;
  position: absolute;
  right: 0;
}
.reviews__leave-btn:hover { opacity: 0.7; }
.reviews__grid {
  position: relative;
  margin-top: 60px;
  min-height: 360px;
}
.reviews__page {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  width: 100%;
}
.review-enter-active,
.review-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
}
.review-enter-from { opacity: 0; transform: translateX(40px); }
.review-leave-active { opacity: 1; }
.review-leave-to { opacity: 0; transform: translateX(-40px); }
.reviews__card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  padding: 16px;
  border-radius: 12px;
}
.reviews__card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.06);
}
.reviews__author {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid rgba(4, 4, 4, 0.7);
}
.reviews__author-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.reviews__author-name {
  font-size: 32px;
  font-family: 'Onest', sans-serif;
  font-weight: 500;
  line-height: 35.2px;
  color: #040404;
}
.reviews__author-model {
  font-size: 20px;
  font-family: 'Onest', sans-serif;
  font-weight: 500;
  color: #040404;
}
.reviews__avatar {
  width: 71px;
  height: 71px;
  border-radius: 50%;
  background: #040404;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.reviews__avatar-letter {
  font-family: 'Onest', sans-serif;
  font-size: 28px;
  font-weight: 500;
  color: white;
  line-height: 1;
}
.reviews__text {
  font-family: 'Roboto Mono', monospace;
  font-size: 20px;
  font-weight: 400;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.7);
}
.reviews__nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 60px;
  position: relative;
}
.reviews__nav-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}
.reviews__arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 2px solid #040404;
  background: transparent;
  color: #040404;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}
.reviews__arrow:hover:not(:disabled) {
  background: #040404;
  color: white;
  border-color: #040404;
}
.reviews__arrow:disabled { opacity: 0.3; cursor: default; }
.reviews__dots { display: flex; gap: 9px; }
.reviews__dot {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  line-height: 0;
  transition: transform 0.2s ease;
}
.reviews__dot:hover { transform: scale(1.1); }
.reviews__dot svg { display: block; }

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
  margin-bottom: 32px;
}
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.modal-field label {
  display: block;
  font-family: 'Roboto Mono', monospace;
  font-size: 14px;
  font-weight: 400;
  color: rgba(0,0,0,0.7);
  margin-bottom: 6px;
}
.modal-field input,
.modal-field select,
.modal-field textarea {
  width: 100%;
  padding: 12px 16px;
  background: #E7E7E7;
  border: none;
  border-radius: 3px;
  font-family: 'Roboto Mono', monospace;
  font-size: 16px;
  color: #040404;
  outline: none;
}
.modal-field textarea {
  resize: vertical;
  min-height: 100px;
}
.modal-field select {
  appearance: auto;
}
.modal-error {
  font-family: 'Roboto Mono', monospace;
  font-size: 14px;
  color: #d32f2f;
}
.modal-submit {
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
  margin-top: 8px;
}
.modal-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 1200px) {
  .about__stat {
    width: 100%;
    max-width: 400px;
  }
  .about__stat-number {
    font-size: 200px;
  }
}

@media (max-width: 768px) {
  .hero__content { flex-direction: column; }
  .hero__title { font-size: 48px; }
  .hero__display-label { font-size: 48px; }
  .about__stats { flex-direction: column; }
  .about__stat-number { font-size: 120px; }
  .about__header { flex-direction: column; gap: 20px; }
  .about__description { font-size: 32px; line-height: 1.3; }
  .about__stat { width: 100%; }
  .popular__grid { grid-template-columns: 1fr; }
  .usecases__card { height: 300px; }
  .usecases__card--center { flex: 0 0 50%; }
  .usecases__card--side { flex: 0 0 18%; transform: scale(0.95); opacity: 0.3; filter: blur(1px); }
  .usecases__card-title { font-size: 32px; }
  .features__content { flex-direction: column; }
  .features__title { font-size: 28px; line-height: 1.2; }
  .reviews__grid { grid-template-columns: 1fr; }
  .reviews__title { font-size: 32px; line-height: 1.2; }
  .reviews__header { flex-direction: column; }
  .hero { padding: 70px 0 40px; min-height: 600px; }
  .hero__display-box { padding: 16px 20px; }
  .features__item { gap: 40px; margin-bottom: 40px; }
  .features__icon { width: 120px; height: 120px; }
  .reviews__nav { margin-top: 40px; flex-direction: column; gap: 24px; }
  .reviews__leave-btn { width: 100%; text-align: center; position: static; }
  .reviews__author-name { font-size: 24px; }
  .reviews__text { font-size: 16px; }
  .popular, .about, .usecases, .features, .reviews { padding: 40px 0; }
}

@media (max-width: 480px) {
  .hero { padding: 60px 0 30px; min-height: 450px; }
  .hero__title { font-size: 36px; }
  .hero__display-box { padding: 12px 16px; }
  .hero__display-label { font-size: 36px; }
  .hero__subtitle { font-size: 14px; }
  .hero__display-text { font-size: 14px; }
  .about__description { font-size: 24px; line-height: 1.3; }
  .about__stat-number { font-size: 80px; }
  .about__stat-label { font-size: 18px; }
  .about__quote { font-size: 18px; }
  .popular__intro { font-size: 20px; }
  .usecases__intro { font-size: 20px; }
  .usecases__card { height: 220px; }
  .usecases__card--side { transform: scale(0.9); opacity: 0.3; filter: blur(1px); }
  .usecases__card-title { font-size: 28px; line-height: 1.2; }
  .usecases__arrow { width: 36px; height: 36px; }
  .usecases__arrow svg { width: 24px; height: 12px; }
  .features__title { font-size: 24px; line-height: 1.3; }
  .features__desc { font-size: 16px; }
  .features__content { gap: 24px; }
  .reviews__title { font-size: 24px; line-height: 1.3; }
  .reviews__leave-btn { width: 100%; text-align: center; font-size: 14px; padding: 14px 24px; position: static; }
  .reviews__author-name { font-size: 20px; line-height: 1.2; }
  .reviews__author-model { font-size: 14px; }
  .reviews__text { font-size: 13px; }
  .reviews__arrow { width: 44px; height: 44px; }
  .reviews__arrow svg { width: 24px; height: 12px; }
  .reviews__dot svg { width: 36px; height: 36px; }
  .section-label { font-size: 16px; }
}
</style>
