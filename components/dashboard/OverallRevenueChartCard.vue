<template>
  <div class="px-6 pt-5 pb-1 bg-white shadow-md rounded-lg">
    <div class="flex items-start justify-between">
      <h3> Revenue summary </h3>
      <div class="flex space-x-4">
        <FSelectSimple class="mb-0" v-model="year" label="Year" :options="yearOptions" :nullable="false" />
      </div>
    </div>
    <RevenueChartPerYear :revenue-chart-series="revenueChartSeries" :year="year" :isLoading="$fetchState.pending" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { GetRevenueChartDataSumQuery, GetRevenueChartDataSumQueryVariables } from '~/graphql/GQLTypes'
import GetRevenueChartDataSum from '~/graphql/ressources/revenues/GetRevenueChartDataSum.gql'
import { apolloParseErrors } from '~/helpers/apolloParseErrors'
import RevenueChartPerYear from '~/components/dashboard/RevenueChartPerYear.vue'

@Component({
  components: { RevenueChartPerYear },
})
export default class OverallRevenueChartCard extends Vue {
  year: string = new Date().getFullYear().toString()

  revenueChartSeries: any[] = []

  get yearOptions() {
    const currentYear = new Date().getFullYear()
    const options = {}
    for (let i = -1; i < 2; i++) {
      options[currentYear + i] = currentYear + i
    }
    return options
  }

  @Watch('year')
  onYearUpdate() {
    this.$fetch()
  }

  fetch() {
    return this.$apollo
      .query<GetRevenueChartDataSumQuery>({
        query: GetRevenueChartDataSum,
        variables: {
          year: parseInt(this.year),
        } as GetRevenueChartDataSumQueryVariables,
      })
      .then(({ data }) => {
        this.revenueChartSeries = [
          {
            name: 'Forecast',
            data: data.revenueChartDataSum.map(
              (revenueChart) =>
                revenueChart.stats.INVOICE_SENT +
                revenueChart.stats.READY_TO_INVOICE +
                revenueChart.stats.PAID +
                revenueChart.stats.FORECAST
            ),
          },
          {
            name: 'Earned',
            data: data.revenueChartDataSum.map(
              (revenueChart) => revenueChart.stats.INVOICE_SENT + revenueChart.stats.PAID
            ),
          },
          {
            name: 'Ready to invoice',
            data: data.revenueChartDataSum.map((revenueChart) => revenueChart.stats.READY_TO_INVOICE),
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
