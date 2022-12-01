<template>
  <tr class="group">
    <td class="px-3 py-3 text-center relative">
      <span class="absolute left-0 top-0 bottom-0 w-0.5" :class="stripeClass"></span>

      <div class="text-base">{{ (revenue.amount / 100) | currency }}</div>
      <div class="text-gray-500">{{ revenue.month | wordForMonth }} {{ revenue.year }}</div>
    </td>
    <td class="px-3 py-3">
      <div class="flex flex-col space-y-1 items-start">
        <span class="tbadge">
          {{ revenue.type | replaceUnderscoreWithSpace }}
        </span>
        <span class="tbadge" :class="stageBadgeClass">{{ revenue.stage | replaceUnderscoreWithSpace }}</span>
      </div>
    </td>
    <td class="px-3 py-3"></td>
    <td class="pl-4 pr-3 py-3 w-9 relative">
      <div class="flex space-x-2 items-center">
        <div class="flex flex-col" v-for="revenue_user in revenue.revenue_users" :key="revenue_user.id">
          <LImg
            class="flex-none flex items-center justify-center bg-blue-100 ring-white ring-1 text-blue-600 w-12 h-12 rounded-full overflow-hidden"
            v-tooltip="`${revenue_user.percent}% | ${revenue_user.user.firstname} ${revenue_user.user.lastname}`"
            :image="revenue_user.user.foto ? revenue_user.user.foto.sizes.PROFILE_IMAGE : null"
            v-if="revenue_user.user"
          >
            {{ revenue_user.user.firstname.substr(0, 1) }}{{ revenue_user.user.lastname.substr(0, 1) }}
          </LImg>
          <span class="mt-1 text-center text-gray-500">{{ revenue_user.percent }}%</span>
        </div>
      </div>
    </td>
    <td class="px-4 py-3">
      <div
        class="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition duration-200 ease-in-out"
      >
        <template v-if="isEditable">
          <button type="button" class="tbtn-icon tbtn-icon--small tbtn--white" @click="openInvoiceRecipientModal">
            <IHEye class="w-5 h-5" />
          </button>
          <button type="button" class="tbtn-icon tbtn-icon--small tbtn--white" @click="editRevenue">
            <IHPencil class="w-5 h-5" />
          </button>
          <button type="button" class="tbtn-icon tbtn-icon--small tbtn--red" @click="deleteRevenue">
            <IHDelete class="w-5 h-5" />
          </button>
        </template>
      </div>
    </td>
  </tr>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import Vue from 'vue'
import IHPencil from '~/components/globals/icons/heroicons/IHPencil.vue'
import IHDelete from '~/components/globals/icons/heroicons/IHDelete.vue'
import { DeleteRevenueMutationVariables, RevenueFragment, RevenueStage } from '~/graphql/GQLTypes'
import DeleteRevenue from '~/graphql/ressources/revenues/DeleteRevenue.gql'
import { apolloParseErrors } from '~/helpers/apolloParseErrors'
import IHUserFilled from '~/components/globals/icons/heroicons/IHUserFilled.vue'
import IHEye from '~/components/globals/icons/heroicons/IHEye.vue'
import { namespace, State } from 'nuxt-property-decorator'

@Component({
  components: { IHEye, IHUserFilled, IHDelete, IHPencil },
})
export default class RevenueTableRow extends Vue {
  @Prop()
  revenue!: RevenueFragment

  @(namespace('account').Getter('isRevenueManager'))
  isRevenueManager!: boolean

  @(namespace('account').Getter('isAdmin'))
  isAdmin!: boolean

  get isEditable() {
    return (
      (this.revenue &&
        this.$store.state.account.user &&
        this.revenue.author_id === this.$store.state.account.user.id) ||
      this.isRevenueManager ||
      this.isAdmin
    )
  }

  get stripeClass() {
    switch (this.revenue.stage) {
      case RevenueStage.PendingOrCancelled:
        return 'bg-yellow-500'
      case RevenueStage.Forecast:
        return 'bg-blue-500'
      case RevenueStage.ReadyToInvoice:
        return 'bg-green-500'
      case RevenueStage.InvoiceSent:
        return 'bg-pink-400'
      case RevenueStage.Paid:
        return 'bg-gray-300'
    }
    return 'bg-transparent'
  }

  get stageBadgeClass() {
    switch (this.revenue.stage) {
      case RevenueStage.PendingOrCancelled:
        return 'tbadge--yellow'
      case RevenueStage.Forecast:
        return 'tbadge--blue'
      case RevenueStage.ReadyToInvoice:
        return 'tbadge--green'
      case RevenueStage.InvoiceSent:
        return 'tbadge--pink'
      case RevenueStage.Paid:
        return ''
    }
  }

  editRevenue() {
    this.$bus.openRevenueFormModalEdit(this.revenue)
  }

  openInvoiceRecipientModal() {
    this.$emit('openInvoiceRecipientModal', this.revenue.id)
  }

  deleteRevenue() {
    this.$bus.showDeleteConfirmModal('Are you sure you want to delete this revenue?', () => {
      const variables: DeleteRevenueMutationVariables = {
        id: this.revenue.id,
      }
      this.$apollo
        .mutate({
          mutation: DeleteRevenue,
          variables,
        })
        .then(async () => {
          this.$bus.showSuccessModal('Revenue was successfully removed', 3000)
          this.$emit('onRevenueDeleted', this.revenue)
          await this.$apollo.provider.defaultClient.clearStore()
        })
        .catch((err) => {
          this.$bus.showErrorModal({
            errors: apolloParseErrors(err),
          })
        })
    })
  }
}
</script>

<style scoped lang="scss">
@import '../../assets/scss/variables';
</style>
