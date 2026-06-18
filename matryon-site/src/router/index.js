import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomePage.vue')
  },
  {
    path: '/catalog',
    name: 'catalog',
    component: () => import('../views/CatalogPage.vue')
  },
  {
    path: '/auth',
    name: 'auth',
    component: () => import('../views/AuthPage.vue'),
    props: { initialTab: 'login' }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/AuthPage.vue'),
    props: { initialTab: 'login' }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/AuthPage.vue'),
    props: { initialTab: 'register' }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/ProfilePage.vue')
  },
  {
    path: '/admin/login',
    name: 'admin-login',
    component: () => import('../views/AdminLoginPage.vue')
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/AdminPage.vue')
  },
  {
    path: '/order',
    name: 'order',
    component: () => import('../views/CategorySelectionPage.vue')
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('../views/CartPage.vue')
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('../views/OrderPage.vue')
  },
  {
    path: '/product/:id',
    name: 'product',
    component: () => import('../views/ProductPage.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('../views/NotFoundPage.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
