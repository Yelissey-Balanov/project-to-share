<template>
  <td class="px-6 py-3.5">
    <span class="tbadge text-base">
      {{ data.matchingScore }}
      <span class="text-sm text-gray-500">of {{ maxPossibleScore }} Points</span>
    </span>
  </td>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { State } from 'nuxt-property-decorator'

@Component({
  components: {},
})
export default class ProjectCandidateMatchingScore extends Vue {
  @Prop({ default: () => {} })
  data!: any

  @State((state) => state.project.projectAdditionalData.maxPossibleScore)
  maxPossibleScore!: number
}
</script>
