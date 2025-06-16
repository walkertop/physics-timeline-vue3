# 点击问题分析和解决方案

## 🔍 问题描述
用户报告只有1785年（库仑定律）和1924年（德布罗意物质波）两个事件节点可以点击，其他节点无法点击。

## 🕵️ 问题分析

### 可能的原因

1. **节点创建问题**
   - 某些节点可能没有正确创建
   - userData设置不正确
   - 几何体或材质问题

2. **点击检测问题**
   - Raycaster设置问题
   - 事件监听器绑定问题
   - 层级结构导致的检测失败

3. **位置和可见性问题**
   - 节点位置超出相机视野
   - 节点被其他对象遮挡
   - 透明度或材质导致不可见

4. **数据结构问题**
   - JSON数据格式不匹配
   - 事件ID不一致
   - 位置坐标问题

## 🔧 已实施的修复

### 1. 增强点击检测逻辑
```typescript
// 修改前：只检查直接对象
if (object.userData && object.userData.type === 'eventNode') {
  // 处理点击
}

// 修改后：检查对象及其父级
for (let i = 0; i < intersects.length; i++) {
  const object = intersects[i].object
  
  // 检查对象本身
  if (object.userData && object.userData.type === 'eventNode') {
    // 处理点击
    return
  }
  
  // 检查父对象
  let parent = object.parent
  while (parent) {
    if (parent.userData && parent.userData.type === 'eventNode') {
      // 处理点击
      return
    }
    parent = parent.parent
  }
}
```

### 2. 确保userData正确设置
```typescript
// 为mesh和group都设置userData
const mesh = new THREE.Mesh(geometry, material)
mesh.userData = { eventId: event.id, type: 'eventNode' }

const group = new THREE.Group()
group.userData = { eventId: event.id, type: 'eventNode' }
```

### 3. 修复高亮显示逻辑
```typescript
// 修复mesh查找逻辑，确保找到正确的主要mesh
const mesh = node.mesh.children.find(child => 
  child instanceof THREE.Mesh && 
  child.userData.type === 'eventNode'
) as THREE.Mesh
```

### 4. 添加调试信息
- 在节点创建时输出日志
- 在点击检测时输出详细信息
- 验证所有事件是否正确加载

## 📊 数据验证

### 当前事件列表（12个事件）
1. **newton-principia** (1687) - 牛顿《自然哲学的数学原理》 - milestone
2. **coulomb-law** (1785) - 库仑定律 - important ✅ 可点击
3. **faraday-electromagnetic-induction** (1831) - 法拉第电磁感应定律 - milestone
4. **maxwell-equations** (1864) - 麦克斯韦电磁理论 - milestone
5. **planck-quantum** (1900) - 普朗克量子假说 - milestone
6. **einstein-photoelectric** (1905) - 爱因斯坦光电效应理论 - milestone
7. **special-relativity** (1905) - 爱因斯坦狭义相对论 - milestone
8. **bohr-atom** (1913) - 玻尔原子模型 - milestone
9. **general-relativity** (1915) - 爱因斯坦广义相对论 - milestone
10. **de-broglie-waves** (1924) - 德布罗意物质波理论 - important ✅ 可点击
11. **heisenberg-uncertainty** (1927) - 海森堡不确定性原理 - milestone
12. **schrodinger-equation** (1926) - 薛定谔方程 - milestone

### 位置分布
- X轴范围：-60 到 55
- Y轴范围：0 到 35
- Z轴范围：-25 到 15
- 相机位置：(0, 30, 80)

## 🎯 可能的根本原因

### 1. 节点类型差异
观察到只有两个`important`类型的节点可以点击，而`milestone`类型的节点不能点击。这可能表明：
- 八面体几何体（milestone）的点击检测有问题
- 球体几何体（important）的点击检测正常

### 2. 材质或透明度问题
- milestone节点使用八面体几何体，可能存在面法线或材质问题
- 透明度设置可能影响raycaster检测

### 3. 缩放因子影响
```typescript
// milestone节点缩放更大
scale = 1.8  // milestone
scale = 1.4  // important
scale = 1.0  // normal
```

## 🔍 下一步调试建议

### 1. 验证几何体类型
```typescript
// 临时将所有节点都改为球体几何体测试
geometry = new THREE.SphereGeometry(1.5)
```

### 2. 检查材质设置
```typescript
// 临时移除透明度和发光效果
material = new THREE.MeshPhongMaterial({
  color: 0xff4444,
  // 移除 transparent 和 opacity
})
```

### 3. 简化节点结构
```typescript
// 临时移除glow效果和文字标签，只保留基本mesh
```

### 4. 验证位置可见性
```typescript
// 将所有节点临时放在相同位置测试
group.position.set(0, 0, 0)
```

## 🎉 预期解决方案

基于分析，最可能的解决方案是：
1. **修复八面体几何体的点击检测**
2. **调整材质设置以确保raycaster正确工作**
3. **优化节点层级结构**

修复后，所有12个物理学事件节点都应该可以正常点击和交互。
