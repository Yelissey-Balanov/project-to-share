<template>
  <div class="grid grid-cols-2 gap-x-6 gap-y-2">
    <template v-if="isEmployee">
      <div>Purchasing {{ hourlyOrDaily }} rate: {{ (purchasingDailyRate / rateDivider) | currency }}</div>
      <div>
        Purchasing sum:
        {{ ((purchasingDailyRate / rateDivider) * sumUnits) | currency }}
      </div>

      <div>Retail {{ hourlyOrDaily }} rate: {{ (retailDailyRate / rateDivider) | currency }}</div>
      <div>Retail sum: {{ ((retailDailyRate / rateDivider) * sumUnits) | currency }}</div>

      <div>
        Earning per {{ hourOrDay }}:
        {{ ((retailDailyRate - purchasingDailyRate) / rateDivider) | currency }}
      </div>
      <div>
        Earning sum:
        {{ (((retailDailyRate - purchasingDailyRate) / rateDivider) * sumUnits) | currency }}
      </div>
    </template>
    <template v-else-if="isCandidate">
      <div>
        Earning per {{ hourOrDay }}:
        {{ (purchasingDailyRate / rateDivider) | currency }}
      </div>
      <div>
        Earning sum:
        {{ ((purchasingDailyRate / rateDivider) * sumUnits) | currency }}
      </div>
    </template>
    <template v-else-if="isClient">
      <div>
        Paying per {{ hourOrDay }}:
        {{ (retailDailyRate / rateDivider) | currency }}
      </div>
      <div>
        Paying sum:
        {{ ((retailDailyRate / rateDivider) * sumUnits) | currency }}
      </div>
    </template>
    <div>Days sum: {{ sumDays }}</div>
    <div v-if="isHourlyRate">Hours sum: {{ sumUnits }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import Vue from 'vue'
import { namespace } from '~/node_modules/nuxt-property-decorator'
import { Maybe } from '~/graphql/GQLTypes'

@Component({
  components: {},
})
export default class WorkingHoursCalculationPreview extends Vue {
  @Prop({ required: true })
  purchasingDailyRate!: Maybe<number>

  @Prop({ required: true })
  retailDailyRate!: Maybe<number>

  @Prop({ required: true })
  sumDays!: number

  @Prop({ default: null })
  sumUnits!: Maybe<number>

  @Prop({ required: true })
  isHourlyRate!: boolean

  @(namespace('account').Getter('isCandidate'))
  isCandidate!: boolean

  @(namespace('account').Getter('isClient'))
  isClient!: boolean

  @(namespace('account').Getter('isEmployee'))
  isEmployee!: boolean

  get rateDivider() {
    return this.isHourlyRate ? 8 : 1
  }

  get hourlyOrDaily() {
    return this.isHourlyRate ? 'hourly' : 'daily'
  }

  get hourOrDay() {
    return this.isHourlyRate ? 'hour' : 'day'
  }
}
</script>
