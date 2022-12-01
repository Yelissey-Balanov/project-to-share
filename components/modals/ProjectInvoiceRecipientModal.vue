<template>
  <client-only>
    <SweetModal ref="modal" title="Invoice Data">
      <div class="py-8 text-center" v-if="isLoading">Loading...</div>
      <template v-else-if="revenue">
        <div class="grid grid-cols-2 gap-x-6">
          <LabeledValue :value="revenue.amount" :as-currency="true" label="Amount" />
          <LabeledValue :value="month" label="Month" />
          <LabeledValue :value="typeFormatted" label="Revenue type" />
          <LabeledValue :class="stageColorClass" :value="stageFormatted" label="Stage" />
          <LabeledValue :value="revenue.project.title" label="Project" />
          <LabeledValue :value="revenue.project.company.aliasOrName" label="Company" />
          <LabeledValue :value="revenue.project.ir_email" label="Email" />
          <LabeledValue :value="revenue.project.ir_phone" label="Phonenumber" />
          <LabeledValue :value="revenue.project.ir_name" label="Recipient Name" />
          <LabeledValue :value="revenue.project.ir_address" label="Address" />
          <LabeledValue :value="revenue.project.ir_vat" label="VAT" />
          <LabeledValue :value="revenue.project.ir_po" label="PO" />
        </div>
        <div class="mt-8 flex justify-end space-x-2" v-if="isRevenueManager">
          <button
            class="tbtn tbtn--green"
            type="button"
            @click="setInvoiceSent()"
            v-if="revenue.stage === RevenueStage.ReadyToInvoice"
          >
            Invoice Sent
          </button>
          <button
            class="tbtn tbtn--green"
            type="button"
            @click="setPaid()"
            v-if="revenue.stage === RevenueStage.ReadyToInvoice || revenue.stage === RevenueStage.InvoiceSent"
          >
            Mark as paid
          </button>
        </div>
      </template>
    </SweetModal>
  </client-only>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import Vue from 'vue'
import {
  GetRevenueInvoiceDataQuery,
  GetRevenueInvoiceDataQueryVariables,
  RevenueStage,
  UpdateRevenueMutation,
  UpdateRevenueMutationVariables,
} from '~/graphql/GQLTypes'
import GetRevenueInvoiceData from '~/graphql/ressources/revenues/GetRevenueInvoiceData.gql'
import LabeledValue from '~/components/admin/LabeledValue.vue'
import { namespace } from 'nuxt-property-decorator'
import UpdateRevenue from '~/graphql/ressources/revenues/UpdateRevenue.gql'
import { apolloParseErrors } from '~/helpers/apolloParseErrors'

@Component({
  components: { LabeledValue },
})
export default class ProjectInvoiceRecipientModal extends Vue {
  RevenueStage = RevenueStage
  $refs!: {
    modal: any
  }

  isLoading = false
  revenue: GetRevenueInvoiceDataQuery['revenue'] = null

  @(namespace('account').Getter('isRevenueManager'))
  isRevenueManager!: boolean

  open(revenueId: number) {
    if (this.isLoading || !revenueId) {
      return
    }
    this.$refs.modal.open()
    this.revenue = null
    this.isLoading = true

    this.$apollo
      .query<GetRevenueInvoiceDataQuery>({
        query: GetRevenueInvoiceData,
        variables: {
          id: revenueId,
        } as GetRevenueInvoiceDataQueryVariables,
      })
      .then((res) => {
        this.revenue = res.data.revenue
      })
      .finally(() => {
        this.isLoading = false
      })
  }

  get month() {
    if (!this.revenue) {
      return ''
    }
    return this.$options.filters!.wordForMonth(this.revenue.month) + ' ' + this.revenue.year
  }

  get typeFormatted() {
    if (!this.revenue) {
      return ''
    }
    return this.$options.filters!.replaceUnderscoreWithSpace(this.revenue.type)
  }

  get stageFormatted() {
    if (!this.revenue) {
      return ''
    }
    return this.$options.filters!.replaceUnderscoreWithSpace(this.revenue.stage)
  }

  get stageColorClass() {
    if (!this.revenue) {
      return ''
    }
    switch (this.revenue.stage) {
      case RevenueStage.PendingOrCancelled:
        return 'text-yellow-600'
      case RevenueStage.Forecast:
        return 'text-blue-600'
      case RevenueStage.ReadyToInvoice:
      case RevenueStage.InvoiceSent:
      case RevenueStage.Paid:
        return 'text-green-600'
    }
  }

  close() {
    this.$refs.modal.close()
  }

  setInvoiceSent() {
    this.updateRevenue(RevenueStage.InvoiceSent)
    this.close()
  }

  setPaid() {
    this.updateRevenue(RevenueStage.Paid)
    this.close()
  }

  private updateRevenue(newStage: RevenueStage) {
    const variables: UpdateRevenueMutationVariables = {
      id: this.revenue!.id,
      input: {
        stage: newStage,
      },
    }

    return this.$apollo
      .mutate<UpdateRevenueMutation>({
        mutation: UpdateRevenue,
        variables,
      })
      .then(({ data }) => {
        this.$emit('updatedRevenue', data!.updateRevenue)

        this.$bus.showSuccessModal('Revenue was successfully updated', 2000)
      })
      .catch((err) => {
        this.$bus.showErrorModal({
          errors: apolloParseErrors(err),
        })
      })
  }
}
</script>
