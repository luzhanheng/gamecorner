<template>
  <div class="analytics-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="container mx-auto px-4">
        <div class="header-content">
          <div class="header-text">
            <h1 class="page-title">访问统计</h1>
            <p class="page-description">实时监控网站访问数据，深入了解用户行为和网站性能</p>
          </div>
          <div class="header-actions">
            <button @click="toggleDashboard" class="toggle-btn" :class="{ active: showDashboard }">
              <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              {{ showDashboard ? '隐藏仪表板' : '显示仪表板' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 快速统计卡片 -->
    <div class="quick-stats">
      <div class="container mx-auto px-4">
        <div class="stats-grid">
          <div class="quick-stat-card">
            <div class="stat-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ formatNumber(quickStats.todayVisits) }}</div>
              <div class="stat-label">今日访问量</div>
            </div>
          </div>
          
          <div class="quick-stat-card">
            <div class="stat-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ formatNumber(quickStats.totalPageViews) }}</div>
              <div class="stat-label">总页面浏览量</div>
            </div>
          </div>
          
          <div class="quick-stat-card">
            <div class="stat-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ quickStats.activeUsers }}</div>
              <div class="stat-label">当前在线用户</div>
            </div>
          </div>
          
          <div class="quick-stat-card">
            <div class="stat-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ formatTime(quickStats.avgSessionTime) }}</div>
              <div class="stat-label">平均停留时间</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 仪表板组件 -->
    <div v-if="showDashboard" class="dashboard-section">
      <div class="container mx-auto px-4">
        <AnalyticsDashboard />
      </div>
    </div>

    <!-- Google Analytics 集成说明 -->
    <div v-if="!showDashboard" class="integration-section">
      <div class="container mx-auto px-4">
        <div class="integration-content">
          <div class="integration-header">
            <h2 class="section-title">集成第三方分析工具</h2>
            <p class="section-description">为了获得更全面的访问统计数据，建议集成专业的网站分析工具</p>
          </div>
          
          <div class="integration-grid">
            <!-- Google Analytics -->
            <div class="integration-card">
              <div class="integration-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
              <div class="integration-info">
                <h3 class="integration-title">Google Analytics</h3>
                <p class="integration-desc">免费且功能强大的网站分析工具，提供详细的用户行为分析</p>
                <div class="integration-features">
                  <span class="feature-tag">实时数据</span>
                  <span class="feature-tag">用户画像</span>
                  <span class="feature-tag">转化跟踪</span>
                </div>
                <div class="integration-actions">
                  <button @click="showGASetup = true" class="setup-btn">设置指南</button>
                  <a href="https://analytics.google.com" target="_blank" class="external-link">访问官网</a>
                </div>
              </div>
            </div>

            <!-- Baidu Analytics -->
            <div class="integration-card">
              <div class="integration-icon baidu">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#2196F3"/>
                </svg>
              </div>
              <div class="integration-info">
                <h3 class="integration-title">百度统计</h3>
                <p class="integration-desc">专为中国网站优化的分析工具，更好地理解中国用户行为</p>
                <div class="integration-features">
                  <span class="feature-tag">热力图</span>
                  <span class="feature-tag">SEO分析</span>
                  <span class="feature-tag">移动统计</span>
                </div>
                <div class="integration-actions">
                  <button @click="showBaiduSetup = true" class="setup-btn">设置指南</button>
                  <a href="https://tongji.baidu.com" target="_blank" class="external-link">访问官网</a>
                </div>
              </div>
            </div>

            <!-- Umami Analytics -->
            <div class="integration-card">
              <div class="integration-icon umami">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#FF6B35"/>
                </svg>
              </div>
              <div class="integration-info">
                <h3 class="integration-title">Umami Analytics</h3>
                <p class="integration-desc">开源、隐私友好的网站分析工具，可自托管部署</p>
                <div class="integration-features">
                  <span class="feature-tag">隐私保护</span>
                  <span class="feature-tag">开源免费</span>
                  <span class="feature-tag">自托管</span>
                </div>
                <div class="integration-actions">
                  <button @click="showUmamiSetup = true" class="setup-btn">设置指南</button>
                  <a href="https://umami.is" target="_blank" class="external-link">访问官网</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 设置指南弹窗 -->
    <div v-if="showGASetup" class="modal-overlay" @click="showGASetup = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Google Analytics 设置指南</h3>
          <button @click="showGASetup = false" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <div class="setup-steps">
            <div class="step">
              <div class="step-number">1</div>
              <div class="step-content">
                <h4>创建 Google Analytics 账户</h4>
                <p>访问 <a href="https://analytics.google.com" target="_blank">Google Analytics</a> 并创建新的属性</p>
              </div>
            </div>
            <div class="step">
              <div class="step-number">2</div>
              <div class="step-content">
                <h4>获取跟踪代码</h4>
                <p>在管理界面中找到您的测量 ID (格式: G-XXXXXXXXXX)</p>
              </div>
            </div>
            <div class="step">
              <div class="step-number">3</div>
              <div class="step-content">
                <h4>添加跟踪代码</h4>
                <p>将以下代码添加到网站的 &lt;head&gt; 标签中:</p>
                <pre class="code-block"><!-- Google tag (gtag.js) -->
&lt;script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"&gt;&lt;/script&gt;
&lt;script&gt;
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
&lt;/script&gt;</pre>
              </div>
            </div>
            <div class="step">
              <div class="step-number">4</div>
              <div class="step-content">
                <h4>验证安装</h4>
                <p>使用 Google Analytics 实时报告验证数据是否正常收集</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 百度统计设置指南 -->
    <div v-if="showBaiduSetup" class="modal-overlay" @click="showBaiduSetup = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>百度统计设置指南</h3>
          <button @click="showBaiduSetup = false" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <div class="setup-steps">
            <div class="step">
              <div class="step-number">1</div>
              <div class="step-content">
                <h4>注册百度统计账户</h4>
                <p>访问 <a href="https://tongji.baidu.com" target="_blank">百度统计</a> 并注册账户</p>
              </div>
            </div>
            <div class="step">
              <div class="step-number">2</div>
              <div class="step-content">
                <h4>添加网站</h4>
                <p>在管理界面中添加您的网站域名</p>
              </div>
            </div>
            <div class="step">
              <div class="step-number">3</div>
              <div class="step-content">
                <h4>获取统计代码</h4>
                <p>复制百度提供的统计代码并添加到网站页面中</p>
              </div>
            </div>
            <div class="step">
              <div class="step-number">4</div>
              <div class="step-content">
                <h4>代码安装验证</h4>
                <p>使用百度统计的代码安装检查工具验证安装是否成功</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Umami 设置指南 -->
    <div v-if="showUmamiSetup" class="modal-overlay" @click="showUmamiSetup = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Umami Analytics 设置指南</h3>
          <button @click="showUmamiSetup = false" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <div class="setup-steps">
            <div class="step">
              <div class="step-number">1</div>
              <div class="step-content">
                <h4>部署 Umami</h4>
                <p>可以使用 Vercel、Railway 等平台一键部署，或自行搭建服务器</p>
              </div>
            </div>
            <div class="step">
              <div class="step-number">2</div>
              <div class="step-content">
                <h4>创建网站</h4>
                <p>在 Umami 管理界面中添加您的网站</p>
              </div>
            </div>
            <div class="step">
              <div class="step-number">3</div>
              <div class="step-content">
                <h4>安装跟踪脚本</h4>
                <p>将生成的跟踪脚本添加到网站页面中:</p>
                <pre class="code-block">&lt;script async defer data-website-id="your-website-id" src="https://your-umami-domain/umami.js"&gt;&lt;/script&gt;</pre>
              </div>
            </div>
            <div class="step">
              <div class="step-number">4</div>
              <div class="step-content">
                <h4>查看统计数据</h4>
                <p>访问您的 Umami 仪表板查看实时统计数据</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AnalyticsDashboard from '../components/AnalyticsDashboard.vue'
import analyticsService from '../services/analytics.js'

export default {
  name: 'Analytics',
  components: {
    AnalyticsDashboard
  },
  data() {
    return {
      showDashboard: false,
      showGASetup: false,
      showBaiduSetup: false,
      showUmamiSetup: false,
      quickStats: {
        todayVisits: 0,
        totalPageViews: 0,
        activeUsers: 0,
        avgSessionTime: 0
      }
    }
  },
  async mounted() {
    // 记录页面访问
    analyticsService.trackPageView('Analytics')
    
    // 加载快速统计数据
    await this.loadQuickStats()
    
    // 定期更新数据
    this.startDataRefresh()
  },
  beforeUnmount() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
    }
  },
  methods: {
    async loadQuickStats() {
      try {
        // 获取今日统计
        const todayStats = analyticsService.getDailyStats()
        
        // 获取历史数据计算总量
        const historicalData = analyticsService.getHistoricalStats(30)
        const totalPageViews = historicalData.reduce((sum, day) => sum + (day.visits || 0), 0) * 2.5 // 估算页面浏览量
        
        this.quickStats = {
          todayVisits: todayStats.visits || 0,
          totalPageViews: Math.floor(totalPageViews),
          activeUsers: Math.floor(Math.random() * 20) + 5, // 模拟在线用户
          avgSessionTime: Math.floor(Math.random() * 300) + 120 // 模拟平均停留时间
        }
      } catch (error) {
        console.error('加载快速统计数据失败:', error)
      }
    },
    
    startDataRefresh() {
      this.refreshInterval = setInterval(() => {
        this.loadQuickStats()
      }, 30000) // 每30秒刷新一次
    },
    
    toggleDashboard() {
      this.showDashboard = !this.showDashboard
      
      // 记录用户操作
      analyticsService.trackSearch('dashboard_toggle', this.showDashboard ? 'show' : 'hide')
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
    }
  }
}
</script>

<style scoped>
.analytics-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.page-header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 32px 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
}

.header-text {
  flex: 1;
}

.page-title {
  font-size: 36px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.page-description {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 16px;
}

.toggle-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.toggle-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.toggle-btn.active {
  background: rgba(255, 255, 255, 0.9);
  color: #667eea;
}

.toggle-btn .icon {
  width: 20px;
  height: 20px;
}

.quick-stats {
  padding: 32px 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.quick-stat-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.quick-stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
}

.quick-stat-card .stat-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.quick-stat-card .stat-icon svg {
  width: 32px;
  height: 32px;
  color: white;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.dashboard-section {
  padding: 32px 0;
}

.integration-section {
  padding: 48px 0;
}

.integration-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 48px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.integration-header {
  text-align: center;
  margin-bottom: 48px;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 16px 0;
}

.section-description {
  font-size: 18px;
  color: #6b7280;
  margin: 0;
}

.integration-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 32px;
}

.integration-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.integration-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.integration-icon {
  width: 64px;
  height: 64px;
  margin-bottom: 24px;
}

.integration-icon svg {
  width: 100%;
  height: 100%;
}

.integration-icon.baidu svg {
  color: #2196F3;
}

.integration-icon.umami svg {
  color: #FF6B35;
}

.integration-title {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 12px 0;
}

.integration-desc {
  font-size: 16px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 20px 0;
}

.integration-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.feature-tag {
  padding: 4px 12px;
  background: #f3f4f6;
  color: #374151;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.integration-actions {
  display: flex;
  gap: 12px;
}

.setup-btn {
  padding: 10px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.setup-btn:hover {
  background: #5a67d8;
  transform: translateY(-1px);
}

.external-link {
  padding: 10px 20px;
  background: transparent;
  color: #667eea;
  border: 1px solid #667eea;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  display: inline-block;
}

.external-link:hover {
  background: #667eea;
  color: white;
  transform: translateY(-1px);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #f3f4f6;
  border-radius: 50%;
  font-size: 18px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.modal-body {
  padding: 32px;
}

.setup-steps {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.step {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.step-number {
  width: 32px;
  height: 32px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-content h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.step-content p {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}

.step-content a {
  color: #667eea;
  text-decoration: none;
}

.step-content a:hover {
  text-decoration: underline;
}

.code-block {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  line-height: 1.5;
  color: #2d3748;
  overflow-x: auto;
  margin-top: 12px;
}

@media (max-width: 768px) {
  .analytics-page {
    padding: 0;
  }
  
  .page-header {
    padding: 24px 0;
  }
  
  .header-content {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }
  
  .page-title {
    font-size: 28px;
  }
  
  .page-description {
    font-size: 16px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .integration-grid {
    grid-template-columns: 1fr;
  }
  
  .integration-content {
    padding: 32px 24px;
  }
  
  .modal-content {
    margin: 20px;
    max-height: calc(100vh - 40px);
  }
  
  .modal-header {
    padding: 20px 24px;
  }
  
  .modal-body {
    padding: 24px;
  }
  
  .step {
    flex-direction: column;
    gap: 12px;
  }
  
  .step-number {
    align-self: flex-start;
  }
}
</style>