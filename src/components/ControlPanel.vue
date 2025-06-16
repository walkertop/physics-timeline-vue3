<template>
  <div class="control-panel">
    <!-- 时间轴控制 -->
    <div class="timeline-control">
      <div class="timeline-header">
        <span class="timeline-title">物理学发展历程</span>
        <span class="event-counter">{{ currentEventIndex + 1 }} / {{ totalEvents }}</span>
      </div>
      
      <div class="timeline-progress">
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>
        <div class="progress-labels">
          <span>1687</span>
          <span>1935</span>
        </div>
      </div>
    </div>
    
    <!-- 播放控制 -->
    <div class="playback-controls">
      <button 
        class="control-btn"
        @click="$emit('reset')"
        title="重置到开始"
      >
        <span class="icon">⏮</span>
      </button>
      
      <button 
        class="control-btn"
        @click="previousEvent"
        :disabled="currentEventIndex === 0"
        title="上一个事件"
      >
        <span class="icon">⏪</span>
      </button>
      
      <button 
        class="control-btn play-btn"
        @click="$emit('play')"
        :title="isPlaying ? '暂停自动播放' : '开始自动播放'"
      >
        <span class="icon">{{ isPlaying ? '⏸' : '▶' }}</span>
      </button>
      
      <button 
        class="control-btn"
        @click="nextEvent"
        :disabled="currentEventIndex === totalEvents - 1"
        title="下一个事件"
      >
        <span class="icon">⏩</span>
      </button>
      
      <button 
        class="control-btn"
        @click="jumpToEnd"
        title="跳转到最后"
      >
        <span class="icon">⏭</span>
      </button>
    </div>
    
    <!-- 快速跳转 -->
    <div class="quick-jump">
      <select 
        class="event-selector"
        :value="currentEventIndex"
        @change="handleEventSelect"
      >
        <option 
          v-for="(event, index) in eventList" 
          :key="event.id"
          :value="index"
        >
          {{ event.year }} - {{ event.title }}
        </option>
      </select>
    </div>
    
    <!-- 视图控制 -->
    <div class="view-controls">
      <button 
        class="control-btn"
        @click="resetCamera"
        title="重置相机视角"
      >
        <span class="icon">🎥</span>
      </button>
      
      <button 
        class="control-btn"
        @click="toggleAutoRotate"
        :class="{ active: autoRotate }"
        title="自动旋转"
      >
        <span class="icon">🔄</span>
      </button>
      
      <button 
        class="control-btn"
        @click="toggleFullscreen"
        title="全屏模式"
      >
        <span class="icon">⛶</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { PhysicsEvent } from '@/types/PhysicsEvent'

interface Props {
  currentEventIndex: number
  totalEvents: number
  isPlaying: boolean
  eventList?: PhysicsEvent[]
}

const props = withDefaults(defineProps<Props>(), {
  eventList: () => []
})

const emit = defineEmits<{
  play: []
  reset: []
  jumpTo: [index: number]
  resetCamera: []
  toggleAutoRotate: []
  toggleFullscreen: []
}>()

// 响应式数据
const autoRotate = ref(false)

// 计算属性
const progressPercentage = computed(() => {
  if (props.totalEvents === 0) return 0
  return (props.currentEventIndex / (props.totalEvents - 1)) * 100
})

// 方法
function previousEvent() {
  if (props.currentEventIndex > 0) {
    emit('jumpTo', props.currentEventIndex - 1)
  }
}

function nextEvent() {
  if (props.currentEventIndex < props.totalEvents - 1) {
    emit('jumpTo', props.currentEventIndex + 1)
  }
}

function jumpToEnd() {
  emit('jumpTo', props.totalEvents - 1)
}

function handleEventSelect(event: Event) {
  const target = event.target as HTMLSelectElement
  const index = parseInt(target.value)
  emit('jumpTo', index)
}

function resetCamera() {
  emit('resetCamera')
}

function toggleAutoRotate() {
  autoRotate.value = !autoRotate.value
  emit('toggleAutoRotate')
}

function toggleFullscreen() {
  emit('toggleFullscreen')
}
</script>

<style scoped>
.control-panel {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(20px);
  border-radius: 25px;
  padding: 25px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 650px;
  max-width: 90vw;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.7);
}

/* 时间轴控制 */
.timeline-control {
  text-align: center;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.timeline-title {
  font-size: 16px;
  font-weight: 600;
  color: #64b5f6;
}

.event-counter {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(100, 181, 246, 0.2);
  padding: 4px 8px;
  border-radius: 10px;
}

.timeline-progress {
  position: relative;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #64b5f6, #42a5f5);
  border-radius: 3px;
  transition: width 0.3s ease;
  position: relative;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 12px;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3));
  animation: shimmer 2s infinite;
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

/* 播放控制 */
.playback-controls {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.control-btn {
  width: 45px;
  height: 45px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.control-btn:hover:not(:disabled) {
  background: rgba(100, 181, 246, 0.3);
  border-color: #64b5f6;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(100, 181, 246, 0.3);
}

.control-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.control-btn.active {
  background: rgba(100, 181, 246, 0.3);
  border-color: #64b5f6;
}

.play-btn {
  width: 55px;
  height: 55px;
  background: linear-gradient(145deg, #64b5f6, #42a5f5);
  border-color: #64b5f6;
  font-size: 20px;
}

.play-btn:hover {
  background: linear-gradient(145deg, #42a5f5, #2196f3);
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(100, 181, 246, 0.4);
}

/* 快速跳转 */
.quick-jump {
  display: flex;
  justify-content: center;
}

.event-selector {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  color: white;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 300px;
}

.event-selector:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: #64b5f6;
}

.event-selector:focus {
  outline: none;
  border-color: #64b5f6;
  box-shadow: 0 0 0 2px rgba(100, 181, 246, 0.3);
}

.event-selector option {
  background: #1a1a2e;
  color: white;
  padding: 8px;
}

/* 视图控制 */
.view-controls {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.view-controls .control-btn {
  width: 40px;
  height: 40px;
  font-size: 14px;
}

/* 动画 */
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .control-panel {
    min-width: calc(100vw - 40px);
    left: 20px;
    right: 20px;
    transform: none;
  }
  
  .timeline-header {
    flex-direction: column;
    gap: 5px;
  }
  
  .playback-controls {
    flex-wrap: wrap;
  }
  
  .event-selector {
    min-width: 250px;
    font-size: 12px;
  }
  
  .control-btn {
    width: 40px;
    height: 40px;
    font-size: 14px;
  }
  
  .play-btn {
    width: 50px;
    height: 50px;
    font-size: 18px;
  }
}

/* 工具提示样式 */
.control-btn[title]:hover::after {
  content: attr(title);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 5px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 1001;
  margin-bottom: 5px;
}

.control-btn[title]:hover::before {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-top-color: rgba(0, 0, 0, 0.9);
  z-index: 1001;
}
</style>
