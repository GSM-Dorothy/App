<template>
  <v-app>
    <v-navigation-drawer
      app
      floating
      permanent
      touchless
      :mini-variant="$vuetify.breakpoint.xsOnly"
      mini-variant-width="100vh"
    >
      <template #prepend>
        <v-list two-line>
          <v-list-item>
            <v-img
              contain
              height="24"
              :src="$vuetify.theme.dark ? require('../assets/Dorothy.dark.svg') : require('../assets/Dorothy.svg')"
            >
            </v-img>
          </v-list-item>
          <v-list-item>
          </v-list-item>
          <v-list-item>
            <h1>로그인</h1>
          </v-list-item>
          <v-form
            ref="form"
            v-model="valid"
            :lazy-validation="lazy"
          >
            <v-list-item>
              <v-text-field
                v-model="name"
                :rules="nameRules"
                :color="$vuetify.theme.dark ? 'white' : 'black'"
                label="계정이름"
                required
                outlined
                dense
              ></v-text-field>
            </v-list-item>
            <v-list-item>
              <v-text-field
                v-model="password"
                :rules="passwordRules"
                :color="$vuetify.theme.dark ? 'white' : 'black'"
                label="비밀번호"
                type="password"
                required
                outlined
                dense
              ></v-text-field>
            </v-list-item>
            <v-list-item>
              <v-btn
                :disabled="!valid"
                :outlined="!valid"
                color="red"
                @click="signin"
                width="60"
                height="60"
              >
                <v-icon color="white">mdi-arrow-right</v-icon>
              </v-btn>
            </v-list-item>
          </v-form>
        </v-list>
      </template>
      <template>
        <v-list flat>
          <v-list-item to="/signup">
            계정 생성
          </v-list-item>
          <v-list-item>
            로그인이 안 되시나요?
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>
    <router-view></router-view>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    valid: true,
    lazy: false,
    name: '',
    nameRules: [
      v => (v && v.length >= 2) || '2자 이상이어야 합니다.'
    ],
    password: '',
    passwordRules: [
      v => !!v || ''
    ]
  }),
  methods: {
    signin: () => {
      let name = this.name
      let password = this.password
      this.$store.dispatch('signin', { name, password })
        .then(() => this.$router.push('/'))
        .catch(err => console.log(err))
    }
  }
}
</script>
