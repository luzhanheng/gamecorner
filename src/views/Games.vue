<template>
  <div class="space-y-8">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container flex justify-center items-center py-12">
      <div class="loading-spinner animate-spin rounded-full h-12 w-12 border-b-2 border-game-accent"></div>
      <p class="ml-4 text-gray-300">正在加载游戏列表...</p>
    </div>
    
    <!-- 搜索和筛选 -->
    <div v-else class="flex flex-wrap gap-4 items-center justify-between bg-gray-800 p-6 rounded-lg">
      <div class="flex-1 min-w-[200px]">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="搜索游戏..." 
          class="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-game-accent"
        >
      </div>
      <div class="flex gap-4">
        <select 
          v-model="selectedCategory" 
          class="px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-game-accent"
        >
          <option value="">所有类别</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
        <select 
          v-model="sortBy" 
          class="px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-game-accent"
        >
          <option value="plays">最受欢迎</option>
          <option value="date">最新发布</option>
          <option value="rating">评分最高</option>
          <option value="title">按名称</option>
        </select>
      </div>
    </div>

    <!-- 游戏列表 -->
    <div v-if="!loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div 
        v-for="game in filteredGames" 
        :key="game.id" 
        class="game-card group"
      >
        <div class="relative overflow-hidden">
          <img 
            :src="game.image" 
            :alt="game.title" 
            class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
            @click="goToGame(game.id)"
          >
          <div class="absolute top-2 right-2 bg-game-accent px-2 py-1 rounded text-sm">
            {{ game.rating }}/5
          </div>
        </div>
        <div class="p-4">
          <div class="flex items-center justify-between mb-2">
            <h3 class="game-title text-xl">{{ game.title }}</h3>
            <span class="text-sm text-gray-400">{{ game.category }}</span>
          </div>
          <p class="text-gray-400 mb-4 line-clamp-2">{{ game.description }}</p>
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-400">{{ game.plays }} 次游戏</span>
              <span class="text-sm text-gray-400">·</span>
              <span class="text-sm text-gray-400">{{ game.date }}</span>
            </div>
            <router-link :to="`/game/${game.id}`" class="btn-primary text-sm">
              开始游戏
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="flex justify-center space-x-2">
      <button 
        v-for="page in totalPages" 
        :key="page"
        @click="currentPage = page"
        :class="[
          'px-4 py-2 rounded-lg',
          currentPage === page 
            ? 'bg-game-accent text-white' 
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        ]"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 跳转到游戏详情页
const goToGame = (gameId) => {
  router.push(`/game/${gameId}`)
}

// 游戏数据
const games = ref([])
const loading = ref(true)

// 全局缓存
let gamesListCache = null
let gameTypesCache = null

// 快速加载游戏列表（用于展示）
const loadGamesList = async () => {
  try {
    loading.value = true
    
    // 如果有缓存，直接使用
    if (gamesListCache) {
      games.value = gamesListCache
      loading.value = false
      return
    }
    
    // 尝试加载轻量级游戏列表
    try {
      const response = await fetch('/games-list.json')
      if (response.ok) {
        const data = await response.json()
        games.value = data
        gamesListCache = data
        loading.value = false
        return
      }
    } catch (error) {
      console.log('轻量级列表不存在，回退到完整数据加载')
    }
    
    // 回退到完整数据加载
    await loadAllGames()
  } catch (error) {
    console.error('加载游戏列表失败:', error)
    loading.value = false
  }
}

// 加载所有游戏数据（回退方案）
const loadAllGames = async () => {
  try {
    const response = await fetch('/all-game.json')
    const data = await response.json()
    
    // 预加载游戏分类配置
    if (!gameTypesCache) {
      gameTypesCache = await loadGameTypes()
    }
    
    // 批量处理游戏数据，使用同步方式提升性能
    games.value = data.map((game, index) => ({
      id: index + 1,
      title: game.title,
      image: game.image,
      description: game.description,
      category: getCategoryFromTagsSync(game.tags, gameTypesCache),
      rating: (4.0 + Math.random() * 1.0).toFixed(1),
      plays: Math.floor(Math.random() * 50000) + 10000,
      date: generateRandomDate()
    }))
    
    // 缓存处理后的数据
    gamesListCache = games.value
    loading.value = false
  } catch (error) {
    console.error('加载游戏数据失败:', error)
    loading.value = false
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

// 同步版本的分类推断（用于性能优化）
const getCategoryFromTagsSync = (tags, gameTypes) => {
  if (!tags || !gameTypes) return '休闲游戏'
  
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

// 根据标签推断游戏类别（异步版本，保持兼容）
const getCategoryFromTags = async (tags) => {
  if (!gameTypesCache) {
    gameTypesCache = await loadGameTypes()
  }
  return getCategoryFromTagsSync(tags, gameTypesCache)
}

// 生成随机日期
const generateRandomDate = () => {
  const start = new Date(2023, 8, 1) // 2023年9月1日
  const end = new Date(2024, 0, 31)  // 2024年1月31日
  const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime())
  return new Date(randomTime).toISOString().split('T')[0]
}

// 从游戏数据中动态获取分类
const categories = computed(() => {
  const uniqueCategories = [...new Set(games.value.map(game => game.category))]
  return uniqueCategories.filter(category => category && category.trim() !== '')
})
const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('plays')
const currentPage = ref(1)
const itemsPerPage = 12

// 组件挂载时加载数据
onMounted(() => {
  loadGamesList()
  // 检查URL参数并设置初始筛选条件
  if (route.query.category) {
    selectedCategory.value = route.query.category
  }
  if (route.query.search) {
    searchQuery.value = route.query.search
  }
})

// 监听路由变化
watch(() => route.query, (newQuery) => {
  if (newQuery.category) {
    selectedCategory.value = newQuery.category
  } else {
    selectedCategory.value = ''
  }
  if (newQuery.search) {
    searchQuery.value = newQuery.search
  } else if (!newQuery.category) {
    searchQuery.value = ''
  }
  // 路由变化时重置到第一页
  currentPage.value = 1
}, { immediate: true })

// 监听搜索和分类变化，重置到第一页
watch([searchQuery, selectedCategory, sortBy], () => {
  currentPage.value = 1
})

// 所有过滤后的游戏（用于计算总页数）
const allFilteredGames = computed(() => {
  let result = [...games.value]

  // 搜索过滤
  if (searchQuery.value) {
    result = result.filter(game =>
      game.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // 类别过滤
  if (selectedCategory.value) {
    result = result.filter(game => game.category === selectedCategory.value)
  }

  // 排序
  result.sort((a, b) => {
    switch (sortBy.value) {
      case 'plays':
        return b.plays - a.plays
      case 'date':
        return new Date(b.date) - new Date(a.date)
      case 'rating':
        return parseFloat(b.rating) - parseFloat(a.rating)
      case 'title':
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })

  return result
})

// 当前页显示的游戏（分页后的结果）
const filteredGames = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return allFilteredGames.value.slice(start, end)
})

const totalPages = computed(() => 
  Math.ceil(allFilteredGames.value.length / itemsPerPage)
)
</script>