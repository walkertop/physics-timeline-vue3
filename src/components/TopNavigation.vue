<template>
  <div class="top-navigation">
    <div class="nav-left">
      <div class="logo">
        <span class="logo-icon">⚛️</span>
        <span class="logo-text">Physics Timeline</span>
      </div>
    </div>
    
    <div class="nav-center">
      <div class="timeline-info">
        <span class="current-era">{{ currentEra }}</span>
        <span class="event-count">{{ currentEventIndex + 1 }} / {{ totalEvents }}</span>
      </div>
    </div>
    
    <div class="nav-right">
      <button 
        class="nav-btn"
        @click="$emit('toggleHelp')"
        title="帮助"
      >
        <span class="icon">❓</span>
      </button>
      
      <button 
        class="nav-btn"
        @click="$emit('toggleSettings')"
        title="设置"
      >
        <span class="icon">⚙️</span>
      </button>
      
      <button 
        class="nav-btn"
        @click="$emit('toggleFullscreen')"
        title="全屏"
      >
        <span class="icon">⛶</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  currentEventIndex: number
  totalEvents: number
  currentEvent?: any
}

const props = withDefaults(defineProps<Props>(), {
  currentEventIndex: 0,
  totalEvents: 0
})

const emit = defineEmits<{
  toggleHelp: []
  toggleSettings: []
  toggleFullscreen: []
}>()

const currentEra = computed(() => {
  if (!props.currentEvent) return '物理学发展史'
  
  const year = props.currentEvent.year
  if (year < 1600) return '古典物理学前期'
  if (year < 1900) return '经典物理学时期'
  if (year < 1950) return '现代物理学诞生'
  return '当代物理学'
})
</script>

<style scoped>
.top-navigation {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
}

.nav-left {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
  font-weight: 600;
  font-size: 18px;
}

.logo-icon {
  font-size: 24px;
  animation: rotate 10s linear infinite;
}

.logo-text {
  background: linear-gradient(45deg, #64b5f6, #81c784);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.timeline-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.current-era {
  color: #64b5f6;
  font-size: 16px;
  font-weight: 500;
}

.event-count {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 12px;
  border-radius: 12px;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.nav-btn {
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
  font-size: 18px;
}

.nav-btn:hover {
  background: rgba(100, 181, 246, 0.3);
  border-color: #64b5f6;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(100, 181, 246, 0.3);
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .top-navigation {
    height: 60px;
    padding: 0 20px;
  }
  
  .logo-text {
    display: none;
  }
  
  .nav-center {
    flex-direction: row;
    gap: 15px;
  }
  
  .timeline-info {
    flex-direction: row;
    gap: 10px;
  }
  
  .current-era {
    font-size: 14px;
  }
  
  .event-count {
    font-size: 12px;
  }
  
  .nav-btn {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
  
  .nav-right {
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .top-navigation {
    height: 50px;
    padding: 0 15px;
  }
  
  .current-era {
    display: none;
  }
  
  .nav-btn {
    width: 35px;
    height: 35px;
    font-size: 14px;
  }
}
</style>
