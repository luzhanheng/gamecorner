# GameCorner SEO 优化方案

本文档详细说明了 GameCorner 网站的 SEO 优化方案，包括预渲染和动态 Sitemap 生成两个核心功能的实现原理、配置方法和使用说明。

## 目录

1. [预渲染方案](#预渲染方案)
2. [动态 Sitemap 生成](#动态-sitemap-生成)
3. [使用说明](#使用说明)
4. [常见问题](#常见问题)
5. [后续优化建议](#后续优化建议)

## 预渲染方案

### 原理

预渲染是一种在构建时生成静态 HTML 文件的技术，它解决了单页应用（SPA）对搜索引擎不友好的问题。我们的实现使用 Puppeteer（无头浏览器）在构建过程中访问应用的各个路由，并将渲染后的 HTML 保存为静态文件。

### 核心文件

- `scripts/prerender.cjs`: 预渲染脚本，负责启动本地服务器并使用 Puppeteer 生成静态 HTML
- `vite-prerender.config.js`: 预渲染配置文件，定义需要预渲染的路由列表

### 预渲染流程

1. 构建应用生成 dist 目录
2. 启动本地静态文件服务器
3. 使用 Puppeteer 访问每个路由并等待页面渲染完成
4. 保存渲染后的 HTML 到对应的目录结构中
5. 关闭服务器和浏览器

### 路由生成策略

预渲染的路由包括：

- 静态路由：首页、游戏列表页、排行榜页面
- 分类页面：根据 `type-game.json` 动态生成
- 游戏详情页：根据 `games-list.json` 动态生成，对于大量游戏，只预渲染热门和新游戏

## 动态 Sitemap 生成

### 原理

Sitemap 是告诉搜索引擎网站结构的 XML 文件。我们的实现会根据游戏数据动态生成包含所有重要页面的 Sitemap，并添加多语言支持和更新频率等 SEO 信息。

### 核心文件

- `scripts/generate-sitemap.cjs`: Sitemap 生成脚本

### Sitemap 内容

Sitemap 包含以下页面：

- 首页（优先级 1.0，每日更新）
- 游戏列表页（优先级 0.9，每日更新）
- 排行榜页面（优先级 0.8，每周更新）
- 分类页面（优先级 0.8，每周更新）
- 游戏详情页（优先级 0.7，每月更新）

每个 URL 条目包含：

- 规范链接（canonical URL）
- 多语言链接（中文和英文）
- 最后修改日期
- 更新频率
- 优先级

## 使用说明

### 安装依赖

```bash
npm install --save-dev puppeteer express date-fns
```

### 构建命令

```bash
# 开发模式
npm run dev

# 生产构建（包含预渲染和 Sitemap 生成）
npm run build

# 仅生成 Sitemap
npm run build:sitemap

# 仅执行预渲染
npm run prerender
```

### 添加新页面到预渲染和 Sitemap

当添加新的路由或页面类型时，需要在以下文件中更新：

1. 在 `vite-prerender.config.js` 的 `getPreRenderRoutes()` 函数中添加新路由
2. 在 `scripts/generate-sitemap.cjs` 中添加新的 URL 条目

## 常见问题

### 预渲染失败

可能的原因：

- Puppeteer 无法启动：检查 Node.js 版本和 Puppeteer 依赖
- 页面渲染超时：增加 `waitForSelector` 的超时时间
- 资源加载失败：检查页面是否依赖外部资源

### Sitemap 不包含某些页面

可能的原因：

- 数据文件路径错误：检查 `games-list.json` 和 `type-game.json` 的路径
- 数据格式不匹配：确保数据文件包含脚本期望的字段

## 后续优化建议

1. **增量预渲染**：只预渲染新增或修改的页面，减少构建时间
2. **预渲染缓存**：缓存预渲染结果，避免重复渲染相同内容
3. **Sitemap 索引**：当 URL 数量超过 50,000 时，创建 Sitemap 索引文件
4. **图片 Sitemap**：添加图片 Sitemap 提升图片在图片搜索中的表现
5. **视频 Sitemap**：如果网站包含视频内容，添加视频 Sitemap
6. **结构化数据验证**：使用 Google 结构化数据测试工具验证结构化数据
7. **自动提交 Sitemap**：构建后自动向搜索引擎提交 Sitemap

---

通过实施预渲染和动态 Sitemap 生成，GameCorner 网站在保持单页应用优势的同时，显著提升了 SEO 表现，使搜索引擎能够更好地索引和理解网站内容。