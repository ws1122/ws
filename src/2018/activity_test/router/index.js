import Vue from 'vue'
import Router from 'vue-router'
const index = r => require.ensure([], () => r(require('../pages/index/index.vue')), 'index')
const other = r => require.ensure([], () => r(require('../pages/other/index.vue')), 'other')
const car = r => require.ensure([], () =>  r(require('../pages/car/index.vue')), 'car')
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
        title: 'other'
      },
      component: other
    },
    {
      path: '/car',
      name: 'car',
      meta: {
        title: 'car'
      },
      component: '这个'
    }
  ]
})
router.beforeEach(function (to, from, next) {
  document.title = to.meta.title
  next()
})

export default router
