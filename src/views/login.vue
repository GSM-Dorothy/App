<template>
  <v-app>
    <v-navigation-drawer
      app
      floating
      permanent
      touchless
      :mini-variant="$vuetify.breakpoint.xsOnly"
    >
      <template #prepend>
        <v-list two-line >
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
                :color="$vuetify.theme.dark ? 'white' : 'black'"
                label="비밀번호"
                required
                outlined
                dense
              ></v-text-field>
            </v-list-item>
            <v-list-item>
              <v-btn
                :disabled="!valid"
                color="purple accent-4"
                class="mr-4"
                @click="validate"
                outlined
                large
              >
                <v-icon>mdi-arrow-right</v-icon>
              </v-btn>
            </v-list-item>
          </v-form>
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
    nameRules: [
      v => (v && v.length >= 2) || '2자 이상이어야 합니다.'
    ]
  }),

  methods: {
    validate () {
      if (this.$refs.form.validate()) {
        this.snackbar = true
      }
    }
  }
}
</script>
