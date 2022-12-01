<template>
  <td class="px-6 py-3.5">
    <div>
      {{ noticePeriodFilter(data.period_of_notice) }}
    </div>
  </td>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import LabeledValue from '~/components/admin/LabeledValue.vue'

@Component({
  components: {
    LabeledValue,
  },
})
export default class CandidateSuitableNoticePeriod extends Vue {
  @Prop({ default: () => {} })
  data!: any

  noticePeriodFilter = this.$options.filters!.noticePeriod
}
</script>
