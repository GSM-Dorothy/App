<template>
<v-content>
  <v-container fluid>
    <v-card class="elevation-12 ma-1">
      <v-stepper v-model="e1">
        <v-stepper-header>
          <v-stepper-step :complete="e1 > 1" step="1">학생 조회</v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step :complete="e1 > 2" step="2">수정</v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <v-data-table v-model="selected" :headers="sHeaders" :items="sList" item-key="학번" single-select show-select class="elevation-1">
              <template v-slot:top>
                <v-btn outlined color="primary" @click="selectStudent" class="ma-3">
                  선택
                </v-btn>
              </template>
            </v-data-table>
          </v-stepper-content>

          <v-stepper-content step="2">
            <v-data-table :headers="headers" :items="desserts" sort-by="calories" class="elevation-1">
              <template v-slot:top>
                <v-toolbar flat color="white">
                  <v-toolbar-title>318호 서OO <span class="body-2">2학년 4반 9번</span></v-toolbar-title>
                  <v-divider class="mx-4" inset vertical></v-divider>
                  <v-spacer></v-spacer>
                  <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on }">
                      <v-btn color="primary" dark class="mb-2" v-on="on">점수 추가</v-btn>
                    </template>
                    <v-card>
                      <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                      </v-card-title>

                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field v-model="editedItem.point" label="점수"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="8">
                              <v-text-field v-model="editedItem.reason" label="사유"></v-text-field>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="close">취소</v-btn>
                        <v-btn color="blue darken-1" dark @click="save">저장</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-toolbar>
              </template>
              <template v-slot:item.action="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)">
                  mdi-pencil
                </v-icon>
                <v-icon small @click="deleteItem(item)">
                  mdi-delete
                </v-icon>
              </template>
            </v-data-table>
            <v-btn color="primary" @click="e1 = 1" class="mt-5">
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
  data: () => ({
    selected: [],
    sHeaders: [{
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
      text: '호실',
      value: 'room'
    },
    {
      text: '이름',
      value: 'name'
    }
    ],
    sList: [],
    e1: 0,
    dialog: false,
    headers: [{
      text: '점수',
      value: 'point'
    },
    {
      text: '사유',
      value: 'reason'
    },
    {
      text: '날짜',
      value: 'date'
    },
    {
      text: 'Actions',
      value: 'action',
      sortable: false
    }
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      point: '기존점수',
      reason: '기존사유'
    },
    defaultItem: {
      point: '',
      reason: '',
      date: '지금시간'
    }
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? '점수 추가' : '점수 수정'
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    }
  },

  created () {
    this.initialize()
  },

  methods: {
    selectStudent () {
      this.e1 = 2
    },

    initialize () {
      this.desserts = [{
        point: 10,
        reason: '사유 들어가는 곳',
        date: '2019-12-12'
      }]
    },

    editItem (item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      const index = this.desserts.indexOf(item)
      confirm('이 항목을 정말 삭제하시겠습니까?') && this.desserts.splice(index, 1)
    },

    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem)
      } else {
        this.desserts.push(this.editedItem)
      }
      this.close()
    }
  }
}
</script>
