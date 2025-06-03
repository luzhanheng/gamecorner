<template>
  <div class="analytics-dashboard">
    <!-- 仪表板头部 -->
    <div class="dashboard-header">
      <h2 class="dashboard-title">
        <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
        网站访问统计
      </h2>
      <div class="dashboard-controls">
        <select v-model="selectedPeriod" @change="updateData" class="period-select">
          <option value="7">最近7天</option>
          <option value="14">最近14天</option>
          <option value="30">最近30天</option>
        </select>
        <button @click="exportData" class="export-btn">
          <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          导出数据
        </button>
        <button @click="refreshData" class="refresh-btn">
          <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          刷新
        </button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon visits">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ formatNumber(totalStats.visits) }}</div>
          <div class="stat-label">总访问量</div>
          <div class="stat-change" :class="{ positive: visitsTrend > 0, negative: visitsTrend < 0 }">
            <span v-if="visitsTrend > 0">↗</span>
            <span v-else-if="visitsTrend < 0">↘</span>
            <span v-else>→</span>
            {{ Math.abs(visitsTrend) }}%
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon pageviews">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ formatNumber(totalStats.pageViews) }}</div>
          <div class="stat-label">页面浏览量</div>
          <div class="stat-change" :class="{ positive: pageViewsTrend > 0, negative: pageViewsTrend < 0 }">
            <span v-if="pageViewsTrend > 0">↗</span>
            <span v-else-if="pageViewsTrend < 0">↘</span>
            <span v-else>→</span>
            {{ Math.abs(pageViewsTrend) }}%
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon sessions">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ formatTime(totalStats.avgSessionDuration) }}</div>
          <div class="stat-label">平均停留时间</div>
          <div class="stat-change" :class="{ positive: sessionTrend > 0, negative: sessionTrend < 0 }">
            <span v-if="sessionTrend > 0">↗</span>
            <span v-else-if="sessionTrend < 0">↘</span>
            <span v-else>→</span>
            {{ Math.abs(sessionTrend) }}%
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon bounce">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ totalStats.bounceRate }}%</div>
          <div class="stat-label">跳出率</div>
          <div class="stat-change" :class="{ positive: bounceTrend < 0, negative: bounceTrend > 0 }">
            <span v-if="bounceTrend > 0">↗</span>
            <span v-else-if="bounceTrend < 0">↘</span>
            <span v-else>→</span>
            {{ Math.abs(bounceTrend) }}%
          </div>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="charts-section">
      <!-- 访问量趋势图 -->
      <div class="chart-container">
        <h3 class="chart-title">访问量趋势</h3>
        <div class="chart-wrapper">
          <canvas ref="visitsChart" class="chart-canvas"></canvas>
        </div>
      </div>

      <!-- 热门页面 -->
      <div class="chart-container">
        <h3 class="chart-title">热门页面</h3>
        <div class="popular-pages">
          <div v-for="(page, index) in popularPages" :key="index" class="page-item">
            <div class="page-rank">{{ index + 1 }}</div>
            <div class="page-info">
              <div class="page-title">{{ page.title }}</div>
              <div class="page-url">{{ page.url }}</div>
            </div>
            <div class="page-stats">
              <div class="page-views">{{ formatNumber(page.views) }} 次浏览</div>
              <div class="page-bar">
                <div class="page-bar-fill" :style="{ width: (page.views / popularPages[0].views * 100) + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 详细数据表格 -->
    <div class="data-table-section">
      <h3 class="section-title">详细数据</h3>
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>日期</th>
              <th>访问量</th>
              <th>页面浏览量</th>
              <th>平均停留时间</th>
              <th>跳出率</th>
              <th>新访客比例</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="day in dailyData" :key="day.date">
              <td>{{ formatDate(day.date) }}</td>
              <td>{{ formatNumber(day.visits) }}</td>
              <td>{{ formatNumber(day.pageViews) }}</td>
              <td>{{ formatTime(day.avgSessionDuration) }}</td>
              <td>{{ day.bounceRate }}%</td>
              <td>{{ day.newVisitorRate }}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 实时数据 -->
    <div class="realtime-section">
      <h3 class="section-title">实时数据</h3>
      <div class="realtime-stats">
        <div class="realtime-item">
          <div class="realtime-label">当前在线用户</div>
          <div class="realtime-value">{{ realtimeStats.activeUsers }}</div>
        </div>
        <div class="realtime-item">
          <div class="realtime-label">今日访问量</div>
          <div class="realtime-value">{{ realtimeStats.todayVisits }}</div>
        </div>
        <div class="realtime-item">
          <div class="realtime-label">今日页面浏览量</div>
          <div class="realtime-value">{{ realtimeStats.todayPageViews }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import analyticsService from '../services/analytics.js'

export default {
  name: 'AnalyticsDashboard',
  data() {
    return {
      selectedPeriod: '7',
      totalStats: {
        visits: 0,
        pageViews: 0,
        avgSessionDuration: 0,
        bounceRate: 0
      },
      visitsTrend: 0,
      pageViewsTrend: 0,
      sessionTrend: 0,
      bounceTrend: 0,
      dailyData: [],
      popularPages: [],
      realtimeStats: {
        activeUsers: 0,
        todayVisits: 0,
        todayPageViews: 0
      },
      visitsChart: null,
      refreshInterval: null
    }
  },
  mounted() {
    this.initDashboard()
    this.startRealtimeUpdates()
  },
  beforeUnmount() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
    }
  },
  methods: {
    async initDashboard() {
      await this.updateData()
      this.createVisitsChart()
    },

    async updateData() {
      try {
        // 获取历史统计数据
        const historicalData = analyticsService.getHistoricalStats(parseInt(this.selectedPeriod))
        this.dailyData = historicalData
        
        // 计算总统计
        this.calculateTotalStats()
        
        // 计算趋势
        this.calculateTrends()
        
        // 获取热门页面数据
        this.getPopularPages()
        
        // 更新图表
        if (this.visitsChart) {
          this.updateVisitsChart()
        }
      } catch (error) {
        console.error('更新数据失败:', error)
      }
    },

    calculateTotalStats() {
      const total = this.dailyData.reduce((acc, day) => {
        acc.visits += day.visits || 0
        acc.pageViews += day.pageViews || 0
        acc.sessionDuration += day.avgSessionDuration || 0
        acc.bounceRate += day.bounceRate || 0
        return acc
      }, { visits: 0, pageViews: 0, sessionDuration: 0, bounceRate: 0 })
      
      const days = this.dailyData.length || 1
      
      this.totalStats = {
        visits: total.visits,
        pageViews: total.pageViews,
        avgSessionDuration: Math.round(total.sessionDuration / days),
        bounceRate: Math.round(total.bounceRate / days)
      }
    },

    calculateTrends() {
      if (this.dailyData.length < 2) {
        this.visitsTrend = 0
        this.pageViewsTrend = 0
        this.sessionTrend = 0
        this.bounceTrend = 0
        return
      }
      
      const halfPoint = Math.floor(this.dailyData.length / 2)
      const firstHalf = this.dailyData.slice(0, halfPoint)
      const secondHalf = this.dailyData.slice(halfPoint)
      
      const firstHalfAvg = {
        visits: firstHalf.reduce((sum, day) => sum + (day.visits || 0), 0) / firstHalf.length,
        pageViews: firstHalf.reduce((sum, day) => sum + (day.pageViews || 0), 0) / firstHalf.length,
        sessionDuration: firstHalf.reduce((sum, day) => sum + (day.avgSessionDuration || 0), 0) / firstHalf.length,
        bounceRate: firstHalf.reduce((sum, day) => sum + (day.bounceRate || 0), 0) / firstHalf.length
      }
      
      const secondHalfAvg = {
        visits: secondHalf.reduce((sum, day) => sum + (day.visits || 0), 0) / secondHalf.length,
        pageViews: secondHalf.reduce((sum, day) => sum + (day.pageViews || 0), 0) / secondHalf.length,
        sessionDuration: secondHalf.reduce((sum, day) => sum + (day.avgSessionDuration || 0), 0) / secondHalf.length,
        bounceRate: secondHalf.reduce((sum, day) => sum + (day.bounceRate || 0), 0) / secondHalf.length
      }
      
      this.visitsTrend = firstHalfAvg.visits > 0 ? Math.round(((secondHalfAvg.visits - firstHalfAvg.visits) / firstHalfAvg.visits) * 100) : 0
      this.pageViewsTrend = firstHalfAvg.pageViews > 0 ? Math.round(((secondHalfAvg.pageViews - firstHalfAvg.pageViews) / firstHalfAvg.pageViews) * 100) : 0
      this.sessionTrend = firstHalfAvg.sessionDuration > 0 ? Math.round(((secondHalfAvg.sessionDuration - firstHalfAvg.sessionDuration) / firstHalfAvg.sessionDuration) * 100) : 0
      this.bounceTrend = firstHalfAvg.bounceRate > 0 ? Math.round(((secondHalfAvg.bounceRate - firstHalfAvg.bounceRate) / firstHalfAvg.bounceRate) * 100) : 0
    },

    getPopularPages() {
      // 模拟热门页面数据
      this.popularPages = [
        { title: '首页', url: '/', views: 1250 },
        { title: '游戏列表', url: '/games', views: 890 },
        { title: 'Apocalypse Truck', url: '/game/1', views: 567 },
        { title: 'Kick the Pirate', url: '/game/2', views: 445 },
        { title: 'Julie Beauty Salon', url: '/game/3', views: 334 }
      ]
    },

    createVisitsChart() {
      const canvas = this.$refs.visitsChart
      if (!canvas) return
      
      const ctx = canvas.getContext('2d')
      const data = this.dailyData.map(day => day.visits || 0)
      const labels = this.dailyData.map(day => this.formatDate(day.date, true))
      
      // 简单的图表绘制
      this.drawLineChart(ctx, canvas, data, labels)
    },

    updateVisitsChart() {
      this.createVisitsChart()
    },

    drawLineChart(ctx, canvas, data, labels) {
      const width = canvas.width = canvas.offsetWidth * 2
      const height = canvas.height = canvas.offsetHeight * 2
      ctx.scale(2, 2)
      
      const padding = 40
      const chartWidth = width / 2 - padding * 2
      const chartHeight = height / 2 - padding * 2
      
      // 清空画布
      ctx.clearRect(0, 0, width / 2, height / 2)
      
      if (data.length === 0) return
      
      const maxValue = Math.max(...data) || 1
      const stepX = chartWidth / (data.length - 1 || 1)
      
      // 绘制网格线
      ctx.strokeStyle = '#374151'
      ctx.lineWidth = 0.5
      
      // 水平网格线
      for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i
        ctx.beginPath()
        ctx.moveTo(padding, y)
        ctx.lineTo(padding + chartWidth, y)
        ctx.stroke()
      }
      
      // 垂直网格线
      for (let i = 0; i < data.length; i++) {
        const x = padding + stepX * i
        ctx.beginPath()
        ctx.moveTo(x, padding)
        ctx.lineTo(x, padding + chartHeight)
        ctx.stroke()
      }
      
      // 绘制数据线
      ctx.strokeStyle = '#10B981'
      ctx.lineWidth = 2
      ctx.beginPath()
      
      data.forEach((value, index) => {
        const x = padding + stepX * index
        const y = padding + chartHeight - (value / maxValue) * chartHeight
        
        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      
      ctx.stroke()
      
      // 绘制数据点
      ctx.fillStyle = '#10B981'
      data.forEach((value, index) => {
        const x = padding + stepX * index
        const y = padding + chartHeight - (value / maxValue) * chartHeight
        
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fill()
      })
      
      // 绘制标签
      ctx.fillStyle = '#9CA3AF'
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'center'
      
      labels.forEach((label, index) => {
        const x = padding + stepX * index
        ctx.fillText(label, x, height / 2 - 10)
      })
    },

    startRealtimeUpdates() {
      this.updateRealtimeStats()
      this.refreshInterval = setInterval(() => {
        this.updateRealtimeStats()
      }, 30000) // 每30秒更新一次
    },

    updateRealtimeStats() {
      // 模拟实时数据
      const today = analyticsService.getDailyStats()
      this.realtimeStats = {
        activeUsers: Math.floor(Math.random() * 50) + 10,
        todayVisits: today.visits || 0,
        todayPageViews: (today.visits || 0) * (Math.random() * 3 + 1)
      }
    },

    refreshData() {
      this.updateData()
    },

    exportData() {
      try {
        const exportData = {
          period: this.selectedPeriod,
          totalStats: this.totalStats,
          dailyData: this.dailyData,
          popularPages: this.popularPages,
          exportDate: new Date().toISOString()
        }
        
        const dataStr = JSON.stringify(exportData, null, 2)
        const dataBlob = new Blob([dataStr], { type: 'application/json' })
        
        const link = document.createElement('a')
        link.href = URL.createObjectURL(dataBlob)
        link.download = `analytics-${new Date().toISOString().split('T')[0]}.json`
        link.click()
        
        URL.revokeObjectURL(link.href)
      } catch (error) {
        console.error('导出数据失败:', error)
      }
    },

    formatNumber(num) {
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M'
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K'
      }
      return num.toString()
    },

    formatTime(seconds) {
      if (seconds < 60) {
        return seconds + 's'
      } else if (seconds < 3600) {
        return Math.floor(seconds / 60) + 'm ' + (seconds % 60) + 's'
      } else {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        return hours + 'h ' + minutes + 'm'
      }
    },

    formatDate(dateStr, short = false) {
      const date = new Date(dateStr)
      if (short) {
        return (date.getMonth() + 1) + '/' + date.getDate()
      }
      return date.toLocaleDateString('zh-CN')
    }
  }
}
</script>

<style scoped>
.analytics-dashboard {
  padding: 24px;
  background: #f9fafb;
  min-height: 100vh;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.dashboard-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.dashboard-title .icon {
  width: 32px;
  height: 32px;
  color: #10b981;
}

.dashboard-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.period-select {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  font-size: 14px;
  color: #374151;
}

.export-btn, .refresh-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.export-btn:hover, .refresh-btn:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.export-btn .icon, .refresh-btn .icon {
  width: 16px;
  height: 16px;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon svg {
  width: 32px;
  height: 32px;
  color: white;
}

.stat-icon.visits {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.pageviews {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-icon.sessions {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-icon.bounce {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
}

.stat-change {
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-change.positive {
  color: #10b981;
}

.stat-change.negative {
  color: #ef4444;
}

.charts-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

.chart-container {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 20px 0;
}

.chart-wrapper {
  position: relative;
  height: 300px;
}

.chart-canvas {
  width: 100%;
  height: 100%;
}

.popular-pages {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s;
}

.page-item:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.page-rank {
  width: 32px;
  height: 32px;
  background: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #374151;
  flex-shrink: 0;
}

.page-info {
  flex: 1;
  min-width: 0;
}

.page-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.page-url {
  font-size: 12px;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.page-stats {
  text-align: right;
  min-width: 100px;
}

.page-views {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
}

.page-bar {
  width: 100px;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
}

.page-bar-fill {
  height: 100%;
  background: #10b981;
  transition: width 0.3s ease;
}

.data-table-section, .realtime-section {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 20px 0;
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.data-table th {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.data-table td {
  color: #6b7280;
  font-size: 14px;
}

.realtime-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
}

.realtime-item {
  text-align: center;
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
}

.realtime-label {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
}

.realtime-value {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
}

@media (max-width: 768px) {
  .analytics-dashboard {
    padding: 16px;
  }
  
  .dashboard-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .dashboard-controls {
    justify-content: center;
  }
  
  .charts-section {
    grid-template-columns: 1fr;
  }
  
  .stats-cards {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    flex-direction: column;
    text-align: center;
  }
  
  .realtime-stats {
    grid-template-columns: 1fr;
  }
}
</style>