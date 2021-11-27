import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/auth/Login.vue'
import Signup from '../views/auth/Signup.vue'
import NotFound from '../views/NotFound.vue';

// route guard
import { projectAuth } from '../firebase/config';

const requireNoAuth = (to, from, next) => {
  let user = projectAuth.currentUser
  if (!user) {
    next()
  } else {
    next({ name: 'Home' })
  }
}


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    beforeEnter: requireNoAuth,
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
    beforeEnter: requireNoAuth,
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
    beforeEnter: requireNoAuth,
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFound
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
