import Vue from 'vue'
import './plugins/axios'
import main from './main.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import io from 'socket.io-client'
import VueSocketIO from 'vue-socket.io'

export const SocketInstance = io('http://localhost:2048')

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  SocketInstance,
  VueSocketIO,
  render: h => h(main)
}).$mount('#app')
