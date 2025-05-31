<template>
  <div class="space-y-8" v-if="game">
    <!-- 游戏标题和信息 -->
    <div class="bg-gray-800 rounded-lg overflow-hidden">
      <div class="relative">
        <img 
          :src="game.image" 
          :alt="game.title"
          class="w-full h-64 object-cover"
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
            <span>{{ game.plays }} 次游戏</span>
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
            title="全屏"
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
            <h2 class="text-2xl font-game text-game-accent mb-4">游戏说明</h2>
            <p class="text-gray-300">{{ game.description }}</p>
          </div>
        </div>
      </div>

      <!-- 侧边栏 -->
      <div class="space-y-6">
        <!-- 控制说明 -->
        <div class="bg-gray-800 rounded-lg p-6">
          <h3 class="text-xl font-game text-game-accent mb-4">操作说明</h3>
          <ul class="space-y-2 text-gray-300">
            <li v-for="(control, key) in game.controls" :key="key" class="flex items-center">
              <span class="bg-gray-700 px-2 py-1 rounded mr-2 font-game">{{ key }}</span>
              <span>{{ control }}</span>
            </li>
          </ul>
        </div>

        <!-- 最高分 -->
        <div class="bg-gray-800 rounded-lg p-6">
          <h3 class="text-xl font-game text-game-accent mb-4">最高分</h3>
          <div class="space-y-4">
            <div 
              v-for="score in topScores" 
              :key="score.id"
              class="flex items-center justify-between"
            >
              <div class="flex items-center space-x-2">
                <img 
                  :src="score.playerAvatar" 
                  :alt="score.playerName"
                  class="w-8 h-8 rounded-full"
                >
                <span class="text-gray-300">{{ score.playerName }}</span>
              </div>
              <span class="font-game text-game-primary">{{ score.score }}</span>
            </div>
          </div>
        </div>

        <!-- 分享 -->
        <div class="bg-gray-800 rounded-lg p-6">
          <h3 class="text-xl font-game text-game-accent mb-4">分享游戏</h3>
          <div class="flex space-x-4">
            <button 
              v-for="social in socials" 
              :key="social.name"
              class="flex-1 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
              @click="share(social.name)"
            >
              <i :class="social.icon"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 相关游戏推荐 -->
    <div>
      <h2 class="text-2xl font-game text-game-accent mb-6">相关游戏</h2>
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
              <span class="text-sm text-gray-400">{{ game.category }}</span>
              <a :href="`/game/${game.id}`" target="_blank" class="btn-primary text-sm">
                开始游戏
              </a>
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

const route = useRoute()
const router = useRouter()
const gameIframe = ref(null)
const allGames = ref([])
const game = ref(null)

// 跳转到游戏详情页
const goToGame = (gameId) => {
  router.push(`/game/${gameId}`)
}

// 加载所有游戏数据
const loadAllGames = async () => {
  try {
    const response = await fetch('/all-game.json')
    const data = await response.json()
    // 为每个游戏添加额外的显示属性
    allGames.value = await Promise.all(data.map(async (gameData, index) => ({
      ...gameData,
      id: index + 1,
      category: await getCategoryFromTags(gameData.tags),
      rating: (4.0 + Math.random() * 1.0).toFixed(1),
      plays: Math.floor(Math.random() * 50000) + 10000,
      gameUrl: gameData.embed, // 使用embed字段作为游戏URL
      controls: getDefaultControls(gameData.tags) // 根据标签生成默认控制说明
    })))
    
    // 数据加载完成后更新当前游戏
    updateCurrentGame()
  } catch (error) {
    console.error('加载游戏数据失败:', error)
  }
}

// 加载游戏分类配置
const loadGameTypes = async () => {
  try {
    const response = await fetch('/type-game.json')
    const gameTypes = await response.json()
    return gameTypes
  } catch (error) {
    console.error('Failed to load game types:', error)
    // 返回空数组，让调用方处理
    return []
  }
}

// 根据标签推断游戏类别
const getCategoryFromTags = async (tags) => {
  if (!tags) return '休闲游戏'
  
  // 获取游戏分类配置
  const gameTypes = await loadGameTypes()
  
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

// 根据标签生成默认控制说明
const getDefaultControls = (tags) => {
  if (!tags) return { '鼠标': '点击操作', '键盘': '方向键控制' }
  
  const tagList = tags.toLowerCase()
  if (tagList.includes('racing') || tagList.includes('car')) {
    return {
      'WASD': '控制车辆',
      '方向键': '转向',
      '空格': '刹车'
    }
  } else if (tagList.includes('action') || tagList.includes('zombie')) {
    return {
      '鼠标': '移动和瞄准',
      '点击': '攻击',
      '空格': '特殊技能'
    }
  } else if (tagList.includes('card') || tagList.includes('solitaire')) {
    return {
      '鼠标': '点击卡片',
      '拖拽': '移动卡片'
    }
  } else {
    return {
      '鼠标': '点击操作',
      '键盘': '方向键控制'
    }
  }
}

// 根据路由参数更新当前游戏
const updateCurrentGame = () => {
  if (allGames.value.length > 0) {
    const gameId = parseInt(route.params.id)
    game.value = allGames.value.find(g => g.id === gameId)
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadAllGames()
})

// 监听路由变化，当游戏ID改变时更新当前游戏
watch(() => route.params.id, () => {
  updateCurrentGame()
}, { immediate: true })

const topScores = ref([
  {
    id: 1,
    playerName: '益智大师',
    playerAvatar: '/images/avatar1.svg',
    score: 20480
  },
  {
    id: 2,
    playerName: '游戏达人',
    playerAvatar: '/images/avatar2.svg',
    score: 18432
  },
  {
    id: 3,
    playerName: '休闲玩家',
    playerAvatar: '/images/avatar3.svg',
    score: 15360
  }
])

const socials = [
  { name: 'weixin', icon: 'icon-weixin' },
  { name: 'weibo', icon: 'icon-weibo' },
  { name: 'qq', icon: 'icon-qq' }
]

// 分享功能实现
const share = (platform) => {
  const shareData = {
    title: game.value.title,
    desc: game.value.description,
    link: window.location.href,
    imgUrl: game.value.image
  }
  
  // 这里可以根据不同平台调用相应的分享API
  console.log(`分享到${platform}`, shareData)
  // TODO: 接入实际的分享SDK
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
  
  const currentGameId = parseInt(route.params.id)
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
</script>