import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../views/Login.vue'
import index from '../views/index.vue'
import show from '../views/show.vue'
import create from '../views/create.vue'
import edit from '../views/edit.vue'
import Register from '../views/Register.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  
  {
    path: '/index',
    name: 'index',
    component: index
  },
  
  {
    path: '/edit/:id',
    name: 'edit',
    component: edit
  },
  {
    path: '/create',
    name: 'create',
    component: create
  },
  {
    path: '/employees/:id',
    name: 'show',
    component: show
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView
  },
  
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
