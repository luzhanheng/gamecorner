import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './assets/css/main.css'
import i18n from './i18n'

// 路由配置
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('./views/Home.vue')
    },
    {
      path: '/games',
      name: 'Games',
      component: () => import('./views/Games.vue')
    },
    {
      path: '/leaderboard',
      name: 'Leaderboard',
      component: () => import('./views/Leaderboard.vue')
    },
    {
      path: '/game/:id',
      name: 'GameDetail',
      component: () => import('./views/GameDetail.vue'),
      props: true
    }
  ]
})

const app = createApp(App)
app.use(router)
app.use(i18n)
app.mount('#app')