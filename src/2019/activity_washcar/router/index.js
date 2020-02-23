import Vue from 'vue'
import Router from 'vue-router'
const index = r => require.ensure([], () => r(require('../pages/index/index.vue')), 'index')
const other = r => require.ensure([], () => r(require('../pages/other/index.vue')), 'other')
const declaredetail = r => require.ensure([], () => r(require('../pages/declaredetail/declaredetail.vue')), 'declaredetail')
const declaredlist = r => require.ensure([], () => r(require('../pages/declaredetail/declaredlist.vue')), 'declaredlist')
const failuredeclare = r => require.ensure([], () => r(require('../pages/declare/failuredeclare.vue')), 'failuredeclare')
const details = r => require.ensure([], () => r(require('../pages/declare/details.vue')), 'details')
const workorder = r => require.ensure([], () => r(require('../pages/declare/workorder.vue')), 'workorder')
const materialdeclare = r => require.ensure([], () => r(require('../pages/declare/materialdeclare.vue')), 'materialdeclare')
const businessdeclare = r => require.ensure([], () => r(require('../pages/declare/businessdeclare.vue')), 'businessdeclare')
const declarerecord = r => require.ensure([], () => r(require('../pages/declaredetail/declarerecord.vue')), 'declarerecord')
const selectiondeclare = r => require.ensure([], () => r(require('../pages/declare/selectiondeclare.vue')), 'selectiondeclare')

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      meta: {
        title: '站点申报'
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
      path: '/declaredetail',
      name: 'declaredetail',
      meta: {
        title: '申报详情'
      },
      component: declaredetail
    },
    {
      path: '/failuredeclare',
      name: 'failuredeclare',
      meta: {
        title: '故障申报'
      },
      component: failuredeclare
    },
    {
      path: '/declaredlist',
      name: 'declaredlist',
      meta: {
        title: '故障申报'
      },
      component: declaredlist
    },


    {
      path: '/details',
      name: 'details',
      meta: {
        title: '故障申报详情'
      },
      component: details
    },
    {
      path: '/workorder',
      name: 'workorder',
      meta: {
        title: '工单'
      },
      component: workorder
    },
    {
      path: '/materialdeclare',
      name: 'materialdeclare',
      meta: {
        title: '物料申报'
      },
      component: materialdeclare
    },
    {
      path: '/businessdeclare',
      name: 'businessdeclare',
      meta: {
        title: '投营申报'
      },
      component: businessdeclare
    },
    {
      path: '/declarerecord',
      name: 'declarerecord',
      meta: {
        title: 'declarerecord'
      },
      component: declarerecord
    },
    {
      path: '/selectiondeclare',
      name: 'selectiondeclare',
      meta: {
        title: '选站申报'
      },
      component: selectiondeclare
    }
  ]
})
router.beforeEach(function (to, from, next) {
  document.title = to.meta.title
  next()
})

export default router
