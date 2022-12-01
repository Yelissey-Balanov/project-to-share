<template>
  <div class="px-6 pt-5 pb-1 bg-white shadow-md rounded-lg">
    <div class="flex items-start justify-between">
      <h3>
        <template v-if="!isRevenueManager">My revenue</template>
        <template v-else>Revenue</template>
      </h3>
      <div class="flex space-x-4">
        <FUserAutocomplete
          class="w-52 mb-0"
          v-model="userAutocomplete"
          label="Employee"
          v-if="isRevenueManager && userId !== 0"
        />
        <FSelectSimple class="mb-0" v-model="year" label="Year" :options="yearOptions" :nullable="false" />
      </div>
    </div>
    <div class="relative" style="min-height: 50px">
      <RevenueChartPerYear :revenue-chart-series="revenueChartSeries" :year="year" :isLoading="$fetchState.pending" />
      <div
        class="absolute top-0 bottom-0 right-0 left-0 bg-white bg-opacity-80 flex items-center justify-center text-center"
        v-if="!fetchForUserId"
      >
        Please select employee
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import {
  GetRevenueChartDataQuery,
  GetRevenueChartDataQueryVariables,
  GetUsersForAutocompleteQuery,
  Maybe,
} from '~/graphql/GQLTypes'
import GetRevenueChartData from '~/graphql/ressources/revenues/GetRevenueChartData.gql'
import { apolloParseErrors } from '~/helpers/apolloParseErrors'
import RevenueChartPerYear from '~/components/dashboard/RevenueChartPerYear.vue'
import { namespace } from 'nuxt-property-decorator'
import FUserAutocomplete from '~/components/admin/FUserAutocomplete.vue'

@Component({
  components: { FUserAutocomplete, RevenueChartPerYear },
})
export default class UsersRevenueChartCard extends Vue {
  @Prop({ default: 0 })
  userId!: number

  @(namespace('account').Getter('isRevenueManager'))
  isRevenueManager!: boolean

  year: string = new Date().getFullYear().toString()
  userAutocomplete: Maybe<NonNullable<GetUsersForAutocompleteQuery['users']>['data'][0]> = null

  revenueChartSeries: any[] = []

  mounted() {
    if (this.isRevenueManager) {
      this.userAutocomplete = {
        id: this.$store.state.account.user.id,
        firstname: this.$store.state.account.user.firstname,
        lastname: this.$store.state.account.user.lastname,
      }

      setTimeout(() => {
        this.$fetch()
      }, 200)
    }
  }

  get yearOptions() {
    const currentYear = new Date().getFullYear()
    const options = {}
    for (let i = -1; i < 2; i++) {
      options[currentYear + i] = currentYear + i
    }
    return options
  }

  get fetchForUserId() {
    if (!this.isRevenueManager) {
      return this.userId
    } else if (this.userAutocomplete) {
      return this.userAutocomplete.id
    } else {
      return null
    }
  }

  @Watch('year')
  onYearUpdate() {
    this.$fetch()
  }

  @Watch('fetchForUserId')
  onFetchForUserIdUpdate() {
    this.$fetch()
  }

  fetch() {
    if (!this.fetchForUserId) {
      return
    }

    return this.$apollo
      .query<GetRevenueChartDataQuery>({
        query: GetRevenueChartData,
        variables: {
          year: parseInt(this.year),
          userId: this.fetchForUserId,
        } as GetRevenueChartDataQueryVariables,
      })
      .then(({ data }) => {
        this.revenueChartSeries = [
          {
            name: 'Forecast',
            data: data.revenueChartData.map(
              (revenueChart) =>
                revenueChart.stats.INVOICE_SENT +
                revenueChart.stats.READY_TO_INVOICE +
                revenueChart.stats.PAID +
                revenueChart.stats.FORECAST
            ),
          },
          {
            name: 'Earned',
            data: data.revenueChartData.map(
              (revenueChart) => revenueChart.stats.INVOICE_SENT + revenueChart.stats.PAID
            ),
          },
          {
            name: 'Ready to invoice',
            data: data.revenueChartData.map((revenueChart) => revenueChart.stats.READY_TO_INVOICE),
          },
        ]
      })
      .catch((err) => {
        this.$bus.showErrorModal({
          errors: apolloParseErrors(err),
        })
      })
  }
}
</script>
