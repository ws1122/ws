const USER = {
  state: {
    points: 0, // 用户积分
    balance: 0 // 用户余额
  },
  mutations: {
    'SET-POINT'(state, points) {
      state.points = points
    },
    'SET-BALANCE'(state, balance) {
      state.balance = balance
    }
  },
  actions: {
    setPoints({commit}, points) {
      commit('SET-POINT', points)
    },
    setBalance({commit}, balance) {
      commit('SET-BALANCE', balance)
    }
  },
  getters: {
    // points(state) {
    //   return state.points
    // }
  }
}
export default USER
