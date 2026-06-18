import { ref, computed } from 'vue'
import { getSupabase } from './supabase.js'
import { useAuth } from './auth.js'

const items = ref([])
const loaded = ref(false)

export function useCart() {
  const supabase = getSupabase()
  const { user } = useAuth()

  async function load() {
    if (!supabase || !user.value) {
      items.value = []
      loaded.value = false
      return
    }
    const { data } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.value.id)
      .order('created_at', { ascending: false })
    if (data) {
      items.value = data
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
      }
    } else {
      const { data, error } = await supabase
        .from('cart_items')
        .insert({ user_id: user.value.id, product_id: productId, quantity: 1 })
        .select()
        .single()
      if (!error && data) {
        items.value.unshift(data)
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
