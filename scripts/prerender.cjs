/**
 * 自定义预渲染脚本
 * 使用puppeteer实现预渲染功能
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { getPreRenderRoutes } = require('../vite-prerender.config.cjs');

// 配置
const DIST_FOLDER = path.join(__dirname, '../dist');
const PORT = 5173;
const BASE_URL = `http://localhost:${PORT}`;

/**
 * 主函数：启动服务并预渲染页面
 */
async function prerenderPages() {
  console.log('🚀 开始预渲染页面...');
  
  // 获取需要预渲染的路由
  const routes = getPreRenderRoutes();
  console.log(`📋 需要预渲染的路由数量: ${routes.length}`);
  
  // 启动静态文件服务器
  const server = await startServer();
  
  try {
    // 启动浏览器
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    // 创建一个新页面
    const page = await browser.newPage();
    
    // 设置视口大小
    await page.setViewport({ width: 1280, height: 800 });
    
    // 预渲染每个路由
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];
      await prerenderRoute(page, route, i + 1, routes.length);
    }
    
    // 关闭浏览器
    await browser.close();
    console.log('✅ 预渲染完成！');
    
  } catch (error) {
    console.error('❌ 预渲染过程中发生错误:', error);
  } finally {
    // 关闭服务器
    server.close();
  }
}

/**
 * 启动静态文件服务器
 */
async function startServer() {
  const express = require('express');
  const app = express();
  
  // 提供静态文件
  app.use(express.static(DIST_FOLDER));
  
  // 改进路由处理，尝试查找预渲染的HTML文件
  app.get('*', (req, res) => {
    const requestPath = req.path;
    const htmlPath = requestPath === '/' 
      ? path.join(DIST_FOLDER, 'index.html')
      : path.join(DIST_FOLDER, requestPath, 'index.html');
    
    // 检查文件是否存在
    if (fs.existsSync(htmlPath)) {
      res.sendFile(htmlPath);
    } else {
      res.sendFile(path.join(DIST_FOLDER, 'index.html'));
    }
  });
  
  // 启动服务器
  return new Promise((resolve) => {
    const server = app.listen(PORT, () => {
      console.log(`🌐 本地服务器已启动: ${BASE_URL}`);
      resolve(server);
    });
  });
}

/**
 * 预渲染单个路由
 */
async function prerenderRoute(page, route, current, total) {
  const url = `${BASE_URL}${route}`;
  console.log(`🔄 [${current}/${total}] 正在预渲染: ${route}`);
  
  try {
    // 导航到页面
    await page.goto(url, { waitUntil: 'networkidle0' });
    
    // 等待Vue应用渲染完成
    await page.waitForSelector('#app', { timeout: 5000 });
    
    // 获取页面HTML
    const html = await page.content();
    
    // 确定输出路径
    let outputPath;
    if (route === '/') {
      outputPath = path.join(DIST_FOLDER, 'index.html');
    } else {
      // 创建目录结构
      const routePath = route.endsWith('/') ? route.slice(0, -1) : route;
      const dirPath = path.join(DIST_FOLDER, routePath);
      
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      
      outputPath = path.join(dirPath, 'index.html');
    }
    
    // 写入HTML文件
    fs.writeFileSync(outputPath, html);
    console.log(`✓ 已保存: ${outputPath}`);
    
  } catch (error) {
    console.error(`❌ 预渲染 ${route} 失败:`, error);
  }
}

// 执行预渲染
if (require.main === module) {
  prerenderPages();
}

module.exports = { prerenderPages };