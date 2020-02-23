import Vue from 'vue'
import Router from 'vue-router'
const index = r => require.ensure([], () => r(require('../pages/index/index.vue')), 'index')
const login = r => require.ensure([], () => r(require('../pages/login/index.vue')), 'login')
const ewmlogin = r => require.ensure([], () => r(require('../pages/login/ewmlogin.vue')), 'ewmlogin')
const pay = r => require.ensure([], () => r(require('../pages/pay/index.vue')), 'pay')
const success = r => require.ensure([], () => r(require('../pages/pay/success.vue')), 'success')
const order = r => require.ensure([], () => r(require('../pages/order/index.vue')), 'order')
const amount = r => require.ensure([], () => r(require('../pages/amount/index.vue')), 'amount')

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      meta: {
        title: '收银台'
      },
      component: index
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        title: '登录'
      },
      component: login
    },
    {
      path: '/ewmlogin',
      name: 'ewmlogin',
      meta: {
        title: '登录'
      },
      component: ewmlogin
    },
    {
      path: '/pay',
      name: 'pay',
      meta: {
        title: '扫码支付'
      },
      component: pay
    },
    {
      path: '/success',
      name: 'success',
      meta: {
        title: '支付成功'
      },
      component: success
    },
    {
      path: '/order',
      name: 'order',
      meta: {
        title: '我的订单'
      },
      component: order
    },
    {
      path: '/amount',
      name: 'amount',
      meta: {
        title: '输入金额'
      },
      component: amount
    }
  ]
})
router.beforeEach(function (to, from, next) {
  document.title = to.meta.title
  next()
})

export default router
