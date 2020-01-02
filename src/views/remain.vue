<template>
<v-content>
  <v-container fluid>
    <v-row>
      <v-col :cols="$vuetify.breakpoint.smAndUp ? '6' : '12'">
        <v-card class="elevation-12 ma-1">
          <v-card-text>
            <p class="text--primary">
              현재 담당선생님
            </p>
            <p class="display-1 text--primary">
              장재원 선생님
            </p>
            <p class="text--primary">
              010-1234-5678
            </p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col :cols="$vuetify.breakpoint.smAndUp ? '6' : '12'">
        <v-card class="elevation-12 ma-1">
          <v-card-text>
            <p class="text--primary">
              다음 담당선생님
            </p>
            <p class="display-1 text--primary">
              사감 선생님
            </p>
            <p class="text--primary">
              010-1234-5678
            </p>
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
                    <v-img :src="card.src" @click="e1 = 2" class="white--text align-end" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" height="200px">
                      <v-card-title v-text="card.title"></v-card-title>
                    </v-img>
                  </v-card>
                </v-col>
              </v-row>
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
    </v-card>
  </v-container>
</v-content>
</template>

<script>
export default {
  data () {
    return {
      cards: [{
        title: '호실',
        src: 'https://cdn.vuetifyjs.com/images/cards/docks.jpg',
        flex: 4
      },
      {
        title: '외출',
        src: 'https://cdn.vuetifyjs.com/images/cards/docks.jpg',
        flex: 4
      },
      {
        title: '외박',
        src: 'https://cdn.vuetifyjs.com/images/cards/docks.jpg',
        flex: 4
      }
      ],
      e1: 0,
      start: null,
      end: null
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
      if (this.end != null) {
        this.e1 = 3
      }
    },
    allowedStep: m => m % 5 === 0
  }
}
</script>
