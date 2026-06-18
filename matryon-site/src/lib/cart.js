import { ref, computed } from 'vue'
import { getSupabase } from './supabase.js'
import { useAuth } from './auth.js'

const CART_STORAGE_KEY = 'matryon_cart'
const items = ref([])
const loaded = ref(false)

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      items.value = parsed
    }
  } catch (e) {}
}

function saveToStorage() {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items.value))
  } catch (e) {}
}

export function useCart() {
  const supabase = getSupabase()
  const { user } = useAuth()

  async function load() {
    if (!supabase || !user.value) {
      items.value = []
      loaded.value = false
      return
    }
    loadFromStorage()
    const { data } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.value.id)
      .order('created_at', { ascending: false })
    if (data) {
      items.value = data
      saveToStorage()
    }
    loaded.value = true
  }

  async function addItem(productId) {
    if (!supabase || !user.value) return
    const existing = items.value.find(i => i.product_id === productId)
    if (existing) {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + 1 })
        .eq('id', existing.id)
      if (!error) {
        existing.quantity++
        saveToStorage()
      }
    } else {
      const { data, error } = await supabase
        .from('cart_items')
        .insert({ user_id: user.value.id, product_id: productId, quantity: 1 })
        .select()
        .single()
      if (!error && data) {
        items.value.unshift(data)
        saveToStorage()
      }
    }
  }

  async function removeItem(itemId) {
    if (!supabase) return
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId)
    if (!error) {
      items.value = items.value.filter(i => i.id !== itemId)
      saveToStorage()
    }
  }

  async function updateQuantity(itemId, quantity) {
    if (!supabase || quantity < 1) return
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId)
    if (!error) {
      const item = items.value.find(i => i.id === itemId)
      if (item) item.quantity = quantity
      saveToStorage()
    }
  }

  async function clearCart() {
    if (!supabase || !user.value) return
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.value.id)
    if (!error) {
      items.value = []
      saveToStorage()
    }
  }

  const totalItems = computed(() => {
    return items.value.reduce((sum, i) => sum + i.quantity, 0)
  })

  return {
    items,
    loaded,
    totalItems,
    load,
    addItem,
    removeItem,
    updateQuantity,
    clearCart
  }
}
