<template>
<v-content>
  <v-container fluid>
    <v-sheet>
      <v-card flat class="elevation-12 ma-1 pa-1">
        <v-card-actions>
        <v-btn outlined class="mr-3" @click="setToday">
          Today
        </v-btn>
        <v-btn fab text small @click="prev">
          <v-icon small>mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn fab text small @click="next" class="mr-3">
          <v-icon small>mdi-chevron-right</v-icon>
        </v-btn>
        <v-toolbar-title>{{ date }}</v-toolbar-title>
        </v-card-actions>
      </v-card>
    </v-sheet>
    <v-row>
      <v-col :cols="$vuetify.breakpoint.smAndUp ? '4' : '12'">
        <v-card class="elevation-12 ma-1">
          <v-card-text>
            <p class="display-1 font-weight-regular text--primary">
              조식
            </p>
            <p v-if="!breakfast.length">오늘의 조식은 없습니다.</p>
            <div v-else class="text--primary" v-for="menu in breakfast" :key="menu">
              {{ menu }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col :cols="$vuetify.breakpoint.smAndUp ? '4' : '12'">
        <v-card class="elevation-12 ma-1">
          <v-card-text>
            <p class="display-1 font-weight-regular text--primary">
              중식
            </p>
            <p v-if="!lunch.length">오늘의 중식은 없습니다.</p>
            <div v-else class="text--primary" v-for="menu in lunch" :key="menu">
              {{ menu }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col :cols="$vuetify.breakpoint.smAndUp ? '4' : '12'">
        <v-card class="elevation-12 ma-1">
          <v-card-text>
            <p class="display-1 font-weight-regular text--primary">
              석식
            </p>
            <p v-if="!dinner.length">오늘의 석식은 없습니다.</p>
            <div v-else class="text--primary" v-for="menu in dinner" :key="menu">
              {{ menu }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</v-content>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      meals: [],
      currentDate: new Date()
    }
  },
  computed: {
    date: function () {
      return this.currentDate.toLocaleDateString('ko-KR') || NaN
    },
    breakfast: function () {
      return this.meals.조식 || []
    },
    lunch: function () {
      return this.meals.중식 || []
    },
    dinner: function () {
      return this.meals.석식 || []
    }
  },
  methods: {
    setToday () {
      this.currentDate = new Date()

      let year = this.currentDate.getFullYear()
      let month = this.currentDate.getMonth() + 1
      let day = this.currentDate.getDate()

      axios
        .get(`http://api.dorothy.gsmhs.kr/school/meal/${year}/${month}/${day}`)
        .then((response) => {
          this.meals = response.data
        })
        .catch(err => console.log(err))
    },
    prev () {
      let prevDate = new Date(this.currentDate)
      prevDate.setDate(this.currentDate.getDate() - 1)
      this.currentDate = prevDate

      let year = this.currentDate.getFullYear()
      let month = this.currentDate.getMonth() + 1
      let day = this.currentDate.getDate()

      axios
        .get(`http://api.dorothy.gsmhs.kr/school/meal/${year}/${month}/${day}`)
        .then((response) => {
          this.meals = response.data
        })
        .catch(err => console.log(err))
    },
    next () {
      let nextDate = new Date(this.currentDate)
      nextDate.setDate(this.currentDate.getDate() + 1)
      this.currentDate = nextDate

      let year = this.currentDate.getFullYear()
      let month = this.currentDate.getMonth() + 1
      let day = this.currentDate.getDate()

      axios
        .get(`http://api.dorothy.gsmhs.kr/school/meal/${year}/${month}/${day}`)
        .then((response) => {
          this.meals = response.data
        })
        .catch(err => console.log(err))
    }
  },
  created () {
    let year = this.currentDate.getFullYear()
    let month = this.currentDate.getMonth() + 1
    let day = this.currentDate.getDate()

    axios
      .get(`http://api.dorothy.gsmhs.kr/school/meal/${year}/${month}/${day}`)
      .then((response) => {
        this.meals = response.data
      })
      .catch(err => console.log(err))
  }
}
</script>
