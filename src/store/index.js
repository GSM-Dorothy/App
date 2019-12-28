import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    accessToken: '',
    reflashToken: ''
  },
  mutations: {
    signin: (state, accessToken, refreshToken) => {
      state.accessToken = accessToken
      state.refreshToken = refreshToken
    },
    signout: (state) => {
      state.accessToken = ''
      state.reflashToken = ''
    },
    tokenCheck: (state) => {
      axios.get()
    }
  },
  actions: {
  },
  modules: {
  }
})
