// 图片懒加载指令
const lazyLoad = {
  mounted(el, binding) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target
          const src = binding.value || img.dataset.src
          
          if (src) {
            // 创建新的图片对象预加载
            const newImg = new Image()
            
            newImg.onload = () => {
              img.src = src
              img.classList.remove('lazy-loading')
              img.classList.add('lazy-loaded')
            }
            
            newImg.onerror = () => {
              img.classList.remove('lazy-loading')
              img.classList.add('lazy-error')
              // 设置默认图片
              img.src = '/images/game-placeholder.svg'
            }
            
            newImg.src = src
          }
          
          observer.unobserve(img)
        }
      })
    }, {
      rootMargin: '50px 0px', // 提前50px开始加载
      threshold: 0.1
    })
    
    // 添加加载中的样式
    el.classList.add('lazy-loading')
    imageObserver.observe(el)
    
    // 保存observer到元素上，用于清理
    el._imageObserver = imageObserver
  },
  
  unmounted(el) {
    if (el._imageObserver) {
      el._imageObserver.disconnect()
      delete el._imageObserver
    }
  }
}

export default lazyLoad