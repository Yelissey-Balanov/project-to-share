<template>
  <td class="px-6 py-3.5">
    <div>
      <span
        :class="{
          'text-green-700':
            parentData.max_daily_rate && data.daily_rate && data.daily_rate <= parentData.max_daily_rate,
          'text-red-700': parentData.max_daily_rate && data.daily_rate && data.daily_rate > parentData.max_daily_rate,
        }"
      >
        {{ data.daily_rate | currency }}
      </span>
      <span class="text-black">/</span>
      <span class="text-black">{{ parentData.max_daily_rate | currency }}</span>
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
export default class CandidateSuitableDailyRate extends Vue {
  @Prop({ default: () => {} })
  data!: any
  @Prop({ default: () => {} })
  parentData!: any
}
</script>
