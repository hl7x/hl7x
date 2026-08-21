import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'HL7X — Open source healthcare developer tools' }
    },
    {
      path: '/placebo',
      name: 'placebo',
      // Lazy-loaded so the tool page ships its own chunk
      component: () => import('@/views/PlaceboView.vue'),
      meta: { title: 'placebo — HL7 test message generator · HL7X' }
    },
    {
      path: '/tools',
      name: 'tools',
      component: () => import('@/views/ToolsView.vue'),
      meta: { title: 'Tools · HL7X' }
    },
    {
      path: '/docs',
      name: 'docs',
      component: () => import('@/views/DocsView.vue'),
      meta: { title: 'Documentation · HL7X' }
    },
    {
      path: '/contribute',
      name: 'contribute',
      component: () => import('@/views/ContributeView.vue'),
      meta: { title: 'Contribute · HL7X' }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { title: 'Not found · HL7X' }
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth', top: 80 }
    }
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

router.afterEach((to) => {
  document.title = to.meta?.title ?? 'HL7X'
})

export default router
