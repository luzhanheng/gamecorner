<template>
  <div class="space-y-12">
    <!-- 英雄区域 -->
    <section class="text-center py-16 bg-gray-800 rounded-xl">
      <h1 class="text-4xl font-game text-game-accent mb-6">欢迎来到Game Station</h1>
      <p class="text-xl text-gray-300 mb-8">探索精彩的H5游戏世界</p>
      <router-link to="/games" class="btn-primary text-lg">开始游戏</router-link>
    </section>

    <!-- 热门游戏 -->
    <section>
      <h2 class="text-2xl font-game text-game-secondary mb-6">热门游戏</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="game in hotGames" :key="game.id" class="game-card">
          <img :src="game.image" :alt="game.title" class="w-full h-48 object-cover">
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

    <!-- 排行榜预览 -->
    <section>
      <h2 class="text-2xl font-game text-game-secondary mb-6">排行榜</h2>
      <div class="bg-gray-800 rounded-lg p-6">
        <div class="space-y-4">
          <div v-for="(player, index) in topPlayers" :key="player.id"
               class="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
            <div class="flex items-center space-x-4">
              <span class="text-2xl font-game text-game-accent">#{{ index + 1 }}</span>
              <img :src="player.avatar" :alt="player.name" class="w-10 h-10 rounded-full">
              <span class="text-lg">{{ player.name }}</span>
            </div>
            <span class="text-xl font-game text-game-primary">{{ player.score }}</span>
          </div>
        </div>
        <div class="text-center mt-6">
          <router-link to="/leaderboard" class="btn-secondary">查看完整排行榜</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 热门游戏数据
const hotGames = ref([
  {
    id: '4',
    title: 'Monster Survivors',
    category: '动作游戏',
    rating: 4.8,
    plays: 25000,
    image: '/images/monster-survivors.svg'
  },
  {
    id: '5',
    title: 'Highway Traffic',
    category: '驾驶游戏',
    rating: 4.6,
    plays: 45000,
    image: '/images/racing-car.svg'
  },
  {
    id: '6',
    title: 'GTA Simulator',
    category: '动作游戏',
    rating: 4.7,
    plays: 38000,
    image: '/images/racing-car.svg'
  },
  {
    id: '7',
    title: 'Drift Hunters Pro',
    category: '赛车游戏',
    rating: 4.5,
    plays: 32000,
    image: '/images/racing-car.svg'
  },
  {
    id: '8',
    title: 'Stickman Destruction',
    category: '动作游戏',
    rating: 4.4,
    plays: 28000,
    image: '/images/monster-survivors.svg'
  },
  {
    id: '9',
    title: 'Real Flight Simulator',
    category: '模拟游戏',
    rating: 4.6,
    plays: 22000,
    image: '/images/flight-simulator.svg'
  }
])

const topPlayers = ref([
  {
    id: 1,
    name: '生存大师',
    score: 15420,
    avatar: '/images/avatar1.svg'
  },
  {
    id: 2,
    name: '游戏达人',
    score: 12800,
    avatar: '/images/avatar2.svg'
  },
  {
    id: 3,
    name: '方块专家',
    score: 10240,
    avatar: '/images/avatar3.svg'
  }
])
</script>