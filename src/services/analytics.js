// 访问量统计服务
class AnalyticsService {
  constructor() {
    this.isInitialized = false
    this.sessionId = this.generateSessionId()
    this.visitData = {
      pageViews: 0,
      sessionStart: Date.now(),
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      language: navigator.language,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }
    this.pageStartTime = Date.now()
  }

  // 初始化统计服务
  async initialize() {
    if (this.isInitialized) {
      return
    }

    try {
      // 记录访问开始
      this.trackVisitStart()
      
      // 监听页面可见性变化
      this.setupVisibilityTracking()
      
      // 监听页面卸载
      this.setupUnloadTracking()
      
      // 定期发送心跳
      this.startHeartbeat()
      
      this.isInitialized = true
      console.log('访问量统计服务已初始化')
    } catch (error) {
      console.error('初始化访问量统计服务失败:', error)
    }
  }

  // 生成会话ID
  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  // 记录访问开始
  trackVisitStart() {
    const visitData = {
      type: 'visit_start',
      sessionId: this.sessionId,
      timestamp: Date.now(),
      url: window.location.href,
      title: document.title,
      ...this.visitData
    }
    
    this.sendAnalyticsData(visitData)
    this.updateDailyStats()
  }

  // 记录页面浏览
  trackPageView(pageName, additionalData = {}) {
    this.visitData.pageViews++
    
    const pageViewData = {
      type: 'page_view',
      sessionId: this.sessionId,
      timestamp: Date.now(),
      pageName: pageName,
      url: window.location.href,
      title: document.title,
      timeOnPreviousPage: Date.now() - this.pageStartTime,
      ...additionalData
    }
    
    this.sendAnalyticsData(pageViewData)
    this.pageStartTime = Date.now()
  }

  // 记录游戏点击
  trackGameClick(gameId, gameTitle, category) {
    const gameClickData = {
      type: 'game_click',
      sessionId: this.sessionId,
      timestamp: Date.now(),
      gameId: gameId,
      gameTitle: gameTitle,
      category: category,
      url: window.location.href
    }
    
    this.sendAnalyticsData(gameClickData)
  }

  // 记录搜索行为
  trackSearch(searchQuery, resultsCount) {
    const searchData = {
      type: 'search',
      sessionId: this.sessionId,
      timestamp: Date.now(),
      query: searchQuery,
      resultsCount: resultsCount,
      url: window.location.href
    }
    
    this.sendAnalyticsData(searchData)
  }

  // 记录用户停留时间
  trackTimeOnPage() {
    const timeOnPage = Date.now() - this.pageStartTime
    
    const timeData = {
      type: 'time_on_page',
      sessionId: this.sessionId,
      timestamp: Date.now(),
      timeOnPage: timeOnPage,
      url: window.location.href
    }
    
    this.sendAnalyticsData(timeData)
  }

  // 设置页面可见性追踪
  setupVisibilityTracking() {
    let isVisible = !document.hidden
    let visibilityStart = Date.now()
    
    document.addEventListener('visibilitychange', () => {
      const now = Date.now()
      
      if (document.hidden && isVisible) {
        // 页面变为不可见
        const visibleTime = now - visibilityStart
        this.trackVisibilityChange('hidden', visibleTime)
        isVisible = false
      } else if (!document.hidden && !isVisible) {
        // 页面变为可见
        this.trackVisibilityChange('visible', 0)
        visibilityStart = now
        isVisible = true
      }
    })
  }

  // 记录页面可见性变化
  trackVisibilityChange(state, duration) {
    const visibilityData = {
      type: 'visibility_change',
      sessionId: this.sessionId,
      timestamp: Date.now(),
      state: state,
      duration: duration
    }
    
    this.sendAnalyticsData(visibilityData)
  }

  // 设置页面卸载追踪
  setupUnloadTracking() {
    const trackUnload = () => {
      this.trackTimeOnPage()
      
      const unloadData = {
        type: 'session_end',
        sessionId: this.sessionId,
        timestamp: Date.now(),
        sessionDuration: Date.now() - this.visitData.sessionStart,
        totalPageViews: this.visitData.pageViews
      }
      
      // 使用 sendBeacon 确保数据发送
      this.sendAnalyticsData(unloadData, true)
    }
    
    window.addEventListener('beforeunload', trackUnload)
    window.addEventListener('pagehide', trackUnload)
  }

  // 开始心跳检测
  startHeartbeat() {
    setInterval(() => {
      if (!document.hidden) {
        const heartbeatData = {
          type: 'heartbeat',
          sessionId: this.sessionId,
          timestamp: Date.now(),
          activeTime: Date.now() - this.visitData.sessionStart
        }
        
        this.sendAnalyticsData(heartbeatData)
      }
    }, 30000) // 每30秒发送一次心跳
  }

  // 发送统计数据
  sendAnalyticsData(data, useBeacon = false) {
    try {
      // 存储到本地存储
      this.storeLocalData(data)
      
      // 发送到服务器（这里使用模拟的端点）
      if (useBeacon && navigator.sendBeacon) {
        navigator.sendBeacon('/api/analytics', JSON.stringify(data))
      } else {
        // 模拟发送到服务器
        console.log('Analytics Data:', data)
        
        // 在实际项目中，这里应该发送到真实的分析服务器
        // fetch('/api/analytics', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify(data)
        // }).catch(error => console.error('发送统计数据失败:', error))
      }
    } catch (error) {
      console.error('发送统计数据失败:', error)
    }
  }

  // 存储本地数据
  storeLocalData(data) {
    try {
      const today = new Date().toISOString().split('T')[0]
      const storageKey = `analytics_${today}`
      
      let dailyData = JSON.parse(localStorage.getItem(storageKey) || '[]')
      dailyData.push(data)
      
      // 限制本地存储大小，只保留最近1000条记录
      if (dailyData.length > 1000) {
        dailyData = dailyData.slice(-1000)
      }
      
      localStorage.setItem(storageKey, JSON.stringify(dailyData))
    } catch (error) {
      console.error('存储本地数据失败:', error)
    }
  }

  // 更新每日统计
  updateDailyStats() {
    try {
      const today = new Date().toISOString().split('T')[0]
      const statsKey = `daily_stats_${today}`
      
      let stats = JSON.parse(localStorage.getItem(statsKey) || '{}') 
      
      stats.visits = (stats.visits || 0) + 1
      stats.lastVisit = Date.now()
      
      localStorage.setItem(statsKey, JSON.stringify(stats))
    } catch (error) {
      console.error('更新每日统计失败:', error)
    }
  }

  // 获取每日统计数据
  getDailyStats(date = null) {
    try {
      const targetDate = date || new Date().toISOString().split('T')[0]
      const statsKey = `daily_stats_${targetDate}`
      
      return JSON.parse(localStorage.getItem(statsKey) || '{}')
    } catch (error) {
      console.error('获取每日统计失败:', error)
      return {}
    }
  }

  // 获取历史统计数据
  getHistoricalStats(days = 7) {
    const stats = []
    const today = new Date()
    
    for (let i = 0; i < days; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const dayStats = this.getDailyStats(dateStr)
      stats.unshift({
        date: dateStr,
        visits: dayStats.visits || 0,
        lastVisit: dayStats.lastVisit || null
      })
    }
    
    return stats
  }

  // 清理旧数据
  cleanupOldData() {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - 30) // 保留30天数据
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && (key.startsWith('analytics_') || key.startsWith('daily_stats_'))) {
          const dateStr = key.split('_').pop()
          const keyDate = new Date(dateStr)
          
          if (keyDate < cutoffDate) {
            localStorage.removeItem(key)
          }
        }
      }
    } catch (error) {
      console.error('清理旧数据失败:', error)
    }
  }

  // 在 AnalyticsService 类中添加方法
sendToGA4(eventName, parameters) {
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, parameters)
  }
}

// 修改现有方法，同时发送到 GA4
trackGameClick(gameId, gameTitle, gameCategory) {
  const eventData = {
    gameId,
    gameTitle,
    gameCategory,
    timestamp: new Date().toISOString()
  }
  
  // 发送到本地存储（现有功能）
  this.sendAnalyticsData('game_click', eventData)
  
  // 发送到 Google Analytics
  this.sendToGA4('game_click', {
    game_id: gameId,
    game_title: gameTitle,
    game_category: gameCategory,
    value: 1
    })
  }
}

// 创建全局实例
const analyticsService = new AnalyticsService()

export default analyticsService