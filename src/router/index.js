import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('../views/Navigation.vue'),
    children: [
      {
        path: '',
        name: 'Meals',
        component: () => import('../views/Meals.vue')
      },
      {
        path: 'washer',
        name: 'Washer',
        component: () => import('../views/Washer.vue')
      },
      {
        path: 'schedule',
        name: 'Schedule',
        component: () => import('../views/Schedule.vue')
      },
      {
        path: 'point',
        name: 'Point',
        component: () => import('../views/Point.vue')
      },
      {
        path: 'remain',
        name: 'Remain',
        component: () => import('../views/Remain.vue')
      },
      {
        path: 'setting',
        name: 'Setting',
        component: () => import('../views/Setting.vue')
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
