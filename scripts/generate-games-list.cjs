const fs = require('fs')
const path = require('path')

// 读取游戏分类配置
function loadGameTypes() {
  try {
    const typeGamePath = path.join(__dirname, '../public/type-game.json')
    const typeGameData = fs.readFileSync(typeGamePath, 'utf8')
    return JSON.parse(typeGameData)
  } catch (error) {
    console.error('读取游戏分类配置失败:', error)
    return []
  }
}

// 根据标签推断游戏类别
function getCategoryFromTags(tags, gameTypes) {
  if (!tags || !gameTypes) return 3 // 默认为休闲游戏
  
  const tagList = tags.toLowerCase().split(',')
  
  // 遍历每个分类，计算匹配度
  let bestMatch = { categoryId: 3, score: 0 }
  
  gameTypes.forEach(category => {
    let score = 0
    category.tags.forEach(categoryTag => {
      if (tagList.some(tag => tag.trim().includes(categoryTag) || categoryTag.includes(tag.trim()))) {
        score++
      }
    })
    
    if (score > bestMatch.score) {
      bestMatch = { categoryId: category.id, score }
    }
  })
  
  return bestMatch.categoryId
}

/**
 * 主函数
 */
function generateGamesList() {
  console.log('🚀 开始生成 games-list.json...');
  
  try {
    // 读取扩充后的all-game.json文件
    const allGamePath = path.join(__dirname, '../public/all-game.json')
    const allGamesData = fs.readFileSync(allGamePath, 'utf8')
    const allGames = JSON.parse(allGamesData)
    
    // 读取游戏分类配置
    const gameTypes = loadGameTypes()
    
    console.log(`📊 读取到 ${allGames.length} 个游戏数据`)
    
    // 从扩充后的all-game.json提取轻量级游戏列表
    const gamesList = allGames.map((game) => {
      return {
        id: game.id,
        title: game.title,
        image: game.image,
        category: game.category,
        description: game.description,
        rating: game.rating,
        plays: game.plays,
        date: game.date,
        isHot: game.isHot,
        isNew: game.isNew
      };
    })
    
    // 写入生成的文件
    const outputPath = path.join(__dirname, '../public/games-list.json')
    fs.writeFileSync(outputPath, JSON.stringify(gamesList, null, 2))
    
    console.log(`✅ games-list.json 生成完成！`)
    console.log(`📁 输出路径: ${outputPath}`)
    console.log(`🎮 生成了 ${gamesList.length} 个游戏条目`)
    
    // 统计分类分布
    const categoryStats = {}
    gamesList.forEach(game => {
      const categoryName = gameTypes.find(type => type.id === game.category)?.name || '未知'
      categoryStats[categoryName] = (categoryStats[categoryName] || 0) + 1
    })
    
    console.log('\n📈 分类统计:')
    Object.entries(categoryStats).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} 个游戏`)
    })
    
  } catch (error) {
    console.error('❌ 生成 games-list.json 失败:', error)
    process.exit(1)
  }
}

// 执行生成
if (require.main === module) {
  generateGamesList()
}

module.exports = { generateGamesList }