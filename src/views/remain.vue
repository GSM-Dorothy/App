<template>
<v-content>
  <v-container fluid>
    <v-row>
      <v-col :cols="$vuetify.breakpoint.smAndUp ? '6' : '12'">
        <v-card class="elevation-12 ma-1">
          <v-card-text>
            <h3 v-if="!currentAdmin">
              현재 잔류 담당 선생님이 없습니다!
            </h3>
            <div v-else>
              <p class="text--primary">
                현재 잔류 담당 선생님
              </p>
              <p class="display-1 text--primary">
                {{ currentAdmin.name }} 선생님
              </p>
              <p class="text--primary">
                {{ currentAdmin.phone }}
              </p>
              <p class="text--primary">
                {{ stringifiedDate(currentAdmin.startDate) }}부터 {{ stringifiedDate(currentAdmin.endDate) }}까지
              </p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col :cols="$vuetify.breakpoint.smAndUp ? '6' : '12'">
        <v-card class="elevation-12 ma-1">
          <v-card-text>
            <h3 v-if="!nextAdmin">
              다음 잔류 담당 선생님이 없습니다!
            </h3>
            <div v-else>
              <p class="text--primary">
                다음 잔류 담당 선생님
              </p>
              <p class="display-1 text--primary">
                {{ nextAdmin.name }} 선생님
              </p>
              <p class="text--primary">
                {{ nextAdmin.phone }}
              </p>
              <p class="text--primary">
                {{ stringifiedDate(nextAdmin.startDate) }}부터 {{ stringifiedDate(nextAdmin.endDate) }}까지
              </p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-card class="elevation-12 ma-1">
      <v-stepper v-model="e1">
        <v-stepper-header class="elevation-0">
          <v-stepper-step :editable="e1 > 1" :complete="e1 > 1" step="1">선택</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step :editable="e1 > 2" :complete="e1 > 2" step="2">시작 시간</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step step="3">복귀 시간</v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <v-container fluid>
              <v-row dense>
                <v-col v-for="card in cards" :key="card.title" :cols="card.flex">
                  <v-card>
                    <v-img :src="card.src" @click="e1 = 2; archiveAction = card.action" class="white--text align-end" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" height="200px">
                      <v-card-title v-text="card.title"></v-card-title>
                    </v-img>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-stepper-content>

          <v-stepper-content step="2" align="center">
            <v-container dense>
              <v-time-picker ampm-in-title landscape v-model="start" :max="end" full-width>
                <v-btn color="primary" @click="e3">
                  계속
                </v-btn>
              </v-time-picker>
            </v-container>
          </v-stepper-content>

          <v-stepper-content step="3" align="center">
            <v-container dense>
              <v-time-picker ampm-in-title landscape v-model="end" :min="start" full-width>
                <v-btn color="primary" @click="e4">
                  확인
                </v-btn>
              </v-time-picker>
            </v-container>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-card>
  </v-container>
</v-content>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      currentTime: new Date(),
      cards: [{
        title: '호실',
        src: 'https://cdn.vuetifyjs.com/images/cards/docks.jpg',
        flex: 4,
        action: 'STAYING_OUT'
      },
      {
        title: '외출',
        src: 'https://cdn.vuetifyjs.com/images/cards/docks.jpg',
        flex: 4,
        action: 'LEFT'
      },
      {
        title: '외박',
        src: 'https://cdn.vuetifyjs.com/images/cards/docks.jpg',
        flex: 4,
        action: 'SLEEPING_OVER'
      }
      ],
      e1: 0,
      start: null,
      end: null,
      archiveAction: '',
      todayAdmin: []
    }
  },
  computed: {
    currentAdmin: function () {
      return this.todayAdmin
        .filter(admin => this.isCurrentAdmin(admin))[0]
    },
    nextAdmin: function () {
      return this.todayAdmin
        .filter(admin => this.isNextAdmin(admin))
        .sort((a, b) => {
          if (a.startDate < b.startDate) {
            return -1
          }

          if (a.startDate > b.startDate) {
            return 1
          }

          return 0
        })[0]
    }
  },
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
        remainType: this.archiveAction,
        startDate: this.convertedDate(this.start).toISOString(),
        finishDate: this.convertedDate(this.end).toISOString()
      }

      axios
        .post(`http://api.dorothy.gsmhs.kr/school/remain/archive`, posts)
        .then(response => {
          if (response.status === 200) {
            // TO-DO: 아카이브 추가에 대한 상태 메시지
          }
        })
        .catch(err => console.log(err))
        .finally(() => {
          this.e1 = 1
        })
    },
    allowedStep: m => m % 5 === 0,
    isCurrentAdmin (admin) {
      let today = this.currentTime.toISOString()

      return admin.startDate < today && today < admin.endDate
    },
    isNextAdmin (admin) {
      let today = this.currentTime.toISOString()

      return admin.startDate > today
    },
    stringifiedDate (date) {
      let converted = new Date(date)

      let dateString = converted.toLocaleDateString('ko-KR', { timeZone: 'UTC' })
      let timeString = converted.toLocaleString('ko-KR', { timeZone: 'UTC', hour: 'numeric', hour12: true })

      return `${dateString} ${timeString}`
    },
    convertedDate (time) {
      let splited = time.split(':')

      let hour = splited[0]
      let minute = splited[1]

      let date = new Date()
      date.setHours(hour)
      date.setMinutes(minute)

      return date
    }
  },
  created () {
    let year = this.currentTime.getFullYear()
    let month = this.currentTime.getMonth() + 1
    let day = this.currentTime.getDate() - 1

    axios
      .get(`http://api.dorothy.gsmhs.kr/school/remain/administrator/${year}/${month}/${day}`)
      .then(response => {
        if (response.status === 200) {
          this.todayAdmin = response.data
        }
      })
      .catch(err => console.log(err))
  }
}
</script>
