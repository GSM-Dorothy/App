import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userType: localStorage.getItem('userType'),
    refreshToken: localStorage.getItem('refreshToken')
  },
  mutations: {
    auth_success (state, userType, refreshToken) {
      state.userType = userType
      state.refreshToken = refreshToken
    },
    signout (state) {
      state.userType = ''
      state.refreshToken = ''
    }
  },
  actions: {
    signin ({ commit }, data) {
      return new Promise((resolve, reject) => {
        axios.post('http://api.dorothy.gsmhs.kr/auth/token/grant', {
          ID: data.name,
          password: data.password
        })
          .then(res => {
            const accessToken = res.data.accessToken
            const refreshToken = res.data.refreshToken
            localStorage.setItem('refreshToken', refreshToken)
            axios.defaults.headers.common['x-access-token'] = accessToken
            axios.get('http://api.dorothy.gsmhs.kr/auth/token')
              .then(response => {
                const userType = response.data.userType
                localStorage.setItem('userType', userType)
                commit('auth_success', userType, refreshToken)
                resolve(res)
              })
              .catch(err => {
                reject(err)
              })
          })
          .catch(err => {
            localStorage.removeItem('userType')
            localStorage.removeItem('refreshToken')
            delete axios.defaults.headers.common['x-access-token']
            reject(err)
          })
      })
    },
    signout ({ commit }) {
      return new Promise((resolve, reject) => {
        commit('signout')
        localStorage.removeItem('userType')
        localStorage.removeItem('refreshToken')
        delete axios.defaults.headers.common['x-access-token']
        resolve()
      })
    },
    refresh () {
      return new Promise((resolve, reject) => {
        axios.post('http://api.dorothy.gsmhs.kr/auth/token/refresh', {
          refreshToken: localStorage.getItem('refreshToken')
        })
          .then(res => {
            axios.defaults.headers.common['x-access-token'] = res.data.accessToken
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  },
  getters: {
    isLoggedIn: state => !!state.refreshToken,
    userType: state => state.userType
  }
})
