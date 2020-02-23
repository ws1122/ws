import Vue from 'vue'
import FastClick from 'fastclick'

FastClick.attach(document.body)
import router from './router'
import store from './store'

Vue.config.productionTip = false


import {
  AlertPlugin,
  ConfirmPlugin,
  ToastPlugin,
  LoadingPlugin
} from 'vux'
Vue.use(AlertPlugin)
Vue.use(ConfirmPlugin)
Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)

import '../../utils/rem.js'
import mediator from '../../utils/mediator.js'
Vue.prototype.$mediator = mediator // 发布者订阅者模式引入

import isTest from '../../utils/istest';
Vue.prototype.$isTest = isTest; // 是否为测试环境
import action from './action/http';
Vue.prototype.$http = action; // 请求方法

/* eslint-disable no-new */
var App = require('./App')
if (!App.name) App = App.default
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
})
