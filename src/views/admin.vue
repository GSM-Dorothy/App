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
        <v-list-item-group v-model="item" color="primary">
          <v-list-item v-for="(item, i) in items" :key="i" :to="item.link">
            <v-list-item-icon>
              <v-btn color="primary" tag fab elevation=12 :small="$vuetify.breakpoint.smAndUp" :x-small="$vuetify.breakpoint.xsOnly">
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
      text: '인증번호',
      icon: 'mdi-barcode',
      link: '/admin/code'
    },
    {
      text: '잔류 담당',
      icon: 'mdi-account-details',
      link: '/admin/remain'
    },
    {
      text: '잔류 관리',
      icon: 'mdi-account-check',
      link: '/admin/member'
    },
    {
      text: '디바이스',
      icon: 'mdi-tablet',
      link: '/admin/device'
    }
    ]
  })
}
</script>
