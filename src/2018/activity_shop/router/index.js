import Vue from 'vue'
// import store from '../store/index'
import Router from 'vue-router'
const index = r => require.ensure([], () => r(require('../pages/index/index.vue')), 'index')
const goodsDetail = r => require.ensure([], () => r(require('../pages/goodsdetail/index.vue')), 'goodsDetail')
const address = r => require.ensure([], () => r(require('../pages/address/index.vue')), 'address')
const orderCallback = r => require.ensure([], () => r(require('../pages/order-callback/index.vue')), 'orderCallback')
const orderDetail = r => require.ensure([], () => r(require('../pages/orderDetail/index.vue')), 'orderDetail')
const orderConfirm = r => require.ensure([], () => r(require('../pages/order-confirm/index.vue')), 'orderConfirm')
const myorder = r => require.ensure([], () => r(require('../pages/myorder/index.vue')), 'myorder')

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      meta: {
        title: '车友商城'
        // title: store.state.dialog.showIndexTitle ? '车友商城' : ''
        // needlogin: true
      },
      component: index
    },
    {
      path: '/goodsDetail',
      name: 'goodsDetail',
      meta: {
        title: '商品详情'
      },
      component: goodsDetail
    },
    {
      path: '/address',
      name: 'address',
      meta: {
        title: '收货地址'
      },
      component: address
    },
    {
      path: '/orderCallback',
      name: 'orderCallback',
      meta: {
        title: '订单'
      },
      component: orderCallback
    },
    {
      path: '/orderDetail',
      name: 'orderDetail',
      meta: {
        title: '订单详情'
      },
      component: orderDetail
    },
    {
      path: '/orderConfirm',
      name: 'orderConfirm',
      meta: {
        title: '确认订单'
      },
      component: orderConfirm
    },
    {
      path: '/myorder',
      name: 'myorder',
      meta: {
        title: '我的订单'
      },
      component: myorder
    }
  ]
})
router.beforeEach(function (to, from, next) {
  document.title = to.meta.title
  // if (to.meta.needlogin) {
  //   if (store.state.token.islogin) {
  //     next()
  //   }
  // } else {
  next()
  // }
})

export default router
