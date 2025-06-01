// 性能监控工具
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      pageLoadTime: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      cumulativeLayoutShift: 0,
      firstInputDelay: 0
    }
    this.observers = []
    this.init()
  }

  init() {
    // 监听页面加载完成
    if (document.readyState === 'complete') {
      this.measurePageLoad()
    } else {
      window.addEventListener('load', () => this.measurePageLoad())
    }

    // 监听性能指标
    this.observeWebVitals()
  }

  measurePageLoad() {
    const navigation = performance.getEntriesByType('navigation')[0]
    if (navigation) {
      this.metrics.pageLoadTime = navigation.loadEventEnd - navigation.fetchStart
      console.log(`页面加载时间: ${this.metrics.pageLoadTime.toFixed(2)}ms`)
    }
  }

  observeWebVitals() {
    // First Contentful Paint (FCP)
    this.observePerformanceEntry('paint', (entries) => {
      const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint')
      if (fcpEntry) {
        this.metrics.firstContentfulPaint = fcpEntry.startTime
        console.log(`首次内容绘制: ${fcpEntry.startTime.toFixed(2)}ms`)
      }
    })

    // Largest Contentful Paint (LCP)
    this.observePerformanceEntry('largest-contentful-paint', (entries) => {
      const lastEntry = entries[entries.length - 1]
      if (lastEntry) {
        this.metrics.largestContentfulPaint = lastEntry.startTime
        console.log(`最大内容绘制: ${lastEntry.startTime.toFixed(2)}ms`)
      }
    })

    // Cumulative Layout Shift (CLS)
    this.observePerformanceEntry('layout-shift', (entries) => {
      let clsValue = 0
      entries.forEach(entry => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      })
      this.metrics.cumulativeLayoutShift = clsValue
      if (clsValue > 0) {
        console.log(`累积布局偏移: ${clsValue.toFixed(4)}`)
      }
    })

    // First Input Delay (FID)
    this.observePerformanceEntry('first-input', (entries) => {
      const firstInput = entries[0]
      if (firstInput) {
        this.metrics.firstInputDelay = firstInput.processingStart - firstInput.startTime
        console.log(`首次输入延迟: ${this.metrics.firstInputDelay.toFixed(2)}ms`)
      }
    })
  }

  observePerformanceEntry(type, callback) {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries())
      })
      observer.observe({ type, buffered: true })
      this.observers.push(observer)
    } catch (error) {
      console.warn(`无法监听性能指标 ${type}:`, error)
    }
  }

  // 测量资源加载时间
  measureResourceTiming() {
    const resources = performance.getEntriesByType('resource')
    const slowResources = resources
      .filter(resource => resource.duration > 1000) // 超过1秒的资源
      .sort((a, b) => b.duration - a.duration)

    if (slowResources.length > 0) {
      console.group('慢速资源加载:')
      slowResources.forEach(resource => {
        console.log(`${resource.name}: ${resource.duration.toFixed(2)}ms`)
      })
      console.groupEnd()
    }
  }

  // 获取性能报告
  getPerformanceReport() {
    this.measureResourceTiming()
    
    const report = {
      ...this.metrics,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      connection: this.getConnectionInfo()
    }

    return report
  }

  getConnectionInfo() {
    if ('connection' in navigator) {
      const conn = navigator.connection
      return {
        effectiveType: conn.effectiveType,
        downlink: conn.downlink,
        rtt: conn.rtt
      }
    }
    return null
  }

  // 清理观察器
  disconnect() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }
}

// 创建全局实例
const performanceMonitor = new PerformanceMonitor()

// 在页面卸载时生成报告
window.addEventListener('beforeunload', () => {
  const report = performanceMonitor.getPerformanceReport()
  console.log('性能报告:', report)
})

export default performanceMonitor