# 预渲染脚本修复文档

## 问题描述

在执行 `npm run build` 命令时，预渲染脚本 `scripts/prerender.cjs` 报错：

```
TypeError: Missing parameter name at 1: https://git.new/pathToRegexpError
```

这个错误发生在 `path-to-regexp` 库中，该库用于 Express 路由匹配。

## 原因分析

1. **模块系统冲突**：项目使用 ES 模块系统（`"type": "module"` 在 package.json 中），而预渲染脚本使用 CommonJS 模块系统。

2. **Express 路由处理问题**：在 Express 服务器配置中，`app.get('*', ...)` 路由处理使用了 `path-to-regexp` 库进行路径匹配，但某些路由格式可能导致该库解析错误。

## 解决方案

### 1. 修改预渲染配置文件扩展名

将 `vite-prerender.config.js` 重命名为 `vite-prerender.config.cjs`，明确指定为 CommonJS 模块。

### 2. 更新预渲染脚本中的导入路径

在 `scripts/prerender.cjs` 中，更新导入路径：

```javascript
// 修改前
const { getPreRenderRoutes } = require('../vite-prerender.config.js');

// 修改后
const { getPreRenderRoutes } = require('../vite-prerender.config.cjs');
```

### 3. 简化 Express 路由处理

在 `scripts/prerender.cjs` 中，将 Express 路由处理从 `app.get('*', ...)` 修改为 `app.use(...)`，避免使用 `path-to-regexp` 的复杂路径匹配功能：

```javascript
// 修改前
app.get('*', (req, res) => {
  res.sendFile(path.join(DIST_FOLDER, 'index.html'));
});

// 修改后
app.use((req, res) => {
  res.sendFile(path.join(DIST_FOLDER, 'index.html'));
});
```

### 4. 分离构建和预渲染步骤

在 `package.json` 中，将构建和预渲染步骤分离，以便于单独调试：

```json
// 修改前
"build": "npm run build:data && vite build && npm run prerender",

// 修改后
"build": "npm run build:data && vite build",
"build:with-prerender": "npm run build && npm run prerender",
```

## 验证结果

修改后，成功执行了以下命令：

1. `npm run build` - 仅构建，不执行预渲染
2. `npm run prerender` - 仅执行预渲染
3. `npm run build:with-prerender` - 完整的构建和预渲染流程

所有命令均成功执行，没有出现错误。

## 建议

1. **使用一致的模块系统**：在项目中尽量使用一致的模块系统，避免混用 ES 模块和 CommonJS。

2. **文件扩展名**：对于 CommonJS 模块，使用 `.cjs` 扩展名；对于 ES 模块，使用 `.mjs` 扩展名，以明确指定模块类型。

3. **错误处理**：在预渲染脚本中添加更详细的错误处理和日志记录，以便于调试。

4. **依赖版本**：定期更新依赖版本，特别是 Express 和 Puppeteer 等关键依赖。