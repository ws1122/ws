import Vue from 'vue'
import Router from 'vue-router'
const index = r => require.ensure([], () => r(require('../pages/index/index.vue')), 'index')
const other = r => require.ensure([], () => r(require('../pages/other/index.vue')), 'other')
const third = r => require.ensure([], () => r(require('../pages/other/other.vue')), 'third')
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
      path: '/other',
      name: 'other',
      meta: {
        title: 'other',
        keepAlive: true
      },
      component: other
    },
    {
      path: '/third',
      name: 'third',
      meta: {
        title: 'third'
      },
      component: third
    }
  ]
})
router.beforeEach(function (to, from, next) {
  document.title = to.meta.title
  next()
})

export default router
