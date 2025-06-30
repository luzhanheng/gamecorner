/**
 * 动态Sitemap生成脚本
 * 根据游戏数据自动生成站点地图XML文件
 */

const fs = require('fs');
const path = require('path');
const { format } = require('date-fns');

// 基础URL配置
const BASE_URL = 'https://gamecorner.com';
const LANGUAGES = ['zh', 'en'];

/**
 * 生成XML站点地图
 */
async function generateSitemap() {
  console.log('🚀 开始生成动态站点地图...');
  
  try {
    // 读取游戏列表数据
    const gamesListPath = path.join(__dirname, '../public/games-list.json');
    const gamesData = JSON.parse(fs.readFileSync(gamesListPath, 'utf8'));
    
    // 读取游戏分类配置
    const typeGamePath = path.join(__dirname, '../public/type-game.json');
    const categoriesData = JSON.parse(fs.readFileSync(typeGamePath, 'utf8'));
    
    console.log(`📊 读取到 ${gamesData.length} 个游戏数据和 ${categoriesData.length} 个分类`);
    
    // 获取当前日期作为lastmod
    const today = format(new Date(), 'yyyy-MM-dd');
    
    // 创建XML头部
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    sitemap += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';
    
    // 添加首页
    sitemap += generateUrlEntry({
      loc: '/',
      lastmod: today,
      changefreq: 'daily',
      priority: '1.0'
    });
    
    // 添加游戏列表页
    sitemap += generateUrlEntry({
      loc: '/games',
      lastmod: today,
      changefreq: 'daily',
      priority: '0.9'
    });
    
    // 添加排行榜页面
    sitemap += generateUrlEntry({
      loc: '/leaderboard',
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.8'
    });
    
    // 添加分类页面
    categoriesData.forEach(category => {
      sitemap += generateUrlEntry({
        loc: `/games/category/${category.id}`,
        lastmod: today,
        changefreq: 'weekly',
        priority: '0.8'
      });
    });
    
    // 添加游戏详情页
    gamesData.forEach(game => {
      // 创建SEO友好的slug
      const slug = createSlug(game.title || '');
      const gameUrl = slug ? `/game/${game.id}/${slug}` : `/game/${game.id}`;
      
      sitemap += generateUrlEntry({
        loc: gameUrl,
        lastmod: game.date || today,
        changefreq: 'monthly',
        priority: '0.7'
      });
    });
    
    // 关闭XML
    sitemap += '</urlset>';
    
    // 写入文件
    const outputPath = path.join(__dirname, '../public/sitemap.xml');
    fs.writeFileSync(outputPath, sitemap);
    
    console.log(`✅ 站点地图生成完成！`);
    console.log(`📁 输出路径: ${outputPath}`);
    console.log(`🔗 包含 ${gamesData.length + categoriesData.length + 3} 个URL`);
    
  } catch (error) {
    console.error('❌ 生成站点地图失败:', error);
    process.exit(1);
  }
}

/**
 * 生成URL条目
 */
function generateUrlEntry({ loc, lastmod, changefreq, priority }) {
  let entry = '  <url>\n';
  entry += `    <loc>${BASE_URL}${loc}</loc>\n`;
  
  // 添加多语言支持
  LANGUAGES.forEach(lang => {
    const langParam = loc.includes('?') ? `&lang=${lang}` : `?lang=${lang}`;
    entry += `    <xhtml:link rel="alternate" hreflang="${lang}" href="${BASE_URL}${loc}${langParam}" />\n`;
  });
  
  entry += `    <lastmod>${lastmod}</lastmod>\n`;
  entry += `    <changefreq>${changefreq}</changefreq>\n`;
  entry += `    <priority>${priority}</priority>\n`;
  entry += '  </url>\n';
  
  return entry;
}

/**
 * 将中文字符串转换为URL友好的slug
 */
function createSlug(text) {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .replace(/[\s\u4e00-\u9fff]+/g, '-') // 将空格和中文字符替换为连字符
    .replace(/[^\w\-一-鿿]/g, '') // 移除特殊字符，保留中文
    .replace(/\-+/g, '-') // 合并多个连字符
    .replace(/^\-|\-$/g, ''); // 移除开头和结尾的连字符
}

// 执行生成
if (require.main === module) {
  generateSitemap();
}

module.exports = { generateSitemap };