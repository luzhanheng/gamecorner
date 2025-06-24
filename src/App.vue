<template>
  <div class="min-h-screen">
    <!-- 加载组件 -->
    <LoadingSpinner 
      :show="isLoading" 
      :title="loadingTitle"
      :message="loadingMessage"
      :progress="loadingProgress"
      :show-progress="showProgress"
    />
    
    <header class="bg-gray-800 shadow-lg">
      <nav class="container mx-auto px-4 py-6 flex items-center justify-between">
        <h1 class="text-3xl font-game text-game-accent">Game Corner</h1>
        <div class="flex items-center space-x-4">
          <router-link to="/" class="btn-primary">{{ $t('nav.home') }}</router-link>
          
          <!-- 搜索功能 -->
          <div class="w-64">
            <div class="relative">
              <input 
                v-model="searchQuery"
                type="text" 
                :placeholder="$t('nav.search')"
                class="w-full px-4 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-game-accent focus:ring-1 focus:ring-game-accent"
                @keyup.enter="performSearch"
              >
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <button 
                @click="performSearch"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-game-accent hover:text-game-secondary transition-colors"
              >
                <span class="text-xs font-medium">{{ $t('games.search') }}</span>
              </button>
            </div>
          </div>
          
          <router-link to="/games" class="btn-primary whitespace-nowrap">{{ $t('nav.allGames') }}</router-link>
          <!-- <router-link to="/analytics" class="btn-primary whitespace-nowrap">访问统计</router-link>-->

           <!-- 语言切换按钮 -->
           <button 
             @click="toggleLanguage" 
             class="px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors duration-200"
             :title="locale === 'zh' ? 'Switch to English' : '切换到中文'"
           >
             {{ locale === 'zh' ? 'EN' : '中' }}
           </button>
          </div>
        </nav>
    </header>

    <main class="container mx-auto px-4 py-8">
      <router-view></router-view>
    </main>

    <footer class="bg-gray-800 py-6 mt-12">
      <div class="container mx-auto px-4 text-center text-gray-400">
        <p>{{ $t('footer.copyright') }}</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import LoadingSpinner from './components/LoadingSpinner.vue'
import dataCacheService from './services/dataCache.js'

const router = useRouter()
const route = useRoute()
const { locale, t } = useI18n()
const searchQuery = ref('')

// 加载状态管理
const isLoading = ref(true)
const loadingTitle = ref('初始化中...')
const loadingMessage = ref('正在加载游戏数据，请稍候')
const loadingProgress = ref(0)
const showProgress = ref(true)

const currentLanguage = computed(() => locale.value)

// 切换语言
const toggleLanguage = () => {
  locale.value = locale.value === 'zh' ? 'en' : 'zh'
  // 设置 HTML 标签的 lang 属性
  document.documentElement.lang = locale.value
}

// 执行搜索
const performSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/games',
      query: {
        search: searchQuery.value.trim()
      }
    })
  }
}

// 初始化应用
const initializeApp = async () => {
  try {
    loadingProgress.value = 20
    loadingMessage.value = '加载游戏分类数据...'
    
    // 等待数据缓存服务初始化
    await dataCacheService.initialize()
    
    loadingProgress.value = 80
    loadingMessage.value = '准备就绪...'
    
    // 模拟最后的准备时间
    await new Promise(resolve => setTimeout(resolve, 500))
    
    loadingProgress.value = 100
    
    // 延迟隐藏加载界面
    setTimeout(() => {
      isLoading.value = false
    }, 300)
    
  } catch (error) {
    console.error('应用初始化失败:', error)
    loadingTitle.value = '加载失败'
    loadingMessage.value = '请刷新页面重试'
    showProgress.value = false
  }
}

// 添加结构化数据
const addStructuredData = () => {
  // 移除已存在的结构化数据
  const existingScript = document.querySelector('script[type="application/ld+json"]')
  if (existingScript) {
    existingScript.remove()
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Game Corner",
    "description": locale.value === 'zh' 
      ? "Game Corner是您免费在线HTML5游戏的一站式目的地！我们拥有各种类型的大量游戏收藏，如动作、冒险、益智、策略、体育等。"
      : "Your one-stop destination for free online HTML5 games! We have a huge collection of games in various genres like action, adventure, puzzle, strategy, sports, and many more.",
    "url": window.location.origin,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${window.location.origin}/games?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Game Corner"
    },
    "inLanguage": ["zh-CN", "en-US"],
    "keywords": locale.value === 'zh'
      ? "国内外h5游戏,html5小游戏,html5手机游戏,免费html5网页游戏在线玩,免费H5,在线游戏"
      : "free online HTML5 games,browser games,web games,mobile games,action games,adventure games,puzzle games,strategy games,sports games,online gaming"
  }

  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(structuredData)
  document.head.appendChild(script)
}

// 更新页面meta标签
const updateMetaTags = () => {
  // 更新页面标题
  const title = locale.value === 'zh'
    ? 'Game Corner | 国内外H5游戏平台 - 免费HTML5网页游戏在线玩'
    : 'Game Corner | Free Online HTML5 Games Platform'
  document.title = title

  // 更新描述
  const description = locale.value === 'zh'
    ? 'Game Corner是您免费在线HTML5游戏的一站式目的地！我们拥有各种类型的大量游戏收藏，如动作、冒险、益智、策略、体育等。直接在浏览器中玩我们的游戏，无需下载任何内容。'
    : 'Your one-stop destination for free online HTML5 games! We have a huge collection of games in various genres like action, adventure, puzzle, strategy, sports, and many more. Play our games directly on your browser without the need to download anything. Have fun and enjoy!'
  
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) {
    metaDescription.setAttribute('content', description)
  }

  // 更新Open Graph标签
  const ogTitle = document.querySelector('meta[property="og:title"]')
  if (ogTitle) {
    ogTitle.setAttribute('content', title)
  }

  const ogDescription = document.querySelector('meta[property="og:description"]')
  if (ogDescription) {
    ogDescription.setAttribute('content', description)
  }

  // 更新Twitter Card标签
  const twitterTitle = document.querySelector('meta[name="twitter:title"]')
  if (twitterTitle) {
    twitterTitle.setAttribute('content', title)
  }

  const twitterDescription = document.querySelector('meta[name="twitter:description"]')
  if (twitterDescription) {
    twitterDescription.setAttribute('content', description)
  }
}

// 监听语言变化
watch(locale, () => {
  updateMetaTags()
  addStructuredData()
})

// 监听路由变化，更新页面SEO信息
watch(route, () => {
  updateMetaTags()
  addStructuredData()
})

onMounted(() => {
  console.log('App mounted')
  // 设置初始语言
  document.documentElement.lang = locale.value
  updateMetaTags()
  addStructuredData()
  initializeApp()
})
</script>