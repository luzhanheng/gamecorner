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
            class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
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
import { ref, computed } from 'vue'

// 游戏数据
const games = ref([
  {
    id: '1',
    title: '2048',
    description: '2048是一款数字益智游戏，通过合并相同的数字方块来获得更高分数。',
    image: '/images/game1.svg',
    category: '益智游戏',
    rating: 4.5,
    plays: 12000,
    date: '2023-10-01'
  },
  {
    id: '2',
    title: '贪吃蛇',
    description: '经典的贪吃蛇游戏，控制蛇吃掉食物来增长身体。',
    image: '/images/game2.svg',
    category: '休闲游戏',
    rating: 4.3,
    plays: 8000,
    date: '2023-09-28'
  },
  {
    id: '3',
    title: '俄罗斯方块',
    description: '经典的俄罗斯方块游戏，通过旋转和移动方块来消除行。',
    image: '/images/game3.svg',
    category: '益智游戏',
    rating: 4.4,
    plays: 15000,
    date: '2023-09-25'
  },
  {
    id: '4',
    title: 'Monster Survivors',
    description: 'Monster Survivors是一款Unity制作的生存类动作游戏。',
    image: '/images/monster-survivors.svg',
    category: '动作游戏',
    rating: 4.8,
    plays: 25000,
    date: '2023-10-15'
  },
  {
    id: '5',
    title: 'Highway Traffic',
    description: 'Highway Traffic是一款刺激的驾驶游戏，在繁忙的高速公路上驾驶。',
    image: '/images/racing-car.svg',
    category: '驾驶游戏',
    rating: 4.6,
    plays: 45000,
    date: '2023-10-12'
  },
  {
    id: '6',
    title: 'GTA Simulator',
    description: 'GTA Simulator是一款开放世界动作游戏，在虚拟城市中自由探索。',
    image: '/images/racing-car.svg',
    category: '动作游戏',
    rating: 4.7,
    plays: 38000,
    date: '2023-10-10'
  },
  {
    id: '7',
    title: 'Drift Hunters Pro',
    description: 'Drift Hunters Pro是一款专业的漂移赛车游戏。',
    image: '/images/racing-car.svg',
    category: '赛车游戏',
    rating: 4.5,
    plays: 32000,
    date: '2023-10-08'
  },
  {
    id: '8',
    title: 'Stickman Destruction',
    description: 'Stickman Destruction是一款物理破坏游戏。',
    image: '/images/monster-survivors.svg',
    category: '动作游戏',
    rating: 4.4,
    plays: 28000,
    date: '2023-10-05'
  },
  {
    id: '9',
    title: 'Real Flight Simulator',
    description: 'Real Flight Simulator是一款逼真的飞行模拟游戏。',
    image: '/images/flight-simulator.svg',
    category: '模拟游戏',
    rating: 4.3,
    plays: 22000,
    date: '2023-10-03'
  }
])

const categories = ['益智游戏', '休闲游戏', '动作游戏', '驾驶游戏', '赛车游戏', '模拟游戏']
const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('popular')
const currentPage = ref(1)
const itemsPerPage = 12

const filteredGames = computed(() => {
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

const totalPages = computed(() => 
  Math.ceil(filteredGames.value.length / itemsPerPage)
)
</script>