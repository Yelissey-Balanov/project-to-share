<template>
  <div class="">
    <nuxt />

    <client-only>
      <NotificationsWrapper />
    </client-only>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import NotificationsWrapper from '~/components/NotificationsWrapper.vue'

@Component({
  components: { NotificationsWrapper },
})
export default class App extends Vue {}
</script>
