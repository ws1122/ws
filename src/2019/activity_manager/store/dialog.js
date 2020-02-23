const DIALOG = {
  state: {
    color: '#fff', // 全局body背景色
    maskShow: false, // 全局遮罩层显示隐藏
    showIndexTitle: false // 显示首页的title
  },
  mutations: {
    'SET-BACKGROUND-COLOR'(state, color) {
      state.color = color
      document.body.style.backgroundColor = state.color
    },
    'SET-MASKSHOW'(state, maskShow) {
      state.maskShow = maskShow
    },
    'SHOW-TITLE'(state, showIndexTitle) {
      state.showIndexTitle = showIndexTitle
    }
  },
  actions: {
    setBackgroundColor({commit}, color) {
      commit('SET-BACKGROUND-COLOR', color)
    },
    setMaskShow({commit}, maskShow) {
      commit('SET-MASKSHOW', maskShow)
    },
    showTitle({commit}, showIndexTitle) {
      commit('SHOW-TITLE', showIndexTitle)
    }
  },
  getters: {

  }
}
export default DIALOG
