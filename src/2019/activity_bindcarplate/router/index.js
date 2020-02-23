import Vue from 'vue'
import Router from 'vue-router'
const index = r => require.ensure([], () => r(require('../pages/index/index.vue')), 'index')
const result = r => require.ensure([], () => r(require('../pages/result/index.vue')), 'result')
const identity = r => require.ensure([], () => r(require('../pages/index/identity.vue')), 'identity')
const oillist = r => require.ensure([], () => r(require('../pages/oillist/index.vue')), 'oillist')
const orderdetails = r => require.ensure([], () => r(require('../pages/orderdetails/index.vue')), 'orderdetails')

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      meta: {
        title: '绑定车牌'
      },
      component: index
    },
    {
      path: '/result',
      name: 'result',
      meta: {
        title: 'result'
      },
      component: result
    },
    {
      path: '/identity',
      name: 'identity',
      meta: {
        title: 'identity'
      },
      component: identity
    },
    {
      path: '/oillist',
      name: 'oillist',
      meta: {
        title: '加油订单'
      },
      component: oillist
    },
    {
      path: '/orderdetails',
      name: 'orderdetails',
      meta: {
        title: '订单详情'
      },
      component: orderdetails
    }
  ]
})
router.beforeEach(function (to, from, next) {
  document.title = to.meta.title
  next()
})

export default router
