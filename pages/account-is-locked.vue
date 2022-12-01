<template>
  <div class="flex flex-col items-center justify-center min-h-screen pb-20 px-4">
    <LicenseLogo class="w-64 mb-12" />

    <h1 class="mb-6 text-center">Almost there</h1>

    <div class="max-w-md w-full rounded-lg bg-white shadow-md px-8 py-8">
      <p class="text-center">
        We also can't wait to have you on board.
        <br />
        Please have a little patience. <br />
        We're about to unlock your account.
      </p>
    </div>
    <div class="max-w-md w-full mt-4 px-8 flex justify-end">
      <button class="tbtn tbtn--blue" type="button" @click="dispatchLogout">Logout</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import LicenseLogo from '~/components/LicenseLogo.vue'

@Component({
  middleware: 'auth',
  components: { LicenseLogo },
  head() {
    return {
      title: "We're almost there",
    }
  },
})
export default class AccountIsLocked extends Vue {
  dispatchLogout() {
    this.$store.dispatch('account/logout')
  }
}
</script>
