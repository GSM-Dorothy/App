import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('../views/home.vue'),
    children: [
      {
        path: '',
        component: () => import('../views/login.vue')
      }
    ]
  },
  {
    path: '/meals',
    component: () => import('../views/meals.vue'),
    children: [
      {
        path: '',
        component: () => import('../views/navigation.vue')
      }
    ]
  },
  {
    path: '/point',
    component: () => import('../views/point.vue'),
    children: [
      {
        path: '',
        component: () => import('../views/navigation.vue')
      }
    ]
  },
  {
    path: '/remain',
    component: () => import('../views/remain.vue'),
    children: [
      {
        path: '',
        component: () => import('../views/navigation.vue')
      }
    ]
  },
  {
    path: '/schedule',
    component: () => import('../views/schedule.vue'),
    children: [
      {
        path: '',
        component: () => import('../views/navigation.vue')
      }
    ]
  },
  {
    path: '/washer',
    component: () => import('../views/washer.vue'),
    children: [
      {
        path: '',
        component: () => import('../views/navigation.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: process.env.IS_ELECTRON ? 'hash' : 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
