<template>
<router-view></router-view>
</template>

<script>
export default {
  created () {
    if (this.$store.state.refreshToken) {
      this.$store.dispatch('refresh')
    }
    setInterval(() => {
      if (this.$store.state.refreshToken) {
        this.$store.dispatch('refresh')
      }
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
