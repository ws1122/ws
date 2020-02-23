import Vue from 'vue'
import Router from 'vue-router'
const index = r => require.ensure([], () => r(require('../pages/index/index.vue')), 'index')
const tips = r => require.ensure([], () => r(require('../pages/tips/index.vue')), 'tips')
const call = r => require.ensure([], () => r(require('../pages/tips/call.vue')), 'call')

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      meta: {
        title: ''
      },
      component: index
    },
    {
      path: '/tips',
      name: 'tips',
      meta: {
        title: '自助洗车'
      },
      component: tips
    },
    {
      path: '/call',
      name: 'call',
      meta: {
        title: '帮洗'
      },
      component: call
    }
  ]
})
router.beforeEach(function (to, from, next) {
  document.title = to.meta.title
  next()
})

export default router
