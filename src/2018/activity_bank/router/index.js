import Vue from 'vue'
import Router from 'vue-router'
const index = r => require.ensure([], () => r(require('../pages/index/index.vue')), 'index')
const success = r => require.ensure([], () => r(require('../pages/success/index.vue')), 'success')
const fail = r => require.ensure([], () => r(require('../pages/fail/index.vue')), 'fail')
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      meta: {
        title: '联盟权益包'
      },
      component: index
    },
    {
      path: '/success',
      name: 'success',
      meta: {
        title: '购买成功'
      },
      component: success
    },
    {
      path: '/fail',
      name: 'fail',
      meta: {
        title: '支付失败'
      },
      component: fail
    }
  ]
})
router.beforeEach(function (to, from, next) {
  document.title = to.meta.title
  next()
})

export default router
