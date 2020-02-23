const DIALOG = {
  state: {
    color: '#fff', // 全局body背景色
    maskShow: false // 全局遮罩层显示隐藏
  },
  mutations: {
    'SET-BACKGROUND-COLOR'(state, color) {
      state.color = color
      document.body.style.backgroundColor = state.color
    },
    'SET-MASKSHOW'(state, maskShow) {
      state.maskShow = maskShow
    }
  },
  actions: {
    setBackgroundColor({commit}, color) {
      commit('SET-BACKGROUND-COLOR', color)
    },
    setMaskShow({commit}, maskShow) {
      commit('SET-MASKSHOW', maskShow)
    }
  },
  getters: {

  }
}
export default DIALOG
