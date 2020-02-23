const DIALOG = {
  state: {
    color: '#fff',
    maskShow: false, // 遮罩层
    inHeadShow: false // 发票历史的头部
  },
  mutations: {
    'SET-BACKGROUND-COLOR' (state, color) {
      state.color = color
      document.body.style.backgroundColor = state.color
    },
    'SET-MASK'(state, maskShow) {
      state.maskShow = maskShow
    },
    'SET-INVOICEHEADER'(state, inHeadShow) {
      state.inHeadShow = inHeadShow
    }
  },
  actions: {
    setBackgroundColor ({commit}, color) {
      commit('SET-BACKGROUND-COLOR', color)
    },
    setMask({commit}, maskShow) {
      commit('SET-MASK', maskShow)
    },
    setInvoiceHeader({commit}, inHeadShow) {
      commit('SET-INVOICEHEADER', inHeadShow)
    }
  },
  getters: {}
}
export default DIALOG
