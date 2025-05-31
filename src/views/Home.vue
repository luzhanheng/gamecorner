<template>
  <div class="space-y-12">
    <!-- 英雄区域 -->
    <section class="py-8 bg-gray-800 rounded-xl">
      <div class="text-center px-6">
        <h1 class="text-4xl lg:text-5xl font-game text-game-accent mb-4">欢迎来到Game Station</h1>
        <p class="text-xl text-gray-300">探索精彩的H5游戏世界</p>
      </div>
    </section>

    <!-- 游戏分类展示 -->
    <section>
      <h2 class="text-2xl font-game text-game-secondary mb-6">游戏分类</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div v-for="category in gameCategories" :key="category.name" 
             class="bg-gray-800 rounded-lg p-4 flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer"
             @click="goToCategory(category.name)">
          <div class="text-3xl mr-4">{{ category.icon }}</div>
          <h3 class="text-lg font-game text-game-accent">{{ category.name }}</h3>
        </div>
      </div>
    </section>

    <!-- 热门游戏 -->
    <section>
      <h2 class="text-2xl font-game text-game-secondary mb-6">热门游戏</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="game in hotGames" :key="game.id" class="game-card">
          <img :src="game.image" :alt="game.title" class="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity" @click="goToGame(game.id)">
          <div class="p-4">
            <h3 class="game-title">{{ game.title }}</h3>
            <div class="flex items-center justify-between text-sm text-gray-400 mb-2">
              <span>{{ game.category }}</span>
              <div class="flex items-center">
                <span class="text-game-accent">★</span>
                <span class="ml-1">{{ game.rating }}</span>
              </div>
            </div>
            <p class="text-gray-500 text-sm mb-4">{{ game.plays }} 次游戏</p>
            <router-link :to="`/game/${game.id}`" class="btn-primary block text-center">
              立即游戏
            </router-link>
          </div>
        </div>
      </div>
    </section>


    <!-- 最新游戏 -->
    <section>
      <h2 class="text-2xl font-game text-game-secondary mb-6">最新上线</h2>
      <div class="bg-gray-800 rounded-lg p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="game in latestGames" :key="game.id" 
               class="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors cursor-pointer"
               @click="goToGame(game.id)">
            <img :src="game.image" :alt="game.title" class="w-full h-24 object-cover rounded mb-3">
            <h4 class="text-sm font-game text-game-accent mb-1">{{ game.title }}</h4>
            <p class="text-xs text-gray-400">{{ game.category }}</p>
          </div>
        </div>
        <div class="text-center mt-6">
          <router-link to="/games" class="btn-secondary">查看更多游戏</router-link>
        </div>
      </div>
    </section>

    <!-- 特色功能 -->
    <section>
      <h2 class="text-2xl font-game text-game-secondary mb-6">为什么选择我们</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-gray-800 rounded-lg p-6 text-center">
          <div class="text-4xl mb-4">🎮</div>
          <h3 class="text-xl font-game text-game-accent mb-3">精品游戏</h3>
          <p class="text-gray-400">精心挑选的高质量H5游戏，无需下载即可畅玩</p>
        </div>
        <div class="bg-gray-800 rounded-lg p-6 text-center">
          <div class="text-4xl mb-4">⚡</div>
          <h3 class="text-xl font-game text-game-accent mb-3">极速加载</h3>
          <p class="text-gray-400">优化的游戏加载技术，让您秒进游戏世界</p>
        </div>
        <div class="bg-gray-800 rounded-lg p-6 text-center">
          <div class="text-4xl mb-4">📱</div>
          <h3 class="text-xl font-game text-game-accent mb-3">多端适配</h3>
          <p class="text-gray-400">完美支持手机、平板、电脑，随时随地畅玩</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 热门游戏数据
const hotGames = ref([])
// 最新游戏数据
const latestGames = ref([])

// 加载热门游戏数据
const loadHotGames = async () => {
  try {
    const response = await fetch('/hot-game.json')
    const data = await response.json()
    // 为每个游戏添加额外的显示属性
    hotGames.value = await Promise.all(data.map(async (game, index) => ({
      ...game,
      id: index + 1,
      category: await getCategoryFromTags(game.tags),
      rating: (4.0 + Math.random() * 1.0).toFixed(1), // 随机生成4.0-5.0的评分
      plays: Math.floor(Math.random() * 50000) + 10000 // 随机生成游戏次数
    })))
  } catch (error) {
    console.error('加载热门游戏数据失败:', error)
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

// 加载最新游戏数据
const loadLatestGames = async () => {
  try {
    const response = await fetch('/all-game.json')
    const data = await response.json()
    // 取最后4个游戏作为最新游戏
    latestGames.value = await Promise.all(data.slice(-4).map(async (game, index) => ({
      ...game,
      id: data.length - 4 + index + 1,
      category: await getCategoryFromTags(game.tags)
    })))
  } catch (error) {
    console.error('加载最新游戏数据失败:', error)
  }
}

// 游戏分类数据
const gameCategories = ref([
  { name: '益智游戏', icon: '🧩', count: 22 },
  { name: '动作游戏', icon: '⚔️', count: 18 },
  { name: '休闲游戏', icon: '🎮', count: 32 },
  { name: '赛车游戏', icon: '🏎️', count: 15 },
  { name: '体育游戏', icon: '⚽', count: 12 },
  { name: '模拟游戏', icon: '🏗️', count: 20 },
  { name: '策略游戏', icon: '♟️', count: 16 },
  { name: '角色扮演', icon: '🗡️', count: 14 }
])

// 跳转到游戏分类页面
const goToCategory = (categoryName) => {
  router.push({
    path: '/games',
    query: { category: categoryName }
  })
}

// 跳转到游戏详情页面
const goToGame = (gameId) => {
  router.push(`/game/${gameId}`)
}

// 组件挂载时加载数据
onMounted(() => {
  loadHotGames()
  loadLatestGames()
})
</script>