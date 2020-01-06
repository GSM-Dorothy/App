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
import io from 'socket.io-client'
import axios from 'axios'

export default {
  data () {
    return {
      socket: io('http://localhost:2048')
    }
  },
  mounted () {
    this.socket.on('in', id => {
      console.log(id)
      this.$store.dispatch('signin', { id })
        .then(() => {
          if (this.$store.state.userType === 'STUDENT') {
            this.$router.push('/device')
          } else if (this.$store.state.userType === 'ADMINISTRATOR') {
            this.$router.push('/admin')
          }
        })
        .catch(err => console.log(err))
    })
    this.socket.on('add', ({ code, fingerprints }) => {
      axios
        .post(`http://api.dorothy.gsmhs.kr/auth/fingerprint`, {
          code: code,
          fingerprints: fingerprints
        })
        .then(response => {
          if (response.status === 200) {
            this.$router.push('/device')
          }
        })
        .catch(err => {
          console.log(err)
        })
    })
  }
}
</script>
