import Vue from 'vue'
import Router from 'vue-router'
const index = r => require.ensure([], () => r(require('../pages/index/index.vue')), 'index')
const other = r => require.ensure([], () => r(require('../pages/other/index.vue')), 'other')
const awaits = r => require.ensure([], () => r(require('../pages/awaits/index.vue')), 'awaits')
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
        title: '洗车完成'
      },
      component: other
    },
    {
      path: '/awaits',
      name: 'awaits',
      meta: {
        title: '请稍等'
      },
      component: awaits
    }
  ]
})
router.beforeEach(function (to, from, next) {
  document.title = to.meta.title
  next();

})
export default router
