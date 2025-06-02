// 图片优化工具

// 检测浏览器支持的图片格式
export const getSupportedFormats = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  return {
    webp: canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0,
    avif: canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0
  };
};

// 获取设备像素比
export const getDevicePixelRatio = () => {
  return window.devicePixelRatio || 1;
};

// 计算最佳图片尺寸
export const calculateOptimalSize = (containerWidth, containerHeight, maxWidth = 800) => {
  const dpr = getDevicePixelRatio();
  const scaledWidth = Math.min(containerWidth * dpr, maxWidth);
  const scaledHeight = containerHeight * dpr;
  
  return {
    width: Math.round(scaledWidth),
    height: Math.round(scaledHeight)
  };
};

// 优化图片URL
export const optimizeImageUrl = (url, options = {}) => {
  if (!url) return '/images/game-placeholder.svg';
  
  const {
    width,
    height,
    quality = 85,
    format = 'auto'
  } = options;
  
  // 暂时禁用格式转换，只返回原始URL
  // 避免因为格式转换导致图片无法加载
  return url;
  
  // 以下代码暂时注释，等确认图片可以正常显示后再启用
  /*
  const formats = getSupportedFormats();
  
  // 处理onlinegames.io的图片
  if (url.includes('onlinegames.io')) {
    let optimizedUrl = url;
    
    // 尝试使用现代图片格式
    if (format === 'auto') {
      if (formats.webp && url.includes('.jpg')) {
        optimizedUrl = url.replace(/\.jpg$/i, '.webp');
      }
    }
    
    return optimizedUrl;
  }
  
  return url;
  */
};

// 预加载图片
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// 批量预加载图片
export const preloadImages = async (urls, options = {}) => {
  const { concurrency = 3 } = options;
  const results = [];
  
  for (let i = 0; i < urls.length; i += concurrency) {
    const batch = urls.slice(i, i + concurrency);
    const batchPromises = batch.map(url => 
      preloadImage(optimizeImageUrl(url, options))
        .catch(err => ({ error: err, url }))
    );
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }
  
  return results;
};

// 图片压缩（客户端）
export const compressImage = (file, options = {}) => {
  return new Promise((resolve) => {
    const {
      maxWidth = 800,
      maxHeight = 600,
      quality = 0.8,
      outputFormat = 'image/jpeg'
    } = options;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // 计算新尺寸
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // 绘制并压缩
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(resolve, outputFormat, quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// 响应式图片srcset生成
export const generateSrcSet = (baseUrl, sizes = [400, 600, 800, 1200]) => {
  return sizes
    .map(size => `${optimizeImageUrl(baseUrl, { width: size })} ${size}w`)
    .join(', ');
};

// 图片懒加载观察器配置
export const createLazyLoadObserver = (callback, options = {}) => {
  const defaultOptions = {
    rootMargin: '100px',
    threshold: 0.1
  };
  
  return new IntersectionObserver(callback, { ...defaultOptions, ...options });
};