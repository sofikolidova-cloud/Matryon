import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index.js'

const hash = window.location.hash.replace(/^#\/?/, '')
if (hash.includes('access_token=')) {
  const params = new URLSearchParams(hash)
  window.__authTokens = {
    accessToken: params.get('access_token'),
    refreshToken: params.get('refresh_token')
  }
  history.replaceState(null, '', '/#/')
}

createApp(App).use(router).mount('#app')
