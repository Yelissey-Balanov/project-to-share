<template>
  <div class="flex justify-center items-center flex-col min-h-screen text-center px-12 py-0">
    <h1 class="font-light">
      <template v-if="error.statusCode === 503">
        Stella is under maintenance!<br />
        Please visit again in few hours later.
      </template>
      <template v-else-if="error.statusCode === 498">
        Your license is deactivated!<br />
        Please contact us to reactivate it again.
      </template>
      <template v-else-if="error.statusCode === 497"> There is no license for this domain registered! </template>
      <template v-else-if="error.statusCode === 404"> Page not found </template>
      <template v-else-if="error.statusCode === 401">
        <template v-if="error.message">
          {{ error.message }}
        </template>
        <template v-else> You are not authorized to access this page </template>
      </template>
      <template v-else> An error occurred </template>
    </h1>
    <nuxt-link to="/" v-if="error.statusCode !== 503 && error.statusCode !== 498 && error.statusCode !== 497"
      >Go to start page</nuxt-link
    >

    <client-only>
      <NotificationsWrapper />
    </client-only>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import NotificationsWrapper from '~/components/NotificationsWrapper.vue'

@Component({
  components: { NotificationsWrapper },
  head: {
    title: 'Error',
  },
})
export default class ErrorPage extends Vue {
  @Prop()
  error: any
}
</script>
