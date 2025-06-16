<template>
  <Transition name="panel-slide">
    <div v-if="isVisible && event" class="event-detail-panel">
      <div class="panel-header">
        <div class="header-content">
          <h2 class="event-title">{{ event.title }}</h2>
          <div class="event-meta">
            <span class="year">{{ event.year }}年</span>
            <span class="person">{{ event.person.name }}</span>
            <span class="category">{{ getCategoryName(event.category) }}</span>
          </div>
        </div>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>
      
      <div class="panel-content">
        <!-- 人物信息 -->
        <div class="person-section">
          <div class="person-info">
            <div class="person-avatar">
              <img v-if="event.person.portrait" :src="event.person.portrait" :alt="event.person.name" />
              <div v-else class="avatar-placeholder">{{ event.person.name.charAt(0) }}</div>
            </div>
            <div class="person-details">
              <h3>{{ event.person.name }}</h3>
              <p class="person-name-en">{{ event.person.nameEn }}</p>
              <p class="person-life">{{ event.person.birth }} - {{ event.person.death }}</p>
              <p class="person-nationality">{{ event.person.nationality }}</p>
            </div>
          </div>
        </div>
        
        <!-- 事件描述 -->
        <div class="description-section">
          <h3>概述</h3>
          <p>{{ event.shortDescription }}</p>
        </div>
        
        <!-- 详细内容标签页 -->
        <div class="detail-tabs">
          <div class="tab-headers">
            <button 
              v-for="tab in tabs" 
              :key="tab.key"
              class="tab-header"
              :class="{ active: activeTab === tab.key }"
              @click="activeTab = tab.key"
            >
              {{ tab.label }}
            </button>
          </div>
          
          <div class="tab-content">
            <!-- 背景 -->
            <div v-if="activeTab === 'background'" class="tab-panel">
              <h4>历史背景</h4>
              <p>{{ event.detailedContent?.background }}</p>
            </div>
            
            <!-- 问题与挑战 -->
            <div v-if="activeTab === 'problems'" class="tab-panel">
              <h4>面临的问题</h4>
              <ul class="problem-list">
                <li v-for="problem in event.detailedContent?.problems" :key="problem">
                  <span class="problem-icon">⚠️</span>
                  {{ problem }}
                </li>
              </ul>
            </div>
            
            <!-- 假设与猜想 -->
            <div v-if="activeTab === 'hypotheses'" class="tab-panel">
              <h4>当时的假设和猜想</h4>
              <div class="hypothesis-list">
                <div v-for="(hypothesis, index) in event.detailedContent?.hypotheses" :key="index" class="hypothesis-item">
                  <span class="hypothesis-number">{{ index + 1 }}</span>
                  <p>{{ hypothesis }}</p>
                </div>
              </div>
            </div>
            
            <!-- 解决方案 -->
            <div v-if="activeTab === 'solution'" class="tab-panel">
              <h4>{{ event.detailedContent?.solution?.discoverer }} 的解决方案</h4>
              <div class="solution-content">
                <div class="solution-method">
                  <h5>研究方法</h5>
                  <p>{{ event.detailedContent?.solution?.method }}</p>
                </div>
                <div class="key-insights">
                  <h5>关键洞察</h5>
                  <ul>
                    <li v-for="insight in event.detailedContent?.solution?.keyInsights" :key="insight">
                      <span class="insight-icon">💡</span>
                      {{ insight }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <!-- 争议与接受 -->
            <div v-if="activeTab === 'acceptance'" class="tab-panel">
              <h4>学术界的反应</h4>
              <div class="acceptance-content">
                <div class="initial-reception">
                  <h5>初期反应</h5>
                  <p class="reception-badge" :class="getReceptionClass()">
                    {{ getReceptionText() }}
                  </p>
                </div>
                
                <div class="supporters-opponents">
                  <div class="supporters">
                    <h5>支持者</h5>
                    <ul>
                      <li v-for="supporter in event.detailedContent?.acceptance?.supporters" :key="supporter">
                        <span class="support-icon">👍</span>
                        {{ supporter }}
                      </li>
                    </ul>
                  </div>
                  
                  <div class="opponents">
                    <h5>反对者</h5>
                    <ul>
                      <li v-for="opponent in event.detailedContent?.acceptance?.opponents" :key="opponent">
                        <span class="oppose-icon">👎</span>
                        {{ opponent }}
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div class="controversies">
                  <h5>主要争议</h5>
                  <ul>
                    <li v-for="controversy in event.detailedContent?.acceptance?.controversies" :key="controversy">
                      <span class="controversy-icon">⚡</span>
                      {{ controversy }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <!-- 证明过程 -->
            <div v-if="activeTab === 'proof'" class="tab-panel">
              <h4>如何被证明</h4>
              <div class="proof-content">
                <div v-if="event.detailedContent?.proof?.theoreticalEvidence" class="theoretical-evidence">
                  <h5>理论证据</h5>
                  <ul>
                    <li v-for="evidence in event.detailedContent.proof.theoreticalEvidence" :key="evidence">
                      <span class="theory-icon">📐</span>
                      {{ evidence }}
                    </li>
                  </ul>
                </div>
                
                <div v-if="event.detailedContent?.proof?.experimentalEvidence" class="experimental-evidence">
                  <h5>实验证据</h5>
                  <ul>
                    <li v-for="evidence in event.detailedContent.proof.experimentalEvidence" :key="evidence">
                      <span class="experiment-icon">🔬</span>
                      {{ evidence }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <!-- 公式 -->
            <div v-if="activeTab === 'formulas'" class="tab-panel">
              <h4>相关公式</h4>
              <div class="formulas-content">
                <div v-for="formula in event.detailedContent?.formulas" :key="formula" class="formula-item">
                  <code class="formula">{{ formula }}</code>
                </div>
              </div>
            </div>
            
            <!-- 影响 -->
            <div v-if="activeTab === 'impact'" class="tab-panel">
              <h4>历史影响</h4>
              <p class="impact-text">{{ event.detailedContent?.impact }}</p>
              
              <div class="modern-relevance">
                <h5>现代意义</h5>
                <p>{{ event.detailedContent?.modernRelevance }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 关联事件 -->
        <div class="connections-section">
          <h3>相关事件</h3>
          <div class="connections-grid">
            <div v-if="event.connections?.length" class="connections-group">
              <h4>前置事件</h4>
              <div class="connection-items">
                <div v-for="connectionId in event.connections" :key="connectionId" class="connection-item">
                  {{ connectionId }}
                </div>
              </div>
            </div>
            
            <div v-if="event.nextInfluences?.length" class="connections-group">
              <h4>后续影响</h4>
              <div class="connection-items">
                <div v-for="influenceId in event.nextInfluences" :key="influenceId" class="connection-item">
                  {{ influenceId }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { PhysicsEvent } from '@/types/PhysicsEvent'

interface Props {
  event: PhysicsEvent | null
  isVisible: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

// 响应式数据
const activeTab = ref('background')

// 标签页配置
const tabs = [
  { key: 'background', label: '背景' },
  { key: 'problems', label: '问题' },
  { key: 'hypotheses', label: '假设' },
  { key: 'solution', label: '解决方案' },
  { key: 'acceptance', label: '争议' },
  { key: 'proof', label: '证明' },
  { key: 'formulas', label: '公式' },
  { key: 'impact', label: '影响' }
]

// 方法
function getCategoryName(category: string) {
  const categoryNames: Record<string, string> = {
    'classical_mechanics': '经典力学',
    'electromagnetism': '电磁学',
    'quantum_origins': '量子起源',
    'quantum_development': '量子发展',
    'quantum_mechanics': '量子力学',
    'atomic_structure': '原子结构',
    'quantum_interpretation': '量子诠释'
  }
  return categoryNames[category] || category
}

function getReceptionText() {
  const reception = props.event?.detailedContent?.acceptance?.initialReception
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

function getReceptionClass() {
  const reception = props.event?.detailedContent?.acceptance?.initialReception
  return `reception-${reception}`
}
</script>

<style scoped>
.event-detail-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 450px;
  height: 100vh;
  background: rgba(0, 0, 0, 0.92);
  backdrop-filter: blur(25px);
  border-left: 1px solid rgba(255, 255, 255, 0.15);
  z-index: 1500;
  overflow-y: auto;
  color: white;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.5);
}

.panel-header {
  position: sticky;
  top: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(15px);
  padding: 25px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.header-content {
  flex: 1;
}

.event-title {
  font-size: 20px;
  font-weight: 600;
  color: #64b5f6;
  margin-bottom: 10px;
  line-height: 1.3;
}

.event-meta {
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 14px;
}

.year {
  color: #81c784;
  font-weight: 600;
}

.person {
  color: #ffb74d;
}

.category {
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.close-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 28px;
  cursor: pointer;
  padding: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
}

.panel-content {
  padding: 25px;
}

/* 人物信息 */
.person-section {
  margin-bottom: 30px;
}

.person-info {
  display: flex;
  gap: 15px;
  align-items: center;
}

.person-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(145deg, #64b5f6, #42a5f5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.person-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  font-size: 24px;
  font-weight: bold;
  color: white;
}

.person-details h3 {
  font-size: 18px;
  color: #64b5f6;
  margin-bottom: 5px;
}

.person-name-en {
  font-style: italic;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

.person-life, .person-nationality {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
}

/* 描述部分 */
.description-section {
  margin-bottom: 30px;
}

.description-section h3 {
  color: #64b5f6;
  margin-bottom: 10px;
  font-size: 16px;
}

.description-section p {
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
}

/* 标签页 */
.detail-tabs {
  margin-bottom: 30px;
}

.tab-headers {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.tab-header {
  padding: 8px 12px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  border-radius: 6px 6px 0 0;
  transition: all 0.3s ease;
  font-size: 12px;
}

.tab-header.active {
  color: #64b5f6;
  background: rgba(100, 181, 246, 0.1);
  border-bottom: 2px solid #64b5f6;
}

.tab-header:hover:not(.active) {
  color: white;
  background: rgba(255, 255, 255, 0.05);
}

.tab-content {
  min-height: 200px;
}

.tab-panel h4 {
  color: #64b5f6;
  margin-bottom: 15px;
  font-size: 16px;
}

.tab-panel h5 {
  color: #81c784;
  margin: 15px 0 8px 0;
  font-size: 14px;
}

.tab-panel p {
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 15px;
}

.tab-panel ul {
  list-style: none;
  padding: 0;
}

.tab-panel li {
  padding: 8px 0;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  line-height: 1.5;
}

/* 特殊样式 */
.reception-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.reception-positive { background: rgba(76, 175, 80, 0.2); color: #4caf50; }
.reception-negative { background: rgba(244, 67, 54, 0.2); color: #f44336; }
.reception-mixed { background: rgba(255, 152, 0, 0.2); color: #ff9800; }
.reception-skeptical { background: rgba(156, 39, 176, 0.2); color: #9c27b0; }
.reception-enthusiastic { background: rgba(76, 175, 80, 0.2); color: #4caf50; }
.reception-controversial { background: rgba(244, 67, 54, 0.2); color: #f44336; }
.reception-reluctant { background: rgba(121, 85, 72, 0.2); color: #795548; }

.formula-item {
  background: rgba(255, 255, 255, 0.05);
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 10px;
  border-left: 3px solid #64b5f6;
}

.formula {
  font-family: 'Courier New', monospace;
  font-size: 16px;
  color: #64b5f6;
}

/* 连接事件 */
.connections-section h3 {
  color: #64b5f6;
  margin-bottom: 15px;
}

.connections-grid {
  display: grid;
  gap: 20px;
}

.connections-group h4 {
  color: #81c784;
  font-size: 14px;
  margin-bottom: 10px;
}

.connection-items {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.connection-item {
  background: rgba(100, 181, 246, 0.1);
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 12px;
  color: #64b5f6;
  border: 1px solid rgba(100, 181, 246, 0.3);
}

/* 动画 */
.panel-slide-enter-active,
.panel-slide-leave-active {
  transition: transform 0.3s ease;
}

.panel-slide-enter-from,
.panel-slide-leave-to {
  transform: translateX(100%);
}

/* 滚动条 */
.event-detail-panel::-webkit-scrollbar {
  width: 6px;
}

.event-detail-panel::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.event-detail-panel::-webkit-scrollbar-thumb {
  background: rgba(100, 181, 246, 0.5);
  border-radius: 3px;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .event-detail-panel {
    width: 60%;
  }
}

@media (max-width: 768px) {
  .event-detail-panel {
    width: 100%;
    height: 100vh;
    top: 0;
    right: 0;
    border-left: none;
    border-radius: 0;
  }

  .panel-header {
    padding: 20px;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .panel-title {
    font-size: 18px;
    line-height: 1.3;
    padding-right: 40px;
  }

  .close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 35px;
    height: 35px;
    font-size: 18px;
  }

  .panel-content {
    padding: 0 20px 20px;
  }

  .tab-headers {
    flex-wrap: wrap;
    gap: 5px;
    margin-bottom: 15px;
  }

  .tab-header {
    padding: 8px 12px;
    font-size: 12px;
    flex: 1;
    min-width: calc(33.33% - 3px);
    text-align: center;
  }

  .tab-content {
    font-size: 14px;
    line-height: 1.5;
  }

  .tab-panel h4 {
    font-size: 15px;
  }

  .tab-panel h5 {
    font-size: 13px;
  }

  .formula {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .panel-header {
    padding: 15px;
  }

  .panel-title {
    font-size: 16px;
    padding-right: 35px;
  }

  .close-btn {
    top: 15px;
    right: 15px;
    width: 30px;
    height: 30px;
    font-size: 16px;
  }

  .panel-content {
    padding: 0 15px 15px;
  }

  .tab-header {
    font-size: 11px;
    padding: 6px 8px;
    min-width: calc(50% - 2.5px);
  }

  .tab-content {
    font-size: 13px;
  }

  .tab-panel h4 {
    font-size: 14px;
  }

  .tab-panel h5 {
    font-size: 12px;
  }

  .formula {
    font-size: 13px;
  }

  .formula-item {
    padding: 10px;
  }

  .connection-item {
    font-size: 11px;
    padding: 4px 8px;
  }
}
</style>
