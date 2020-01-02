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
              15명
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
              9명
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
            <v-data-table :headers="headersList" :items="dessertsList"></v-data-table>
          </v-container>
        </v-tab-item>
        <v-tab-item>
          <v-container fluid>
            <v-data-table :headers="headersSTUDYING" :items="dessertsSTUDYING"></v-data-table>
          </v-container>
        </v-tab-item>
        <v-tab-item>
          <v-container fluid>
            <v-data-table :headers="headersSTAYING_OUT" :items="dessertsSTAYING_OUT"></v-data-table>
          </v-container>
        </v-tab-item>
        <v-tab-item>
          <v-container fluid>
            <v-data-table :headers="headersLEFT" :items="dessertsLEFT"></v-data-table>
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
      headersList: [{
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
      dessertsList: [{
        grade: 2,
        class: 3,
        number: 9,
        name: '가나다'
      },
      {
        grade: 2,
        class: 4,
        number: 4,
        name: '라마바'
      },
      {
        grade: 2,
        class: 1,
        number: 3,
        name: '사아자'
      }
      ],
      headersSTUDYING: [{
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
      dessertsSTUDYING: [{
        grade: 2,
        class: 3,
        number: 9,
        name: '가나다'
      },
      {
        grade: 2,
        class: 4,
        number: 4,
        name: '라마바'
      },
      {
        grade: 2,
        class: 1,
        number: 3,
        name: '사아자'
      }
      ],
      headersSTAYING_OUT: [{
        text: '복귀 시간',
        value: 'end'
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
      dessertsSTAYING_OUT: [{
        end: '11시 30분',
        room: 301,
        grade: 2,
        class: 3,
        number: 9,
        name: '가나다'
      },
      {
        end: '13시 30분',
        room: 302,
        grade: 2,
        class: 4,
        number: 4,
        name: '라마바'
      },
      {
        end: '14시 30분',
        room: 411,
        grade: 2,
        class: 1,
        number: 3,
        name: '사아자'
      }
      ],
      headersLEFT: [{
        text: '복귀 시간',
        value: 'end'
      },
      {
        text: '사유',
        value: 'log'
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
      dessertsLEFT: [{
        end: '11시 30분',
        log: '사유',
        grade: 2,
        class: 3,
        number: 9,
        name: '가나다'
      },
      {
        end: '13시 30분',
        log: '사유',
        grade: 2,
        class: 4,
        number: 4,
        name: '라마바'
      },
      {
        end: '14시 30분',
        log: '사유',
        grade: 2,
        class: 1,
        number: 3,
        name: '사아자'
      }
      ]
    }
  }
}
</script>
