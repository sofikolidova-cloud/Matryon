import { getSupabase } from './supabase.js'
import sp1 from '/src/assets/images/matreshka_1.webp'
import sp2 from '/src/assets/images/matreshka_2.webp'
import sp3 from '/src/assets/images/matreshka_3.webp'
import sp4 from '/src/assets/images/matreshka_4.webp'
import sp5 from '/src/assets/images/matreshka_5.webp'
import sp6 from '/src/assets/images/matreshka_6.webp'
import sp7 from '/src/assets/images/matreshka_7.webp'
import sp8 from '/src/assets/images/matreshka_8.webp'

import l1 from '/src/assets/images/lampochka_1.webp'
import l2 from '/src/assets/images/lampochka_2.webp'
import l3 from '/src/assets/images/lampochka_3.webp'
import l4 from '/src/assets/images/lampochka_4.webp'
import l5 from '/src/assets/images/lampochka_5.webp'
import l6 from '/src/assets/images/lampochka_6.webp'

import r1 from '/src/assets/images/rozetka_1.webp'
import r2 from '/src/assets/images/rozetka_2.webp'
import r3 from '/src/assets/images/rozetka_3.webp'

const productImages = {
  'sp-base': sp1, 'sp-light': sp2, 'sp-pro': sp3, 'sp-mini': sp4,
  'sp-air': sp5, 'sp-max': sp6, 'sp-home': sp7, 'sp-duo': sp8,
  'lp-one': l1, 'lp-duo': l2, 'lp-color': l3, 'lp-smart': l4,
  'lp-dim': l5, 'lp-pro': l6,
  'rz-smart': r1, 'rz-pro': r2, 'rz-mini': r3
}

const fallbackProducts = [
  { id: 'sp-base', type: 'speaker', name: 'Matryon Base', desc: 'СОЗДАНА ДЛЯ ТЕХ, КТО ЦЕНИТ БАЛАНС МЕЖДУ ТЕХНОЛОГИЙ И ТИШИНОЙ', price: '15 690', specs: { display: '1.7"', memory: '4 ГБ', speaker: '60 Вт' } },
  { id: 'sp-light', type: 'speaker', name: 'Matryon Light', desc: 'СОЗДАНА ДЛЯ ТЕХ, КТО ЦЕНИТ СВЕТ И АТМОСФЕРУ КАЖДЫЙ ДЕНЬ', price: '16 490', specs: { display: '1.7"', memory: '4 ГБ', speaker: '60 Вт' } },
  { id: 'sp-pro', type: 'speaker', name: 'Matryon Pro', desc: 'СОЗДАНА ДЛЯ ТЕХ, КТО СТРЕМИТСЯ К ПРОФЕССИОНАЛЬНОМУ ЗВУЧАНИЮ', price: '22 890', specs: { display: '2.1"', memory: '8 ГБ', speaker: '65 Вт' } },
  { id: 'sp-mini', type: 'speaker', name: 'Matryon Mini', desc: 'СОЗДАНА ДЛЯ ТЕХ, КТО ЦЕНИТ КОМПАКТНОСТЬ И СТИЛЬ', price: '12 490', specs: { display: '1.7"', memory: '4 ГБ', speaker: '60 Вт' } },
  { id: 'sp-air', type: 'speaker', name: 'Matryon Air', desc: 'СОЗДАНА ДЛЯ ТЕХ, КТО ВСЕГДА В ДВИЖЕНИИ И ЛЮБИТ МУЗЫКУ', price: '18 690', specs: { display: '1.7"', memory: '8 ГБ', speaker: '60 Вт' } },
  { id: 'sp-max', type: 'speaker', name: 'Matryon Max', desc: 'СОЗДАНА ДЛЯ ТЕХ, КТО ХОЧЕТ МАКСИМУМА ОТ КАЖДОГО МОМЕНТА', price: '28 990', specs: { display: '2.8"', memory: '16 ГБ', speaker: '65 Вт' } },
  { id: 'sp-home', type: 'speaker', name: 'Matryon Home', desc: 'СОЗДАНА ДЛЯ ТЕХ, КТО ПРЕВРАЩАЕТ ДОМ В МЕСТО СИЛЫ', price: '20 890', specs: { display: '2.1"', memory: '8 ГБ', speaker: '60 Вт' } },
  { id: 'sp-duo', type: 'speaker', name: 'Matryon Duo', desc: 'СОЗДАНА ДЛЯ ТЕХ, КТО ИЩЕТ ГАРМОНИЮ В КАЖДОЙ ДЕТАЛИ', price: '24 590', specs: { display: '2.1"', memory: '16 ГБ', speaker: '65 Вт' } },
  { id: 'lp-one', type: 'lamp', name: 'Lampochka One', desc: 'МЯГКИЙ СВЕТ ДЛЯ УЮТНЫХ ВЕЧЕРОВ И РАССЛАБЛЯЮЩЕЙ АТМОСФЕРЫ', price: '8 990', serial: 'MAT-LP-1001' },
  { id: 'lp-duo', type: 'lamp', name: 'Lampochka Duo', desc: 'ДВА РЕЖИМА ОСВЕЩЕНИЯ ДЛЯ ЛЮБЫХ ЗАДАЧ И НАСТРОЕНИЯ', price: '11 490', serial: 'MAT-LP-2001' },
  { id: 'lp-color', type: 'lamp', name: 'Lampochka Color', desc: '16 МИЛЛИОНОВ ЦВЕТОВ ДЛЯ ТВОЕГО ИДЕАЛЬНОГО ИНТЕРЬЕРА', price: '13 990', serial: 'MAT-LP-3001' },
  { id: 'lp-smart', type: 'lamp', name: 'Lampochka Smart', desc: 'УПРАВЛЕНИЕ С ГОЛОСА И СМАРТФОНА ДЛЯ МАКСИМАЛЬНОГО КОМФОРТА', price: '15 490', serial: 'MAT-LP-4001' },
  { id: 'lp-dim', type: 'lamp', name: 'Lampochka Dim', desc: 'ПЛАВНАЯ РЕГУЛИРОВКА ЯРКОСТИ ОТ РАССВЕТА ДО ЗАКАТА', price: '9 990', serial: 'MAT-LP-5001' },
  { id: 'lp-pro', type: 'lamp', name: 'Lampochka Pro', desc: 'ПРОФЕССИОНАЛЬНОЕ ОСВЕЩЕНИЕ ДЛЯ РАБОТЫ И ТВОРЧЕСТВА', price: '18 490', serial: 'MAT-LP-6001' },
  { id: 'rz-smart', type: 'socket', name: 'Rozetka Smart', desc: 'УМНАЯ РОЗЕТКА С ГОЛОСОВЫМ УПРАВЛЕНИЕМ И ТАЙМЕРОМ', price: '4 990', serial: '2025-24' },
  { id: 'rz-pro', type: 'socket', name: 'Rozetka Pro', desc: 'РОЗЕТКА С ЗАЩИТОЙ ОТ ПЕРЕГРУЗОК И ДИСТАНЦИОННЫМ УПРАВЛЕНИЕМ', price: '5 990', serial: '2025-25' },
  { id: 'rz-mini', type: 'socket', name: 'Rozetka Mini', desc: 'КОМПАКТНАЯ РОЗЕТКА ДЛЯ НЕЗАМЕТНОЙ ИНТЕГРАЦИИ В ИНТЕРЬЕР', price: '3 990', serial: '2025-26' }
]

let cachedProducts = null

function attachImages(items) {
  return items.map(p => ({ ...p, image: p.image || productImages[p.id] || null }))
}

function getFallback() {
  return attachImages(fallbackProducts)
}

export async function fetchProducts() {
  if (cachedProducts) return cachedProducts
  const supabase = getSupabase()
  if (!supabase) return getFallback()
  try {
    const { data } = await supabase.from('products').select('*')
    if (data?.length) {
      cachedProducts = attachImages(data)
      return cachedProducts
    }
  } catch (e) {
    console.warn('Failed to fetch products from Supabase:', e)
  }
  return getFallback()
}

export async function fetchProductById(id) {
  const all = cachedProducts || await fetchProducts()
  return all.find(p => p.id === id) || null
}

export async function fetchProductsByType(type) {
  const all = cachedProducts || await fetchProducts()
  return all.filter(p => p.type === type)
}

const productNamesMap = {
  'sp-base': 'Matryon Base', 'sp-light': 'Matryon Light', 'sp-pro': 'Matryon Pro',
  'sp-mini': 'Matryon Mini', 'sp-air': 'Matryon Air', 'sp-max': 'Matryon Max',
  'sp-home': 'Matryon Home', 'sp-duo': 'Matryon Duo',
  'lp-one': 'Lampochka One', 'lp-duo': 'Lampochka Duo', 'lp-color': 'Lampochka Color',
  'lp-smart': 'Lampochka Smart', 'lp-dim': 'Lampochka Dim', 'lp-pro': 'Lampochka Pro',
  'rz-smart': 'Rozetka Smart', 'rz-pro': 'Rozetka Pro', 'rz-mini': 'Rozetka Mini'
}

export function getProductIds() {
  return Object.keys(productImages)
}

export function getProductNames() {
  return Object.values(productNamesMap)
}

export function getProductNameById(id) {
  return productNamesMap[id] || id
}
