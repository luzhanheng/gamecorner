<template>
  <div class="min-h-screen">
    <header class="bg-gray-800 shadow-lg">
      <nav class="container mx-auto px-4 py-6 flex items-center justify-between">
        <h1 class="text-3xl font-game text-game-accent">Game Station</h1>
        <div class="flex space-x-4">
          <router-link to="/" class="btn-primary">首页</router-link>
          <router-link to="/games" class="btn-secondary">游戏库</router-link>
          <router-link to="/leaderboard" class="btn-secondary">排行榜</router-link>
        </div>
      </nav>
    </header>

    <main class="container mx-auto px-4 py-8">
      <router-view></router-view>
    </main>

    <footer class="bg-gray-800 py-6 mt-12">
      <div class="container mx-auto px-4 text-center text-gray-400">
        <p>&copy; 2023 Game Station. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  // 可以在这里添加初始化逻辑
  console.log('App mounted')
})
</script>