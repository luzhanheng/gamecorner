<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
    <!-- 游戏内容 -->
    <div v-if="game" class="container mx-auto px-4 py-8">
      <div class="bg-gray-800 rounded-lg overflow-hidden">
        <div class="relative">
          <img 
            v-lazy-load="game.image" 
            :alt="game.title"
            class="w-full h-64 object-cover"
            loading="lazy"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
          <div class="absolute bottom-0 left-0 p-6">
            <h1 class="text-4xl font-game text-white mb-2">{{ game.title }}</h1>
            <div class="flex items-center space-x-4 text-gray-300">
              <span>{{ game.category }}</span>
              <span>·</span>
              <div class="flex items-center">
                <span class="text-game-accent">★</span>
                <span class="ml-1">{{ game.rating }}/5</span>
              </div>
              <span>·</span>
              <span>{{ game.plays }} {{ $t('gameDetail.plays') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 游戏区域 -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div class="lg:col-span-3">
          <div class="bg-gray-800 rounded-lg overflow-hidden relative">
            <!-- 全屏按钮 -->
            <button 
              @click="toggleFullscreen"
              class="absolute top-4 right-4 z-10 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors"
              :title="$t('gameDetail.fullscreen')"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
              </svg>
            </button>
            
            <div class="h-96 md:h-[500px] lg:h-[650px]">
              <iframe 
                v-if="game.gameUrl" 
                ref="gameIframe"
                :src="game.gameUrl" 
                class="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock"
                loading="lazy"
                allowfullscreen
              ></iframe>
              <div v-else id="game-container" class="w-full h-full flex items-center justify-center text-gray-500">
                游戏加载中...
              </div>
            </div>
            <div class="p-6">
              <h2 class="text-2xl font-game text-game-accent mb-4">{{ $t('gameDetail.gameDescription') }}</h2>
              <p class="text-gray-300">{{ game.description }}</p>
            </div>
          </div>
        </div>

        <!-- 侧边栏 -->
        <div class="space-y-6">
          <!-- 控制说明 -->
          <div v-if="game.controls || game.controls_text" class="bg-gray-800 rounded-lg p-6">
            <h3 class="text-xl font-game text-game-accent mb-4">{{ $t('gameDetail.controls') }}</h3>
            <div class="text-gray-300">
              <!-- 优先使用HTML格式的controls -->
              <div v-if="game.controls" v-html="game.controls" class="controls-content"></div>
              <!-- 如果没有HTML格式，使用纯文本格式 -->
              <div v-else-if="game.controls_text" class="whitespace-pre-line">{{ game.controls_text }}</div>
            </div>
          </div>



          <!-- 分享游戏 -->
          <div class="bg-gray-800 rounded-lg p-6">
            <h3 class="text-xl font-game text-game-accent mb-4">{{ $t('gameDetail.shareGame') }}</h3>
            <div class="space-y-4">
              <!-- 复制链接 -->
              <div class="flex items-center space-x-2">
                <input 
                  ref="shareUrlInput"
                  :value="shareUrl" 
                  readonly 
                  class="flex-1 bg-gray-700 text-gray-300 px-3 py-2 rounded-lg text-sm"
                >
                <button 
                  @click="copyToClipboard"
                  class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                  :class="{ 'bg-green-600 hover:bg-green-700': copySuccess }"
                >
                  {{ copySuccess ? $t('gameDetail.copied') : $t('gameDetail.copy') }}
                </button>
              </div>
              
              <!-- 社交分享 -->
              <div class="grid grid-cols-2 gap-3">
                <button 
                  v-for="social in socials" 
                  :key="social.name"
                  class="flex items-center justify-center space-x-2 py-3 rounded-lg transition-colors text-sm font-medium"
                  :class="social.class"
                  @click="share(social.name)"
                >
                  <i :class="social.icon" class="text-lg"></i>
                  <span>{{ social.label }}</span>
                </button>
              </div>
              
              <!-- 二维码分享 -->
              <div class="text-center">
                <button 
                  @click="toggleQRCode"
                  class="text-blue-400 hover:text-blue-300 transition-colors text-sm"
                >
                  {{ showQRCode ? $t('gameDetail.hideQRCode') : $t('gameDetail.showQRCode') }}
                </button>
                <div v-if="showQRCode" class="mt-4 flex justify-center">
                  <div class="bg-white p-4 rounded-lg">
                    <div ref="qrCodeContainer" class="w-32 h-32"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 相关链接 -->
          <div v-if="externalLinks.length > 0" class="bg-gray-800 rounded-lg p-6">
            <h3 class="text-xl font-game text-game-accent mb-4">{{ $t('gameDetail.relatedLinks') }}</h3>
            <div class="space-y-3">
              <a 
                v-for="link in externalLinks" 
                :key="link.id"
                :href="link.url"
                :rel="link.isSponsored ? 'sponsored nofollow' : 'nofollow'"
                target="_blank"
                class="external-link flex items-center justify-between p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors group"
                @click="trackLinkClick(link)"
              >
                <div class="flex-1">
                  <h4 class="text-white font-medium text-sm">{{ link.title }}</h4>
                  <p class="text-gray-400 text-xs mt-1">{{ link.description }}</p>
                  <span class="text-blue-400 text-xs">{{ getDomain(link.url) }}</span>
                </div>
                <svg class="external-icon w-4 h-4 text-gray-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- 相关游戏推荐 -->
      <div>
        <h2 class="text-2xl font-game text-game-accent mb-6">{{ $t('gameDetail.relatedGames') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            v-for="game in relatedGames" 
            :key="game.id" 
            class="game-card group"
          >
            <a :href="`/game/${game.id}`" target="_blank">
              <img 
                :src="game.image" 
                :alt="game.title"
                class="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
              >
            </a>
            <div class="p-4">
              <h3 class="game-title text-lg">{{ game.title }}</h3>
              <div class="flex items-center justify-between mt-2">
                <span class="text-sm text-gray-400">{{ getGameTypeTranslation(game.category) }}</span>
                <a :href="`/game/${game.id}`" target="_blank" class="btn-primary text-sm">
                  {{ $t('gameDetail.startGame') }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import dataCacheService from '../services/dataCache.js'
import { useStructuredData } from '../utils/seoStructuredData.js'
import { updatePageMeta, generateBreadcrumbs, updateCanonicalUrl, generateCanonicalUrl, extractGameIdFromUrl } from '../utils/urlOptimizer.js'

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()
const { injectGameData, injectBreadcrumbData, injectMultipleStructuredData } = useStructuredData()
const gameIframe = ref(null)
const allGames = ref([])
const game = ref(null)
const loading = ref(true)

// 全局缓存
let gamesCache = null
let gameTypesCache = null

// 跳转到游戏详情页
const goToGame = (gameId) => {
  router.push(`/game/${gameId}`)
}

// 加载所有游戏数据（带缓存）
const loadAllGames = async () => {
  try {
    loading.value = true
    
    // 如果有缓存，直接使用
    if (gamesCache) {
      allGames.value = gamesCache
      updateCurrentGame()
      loading.value = false
      return
    }
    
    const data = await dataCacheService.loadAllGames()
    
    // 预加载游戏分类配置
    if (!gameTypesCache) {
      gameTypesCache = await loadGameTypes()
    }
    
    // 批量处理游戏数据，避免过多异步调用
    allGames.value = data.map((gameData, index) => ({
      ...gameData,
      id: index + 1,
      category: getCategoryFromTagsSync(gameData.tags, gameTypesCache),
      rating: (4.0 + Math.random() * 1.0).toFixed(1),
      plays: Math.floor(Math.random() * 50000) + 10000,
      gameUrl: gameData.embed
    }))
    
    // 缓存处理后的数据
    gamesCache = allGames.value
    
    // 数据加载完成后更新当前游戏
    updateCurrentGame()
    loading.value = false
  } catch (error) {
    console.error('加载游戏数据失败:', error)
    loading.value = false
  }
}

// 加载游戏分类配置
const loadGameTypes = async () => {
  try {
    return await dataCacheService.loadGameTypes()
  } catch (error) {
    console.error('Failed to load game types:', error)
    // 返回空数组，让调用方处理
    return []
  }
}

// 根据标签推断游戏类别（同步版本，性能优化）
const getCategoryFromTagsSync = (tags, gameTypes) => {
  if (!tags || !gameTypes || gameTypes.length === 0) return '休闲游戏'
  
  // 将游戏标签按逗号分割并清理空格
  const gameTags = tags.split(',').map(tag => tag.trim().toLowerCase())
  
  // 遍历每个分类，检查是否有匹配的标签
  for (const category of gameTypes) {
    const categoryTags = category.tags.map(tag => tag.toLowerCase())
    
    // 检查游戏标签中是否包含该分类的任何标签
    const hasMatch = gameTags.some(gameTag => categoryTags.includes(gameTag))
    
    if (hasMatch) {
      return category.name
    }
  }
  
  // 如果没有匹配到任何分类，默认返回休闲游戏
  return '休闲游戏'
}

// 根据标签推断游戏类别（保留异步版本用于兼容）
const getCategoryFromTags = async (tags) => {
  if (!gameTypesCache) {
    gameTypesCache = await loadGameTypes()
  }
  return getCategoryFromTagsSync(tags, gameTypesCache)
}



// 根据路由参数更新当前游戏
const updateCurrentGame = () => {
  if (allGames.value.length > 0) {
    // 使用extractGameIdFromUrl函数正确提取游戏ID，支持SEO友好URL
    const gameIdStr = extractGameIdFromUrl(route.path) || route.params.id
    const gameId = parseInt(gameIdStr)
    game.value = allGames.value.find(g => g.id === gameId)
  }
}

// 快速加载当前游戏（优化首次加载）
const loadCurrentGameFast = async () => {
  // 使用extractGameIdFromUrl函数正确提取游戏ID，支持SEO友好URL
  const gameIdStr = extractGameIdFromUrl(route.path) || route.params.id
  const gameId = parseInt(gameIdStr)
  
  // 如果有缓存，直接使用
  if (gamesCache) {
    game.value = gamesCache.find(g => g.id === gameId)
    loading.value = false
    return
  }
  
  try {
    // 快速加载：只获取当前游戏数据
    const response = await fetch('/all-game.json')
    const data = await response.json()
    
    if (data && data[gameId - 1]) {
      // 预加载游戏分类配置
      if (!gameTypesCache) {
        gameTypesCache = await loadGameTypes()
      }
      
      // 只处理当前游戏
      const gameData = data[gameId - 1]
      game.value = {
        ...gameData,
        id: gameId,
        category: getCategoryFromTagsSync(gameData.tags, gameTypesCache),
        rating: (4.0 + Math.random() * 1.0).toFixed(1),
        plays: Math.floor(Math.random() * 50000) + 10000,
        gameUrl: gameData.embed
      }
      
      loading.value = false
      
      // 更新页面meta信息和URL优化
      updateGamePageMeta()
      
      // 注入结构化数据
      setTimeout(() => {
        injectGameStructuredData()
      }, 100)
      
      // 异步加载完整数据用于相关游戏等功能
      setTimeout(() => {
        if (!gamesCache) {
          loadAllGames()
        }
      }, 200)
    }
  } catch (error) {
    console.error('快速加载游戏失败:', error)
    // 回退到完整加载
    loadAllGames()
  }
}

// 更新游戏页面meta信息
const updateGamePageMeta = () => {
  if (!game.value) return
  
  try {
    // 更新页面标题和meta标签
    updatePageMeta(route, { game: game.value })
    
    // 更新canonical URL
    const canonicalUrl = generateCanonicalUrl(route.path)
    updateCanonicalUrl(canonicalUrl)
    
    console.log('✅ 游戏页面meta信息更新完成')
  } catch (error) {
    console.error('❌ 游戏页面meta信息更新失败:', error)
  }
}

// 注入游戏详情页结构化数据
const injectGameStructuredData = () => {
  if (!game.value) return
  
  try {
    const structuredDataArray = []
    
    // 1. 游戏详情结构化数据
    const gameData = {
      '@context': 'https://schema.org',
      '@type': 'VideoGame',
      name: game.value.title,
      description: game.value.description || `${game.value.title} - 免费在线游戏`,
      image: game.value.image,
      url: `${window.location.origin}/game/${game.value.id}`,
      gamePlatform: 'Web Browser',
      operatingSystem: 'Any',
      applicationCategory: 'Game',
      genre: game.value.category || 'Game',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock'
      },
      publisher: {
        '@type': 'Organization',
        name: 'GameCorner',
        url: window.location.origin
      }
    }
    
    // 添加评分信息
    if (game.value.rating) {
      gameData.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: game.value.rating.toString(),
        ratingCount: Math.floor(Math.random() * 1000 + 100).toString(),
        bestRating: '5',
        worstRating: '1'
      }
    }
    
    // 添加游戏统计信息
    if (game.value.plays) {
      gameData.interactionStatistic = {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/PlayAction',
        userInteractionCount: game.value.plays
      }
    }
    
    structuredDataArray.push(gameData)
    
    // 2. 面包屑导航结构化数据
    const breadcrumbData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: '首页',
          item: window.location.origin
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: '游戏',
          item: `${window.location.origin}/games`
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: game.value.category || '游戏分类',
          item: `${window.location.origin}/games?category=${encodeURIComponent(game.value.category || '')}`
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: game.value.title,
          item: `${window.location.origin}/game/${game.value.id}`
        }
      ]
    }
    structuredDataArray.push(breadcrumbData)
    
    // 注入所有结构化数据
    injectMultipleStructuredData(structuredDataArray)
    console.log('✅ 游戏详情页结构化数据注入完成')
    
  } catch (error) {
    console.error('❌ 游戏详情页结构化数据注入失败:', error)
  }
}

// 组件挂载时优先快速加载当前游戏
onMounted(() => {
  loadCurrentGameFast()
})

// 监听路由变化，当游戏ID改变时更新当前游戏
watch(() => route.path, () => {
  if (route.name === 'GameDetail' || route.name === 'GameDetailWithSlug') {
    loadCurrentGameFast()
  }
}, { immediate: false })

// 分享相关状态
const shareUrlInput = ref(null)
const copySuccess = ref(false)
const showQRCode = ref(false)
const qrCodeContainer = ref(null)

const socials = computed(() => {
  const currentLocale = t('locale')
  const isEnglish = currentLocale === 'en'
  
  if (isEnglish) {
    // 英文版本：Twitter、Facebook、Reddit
    return [
      { 
        name: 'twitter', 
        icon: '🐦', 
        label: t('gameDetail.twitter'),
        class: 'bg-blue-400 hover:bg-blue-500 text-white'
      },
      { 
        name: 'facebook', 
        icon: '📘', 
        label: t('gameDetail.facebook'),
        class: 'bg-blue-600 hover:bg-blue-700 text-white'
      },
      { 
        name: 'reddit', 
        icon: '🔴', 
        label: t('gameDetail.reddit'),
        class: 'bg-orange-600 hover:bg-orange-700 text-white'
      },
      { 
        name: 'link', 
        icon: '🔗', 
        label: t('gameDetail.copyLink'),
        class: 'bg-gray-600 hover:bg-gray-700 text-white'
      }
    ]
  } else {
    // 中文版本：微信、微博、QQ
    return [
      { 
        name: 'weixin', 
        icon: '💬', 
        label: t('gameDetail.weixin'),
        class: 'bg-green-600 hover:bg-green-700 text-white'
      },
      { 
        name: 'weibo', 
        icon: '📱', 
        label: t('gameDetail.weibo'),
        class: 'bg-red-600 hover:bg-red-700 text-white'
      },
      { 
        name: 'qq', 
        icon: '🐧', 
        label: t('gameDetail.qq'),
        class: 'bg-blue-600 hover:bg-blue-700 text-white'
      },
      { 
        name: 'link', 
        icon: '🔗', 
        label: t('gameDetail.copyLink'),
        class: 'bg-gray-600 hover:bg-gray-700 text-white'
      }
    ]
  }
})

// 分享URL计算属性
const shareUrl = computed(() => {
  return window.location.href
})

// 复制到剪贴板
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  } catch (err) {
    // 降级方案：使用传统方法
    if (shareUrlInput.value) {
      shareUrlInput.value.select()
      document.execCommand('copy')
      copySuccess.value = true
      setTimeout(() => {
        copySuccess.value = false
      }, 2000)
    }
  }
}

// 切换二维码显示
const toggleQRCode = () => {
  showQRCode.value = !showQRCode.value
  if (showQRCode.value) {
    // 延迟生成二维码，确保DOM已渲染
    setTimeout(() => {
      generateQRCode()
    }, 100)
  }
}

// 生成二维码（简单实现）
const generateQRCode = () => {
  if (!qrCodeContainer.value) return
  
  // 清空容器
  qrCodeContainer.value.innerHTML = ''
  
  // 创建二维码（这里使用简单的文本显示，实际项目中可以使用qrcode.js等库）
  const qrText = document.createElement('div')
  qrText.className = 'text-xs text-gray-800 p-2 text-center break-all'
  qrText.textContent = '扫码访问游戏'
  qrCodeContainer.value.appendChild(qrText)
  
  // 添加提示文本
  const urlText = document.createElement('div')
  urlText.className = 'text-xs text-gray-600 mt-2'
  urlText.textContent = shareUrl.value.length > 30 ? shareUrl.value.substring(0, 30) + '...' : shareUrl.value
  qrCodeContainer.value.appendChild(urlText)
}

// 分享功能实现
const share = (platform) => {
  const shareData = {
    title: game.value?.title || '精彩游戏',
    desc: game.value?.description || '快来体验这款有趣的游戏！',
    link: shareUrl.value,
    imgUrl: game.value?.image || ''
  }
  
  switch (platform) {
    case 'weixin':
      // 微信分享（实际项目中需要接入微信SDK）
      if (navigator.share) {
        navigator.share({
          title: shareData.title,
          text: shareData.desc,
          url: shareData.link
        }).catch(err => console.log('分享失败:', err))
      } else {
        copyToClipboard()
      }
      break
    case 'weibo':
      // 微博分享
      const weiboUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(shareData.link)}&title=${encodeURIComponent(shareData.title + ' - ' + shareData.desc)}`
      window.open(weiboUrl, '_blank')
      break
    case 'qq':
      // QQ分享
      const qqUrl = `https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(shareData.link)}&title=${encodeURIComponent(shareData.title)}&summary=${encodeURIComponent(shareData.desc)}`
      window.open(qqUrl, '_blank')
      break
    case 'twitter':
      // Twitter分享
      const twitterText = `${shareData.title} - ${shareData.desc}`
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(shareData.link)}`
      window.open(twitterUrl, '_blank')
      break
    case 'facebook':
      // Facebook分享
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.link)}&quote=${encodeURIComponent(shareData.title + ' - ' + shareData.desc)}`
      window.open(facebookUrl, '_blank')
      break
    case 'reddit':
      // Reddit分享
      const redditUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(shareData.link)}&title=${encodeURIComponent(shareData.title)}`
      window.open(redditUrl, '_blank')
      break
    case 'link':
      copyToClipboard()
      break
    default:
      console.log(`分享到${platform}`, shareData)
  }
}

// 全屏功能实现
const toggleFullscreen = () => {
  if (!gameIframe.value) return
  
  if (!document.fullscreenElement) {
    // 进入全屏
    gameIframe.value.requestFullscreen().catch(err => {
      console.log('无法进入全屏模式:', err)
    })
  } else {
    // 退出全屏
    document.exitFullscreen().catch(err => {
      console.log('无法退出全屏模式:', err)
    })
  }
}

// 获取与当前游戏相关的游戏（优先显示同类型游戏）
const relatedGames = computed(() => {
  if (!game.value || !allGames.value.length) return []
  
  // 使用extractGameIdFromUrl函数正确提取游戏ID，支持SEO友好URL
  const gameIdStr = extractGameIdFromUrl(route.path) || route.params.id
  const currentGameId = parseInt(gameIdStr)
  const currentCategory = game.value.category
  
  // 获取除当前游戏外的所有游戏
  const otherGames = allGames.value.filter(g => g.id !== currentGameId)
  
  // 优先获取同类型的游戏
  const sameCategory = otherGames.filter(g => g.category === currentCategory)
  
  // 获取其他类型的游戏
  const otherCategory = otherGames.filter(g => g.category !== currentCategory)
  
  // 合并游戏列表：优先同类型，然后其他类型
  const combinedGames = [...sameCategory, ...otherCategory]
  
  // 只显示4个相关游戏
  return combinedGames.slice(0, 4).map(g => ({
    id: g.id,
    title: g.title,
    category: g.category,
    image: g.image,
    rating: g.rating,
    plays: g.plays
  }))
})

// 外链数据生成
const externalLinks = computed(() => {
  if (!game.value) return []
  
  const links = []
  const gameTitle = game.value.title
  const gameCategory = getGameTypeTranslation.value(game.value.category)
  const currentLocale = t('locale') // 获取当前语言
  const isEnglish = currentLocale === 'en'
  
  // 1. 维基百科链接（支持多语言）
  if (gameTitle) {
    const wikiDomain = isEnglish ? 'en.wikipedia.org' : 'zh.wikipedia.org'
    const wikiTitle = isEnglish ? 'Wikipedia' : '维基百科'
    const wikiDescription = isEnglish 
      ? `View detailed information about ${gameTitle}` 
      : `查看${gameTitle}的详细信息`
    
    links.push({
      id: 'wikipedia',
      title: wikiTitle,
      description: wikiDescription,
      url: `https://${wikiDomain}/wiki/${encodeURIComponent(gameTitle)}`,
      isSponsored: false,
      category: 'reference'
    })
  }
  
  // 2. 游戏搜索链接
  if (gameTitle) {
    const gameSpotTitle = isEnglish ? 'GameSpot Search' : 'GameSpot搜索'
    const gameSpotDescription = isEnglish 
      ? `Search for ${gameTitle} on GameSpot` 
      : `在GameSpot上搜索${gameTitle}`
    
    links.push({
      id: 'gamespot',
      title: gameSpotTitle,
      description: gameSpotDescription,
      url: `https://www.gamespot.com/search/?q=${encodeURIComponent(gameTitle)}`,
      isSponsored: false,
      category: 'review'
    })
  }
  
  // 3. 游戏社区链接
  if (gameTitle) {
    const redditTitle = isEnglish ? 'Reddit Discussion' : 'Reddit讨论'
    const redditDescription = isEnglish 
      ? `Discuss ${gameTitle} on Reddit` 
      : `在Reddit上讨论${gameTitle}`
    
    links.push({
      id: 'reddit',
      title: redditTitle,
      description: redditDescription,
      url: `https://www.reddit.com/search/?q=${encodeURIComponent(gameTitle)}`,
      isSponsored: false,
      category: 'community'
    })
  }
  
  // 4. 游戏类型相关链接
  if (gameCategory) {
    const categoryTitle = isEnglish 
      ? `${gameCategory} Games Collection` 
      : `${gameCategory}游戏合集`
    const categoryDescription = isEnglish 
      ? `Explore more ${gameCategory} games` 
      : `探索更多${gameCategory}类型游戏`
    
    links.push({
      id: 'category',
      title: categoryTitle,
      description: categoryDescription,
      url: `/games?category=${encodeURIComponent(gameCategory)}`,
      isSponsored: false,
      category: 'internal'
    })
  }
  
  // 5. 游戏开发资源（针对特定类型）
  const strategicCategories = isEnglish 
    ? ['Strategy', 'RPG', 'Simulation'] 
    : ['策略游戏', '角色扮演', '模拟游戏']
  
  if (gameCategory && strategicCategories.includes(gameCategory)) {
    const unityTitle = isEnglish ? 'Unity Game Engine' : 'Unity游戏引擎'
    const unityDescription = isEnglish 
      ? 'Learn game development technology' 
      : '学习游戏开发技术'
    
    links.push({
      id: 'unity',
      title: unityTitle,
      description: unityDescription,
      url: 'https://unity.com/',
      isSponsored: true,
      category: 'development'
    })
  }
  
  return links.slice(0, 5) // 最多显示5个链接
})

// 提取域名
const getDomain = (url) => {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

// 外链点击追踪
const trackLinkClick = (link) => {
  try {
    // Google Analytics 事件追踪
    if (typeof gtag !== 'undefined') {
      gtag('event', 'external_link_click', {
        link_url: link.url,
        link_title: link.title,
        link_category: link.category,
        game_title: game.value?.title,
        page_location: window.location.href
      })
    }
    
    // 控制台日志（开发环境）
    console.log('外链点击:', {
      title: link.title,
      url: link.url,
      category: link.category,
      game: game.value?.title
    })
  } catch (error) {
    console.error('外链点击追踪失败:', error)
  }
}

// 游戏类型翻译函数（响应式）
const getGameTypeTranslation = computed(() => {
  return (category) => {
    if (!category) return ''
    
    let categoryId = null
    
    // 如果category是数字ID，直接使用
    if (typeof category === 'number') {
      categoryId = category
    }
    
    // 如果category是字符串，可能是中文名称或数字字符串
    if (typeof category === 'string') {
      // 尝试转换为数字
      const parsedId = parseInt(category)
      if (!isNaN(parsedId)) {
        categoryId = parsedId
      } else {
        // 如果是中文名称，通过gameTypesCache查找对应的ID
         if (gameTypesCache) {
           const categoryInfo = gameTypesCache.find(cat => cat.name === category)
           if (categoryInfo) {
             categoryId = categoryInfo.id
           }
         }
      }
    }
    
    // 使用国际化翻译，locale.value确保响应式更新
    if (categoryId) {
      return t(`gameTypes.${categoryId}`)
    }
    
    return category // 如果没有找到对应翻译，返回原始值
  }
})
</script>

<style scoped>
.game-card {
  background-color: rgb(31 41 55);
  border-radius: 0.5rem;
  overflow: hidden;
  transition: transform 0.3s;
}

.game-card:hover {
  transform: scale(1.05);
}

.game-title {
  color: white;
  font-weight: bold;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #2563eb;
}

/* 操作说明样式 */
.controls-content {
  color: rgb(209 213 219);
}

.controls-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.controls-content li {
  margin-bottom: 0.5rem;
  padding-left: 1rem;
  position: relative;
}

.controls-content li::before {
  content: "•";
  color: #3b82f6;
  font-weight: bold;
  position: absolute;
  left: 0;
}

.controls-content p {
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #3b82f6;
}

.controls-content strong {
  color: white;
  font-weight: 600;
}
</style>