<template>
  <Transition name="help-fade">
    <div v-if="visible" class="help-panel">
      <div class="help-content">
        <div class="help-header">
          <h2>🎯 使用指南</h2>
          <button class="close-btn" @click="$emit('close')">×</button>
        </div>
        
        <div class="help-sections">
          <div class="help-section">
            <h3>🖱️ 基本操作</h3>
            <ul>
              <li><strong>鼠标拖拽</strong>：旋转视角</li>
              <li><strong>滚轮</strong>：缩放场景</li>
              <li><strong>点击节点</strong>：查看详细信息</li>
              <li><strong>右键拖拽</strong>：平移视角</li>
            </ul>
          </div>
          
          <div class="help-section">
            <h3>🎭 导游系统</h3>
            <ul>
              <li>点击任意事件节点激活导游</li>
              <li>导游将提供8个步骤的详细讲解</li>
              <li>可以随时跳转到不同步骤</li>
              <li>点击"查看详情"获得完整信息</li>
            </ul>
          </div>
          
          <div class="help-section">
            <h3>🎮 控制面板</h3>
            <ul>
              <li><strong>播放/暂停</strong>：自动播放时间轴</li>
              <li><strong>上一个/下一个</strong>：手动切换事件</li>
              <li><strong>重置</strong>：回到初始状态</li>
              <li><strong>快速跳转</strong>：直接选择事件</li>
            </ul>
          </div>
          
          <div class="help-section">
            <h3>🔍 节点类型</h3>
            <div class="node-types">
              <div class="node-type">
                <div class="node-example milestone"></div>
                <span>里程碑事件（红色八面体）</span>
              </div>
              <div class="node-type">
                <div class="node-example important"></div>
                <span>重要发现（橙色球体）</span>
              </div>
              <div class="node-type">
                <div class="node-example normal"></div>
                <span>一般事件（蓝色球体）</span>
              </div>
            </div>
          </div>
          
          <div class="help-section">
            <h3>📱 移动设备</h3>
            <ul>
              <li><strong>单指拖拽</strong>：旋转视角</li>
              <li><strong>双指缩放</strong>：放大缩小</li>
              <li><strong>双指拖拽</strong>：平移视角</li>
              <li><strong>点击节点</strong>：查看详情</li>
            </ul>
          </div>
          
          <div class="help-section">
            <h3>⌨️ 快捷键</h3>
            <ul>
              <li><strong>空格</strong>：播放/暂停</li>
              <li><strong>←/→</strong>：上一个/下一个事件</li>
              <li><strong>R</strong>：重置相机</li>
              <li><strong>F</strong>：全屏模式</li>
              <li><strong>H</strong>：显示/隐藏帮助</li>
            </ul>
          </div>
        </div>
        
        <div class="help-footer">
          <p>💡 提示：将鼠标悬停在任何按钮上可查看详细说明</p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
interface Props {
  visible: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()
</script>

<style scoped>
.help-panel {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.help-content {
  background: rgba(0, 0, 0, 0.95);
  border-radius: 20px;
  padding: 30px;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
}

.help-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.help-header h2 {
  color: #64b5f6;
  font-size: 28px;
  margin: 0;
}

.close-btn {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: white;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: rgba(244, 67, 54, 0.3);
  border-color: #f44336;
}

.help-sections {
  display: grid;
  gap: 25px;
}

.help-section h3 {
  color: #81c784;
  font-size: 18px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.help-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.help-section li {
  padding: 8px 0;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.help-section li::before {
  content: '•';
  color: #64b5f6;
  font-weight: bold;
  margin-top: 2px;
}

.help-section strong {
  color: #64b5f6;
}

.node-types {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 10px;
}

.node-type {
  display: flex;
  align-items: center;
  gap: 15px;
  color: rgba(255, 255, 255, 0.9);
}

.node-example {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  flex-shrink: 0;
}

.node-example.milestone {
  background: #ff4444;
  clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
  border-radius: 0;
}

.node-example.important {
  background: #ffaa00;
}

.node-example.normal {
  background: #4488ff;
}

.help-footer {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.help-footer p {
  color: rgba(255, 255, 255, 0.7);
  font-style: italic;
  margin: 0;
}

/* 动画 */
.help-fade-enter-active,
.help-fade-leave-active {
  transition: all 0.3s ease;
}

.help-fade-enter-from,
.help-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* 滚动条 */
.help-content::-webkit-scrollbar {
  width: 6px;
}

.help-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.help-content::-webkit-scrollbar-thumb {
  background: rgba(100, 181, 246, 0.5);
  border-radius: 3px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .help-content {
    padding: 20px;
    margin: 10px;
    max-height: 95vh;
  }
  
  .help-header h2 {
    font-size: 24px;
  }
  
  .help-section h3 {
    font-size: 16px;
  }
  
  .node-types {
    gap: 10px;
  }
  
  .help-sections {
    gap: 20px;
  }
}
</style>
