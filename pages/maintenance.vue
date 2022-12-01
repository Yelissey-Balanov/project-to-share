<template>
  <div class="min-h-screen flex-col flex items-center justify-center">
    <IHCog class="w-20 h-20 mb-8" />

    <h1 class="text-5xl">We are under maintenance</h1>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import IHCog from '~/components/globals/icons/heroicons/IHCog.vue'
import LicenseLogo from '~/components/LicenseLogo.vue'

@Component({
  components: { LicenseLogo, IHCog },
  head: {
    title: 'Maintenance',
  },
  middleware: ({ redirect, store }) => {
    if (!store.state.isUnderMaintenance) {
      return redirect(302, '/')
    }
  },
})
export default class Maintenance extends Vue {}
</script>
