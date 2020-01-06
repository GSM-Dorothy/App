<template>
<v-content>
  <v-container fluid>
    <v-card class="elevation-12 ma-1">
      <v-tabs color="deep-purple accent-4" centered grow>
        <v-tab>등록</v-tab>
        <v-tab>목록</v-tab>

        <v-tab-item>
          <v-container fluid>
            <v-row>
              <v-col>
                <v-form ref="form" v-model="valid" :lazy-validation="lazy">
                  <v-list-item>
                    <v-text-field v-model="ip" :rules="defaultRules" :color="$vuetify.theme.dark ? 'white' : 'black'" label="IP Address" required outlined dense></v-text-field>
                  </v-list-item>
                  <v-list-item>
                    <v-btn :disabled="!valid" :outlined="!valid" color="red" @click="add" width="60" height="60">
                      <v-icon color="white">mdi-arrow-right</v-icon>
                    </v-btn>
                  </v-list-item>
                </v-form>
              </v-col>
            </v-row>
          </v-container>
        </v-tab-item>
        <v-tab-item>
          <v-data-table v-model="selected" :headers="deviceHeaders" :items="deviceList" item-key="IP" show-select class="elevation-1">
            <template v-slot:top>
              <v-btn
                outlined
                color="red"
                @click="remove"
                class="ma-3"
              >
                삭제
              </v-btn>
            </template>
          </v-data-table>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </v-container>
</v-content>
</template>

<script>
import axios from 'axios'

export default {
  data: () => ({
    selected: [],
    deviceHeaders: [{
      text: 'IP Address',
      value: 'IP'
    }
    ],
    deviceList: []
  }),
  methods: {
    add: function () {
      const ip = this.ip

      if (!ip) {
        return false
      }

      axios.post('http://api.dorothy.gsmhs.kr/auth/device', {
        IP: ip
      })
        .then(res => {
          if (res.status === 200) {
            alert('등록 완료')
            this.$router.go(0)
          }
        })
    },
    remove: function () {
      alert('msg')
    },
    getDeviceList: function () {
      return new Promise((resolve) => {
        axios
          .get(`http://api.dorothy.gsmhs.kr/auth/device`)
          .then(response => {
            resolve(response.data)
          })
          .catch(err => {
            console.log(err)
            resolve(this.getDeviceList().then(data => {
              return data
            }))
          })
      })
    }
  },
  async created () {
    this.$nextTick()
      .then(this.getDeviceList().then((data) => {
        this.deviceList = data
      }))
      .catch(err => {
        console.log(err)
      })
  }
}
</script>
