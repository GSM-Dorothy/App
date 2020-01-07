<template>
<v-content>
  <v-container fluid>
    <v-row>
      <v-spacer></v-spacer>
      <v-col :cols="$vuetify.breakpoint.smAndUp ? '10' : '12'" v-if="$store.state.device">
        <v-card class="elevation-12 ma-1">
          <v-card-title>
            지문 등록
          </v-card-title>
          <v-card-text align="center">
            <v-form
              ref="form"
              v-model="valid"
              :lazy-validation="lazy"
            >
              <v-text-field
                v-model="code"
                :rules="codeRules"
                :color="$vuetify.theme.dark ? 'white' : 'black'"
                label="인증번호"
                required
                outlined
                dense
                counter="6"
              ></v-text-field>
            </v-form>
            <div>
              <v-btn class="ma-1" outlined x-large @click="code+='7'">7</v-btn>
              <v-btn class="ma-1" outlined x-large @click="code+='8'">8</v-btn>
              <v-btn class="ma-1" outlined x-large @click="code+='9'">9</v-btn>
            </div>
            <div>
              <v-btn class="ma-1" outlined x-large @click="code+='4'">4</v-btn>
              <v-btn class="ma-1" outlined x-large @click="code+='5'">5</v-btn>
              <v-btn class="ma-1" outlined x-large @click="code+='6'">6</v-btn>
            </div>
            <div>
              <v-btn class="ma-1" outlined x-large @click="code+='1'">1</v-btn>
              <v-btn class="ma-1" outlined x-large @click="code+='2'">2</v-btn>
              <v-btn class="ma-1" outlined x-large @click="code+='3'">3</v-btn>
            </div>
            <div>
              <v-btn color="red accent-4" class="ma-1" outlined x-large @click="code=''">DEL</v-btn>
              <v-btn class="ma-1" outlined x-large @click="code+='0'">0</v-btn>
              <v-btn color="green accent-4" class="ma-1" outlined x-large @click="validateDeviceCode" :disabled="!valid">OK</v-btn>
            </div>
          </v-card-text>
          <v-card-actions class="body-2">
            발급한 지문 등록 인증번호를 입력해주세요
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col :cols="$vuetify.breakpoint.smAndUp ? '8' : '12'" v-else>
        <v-card class="elevation-12 ma-1">
          <v-card-title>
            지문 등록
          </v-card-title>
          <v-card-text align="center">
            <v-btn @click="getDeviceCode" color="deep-purple accent-4" outlined x-large>인증번호 발급</v-btn>
          </v-card-text>
          <v-card-text align="center" v-if="code">
            <h2>사용자의 코드는 {{ code }}입니다!</h2>
          </v-card-text>
          <v-card-actions class="body-2">
            지문 등록 인증번호 발급 후 가까운 디바이스를 찾아 인증번호를 입력하여 등록 가능합니다
          </v-card-actions>
        </v-card>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
  </v-container>
</v-content>
</template>

<script>
import axios from 'axios'

export default {
  data: () => ({
    valid: true,
    lazy: false,
    code: '',
    codeRules: [
      v => (v && v.length <= 6) || ''
    ]
  }),
  methods: {
    getDeviceCode () {
      axios
        .post(`/auth/code/device`)
        .then(response => {
          this.code = response.data.code
        })
        .catch(err => console.log(err))
    },
    validateDeviceCode () {
      let code = this.code
      let posts = {
        code: code
      }

      axios
        .post(`/auth/device/enroll`, posts)
        .then(response => {
          this.$router.push('/device/add')
        })
        .catch(() => alert('인증번호가 올바르지 않습니다!'))
    }
  }
}
</script>
