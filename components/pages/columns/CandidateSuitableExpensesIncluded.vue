<template>
  <td class="px-6 py-3.5">
    <div>
      <span
        :class="{
          'text-green-700':
            data.expenses_included === parentData.expenses_included ||
            (!parentData.expenses_included && data.expenses_included),
        }"
      >
        {{ data.expenses_included ? 'Yes' : 'No' }}
      </span>
      <span class="text-black">/</span>
      <span class="text-black">{{ parentData.expenses_included ? 'Yes' : 'No' }}</span>
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
export default class CandidateSuitableExpensesIncluded extends Vue {
  @Prop({ default: () => {} })
  data!: any
  @Prop({ default: () => {} })
  parentData!: any
}
</script>
