<template>
  <client-only>
    <div class="relative">
      <apexchart type="bar" :options="revenueChartOptions" :series="revenueChartSeries" height="350px" />
      <div
        class="absolute z-10 top-0 bottom-0 right-0 left-0 bg-white bg-opacity-80 flex items-center justify-center text-center"
        v-if="isLoading"
      >
        Loading...
      </div>
    </div>
  </client-only>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  components: {},
})
export default class RevenueChartPerYear extends Vue {
  /**
   * series array. should have the following shape:
   * [
   *   { name: 'Forecast', data: [...] },
   *   { name: 'Earned', data: [...] },
   * ]
   */
  @Prop()
  revenueChartSeries!: any[]

  @Prop()
  year!: number

  @Prop({ default: false })
  isLoading!: boolean

  get revenueChartOptions() {
    return {
      chart: {
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dez'],
      },
      yaxis: {
        labels: {
          formatter: (val) => {
            return this.$options.filters!.currency(val, {
              fractionCount: 0,
            })
          },
        },
      },
      colors: ['#6ee7b7', '#059669', '#056396'],
      tooltip: {
        shared: true,
        intersect: false,
        x: {
          formatter: (val) => {
            return val + ' ' + this.year
          },
        },
        y: {
          formatter: (val) => {
            return this.$options.filters!.currency(val, {
              fractionCount: 0,
            })
          },
        },
      },
    }
  }
}
</script>
