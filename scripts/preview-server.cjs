/**
 * 预渲染预览服务器
 * 用于本地预览预渲染的页面
 */

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5173;
const DIST_FOLDER = path.join(__dirname, '../dist');

// 提供静态文件 - 禁用目录列表并设置不添加尾部斜杠
app.use(express.static(DIST_FOLDER, {
  index: false, // 禁用目录索引
  redirect: false // 禁用尾部斜杠的自动重定向
}));

// 处理预渲染的HTML文件
app.get('*', (req, res) => {
  let requestPath = req.path;
  
  // 规范化路径 - 移除尾部斜杠（除了根路径）
  if (requestPath !== '/' && requestPath.endsWith('/')) {
    requestPath = requestPath.slice(0, -1);
  }
  
  // 尝试查找预渲染的HTML文件 - 先尝试不带斜杠的路径
  let htmlPath = requestPath === '/' 
    ? path.join(DIST_FOLDER, 'index.html')
    : path.join(DIST_FOLDER, requestPath, 'index.html');
  
  // 如果不存在，尝试带斜杠的路径
  if (!fs.existsSync(htmlPath) && requestPath !== '/') {
    const pathWithSlash = requestPath + '/';
    const htmlPathWithSlash = path.join(DIST_FOLDER, pathWithSlash, 'index.html');
    
    if (fs.existsSync(htmlPathWithSlash)) {
      htmlPath = htmlPathWithSlash;
    }
  }
  
  // 检查文件是否存在
  if (fs.existsSync(htmlPath)) {
    console.log(`✅ 提供预渲染页面: ${htmlPath}`);
    res.sendFile(htmlPath);
  } else {
    console.log(`⚠️ 预渲染页面不存在，回退到SPA模式: ${htmlPath}`);
    res.sendFile(path.join(DIST_FOLDER, 'index.html'));
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🌐 预渲染预览服务器已启动: http://localhost:${PORT}`);
  console.log(`📂 静态文件目录: ${DIST_FOLDER}`);
});