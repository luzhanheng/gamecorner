/**
 * 首页数据缓存服务
 * 专门为首页优化，只加载必要的热门游戏和新游戏数据
 * 实现快速首页加载，games-list.json异步加载
 */

class HomeDataCacheService {
  constructor() {
    this.cache = {
      hotGames: null,
      newGames: null,
      gameTypes: null,
      fullGamesList: null // 完整游戏列表，异步加载
    }
    this.loadingPromises = {}
    this.isInitialized = false
  }

  /**
   * 初始化首页必要数据
   * 只加载热门游戏、新游戏和游戏分类，不加载完整列表
   */
  async initializeHome() {
    if (this.isInitialized) {
      return {
        hotGames: this.cache.hotGames,
        newGames: this.cache.newGames,
        gameTypes: this.cache.gameTypes
      }
    }

    try {
      console.log('🏠 开始加载首页核心数据...')
      const startTime = performance.now()
      
      // 并行加载核心数据
      const [hotGames, newGames, gameTypes] = await Promise.all([
        this.loadHotGames(),
        this.loadNewGames(), 
        this.loadGameTypes()
      ])
      
      this.cache.hotGames = hotGames
      this.cache.newGames = newGames
      this.cache.gameTypes = gameTypes
      this.isInitialized = true
      
      const loadTime = Math.round(performance.now() - startTime)
      console.log(`✅ 首页核心数据加载完成，耗时: ${loadTime}ms`)
      console.log(`📊 热门游戏: ${hotGames.length}个, 新游戏: ${newGames.length}个`)
      
      // 异步预加载完整游戏列表（不阻塞首页渲染）
      this.preloadFullGamesList()
      
      return {
        hotGames,
        newGames,
        gameTypes
      }
    } catch (error) {
      console.error('❌ 首页数据加载失败:', error)
      throw error
    }
  }

  /**
   * 加载热门游戏数据
   * 从games-list.json中筛选isHot=true的游戏
   */
  async loadHotGames() {
    if (this.cache.hotGames) {
      return this.cache.hotGames
    }

    if (this.loadingPromises.hotGames) {
      return this.loadingPromises.hotGames
    }

    this.loadingPromises.hotGames = this.fetchHotGamesFromList()
    try {
      const hotGames = await this.loadingPromises.hotGames
      this.cache.hotGames = hotGames
      return hotGames
    } finally {
      delete this.loadingPromises.hotGames
    }
  }

  /**
   * 加载新游戏数据
   * 从games-list.json中筛选isNew=true的游戏，取前4个
   */
  async loadNewGames() {
    if (this.cache.newGames) {
      return this.cache.newGames
    }

    if (this.loadingPromises.newGames) {
      return this.loadingPromises.newGames
    }

    this.loadingPromises.newGames = this.fetchNewGamesFromList()
    try {
      const newGames = await this.loadingPromises.newGames
      this.cache.newGames = newGames
      return newGames
    } finally {
      delete this.loadingPromises.newGames
    }
  }

  /**
   * 加载游戏分类数据
   */
  async loadGameTypes() {
    if (this.cache.gameTypes) {
      return this.cache.gameTypes
    }

    if (this.loadingPromises.gameTypes) {
      return this.loadingPromises.gameTypes
    }

    this.loadingPromises.gameTypes = this.fetchData('/type-game.json')
    try {
      const gameTypes = await this.loadingPromises.gameTypes
      this.cache.gameTypes = gameTypes
      return gameTypes
    } finally {
      delete this.loadingPromises.gameTypes
    }
  }

  /**
   * 从games-list.json中获取热门游戏
   */
  async fetchHotGamesFromList() {
    try {
      const gamesList = await this.fetchData('/games-list.json')
      const hotGames = gamesList.filter(game => game.isHot === true)
      console.log(`🔥 找到 ${hotGames.length} 个热门游戏`)
      return hotGames
    } catch (error) {
      console.error('获取热门游戏失败:', error)
      return []
    }
  }

  /**
   * 从games-list.json中获取新游戏
   */
  async fetchNewGamesFromList() {
    try {
      const gamesList = await this.fetchData('/games-list.json')
      const newGames = gamesList.filter(game => game.isNew === true).slice(0, 4)
      console.log(`🆕 找到 ${newGames.length} 个新游戏`)
      return newGames
    } catch (error) {
      console.error('获取新游戏失败:', error)
      return []
    }
  }

  /**
   * 异步预加载完整游戏列表
   * 不阻塞首页渲染，在后台静默加载
   */
  async preloadFullGamesList() {
    if (this.cache.fullGamesList || this.loadingPromises.fullGamesList) {
      return
    }

    console.log('🔄 开始异步预加载完整游戏列表...')
    
    this.loadingPromises.fullGamesList = this.fetchData('/games-list.json')
    
    try {
      const fullList = await this.loadingPromises.fullGamesList
      this.cache.fullGamesList = fullList
      console.log(`✅ 完整游戏列表预加载完成，共 ${fullList.length} 个游戏`)
      
      // 触发自定义事件，通知其他组件数据已准备好
      window.dispatchEvent(new CustomEvent('fullGamesListReady', {
        detail: { count: fullList.length }
      }))
    } catch (error) {
      console.error('❌ 完整游戏列表预加载失败:', error)
    } finally {
      delete this.loadingPromises.fullGamesList
    }
  }

  /**
   * 获取完整游戏列表
   * 如果已缓存则直接返回，否则立即加载
   */
  async getFullGamesList() {
    if (this.cache.fullGamesList) {
      return this.cache.fullGamesList
    }

    if (this.loadingPromises.fullGamesList) {
      return this.loadingPromises.fullGamesList
    }

    console.log('📋 立即加载完整游戏列表...')
    this.loadingPromises.fullGamesList = this.fetchData('/games-list.json')
    
    try {
      const fullList = await this.loadingPromises.fullGamesList
      this.cache.fullGamesList = fullList
      return fullList
    } finally {
      delete this.loadingPromises.fullGamesList
    }
  }

  /**
   * 检查完整游戏列表是否已加载
   */
  isFullGamesListReady() {
    return !!this.cache.fullGamesList
  }

  /**
   * 获取缓存统计信息
   */
  getCacheStats() {
    return {
      hotGamesCount: this.cache.hotGames?.length || 0,
      newGamesCount: this.cache.newGames?.length || 0,
      gameTypesCount: this.cache.gameTypes?.length || 0,
      fullGamesListCount: this.cache.fullGamesList?.length || 0,
      isFullListReady: this.isFullGamesListReady(),
      isInitialized: this.isInitialized
    }
  }

  /**
   * 清除缓存
   */
  clearCache() {
    this.cache = {
      hotGames: null,
      newGames: null,
      gameTypes: null,
      fullGamesList: null
    }
    this.loadingPromises = {}
    this.isInitialized = false
    console.log('🗑️ 首页数据缓存已清除')
  }

  /**
   * 通用数据获取方法
   */
  async fetchData(url) {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error(`数据获取失败 ${url}:`, error)
      throw error
    }
  }
}

// 创建单例实例
const homeDataCacheService = new HomeDataCacheService()

export default homeDataCacheService