<template>
  <div class="space-y-8">
    <!-- 排行榜标题和切换 -->
    <div class="flex items-center justify-between bg-gray-800 p-6 rounded-lg">
      <h2 class="text-2xl font-game text-game-accent">游戏排行榜</h2>
      <div class="flex gap-4">
        <button 
          v-for="period in periods" 
          :key="period.value"
          @click="selectedPeriod = period.value"
          :class="[
            'px-4 py-2 rounded-lg transition-colors',
            selectedPeriod === period.value
              ? 'bg-game-accent text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          ]"
        >
          {{ period.label }}
        </button>
      </div>
    </div>

    <!-- 游戏选择器 -->
    <div class="bg-gray-800 p-6 rounded-lg">
      <select 
        v-model="selectedGame"
        class="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-game-accent"
      >
        <option value="all">所有游戏</option>
        <option v-for="game in games" :key="game.id" :value="game.id">
          {{ game.title }}
        </option>
      </select>
    </div>

    <!-- 排行榜列表 -->
    <div class="bg-gray-800 rounded-lg overflow-hidden">
      <div class="grid grid-cols-12 gap-4 p-4 bg-gray-700 font-bold">
        <div class="col-span-1 text-center">排名</div>
        <div class="col-span-3">玩家</div>
        <div class="col-span-3">游戏</div>
        <div class="col-span-2 text-center">分数</div>
        <div class="col-span-3 text-center">达成时间</div>
      </div>

      <div class="divide-y divide-gray-700">
        <div 
          v-for="(record, index) in filteredLeaderboard" 
          :key="record.id"
          class="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-700 transition-colors"
        >
          <div class="col-span-1 text-center">
            <span 
              :class="[
                'inline-block w-8 h-8 rounded-full text-center leading-8',
                index < 3 ? 'bg-game-accent text-white' : 'bg-gray-700'
              ]"
            >
              {{ index + 1 }}
            </span>
          </div>
          <div class="col-span-3 flex items-center space-x-3">
            <img 
              v-lazy-load="record.playerAvatar" 
              :alt="record.playerName"
              class="w-10 h-10 rounded-full"
              loading="lazy"
            >
            <span>{{ record.playerName }}</span>
          </div>
          <div class="col-span-3">
            {{ record.gameName }}
          </div>
          <div class="col-span-2 text-center font-game text-game-primary">
            {{ record.score }}
          </div>
          <div class="col-span-3 text-center text-gray-400">
            {{ formatDate(record.achievedAt) }}
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
import { ref, computed, onMounted } from 'vue'
import { useStructuredData } from '../utils/seoStructuredData.js'

const { injectLeaderboardData, injectBreadcrumbData, injectMultipleStructuredData } = useStructuredData()

const periods = [
  { label: '今日', value: 'daily' },
  { label: '本周', value: 'weekly' },
  { label: '本月', value: 'monthly' },
  { label: '全部', value: 'all' }
]

const games = [
  { id: 1, title: '怪物猎人' },
  { id: 2, title: '太空冒险' },
  { id: 3, title: '魔法世界' }
]

// 模拟排行榜数据
const leaderboard = ref([
  {
    id: 1,
    playerName: '玩家一号',
    playerAvatar: '/images/avatar1.jpg',
    gameName: '怪物猎人',
    gameId: 1,
    score: 10000,
    achievedAt: '2023-10-01T15:30:00'
  },
  {
    id: 2,
    playerName: '游戏达人',
    playerAvatar: '/images/avatar2.jpg',
    gameName: '太空冒险',
    gameId: 2,
    score: 9500,
    achievedAt: '2023-10-01T14:20:00'
  },
  {
    id: 3,
    playerName: '冒险家',
    playerAvatar: '/images/avatar3.jpg',
    gameName: '魔法世界',
    gameId: 3,
    score: 9000,
    achievedAt: '2023-10-01T12:45:00'
  }
])

const selectedPeriod = ref('all')
const selectedGame = ref('all')
const currentPage = ref(1)
const itemsPerPage = 10

const filteredLeaderboard = computed(() => {
  let result = [...leaderboard.value]

  // 游戏筛选
  if (selectedGame.value !== 'all') {
    result = result.filter(record => record.gameId === selectedGame.value)
  }

  // 时间段筛选
  const now = new Date()
  switch (selectedPeriod.value) {
    case 'daily':
      result = result.filter(record => 
        new Date(record.achievedAt).toDateString() === now.toDateString()
      )
      break
    case 'weekly':
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      result = result.filter(record => 
        new Date(record.achievedAt) > weekAgo
      )
      break
    case 'monthly':
      const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
      result = result.filter(record => 
        new Date(record.achievedAt) > monthAgo
      )
      break
  }

  return result.sort((a, b) => b.score - a.score)
})

const totalPages = computed(() => 
  Math.ceil(filteredLeaderboard.value.length / itemsPerPage)
)

// 注入排行榜页结构化数据
const injectLeaderboardStructuredData = () => {
  const structuredDataList = [
    injectLeaderboardData({
      leaderboard: filteredLeaderboard.value.slice(0, 10), // 取前10名
      period: selectedPeriod.value,
      game: selectedGame.value ? games.find(g => g.id === selectedGame.value) : null
    }),
    injectBreadcrumbData([
      { name: '首页', url: '/' },
      { name: '排行榜', url: '/leaderboard' }
    ])
  ]
  
  injectMultipleStructuredData(structuredDataList)
}

onMounted(() => {
  // 注入结构化数据
  injectLeaderboardStructuredData()
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}
</script>