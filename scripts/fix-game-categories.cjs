const fs = require('fs');
const path = require('path');

// 读取游戏数据
const allGamePath = path.join(__dirname, '../public/all-game.json');
const gamesData = JSON.parse(fs.readFileSync(allGamePath, 'utf8'));

// 分类规则
function categorizeGame(tags) {
  const tagList = tags.toLowerCase().split(',').map(tag => tag.trim());
  
  // 1. 益智游戏 - puzzle, brain, logic, memory, word, trivia, quiz
  if (tagList.some(tag => ['puzzle', 'brain', 'logic', 'memory', 'word', 'trivia', 'quiz', 'thinking', 'mind'].includes(tag))) {
    return 1;
  }
  
  // 2. 动作游戏 - action, fighting, shooting, combat, war, battle
  if (tagList.some(tag => ['action', 'fighting', 'shooting', 'combat', 'war', 'battle', 'shooter', 'fight', 'gun', 'weapon'].includes(tag))) {
    return 2;
  }
  
  // 3. 休闲游戏 - casual, clicker, idle, simple (但排除其他明确分类)
  // 这个放在后面，作为默认分类
  
  // 4. 竞速游戏 - racing, driving, car, speed, drift, traffic
  if (tagList.some(tag => ['racing', 'driving', 'car', 'speed', 'drift', 'traffic', 'race', 'vehicle', 'motorcycle', 'bike'].includes(tag))) {
    return 4;
  }
  
  // 5. 体育游戏 - sports, football, basketball, tennis, golf, pool, soccer, baseball
  if (tagList.some(tag => ['sports', 'football', 'basketball', 'tennis', 'golf', 'pool', 'soccer', 'baseball', 'sport', 'ball'].includes(tag))) {
    return 5;
  }
  
  // 6. 模拟游戏 - simulation, simulator, farming, building, management, city, tycoon, life
  if (tagList.some(tag => ['simulation', 'simulator', 'farming', 'building', 'management', 'city', 'tycoon', 'life', 'farm', 'business'].includes(tag))) {
    return 6;
  }
  
  // 7. 策略游戏 - strategy, tower, defense, tactical, rts
  if (tagList.some(tag => ['strategy', 'tower', 'defense', 'tactical', 'rts', 'strategic', 'planning'].includes(tag))) {
    return 7;
  }
  
  // 8. 角色扮演 - rpg, adventure, quest, character, level
  if (tagList.some(tag => ['rpg', 'adventure', 'quest', 'character', 'level', 'story', 'fantasy', 'magic'].includes(tag))) {
    return 8;
  }
  
  // 默认为休闲游戏
  return 3;
}

// 统计修改前的分类
const beforeStats = {};
gamesData.forEach(game => {
  beforeStats[game.category] = (beforeStats[game.category] || 0) + 1;
});

console.log('修改前的分类统计:');
console.log(beforeStats);

// 重新分类
let changedCount = 0;
gamesData.forEach(game => {
  const oldCategory = game.category;
  const newCategory = categorizeGame(game.tags);
  
  if (oldCategory !== newCategory) {
    game.category = newCategory;
    changedCount++;
    console.log(`游戏 "${game.title}" 从分类 ${oldCategory} 改为 ${newCategory} (标签: ${game.tags})`);
  }
});

// 统计修改后的分类
const afterStats = {};
gamesData.forEach(game => {
  afterStats[game.category] = (afterStats[game.category] || 0) + 1;
});

console.log('\n修改后的分类统计:');
console.log(afterStats);
console.log(`\n总共修改了 ${changedCount} 个游戏的分类`);

// 保存修改后的数据
fs.writeFileSync(allGamePath, JSON.stringify(gamesData, null, 2), 'utf8');
console.log('\n游戏分类修复完成！');