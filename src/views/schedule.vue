<template>
<v-content>
  <v-container fluid class="hidden-sm-and-down">
    <v-card flat class="elevation-12 ma-1 mb-3 pa-1">
      <v-card-actions>
        <v-btn outlined class="mr-3" @click="setToday">
          Today
        </v-btn>
        <v-btn fab text small @click="prev">
          <v-icon small>mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn fab text small @click="next" class="mr-3">
          <v-icon small>mdi-chevron-right</v-icon>
        </v-btn>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
      </v-card-actions>
    </v-card>
    <v-card class="elevation-12 ma-1" height="85vh">
      <v-calendar ref="calendar" v-model="focus" color="primary" :events="events" :event-color="getEventColor" :event-margin-bottom="3" :now="today" :type="type" @change="getEvents">
      </v-calendar>
    </v-card>
  </v-container>
  <v-container fluid class="hidden-md-and-up">
    <v-card flat class="elevation-12 ma-1 mb-3 pa-1">
      <v-card-actions>
        <div>
          <v-timeline dense>
            <v-timeline-item v-for="n in 2" :key="n" fill-dot :small="n.today">
              <span slot="opposite">Tus eu perfecto</span>
              <v-card class="elevation-2">
                <v-card-title class="headline">Lorem ipsum</v-card-title>
                <v-card-text>
                  Lorem ipsum dolor sit amet, no nam oblique veritus. Commune scaevola imperdiet nec ut, sed euismod convenire principes at. Est et nobis iisque percipit, an vim zril disputando voluptatibus, vix an salutandi sententiae.
                </v-card-text>
              </v-card>
            </v-timeline-item>
          </v-timeline>
        </div>
      </v-card-actions>
    </v-card>
  </v-container>
</v-content>
</template>

<script>
import axios from 'axios'

var today = new Date().toISOString().substr(0, 10)

export default {
  data: () => ({
    today: today,
    focus: today,
    type: 'month',
    start: null,
    end: null,
    events: [],
    colors: ['blue', 'indigo', 'deep-purple', 'teal', 'orange', 'yellow darken-2', 'light-green', 'pink', 'red']
  }),
  computed: {
    title () {
      const {
        start,
        end
      } = this
      if (!start || !end) {
        return ''
      }

      const startMonth = this.monthFormatter(start)
      const endMonth = this.monthFormatter(end)
      const suffixMonth = startMonth === endMonth ? '' : endMonth

      const startYear = start.year + '년'
      const endYear = end.year + '년'
      const suffixYear = startYear === endYear ? '' : endYear

      const startDay = start.day + '일'
      const endDay = end.day + '일'

      switch (this.type) {
        case 'month':
          return `${startYear} ${startMonth}`
        case '4day':
          return `${startYear} ${startMonth} ${startDay} - ${suffixYear} ${suffixMonth} ${endDay}`
      }
      return ''
    },
    monthFormatter () {
      return this.$refs.calendar.getFormatter({
        timeZone: 'UTC',
        month: 'long'
      })
    }
  },
  mounted () {
    this.$refs.calendar.checkChange()
  },
  methods: {
    getEventColor (event) {
      return event.color
    },
    setToday () {
      this.focus = this.today
    },
    prev () {
      this.$refs.calendar.prev()
    },
    next () {
      this.$refs.calendar.next()
    },
    getEvents ({ start, end }) {
      this.start = start
      this.end = end
      this.events = []

      let year = this.start.year
      let month = this.start.month

      axios
        .get(`http://api.dorothy.gsmhs.kr/school/schedule/${year}/${month}`)
        .then((response) => {
          let events = {}
          let schedules = response.data

          Object.keys(schedules)
            .map(date => schedules[date]
              .filter(schedule => schedule)
              .map(schedule => {
                events[schedule] = {
                  name: events[schedule] ? events[schedule].name : schedule,
                  start: events[schedule] ? events[schedule].start : date,
                  end: date,
                  color: events[schedule] ? events[schedule].color : this.random(this.colors)
                }
              }))

          this.events = Object.values(events)
        })
        .catch(err => console.log(err))
    },
    random (array) {
      return array[Math.floor(array.length * Math.random())]
    }
  }
}
</script>
