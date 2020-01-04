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
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        </v-card-actions>
      </v-card>
    </v-sheet>
    <v-row>
      <v-col v-for="title in Object.keys(posts)" :key="title" :cols="$vuetify.breakpoint.smAndUp ? '4' : '12'">
        <v-card class="elevation-12 ma-1">
          <v-card-text>
            <p class="display-1 font-weight-regular text--primary">
              {{ title }}
            </p>
            <p v-if="!posts[title].length">오늘의 {{ title }}은 없습니다.</p>
            <div v-else class="text--primary" v-for="menu in posts[title]" :key="menu">
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
  data: () => ({
    posts: [],
    day: new Date(),
    title: ''
  }),
  created () {
    this.title = this.day.getFullYear() + '년 ' + (this.day.getMonth() + 1) + '월 ' + this.day.getDate() + '일'
    var get = 'http://api.dorothy.gsmhs.kr/school/meal/' + this.day.getFullYear() + '/' + (this.day.getMonth() + 1) + '/' + this.day.getDate()
    axios.get(get).then((response) => {
      this.posts = response.data
    })
  },
  methods: {
    setToday () {
      this.day = new Date()
      this.title = this.day.getFullYear() + '년 ' + (this.day.getMonth() + 1) + '월 ' + this.day.getDate() + '일'
      var get = 'http://api.dorothy.gsmhs.kr/school/meal/' + this.day.getFullYear() + '/' + (this.day.getMonth() + 1) + '/' + this.day.getDate()
      axios.get(get).then((response) => {
        this.posts = response.data
      })
    },
    prev () {
      this.day.setDate(this.day.getDate() - 1)
      this.title = this.day.getFullYear() + '년 ' + (this.day.getMonth() + 1) + '월 ' + this.day.getDate() + '일'
      var get = 'http://api.dorothy.gsmhs.kr/school/meal/' + this.day.getFullYear() + '/' + (this.day.getMonth() + 1) + '/' + this.day.getDate()
      axios.get(get).then((response) => {
        this.posts = response.data
      })
    },
    next () {
      this.day.setDate(this.day.getDate() + 1)
      this.title = this.day.getFullYear() + '년 ' + (this.day.getMonth() + 1) + '월 ' + this.day.getDate() + '일'
      var get = 'http://api.dorothy.gsmhs.kr/school/meal/' + this.day.getFullYear() + '/' + (this.day.getMonth() + 1) + '/' + this.day.getDate()
      axios.get(get).then((response) => {
        this.posts = response.data
      })
    }
  }
}
</script>
