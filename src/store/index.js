import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    accessToken: '',
    refreshToken: ''
  },
  mutations: {
    signin: (state, data) => {
      state.accessToken = data.accessToken
      state.refreshToken = data.refreshToken
    },
    signout: (state) => {
      state.accessToken = ''
      state.refreshToken = ''
    },
    tokenCheck: (state) => {
      axios.get('http://api.dorothy.gsmhs.kr/' + state.accessToken)
        .then((res) => {
          if (res.status === 200) {
            return res.data.userType
          } else if (res.status === 401) {
            axios.post('http://api.dorothy.gsmhs.kr/' + state.refreshToken)
              .then((res) => {
                if (res.status === 200) {
                  state.accessToken = res.data.accessToken
                  axios.get('http://api.dorothy.gsmhs.kr/' + state.accessToken)
                    .then((res) => {
                      if (res.status === 200) {
                        return res.data.userType
                      }
                    })
                }
              })
          }
        })
    }
  },
  actions: {
  },
  modules: {
  }
})
