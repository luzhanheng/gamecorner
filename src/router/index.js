import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      title: 'GameCorner - 免费在线游戏平台',
      description: '发现最新最热门的免费在线游戏，包含动作、冒险、益智、休闲等多种类型游戏',
      keywords: '免费游戏,在线游戏,网页游戏,休闲游戏,动作游戏'
    }
  },
  {
    path: '/games',
    name: 'Games',
    component: () => import('../views/Games.vue'),
    meta: {
      title: '游戏列表 - GameCorner',
      description: '浏览所有免费在线游戏，按类型筛选找到你喜欢的游戏',
      keywords: '游戏列表,游戏分类,免费游戏,在线游戏'
    }
  },
  {
    path: '/games/category/:categoryId',
    name: 'GamesByCategory',
    component: () => import('../views/Games.vue'),
    props: true,
    meta: {
      title: '分类游戏 - GameCorner',
      description: '按游戏类型浏览免费在线游戏',
      keywords: '游戏分类,免费游戏,在线游戏'
    }
  },
  {
    path: '/leaderboard',
    name: 'Leaderboard',
    component: () => import('../views/Leaderboard.vue'),
    meta: {
      title: '排行榜 - GameCorner',
      description: '查看游戏高分排行榜，挑战最高分记录',
      keywords: '游戏排行榜,高分榜,游戏竞技'
    }
  },
  {
    path: '/game/:id/:slug?',
    name: 'GameDetail',
    component: () => import('../views/GameDetail.vue'),
    props: true,
    meta: {
      title: '游戏详情 - GameCorner',
      description: '免费在线游戏，立即开始游戏',
      keywords: '免费游戏,在线游戏,网页游戏'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 页面跳转时滚动到顶部，提升用户体验
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由守卫：处理SEO优化
router.beforeEach((to, from, next) => {
  // 处理分类路由参数
  if (to.name === 'GamesByCategory' && to.params.categoryId) {
    // 将分类ID添加到查询参数中，保持与现有逻辑兼容
    if (!to.query.categoryId) {
      next({
        ...to,
        query: { ...to.query, categoryId: to.params.categoryId }
      })
      return
    }
  }
  
  next()
})

// 路由后置守卫：更新页面标题
router.afterEach((to) => {
  // 设置默认标题，具体页面会在组件中进一步更新
  document.title = to.meta?.title || 'GameCorner - 免费在线游戏平台'
})

export default router