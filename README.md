# Game Station - H5游戏平台

一个现代化的H5游戏平台，使用Vue 3和Tailwind CSS构建。

## 功能特点

- 多种游戏类型
- 用户排行榜
- 响应式设计
- 实时游戏数据
- 社交分享功能

## 技术栈

- Vue 3
- Vite
- Tailwind CSS
- Vue Router
- Phaser.js

## 开始使用

1. 安装依赖
```bash
npm install
```

2. 启动开发服务器
```bash
npm run dev
```

3. 构建生产版本
```bash
npm run build
```

## 项目结构

```
├── src/
│   ├── assets/         # 静态资源
│   ├── components/     # 组件
│   ├── views/          # 页面
│   ├── router/         # 路由配置
│   ├── App.vue         # 根组件
│   └── main.js         # 入口文件
├── public/             # 公共资源
├── index.html          # HTML模板
└── package.json        # 项目配置
```

## 开发指南

### 添加新游戏

1. 在`src/games`目录下创建新的游戏组件
2. 在路由配置中添加新游戏路径
3. 更新游戏列表数据

### 自定义主题

可以在`tailwind.config.js`中修改颜色、字体等主题配置。

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交改动
4. 发起 Pull Request

## 许可证

MIT License