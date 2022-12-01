<template>
  <td class="px-6 py-3.5">
    <div>
      <span
        :class="{
          'text-green-700': data.next_possible_notice_to <= parentData.project_start,
          'text-red-700': data.next_possible_notice_to > parentData.project_start,
        }"
      >
        {{ dateFilter(data.next_possible_notice_to) }}
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
export default class CandidateSuitableNextPossibleNotice extends Vue {
  @Prop({ default: () => {} })
  data!: any
  @Prop({ default: () => {} })
  parentData!: any

  dateFilter = this.$options.filters!.date
}
</script>
