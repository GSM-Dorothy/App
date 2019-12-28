<template>
<v-content>
  <v-container fluid>
    <v-card class="elevation-12 ma-3">
      <v-row class="fill-height">
        <v-col>
          <v-sheet>
            <v-toolbar flat>
              <v-btn outlined class="mr-4" @click="setToday">
                Today
              </v-btn>
              <v-btn fab text small @click="prev">
                <v-icon small>mdi-chevron-left</v-icon>
              </v-btn>
              <v-btn fab text small @click="next">
                <v-icon small>mdi-chevron-right</v-icon>
              </v-btn>
              <v-toolbar-title>{{ title }}</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
          </v-sheet>
          <v-sheet height="75vh">
            <v-calendar
              ref="calendar"
              v-model="focus"
              color="primary"
              :events="events"
              :event-color="getEventColor"
              :event-margin-bottom="3"
              :now="today"
              :type="type"
              @change="updateRange"
            >
            </v-calendar>
          </v-sheet>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</v-content>
</template>

<script>
var date = new Date()
var today = date.getFullYear() + date.getMonth() + date.getDate()
export default {
  data: () => ({
    today: today,
    focus: today,
    type: 'month',
    start: null,
    end: null,
    events: [{
      name: 'Vacation',
      details: 'Going to the beach!',
      start: '2019-12-28',
      end: '2019-12-29',
      color: 'blue'
    }]
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
    updateRange ({
      start,
      end
    }) {
      this.start = start
      this.end = end
    }
  }
}
</script>
