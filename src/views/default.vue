<template>
  <keep-alive>
    <component v-bind:is="view"></component>
  </keep-alive>
</template>

<script>
import signin from '@/views/signin.vue'
import signup from '@/views/signup.vue'
import navigation from '@/views/navigation.vue'

export default {
  data: () => ({
    view: 'signup'
  }),
  components: {
    signin,
    signup,
    navigation
  }
}
</script>
