import Vue from 'vue'
import Router from 'vue-router'
const index = r => require.ensure([], () => r(require('../pages/index/index.vue')), 'index')
const selectinvoice = r => require.ensure([], () => r(require('../pages/selectinvoice/index.vue')), 'selectinvoice')
const detail = r => require.ensure([], () => r(require('../pages/detail/index.vue')), 'detail')
const address = r => require.ensure([], () => r(require('../pages/address/index.vue')), 'address')
const addAddress = r => require.ensure([], () => r(require('../pages/address/add.vue')), 'addAddress')
const history = r => require.ensure([], () => r(require('../pages/history/index.vue')), 'history')
const historydetail = r => require.ensure([], () => r(require('../pages/history/historydetail.vue')), 'historydetail')
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      meta: {
        title: '发票申领'
      },
      component: index
    },
    {
      path: '/selectinvoice',
      name: 'selectinvoice',
      meta: {
        title: '发票申领',
        keepAlive: true
      },
      component: selectinvoice
    },
    {
      path: '/detail',
      name: 'detail',
      meta: {
        title: '发票申领',
        keepAlive: true
      },
      component: detail
    },
    {
      path: '/address',
      name: 'address',
      meta: {
        title: '收货人地址列表'
      },
      component: address
    },
    {
      path: '/addAddress',
      name: 'addAddress',
      meta: {
        title: ''
      },
      component: addAddress
    },
    {
      path: '/history',
      name: 'history',
      meta: {
        title: '开票历史'
      },
      component: history
    },
    {
      path: '/historydetail',
      name: 'historydetail',
      meta: {
        title: '开票明细'
      },
      component: historydetail
    }
  ]
})
router.beforeEach(function (to, from, next) {
  document.title = to.meta.title
  next()
})

export default router
