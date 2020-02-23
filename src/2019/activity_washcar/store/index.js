import Vue from 'vue'
import Vuex from 'vuex'
import dialog from './dialog.js'
import token from './token.js'
Vue.use(Vuex)
// console.log(vuexLocal)
const store = new Vuex.Store({
  modules: {
    dialog,
    token
  }
})

export default store
