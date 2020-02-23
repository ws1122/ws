const SITEKEY = {
  state: {
    sitekey: '' // 搜索字段
  },
  mutations: {
    'SET-SITEKEY'(state, sitekey) {
      state.sitekey = sitekey
    }
  },
  actions: {
    setSiteKey({commit}, sitekey) {
      commit('SET-SITEKEY', sitekey)
    }
  },
  getters: {
    // points(state) {
    //   return state.points
    // }
  }
}
export default SITEKEY
