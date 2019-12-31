import Vue from 'vue'
import store from '../store'
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
    meta: {
      requiresAuth: true
    },
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
    meta: {
      requiresAdminAuth: true
    },
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

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next()
      return
    }
    next()
  } else if (to.matched.some(record => record.meta.requiresAdminAuth)) {
    if (store.getters.userType === 'ADMINISTRATOR') {
      next()
      return
    } else if (store.getters.userType === 'STUDENT') {
      window.alert('관리자만 접근가능합니다!')
      next('/meals')
      return
    }
    window.alert('관리자만 접근가능합니다!')
    next('/')
  } else {
    next()
  }
})

export default router
