import Vue from 'vue'
import Router from 'vue-router'
const index = r => require.ensure([], () => r(require('../pages/index/index.vue')), 'index')
const detail = r => require.ensure([], () => r(require('../pages/detail/index.vue')), 'detail')
const record = r => require.ensure([], () => r(require('../pages/record/index.vue')), 'record')
const other= r => require.ensure([], () => r(require('../pages/other/index.vue')), 'other')
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      meta: {
        title: '站点管理'
      },
      component: index
    },
    {
      path: '/detail',
      name: 'detail',
      meta: {
        title: '站点情况'
      },
      component: detail
    },
    {
      path: '/record',
      name: 'record',
      meta: {
        title: '车牌付站点数据统计'
      },
      component: record
    },
    {
      path: '/other',
      name: 'other',
      meta: {
        title: '另外'
      },
      component: other
    },

  ]
})
router.beforeEach(function (to, from, next) {
  document.title = to.meta.title
  next()
})

export default router
