<template>
  <div class="space-y-12">
    <!-- 性能统计浮动按钮 -->
    <div class="performance-toggle" @click="togglePerformanceStats" title="查看性能统计 (Ctrl+Shift+P)">
      📊
    </div>
    
    <!-- 性能统计组件 -->
    <HomePerformanceStats ref="performanceStatsRef" :load-time="homeLoadTime" />
    <!-- 英雄区域 -->
    <section class="py-8 bg-gray-800 rounded-xl">
      <div class="text-center px-6">
        <h1 class="text-4xl lg:text-5xl font-game text-game-accent mb-4">{{ $t('home.welcome') }}</h1>
        <p class="text-xl text-gray-300">{{ $t('home.subtitle') }}</p>
      </div>
    </section>

    <!-- 游戏分类展示 -->
    <section>
      <h2 class="text-2xl font-game text-game-secondary mb-6">{{ $t('home.categories') }}</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div v-for="category in gameCategories" :key="category.id" 
             class="bg-gray-800 rounded-lg p-4 flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer"
             @click="goToCategory(category.id)">
          <div class="text-3xl mr-4">{{ category.icon }}</div>
          <h3 class="text-lg font-game text-game-accent">{{ $t(`gameTypes.${category.id}`) }}</h3>
        </div>
      </div>
    </section>

    <!-- 热门游戏 -->
    <section>
      <h2 class="text-2xl font-game text-game-secondary mb-6">{{ $t('home.hotGames') }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="game in hotGames" :key="game.id" class="game-card">
          <img :src="game.image" :alt="game.title" class="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity" @click="goToGame(game.id)">
          <div class="p-4">
            <h3 class="game-title">{{ game.title }}</h3>
            <div class="flex items-center justify-between text-sm text-gray-400 mb-2">
              <span>{{ $t(`gameTypes.${game.category}`) }}</span>
              <div class="flex items-center">
                <span class="text-game-accent">★</span>
                <span class="ml-1">4.5</span>
              </div>
            </div>
            <p class="text-gray-500 text-sm mb-4">{{ game.plays }} {{ $t('games.plays') }}</p>
            <router-link :to="`/game/${game.id}`" class="btn-primary block text-center">
              {{ $t('home.playNow') }}
            </router-link>
          </div>
        </div>
      </div>
    </section>


    <!-- 最新游戏 -->
    <section>
      <h2 class="text-2xl font-game text-game-secondary mb-6">{{ $t('home.latestGames') }}</h2>
      <div class="bg-gray-800 rounded-lg p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="game in latestGames" :key="game.id" 
               class="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors cursor-pointer"
               @click="goToGame(game.id)">
            <img :src="game.image" :alt="game.title" class="w-full h-24 object-cover rounded mb-3">
            <h4 class="text-sm font-game text-game-accent mb-1">{{ game.title }}</h4>
            <p class="text-xs text-gray-400">{{ $t(`gameTypes.${game.category}`) }}</p>
          </div>
        </div>
        <div class="text-center mt-6">
          <router-link to="/games" class="btn-secondary">{{ $t('home.viewMore') }}</router-link>
        </div>
      </div>
    </section>

    <!-- 特色功能 -->
    <section>
      <h2 class="text-2xl font-game text-game-secondary mb-6">{{ $t('home.whyChooseUs') }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-gray-800 rounded-lg p-6 text-center">
          <div class="text-4xl mb-4">🎮</div>
          <h3 class="text-xl font-game text-game-accent mb-3">{{ $t('home.qualityGames') }}</h3>
          <p class="text-gray-400">{{ $t('home.qualityGamesDesc') }}</p>
        </div>
        <div class="bg-gray-800 rounded-lg p-6 text-center">
          <div class="text-4xl mb-4">⚡</div>
          <h3 class="text-xl font-game text-game-accent mb-3">{{ $t('home.fastLoading') }}</h3>
          <p class="text-gray-400">{{ $t('home.fastLoadingDesc') }}</p>
        </div>
        <div class="bg-gray-800 rounded-lg p-6 text-center">
          <div class="text-4xl mb-4">📱</div>
          <h3 class="text-xl font-game text-game-accent mb-3">{{ $t('home.multiPlatform') }}</h3>
          <p class="text-gray-400">{{ $t('home.multiPlatformDesc') }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import homeDataCacheService from '../services/homeDataCache.js'
import dataCacheService from '../services/dataCache.js' // 保留作为备用
import HomePerformanceStats from '../components/HomePerformanceStats.vue'

const router = useRouter()
const { t, locale } = useI18n()

// 热门游戏数据
const hotGames = ref([])
// 最新游戏数据
const latestGames = ref([])
const homeLoadTime = ref(0)
const performanceStatsRef = ref(null)

// 加载热门游戏数据（使用优化后的首页服务）
const loadHotGames = async () => {
  try {
    const hotGamesList = await homeDataCacheService.loadHotGames()
    hotGames.value = hotGamesList
  } catch (error) {
    console.error('加载热门游戏数据失败:', error)
  }
}

// 加载游戏分类配置（使用首页优化服务）
const loadGameTypes = async () => {
  try {
    return await homeDataCacheService.loadGameTypes()
  } catch (error) {
    console.error('Failed to load game types:', error)
    // 返回空数组，让调用方处理
    return []
  }
}

// 根据标签推断游戏类别
const getCategoryFromTags = async (tags) => {
  if (!tags) return 3 // 默认返回休闲游戏的ID
  
  // 获取游戏分类配置（使用缓存）
  const gameTypes = await loadGameTypes()
  
  // 处理标签：如果是数组直接使用，如果是字符串则分割
  let gameTags
  if (Array.isArray(tags)) {
    gameTags = tags.map(tag => tag.toLowerCase())
  } else {
    gameTags = tags.split(',').map(tag => tag.trim().toLowerCase())
  }
  
  // 遍历每个分类，检查是否有匹配的标签
  for (const category of gameTypes) {
    const categoryTags = category.tags.map(tag => tag.toLowerCase())
    
    // 检查游戏标签中是否包含该分类的任何标签
    const hasMatch = gameTags.some(gameTag => categoryTags.includes(gameTag))
    
    if (hasMatch) {
      return category.id
    }
  }
  
  // 如果没有匹配到任何分类，默认返回休闲游戏的ID
  return 3
}

// 加载最新游戏数据（使用优化后的首页服务）
const loadLatestGames = async () => {
  try {
    const newGamesList = await homeDataCacheService.loadNewGames()
    latestGames.value = newGamesList
  } catch (error) {
    console.error('加载最新游戏数据失败:', error)
  }
}

// 游戏分类数据
const gameCategories = ref([])

// 加载游戏分类数据（使用优化后的首页服务）
const loadGameCategories = async () => {
  try {
    const data = await homeDataCacheService.loadGameTypes()
    // 为每个分类添加随机的游戏数量
    gameCategories.value = data.map(category => ({
      ...category,
      count: Math.floor(Math.random() * 20) + 10 // 随机生成10-30的游戏数量
    }))
  } catch (error) {
    console.error('加载游戏分类数据失败:', error)
  }
}

// 跳转到游戏分类页面
const goToCategory = (categoryId) => {
  router.push({
    path: '/games',
    query: { categoryId: categoryId }
  })
}

// 跳转到游戏详情页面
const goToGame = (gameId) => {
  router.push(`/game/${gameId}`)
}

// 性能统计方法
const togglePerformanceStats = () => {
  if (performanceStatsRef.value) {
    performanceStatsRef.value.toggle()
  }
}

// 首页SEO优化
const updateHomePageSEO = () => {
  // 更新页面标题
  const title = locale.value === 'zh'
    ? 'Game Corner | 国内外H5游戏平台 - 免费HTML5网页游戏在线玩'
    : 'Game Corner | Free Online HTML5 Games Platform'
  document.title = title

  // 添加首页特定的结构化数据
  const existingScript = document.querySelector('script[data-page="home"]')
  if (existingScript) {
    existingScript.remove()
  }

  const homeStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${window.location.origin}/#webpage`,
    "url": window.location.origin,
    "name": title,
    "description": locale.value === 'zh'
      ? 'Game Corner是您免费在线HTML5游戏的一站式目的地！我们拥有各种类型的大量游戏收藏，如动作、冒险、益智、策略、体育等。直接在浏览器中玩我们的游戏，无需下载任何内容。'
      : 'Your one-stop destination for free online HTML5 games! We have a huge collection of games in various genres like action, adventure, puzzle, strategy, sports, and many more. Play our games directly on your browser without the need to download anything. Have fun and enjoy!',
    "isPartOf": {
      "@type": "WebSite",
      "@id": `${window.location.origin}/#website`,
      "name": "Game Corner"
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [{
        "@type": "ListItem",
        "position": 1,
        "name": locale.value === 'zh' ? '首页' : 'Home',
        "item": window.location.origin
      }]
    },
    "mainEntity": {
      "@type": "ItemList",
      "name": locale.value === 'zh' ? '热门游戏' : 'Popular Games',
      "description": locale.value === 'zh' ? '最受欢迎的HTML5游戏' : 'Most popular HTML5 games',
      "numberOfItems": hotGames.value.length
    }
  }

  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.setAttribute('data-page', 'home')
  script.textContent = JSON.stringify(homeStructuredData)
  document.head.appendChild(script)
}

// 监听语言变化
watch(locale, () => {
  updateHomePageSEO()
})

// 监听热门游戏数据变化，更新结构化数据
watch(hotGames, () => {
  if (hotGames.value.length > 0) {
    updateHomePageSEO()
  }
})

// 组件挂载时加载数据（使用优化后的首页服务）
onMounted(async () => {
  try {
    console.log('🏠 首页开始初始化...')
    const startTime = performance.now()
    
    // 使用首页优化服务统一初始化核心数据
    const { hotGames: hotGamesData, newGames: newGamesData, gameTypes } = await homeDataCacheService.initializeHome()
    
    // 设置数据
    hotGames.value = hotGamesData
    latestGames.value = newGamesData
    
    // 处理游戏分类数据
    gameCategories.value = gameTypes.map(category => ({
      ...category,
      count: Math.floor(Math.random() * 20) + 10
    }))
    
    const loadTime = Math.round(performance.now() - startTime)
    homeLoadTime.value = loadTime
    console.log(`✅ 首页初始化完成，耗时: ${loadTime}ms`)
    
    // 更新SEO
    updateHomePageSEO()
    
    // 监听完整游戏列表加载完成事件
    window.addEventListener('fullGamesListReady', (event) => {
      console.log(`🎮 完整游戏列表已准备就绪，共 ${event.detail.count} 个游戏`)
    })
    
  } catch (error) {
    console.error('❌ 首页初始化失败:', error)
    // 降级到原来的加载方式
    loadGameCategories()
    loadHotGames()
    loadLatestGames()
    updateHomePageSEO()
  }
})
</script>

<style scoped>
/* 性能统计浮动按钮 */
.performance-toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  transition: all 0.3s ease;
  font-size: 20px;
  color: white;
}

.performance-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
}

.performance-toggle:active {
  transform: scale(0.95);
}
</style>