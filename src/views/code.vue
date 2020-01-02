<template>
<v-content>
  <v-container fluid>
    <v-card class="elevation-12 ma-1">
      <v-tabs color="deep-purple accent-4" centered grow>
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
                    <v-text-field v-model="responibility" :rules="defaultRules" :color="$vuetify.theme.dark ? 'white' : 'black'" label="담당 업무" required outlined dense></v-text-field>
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
    </v-card>
  </v-container>
</v-content>
</template>

<script>
import axios from 'axios'

export default {
  data: () => ({
    valid: true,
    lazy: false,
    validB: true,
    lazyB: false,
    name: '',
    grade: '',
    classRoom: '',
    number: '',
    adminName: '',
    responibility: '',
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

      if (!name || !grade || !classRoom || !number) {
        return false
      }

      axios.post('http://api.dorothy.gsmhs.kr/auth/code/student', {
        name: name,
        grade: grade,
        class: classRoom,
        number: number
      })
        .then(res => {
          if (res.status === 200) {
            alert(res.data.code)
            this.$router.push('/admin/code/list')
          }
        })
    },
    admin () {
      const adminName = this.adminName
      const responibility = this.responibility

      if (!adminName || !responibility) {
        return false
      }

      axios.post('http://api.dorothy.gsmhs.kr/auth/code/administrator', {
        name: adminName,
        responibility: responibility
      })
        .then(res => {
          if (res.status === 200) {
            alert(res.data.code)
            this.$router.push('/admin/code/list')
          }
        })
    }
  }
}
</script>
