import Vue from 'vue'
import Router from 'vue-router'
const index = r => require.ensure([], () => r(require('../pages/index/index.vue')), 'index')
const detail = r => require.ensure([], () => r(require('../pages/detail/index.vue')), 'detail')
const result = r => require.ensure([], () => r(require('../pages/result/index.vue')), 'result')
const active = r => require.ensure([], () => r(require('../pages/active/index.vue')), 'active')

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      meta: {
        title: '加油购券'
      },
      component: index
    },
    {
      path: '/detail',
      name: 'detail',
      meta: {
        title: '加油券详情'
      },
      component: detail
    },
    {
      path: '/result',
      name: 'result',
      meta: {
        title: '核销成功'
      },
      component: result
    },
    {
      path: '/active',
      name: 'active',
      meta: {
        title: '活动'
      },
      component: active
    }
  ]
})
router.beforeEach(function (to, from, next) {
  document.title = to.meta.title
  next()
})

export default router
