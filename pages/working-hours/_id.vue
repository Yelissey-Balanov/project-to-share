<template>
  <div class="container pb-0 max-w-5xl">
    <div class="flex flex-col py-8 rounded-lg min-h-screen">
      <div class="flex justify-between mb-12">
        <div>
          <h2 class="text-3xl">Activity report</h2>
          <div :class="statusTextColor">{{ workingHours.status | replaceUnderscoreWithSpace }}</div>
        </div>
        <LicenseLogo class="flex-none w-44 h-auto" />
      </div>

      <div class="grid grid-cols-3 w-full text-base mb-8 gap-6">
        <div v-for="gridTile in gridTiles" :key="gridTile.headline" class="">
          <div class="text-gray-600 text-sm font-light tracking-wider">{{ gridTile.headline }}</div>
          <div class="">{{ gridTile.text }}</div>
        </div>
      </div>

      <div class="rounded-xl bg-white border border-gray-300 mb-12" style="overflow: visible !important">
        <table class="min-w-full divide-y divide-gray-300 text-sm">
          <thead>
            <tr>
              <th scope="col" class="py-3 pl-6 pr-3 text-left font-semibold">Date</th>
              <th scope="col" class="py-3 px-3 text-left font-semibold" v-if="hasHourlyBillingType">Hours</th>
              <th scope="col" class="py-3 px-3 text-left font-semibold w-full">Note</th>
              <th scope="col" class="py-3 pl-3 pr-6 text-left whitespace-nowrap">Amount</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="(unit, index) in units" :key="index">
              <td class="whitespace-nowrap py-2 pl-6 pr-3 font-medium">
                {{ unit.date | date }}
              </td>
              <td class="whitespace-nowrap py-2 px-3" v-if="hasHourlyBillingType">
                {{ unit.hours }}
              </td>
              <td class="py-2 px-3 text-gray-500">
                {{ unit.note }}
              </td>
              <td class="relative whitespace-nowrap py-2 pl-3 pr-6 font-medium whitespace-nowrap">
                {{ unit.amount | currency }}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th scope="col" class="py-3 pl-6 pr-3 text-left font-semibold">
                <template v-if="!hasHourlyBillingType">
                  {{ unitsDaysSum }} day{{ unitsDaysSum > 1 ? 's' : '' }}
                </template>
              </th>
              <th scope="col" class="py-3 px-3 text-left font-semibold whitespace-nowrap" v-if="hasHourlyBillingType">
                {{ unitsHoursSum }} hour{{ unitsHoursSum > 1 ? 's' : '' }}
              </th>
              <th scope="col" class="py-3 px-3 text-left font-semibold"></th>
              <th scope="col" class="relative py-3 pl-3 pr-6 text-left whitespace-nowrap">
                {{ amountSum | currency }}
              </th>
            </tr>
          </tfoot>
        </table>
      </div>

      <div class="grid grid-cols-3 gap-8 text-base mb-20">
        <div>
          <div class="text-gray-600 text-sm font-light tracking-wider">Interim manager request</div>
          <div class="">{{ workingHours.candidate.person.full_name }}</div>
          <div class="">{{ workingHours.requested_at | datetime }}</div>
        </div>
        <div></div>
        <div>
          <div class="text-gray-600 text-sm font-light tracking-wider">Client approval</div>
          <div class="">{{ workingHours.client ? workingHours.client.person.full_name : '---' }}</div>
          <div class="">{{ workingHours.client_approved_at | datetime }}</div>
        </div>
      </div>

      <div class="mt-auto text-center text-gray-500 text-xs">
        This document was automatically generated at {{ currentDate | datetime }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  BillingType,
  GetWorkingHoursForProofQuery,
  GetWorkingHoursForProofQueryVariables,
  WorkingHoursStatus,
} from '~/graphql/GQLTypes'
import GetWorkingHoursForProof from '~/graphql/ressources/workingHours/GetWorkingHoursForProof.gql'
import LicenseLogo from '~/components/LicenseLogo.vue'

@Component({
  components: { LicenseLogo },
  layout: 'clean-document',
  head() {
    return {
      title: 'Working hours details',
    }
  },
  async asyncData({ app, route, error }) {
    const data = {
      workingHours: null as any,
      workingHoursId: Number.parseInt(route.params.id),
    }
    try {
      const res = await app.apolloProvider!.defaultClient.query<GetWorkingHoursForProofQuery>({
        query: GetWorkingHoursForProof,
        variables: {
          id: data.workingHoursId,
        } as GetWorkingHoursForProofQueryVariables,
      })
      data.workingHours = res.data.workingHours
    } catch (e) {
      console.log(e)
    }

    if (!data.workingHours) {
      return error({ statusCode: 404 })
    }

    return data
  },
})
export default class ConsentCandidateInProjectPage extends Vue {
  $refs!: {
    modalContradictConfirm: any
  }

  BillingType = BillingType

  workingHours!: NonNullable<GetWorkingHoursForProofQuery['workingHours']>
  units: NonNullable<GetWorkingHoursForProofQuery['workingHours']>['units'] & { amount: number }[] = []
  unitsDaysSum = 0
  unitsHoursSum = 0
  amountSum = 0

  get hasHourlyBillingType() {
    return this.workingHours.billing_type === BillingType.Hourly
  }

  gridTiles: any[] = []

  currentDate = new Date()

  get statusTextColor() {
    switch (this.workingHours.status) {
      case WorkingHoursStatus.ApprovedByCandidate:
      case WorkingHoursStatus.ApprovedByClient:
        return 'text-green-600'
      case WorkingHoursStatus.DeclinedByCandidate:
      case WorkingHoursStatus.DeclinedByClient:
        return 'text-red-600 font-bold'
      case WorkingHoursStatus.RequestedByCandidate:
      case WorkingHoursStatus.ModifiedByClient:
        return 'text-yellow-600'
      default:
        return 'text-gray-600'
    }
  }

  created() {
    this.units = this.workingHours.units.map((unit) => {
      let amount
      if (this.workingHours.billing_type === BillingType.Daily) {
        amount = this.workingHours.retail_per_unit
      } else {
        amount = this.workingHours.retail_per_unit! * unit.hours!
      }

      this.unitsDaysSum++
      if (unit.hours) {
        this.unitsHoursSum += unit.hours
      }
      this.amountSum += amount

      return {
        ...unit,
        amount,
      }
    })

    this.gridTiles = [
      {
        headline: 'Project',
        text: this.workingHours.project.title,
      },
      {
        headline: 'Project start',
        text: this.workingHours.project.placed_start_at
          ? this.$options.filters!.date(this.workingHours.project.placed_start_at)
          : '---',
      },
      {
        headline: 'Company',
        text: this.workingHours.project.company.complete_name,
      },
      // {
      //   headline: 'Interim Manager',
      //   text: this.workingHours.candidate.person.full_name,
      // },
      // {
      //   headline: 'Client',
      //   text: this.workingHours.client?.person.full_name ?? '---',
      // },
    ]
  }
}
</script>
