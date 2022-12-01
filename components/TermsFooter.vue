<template>
  <div class="h-12 border-t bg-gray-100 border-gray-300">
    <ul class="flex items-center justify-center h-full space-x-8">
      <template v-if="useNuxtLink">
        <li>
          <nuxt-link to="/impressum">Impressum</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/terms-privacy">Datenschutz</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/terms-of-use">Nutzungsbedingungen</nuxt-link>
        </li>
        <client-only>
          <li v-if="!forceHideAGB && isAGBAccessible">
            <nuxt-link to="/terms-of-service">AGB</nuxt-link>
          </li>
        </client-only>
      </template>
      <template v-else>
        <li>
          <a target="_blank" href="/impressum">Impressum</a>
        </li>
        <li>
          <a target="_blank" href="/terms-privacy">Datenschutz</a>
        </li>
        <li>
          <a target="_blank" href="/terms-of-use">Nutzungsbedingungen</a>
        </li>
        <client-only>
          <li v-if="!forceHideAGB && isAGBAccessible">
            <a target="_blank" href="/terms-of-service">AGB</a>
          </li>
        </client-only>
      </template>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import Vue from 'vue'
import { State } from 'vuex-class'
import haveAccessToTermsOfService from '~/helpers/haveAccessToTermsOfService'

@Component
export default class TermsFooter extends Vue {
  @Prop({ default: true })
  useNuxtLink!: boolean

  @Prop({ default: false })
  forceHideAGB!: boolean

  @State((state) => state.account.user)
  accountUser

  get isAGBAccessible() {
    return haveAccessToTermsOfService(this.accountUser)
  }
}
</script>
