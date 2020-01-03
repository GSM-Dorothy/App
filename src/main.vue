<template>
<router-view></router-view>
</template>

<script>
import store from './store'

export default {
  created () {
    setInterval(() => {
      let expireDate = store.getters['expireDate']
      const now = new Date()
      console.log(expireDate)
      console.log(now)
      this.$store.dispatch('refresh')
    }, 60000)
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
