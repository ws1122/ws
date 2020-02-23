import Vue from 'vue'
import FastClick from 'fastclick'

FastClick.attach(document.body)
import router from './router'
import store from './store'

Vue.config.productionTip = false


import {AlertPlugin, ConfirmPlugin, ToastPlugin, LoadingPlugin} from 'vux'

Vue.use(AlertPlugin)
Vue.use(ConfirmPlugin)
Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)
// Vue.prototype.$vux = { AlertPlugin, ConfirmPlugin, ToastPlugin, LoadingPlugin }

import '../../utils/rem.js'
import mediator from '../../utils/mediator.js'
Vue.prototype.$mediator = mediator // 观察者引入

import isTest from '../../utils/istest';
Vue.prototype.$isTest = isTest; // 是否为测试环境

import initAjax from "../../utils/ajax";
Vue.prototype.$get = initAjax("get");
Vue.prototype.$post = initAjax("post");
import  VueJsonp  from  'vue-jsonp'
Vue.use(VueJsonp)
/* eslint-disable no-new */
var App = require('./App')
if (!App.name) App = App.default
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: {App}
})
