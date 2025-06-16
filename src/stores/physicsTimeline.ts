import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { PhysicsEvent, TimelineData, FilterOptions } from '@/types/PhysicsEvent'

export const usePhysicsTimelineStore = defineStore('physicsTimeline', () => {
  // 状态
  const events = ref<PhysicsEvent[]>([])
  const currentEventIndex = ref(0)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<FilterOptions>({
    categories: ['classical_mechanics', 'electromagnetism', 'quantum_origins', 'quantum_development', 'quantum_mechanics', 'atomic_structure', 'quantum_interpretation'],
    importance: ['milestone', 'important', 'normal']
  })

  // 计算属性
  const currentEvent = computed(() => events.value[currentEventIndex.value])
  
  const filteredEvents = computed(() => {
    return events.value.filter(event => {
      const categoryMatch = filters.value.categories.includes(event.category)
      const importanceMatch = filters.value.importance.includes(event.importance)
      
      let yearMatch = true
      if (filters.value.yearRange) {
        yearMatch = event.year >= filters.value.yearRange.start && 
                   event.year <= filters.value.yearRange.end
      }
      
      return categoryMatch && importanceMatch && yearMatch
    })
  })

  const yearRange = computed(() => {
    if (events.value.length === 0) {
      return { min: 1687, max: 1935 }
    }
    
    const years = events.value.map(event => event.year)
    return {
      min: Math.min(...years),
      max: Math.max(...years)
    }
  })

  const eventsByCategory = computed(() => {
    const grouped: Record<string, PhysicsEvent[]> = {}
    
    events.value.forEach(event => {
      if (!grouped[event.category]) {
        grouped[event.category] = []
      }
      grouped[event.category].push(event)
    })
    
    return grouped
  })

  const eventsByImportance = computed(() => {
    const grouped: Record<string, PhysicsEvent[]> = {}
    
    events.value.forEach(event => {
      if (!grouped[event.importance]) {
        grouped[event.importance] = []
      }
      grouped[event.importance].push(event)
    })
    
    return grouped
  })

  // 动作
  async function loadEvents() {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await fetch('./data/physics-timeline.json')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data: TimelineData = await response.json()
      events.value = data.timeline.sort((a, b) => a.year - b.year)
      
      console.log('物理学时间轴数据加载成功:', events.value.length, '个事件')
    } catch (err) {
      error.value = err instanceof Error ? err.message : '加载数据失败'
      console.error('加载物理学时间轴数据失败:', err)
      
      // 使用备用数据
      events.value = getFallbackEvents()
    } finally {
      isLoading.value = false
    }
  }

  function getEventById(id: string): PhysicsEvent | undefined {
    return events.value.find(event => event.id === id)
  }

  function getEventsByYear(year: number): PhysicsEvent[] {
    return events.value.filter(event => event.year === year)
  }

  function getEventsByYearRange(startYear: number, endYear: number): PhysicsEvent[] {
    return events.value.filter(event => 
      event.year >= startYear && event.year <= endYear
    )
  }

  function getRelatedEvents(eventId: string): {
    connections: PhysicsEvent[]
    influences: PhysicsEvent[]
  } {
    const event = getEventById(eventId)
    if (!event) {
      return { connections: [], influences: [] }
    }

    const connections = event.connections
      .map(id => getEventById(id))
      .filter(Boolean) as PhysicsEvent[]

    const influences = event.nextInfluences
      .map(id => getEventById(id))
      .filter(Boolean) as PhysicsEvent[]

    return { connections, influences }
  }

  function setCurrentEvent(index: number) {
    if (index >= 0 && index < events.value.length) {
      currentEventIndex.value = index
    }
  }

  function nextEvent(): boolean {
    if (currentEventIndex.value < events.value.length - 1) {
      currentEventIndex.value++
      return true
    }
    return false
  }

  function previousEvent(): boolean {
    if (currentEventIndex.value > 0) {
      currentEventIndex.value--
      return true
    }
    return false
  }

  function jumpToEvent(eventId: string): boolean {
    const index = events.value.findIndex(event => event.id === eventId)
    if (index !== -1) {
      currentEventIndex.value = index
      return true
    }
    return false
  }

  function updateFilters(newFilters: Partial<FilterOptions>) {
    filters.value = { ...filters.value, ...newFilters }
  }

  function resetFilters() {
    filters.value = {
      categories: ['classical_mechanics', 'electromagnetism', 'quantum_origins', 'quantum_development', 'quantum_mechanics', 'atomic_structure', 'quantum_interpretation'],
      importance: ['milestone', 'important', 'normal']
    }
  }

  function searchEvents(query: string): PhysicsEvent[] {
    const lowercaseQuery = query.toLowerCase()
    
    return events.value.filter(event => 
      event.title.toLowerCase().includes(lowercaseQuery) ||
      event.person.name.toLowerCase().includes(lowercaseQuery) ||
      event.person.nameEn.toLowerCase().includes(lowercaseQuery) ||
      event.shortDescription.toLowerCase().includes(lowercaseQuery) ||
      event.detailedContent.background.toLowerCase().includes(lowercaseQuery)
    )
  }

  function getStatistics() {
    const stats = {
      total: events.value.length,
      byCategory: {} as Record<string, number>,
      byImportance: {} as Record<string, number>,
      byDecade: {} as Record<string, number>,
      yearSpan: yearRange.value.max - yearRange.value.min
    }

    events.value.forEach(event => {
      // 按类别统计
      stats.byCategory[event.category] = (stats.byCategory[event.category] || 0) + 1
      
      // 按重要性统计
      stats.byImportance[event.importance] = (stats.byImportance[event.importance] || 0) + 1
      
      // 按年代统计
      const decade = Math.floor(event.year / 10) * 10
      const decadeKey = `${decade}s`
      stats.byDecade[decadeKey] = (stats.byDecade[decadeKey] || 0) + 1
    })

    return stats
  }

  // 备用数据
  function getFallbackEvents(): PhysicsEvent[] {
    return [
      {
        id: "newton-principia",
        year: 1687,
        title: "牛顿《自然哲学的数学原理》",
        person: {
          name: "艾萨克·牛顿",
          nameEn: "Isaac Newton",
          birth: 1643,
          death: 1727,
          nationality: "英国"
        },
        category: "classical_mechanics",
        importance: "milestone",
        shortDescription: "建立了经典力学的完整体系，提出万有引力定律和运动三定律",
        detailedContent: {
          background: "17世纪，科学革命需要统一的力学理论",
          problems: ["天体运动与地面运动规律不统一"],
          hypotheses: ["万有引力假设"],
          solution: {
            discoverer: "艾萨克·牛顿",
            method: "数学推导与实验验证",
            keyInsights: ["万有引力定律", "牛顿三大运动定律"]
          },
          acceptance: {
            initialReception: "mixed",
            supporters: ["哈雷"],
            opponents: ["笛卡尔学派"],
            controversies: ["超距作用概念"]
          },
          proof: {
            theoreticalEvidence: ["成功预测哈雷彗星"],
            experimentalEvidence: ["卡文迪许扭秤实验"]
          },
          impact: "确立了机械决定论世界观",
          formulas: ["F = ma", "F = G(m₁m₂)/r²"],
          modernRelevance: "仍是工程学基础"
        },
        connections: [],
        nextInfluences: [],
        position: { x: -60, y: 0, z: 0 },
        themeColor: "#8B4513"
      }
    ]
  }

  return {
    // 状态
    events,
    currentEventIndex,
    isLoading,
    error,
    filters,
    
    // 计算属性
    currentEvent,
    filteredEvents,
    yearRange,
    eventsByCategory,
    eventsByImportance,
    
    // 动作
    loadEvents,
    getEventById,
    getEventsByYear,
    getEventsByYearRange,
    getRelatedEvents,
    setCurrentEvent,
    nextEvent,
    previousEvent,
    jumpToEvent,
    updateFilters,
    resetFilters,
    searchEvents,
    getStatistics
  }
})
