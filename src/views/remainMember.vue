<template>
<v-content>
  <v-container fluid>
    <v-row>
      <v-col :cols="$vuetify.breakpoint.smAndUp ? '6' : '12'">
        <v-card class="elevation-12 ma-1">
          <v-card-text>
            <p class="text--primary">
              잔류 학생 총원
            </p>
            <p class="display-1 text--primary">
              {{ currentRemainStudents }}명
            </p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col :cols="$vuetify.breakpoint.smAndUp ? '6' : '12'">
        <v-card class="elevation-12 ma-1">
          <v-card-text>
            <p class="text--primary">
              사내 학생 총원
            </p>
            <p class="display-1 text--primary">
              {{ currentInsideStudents }}명
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-card class="elevation-12 ma-1">
      <v-tabs color="deep-purple accent-4" centered grow>
        <v-tab>신청자</v-tab>
        <v-tab>학습실</v-tab>
        <v-tab>호실</v-tab>
        <v-tab>외출</v-tab>

        <v-tab-item>
          <v-container fluid>
            <v-data-table :headers="enrollHeader" :items="enrollStudents"></v-data-table>
          </v-container>
        </v-tab-item>
        <v-tab-item>
          <v-container fluid>
            <v-data-table :headers="studyingHeader" :items="studyingStudents"></v-data-table>
          </v-container>
        </v-tab-item>
        <v-tab-item>
          <v-container fluid>
            <v-data-table :headers="stayingOutHeader" :items="stayingOutStudents"></v-data-table>
          </v-container>
        </v-tab-item>
        <v-tab-item>
          <v-container fluid>
            <v-data-table :headers="leftHeader" :items="leftStudents"></v-data-table>
          </v-container>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </v-container>
</v-content>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      currentDate: new Date(),
      enrollHeader: [{
        text: '학년',
        value: 'grade'
      },
      {
        text: '반',
        value: 'class'
      },
      {
        text: '번호',
        value: 'number'
      },
      {
        text: '이름',
        value: 'name'
      }
      ],
      studyingHeader: [{
        text: '학년',
        value: 'grade'
      },
      {
        text: '반',
        value: 'class'
      },
      {
        text: '번호',
        value: 'number'
      },
      {
        text: '이름',
        value: 'name'
      }
      ],
      stayingOutHeader: [{
        text: '복귀 시간',
        value: 'finishDate'
      },
      {
        text: '호실',
        value: 'room'
      },
      {
        text: '학년',
        value: 'grade'
      },
      {
        text: '반',
        value: 'class'
      },
      {
        text: '번호',
        value: 'number'
      },
      {
        text: '이름',
        value: 'name'
      }
      ],
      leftHeader: [{
        text: '복귀 시간',
        value: 'finishDate'
      },
      {
        text: '사유',
        value: 'reason'
      },
      {
        text: '학년',
        value: 'grade'
      },
      {
        text: '반',
        value: 'class'
      },
      {
        text: '번호',
        value: 'number'
      },
      {
        text: '이름',
        value: 'name'
      }
      ],
      enrollStudents: [],
      remainArchives: []
    }
  },
  computed: {
    currentRemainStudents: function () {
      return this.enrollStudents.length
    },
    currentInsideStudents: function () {
      return this.remainArchives
        .filter(archive => archive.remainType === 'STUDYING' || archive.remainType === 'STAYING_OUT')
        .length
    },
    studyingStudents: function () {
      return this.remainArchives
        .filter(archive => archive.remainType === 'STUDYING')
    },
    stayingOutStudents: function () {
      return this.remainArchives
        .filter(archive => archive.remainType === 'STAYING_OUT')
    },
    leftStudents: function () {
      return this.remainArchives
        .filter(archive => archive.remainType === 'LEFT')
    }
  },
  methods: {
    getEnrolledStudents: function (year, month, day) {
      return new Promise((resolve) => {
        axios
          .get(`/school/remain/enroll/${year}/${month}/${day}`)
          .then(response => {
            resolve(response.data)
          })
          .catch(err => {
            console.log(err)
            resolve(this.getEnrolledStudents(year, month, day)
              .then((data) => {
                return data
              }))
          })
      })
    },
    getRemainArchives: function (year, month, day) {
      return new Promise((resolve) => {
        axios
          .get(`/school/remain/archive/${year}/${month}/${day}`)
          .then(response => {
            resolve(response.data)
          })
          .catch(err => {
            console.log(err)
            resolve(this.getRemainArchives(year, month, day)
              .then((data) => {
                return data
              }))
          })
      })
    }
  },
  async created () {
    let year = this.currentDate.getFullYear()
    let month = this.currentDate.getMonth() + 1
    let day = this.currentDate.getDate()

    this.$nextTick(() => {
      this.getEnrolledStudents(year, month, day)
        .then((data) => {
          this.enrollStudents = data
        })

      this.getRemainArchives(year, month, day)
        .then((data) => {
          this.remainArchives = data
        })
    })
  }
}
</script>
