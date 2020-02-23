import Vue from 'vue'
import Router from 'vue-router'
const index = r => require.ensure([], () => r(require('../pages/index/index.vue')), 'index')
const other = r => require.ensure([], () => r(require('../pages/other/index.vue')), 'other')
const failure = r => require.ensure([], () => r(require('../pages/failure/index.vue')), 'failure')

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      meta: {
        title: ''
      },
      component: index
    },
    {
      path: '/other',
      name: 'other',
      meta: {
        title: '洗车劵列表'
      },
      component: other
    },
    {
      path: '/failure',
      name: 'failure',
      meta: {
        title: '连接失效'
      },
      component: failure
    }
  ]
})
router.beforeEach(function (to, from, next) {
  document.title = to.meta.title
  next()
})

export default router
