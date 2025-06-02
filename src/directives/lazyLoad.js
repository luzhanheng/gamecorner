import { optimizeImageUrl, calculateOptimalSize, createLazyLoadObserver } from '../utils/imageOptimizer.js';

// 懒加载指令
export const lazyLoad = {
  mounted(el, binding) {
    // 创建简单的观察器
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const originalSrc = binding.value;
          
          // 直接使用原始URL，不进行优化
          const imageLoader = new Image();
          
          imageLoader.onload = () => {
            img.src = originalSrc;
            img.classList.add('loaded');
            img.classList.remove('loading');
            img.style.opacity = '1';
            img.style.transform = 'scale(1)';
          };
          
          imageLoader.onerror = () => {
            img.src = '/images/game-placeholder.svg';
            img.classList.add('error');
            img.classList.remove('loading');
            img.style.opacity = '1';
            img.style.transform = 'scale(1)';
          };
          
          imageLoader.src = originalSrc;
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '100px',
      threshold: 0.1
    });
    
    // 初始化样式
    el.classList.add('loading');
    el.src = '/images/game-placeholder.svg';
    el.style.opacity = '0.7';
    el.style.transform = 'scale(0.95)';
    el.style.transition = 'all 0.5s ease-in-out';
    
    // 开始观察
    observer.observe(el);
    
    // 保存引用
    el._observer = observer;
  },
  
  unmounted(el) {
    if (el._observer) {
      el._observer.disconnect();
    }
  }
};