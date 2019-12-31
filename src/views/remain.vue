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
          <v-stepper-step :editable="e1 > 1" :complete="e1 > 1" step="1">선택1</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step :editable="e1 > 2" :complete="e1 > 2" step="2">선택2</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step step="3">선택3</v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <v-btn color="primary" @click="e1 = 2">
              계속
            </v-btn>
          </v-stepper-content>

          <v-stepper-content step="2">
            <v-btn color="primary" @click="e1 = 3">
              계속
            </v-btn>
          </v-stepper-content>

          <v-stepper-content step="3">
            <v-btn color="primary" @click="1">
              확인
            </v-btn>
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
      e1: 0,
      time: '13:10'
    }
  },
  methods: {
    allowedStep: m => m % 5 === 0
  }
}
</script>
