// 全局数据缓存服务
class DataCacheService {
  constructor() {
    this.cache = {
      allGames: null,
      gamesList: null,
      gameTypes: null
    }
    this.loadingPromises = {}
    this.isInitialized = false
  }

  // 初始化缓存，预加载所有数据
  async initialize() {
    if (this.isInitialized) {
      return
    }

    try {
      console.log('开始预加载游戏数据...')
      
      // 并行加载所有数据文件
      const promises = [
        this.loadAllGames(),
        this.loadGamesList(),
        this.loadGameTypes()
      ]

      await Promise.all(promises)
      this.isInitialized = true
      console.log('游戏数据预加载完成')
    } catch (error) {
      console.error('预加载游戏数据失败:', error)
    }
  }

  // 加载所有游戏数据
  async loadAllGames() {
    if (this.cache.allGames) {
      return this.cache.allGames
    }

    if (this.loadingPromises.allGames) {
      return this.loadingPromises.allGames
    }

    this.loadingPromises.allGames = this.fetchData('/all-game.json')
    try {
      this.cache.allGames = await this.loadingPromises.allGames
      return this.cache.allGames
    } finally {
      delete this.loadingPromises.allGames
    }
  }

  // 加载游戏列表数据
  async loadGamesList() {
    if (this.cache.gamesList) {
      return this.cache.gamesList
    }

    if (this.loadingPromises.gamesList) {
      return this.loadingPromises.gamesList
    }

    this.loadingPromises.gamesList = this.fetchData('/games-list.json')
    try {
      this.cache.gamesList = await this.loadingPromises.gamesList
      return this.cache.gamesList
    } finally {
      delete this.loadingPromises.gamesList
    }
  }

  // 加载游戏类型数据
  async loadGameTypes() {
    if (this.cache.gameTypes) {
      return this.cache.gameTypes
    }

    if (this.loadingPromises.gameTypes) {
      return this.loadingPromises.gameTypes
    }

    this.loadingPromises.gameTypes = this.fetchData('/type-game.json')
    try {
      this.cache.gameTypes = await this.loadingPromises.gameTypes
      return this.cache.gameTypes
    } finally {
      delete this.loadingPromises.gameTypes
    }
  }

  // 通用的数据获取方法
  async fetchData(url) {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error(`加载数据失败 ${url}:`, error)
      throw error
    }
  }

  // 获取缓存的数据
  getAllGames() {
    return this.cache.allGames
  }

  getGamesList() {
    return this.cache.gamesList
  }

  getHotGames() {
    return this.cache.hotGames
  }

  getGameTypes() {
    return this.cache.gameTypes
  }

  // 清除缓存
  clearCache() {
    this.cache = {
      allGames: null,
      gamesList: null,
      gameTypes: null
    }
    this.isInitialized = false
  }

  // 检查是否已初始化
  getInitializationStatus() {
    return this.isInitialized
  }
}

// 创建单例实例
const dataCacheService = new DataCacheService()

export default dataCacheService