<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import logoSvg from '../assets/icons/logo.svg'
import { useAuth } from '../lib/auth.js'
import { useCart } from '../lib/cart.js'

defineProps({
  transparent: Boolean
})

const { user, signOut } = useAuth()
const { totalItems, load } = useCart()

const menuOpen = ref(false)

onMounted(() => {
  if (user.value) load()
})

watch(user, (val) => {
  if (val) load()
})
const userLabel = computed(() => {
  const meta = user.value?.user_metadata
  return meta?.full_name || user.value?.email || ''
})

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function closeMenu() {
  menuOpen.value = false
}

async function handleSignOut() {
  await signOut()
  closeMenu()
}
</script>

<template>
  <header :class="['header', { 'header--transparent': transparent }]">
    <div class="container header__inner">
      <div class="header__left">
        <router-link to="/" @click="closeMenu" class="header__logo">
          <img :src="logoSvg" alt="Matryon" width="25" height="23" />
        </router-link>
        <router-link to="/order" class="header__order" @click="closeMenu">
          <span>заказать</span>
          <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M25.3704 16.9097H18.0903V9.62963C18.0903 9.28196 17.8477 9 17.5 9C17.1523 9 16.9097 9.28196 16.9097 9.62963V16.9097H9.62963C9.28196 16.9097 9 17.1523 9 17.5C9 17.8477 9.28196 18.0903 9.62963 18.0903H16.9097V25.3704C16.9097 25.718 17.1523 26 17.5 26C17.8477 26 18.0903 25.718 18.0903 25.3704V18.0903H25.3704C25.718 18.0903 26 17.8477 26 17.5C26 17.1523 25.718 16.9097 25.3704 16.9097Z" :fill="transparent ? 'white' : 'black'"/>
          </svg>
        </router-link>
      </div>

      <div class="header__right">
        <router-link to="/cart" class="header__cart" @click="closeMenu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0020 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" :fill="transparent ? 'white' : 'black'"/>
          </svg>
          <span v-if="totalItems > 0" class="header__cart-badge">{{ totalItems > 99 ? '99+' : totalItems }}</span>
        </router-link>
        <div class="header__menu-btn" @click="toggleMenu">
          <svg width="20" height="20" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24.1803 10H5.81967C5.60228 10 5.39379 9.89464 5.24008 9.70711C5.08636 9.51957 5 9.26522 5 9C5 8.73478 5.08636 8.48043 5.24008 8.29289C5.39379 8.10536 5.60228 8 5.81967 8H24.1803C24.3977 8 24.6062 8.10536 24.7599 8.29289C24.9136 8.48043 25 8.73478 25 9C25 9.26522 24.9136 9.51957 24.7599 9.70711C24.6062 9.89464 24.3977 10 24.1803 10Z" :fill="transparent ? 'white' : 'black'"/>
            <path d="M24.1803 16H5.81967C5.60228 16 5.39379 15.8946 5.24008 15.7071C5.08636 15.5196 5 15.2652 5 15C5 14.7348 5.08636 14.4804 5.24008 14.2929C5.39379 14.1054 5.60228 14 5.81967 14H24.1803C24.3977 14 24.6062 14.1054 24.7599 14.2929C24.9136 14.4804 25 14.7348 25 15C25 15.2652 24.9136 15.5196 24.7599 15.7071C24.6062 15.8946 24.3977 16 24.1803 16Z" :fill="transparent ? 'white' : 'black'"/>
            <path d="M24.1803 22H5.81967C5.60228 22 5.39379 21.8946 5.24008 21.7071C5.08636 21.5196 5 21.2652 5 21C5 20.7348 5.08636 20.4804 5.24008 20.2929C5.39379 20.1054 5.60228 20 5.81967 20H24.1803C24.3977 20 24.6062 20.1054 24.7599 20.2929C24.9136 20.4804 25 20.7348 25 21C25 21.2652 24.9136 21.5196 24.7599 21.7071C24.6062 21.8946 24.3977 22 24.1803 22Z" :fill="transparent ? 'white' : 'black'"/>
          </svg>
          <span>меню</span>
        </div>
      </div>
    </div>

    <Transition name="menu-fade">
      <div v-if="menuOpen" class="header__dropdown" @click.self="closeMenu">
        <nav class="header__dropdown-menu">
          <router-link to="/catalog" class="header__dropdown-link" @click="closeMenu">КАТАЛОГ</router-link>
          <template v-if="user">
            <span class="header__dropdown-user">{{ userLabel }}</span>
            <router-link to="/profile" class="header__dropdown-link" @click="closeMenu">ПРОФИЛЬ</router-link>
            <button class="header__dropdown-link header__dropdown-link--btn" @click="handleSignOut">ВЫЙТИ</button>
          </template>
          <template v-else>
            <router-link to="/login" class="header__dropdown-link" @click="closeMenu">ВХОД</router-link>
            <router-link to="/register" class="header__dropdown-link" @click="closeMenu">РЕГИСТРАЦИЯ</router-link>
          </template>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.header {
  padding: 20px 0;
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

.header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header__left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header__left a {
  text-decoration: none;
  color: inherit;
}

.header__order {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: 'Roboto Mono', monospace;
  font-size: 20px;
  font-weight: 400;
  text-transform: uppercase;
  color: black;
  text-decoration: none;
}

.header__right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header__menu-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: #9E9E9E;
  border-radius: 8px;
  transition: background 0.2s ease, transform 0.2s ease;
  cursor: pointer;
}

.header__menu-btn:hover {
  background: #7a7a7a;
  transform: scale(1.05);
}

.header__order {
  transition: opacity 0.2s ease;
}

.header__order:hover {
  opacity: 0.6;
}

.header__cart {
  position: relative;
  display: flex;
  align-items: center;
  padding: 8px;
  transition: opacity 0.2s;
  text-decoration: none;
}

.header__cart:hover {
  opacity: 0.6;
}

.header__cart-badge {
  position: absolute;
  top: 0;
  right: 0;
  min-width: 18px;
  height: 18px;
  background: #d32f2f;
  color: white;
  font-family: 'Onest', sans-serif;
  font-size: 11px;
  font-weight: 700;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
  line-height: 1;
}

.header__menu-btn span {
  font-family: 'Roboto Mono', monospace;
  font-size: 20px;
  font-weight: 400;
  text-transform: uppercase;
  color: black;
}

.header__dropdown {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.3);
  z-index: 100;
  display: flex;
  justify-content: flex-end;
}

.header__dropdown-menu {
  width: 300px;
  height: 100%;
  background: #D9D9D9;
  padding: 100px 40px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.header__dropdown-link {
  font-family: 'Roboto Mono', monospace;
  font-size: 24px;
  font-weight: 400;
  text-transform: uppercase;
  color: black;
  text-decoration: none;
  padding: 12px 0;
  border-bottom: 1px solid rgba(0,0,0,0.1);
  transition: opacity 0.2s ease;
}

.header__dropdown-link:hover {
  opacity: 0.6;
}

.header__dropdown-link--btn {
  background: none;
  border: none;
  text-align: left;
  font-size: 24px;
  cursor: pointer;
}

.header__dropdown-user {
  font-family: 'Roboto Mono', monospace;
  font-size: 18px;
  font-weight: 400;
  color: rgba(0,0,0,0.5);
  padding: 8px 0;
  border-bottom: 1px solid rgba(0,0,0,0.1);
}

.header--transparent {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
  background: transparent;
  border-bottom: none;
}

.header--transparent .header__order {
  color: white;
}

.header--transparent .header__menu-btn span {
  color: white;
}

.header--transparent .header__cart svg {
  color: white;
}

.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: opacity 0.25s ease;
}

.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .header__menu-btn span {
    display: none;
  }
  .header__order span {
    display: none;
  }
  .header__dropdown-menu {
    width: 100vw;
    padding: 80px 24px;
  }
  .header__dropdown-link {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .header {
    padding: 12px 0;
  }
  .header__order {
    font-size: 16px;
  }
  .header__menu-btn {
    padding: 8px 10px;
  }
}
</style>
