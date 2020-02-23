import Vue from 'vue'
import FastClick from 'fastclick'

FastClick.attach(document.body)
import router from './router'
import store from './store'

Vue.config.productionTip = false


import {AlertPlugin, ConfirmPlugin, ToastPlugin} from 'vux'
Vue.use({
  AlertPlugin, ConfirmPlugin, ToastPlugin
})

import '../utils/rem.js'

import initAjax from "../utils/ajax";
Vue.prototype.$get = initAjax("get");
Vue.prototype.$post = initAjax("post");

import isTest from '../utils/istest';
Vue.prototype.$isTest = isTest

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
