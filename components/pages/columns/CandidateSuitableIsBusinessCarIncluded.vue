<template>
  <td class="px-6 py-3.5">
    <div>
      <span
        :class="{
          'text-green-700':
            data.is_business_car_included === parentData.is_business_car_included ||
            (parentData.is_business_car_included && !data.is_business_car_included),
        }"
      >
        {{ data.is_business_car_included ? 'Yes' : 'No' }}
      </span>
      <span class="text-black">/</span>
      <span class="text-black">{{ parentData.is_business_car_included ? 'Yes' : 'No' }}</span>
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
export default class CandidateSuitableIsBusinessCarIncluded extends Vue {
  @Prop({ default: () => {} })
  data!: any
  @Prop({ default: () => {} })
  parentData!: any
}
</script>
