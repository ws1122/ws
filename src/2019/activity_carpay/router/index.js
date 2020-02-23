import Vue from 'vue'
import Router from 'vue-router'
const index = r => require.ensure([], () => r(require('../pages/index/index.vue')), 'index')
const result = r => require.ensure([], () => r(require('../pages/result/index.vue')), 'result')
const rest = r => require.ensure([], () => r(require('../pages/rest/index.vue')), 'rest')
const rule = r => require.ensure([], () => r(require('../pages/rule/index.vue')), 'rule')
const detail = r => require.ensure([], () => r(require('../pages/detail/index.vue')), 'detail')

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      meta: {
        title: '购买加油币'
      },
      component: index
    },
    {
      path: '/result',
      name: 'result',
      meta: {
        title: '支付成功'
      },
      component: result
    },
    {
      path: '/rest',
      name: 'rest',
      meta: {
        title: '加油币余额'
      },
      component: rest
    },
    {
      path: '/rule',
      name: 'rule',
      meta: {
        title: '加油币使用说明'
      },
      component: rule
    },
    {
      path: '/detail',
      name: 'detail',
      meta: {
        title: '加油币详情'
      },
      component: detail
    }
  ]
})
router.beforeEach(function (to, from, next) {
  document.title = to.meta.title
  next()
})

export default router
