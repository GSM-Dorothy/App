<template>
  <v-app>
    <v-content>
      <v-img src="hana" height="100vh" gradient="to top right, rgba(255,0,0,.6), rgba(0,0,255,.6)">
        <v-row align="center" class="lightbox white--text fill-height">
          <v-col align="center">
            <v-icon color="white" size="75">mdi-fingerprint</v-icon>
            <div class="display-1">지문을 인식해주세요!</div>
          </v-col>
        </v-row>
      </v-img>
    </v-content>
  </v-app>
</template>

<script>
export default {
  methods: {
    signin () {
      this.$socket.in('in', data => {
        this.$store.dispatch('signin', { data })
          .then(() => {
            if (this.$store.state.userType === 'STUDENT') {
              this.$router.push('/meals')
            } else if (this.$store.state.userType === 'ADMINISTRATOR') {
              this.$router.push('/admin')
            }
          })
          .catch(err => console.log(err))
      })
    }
  }
}
</script>
