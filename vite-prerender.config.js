/**
 * 预渲染配置文件
 * 用于配置预渲染路由
 */

const fs = require('fs');
const path = require('path');

/**
 * 获取需要预渲染的路由列表
 * 包括静态路由和动态生成的游戏详情页路由
 */
function getPreRenderRoutes() {
  // 静态路由 - 这些路由是固定的
  const staticRoutes = [
    '/',                // 首页
    '/games',          // 游戏列表页
    '/leaderboard',    // 排行榜页面
  ];
  
  // 读取游戏分类数据，生成分类页面路由
  let categoryRoutes = [];
  try {
    const typeGamePath = path.join(__dirname, 'public/type-game.json');
    const categoriesData = JSON.parse(fs.readFileSync(typeGamePath, 'utf8'));
    categoryRoutes = categoriesData.map(category => `/games/category/${category.id}`);
  } catch (error) {
    console.warn('读取分类数据失败，将跳过分类页面预渲染', error);
  }
  
  // 读取游戏列表数据，生成游戏详情页路由
  let gameDetailRoutes = [];
  try {
    const gamesListPath = path.join(__dirname, 'public/games-list.json');
    const gamesData = JSON.parse(fs.readFileSync(gamesListPath, 'utf8'));
    
    // 如果游戏数量超过100，只预渲染热门和新游戏
    if (gamesData.length > 100) {
      console.log(`⚠️ 游戏数量(${gamesData.length})超过100，只预渲染热门和新游戏`);
      
      // 筛选热门游戏和新游戏
      const hotGames = gamesData.filter(game => game.isHot);
      const newGames = gamesData.filter(game => game.isNew);
      
      // 合并并去重
      const priorityGames = [...new Set([...hotGames, ...newGames])];
      
      gameDetailRoutes = priorityGames.map(game => {
        const slug = createSlug(game.title);
        return `/game/${game.id}/${slug}`;
      });
      
      console.log(`🔥 将预渲染 ${gameDetailRoutes.length} 个热门和新游戏详情页`);
    } else {
      // 游戏数量较少，全部预渲染
      gameDetailRoutes = gamesData.map(game => {
        const slug = createSlug(game.title);
        return `/game/${game.id}/${slug}`;
      });
    }
  } catch (error) {
    console.warn('读取游戏数据失败，将跳过游戏详情页预渲染', error);
  }
  
  // 合并所有路由
  const allRoutes = [...staticRoutes, ...categoryRoutes, ...gameDetailRoutes];
  console.log(`✅ 共生成 ${allRoutes.length} 个预渲染路由`);
  
  return allRoutes;
}

/**
 * 创建SEO友好的URL slug
 * @param {string} text 原始文本
 * @returns {string} 处理后的slug
 */
function createSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // 移除特殊字符
    .replace(/[\s_-]+/g, '-')   // 替换空格和下划线为连字符
    .replace(/^-+|-+$/g, '');   // 移除首尾连字符
}

module.exports = {
  getPreRenderRoutes
};