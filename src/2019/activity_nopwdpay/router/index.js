import Vue from 'vue'
import Router from 'vue-router'
const index = r => require.ensure([], () => r(require('../pages/index/index.vue')), 'index')
const protocal = r => require.ensure([], () => r(require('../pages/protocal/index.vue')), 'protocal')
const result = r => require.ensure([], () => r(require('../pages/result/index.vue')), 'result')
const enterinfo = r => require.ensure([], () => r(require('../pages/enterinfo/index.vue')), 'enterinfo')
const identity = r => require.ensure([], () => r(require('../pages/openlist/identity.vue')), 'identity')
const openlist = r => require.ensure([], () => r(require('../pages/openlist/index.vue')), 'openlist')
const without = r => require.ensure([], () => r(require('../pages/without/index.vue')), 'without')
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      meta: {
        title: '开通无感支付'
      },
      component: index
    },
    {
      path: '/protocal',
      name: 'protocal',
      meta: {
        title: '使用条款'
      },
      component: protocal
    },
    {
      path: '/result',
      name: 'result',
      meta: {
        title: '开通结果'
      },
      component: result
    },
    {
      path: '/enterinfo',
      name: 'enterinfo',
      meta: {
        title: '银联认证',
        keepAlive: true
      },
      component: enterinfo
    },
    {
      path: '/openlist',
      name: 'openlist',
      meta: {
        title: '支付管理'
      },
      component: openlist
    },
    {
      path: '/identity',
      name: 'identity',
      meta: {
        title: '银联认证'
      },
      component: identity
    },
    {
      path: '/without',
      name: 'without',
      meta: {
        title: '免密支付'
      },
      component: without
    }
  ]
})
router.beforeEach(function (to, from, next) {
  document.title = to.meta.title
  next()
})

export default router
