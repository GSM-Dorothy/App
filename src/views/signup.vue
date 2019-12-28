<template>
<v-app>
  <v-navigation-drawer app floating permanent touchless :mini-variant="$vuetify.breakpoint.xsOnly" mini-variant-width="100vh">
    <template #prepend>
      <v-list two-line>
        <v-list-item>
          <v-img contain height="24" :src="$vuetify.theme.dark ? require('../assets/Dorothy.dark.svg') : require('../assets/Dorothy.svg')">
          </v-img>
        </v-list-item>
        <v-list-item>
        </v-list-item>
        <v-list-item>
          <h1>계정 생성</h1>
        </v-list-item>
        <v-form ref="form" v-model="valid" :lazy-validation="lazy">
          <v-list-item>
            <v-text-field v-model="email" :rules="emailRules" :color="$vuetify.theme.dark ? 'white' : 'black'" label="이메일" required outlined dense></v-text-field>
          </v-list-item>
          <v-list-item>
            <v-text-field v-model="password" :rules="passwordRules" :color="$vuetify.theme.dark ? 'white' : 'black'" label="비밀번호" type="password" required outlined dense></v-text-field>
          </v-list-item>
          <v-list-item>
            <v-text-field v-model="phone" :rules="phoneRules" :color="$vuetify.theme.dark ? 'white' : 'black'" label="전화번호" required outlined dense></v-text-field>
          </v-list-item>
          <v-list-item>
            <v-text-field v-model="code" :rules="codeRules" :color="$vuetify.theme.dark ? 'white' : 'black'" label="인증번호" required outlined dense></v-text-field>
          </v-list-item>
          <v-list-item>
            <v-btn :disabled="!valid" :outlined="!valid" color="red" @click="signup" width="60" height="60">
              <v-icon color="white">mdi-arrow-right</v-icon>
            </v-btn>
          </v-list-item>
        </v-form>
      </v-list>
    </template>
    <template>
      <v-list flat>
        <v-list-item to="/">
          로그인
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
  <router-view></router-view>
</v-app>
</template>

<script>
import axios from 'axios'

export default {
  data: () => ({
    valid: true,
    lazy: false,
    email: '',
    emailRules: [
      v => !!v || '',
      v => /.+@.+/.test(v) || ''
    ],
    password: '',
    passwordRules: [
      v => !!v || ''
    ],
    phone: '',
    phoneRules: [
      v => !!v || ''
    ],
    code: '',
    codeRules: [
      v => !!v || ''
    ]
  }),
  methods: {
    signup () {
      const email = this.email
      const password = this.password
      const phone = this.phone
      const code = this.code

      if (!email || !password || !phone || !code) {
        return false
      }

      axios.post('http://api.dorothy.gsmhs.kr/user/create', {
        email,
        password,
        phone,
        code
      })
        .then(res => {
          if (res.status === 200) {
            this.$router.push('/')
          }
        })
    }
  }
}
</script>
