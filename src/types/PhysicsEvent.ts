export interface Person {
  name: string
  nameEn: string
  birth: number
  death: number
  nationality: string
  portrait?: string
}

export interface Solution {
  discoverer: string
  method: string
  keyInsights: string[]
}

export interface Acceptance {
  initialReception: 'positive' | 'negative' | 'mixed' | 'skeptical' | 'enthusiastic' | 'controversial' | 'reluctant'
  supporters: string[]
  opponents: string[]
  controversies: string[]
}

export interface Proof {
  theoreticalEvidence: string[]
  experimentalEvidence: string[]
}

export interface DetailedContent {
  background: string
  problems: string[]
  hypotheses: string[]
  solution: Solution
  acceptance: Acceptance
  proof: Proof
  impact: string
  formulas: string[]
  modernRelevance: string
}

export interface Position {
  x: number
  y: number
  z: number
}

export interface PhysicsEvent {
  id: string
  year: number
  title: string
  person: Person
  category: 'classical_mechanics' | 'electromagnetism' | 'quantum_origins' | 'quantum_development' | 'quantum_mechanics' | 'atomic_structure' | 'quantum_interpretation'
  importance: 'milestone' | 'important' | 'normal'
  shortDescription: string
  detailedContent: DetailedContent
  connections: string[]
  nextInfluences: string[]
  position: Position
  themeColor: string
}

export interface TimelineData {
  timeline: PhysicsEvent[]
}

export interface FilterOptions {
  categories: string[]
  importance: string[]
  yearRange?: {
    start: number
    end: number
  }
}

export interface GuideStep {
  type: 'intro' | 'background' | 'problems' | 'hypotheses' | 'solution' | 'controversies' | 'proof' | 'impact'
  title: string
  content: string
}

export interface SceneNode {
  id: string
  mesh: any // Three.js Mesh
  position: Position
  event: PhysicsEvent
  isVisible: boolean
  isHighlighted: boolean
}

export interface ConnectionLine {
  id: string
  fromNodeId: string
  toNodeId: string
  line: any // Three.js Line
  type: 'connection' | 'influence'
}
