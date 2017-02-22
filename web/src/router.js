import Vue from 'vue'
import Router from 'vue-router'

import FrontPage from 'components/pages/FrontPage'
import LoginPage from 'components/pages/LoginPage'
import { auth } from 'auth'

Vue.use(Router)

function requireAuth (to, from, next) {
  // Remember to check token with server!
  if (auth.isAuth()) {
    next()
  } else {
    next({
      path: '/login',
      query: {
        redirect: to.fullPath
      }
    })
  }
}

export const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: FrontPage,
      beforeEnter: requireAuth
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginPage
    }
  ]
})