<template>
<v-content>
  <v-container fluid>
    <v-row>
      <v-spacer></v-spacer>
      <v-col :cols="$vuetify.breakpoint.smAndUp ? '8' : '12'">
        <v-card class="elevation-12 ma-1">
          <v-card-title>
            지문 등록
          </v-card-title>
          <v-card-text align="center">
            <v-btn color="deep-purple accent-4" outlined x-large>인증번호 발급</v-btn>
          </v-card-text>
          <v-card-actions class="body-2">
            지문 등록 인증번호 발급 후 가까운 디바이스를 찾아 인증번호를 입력하여 등록 가능합니다
          </v-card-actions>
        </v-card>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
  </v-container>
</v-content>
</template>

<script>
</script>
