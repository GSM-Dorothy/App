<template>
<v-content>
  <v-container fluid>
    <v-card class="elevation-12 ma-1">
      <v-tabs color="deep-purple accent-4" centered grow>
        <v-tab>등록</v-tab>
        <v-tab>목록</v-tab>

        <v-tab-item>
          <v-tabs color="orange" centered grow>
            <v-tab>학생</v-tab>
            <v-tab>관리자</v-tab>
            <v-tab-item>
              <v-container fluid>
                <v-row>
                  <v-col>
                    <v-form ref="form" v-model="valid" :lazy-validation="lazy">
                      <v-list-item>
                        <v-text-field v-model="name" :rules="defaultRules" :color="$vuetify.theme.dark ? 'white' : 'black'" label="이름" required outlined dense></v-text-field>
                      </v-list-item>
                      <v-list-item>
                        <v-text-field v-model="grade" type="number" :rules="defaultRules" :color="$vuetify.theme.dark ? 'white' : 'black'" label="학년" required outlined dense></v-text-field>
                      </v-list-item>
                      <v-list-item>
                        <v-text-field v-model="classRoom" type="number" :rules="defaultRules" :color="$vuetify.theme.dark ? 'white' : 'black'" label="반" required outlined dense></v-text-field>
                      </v-list-item>
                      <v-list-item>
                        <v-text-field v-model="number" type="number" :rules="defaultRules" :color="$vuetify.theme.dark ? 'white' : 'black'" label="번호" required outlined dense></v-text-field>
                      </v-list-item>
                      <v-list-item>
                        <v-text-field v-model="room" type="number" :rules="defaultRules" :color="$vuetify.theme.dark ? 'white' : 'black'" label="호실" required outlined dense></v-text-field>
                      </v-list-item>
                      <v-list-item>
                        <v-btn :disabled="!valid" :outlined="!valid" color="red" @click="student" width="60" height="60">
                          <v-icon color="white">mdi-arrow-right</v-icon>
                        </v-btn>
                      </v-list-item>
                    </v-form>
                  </v-col>
                </v-row>
              </v-container>
            </v-tab-item>
            <v-tab-item>
              <v-container fluid>
                <v-row>
                  <v-col>
                    <v-form ref="form" v-model="validB" :lazy-validation="lazyB">
                      <v-list-item>
                        <v-text-field v-model="adminName" :rules="defaultRules" :color="$vuetify.theme.dark ? 'white' : 'black'" label="이름" required outlined dense></v-text-field>
                      </v-list-item>
                      <v-list-item>
                        <v-text-field v-model="responsibility" :rules="defaultRules" :color="$vuetify.theme.dark ? 'white' : 'black'" label="담당 업무" required outlined dense></v-text-field>
                      </v-list-item>
                      <v-list-item>
                        <v-btn :disabled="!validB" :outlined="!validB" color="red" @click="admin" width="60" height="60">
                          <v-icon color="white">mdi-arrow-right</v-icon>
                        </v-btn>
                      </v-list-item>
                    </v-form>
                  </v-col>
                </v-row>
              </v-container>
            </v-tab-item>
          </v-tabs>
        </v-tab-item>
        <v-tab-item>
          <v-tabs color="orange" centered grow>
            <v-tab>학생</v-tab>
            <v-tab>관리자</v-tab>
            <v-tab-item>
              <v-container fluid>
                <v-row>
                  <v-col>
                    <v-data-table v-model="selectedStudent" :headers="studentHeaders" :items="students" item-key="code" show-select class="elevation-1">
                      <template v-slot:top>
                        <v-btn
                          outlined
                          color="red"
                          @click="deleteStudentCodes"
                          class="ma-3"
                        >
                          삭제
                        </v-btn>
                      </template>
                    </v-data-table>
                  </v-col>
                </v-row>
              </v-container>
            </v-tab-item>
            <v-tab-item>
              <v-container fluid>
                <v-row>
                  <v-col>
                    <v-data-table v-model="selectedAdmin" :headers="adminHeaders" :items="admins" item-key="code" show-select class="elevation-1">
                      <template v-slot:top>
                        <v-btn
                          outlined
                          color="red"
                          @click="deleteAdminCodes"
                          class="ma-3"
                        >
                          삭제
                        </v-btn>
                      </template>
                    </v-data-table>
                  </v-col>
                </v-row>
              </v-container>
            </v-tab-item>
          </v-tabs>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </v-container>
</v-content>
</template>

<script>
import axios from 'axios'

export default {
  data: () => ({
    selectedStudent: [],
    studentHeaders: [
      {
        text: '이름',
        value: 'userInfo.name'
      },
      {
        text: '학년',
        value: 'userInfo.studentInfo.grade'
      },
      {
        text: '반',
        value: 'userInfo.studentInfo.class'
      },
      {
        text: '번호',
        value: 'userInfo.studentInfo.number'
      },
      {
        text: '호실',
        value: 'userInfo.studentInfo.room'
      },
      {
        text: '인증번호',
        value: 'code'
      }
    ],
    students: [],
    selectedAdmin: [],
    adminHeaders: [{
      text: '이름',
      value: 'userInfo.name'
    },
    {
      text: '담당 업무',
      value: 'userInfo.administratorInfo.responsibility'
    },
    {
      text: '인증번호',
      value: 'code'
    }
    ],
    admins: [],
    valid: true,
    lazy: false,
    validB: true,
    lazyB: false,
    name: '',
    grade: '',
    classRoom: '',
    number: '',
    room: '',
    adminName: '',
    responsibility: '',
    defaultRules: [
      v => !!v || ''
    ]
  }),
  methods: {
    student () {
      const name = this.name
      const grade = this.grade
      const classRoom = this.classRoom
      const number = this.number
      const room = this.room

      if (!name || !grade || !classRoom || !number || !room) {
        return false
      }

      axios.post('http://api.dorothy.gsmhs.kr/auth/code/student', {
        name: name,
        grade: grade,
        class: classRoom,
        number: number,
        room: room
      })
        .then(res => {
          if (res.status === 200) {
            alert('인증번호 ' + res.data.code)
            this.$router.go(0)
          }
        })
    },
    admin () {
      const adminName = this.adminName
      const responsibility = this.responsibility

      if (!adminName || !responsibility) {
        return false
      }

      axios.post('http://api.dorothy.gsmhs.kr/auth/code/administrator', {
        name: adminName,
        responsibility: responsibility
      })
        .then(res => {
          if (res.status === 200) {
            alert('인증번호 ' + res.data.code)
            this.$router.go(0)
          }
        })
    },
    getStudentCode: function () {
      return new Promise((resolve) => {
        axios
          .get(`http://api.dorothy.gsmhs.kr/auth/code/student`)
          .then(response => {
            resolve(response.data)
          })
          .catch(err => {
            console.log(err)
            resolve(this.getStudentCode()
              .then(data => {
                return data
              }))
          })
      })
    },
    getAdminCode: function () {
      return new Promise((resolve) => {
        axios
          .get(`http://api.dorothy.gsmhs.kr/auth/code/administrator`)
          .then(response => {
            resolve(response.data)
          })
          .catch(err => {
            console.log(err)
            resolve(this.getAdminCode()
              .then(data => {
                return data
              }))
          })
      })
    },
    deleteStudentCodes: function () {
      let deletes = this.selectedStudent
        .map(student => student.code)

      axios
        .delete(`http://api.dorothy.gsmhs.kr/auth/code`, { data: deletes })
        .then(response => {
          this.students = this.students
            .filter(student => !this.selectedStudent.includes(student))

          this.selectedStudent = []
        })
        .catch(err => {
          console.log(err)
        })
    },
    deleteAdminCodes: function () {
      let deletes = this.selectedAdmin
        .map(admin => admin.code)

      axios
        .delete(`http://api.dorothy.gsmhs.kr/auth/code`, { data: deletes })
        .then(response => {
          this.admins = this.admins
            .filter(admin => !this.selectedAdmin.includes(admin))

          this.selectedAdmin = []
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  async created () {
    this.$nextTick(() => {
      this.getStudentCode()
        .then(data => {
          this.students = data
        })

      this.getAdminCode()
        .then(data => {
          this.admins = data
        })
    })
  }
}
</script>
