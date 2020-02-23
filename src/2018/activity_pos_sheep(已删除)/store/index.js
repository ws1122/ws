import Vue from 'vue'
import Vuex from 'vuex'
import token from './token.js'
import VuexPersistence from 'vuex-persist'
Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  storage: window.sessionStorage
})
console.log(vuexLocal)
const store = new Vuex.Store({
  modules: {
    token
  },
  plugins: [vuexLocal.plugin]
})

export default store
