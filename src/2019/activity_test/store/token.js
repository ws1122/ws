const TOKEN = {
  state: {
    access_token: '',
    refresh_token: '',
    userinfo: ''
  },
  mutations: {
    'SET-ACCESS-TOKEN'(state, access_token) {
      state.access_token = access_token
    },
    'SET-REFRESH-TOKEN'(state, refresh_token) {
      state.refresh_token = refresh_token
    },
    'SET-USERINFO'(state, userinfo) {
      state.userinfo = userinfo
    }
  },
  actions: {
    setAccessToken({ commit }, access_token) {
      commit('SET-ACCESS-TOKEN', access_token)
    },
    setRefreshToken({ commit }, refresh_token) {
      commit('SET-REFRESH-TOKEN', refresh_token)
    },
    setUserinfo({ commit }, userinfo) {
      commit('SET-USERINFO', userinfo)
    }
  },
  getters: {

  }
}
export default TOKEN
