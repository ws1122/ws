import Vue from 'vue'
import Router from 'vue-router'
const index = r => require.ensure([], () => r(require('../pages/index/index.vue')), 'index')
const other = r => require.ensure([], () => r(require('../pages/other/index.vue')), 'other')
const finish = r => require.ensure([], () => r(require('../pages/finish/index.vue')), 'finish')
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      meta: {
        title: '选择支付'
      },
      component: index
    },
    {
      path: '/other',
      name: 'other',
      meta: {
        title: '加油中'
      },
      component: other
    },
    {
      path: '/finish',
      name: 'finish',
      meta: {
        title: '加油完成'
      },
      component: finish
    }
  ]
})
router.beforeEach(function (to, from, next) {
  document.title = to.meta.title
  next()
})

export default router
