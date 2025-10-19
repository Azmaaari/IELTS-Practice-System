import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: {
      title: '首页',
      keepAlive: true
    }
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/SearchView.vue'),
    meta: {
      title: '搜索文章',
      keepAlive: true
    }
  },
  {
    path: '/practice',
    component: () => import('@/views/practice/PracticeLayout.vue'),
    children: [
      {
        path: ':id',
        name: 'SinglePractice',
        component: () => import('@/views/practice/SinglePracticeView.vue'),
        meta: {
          title: '单篇练习',
          keepAlive: false
        }
      },
      {
        path: 'full-test/confirm',
        name: 'FullTestConfirm',
        component: () => import('@/views/practice/FullTestConfirmView.vue'),
        meta: {
          title: '套题确认',
          keepAlive: false
        }
      },
      {
        path: 'full-test',
        name: 'FullTest',
        component: () => import('@/views/practice/FullTestView.vue'),
        meta: {
          title: '套题练习',
          keepAlive: false
        }
      }
    ]
  },
  {
    path: '/history',
    name: 'History',
    component: () => import('@/views/HistoryView.vue'),
    meta: {
      title: '练习历史',
      keepAlive: true
    }
  },
  {
    path: '/history/:sessionId',
    name: 'HistoryDetail',
    component: () => import('@/views/HistoryDetailView.vue'),
    meta: {
      title: '历史详情',
      keepAlive: false
    }
  },
  {
    path: '/stats',
    name: 'Stats',
    component: () => import('@/views/StatsView.vue'),
    meta: {
      title: '统计分析',
      keepAlive: true
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/SettingsView.vue'),
    meta: {
      title: '设置',
      keepAlive: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: {
      title: '页面未找到'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 全局导航守卫
router.beforeEach((to, _from, next) => {
  // 设置页面标题
  document.title = `${to.meta.title || 'IELTS阅读'} - IELTS练习平台`
  next()
})

export default router

