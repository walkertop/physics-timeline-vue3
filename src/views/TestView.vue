<template>
  <div class="test-view">
    <h1>按钮测试页面</h1>
    
    <div class="test-section">
      <h2>控制面板测试</h2>
      <ControlPanel
        :currentEventIndex="currentEventIndex"
        :totalEvents="10"
        :isPlaying="isAutoPlaying"
        :eventList="testEvents"
        @play="handlePlay"
        @reset="handleReset"
        @jumpTo="handleJumpTo"
        @resetCamera="handleResetCamera"
        @toggleAutoRotate="handleToggleAutoRotate"
        @toggleFullscreen="handleToggleFullscreen"
      />
    </div>
    
    <div class="debug-info">
      <h3>调试信息</h3>
      <p>当前事件索引: {{ currentEventIndex }}</p>
      <p>自动播放状态: {{ isAutoPlaying }}</p>
      <p>最后操作: {{ lastAction }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ControlPanel from '@/components/ControlPanel.vue'

const currentEventIndex = ref(0)
const isAutoPlaying = ref(false)
const lastAction = ref('无')

const testEvents = [
  { id: '1', title: '测试事件1', year: 1900 },
  { id: '2', title: '测试事件2', year: 1910 },
  { id: '3', title: '测试事件3', year: 1920 },
  { id: '4', title: '测试事件4', year: 1930 },
  { id: '5', title: '测试事件5', year: 1940 }
]

function handlePlay() {
  console.log('Play button clicked')
  isAutoPlaying.value = !isAutoPlaying.value
  lastAction.value = `播放/暂停 - ${isAutoPlaying.value ? '播放' : '暂停'}`
}

function handleReset() {
  console.log('Reset button clicked')
  currentEventIndex.value = 0
  isAutoPlaying.value = false
  lastAction.value = '重置'
}

function handleJumpTo(index: number) {
  console.log('Jump to:', index)
  currentEventIndex.value = index
  lastAction.value = `跳转到事件 ${index}`
}

function handleResetCamera() {
  console.log('Reset camera clicked')
  lastAction.value = '重置相机'
}

function handleToggleAutoRotate() {
  console.log('Toggle auto rotate clicked')
  lastAction.value = '切换自动旋转'
}

function handleToggleFullscreen() {
  console.log('Toggle fullscreen clicked')
  lastAction.value = '切换全屏'
}
</script>

<style scoped>
.test-view {
  padding: 20px;
  background: #1a1a2e;
  color: white;
  min-height: 100vh;
}

.test-section {
  margin: 40px 0;
  position: relative;
  height: 300px;
}

.debug-info {
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  padding: 20px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.debug-info h3 {
  margin-bottom: 10px;
  color: #64b5f6;
}

.debug-info p {
  margin: 5px 0;
  font-size: 14px;
}
</style>
