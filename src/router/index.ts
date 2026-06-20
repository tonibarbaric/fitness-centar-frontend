import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TreneriView from '../views/TreneriView.vue'
import ClanoviView from '../views/ClanoviView.vue'
import TreninziView from '../views/TreninziView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/treneri',
      name: 'treneri',
      component: TreneriView
    },
    {
      path: '/clanovi',
      name: 'clanovi',
      component: ClanoviView
    },
    {
      path: '/treninzi',
      name: 'treninzi',
      component: TreninziView
    }
  ]
})

export default router