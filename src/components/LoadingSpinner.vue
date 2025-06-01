<template>
  <div class="loading-container" v-if="show">
    <div class="loading-backdrop" @click="$emit('close')">
      <div class="loading-content" @click.stop>
        <div class="spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
        </div>
        <div class="loading-text">
          <h3>{{ title }}</h3>
          <p>{{ message }}</p>
          <div class="progress-bar" v-if="showProgress">
            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '加载中...'
    },
    message: {
      type: String,
      default: '正在为您准备精彩内容'
    },
    progress: {
      type: Number,
      default: 0
    },
    showProgress: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close']
}
</script>

<style scoped>
.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
}

.loading-backdrop {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-content {
  background: rgba(31, 41, 55, 0.95);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  border: 1px solid rgba(59, 130, 246, 0.3);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.spinner {
  position: relative;
  width: 60px;
  height: 60px;
  margin: 0 auto 1.5rem;
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1.2s linear infinite;
}

.spinner-ring:nth-child(2) {
  animation-delay: -0.4s;
  border-top-color: #8b5cf6;
}

.spinner-ring:nth-child(3) {
  animation-delay: -0.8s;
  border-top-color: #06d6a0;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text h3 {
  color: #f3f4f6;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.loading-text p {
  color: #9ca3af;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.progress-bar {
  width: 200px;
  height: 4px;
  background: rgba(75, 85, 99, 0.5);
  border-radius: 2px;
  overflow: hidden;
  margin: 0 auto;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 2px;
  transition: width 0.3s ease;
}
</style>