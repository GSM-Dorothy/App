<template>
<v-content>
  <v-img :src="$vuetify.theme.dark ? require('../assets/night.jpg') : require('../assets/day.jpeg')" height="100vh" gradient="to bottom, rgba(0,0,0,.0), rgba(0,0,0,.1)">
    <v-row align="end" class="lightbox white--text pl-5 fill-height">
      <v-col>
        <span id="clock" class="font-weight-black display-4"></span>
        <span id="seconds" class="font-weight-black display-1 ml-2"></span>
        <p id="date" class="font-weight-black display-2"></p>
      </v-col>
    </v-row>
  </v-img>
</v-content>
</template>

<script>
const week = ['일', '월', '화', '수', '목', '금', '토']

function time () {
  var date = new Date()
  var m = date.getMinutes()
  var s = date.getSeconds()
  document.getElementById('clock').innerHTML = date.getHours() + ':' + (m < 10 ? '0' + m : m)
  document.getElementById('seconds').innerHTML = s < 10 ? '0' + s : s
  document.getElementById('date').innerHTML = date.getMonth() + 1 + '월 ' + date.getDay() + '일 ' + week[date.getDay()] + '요일'
}

setInterval(() => {
  time()
}, 1000)
</script>
