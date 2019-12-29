import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '',
    component: () => import('../views/signin.vue'),
    children: [
      {
        path: '',
        component: () => import('../views/home.vue')
      }
    ]
  },
  {
    path: '',
    component: () => import('../views/signup.vue'),
    children: [
      {
        path: 'signup',
        component: () => import('../views/home.vue')
      }
    ]
  },
  {
    path: '',
    component: () => import('../views/navigation.vue'),
    children: [
      {
        path: 'meals',
        component: () => import('../views/meals.vue')
      },
      {
        path: 'point',
        component: () => import('../views/point.vue')
      },
      {
        path: 'remain',
        component: () => import('../views/remain.vue')
      },
      {
        path: 'schedule',
        component: () => import('../views/schedule.vue')
      },
      {
        path: 'washer',
        component: () => import('../views/washer.vue')
      }
    ]
  },
  {
    path: '/admin',
    component: () => import('../views/admin.vue'),
    children: [
      {
        path: '',
        component: () => import('../views/homeAdmin.vue')
      },
      {
        path: 'code',
        component: () => import('../views/code.vue')
      },
      {
        path: 'remain',
        component: () => import('../views/remainAdmin.vue')
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
