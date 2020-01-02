<template>
  <router-view></router-view>
</template>

<script>
import store from './store'
import axios from 'axios'

export default {
  created () {
    axios.interceptors.response.use(undefined, (err) => {
      return new Promise(function (resolve, reject) {
        store.dispatch('refresh')
        throw err
      })
    })
  },
  mounted () {
    const dark = window.matchMedia('(prefers-color-scheme: dark)')
    this.$vuetify.theme.dark = dark.matches
    dark.addEventListener('change', () => {
      this.$vuetify.theme.dark = dark.matches
    })
  }
}
</script>
