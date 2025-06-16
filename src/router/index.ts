import { createRouter, createWebHistory } from 'vue-router'
import PhysicsTimelineView from '../views/PhysicsTimelineView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'physics-timeline',
      component: PhysicsTimelineView,
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('../views/TestView.vue'),
    },
  ],
})

export default router
