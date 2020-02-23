const TOKEN = {
  state: {
    access_token: '',
    refresh_token: '',
    userinfo: '',
    contact: '', // 选择的临时收件人
    phone: '', // 选择的临时收件人手机号
    address: '' // 选择的临时收件人详细地址
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
    },
    'SET-CONTACT'(state, contact) {
      state.contact = contact
    },
    'SET-PHONE'(state, phone) {
      state.phone = phone
    },
    'SET-ADDRESS'(state, address) {
      state.address = address
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
    },
    setContact({ commit }, contact) {
      commit('SET-CONTACT', contact)
    },
    setPhone({ commit }, phone) {
      commit('SET-PHONE', phone)
    },
    setAddress({ commit }, address) {
      commit('SET-ADDRESS', address)
    }
  },
  getters: {

  }
}
export default TOKEN
