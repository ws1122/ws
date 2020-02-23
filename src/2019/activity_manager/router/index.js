import Vue from 'vue'
import Router from 'vue-router'
const index = r => require.ensure([], () => r(require('../pages/index/index.vue')), 'index')
const operate = r => require.ensure([], () => r(require('../pages/operate/index.vue')), 'operate')
const group = r => require.ensure([], () => r(require('../pages/group/index.vue')), 'group')

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      meta: {
        title: '人员管理'
      },
      component: index
    },
    {
      path: '/operate',
      name: 'operate',
      meta: {
        title: '商户中心'
      },
      component: operate
    },
    {
      path: '/group',
      name: 'group',
      meta: {
        title: '移动至'
      },
      component: group
    }
  ]
})
router.beforeEach(function (to, from, next) {
  document.title = to.meta.title
  next()
})

export default router
