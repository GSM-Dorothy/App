<template>
<router-view></router-view>
</template>

<script>
export default {
  created () {
    if (this.$store.state.refreshToken) {
      this.$store.dispatch('refresh')
    } else {
      this.$store.dispatch('device')
        .then(res => {
          if (res.status === 200) {
            this.$router.push('device')
          }
        })
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
