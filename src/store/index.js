import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    status: '',
    user: {},
    accessToken: '',
    refreshToken: ''
  },
  mutations: {
    auth_request (state) {
      state.status = 'loading'
    },
    auth_success (state, accessToken, refreshToken, user) {
      state.status = 'success'
      state.accessToken = accessToken
      state.refreshToken = refreshToken
      state.user = user
    },
    auth_error (state) {
      state.status = 'error'
    },
    signout (state) {
      state.status = ''
      state.accessToken = ''
      state.refreshToken = ''
    }
  },
  actions: {
    signin ({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        axios.post('http://api.dorothy.gsmhs.kr/' + user)
          .then(res => {
            const accessToken = res.data.accessToken
            const refreshToken = res.data.refreshToken
            const user = res.data.user
            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('refreshToken', refreshToken)
            axios.defaults.headers.common['x-access-token'] = accessToken
            axios.defaults.headers.common['x-refresh-token'] = refreshToken
            commit('auth_success', accessToken, refreshToken, user)
            resolve(res)
          })
          .catch(err => {
            commit('auth_error')
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            delete axios.defaults.headers.common['accessToken']
            delete axios.defaults.headers.common['refreshToken']
            reject(err)
          })
      })
    },
    signout ({ commit }) {
      return new Promise((resolve, reject) => {
        commit('signout')
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        delete axios.defaults.headers.common['accessToken']
        delete axios.defaults.headers.common['refreshToken']
        resolve()
      })
    }
  },
  getters: {
    isLoggedIn: state => !!state.accessToken,
    authStatus: state => state.status
  }
})
