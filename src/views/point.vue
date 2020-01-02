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
              31점
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
              36점
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
              -5점
            </p>
          </v-card-text>
          </v-img>
        </v-card>
      </v-col>
    </v-row>
    <v-card class="elevation-12 ma-1">
      <v-data-table :items-per-page="5" :headers="headers" :items="desserts"></v-data-table>
    </v-card>
  </v-container>
</v-content>
</template>

<script>
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
        value: 'log'
      }
      ],
      desserts: [{
        date: '2019-12-12',
        point: -12,
        log: '사유'
      },
      {
        date: '2019-12-11',
        point: 11,
        log: '사유'
      },
      {
        date: '2019-12-09',
        point: -10,
        log: '사유'
      }
      ]
    }
  }
}
</script>
