import Vue from 'vue'
import Vuex from 'vuex'
import dialog from './dialog.js'
import user from './user.js'
import token from './token.js'
// import VuexPersistence from 'vuex-persist'
Vue.use(Vuex)
// 持续化插件，注意兼容性，低版本（例如pos机）不能用(好像这个插件有bug)
// const vuexLocal = new VuexPersistence({
//   storage: window.sessionStorage
// })
// console.log(vuexLocal)
const store = new Vuex.Store({
  modules: {
    dialog,
    user,
    token
  }
  // plugins: [vuexLocal.plugin]
})

export default store
