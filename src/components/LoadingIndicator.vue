<template>
  <div class="loading-overlay">
    <div class="loading-container">
      <!-- 原子模型加载动画 -->
      <div class="atom-loader">
        <div class="nucleus"></div>
        <div class="electron-orbit orbit-1">
          <div class="electron"></div>
        </div>
        <div class="electron-orbit orbit-2">
          <div class="electron"></div>
        </div>
        <div class="electron-orbit orbit-3">
          <div class="electron"></div>
        </div>
      </div>
      
      <!-- 加载文本 -->
      <div class="loading-text">
        <h2>{{ currentMessage }}</h2>
        <p>正在构建物理学发展历程的3D世界...</p>
      </div>
      
      <!-- 进度条 -->
      <div class="progress-container">
        <div class="progress-bar">
          <div 
            class="progress-fill"
            :style="{ width: progress + '%' }"
          ></div>
        </div>
        <span class="progress-text">{{ Math.round(progress) }}%</span>
      </div>
      
      <!-- 加载步骤 -->
      <div class="loading-steps">
        <div 
          v-for="(step, index) in loadingSteps" 
          :key="index"
          class="loading-step"
          :class="{ 
            active: index === currentStepIndex,
            completed: index < currentStepIndex 
          }"
        >
          <div class="step-icon">
            <span v-if="index < currentStepIndex">✓</span>
            <span v-else-if="index === currentStepIndex" class="spinner">⟳</span>
            <span v-else>○</span>
          </div>
          <span class="step-text">{{ step }}</span>
        </div>
      </div>
    </div>
    
    <!-- 背景粒子效果 -->
    <div class="background-particles">
      <div 
        v-for="i in 50" 
        :key="i"
        class="particle"
        :style="getParticleStyle(i)"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

// 响应式数据
const progress = ref(0)
const currentStepIndex = ref(0)
const currentMessageIndex = ref(0)

// 加载步骤
const loadingSteps = [
  '初始化3D场景',
  '加载历史数据',
  '创建时间轴',
  '生成事件节点',
  '建立关联关系',
  '准备导游系统'
]

// 加载消息
const loadingMessages = [
  '欢迎来到物理学的奇妙世界',
  '从牛顿到爱因斯坦的伟大旅程',
  '探索量子力学的神秘面纱',
  '见证科学革命的历史时刻'
]

// 计算属性
const currentMessage = computed(() => loadingMessages[currentMessageIndex.value])

// 生命周期
onMounted(() => {
  startLoading()
})

// 开始加载动画
function startLoading() {
  const totalDuration = 6000 // 6秒
  const stepDuration = totalDuration / loadingSteps.length
  
  // 进度条动画
  const progressInterval = setInterval(() => {
    progress.value += 1
    if (progress.value >= 100) {
      clearInterval(progressInterval)
    }
  }, totalDuration / 100)
  
  // 步骤切换
  const stepInterval = setInterval(() => {
    if (currentStepIndex.value < loadingSteps.length - 1) {
      currentStepIndex.value++
    } else {
      clearInterval(stepInterval)
    }
  }, stepDuration)
  
  // 消息切换
  const messageInterval = setInterval(() => {
    currentMessageIndex.value = (currentMessageIndex.value + 1) % loadingMessages.length
  }, 2000)
  
  // 清理定时器
  setTimeout(() => {
    clearInterval(progressInterval)
    clearInterval(stepInterval)
    clearInterval(messageInterval)
  }, totalDuration)
}

// 获取粒子样式
function getParticleStyle(index: number) {
  const x = Math.random() * 100
  const y = Math.random() * 100
  const size = Math.random() * 4 + 1
  const duration = Math.random() * 3 + 2
  const delay = Math.random() * 2
  
  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`
  }
}
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  color: white;
}

.loading-container {
  text-align: center;
  max-width: 500px;
  padding: 40px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}

/* 原子加载器 */
.atom-loader {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 30px;
}

.nucleus {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  background: radial-gradient(circle, #64b5f6, #42a5f5);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 20px #64b5f6;
  animation: nucleusPulse 2s ease-in-out infinite;
}

.electron-orbit {
  position: absolute;
  top: 50%;
  left: 50%;
  border: 1px solid rgba(100, 181, 246, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.orbit-1 {
  width: 60px;
  height: 60px;
  animation: rotate 2s linear infinite;
}

.orbit-2 {
  width: 90px;
  height: 90px;
  animation: rotate 3s linear infinite reverse;
}

.orbit-3 {
  width: 120px;
  height: 120px;
  animation: rotate 4s linear infinite;
}

.electron {
  position: absolute;
  top: -3px;
  left: 50%;
  width: 6px;
  height: 6px;
  background: #64b5f6;
  border-radius: 50%;
  transform: translateX(-50%);
  box-shadow: 0 0 10px #64b5f6;
}

/* 加载文本 */
.loading-text {
  margin-bottom: 30px;
}

.loading-text h2 {
  font-size: 24px;
  font-weight: 600;
  color: #64b5f6;
  margin-bottom: 10px;
  animation: textGlow 2s ease-in-out infinite alternate;
}

.loading-text p {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
}

/* 进度条 */
.progress-container {
  margin-bottom: 30px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #64b5f6, #42a5f5, #2196f3);
  border-radius: 4px;
  transition: width 0.3s ease;
  position: relative;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 1.5s infinite;
}

.progress-text {
  font-size: 14px;
  color: #64b5f6;
  font-weight: 600;
}

/* 加载步骤 */
.loading-steps {
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: left;
}

.loading-step {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  transition: all 0.3s ease;
}

.loading-step.active {
  color: #64b5f6;
}

.loading-step.completed {
  color: #4caf50;
}

.step-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
}

.spinner {
  animation: spin 1s linear infinite;
}

.step-text {
  font-size: 14px;
}

/* 背景粒子 */
.background-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.particle {
  position: absolute;
  background: radial-gradient(circle, rgba(100, 181, 246, 0.6), transparent);
  border-radius: 50%;
  animation: particleFloat 5s infinite linear;
}

/* 动画定义 */
@keyframes nucleusPulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    box-shadow: 0 0 20px #64b5f6;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    box-shadow: 0 0 30px #64b5f6;
  }
}

@keyframes rotate {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@keyframes textGlow {
  from {
    text-shadow: 0 0 10px #64b5f6;
  }
  to {
    text-shadow: 0 0 20px #64b5f6, 0 0 30px #64b5f6;
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes particleFloat {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) rotate(360deg);
    opacity: 0;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .loading-container {
    max-width: 90%;
    padding: 30px 20px;
  }
  
  .atom-loader {
    width: 100px;
    height: 100px;
  }
  
  .orbit-1 { width: 50px; height: 50px; }
  .orbit-2 { width: 75px; height: 75px; }
  .orbit-3 { width: 100px; height: 100px; }
  
  .loading-text h2 {
    font-size: 20px;
  }
  
  .loading-text p {
    font-size: 14px;
  }
}
</style>
