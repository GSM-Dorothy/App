<template>
<v-content>
  <v-container fluid>
    <v-row>
      <v-col :cols="$vuetify.breakpoint.smAndUp ? '4' : '12'">
        <v-card class="elevation-12 ma-1">
          <v-card-text>
            <p class="green--text">
              상점
            </p>
            <p class="display-1 text--primary">
              {{ plusPoint }}점
            </p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col :cols="$vuetify.breakpoint.smAndUp ? '4' : '12'">
        <v-card class="elevation-12 ma-1">
          <v-card-text>
            <p class="red--text">
              벌점
            </p>
            <p class="display-1 text--primary">
              {{ minusPoint }}점
            </p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col :cols="$vuetify.breakpoint.smAndUp ? '4' : '12'">
        <v-card class="elevation-12 ma-1">
          <v-img src="hana" class="white--text" gradient="to top right, rgba(255,0,0,.6), rgba(0,0,255,.6)">
            <v-card-text>
            <p>
              합산
            </p>
            <p class="display-1">
              {{ totalPoint }}점
            </p>
          </v-card-text>
          </v-img>
        </v-card>
      </v-col>
    </v-row>
    <v-card class="elevation-12 ma-1">
      <v-data-table :items-per-page="5" :headers="headers" :items="archives"></v-data-table>
    </v-card>
  </v-container>
</v-content>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      headers: [{
        text: '날짜',
        value: 'date'
      },
      {
        text: '점수',
        value: 'point'
      },
      {
        text: '사유',
        value: 'reason'
      }
      ],
      archives: []
    }
  },
  computed: {
    plusPoint: function () {
      return this.archives
        .map(archive => archive.point)
        .filter(point => point > 0)
        .reduce((a, b) => a + b, 0)
    },
    minusPoint: function () {
      return this.archives
        .map(archive => archive.point)
        .filter(point => point < 0)
        .reduce((a, b) => a + b, 0)
    },
    totalPoint: function () {
      return this.archives
        .map(archive => archive.point)
        .reduce((a, b) => a + b, 0)
    }
  },
  created () {
    axios
      .get(`http://api.dorothy.gsmhs.kr/user/point_archive`)
      .then(response => {
        this.archives = response.data
      })
      .catch(err => console.log(err))
  }
}
</script>
