import Vue from 'vue'
import Router from 'vue-router'
const index = r => require.ensure([], () => r(require('../pages/index/index.vue')), 'index')
const detail = r => require.ensure([], () => r(require('../pages/detail/index.vue')), 'detail')
const activity = r => require.ensure([], () => r(require('../pages/activity/index.vue')), 'activity')

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      meta: {
        title: '充值加油'
      },
      component: index
    },
    {
      path: '/detail',
      name: 'detail',
      meta: {
        title: '充值成功'
      },
      component: detail
    },
    {
      path: '/activity',
      name: 'detactivityail',
      meta: {
        title: '支付'
      },
      component: activity
    }

  ]
})
router.beforeEach(function (to, from, next) {
  document.title = to.meta.title
  next()
})

export default router
