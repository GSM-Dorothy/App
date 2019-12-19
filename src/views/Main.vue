<template>
  <v-app id="sandbox">
    <v-navigation-drawer
      v-model="Drawer.model"
      :permanent="Drawer.type === 'permanent'"
      :temporary="Drawer.type === 'temporary'"
      floating=true
      app
      overflow
      touchless
      mobile-break-point=800
    >

    <v-list dense three-line>
      <v-list-item>
        <v-img
          :src="require('../assets/Dorothy.svg')"
          class="mx-auto"
          contain
          height="30"
        ></v-img>
      </v-list-item>
    </v-list>

      <v-list dense rounded>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-settings</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    Drawer: {
      model: null,
      type: 'Permanent',
      floating: true
    }
  })
}
</script>
