<template>
  <div class="space-y-8">
    <!-- 搜索和筛选 -->
    <div class="flex flex-wrap gap-4 items-center justify-between bg-gray-800 p-6 rounded-lg">
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
          <option value="popular">最受欢迎</option>
          <option value="newest">最新发布</option>
          <option value="rating">评分最高</option>
        </select>
      </div>
    </div>

    <!-- 游戏列表 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

// 加载所有游戏数据
const loadAllGames = async () => {
  try {
    const response = await fetch('/all-game.json')
    const data = await response.json()
    // 为每个游戏添加额外的显示属性
    games.value = await Promise.all(data.map(async (game, index) => ({
      ...game,
      id: index + 1,
      category: await getCategoryFromTags(game.tags),
      rating: (4.0 + Math.random() * 1.0).toFixed(1), // 随机生成4.0-5.0的评分
      plays: Math.floor(Math.random() * 50000) + 10000, // 随机生成游戏次数
      date: generateRandomDate() // 生成随机日期
    })))
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

// 生成随机日期
const generateRandomDate = () => {
  const start = new Date(2023, 8, 1) // 2023年9月1日
  const end = new Date(2024, 0, 31)  // 2024年1月31日
  const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime())
  return new Date(randomTime).toISOString().split('T')[0]
}

const categories = ['益智游戏', '休闲游戏', '动作游戏', '赛车游戏', '体育游戏', '模拟游戏', '策略游戏', '角色扮演']
const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('popular')
const currentPage = ref(1)
const itemsPerPage = 12

// 组件挂载时加载数据
onMounted(() => {
  loadAllGames()
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
      case 'popular':
        return b.plays - a.plays
      case 'newest':
        return new Date(b.date) - new Date(a.date)
      case 'rating':
        return b.rating - a.rating
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