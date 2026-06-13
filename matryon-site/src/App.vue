<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from './lib/auth.js'

const router = useRouter()
const { init } = useAuth()

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
</style>
