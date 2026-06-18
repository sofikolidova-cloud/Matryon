<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from './lib/auth.js'
import { useNotification } from './lib/notification.js'

const router = useRouter()
const { init } = useAuth()
const { message, visible, hide } = useNotification()

onMounted(async () => {
  const recovered = await init()
  if (window.location.hash.includes('error=')) {
    router.replace('/')
    return
  }
  if (recovered) router.replace('/')
})
</script>

<template>
  <div class="app-wrap">
    <router-view v-slot="{ Component }">
      <Transition name="page">
        <component :is="Component" />
      </Transition>
    </router-view>
    <Transition name="toast">
      <div v-if="visible" class="toast" @click="hide">
        <span>{{ message }}</span>
      </div>
    </Transition>
  </div>
</template>

<style>
.app-wrap {
  min-height: 100vh;
  background: #fff;
}

.page-enter-active {
  transition: opacity 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.page-leave-active {
  transition: opacity 0.3s cubic-bezier(0.55, 0.085, 0.68, 0.53);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
}

.toast {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  background: #040404;
  color: white;
  padding: 16px 32px;
  border-radius: 12px;
  font-family: 'Onest', sans-serif;
  font-size: 16px;
  z-index: 9999;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}

.toast-enter-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.toast-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}
</style>
