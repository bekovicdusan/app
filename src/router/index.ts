import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/contact-details/:id',
    name: 'ContactDetails',
    props: route => ({ ...route.params, id: route.params.id }),
    component: () => import(/* webpackChunkName: "invoices" */ '../views/ContactDetails.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
