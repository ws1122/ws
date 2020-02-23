import Vue from 'vue'
import Router from 'vue-router'
const index = r => require.ensure([], () => r(require('../pages/home/index.vue')), 'home')
const result = r => require.ensure([], () => r(require('../pages/result/index.vue')), 'result')
const confirm = r => require.ensure([], () => r(require('../pages/confirm/index.vue')), 'confirm')
const lose = r => require.ensure([], () => r(require('../pages/lose/index.vue')), 'lose')

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      meta: {
        title: '车牌确定'
      },
      component: index
    },
    {
      path: '/confirm',
      name: 'confirm',
      meta: {
        title: '车牌绑定'
      },
      component: confirm
    },
    // {
    //   path: '/confirm',
    //   name: 'confirm',
    //   meta: {
    //     title: '确认绑定'
    //   },
    //   component: confirm
    // },
    {
      path: '/result',
      name: 'result',
      meta: {
        title: ''
      },
      component: result
    },
    {
      path: '/lose',
      name: 'lose',
      meta: {
        title: '链接已失效'
      },
      component: lose
    }
  ]
})
router.beforeEach(function (to, from, next) {
  document.title = to.meta.title
  next()
})

export default router
