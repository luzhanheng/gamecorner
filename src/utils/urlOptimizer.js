/**
 * URL优化工具
 * 用于生成SEO友好的URL和处理URL相关的优化
 */

/**
 * 将中文字符串转换为URL友好的slug
 * @param {string} text - 需要转换的文本
 * @returns {string} - URL友好的slug
 */
export const createSlug = (text) => {
  if (!text) return ''
  
  return text
    .toLowerCase()
    .replace(/[\s\u4e00-\u9fff]+/g, '-') // 将空格和中文字符替换为连字符
    .replace(/[^\w\-一-鿿]/g, '') // 移除特殊字符，保留中文
    .replace(/\-+/g, '-') // 合并多个连字符
    .replace(/^\-|\-$/g, '') // 移除开头和结尾的连字符
}

/**
 * 生成游戏详情页的SEO友好URL
 * @param {Object} game - 游戏对象
 * @returns {string} - SEO友好的URL路径
 */
export const generateGameUrl = (game) => {
  if (!game || !game.id) return '/games'
  
  const slug = createSlug(game.title || game.name || '')
  return slug ? `/game/${game.id}/${slug}` : `/game/${game.id}`
}

/**
 * 生成游戏分类页面的SEO友好URL
 * @param {Object} category - 分类对象
 * @returns {string} - SEO友好的URL路径
 */
export const generateCategoryUrl = (category) => {
  if (!category || !category.id) return '/games'
  
  const slug = createSlug(category.name || '')
  return slug ? `/games/category/${category.id}/${slug}` : `/games/category/${category.id}`
}

/**
 * 从URL中提取游戏ID
 * @param {string} path - URL路径
 * @returns {string|null} - 游戏ID
 */
export const extractGameIdFromUrl = (path) => {
  const match = path.match(/\/game\/(\d+)/)
  return match ? match[1] : null
}

/**
 * 从URL中提取分类ID
 * @param {string} path - URL路径
 * @returns {string|null} - 分类ID
 */
export const extractCategoryIdFromUrl = (path) => {
  const match = path.match(/\/games\/category\/(\d+)/)
  return match ? match[1] : null
}

/**
 * 生成面包屑导航数据
 * @param {Object} route - 当前路由对象
 * @param {Object} gameData - 游戏数据（可选）
 * @param {Object} categoryData - 分类数据（可选）
 * @returns {Array} - 面包屑导航数组
 */
export const generateBreadcrumbs = (route, gameData = null, categoryData = null) => {
  const breadcrumbs = [{ name: '首页', url: '/' }]
  
  switch (route.name) {
    case 'Games':
    case 'GamesByCategory':
      breadcrumbs.push({ name: '游戏列表', url: '/games' })
      if (categoryData) {
        breadcrumbs.push({
          name: categoryData.name,
          url: generateCategoryUrl(categoryData)
        })
      }
      break
      
    case 'GameDetail':
    case 'GameDetailWithSlug':
      breadcrumbs.push({ name: '游戏列表', url: '/games' })
      if (gameData) {
        if (gameData.category && categoryData) {
          breadcrumbs.push({
            name: categoryData.name,
            url: generateCategoryUrl(categoryData)
          })
        }
        breadcrumbs.push({
          name: gameData.title || gameData.name,
          url: generateGameUrl(gameData)
        })
      }
      break
      
    case 'Leaderboard':
      breadcrumbs.push({ name: '排行榜', url: '/leaderboard' })
      break
  }
  
  return breadcrumbs
}

/**
 * 更新页面标题和meta信息
 * @param {Object} route - 当前路由对象
 * @param {Object} data - 页面数据（游戏、分类等）
 */
export const updatePageMeta = (route, data = {}) => {
  const { game, category } = data
  
  let title = route.meta?.title || 'GameCorner'
  let description = route.meta?.description || '免费在线游戏平台'
  let keywords = route.meta?.keywords || '免费游戏,在线游戏'
  
  // 根据页面类型动态更新meta信息
  switch (route.name) {
    case 'GameDetail':
    case 'GameDetailWithSlug':
      if (game) {
        title = `${game.title || game.name} - 免费在线游戏 - GameCorner`
        description = `立即免费游玩${game.title || game.name}，${game.description || '精彩的在线游戏体验等你来挑战'}`
        keywords = `${game.title || game.name},免费游戏,在线游戏,${game.tags || '网页游戏'}`
      }
      break
      
    case 'GamesByCategory':
      if (category) {
        title = `${category.name}游戏 - 免费在线游戏 - GameCorner`
        description = `浏览所有${category.name}类型的免费在线游戏，发现你喜欢的游戏`
        keywords = `${category.name}游戏,免费游戏,在线游戏,游戏分类`
      }
      break
  }
  
  // 更新页面标题
  document.title = title
  
  // 更新meta标签
  updateMetaTag('description', description)
  updateMetaTag('keywords', keywords)
  
  // 更新Open Graph标签
  updateMetaTag('og:title', title, 'property')
  updateMetaTag('og:description', description, 'property')
  updateMetaTag('og:url', window.location.href, 'property')
}

/**
 * 更新或创建meta标签
 * @param {string} name - meta标签的name或property
 * @param {string} content - meta标签的content
 * @param {string} attribute - 使用的属性名（'name'或'property'）
 */
const updateMetaTag = (name, content, attribute = 'name') => {
  let meta = document.querySelector(`meta[${attribute}="${name}"]`)
  
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute(attribute, name)
    document.head.appendChild(meta)
  }
  
  meta.setAttribute('content', content)
}

/**
 * 生成规范化URL（canonical URL）
 * @param {string} path - 当前路径
 * @returns {string} - 规范化URL
 */
export const generateCanonicalUrl = (path) => {
  const baseUrl = window.location.origin
  return `${baseUrl}${path}`
}

/**
 * 添加或更新canonical链接
 * @param {string} url - 规范化URL
 */
export const updateCanonicalUrl = (url) => {
  let canonical = document.querySelector('link[rel="canonical"]')
  
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.setAttribute('rel', 'canonical')
    document.head.appendChild(canonical)
  }
  
  canonical.setAttribute('href', url)
}