import { createApp } from 'vue'
import App from './App.vue'
import './assets/css/main.css'
import i18n from './i18n'
import router from './router'
import dataCacheService from './services/dataCache.js'
import { lazyLoad } from './directives/lazyLoad.js'
import './utils/performance.js' // 性能监控

const app = createApp(App)
app.use(router)
app.use(i18n)
app.directive('lazy-load', lazyLoad)
app.mount('#app')

// 初始化数据缓存服务，预加载游戏数据
dataCacheService.initialize()