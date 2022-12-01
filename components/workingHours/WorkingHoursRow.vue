<template>
  <tr class="group leading-normal">
    <td class="pl-4 pr-3 py-3 whitespace-pre-line text-center relative">
      <span class="absolute left-0 top-0 bottom-0 w-0.5 bg-yellow-500" v-if="isRequestedOrModified"></span>
      <span class="flex flex-col items-center whitespace-nowrap">
        <span>
          {{ firstDate }}
        </span>
        <template v-if="lastDate">
          <span class="text-xs text-gray-500">till</span>
          <span>
            {{ lastDate }}
          </span>
        </template>
      </span>
    </td>
    <td class="px-3 py-3">
      <span class="flex flex-col items-start whitespace-nowrap">
        <span class="tbadge text-xs rounded-full" :class="statusBadgeColor">
          {{ workingHours.status | replaceUnderscoreWithSpace }}
        </span>
        <span class="px-2.5 mt-0.5 text-xs text-gray-500">
          {{ statusDate | date }}
        </span>
      </span>
    </td>
    <td class="px-3 py-3">
      <table v-if="isEmployee">
        <tbody>
          <tr>
            <td class="pr-3 text-gray-500">Purchasing</td>
            <td>{{ purchasingAmount | currency }}</td>
          </tr>
          <tr>
            <td class="pr-3 text-gray-500">Retail</td>
            <td>{{ retailAmount | currency }}</td>
          </tr>
          <tr>
            <td class="pr-3 text-gray-500">Earning</td>
            <td :class="[retailAmount - purchasingAmount > 0 ? 'text-green-600' : 'text-red-600']"
              >{{ (retailAmount - purchasingAmount) | currency }}
            </td>
          </tr>
        </tbody>
      </table>
      <template v-else-if="isClient">{{ retailAmount | currency }}</template>
      <template v-else>{{ purchasingAmount | currency }}</template>
    </td>
    <td class="px-4 py-3">
      <div
        class="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition duration-200 ease-in-out"
      >
        <template v-if="canAcceptOrDecline">
          <button
            type="button"
            class="tbtn-icon tbtn-icon--small tbtn--green"
            @click="
              $emit('openWorkingHoursModal', {
                workingHours: workingHours,
                page: 'PREVIEW',
              })
            "
            v-tooltip="{ content: 'Accept or decline', classes: ['tooltip--green'] }"
          >
            <IHDotsHorizontal class="w-5 h-5" />
          </button>
        </template>
        <template v-if="canEditDraft">
          <button
            type="button"
            class="tbtn-icon tbtn-icon--small tbtn--green"
            @click="
              $emit('openWorkingHoursModal', {
                workingHours: workingHours,
                page: 'PREVIEW',
                hideSaveDraftBtn: true,
              })
            "
            v-tooltip="{ content: 'Send request to the client', classes: ['tooltip--green'] }"
          >
            <IHPaperAirplane class="w-5 h-5" />
          </button>
          <button
            type="button"
            class="tbtn-icon tbtn-icon--small tbtn--white"
            @click="
              $emit('openWorkingHoursModal', {
                workingHours: workingHours,
                page: 'DATE_SELECTION',
              })
            "
          >
            <IHPencil class="w-5 h-5" />
          </button>
          <button type="button" class="tbtn-icon tbtn-icon--small tbtn--red" @click="deleteWorkingHours">
            <IHDelete class="w-5 h-5" />
          </button>
        </template>
        <button
          type="button"
          class="tbtn-icon tbtn-icon--small tbtn--white"
          @click="
            $emit('openWorkingHoursModal', {
              workingHours: workingHours,
              page: 'PREVIEW',
              readOnly: true,
            })
          "
          v-tooltip="'Show details'"
          v-if="workingHours.status !== 'DRAFT'"
        >
          <IHEye class="w-5 h-5" />
        </button>
        <a
          :href="`/working-hours/${workingHours.id}`"
          target="_blank"
          class="tbtn-icon tbtn-icon--small tbtn--white"
          v-tooltip="'Show report'"
          v-if="isEmployee && workingHours.status !== 'DRAFT'"
        >
          <IHDocumentText class="w-5 h-5" />
        </a>
      </div>
    </td>
  </tr>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import Vue from 'vue'
import IHPencil from '~/components/globals/icons/heroicons/IHPencil.vue'
import IHDelete from '~/components/globals/icons/heroicons/IHDelete.vue'
import {
  BillingType,
  DeleteWorkingHoursMutationVariables,
  WorkingHoursFragment,
  WorkingHoursStatus,
} from '~/graphql/GQLTypes'
import { namespace } from 'nuxt-property-decorator'
import IHPaperAirplane from '~/components/globals/icons/heroicons/IHPaperAirplane.vue'
import IHCheck from '~/components/globals/icons/heroicons/IHCheck.vue'
import IHX from '~/components/globals/icons/heroicons/IHX.vue'
import IHDotsHorizontal from '~/components/globals/icons/heroicons/IHDotsHorizontal.vue'
import DeleteWorkingHours from '~/graphql/ressources/workingHours/DeleteWorkingHours.gql'
import { apolloParseErrors } from '~/helpers/apolloParseErrors'
import IHEye from '~/components/globals/icons/heroicons/IHEye.vue'
import IHDocumentText from '~/components/globals/icons/heroicons/IHDocumentText.vue'

@Component({
  components: { IHDocumentText, IHEye, IHDotsHorizontal, IHX, IHCheck, IHPaperAirplane, IHDelete, IHPencil },
})
export default class WorkingHoursRow extends Vue {
  @Prop({ required: true })
  workingHours!: WorkingHoursFragment

  @(namespace('account').Getter('isCandidate'))
  isCandidate!: boolean

  @(namespace('account').Getter('isClient'))
  isClient!: boolean

  @(namespace('account').Getter('isEmployee'))
  isEmployee!: boolean

  @(namespace('account').Getter('isAdmin'))
  isAdmin!: boolean

  get isRequestedOrModified() {
    return [WorkingHoursStatus.RequestedByCandidate, WorkingHoursStatus.ModifiedByClient].includes(
      this.workingHours.status
    )
  }

  get canEditDraft() {
    return this.workingHours.status === WorkingHoursStatus.Draft && (this.isEmployee || this.isCandidate)
  }

  get canAcceptOrDecline() {
    return (
      (this.workingHours.status === WorkingHoursStatus.RequestedByCandidate && (this.isAdmin || this.isClient)) ||
      (this.workingHours.status === WorkingHoursStatus.ModifiedByClient && (this.isEmployee || this.isCandidate))
    )
  }

  get firstDate() {
    if (!this.workingHours.units) {
      return ''
    }
    return this.$options.filters!.date(this.workingHours.units[0].date)
  }

  get lastDate() {
    if (!this.workingHours.units || this.workingHours.units.length === 1) {
      return ''
    }
    return this.$options.filters!.date(this.workingHours.units[this.workingHours.units.length - 1].date)
  }

  get statusDate() {
    switch (this.workingHours.status) {
      case WorkingHoursStatus.RequestedByCandidate:
        return this.workingHours.requested_at
      case WorkingHoursStatus.ApprovedByClient:
        return this.workingHours.client_approved_at
      case WorkingHoursStatus.ApprovedByCandidate:
        return this.workingHours.candidate_approved_at
      case WorkingHoursStatus.DeclinedByClient:
        return this.workingHours.client_declined_at
      case WorkingHoursStatus.DeclinedByCandidate:
        return this.workingHours.candidate_declined_at
      case WorkingHoursStatus.ModifiedByClient:
        return this.workingHours.client_approved_at
      default:
        return this.workingHours.updated_at
    }
  }

  get statusBadgeColor() {
    switch (this.workingHours.status) {
      case WorkingHoursStatus.ApprovedByCandidate:
      case WorkingHoursStatus.ApprovedByClient:
        return 'tbadge--green'
      case WorkingHoursStatus.DeclinedByCandidate:
      case WorkingHoursStatus.DeclinedByClient:
        return 'tbadge--red'
      case WorkingHoursStatus.RequestedByCandidate:
      case WorkingHoursStatus.ModifiedByClient:
        return 'tbadge--yellow'
      default:
        return ''
    }
  }

  get purchasingAmount() {
    return this.calculateSum(this.workingHours.purchasing_per_unit)
  }

  get retailAmount() {
    return this.calculateSum(this.workingHours.retail_per_unit)
  }

  calculateSum(amountPerUnit: number | null | undefined) {
    if (!amountPerUnit) {
      return 0
    }

    let amount = 0
    if (this.workingHours.billing_type === BillingType.Daily) {
      amount = this.workingHours.units.length * amountPerUnit
    } else if (this.workingHours.billing_type === BillingType.Hourly) {
      this.workingHours.units.forEach((unit) => {
        amount += unit.hours! * amountPerUnit
      })
    }
    return amount
  }

  deleteWorkingHours() {
    this.$bus.showDeleteConfirmModal(
      `Are you sure you want to delete working hours from ${this.firstDate}${
        this.lastDate ? ' till ' + this.lastDate : ''
      }?`,
      () => {
        const variables: DeleteWorkingHoursMutationVariables = {
          id: this.workingHours.id,
        }
        this.$apollo
          .mutate({
            mutation: DeleteWorkingHours,
            variables,
          })
          .then(async () => {
            this.$bus.showSuccessModal('Working hours were successfully removed', 3000)
            await this.$apollo.provider.defaultClient.clearStore()
            this.$emit('deletedWorkingHours', this.workingHours)
          })
          .catch((err) => {
            this.$bus.showErrorModal({
              errors: apolloParseErrors(err),
            })
          })
      }
    )
  }
}
</script>
