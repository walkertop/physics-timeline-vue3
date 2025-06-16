import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { gsap } from 'gsap'
import type { PhysicsEvent, SceneNode, ConnectionLine } from '@/types/PhysicsEvent'

export class SceneManager {
  private container: HTMLElement
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private renderer: THREE.WebGLRenderer
  private controls: OrbitControls
  private raycaster: THREE.Raycaster
  private mouse: THREE.Vector2

  // 场景对象
  private eventNodes: Map<string, SceneNode> = new Map()
  private connectionLines: Map<string, ConnectionLine> = new Map()
  private timelineCurve: THREE.Mesh | null = null

  // 事件回调
  public onNodeClick: ((event: PhysicsEvent) => void) | null = null
  public onNodeHover: ((event: PhysicsEvent | null) => void) | null = null

  // 动画
  private animationId: number | null = null
  private hoveredNode: SceneNode | null = null

  constructor(container: HTMLElement) {
    this.container = container
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera()
    this.renderer = new THREE.WebGLRenderer()
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()
  }

  async initialize(): Promise<void> {
    this.setupScene()
    this.setupCamera()
    this.setupRenderer()
    this.setupControls()
    this.setupLights()
    this.setupEventListeners()
    this.createTimeline()
    this.startAnimation()
  }

  private setupScene(): void {
    this.scene.background = new THREE.Color(0x000000)
    this.scene.fog = new THREE.Fog(0x000000, 50, 200)
  }

  private setupCamera(): void {
    const aspect = window.innerWidth / window.innerHeight
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
    this.camera.position.set(0, 30, 80)
    this.camera.lookAt(0, 0, 0)
  }

  private setupRenderer(): void {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance"
    })

    // 确保canvas铺满整个容器
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.2

    // 设置canvas样式确保全屏
    this.renderer.domElement.style.position = 'fixed'
    this.renderer.domElement.style.top = '0'
    this.renderer.domElement.style.left = '0'
    this.renderer.domElement.style.width = '100vw'
    this.renderer.domElement.style.height = '100vh'
    this.renderer.domElement.style.zIndex = '1'

    this.container.appendChild(this.renderer.domElement)
  }

  private setupControls(): void {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.05
    this.controls.screenSpacePanning = false
    this.controls.minDistance = 20
    this.controls.maxDistance = 300
    this.controls.maxPolarAngle = Math.PI
    this.controls.autoRotate = false
    this.controls.autoRotateSpeed = 0.5
  }

  private setupLights(): void {
    // 环境光
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
    this.scene.add(ambientLight)

    // 主光源
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(50, 50, 50)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    this.scene.add(directionalLight)

    // 点光源
    const pointLight = new THREE.PointLight(0x64b5f6, 0.8, 100)
    pointLight.position.set(0, 40, 0)
    this.scene.add(pointLight)

    // 创建星空背景
    this.createStarField()
  }

  private createStarField(): void {
    const starsGeometry = new THREE.BufferGeometry()
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.5,
      transparent: true,
      opacity: 0.8
    })

    const starsVertices = []
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 2000
      const y = (Math.random() - 0.5) * 2000
      const z = (Math.random() - 0.5) * 2000
      starsVertices.push(x, y, z)
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3))
    const starField = new THREE.Points(starsGeometry, starsMaterial)
    this.scene.add(starField)
  }

  private createTimeline(): void {
    // 创建螺旋形时间轴
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-80, -15, 0),
      new THREE.Vector3(-40, 0, 30),
      new THREE.Vector3(0, 15, 0),
      new THREE.Vector3(40, 0, -30),
      new THREE.Vector3(80, -15, 0)
    ])

    const tubeGeometry = new THREE.TubeGeometry(curve, 100, 0.3, 8, false)
    const tubeMaterial = new THREE.MeshPhongMaterial({
      color: 0x64b5f6,
      transparent: true,
      opacity: 0.6,
      emissive: 0x001122
    })

    this.timelineCurve = new THREE.Mesh(tubeGeometry, tubeMaterial)
    this.scene.add(this.timelineCurve)
  }

  createEventNode(event: PhysicsEvent): SceneNode {
    const group = new THREE.Group()

    // 根据重要性选择几何体和材质
    let geometry: THREE.BufferGeometry
    let material: THREE.MeshPhongMaterial
    let scale: number

    switch (event.importance) {
      case 'milestone':
        geometry = new THREE.OctahedronGeometry(2)
        material = new THREE.MeshPhongMaterial({
          color: 0xff4444,
          emissive: 0x440000,
          transparent: true,
          opacity: 0.9
        })
        scale = 1.8
        break
      case 'important':
        geometry = new THREE.SphereGeometry(1.5)
        material = new THREE.MeshPhongMaterial({
          color: 0xffaa00,
          emissive: 0x442200,
          transparent: true,
          opacity: 0.8
        })
        scale = 1.4
        break
      default:
        geometry = new THREE.SphereGeometry(1.2)
        material = new THREE.MeshPhongMaterial({
          color: 0x4488ff,
          emissive: 0x001144,
          transparent: true,
          opacity: 0.7
        })
        scale = 1.0
    }

    const mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = true
    mesh.receiveShadow = true
    mesh.userData = { eventId: event.id, type: 'eventNode' }

    // 确保group也有userData
    group.userData = { eventId: event.id, type: 'eventNode' }

    // 添加发光效果
    if (event.importance === 'milestone') {
      const glowGeometry = new THREE.SphereGeometry(3.5)
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xff4444,
        transparent: true,
        opacity: 0.1
      })
      const glow = new THREE.Mesh(glowGeometry, glowMaterial)
      group.add(glow)
    }

    group.add(mesh)
    group.position.set(event.position.x, event.position.y, event.position.z)
    group.scale.setScalar(scale)

    // 添加文字标签
    this.createTextLabel(group, event.title, event.year)

    this.scene.add(group)

    const sceneNode: SceneNode = {
      id: event.id,
      mesh: group,
      position: event.position,
      event,
      isVisible: true,
      isHighlighted: false
    }

    this.eventNodes.set(event.id, sceneNode)
    return sceneNode
  }

  private createTextLabel(parent: THREE.Group, title: string, year: number): void {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')!
    canvas.width = 512
    canvas.height = 128

    context.font = 'Bold 32px Arial'
    context.fillStyle = 'rgba(255, 255, 255, 1)'
    context.textAlign = 'center'

    // 绘制年份
    context.fillText(year.toString(), 256, 40)

    // 绘制标题
    context.font = '24px Arial'
    const maxWidth = 480
    let displayTitle = title
    if (context.measureText(title).width > maxWidth) {
      displayTitle = title.substring(0, 20) + '...'
    }
    context.fillText(displayTitle, 256, 80)

    const texture = new THREE.CanvasTexture(canvas)
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: 0.8
    })

    const sprite = new THREE.Sprite(material)
    sprite.scale.set(10, 2.5, 1)
    sprite.position.set(0, 4, 0)

    parent.add(sprite)
  }

  private setupEventListeners(): void {
    window.addEventListener('resize', this.onWindowResize.bind(this), false)
    this.renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this), false)
    this.renderer.domElement.addEventListener('click', this.onMouseClick.bind(this), false)
  }

  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)

    // 确保canvas样式保持全屏
    this.renderer.domElement.style.width = '100vw'
    this.renderer.domElement.style.height = '100vh'
  }

  private onMouseMove(event: MouseEvent): void {
    const rect = this.renderer.domElement.getBoundingClientRect()
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    this.updateHover()
  }

  private onMouseClick(event: MouseEvent): void {
    this.raycaster.setFromCamera(this.mouse, this.camera)
    const intersects = this.raycaster.intersectObjects(this.scene.children, true)

    if (intersects.length > 0) {
      for (let i = 0; i < intersects.length; i++) {
        const object = intersects[i].object

        // 检查对象本身
        if (object.userData && object.userData.type === 'eventNode') {
          const eventId = object.userData.eventId
          const sceneNode = this.eventNodes.get(eventId)
          if (sceneNode && this.onNodeClick) {
            this.onNodeClick(sceneNode.event)
            return
          }
        }

        // 检查父对象
        let parent = object.parent
        while (parent) {
          if (parent.userData && parent.userData.type === 'eventNode') {
            const eventId = parent.userData.eventId
            const sceneNode = this.eventNodes.get(eventId)
            if (sceneNode && this.onNodeClick) {
              this.onNodeClick(sceneNode.event)
              return
            }
          }
          parent = parent.parent
        }
      }
    }
  }

  private updateHover(): void {
    this.raycaster.setFromCamera(this.mouse, this.camera)
    const intersects = this.raycaster.intersectObjects(this.scene.children, true)

    // 重置之前的悬停状态
    if (this.hoveredNode) {
      gsap.to(this.hoveredNode.mesh.scale, {
        duration: 0.3,
        x: 1,
        y: 1,
        z: 1
      })
      this.hoveredNode = null
    }

    if (intersects.length > 0) {
      for (let i = 0; i < intersects.length; i++) {
        const object = intersects[i].object

        // 检查对象本身
        if (object.userData && object.userData.type === 'eventNode') {
          const eventId = object.userData.eventId
          const sceneNode = this.eventNodes.get(eventId)
          if (sceneNode) {
            this.hoveredNode = sceneNode
            gsap.to(sceneNode.mesh.scale, {
              duration: 0.3,
              x: 1.2,
              y: 1.2,
              z: 1.2
            })
            this.container.style.cursor = 'pointer'

            if (this.onNodeHover) {
              this.onNodeHover(sceneNode.event)
            }
            return
          }
        }

        // 检查父对象
        let parent = object.parent
        while (parent) {
          if (parent.userData && parent.userData.type === 'eventNode') {
            const eventId = parent.userData.eventId
            const sceneNode = this.eventNodes.get(eventId)
            if (sceneNode) {
              this.hoveredNode = sceneNode
              gsap.to(sceneNode.mesh.scale, {
                duration: 0.3,
                x: 1.2,
                y: 1.2,
                z: 1.2
              })
              this.container.style.cursor = 'pointer'

              if (this.onNodeHover) {
                this.onNodeHover(sceneNode.event)
              }
              return
            }
          }
          parent = parent.parent
        }
      }
    }

    // 如果没有找到可悬停的对象
    this.container.style.cursor = 'default'
    if (this.onNodeHover) {
      this.onNodeHover(null)
    }
  }

  focusOnEvent(eventId: string): void {
    const sceneNode = this.eventNodes.get(eventId)
    if (!sceneNode) return

    const targetPosition = sceneNode.position
    const cameraOffset = new THREE.Vector3(15, 15, 15)
    const newCameraPosition = new THREE.Vector3().addVectors(
      new THREE.Vector3(targetPosition.x, targetPosition.y, targetPosition.z),
      cameraOffset
    )

    gsap.to(this.camera.position, {
      duration: 2,
      x: newCameraPosition.x,
      y: newCameraPosition.y,
      z: newCameraPosition.z,
      ease: "power2.inOut"
    })

    gsap.to(this.controls.target, {
      duration: 2,
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      ease: "power2.inOut",
      onUpdate: () => {
        this.controls.update()
      }
    })
  }

  highlightEvent(eventId: string | null): void {
    // 重置所有高亮
    this.eventNodes.forEach(node => {
      node.isHighlighted = false
      // 查找主要的mesh（不是glow或sprite）
      const mesh = node.mesh.children.find(child =>
        child instanceof THREE.Mesh &&
        child.userData.type === 'eventNode'
      ) as THREE.Mesh
      if (mesh && mesh.material instanceof THREE.MeshPhongMaterial) {
        mesh.material.emissive.setHex(0x000000)
      }
    })

    // 高亮指定事件
    if (eventId) {
      const sceneNode = this.eventNodes.get(eventId)
      if (sceneNode) {
        sceneNode.isHighlighted = true
        const mesh = sceneNode.mesh.children.find(child =>
          child instanceof THREE.Mesh &&
          child.userData.type === 'eventNode'
        ) as THREE.Mesh
        if (mesh && mesh.material instanceof THREE.MeshPhongMaterial) {
          mesh.material.emissive.setHex(0x444444)
        }
      }
    }
  }

  resetCamera(): void {
    gsap.to(this.camera.position, {
      duration: 2,
      x: 0,
      y: 30,
      z: 80,
      ease: "power2.inOut"
    })

    gsap.to(this.controls.target, {
      duration: 2,
      x: 0,
      y: 0,
      z: 0,
      ease: "power2.inOut",
      onUpdate: () => {
        this.controls.update()
      }
    })
  }

  private startAnimation(): void {
    const animate = () => {
      this.animationId = requestAnimationFrame(animate)
      this.controls.update()
      this.renderer.render(this.scene, this.camera)
    }
    animate()
  }

  dispose(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }

    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose()
        if (Array.isArray(object.material)) {
          object.material.forEach(material => material.dispose())
        } else {
          object.material.dispose()
        }
      }
    })

    this.renderer.dispose()
    this.controls.dispose()
  }
}
