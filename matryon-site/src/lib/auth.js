import { ref } from 'vue'
import { getSupabase } from './supabase.js'

const user = ref(null)
const initialized = ref(false)

function extractTokensFromHash() {
  const hash = window.location.hash
  const cleaned = hash.replace(/^#\/?/, '')
  if (!cleaned.includes('access_token=')) return null
  const params = new URLSearchParams(cleaned)
  return {
    accessToken: params.get('access_token'),
    refreshToken: params.get('refresh_token')
  }
}

export function useAuth() {
  const supabase = getSupabase()

  async function init() {
    if (initialized.value || !supabase) return false
    initialized.value = true

    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null
    })

    const tokens = extractTokensFromHash()
    if (tokens?.accessToken) {
      try {
        await supabase.auth.setSession({
          access_token: tokens.accessToken,
          refresh_token: tokens.refreshToken || ''
        })
      } catch (e) {
        console.warn('Session recovery failed:', e)
      }
      return true
    }

    const { data: { session } } = await supabase.auth.getSession()
    user.value = session?.user ?? null
    return false
  }

  async function signOut() {
    if (!supabase) return
    await supabase.auth.signOut()
  }

  return { user, init, signOut }
}
