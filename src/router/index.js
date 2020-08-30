import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Crate',
    component: () => import(/* webpackChunkName: "create" */ '@/views/Create')
  },
  {
    path: '/vote/:poll',
    name: 'Vote',
    component: () => import(/* webpackChunkName: "create" */ '@/views/Vote')
  },
  {
    path: '/results/:poll',
    name: 'Results',
    component: () => import(/* webpackChunkName: "results" */ '@/views/Results')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
