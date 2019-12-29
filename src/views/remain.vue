<template>
<v-content>
  <v-container fluid>
    <v-row>
      <v-col cols=6>
        <v-card class="elevation-12 ma-3">
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
      <v-col cols=6>
        <v-card class="elevation-12 ma-3">
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
    <v-card class="elevation-12 ma-3">
      <v-tabs color="deep-purple accent-4" centered grow>
        <v-tab>호실</v-tab>
        <v-tab>외출</v-tab>
        <v-tab>외박</v-tab>

        <v-tab-item>
          <v-container fluid>
            <v-row>
              <v-col>
                <v-time-picker v-model="time" :landscape="$vuetify.breakpoint.smAndUp" :allowed-minutes="allowedStep" ampm-in-title scrollable></v-time-picker>
              </v-col>
            </v-row>
          </v-container>
        </v-tab-item>
        <v-tab-item>
          <v-container fluid>
            <v-row>
              <v-col>
                <v-time-picker v-model="time" :landscape="$vuetify.breakpoint.smAndUp" :allowed-minutes="allowedStep" ampm-in-title scrollable></v-time-picker>
              </v-col>
            </v-row>
          </v-container>
        </v-tab-item>
        <v-tab-item>
          <v-container fluid>
            <v-row>
              <v-col>
                <v-time-picker v-model="time" :landscape="$vuetify.breakpoint.smAndUp" :allowed-minutes="allowedStep" ampm-in-title scrollable></v-time-picker>
              </v-col>
            </v-row>
          </v-container>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </v-container>
</v-content>
</template>

<script>
export default {
  data () {
    return {
      time: '13:10'
    }
  },
  methods: {
    allowedStep: m => m % 5 === 0
  }
}
</script>
