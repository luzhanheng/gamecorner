import { createApp } from 'vue'
import App from './App.vue'
import './assets/css/main.css'
import i18n from './i18n'
import router from './router'
import dataCacheService from './services/dataCache.js'
import analyticsService from './services/analytics.js'
import { lazyLoad } from './directives/lazyLoad.js'
// 仅在开发环境加载性能监控
if (import.meta.env.DEV) {
  import('./utils/performance.js') // 性能监控
}

const app = createApp(App)
app.use(router)
app.use(i18n)
app.directive('lazy-load', lazyLoad)
app.mount('#app')

// 初始化数据缓存服务，预加载游戏数据
dataCacheService.initialize()

// 初始化访问量统计服务
analyticsService.initialize()

// 路由变化时记录页面访问
router.afterEach((to) => {
  analyticsService.trackPageView(to.name || to.path, {
    route: to.path,
    params: to.params,
    query: to.query
  })
})