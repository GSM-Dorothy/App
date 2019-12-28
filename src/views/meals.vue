<template>
<v-content>
  <v-container fluid>
    <v-row dense>
      <v-col v-for="title in Object.keys(posts)" :key="title" :cols="4">
        <v-card class="elevation-12 ma-3">
          <v-card-text>
            <p class="display-1 text--primary">
              {{title}}
            </p>
            <div class="text--primary" v-for="menu in posts[title]" :key="menu">
              {{menu}}
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
      posts: []
    }
  },
  created () {
    axios.get('http://api.dorothy.gsmhs.kr/school/meal/2019/12/27').then((response) => {
      this.posts = response.data
    })
  }
}
</script>
