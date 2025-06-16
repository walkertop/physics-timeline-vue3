<template>
  <Transition name="guide-fade">
    <div v-if="isVisible" class="guide-character">
      <!-- 导游角色 -->
      <div class="guide-avatar">
        <div class="avatar-container">
          <div class="avatar-face">
            <div class="eyes">
              <div class="eye left"></div>
              <div class="eye right"></div>
            </div>
            <div class="mouth" :class="{ talking: isTalking }"></div>
          </div>
          <div class="avatar-body"></div>
        </div>
      </div>
      
      <!-- 对话气泡 -->
      <div class="speech-bubble">
        <div class="bubble-content">
          <div class="guide-text">
            <h3 class="event-title">{{ currentEvent?.title }}</h3>
            <div class="guide-message">
              <p v-if="currentStep === 'intro'" class="intro-text">
                {{ getIntroText() }}
              </p>
              <p v-else-if="currentStep === 'background'" class="background-text">
                {{ currentEvent?.detailedContent?.background }}
              </p>
              <div v-else-if="currentStep === 'problems'" class="problems-section">
                <h4>当时面临的问题：</h4>
                <ul>
                  <li v-for="problem in currentEvent?.detailedContent?.problems" :key="problem">
                    {{ problem }}
                  </li>
                </ul>
              </div>
              <div v-else-if="currentStep === 'hypotheses'" class="hypotheses-section">
                <h4>当时的假设和猜想：</h4>
                <ul>
                  <li v-for="hypothesis in currentEvent?.detailedContent?.hypotheses" :key="hypothesis">
                    {{ hypothesis }}
                  </li>
                </ul>
              </div>
              <div v-else-if="currentStep === 'solution'" class="solution-section">
                <h4>{{ currentEvent?.detailedContent?.solution?.discoverer }} 的解决方案：</h4>
                <p><strong>方法：</strong>{{ currentEvent?.detailedContent?.solution?.method }}</p>
                <div class="key-insights">
                  <h5>关键洞察：</h5>
                  <ul>
                    <li v-for="insight in currentEvent?.detailedContent?.solution?.keyInsights" :key="insight">
                      {{ insight }}
                    </li>
                  </ul>
                </div>
              </div>
              <div v-else-if="currentStep === 'controversies'" class="controversies-section">
                <h4>争议和反对：</h4>
                <p><strong>初期反应：</strong>{{ getReceptionText() }}</p>
                <div v-if="currentEvent?.detailedContent?.acceptance?.controversies">
                  <h5>主要争议：</h5>
                  <ul>
                    <li v-for="controversy in currentEvent?.detailedContent?.acceptance?.controversies" :key="controversy">
                      {{ controversy }}
                    </li>
                  </ul>
                </div>
              </div>
              <div v-else-if="currentStep === 'proof'" class="proof-section">
                <h4>如何被证明：</h4>
                <div v-if="currentEvent?.detailedContent?.proof?.theoreticalEvidence">
                  <h5>理论证据：</h5>
                  <ul>
                    <li v-for="evidence in currentEvent?.detailedContent?.proof?.theoreticalEvidence" :key="evidence">
                      {{ evidence }}
                    </li>
                  </ul>
                </div>
                <div v-if="currentEvent?.detailedContent?.proof?.experimentalEvidence">
                  <h5>实验证据：</h5>
                  <ul>
                    <li v-for="evidence in currentEvent?.detailedContent?.proof?.experimentalEvidence" :key="evidence">
                      {{ evidence }}
                    </li>
                  </ul>
                </div>
              </div>
              <p v-else-if="currentStep === 'impact'" class="impact-text">
                <strong>影响：</strong>{{ currentEvent?.detailedContent?.impact }}
              </p>
            </div>
          </div>
          
          <!-- 步骤指示器 -->
          <div class="step-indicator">
            <div 
              v-for="(step, index) in steps" 
              :key="step"
              class="step-dot"
              :class="{ active: index === currentStepIndex }"
              @click="goToStep(index)"
            ></div>
          </div>
          
          <!-- 控制按钮 -->
          <div class="guide-controls">
            <button 
              class="control-btn prev-btn" 
              @click="previousStep"
              :disabled="currentStepIndex === 0"
            >
              上一步
            </button>
            
            <button 
              class="control-btn details-btn" 
              @click="showDetails"
            >
              详细信息
            </button>
            
            <button 
              class="control-btn next-btn" 
              @click="nextStep"
              :disabled="currentStepIndex === steps.length - 1"
            >
              {{ currentStepIndex === steps.length - 1 ? '下一个事件' : '下一步' }}
            </button>
          </div>
        </div>
        
        <!-- 关闭按钮 -->
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { PhysicsEvent } from '@/types/PhysicsEvent'

interface Props {
  currentEvent: PhysicsEvent | null
  isVisible: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  next: []
  previous: []
  close: []
  showDetails: [event: PhysicsEvent]
}>()

// 响应式数据
const currentStepIndex = ref(0)
const isTalking = ref(false)

// 步骤定义
const steps = [
  'intro',
  'background', 
  'problems',
  'hypotheses',
  'solution',
  'controversies',
  'proof',
  'impact'
]

const currentStep = computed(() => steps[currentStepIndex.value])

// 监听事件变化，重置步骤
watch(() => props.currentEvent, () => {
  currentStepIndex.value = 0
  startTalking()
})

// 方法
function getIntroText() {
  if (!props.currentEvent) return ''
  
  const event = props.currentEvent
  return `欢迎来到${event.year}年！我是你的物理学导游。今天我们要探索${event.person.name}的重大发现：${event.title}。这个发现${event.shortDescription}。让我们一步步了解这个激动人心的科学故事！`
}

function getReceptionText() {
  const reception = props.currentEvent?.detailedContent?.acceptance?.initialReception
  const receptionMap: Record<string, string> = {
    'positive': '积极接受',
    'negative': '强烈反对',
    'mixed': '褒贬不一',
    'skeptical': '持怀疑态度',
    'enthusiastic': '热烈欢迎',
    'controversial': '引起争议',
    'reluctant': '勉强接受'
  }
  return receptionMap[reception || ''] || '反应不明'
}

function nextStep() {
  if (currentStepIndex.value < steps.length - 1) {
    currentStepIndex.value++
    startTalking()
  } else {
    // 最后一步，跳转到下一个事件
    emit('next')
  }
}

function previousStep() {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--
    startTalking()
  }
}

function goToStep(index: number) {
  currentStepIndex.value = index
  startTalking()
}

function showDetails() {
  // 触发显示详细信息的事件，由父组件处理
  console.log('显示详细信息:', props.currentEvent?.title)
}

function startTalking() {
  isTalking.value = true
  setTimeout(() => {
    isTalking.value = false
  }, 2000)
}
</script>

<style scoped>
.guide-character {
  position: fixed;
  bottom: 40px;
  left: 40px;
  z-index: 1200;
  display: flex;
  align-items: flex-end;
  gap: 25px;
  pointer-events: none;
}

/* 导游角色样式 */
.guide-avatar {
  width: 120px;
  height: 150px;
}

.avatar-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.avatar-face {
  width: 80px;
  height: 80px;
  background: linear-gradient(145deg, #f0c674, #e6b85c);
  border-radius: 50%;
  position: relative;
  margin: 0 auto;
  box-shadow: 0 4px 15px rgba(240, 198, 116, 0.3);
}

.eyes {
  position: absolute;
  top: 25px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 15px;
}

.eye {
  width: 8px;
  height: 8px;
  background: #2c3e50;
  border-radius: 50%;
  animation: blink 3s infinite;
}

.mouth {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 10px;
  border: 2px solid #2c3e50;
  border-top: none;
  border-radius: 0 0 20px 20px;
  transition: all 0.3s ease;
}

.mouth.talking {
  animation: talk 0.5s infinite alternate;
}

.avatar-body {
  width: 60px;
  height: 70px;
  background: linear-gradient(145deg, #3498db, #2980b9);
  border-radius: 30px 30px 10px 10px;
  margin: 10px auto 0;
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
}

/* 对话气泡样式 */
.speech-bubble {
  position: relative;
  background: rgba(0, 0, 0, 0.88);
  backdrop-filter: blur(20px);
  border-radius: 25px;
  padding: 30px;
  max-width: 520px;
  min-width: 420px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6);
  pointer-events: auto;
}

.speech-bubble::before {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 30px;
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-top: 15px solid rgba(0, 0, 0, 0.9);
}

.bubble-content {
  color: white;
}

.event-title {
  font-size: 18px;
  font-weight: 600;
  color: #64b5f6;
  margin-bottom: 15px;
}

.guide-message {
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 20px;
  min-height: 120px;
}

.guide-message h4 {
  color: #64b5f6;
  font-size: 16px;
  margin-bottom: 10px;
}

.guide-message h5 {
  color: #81c784;
  font-size: 14px;
  margin: 10px 0 5px 0;
}

.guide-message ul {
  list-style: none;
  padding-left: 0;
}

.guide-message li {
  padding: 5px 0;
  padding-left: 20px;
  position: relative;
}

.guide-message li::before {
  content: '•';
  color: #64b5f6;
  position: absolute;
  left: 0;
}

/* 步骤指示器 */
.step-indicator {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
}

.step-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.step-dot.active {
  background: #64b5f6;
  transform: scale(1.2);
}

.step-dot:hover {
  background: rgba(100, 181, 246, 0.7);
}

/* 控制按钮 */
.guide-controls {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.control-btn {
  padding: 10px 16px;
  background: rgba(100, 181, 246, 0.2);
  border: 1px solid rgba(100, 181, 246, 0.5);
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 12px;
}

.control-btn:hover:not(:disabled) {
  background: rgba(100, 181, 246, 0.4);
  transform: translateY(-2px);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.details-btn {
  background: rgba(129, 199, 132, 0.2);
  border-color: rgba(129, 199, 132, 0.5);
}

.details-btn:hover {
  background: rgba(129, 199, 132, 0.4);
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 24px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.close-btn:hover {
  color: #ff6b6b;
}

/* 动画 */
@keyframes blink {
  0%, 90%, 100% { transform: scaleY(1); }
  95% { transform: scaleY(0.1); }
}

@keyframes talk {
  0% { height: 10px; }
  100% { height: 15px; }
}

.guide-fade-enter-active,
.guide-fade-leave-active {
  transition: all 0.5s ease;
}

.guide-fade-enter-from,
.guide-fade-leave-to {
  opacity: 0;
  transform: translateY(50px);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .guide-character {
    bottom: 140px;
    left: 20px;
    transform: scale(0.9);
  }

  .speech-bubble {
    width: 320px;
  }
}

@media (max-width: 768px) {
  .guide-character {
    bottom: 120px;
    left: 15px;
    transform: scale(0.8);
  }

  .speech-bubble {
    width: 280px;
    font-size: 13px;
    padding: 12px 15px;
    max-width: calc(100vw - 120px);
  }

  .guide-controls {
    gap: 8px;
    flex-wrap: wrap;
  }

  .control-btn {
    padding: 6px 10px;
    font-size: 12px;
    min-width: 60px;
  }

  .step-indicator {
    font-size: 11px;
  }

  .guide-message {
    font-size: 13px;
    min-height: 100px;
  }

  .guide-message h4 {
    font-size: 15px;
  }

  .guide-message h5 {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .guide-character {
    bottom: 100px;
    left: 10px;
    transform: scale(0.7);
  }

  .speech-bubble {
    width: 250px;
    font-size: 12px;
    padding: 10px 12px;
    max-width: calc(100vw - 100px);
  }

  .guide-controls {
    flex-direction: column;
    gap: 5px;
  }

  .control-btn {
    padding: 5px 8px;
    font-size: 11px;
    width: 100%;
  }

  .step-indicator {
    font-size: 10px;
    order: -1;
  }

  .guide-message {
    font-size: 12px;
    min-height: 80px;
  }

  .guide-message h4 {
    font-size: 14px;
  }

  .guide-message h5 {
    font-size: 12px;
  }
}

@media (max-width: 360px) {
  .guide-character {
    transform: scale(0.6);
    bottom: 80px;
    left: 5px;
  }

  .speech-bubble {
    width: 220px;
    max-width: calc(100vw - 80px);
  }

  .guide-message {
    min-height: 70px;
  }
}
</style>
