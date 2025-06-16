<template>
  <div class="fog-background">
    <!-- 动态背景层 -->
    <div 
      class="background-layer"
      :style="backgroundStyle"
    ></div>
    
    <!-- 雾效层 -->
    <div class="fog-layers">
      <div 
        v-for="(layer, index) in fogLayers" 
        :key="index"
        class="fog-layer"
        :style="layer.style"
      ></div>
    </div>
    
    <!-- 粒子效果 -->
    <div class="particles-container">
      <div 
        v-for="(particle, index) in particles" 
        :key="index"
        class="particle"
        :style="particle.style"
      ></div>
    </div>
    
    <!-- 时代光晕 -->
    <div 
      class="era-glow"
      :style="eraGlowStyle"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'

interface Props {
  currentYear: number
}

const props = defineProps<Props>()

// 响应式数据
const animationFrame = ref<number>()
const time = ref(0)

// 计算属性
const backgroundStyle = computed(() => {
  const progress = (props.currentYear - 1687) / (1935 - 1687)
  
  // 根据时代变化背景色
  let baseColor: string
  let accentColor: string
  
  if (props.currentYear < 1800) {
    // 经典力学时代 - 深蓝色调
    baseColor = '#0c1445'
    accentColor = '#1a237e'
  } else if (props.currentYear < 1900) {
    // 电磁学时代 - 紫色调
    baseColor = '#1a0d2e'
    accentColor = '#4a148c'
  } else if (props.currentYear < 1920) {
    // 量子起源时代 - 深红色调
    baseColor = '#2e0d0d'
    accentColor = '#b71c1c'
  } else {
    // 量子力学时代 - 金色调
    baseColor = '#2e1a0d'
    accentColor = '#e65100'
  }
  
  return {
    background: `
      radial-gradient(circle at 30% 20%, ${accentColor}22 0%, transparent 50%),
      radial-gradient(circle at 70% 80%, ${accentColor}15 0%, transparent 50%),
      linear-gradient(135deg, ${baseColor} 0%, #0a0a0a 100%)
    `,
    transition: 'background 2s ease-in-out'
  }
})

const eraGlowStyle = computed(() => {
  const progress = (props.currentYear - 1687) / (1935 - 1687)
  const intensity = Math.sin(time.value * 0.002) * 0.3 + 0.7
  
  let glowColor: string
  if (props.currentYear < 1800) {
    glowColor = '#64b5f6'
  } else if (props.currentYear < 1900) {
    glowColor = '#9c27b0'
  } else if (props.currentYear < 1920) {
    glowColor = '#f44336'
  } else {
    glowColor = '#ff9800'
  }
  
  return {
    background: `radial-gradient(circle, ${glowColor}${Math.floor(intensity * 20).toString(16)} 0%, transparent 70%)`,
    transform: `scale(${0.8 + intensity * 0.4})`,
    opacity: intensity * 0.6
  }
})

// 雾效层
const fogLayers = computed(() => {
  const layers = []
  const fogDensity = Math.max(0.1, 1 - (props.currentYear - 1687) / (1935 - 1687))
  
  for (let i = 0; i < 5; i++) {
    const offset = (time.value * (0.0005 + i * 0.0002)) % 360
    const opacity = fogDensity * (0.3 - i * 0.05)
    const scale = 1 + i * 0.2
    
    layers.push({
      style: {
        background: `
          radial-gradient(circle at ${30 + i * 10}% ${20 + i * 15}%, rgba(255,255,255,${opacity}) 0%, transparent 40%),
          radial-gradient(circle at ${70 - i * 10}% ${80 - i * 15}%, rgba(255,255,255,${opacity * 0.7}) 0%, transparent 50%)
        `,
        transform: `rotate(${offset}deg) scale(${scale})`,
        animationDelay: `${i * 0.5}s`,
        filter: `blur(${2 + i}px)`
      }
    })
  }
  
  return layers
})

// 粒子效果
const particles = computed(() => {
  const particleCount = Math.floor(20 + (1 - (props.currentYear - 1687) / (1935 - 1687)) * 30)
  const particles = []
  
  for (let i = 0; i < particleCount; i++) {
    const x = Math.random() * 100
    const y = Math.random() * 100
    const size = Math.random() * 3 + 1
    const opacity = Math.random() * 0.5 + 0.1
    const animationDuration = Math.random() * 10 + 5
    const delay = Math.random() * 5
    
    particles.push({
      style: {
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`,
        height: `${size}px`,
        opacity: opacity,
        animationDuration: `${animationDuration}s`,
        animationDelay: `${delay}s`
      }
    })
  }
  
  return particles
})

// 生命周期
onMounted(() => {
  startAnimation()
})

onUnmounted(() => {
  if (animationFrame.value) {
    cancelAnimationFrame(animationFrame.value)
  }
})

// 动画循环
function startAnimation() {
  function animate() {
    time.value = Date.now()
    animationFrame.value = requestAnimationFrame(animate)
  }
  animate()
}
</script>

<style scoped>
.fog-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.background-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.fog-layers {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.fog-layer {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  animation: fogFloat 20s infinite linear;
  mix-blend-mode: screen;
}

.particles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.particle {
  position: absolute;
  background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%);
  border-radius: 50%;
  animation: particleFloat 15s infinite linear;
}

.era-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 800px;
  height: 800px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  mix-blend-mode: soft-light;
  animation: pulse 4s ease-in-out infinite;
}

/* 动画定义 */
@keyframes fogFloat {
  0% {
    transform: rotate(0deg) scale(1);
    opacity: 0.3;
  }
  25% {
    opacity: 0.6;
  }
  50% {
    transform: rotate(180deg) scale(1.1);
    opacity: 0.4;
  }
  75% {
    opacity: 0.7;
  }
  100% {
    transform: rotate(360deg) scale(1);
    opacity: 0.3;
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

@keyframes pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.3;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.6;
  }
}

/* 雾效拨开动画 */
.fog-layer:nth-child(1) { animation-duration: 25s; }
.fog-layer:nth-child(2) { animation-duration: 30s; animation-direction: reverse; }
.fog-layer:nth-child(3) { animation-duration: 35s; }
.fog-layer:nth-child(4) { animation-duration: 40s; animation-direction: reverse; }
.fog-layer:nth-child(5) { animation-duration: 45s; }

/* 根据时代调整雾效强度 */
.fog-background[data-era="classical"] .fog-layer {
  opacity: 0.8;
  filter: blur(8px);
}

.fog-background[data-era="electromagnetic"] .fog-layer {
  opacity: 0.6;
  filter: blur(6px);
}

.fog-background[data-era="quantum-origins"] .fog-layer {
  opacity: 0.4;
  filter: blur(4px);
}

.fog-background[data-era="quantum-mechanics"] .fog-layer {
  opacity: 0.2;
  filter: blur(2px);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .era-glow {
    width: 400px;
    height: 400px;
  }
  
  .fog-layer {
    filter: blur(4px);
  }
  
  .particle {
    animation-duration: 10s;
  }
}

/* 性能优化 */
@media (prefers-reduced-motion: reduce) {
  .fog-layer,
  .particle,
  .era-glow {
    animation: none;
  }
  
  .background-layer {
    transition: none;
  }
}
</style>
