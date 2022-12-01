<template>
  <td class="px-6 py-3.5">
    <div>
      <span
        :class="{
          'text-green-700': data.available_from <= parentData.project_start,
          'text-red-700': data.available_from > parentData.project_start,
        }"
      >
        {{ dateFilter(data.available_from) }}
      </span>
      <span class="text-black">/</span>
      <span class="text-black">{{ dateFilter(parentData.project_start) }}</span>
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
export default class CandidateSuitableAvailableFrom extends Vue {
  @Prop({ default: () => {} })
  data!: any
  @Prop({ default: () => {} })
  parentData!: any

  dateFilter = this.$options.filters!.date
}
</script>
