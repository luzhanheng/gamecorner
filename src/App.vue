<template>
  <div class="min-h-screen">
    <header class="bg-gray-800 shadow-lg">
      <nav class="container mx-auto px-4 py-6 flex items-center justify-between">
        <h1 class="text-3xl font-game text-game-accent">Game Station</h1>
        <div class="flex items-center space-x-4">
          <router-link to="/" class="btn-primary">首页</router-link>
          
          <!-- 搜索功能 -->
          <div class="w-64">
            <div class="relative">
              <input 
                v-model="searchQuery"
                type="text" 
                placeholder="搜索游戏..."
                class="w-full px-4 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-game-accent focus:ring-1 focus:ring-game-accent"
                @keyup.enter="performSearch"
              >
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <button 
                @click="performSearch"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-game-accent hover:text-game-secondary transition-colors"
              >
                <span class="text-xs font-medium">搜索</span>
              </button>
            </div>
          </div>
          
          <router-link to="/games" class="btn-primary whitespace-nowrap">所有游戏</router-link>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')

// 执行搜索
const performSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/games',
      query: {
        search: searchQuery.value.trim()
      }
    })
  }
}

onMounted(() => {
  console.log('App mounted')
})
</script>