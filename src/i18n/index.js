import { createI18n } from 'vue-i18n'

// 中文翻译
const zh = {
  nav: {
    home: '首页',
    allGames: '所有游戏',
    search: '搜索游戏...'
  },
  home: {
    welcome: '欢迎来到Game Station',
    subtitle: '探索精彩的H5游戏世界',
    categories: '游戏分类',
    hotGames: '热门游戏',
    latestGames: '最新游戏',
    playNow: '立即游戏',
    viewMore: '查看更多游戏',
    whyChooseUs: '为什么选择我们',
    qualityGames: '精品游戏',
    qualityGamesDesc: '精心挑选的高质量H5游戏，无需下载即可畅玩',
    fastLoading: '极速加载',
    fastLoadingDesc: '优化的游戏加载技术，让您秒进游戏世界',
    multiPlatform: '多端适配',
    multiPlatformDesc: '完美支持手机、平板、电脑，随时随地畅玩'
  },
  games: {
    allGames: '所有游戏',
    search: '搜索',
    category: '分类',
    all: '全部',
    plays: '次游戏',
    loading: '正在加载游戏列表...',
    sortByPlays: '最受欢迎',
    sortByDate: '最新发布',
    sortByRating: '评分最高',
    sortByTitle: '按名称'
  },
  gameTypes: {
    1: '益智游戏',
    2: '动作游戏',
    3: '休闲游戏',
    4: '竞速游戏',
    5: '体育游戏',
    6: '模拟游戏',
    7: '策略游戏',
    8: '角色扮演'
  },
  footer: {
    copyright: '© 2023 Game Station. All rights reserved.'
  }
}

// 英文翻译
const en = {
  nav: {
    home: 'Home',
    allGames: 'All Games',
    search: 'Search games...'
  },
  home: {
    welcome: 'Welcome to Game Station',
    subtitle: 'Explore the exciting world of H5 games',
    categories: 'Game Categories',
    hotGames: 'Hot Games',
    latestGames: 'Latest Games',
    playNow: 'Play Now',
    viewMore: 'View More Games',
    whyChooseUs: 'Why Choose Us',
    qualityGames: 'Quality Games',
    qualityGamesDesc: 'Carefully selected high-quality H5 games, play instantly without download',
    fastLoading: 'Fast Loading',
    fastLoadingDesc: 'Optimized game loading technology for instant access to gaming world',
    multiPlatform: 'Multi-Platform',
    multiPlatformDesc: 'Perfect support for mobile, tablet, and desktop - play anywhere, anytime'
  },
  games: {
    allGames: 'All Games',
    search: 'Search',
    category: 'Category',
    all: 'All',
    plays: 'plays',
    loading: 'Loading games...',
    sortByPlays: 'Most Popular',
    sortByDate: 'Latest',
    sortByRating: 'Highest Rated',
    sortByTitle: 'By Name'
  },
  gameTypes: {
    1: 'Puzzle Games',
    2: 'Action Games',
    3: 'Casual Games',
    4: 'Racing Games',
    5: 'Sports Games',
    6: 'Simulation Games',
    7: 'Strategy Games',
    8: 'Role Playing'
  },
  footer: {
    copyright: '© 2023 Game Station. All rights reserved.'
  }
}

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'zh',
  messages: {
    zh,
    en
  }
})

export default i18n