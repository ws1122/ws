import Vue from 'vue'
import Vuex from 'vuex'
import dialog from './dialog.js'
import VuexPersistence from 'vuex-persist'
Vue.use(Vuex)
// 持续化插件，注意兼容性，低版本（例如pos机）不能用
const vuexLocal = new VuexPersistence({
  storage: window.sessionStorage
})
// console.log(vuexLocal)
const store = new Vuex.Store({
  modules: {
    dialog
  },
  plugins: [vuexLocal.plugin]
})

export default store
