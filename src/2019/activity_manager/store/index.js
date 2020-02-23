import Vue from 'vue'
import Vuex from 'vuex'
import dialog from './dialog.js'
import user from './user.js'
import token from './token.js'
import site from './sitekey.js'

Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    dialog,
    user,
    token,
    site
  }
})

export default store
