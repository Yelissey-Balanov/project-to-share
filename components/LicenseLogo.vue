<template>
  <img class="block h-auto" :src="license.logo_url" v-if="license && license.logo_url" />
  <img class="block h-auto" src="~assets/imgs/logo-icon-text.svg" v-else />
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import Vue from 'vue'
import { State } from 'nuxt-property-decorator'
import { StellaLicense } from '~/graphql/GQLTypes'

@Component
export default class LicenseLogo extends Vue {
  @State((state) => state.stella.license)
  license!: Partial<StellaLicense>

  created() {}
}
</script>
