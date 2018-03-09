import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      // name: 'index',
      component: () => import('@/components/index/index.vue'),
      children: [
        {
          path: '/',
          name: 'index',
          component: () => import('@/components/index/index-containt.vue')
        },
        {
          path: '/demos',
          name: 'demos',
          component: () => import('@/components/demo/demos.vue'),
          // children: [
          //   {
          //     path: '/sudoku',
          //     name: 'demos-sudoku',
          //     component: () => import('@/components/demo/sudoku/sudoku.vue')
          //   }
          // ]
        },
        {
          path: '/demo/:id',
          name: 'demo',
          component: () => import('@/components/demo/demo.vue')
        }
      ]
    },
    {
      path: '/index',
      redirect: {name:'index'}
    }


  ]
})

export default router;

// export default new Router({
//   routes: [
//     {
//       path: '/',
//       component: () => import('@/components/home/home.vue'),
//       children:[
//         {
//           path: '',
//           name: 'home',
//           component: () => import('@/components/home/main.vue')
//         },
//         {
//           path: 'archives',
//           name: 'archives',
//           component: () => import('@/components/home/archives.vue')
//         },
//         {
//           path: 'tags',
//           name: 'tags',
//           component: () => import('@/components/home/tags.vue')
//         },
//         {
//           path: 'categories',
//           name: 'categories',
//           component: () => import('@/components/home/categories.vue')
//         },
//         {
//           path: 'demos',
//           name: 'demos',
//           component: () => import('@/components/home/demos.vue')
//         }
//       ]
//     },
//     {
//       path: '/home',
//       redirect: {name:'home'}
//     },
//     {
//       path: '/creatNote',
//       name: 'creeatNote',
//       component: () => import ('@/components/creatNote/creatNote.vue')
//     },
//     {
//       path: '/login',
//       name: 'login',
//       component: () => import('@/components/login/login.vue')
//     },
//     {
//       path: '/signup',
//       name: 'signup',
//       component: () => import('@/components/login/signup.vue')
//     }
//   ]
// })
