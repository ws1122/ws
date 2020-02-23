import Vue from 'vue'
import Router from 'vue-router'
const index = r => require.ensure([], () => r(require('../pages/index/index.vue')), 'index')
const record = r => require.ensure([], () => r(require('../pages/index/record.vue')), 'record')

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      meta: {
        title: 'index'
      },
      component: index
    },
    {
      path: '/record',
      name: 'record',
      meta: {
        title: 'record'
      },
      component: record
    }
  ]
})
router.beforeEach(function (to, from, next) {
  document.title = to.meta.title
  next()
})

export default router
