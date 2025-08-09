import { createRouter, createWebHistory } from 'vue-router'

// Import components for each page
import Home from '../pages/Home.vue'
import IdleRand from '../pages/Idle_rand.vue'

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', component: Home },
  { path: '/idle_rand', component: IdleRand }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
