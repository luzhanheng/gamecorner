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
          <img 
            :src="game.image" 
            :alt="game.title"
            class="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
          >
          <div class="p-4">
            <h3 class="game-title text-lg">{{ game.title }}</h3>
            <div class="flex items-center justify-between mt-2">
              <span class="text-sm text-gray-400">{{ game.category }}</span>
              <router-link :to="`/game/${game.id}`" class="btn-primary text-sm">
                开始游戏
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const gameIframe = ref(null)

// 游戏数据
const games = {
  '1': {
    id: '1',
    title: '2048',
    category: '益智游戏',
    rating: 4.5,
    plays: 12000,
    image: '/images/game1.svg',
    gameUrl: '/games/2048/index.html',
    description: '2048是一款数字益智游戏，通过合并相同的数字方块来获得更高分数。每次移动时，所有方块会向同一方向滑动，相同数字的方块相撞时会合并。游戏目标是获得2048数字方块。',
    controls: {
      '↑': '向上滑动',
      '↓': '向下滑动',
      '←': '向左滑动',
      '→': '向右滑动'
    }
  },
  '2': {
    id: '2',
    title: '贪吃蛇',
    category: '休闲游戏',
    rating: 4.3,
    plays: 8000,
    image: '/images/game2.svg',
    gameUrl: '/games/snake/index.html',
    description: '经典的贪吃蛇游戏，控制蛇吃掉食物来增长身体。每吃掉一个食物，蛇的长度就会增加，同时得分增加。注意不要撞到墙壁或自己的身体！',
    controls: {
      '↑': '向上移动',
      '↓': '向下移动',
      '←': '向左移动',
      '→': '向右移动'
    }
  },
  '3': {
    id: '3',
    title: '俄罗斯方块',
    category: '益智游戏',
    rating: 4.7,
    plays: 15000,
    image: '/images/game3.svg',
    gameUrl: '/games/tetris/index.html',
    description: '经典的俄罗斯方块游戏，不同形状的方块从屏幕上方落下，玩家需要控制方块旋转和移动位置，使其填满一整行来消除方块获得分数。当方块堆积到屏幕顶部时游戏结束。',
    controls: {
      '↑': '旋转方块',
      '↓': '加速下落',
      '←': '向左移动',
      '→': '向右移动'
    }
  },
  '4': {
    id: '4',
    title: 'Monster Survivors',
    category: '动作游戏',
    rating: 4.8,
    plays: 25000,
    image: '/images/monster-survivors.svg',
    gameUrl: 'https://cloud.onlinegames.io/games/2025/unity/monster-survivors/index-og.html',
    description: 'Monster Survivors是一款Unity制作的生存类动作游戏。玩家需要在无尽的怪物潮中生存尽可能长的时间，收集武器和升级来增强自己的战斗能力。游戏具有丰富的武器系统和升级机制。',
    controls: {
      '鼠标': '移动和瞄准',
      '点击': '攻击',
      '空格': '特殊技能'
    }
  },
  '5': {
    id: '5',
    title: 'Highway Traffic',
    category: '驾驶游戏',
    rating: 4.6,
    plays: 45000,
    image: '/images/racing-car.svg',
    gameUrl: 'https://www.onlinegames.io/games/2022/unity/highway-traffic/index.html',
    description: 'Highway Traffic是一款刺激的驾驶游戏，玩家需要在繁忙的高速公路上驾驶，避免与其他车辆碰撞。游戏具有逼真的3D图形和流畅的驾驶体验。',
    controls: {
      'WASD': '控制车辆',
      '方向键': '转向',
      '空格': '刹车'
    }
  },
  '6': {
    id: '6',
    title: 'GTA Simulator',
    category: '动作游戏',
    rating: 4.7,
    plays: 38000,
    image: '/images/racing-car.svg',
    gameUrl: 'https://www.onlinegames.io/games/2023/unity/gta-simulator/index.html',
    description: 'GTA Simulator是一款开放世界动作游戏，玩家可以在虚拟城市中自由探索，完成各种任务和挑战。游戏提供了丰富的载具和武器选择。',
    controls: {
      'WASD': '移动角色',
      '鼠标': '视角控制',
      'F': '进入/离开载具',
      'Shift': '奔跑'
    }
  },
  '7': {
    id: '7',
    title: 'Drift Hunters Pro',
    category: '赛车游戏',
    rating: 4.5,
    plays: 32000,
    image: '/images/racing-car.svg',
    gameUrl: 'https://www.onlinegames.io/games/2023/unity/drift-hunters-pro/index.html',
    description: 'Drift Hunters Pro是一款专业的漂移赛车游戏，提供多种可升级的车辆和赛道。玩家可以自定义车辆并在不同环境中展示漂移技巧。',
    controls: {
      'WASD': '控制车辆',
      '空格': '手刹',
      'C': '切换视角',
      'R': '重置车辆'
    }
  },
  '8': {
    id: '8',
    title: 'Stickman Destruction',
    category: '动作游戏',
    rating: 4.4,
    plays: 28000,
    image: '/images/monster-survivors.svg',
    gameUrl: 'https://www.onlinegames.io/games/2023/unity/stickman-destruction/index.html',
    description: 'Stickman Destruction是一款物理破坏游戏，玩家控制火柴人进行各种危险的特技和破坏活动。游戏具有逼真的物理引擎和搞笑的动画效果。',
    controls: {
      '方向键': '控制火柴人',
      '空格': '跳跃',
      'R': '重新开始'
    }
  },
  '9': {
    id: '9',
    title: 'Real Flight Simulator',
    category: '模拟游戏',
    rating: 4.6,
    plays: 22000,
    image: '/images/flight-simulator.svg',
    gameUrl: 'https://www.onlinegames.io/games/2023/unity/real-flight-simulator/index.html',
    description: 'Real Flight Simulator是一款逼真的飞行模拟游戏，提供多种飞机和详细的驾驶舱视图。玩家可以体验真实的飞行操作和导航系统。',
    controls: {
      'WASD': '控制飞机',
      '鼠标': '视角控制',
      'F': '起落架',
      'G': '引擎启动'
    }
  }
}

// 根据路由参数获取当前游戏数据
const game = computed(() => games[route.params.id])

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

// 获取除当前游戏外的其他游戏作为相关游戏
const relatedGames = computed(() => 
  Object.values(games)
    .filter(g => g.id !== route.params.id)
    .slice(0, 4) // 只显示4个相关游戏
    .map(g => ({
      id: g.id,
      title: g.title,
      category: g.category,
      image: g.image,
      rating: g.rating,
      plays: g.plays
    }))
)
</script>