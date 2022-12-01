<template>
  <td class="px-6 py-3.5">
    <span v-if="data.candidate_project_pivot.basic_salary" class="whitespace-nowrap">
      {{ data.candidate_project_pivot.basic_salary | currency }}
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
export default class ProjectCandidateSalary extends Vue {
  @Prop({ default: () => {} })
  data!: any
}
</script>
