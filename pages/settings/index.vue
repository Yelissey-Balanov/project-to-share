<template>
  <div class="container pt-5">
    <PageHeader item-title="settings" item-type="employee" :available-buttons="[]" />
    <div class="my-6 grid grid-cols-2 gap-x-6">
      <FInput
        v-model="reportReadyToInvoiceRevenueTo"
        label="Email for reporting ready to invoice revenues"
        rules="email"
      />
    </div>
    <div class="flex justify-start">
      <button class="tbtn tbtn--blue" type="button" @click="save()">Save</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  GetSettingsQuery,
  Maybe,
  SetSettingsMutation,
  SetSettingsMutationVariables,
  UserRole,
} from '~/graphql/GQLTypes'
import GetSettings from '~/graphql/ressources/settings/GetSettings.gql'
import SetSettings from '~/graphql/ressources/settings/SetSettings.gql'
import { apolloParseErrors } from '~/helpers/apolloParseErrors'
import PageHeader from '~/components/pages/PageHeader.vue'

@Component({
  components: { PageHeader },
  head() {
    return {
      title: 'Settings',
    }
  },
  middleware: 'auth',
  meta: {
    requiredRole: UserRole.Admin,
  },
})
export default class Settings extends Vue {
  reportReadyToInvoiceRevenueTo: Maybe<string> = null

  fetch() {
    return this.$apollo
      .query<GetSettingsQuery>({
        query: GetSettings,
      })
      .then(({ data }) => {
        this.reportReadyToInvoiceRevenueTo = data.reportReadyToInvoiceRevenueTo?.value
      })
  }

  save() {
    this.$apollo
      .mutate<SetSettingsMutation>({
        mutation: SetSettings,
        variables: {
          reportReadyToInvoiceRevenueTo: this.reportReadyToInvoiceRevenueTo,
        } as SetSettingsMutationVariables,
      })
      .then(({ data }) => {
        this.$bus.showSuccessModal('Settings were successfully stored', 3000)
      })
      .catch((err) => {
        this.$bus.showErrorModal({
          errors: apolloParseErrors(err),
        })
      })
  }
}
</script>
