<template>
<v-app>
  <v-navigation-drawer app floating permanent touchless :mini-variant="$vuetify.breakpoint.xsOnly">
    <template #prepend>
      <v-list two-line>
        <v-list-item>
          <v-img contain height="24" :src="$vuetify.theme.dark ? require('../assets/Dorothy.dark.svg') : require('../assets/Dorothy.svg')">
          </v-img>
        </v-list-item>
        <v-list-item>
        </v-list-item>
        <v-list-item>
        </v-list-item>
      </v-list>
    </template>
    <template>
      <v-list flat>
        <v-list-item-group v-model="item">
          <v-list-item v-for="(item, i) in items" :key="i" :to="item.link" :color="item.color">
            <v-list-item-icon>
              <v-btn :color="item.color" dark tag fab elevation=12 :small="$vuetify.breakpoint.smAndUp" :x-small="$vuetify.breakpoint.xsOnly">
                <v-icon v-text="item.icon"></v-icon>
              </v-btn>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </template>
  </v-navigation-drawer>
  <router-view></router-view>
</v-app>
</template>

<script>
export default {
  data: () => ({
    item: 1,
    items: [{
      text: '급식',
      icon: 'mdi-noodles',
      link: '/meals',
      color: 'orange'
    },
    {
      text: '학사일정',
      icon: 'mdi-calendar-today',
      link: '/schedule',
      color: 'light-green'
    },
    {
      text: '상벌점',
      icon: 'mdi-counter',
      link: '/point',
      color: 'deep-orange'
    },
    {
      text: '잔류',
      icon: 'mdi-home',
      link: '/remain',
      color: 'light-blue'
    },
    {
      text: '지문',
      icon: 'mdi-fingerprint',
      link: '/fingerprint',
      color: 'deep-purple accent-4'
    }
    ]
  })
}
</script>
