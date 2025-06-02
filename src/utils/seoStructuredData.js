/**
 * SEO结构化数据工具
 * 用于生成和管理网站的结构化数据
 */

// 网站基础信息
const SITE_CONFIG = {
  name: 'GameCorner',
  url: 'https://gamecorner.com',
  description: '免费在线游戏平台 - 提供各类精品网页游戏',
  logo: 'https://gamecorner.com/favicon.svg'
}

/**
 * 生成网站基础结构化数据
 */
export function generateWebSiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_CONFIG.url}/games?search={search_term_string}`,
      'query-input': 'required name=search_term_string'
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
      logo: {
        '@type': 'ImageObject',
        url: SITE_CONFIG.logo
      }
    }
  }
}

/**
 * 生成游戏详情页结构化数据
 * @param {Object} game - 游戏数据对象
 */
export function generateGameStructuredData(game) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: game.title,
    description: game.description || `${game.title} - 免费在线游戏`,
    image: game.image,
    url: `${SITE_CONFIG.url}/game/${game.id}`,
    gamePlatform: 'Web Browser',
    operatingSystem: 'Any',
    applicationCategory: 'Game',
    genre: game.category || 'Game',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url
    }
  }

  // 如果有评分数据，添加聚合评分
  if (game.rating && game.ratingCount) {
    structuredData.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: game.rating.toString(),
      ratingCount: game.ratingCount.toString(),
      bestRating: '5',
      worstRating: '1'
    }
  }

  // 如果有标签，添加关键词
  if (game.tags && game.tags.length > 0) {
    structuredData.keywords = game.tags.join(', ')
  }

  return structuredData
}

/**
 * 生成游戏列表页结构化数据
 * @param {Array} games - 游戏列表
 * @param {string} category - 分类名称
 * @param {string} pageUrl - 页面URL
 */
export function generateGameListStructuredData(games, category = '全部游戏', pageUrl = '') {
  // 确保games是数组类型
  if (!Array.isArray(games)) {
    console.warn('generateGameListStructuredData: games参数不是数组类型', games)
    return null
  }
  
  const itemListElement = games.slice(0, 20).map((game, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'VideoGame',
      name: game.title,
      url: `${SITE_CONFIG.url}/game/${game.id}`,
      image: game.image,
      description: game.description || `${game.title} - 免费在线游戏`
    }
  }))

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${category} - ${SITE_CONFIG.name}`,
    description: `精选${category}游戏合集，免费在线畅玩`,
    url: pageUrl || `${SITE_CONFIG.url}/games`,
    numberOfItems: games.length,
    itemListElement
  }
}

/**
 * 生成排行榜结构化数据
 * @param {Array} leaderboard - 排行榜数据
 */
export function generateLeaderboardStructuredData(leaderboard) {
  const itemListElement = leaderboard.slice(0, 10).map((record, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Person',
      name: record.playerName,
      image: record.playerAvatar,
      description: `排名第${index + 1}位，得分：${record.score}`
    }
  }))

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `游戏排行榜 - ${SITE_CONFIG.name}`,
    description: '基于玩家得分的游戏排行榜',
    url: `${SITE_CONFIG.url}/leaderboard`,
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    numberOfItems: leaderboard.length,
    itemListElement
  }
}

/**
 * 生成面包屑导航结构化数据
 * @param {Array} breadcrumbs - 面包屑数组 [{name, url}]
 */
export function generateBreadcrumbStructuredData(breadcrumbs) {
  const itemListElement = breadcrumbs.map((crumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: crumb.name,
    item: crumb.url
  }))

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement
  }
}

/**
 * 将结构化数据注入到页面头部
 * @param {Object} structuredData - 结构化数据对象
 */
export function injectStructuredData(structuredData) {
  if (typeof window === 'undefined') return

  // 移除已存在的结构化数据
  const existingScript = document.querySelector('script[type="application/ld+json"]')
  if (existingScript) {
    existingScript.remove()
  }

  // 创建新的结构化数据脚本
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(structuredData, null, 2)
  document.head.appendChild(script)
}

/**
 * 批量注入多个结构化数据
 * @param {Array} structuredDataArray - 结构化数据数组
 */
export function injectMultipleStructuredData(structuredDataArray) {
  if (typeof window === 'undefined') return

  // 移除已存在的结构化数据
  const existingScripts = document.querySelectorAll('script[type="application/ld+json"]')
  existingScripts.forEach(script => script.remove())

  // 注入新的结构化数据
  structuredDataArray.forEach((data, index) => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = `structured-data-${index}`
    script.textContent = JSON.stringify(data, null, 2)
    document.head.appendChild(script)
  })
}

/**
 * Vue 3 Composition API Hook
 * 用于在组件中便捷地使用结构化数据
 */
export function useStructuredData() {
  const injectWebSiteData = () => {
    const data = generateWebSiteStructuredData()
    injectStructuredData(data)
    return data
  }

  const injectGameData = (game) => {
    const data = generateGameStructuredData(game)
    injectStructuredData(data)
    return data
  }

  const injectGameListData = (games, category, pageUrl) => {
    const data = generateGameListStructuredData(games, category, pageUrl)
    injectStructuredData(data)
    return data
  }

  const injectLeaderboardData = (leaderboard) => {
    const data = generateLeaderboardStructuredData(leaderboard)
    injectStructuredData(data)
    return data
  }

  const injectBreadcrumbData = (breadcrumbs) => {
    const data = generateBreadcrumbStructuredData(breadcrumbs)
    injectStructuredData(data)
    return data
  }

  return {
    injectWebSiteData,
    injectGameData,
    injectGameListData,
    injectLeaderboardData,
    injectBreadcrumbData,
    injectStructuredData,
    injectMultipleStructuredData
  }
}