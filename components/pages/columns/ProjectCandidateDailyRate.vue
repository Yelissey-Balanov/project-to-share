<template>
  <td class="px-6 py-3.5">
    <span v-if="data.candidate_project_pivot.purchasing_daily_rate" class="whitespace-nowrap">
      {{ data.candidate_project_pivot.purchasing_daily_rate | currency }}
    </span>
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
export default class ProjectCandidateDailyRate extends Vue {
  @Prop({ default: () => {} })
  data!: any
}
</script>
