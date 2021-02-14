import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'
import Login from '@/components/Login'
import Signup from '@/components/Signup'
import Profile from '@/components/Profile'
import Settings from '@/components/Settings'
import Search from '@/components/Search'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main,
    },
    {
    path: '/login',
    name: 'login',
    component: Login
    },
    {
    path: '/signup',
    name: 'signup',
    component: Signup
    },
    {
    path: '/profile/:id',
    name: 'profile',
    component: Profile
    },
    {
    path: '/settings',
    name: 'settings',
    component: Settings
    },
    {
    path: '/search',
    name: 'search',
    component: Search
    }
  ]
})


router.beforeEach((to, from, next) => {
    let isAuthenticated = localStorage.jwt;
    if (to.name !== 'login' && to.name !== 'signup' && !isAuthenticated){
        next({ name: 'login' });
    }   
    else next()
  })

  export default router