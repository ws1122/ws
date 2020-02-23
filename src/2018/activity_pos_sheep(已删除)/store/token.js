const TOKEN = {
    state: {
      access_token: '',
      refresh_token: '',
      isneedRefresh: false
    },
      mutations: {
       'SETACCESSTOKEN' (state, access_token) {
            state.access_token = access_token
        },
        'SETREFRESHTOKEN' (state, refresh_token) {
            state.refresh_token = refresh_token
        },
        'NEEDREFRESH' (state, isneedRefresh) {
            state.isneedRefresh = isneedRefresh
        },
      },
      actions: {
        setAccessToken ({commit}, access_token) {
           commit('SETACCESSTOKEN', access_token)
        },
        setRefreshToken ({commit}, refresh_token) {
            commit('SETREFRESHTOKEN', refresh_token)
        },
        needRefresh ({commit}, isneedRefresh) {
            commit('NEEDREFRESH', isneedRefresh)
        }
      },
      getters: {
     
      }
}
export default TOKEN