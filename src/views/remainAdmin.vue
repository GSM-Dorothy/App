<template>
<v-content>
  <v-container fluid>
    <v-card class="elevation-12 ma-1">
      <v-tabs color="deep-purple accent-4" centered grow>
        <v-tab>등록</v-tab>
        <v-tab>목록</v-tab>

        <v-tab-item>
          <v-stepper v-model="e1">
            <v-stepper-header class="elevation-0">
              <v-stepper-step :editable="e1 > 1" :complete="e1 > 1" step="1">날짜</v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step :editable="e1 > 2" :complete="e1 > 2" step="2">시작 시간</v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step step="3">종료 시간</v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
              <v-stepper-content step="1" align="center">
                <v-container fluid>
                  <v-date-picker v-model="date" :landscape="$vuetify.breakpoint.smAndUp" class="mt-4">
                    <v-btn color="primary" @click="e1 = 2">
                      계속
                    </v-btn>
                  </v-date-picker>
                </v-container>
              </v-stepper-content>

              <v-stepper-content step="2" align="center">
                <v-container dense>
                  <v-time-picker ampm-in-title landscape v-model="start" :max="end">
                    <v-btn color="primary" @click="e3">
                      계속
                    </v-btn>
                  </v-time-picker>
                </v-container>
              </v-stepper-content>

              <v-stepper-content step="3" align="center">
                <v-container dense>
                  <v-time-picker ampm-in-title landscape v-model="end" :min="start">
                    <v-btn color="primary" @click="e4">
                      확인
                    </v-btn>
                  </v-time-picker>
                </v-container>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </v-tab-item>
        <v-tab-item>
          <v-data-table v-model="selected" :headers="adminHeaders" :items="admins" item-key="name" show-select class="elevation-1">
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
    adminHeaders: [{
      text: '이름',
      value: 'name'
    },
    {
      text: '연락처',
      value: 'phone'
    },
    {
      text: '시작 시간',
      value: 'startDate'
    },
    {
      text: '종료 시간',
      value: 'endDate'
    }
    ],
    admins: [],
    e1: 0,
    date: new Date().toISOString().substr(0, 10),
    start: null,
    end: null
  }),
  methods: {
    e3 () {
      if (this.start != null) {
        this.e1 = 3
      }
      if (this.end === null) {
        this.end = this.start
      }
    },
    e4 () {
      let posts = {
        startDate: this.convertedDate(this.start).toISOString(),
        endDate: this.convertedDate(this.end).toISOString()
      }

      axios
        .post(`http://api.dorothy.gsmhs.kr/school/remain/administrator`, posts)
        .then(response => {
          if (response.status === 200) {
            console.log(response.data)
          }
        })
        .catch(err => console.log(err))
        .finally(() => {
          this.e1 = 1
        })
    },
    allowedStep: m => m % 5 === 0,
    convertedDate (time) {
      let splited = time.split(':')

      let hour = splited[0]
      let minute = splited[1]

      let date = new Date()
      date.setHours(hour)
      date.setMinutes(minute)

      return date
    },
    getAdmins: function (year, month, day) {
      return new Promise((resolve) => {
        axios
          .get(`http://api.dorothy.gsmhs.kr/school/remain/administrator/${year}/${month}/${day}`)
          .then(response => {
            resolve(response.data)
          })
          .catch(err => {
            console.log(err)
            resolve(this.getAdmins(year, month, day).then((data) => {
              return data
            }))
          })
      })
    }
  },
  async created () {
    let year = new Date().getFullYear()
    let month = new Date().getMonth() + 1
    let day = new Date().getDate()

    this.$nextTick()
      .then(this.getAdmins(year, month, day).then((data) => {
        this.admins = data
      }))
      .catch(err => {
        console.log(err)
      })
  }
}
</script>
