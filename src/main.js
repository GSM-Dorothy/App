import Vue from 'vue'
import './plugins/axios'
import main from './main.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from 'axios'

axios.defaults.baseURL = process.env.VUE_APP_API_URI

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(main)
}).$mount('#app')
