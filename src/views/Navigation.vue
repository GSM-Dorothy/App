<template>
  <v-navigation-drawer
    app
    floating
    permanent
    touchless
    :mini-variant="$vuetify.breakpoint.xsOnly"
  >
    <template #prepend>
      <v-list two-line >
        <v-list-item>
          <v-img
            contain
            height="24"
            :src="$vuetify.theme.dark ? require('../assets/Dorothy.dark.svg') : require('../assets/Dorothy.svg')"
          >
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
        <v-list-item-group v-model="item" color="primary">
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :to="item.link"
          >
            <v-list-item-icon>
              <v-btn color="primary"
                tag
                fab
                outlined
                elevation=6
                :small="$vuetify.breakpoint.smAndUp"
                :x-small="$vuetify.breakpoint.xsOnly"
              >
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
</template>

<script>
export default {
  data: () => ({
    item: 1,
    items: [
      { text: '급식', icon: 'mdi-clock', link: '/meals' },
      { text: '세탁기', icon: 'mdi-account', link: '/washer' },
      { text: '학사일정', icon: 'mdi-clock', link: '/schedule' },
      { text: '상벌점', icon: 'mdi-account', link: '/point' }
    ]
  })
}
</script>
