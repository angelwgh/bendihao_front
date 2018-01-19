import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: () => import('@/components/home/home.vue'),
      children:[
        {
          path: '',
          name: 'home',
          component: () => import('@/components/home/main.vue')
        }
      ]
    },
    {
      path: '/home',
      redirect: {name:'home'}
    },
    {
      path: '/creatNote',
      name: 'creeatNote',
      component: () => import ('@/components/creatNote/creatNote.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/components/login/login.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('@/components/login/signup.vue')
    }
  ]
})
