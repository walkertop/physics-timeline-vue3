<template>
  <div class="physics-timeline">
    <!-- 顶部导航 -->
    <TopNavigation
      :current-event-index="currentEventIndex"
      :total-events="events.length"
      :current-event="currentEvent"
      @toggle-help="toggleHelp"
      @toggle-settings="toggleSettings"
      @toggle-fullscreen="toggleFullscreen"
    />

    <!-- 3D场景容器 -->
    <div ref="sceneContainer" class="scene-container"></div>
    
    <!-- 导游角色 -->
    <GuideCharacter
      :currentEvent="currentEvent"
      :isVisible="showGuide"
      @next="nextEvent"
      @previous="previousEvent"
      @close="hideGuide"
    />
    
    <!-- 事件详情面板 -->
    <EventDetailPanel
      :event="selectedEvent"
      :isVisible="showEventDetail"
      @close="closeEventDetail"
    />
    
    <!-- 控制面板 -->
    <ControlPanel
      :currentEventIndex="currentEventIndex"
      :totalEvents="events.length"
      :isPlaying="isAutoPlaying"
      :eventList="events"
      @play="toggleAutoPlay"
      @reset="resetTimeline"
      @jumpTo="jumpToEvent"
      @resetCamera="resetCamera"
      @toggleAutoRotate="toggleAutoRotate"
      @toggleFullscreen="toggleFullscreen"
    />
    
    <!-- 背景雾效 -->
    <FogBackground :currentYear="currentYear" />
    
    <!-- 加载指示器 -->
    <LoadingIndicator v-if="isLoading" />

    <!-- 帮助面板 -->
    <HelpPanel
      :visible="showHelp"
      @close="showHelp = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { usePhysicsTimelineStore } from '@/stores/physicsTimeline'
import TopNavigation from '@/components/TopNavigation.vue'
import GuideCharacter from '@/components/GuideCharacter.vue'
import EventDetailPanel from '@/components/EventDetailPanel.vue'
import ControlPanel from '@/components/ControlPanel.vue'
import FogBackground from '@/components/FogBackground.vue'
import LoadingIndicator from '@/components/LoadingIndicator.vue'
import HelpPanel from '@/components/HelpPanel.vue'
import { SceneManager } from '@/utils/SceneManager'
// 响应式数据
const sceneContainer = ref()
const isLoading = ref(true)
const showGuide = ref(false)
const showEventDetail = ref(false)
const showHelp = ref(false)
const currentEventIndex = ref(0)
const selectedEvent = ref(null)
const isAutoPlaying = ref(false)

// Store
const timelineStore = usePhysicsTimelineStore()

// 计算属性
const events = computed(() => timelineStore.events)
const currentEvent = computed(() => events.value[currentEventIndex.value])
const currentYear = computed(() => currentEvent.value?.year || 1687)

// 3D场景管理器
let sceneManager = null

// 生命周期
onMounted(async () => {
  await initializeTimeline()
  // 添加键盘事件监听
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  if (sceneManager) {
    sceneManager.dispose()
  }
  // 移除键盘事件监听
  window.removeEventListener('keydown', handleKeydown)
})

// 初始化时间轴
async function initializeTimeline() {
  try {
    // 加载数据
    await timelineStore.loadEvents()
    
    // 初始化3D场景
    if (sceneContainer.value) {
      sceneManager = new SceneManager(sceneContainer.value)
      await sceneManager.initialize()
      
      // 创建事件节点
      console.log('Creating nodes for', events.value.length, 'events')
      events.value.forEach(event => {
        sceneManager?.createEventNode(event)
      })
      console.log('All nodes created')
      
      // 设置事件监听
      sceneManager.onNodeClick = handleNodeClick
      sceneManager.onNodeHover = handleNodeHover
    }
    
    isLoading.value = false
    
    // 不自动显示导游，等待用户点击节点
    
  } catch (error) {
    console.error('初始化失败:', error)
    isLoading.value = false
  }
}

// 事件处理
function handleNodeClick(event) {
  selectedEvent.value = event
  showEventDetail.value = true
  // 显示导游
  showGuide.value = true

  // 更新当前事件索引
  const index = events.value.findIndex(e => e.id === event.id)
  if (index !== -1) {
    currentEventIndex.value = index
  }
}

function handleNodeHover(event) {
  // 处理悬停效果
  if (sceneManager) {
    sceneManager.highlightEvent(event?.id || null)
  }
}

function nextEvent() {
  if (currentEventIndex.value < events.value.length - 1) {
    currentEventIndex.value++
    focusOnCurrentEvent()
  }
}

function previousEvent() {
  if (currentEventIndex.value > 0) {
    currentEventIndex.value--
    focusOnCurrentEvent()
  }
}

function focusOnCurrentEvent() {
  const event = currentEvent.value
  if (event && sceneManager) {
    sceneManager.focusOnEvent(event.id)
  }
}

function hideGuide() {
  showGuide.value = false
}

function closeEventDetail() {
  showEventDetail.value = false
  selectedEvent.value = null
}

function toggleAutoPlay() {
  isAutoPlaying.value = !isAutoPlaying.value

  if (isAutoPlaying.value) {
    startAutoPlay()
  } else {
    stopAutoPlay()
  }
}

let autoPlayInterval = null

function startAutoPlay() {
  autoPlayInterval = setInterval(() => {
    if (currentEventIndex.value < events.value.length - 1) {
      nextEvent()
    } else {
      stopAutoPlay()
    }
  }, 5000) // 每5秒切换一个事件
}

function stopAutoPlay() {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
    autoPlayInterval = null
  }
  isAutoPlaying.value = false
}

function resetTimeline() {
  currentEventIndex.value = 0
  stopAutoPlay()
  focusOnCurrentEvent()
  
  if (sceneManager) {
    sceneManager.resetCamera()
  }
}

function jumpToEvent(index) {
  if (index >= 0 && index < events.value.length) {
    currentEventIndex.value = index
    focusOnCurrentEvent()
  }
}

// 添加缺失的方法
function resetCamera() {
  if (sceneManager) {
    sceneManager.resetCamera()
  }
}

function toggleAutoRotate() {
  if (sceneManager) {
    sceneManager.controls.autoRotate = !sceneManager.controls.autoRotate
  }
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

// 顶部导航方法
function toggleHelp() {
  showHelp.value = !showHelp.value
}

function toggleSettings() {
  // TODO: 实现设置功能
  console.log('Toggle settings')
}

// 键盘快捷键处理
function handleKeydown(event) {
  // 如果正在输入或者有模态框打开，不处理快捷键
  if (event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      showHelp.value) {
    return
  }

  switch (event.code) {
    case 'Space':
      event.preventDefault()
      toggleAutoPlay()
      break
    case 'ArrowLeft':
      event.preventDefault()
      previousEvent()
      break
    case 'ArrowRight':
      event.preventDefault()
      nextEvent()
      break
    case 'KeyR':
      event.preventDefault()
      resetCamera()
      break
    case 'KeyF':
      event.preventDefault()
      toggleFullscreen()
      break
    case 'KeyH':
      event.preventDefault()
      toggleHelp()
      break
    case 'Escape':
      event.preventDefault()
      if (showHelp.value) {
        showHelp.value = false
      } else if (showEventDetail.value) {
        showEventDetail.value = false
      } else if (showGuide.value) {
        showGuide.value = false
      }
      break
  }
}
</script>

<style scoped>
.physics-timeline {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #000000;
}

.scene-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .physics-timeline {
    /* 确保在移动设备上正确显示 */
    touch-action: pan-x pan-y;
  }

  .scene-container {
    /* 移动设备上的触摸优化 */
    touch-action: manipulation;
  }
}

/* 防止在小屏幕上出现水平滚动 */
@media (max-width: 480px) {
  .physics-timeline {
    overflow-x: hidden;
  }
}
</style>
