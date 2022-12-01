<template>
  <td class="px-6 py-3.5">
    <div
      v-if="data.candidate_project_pivot.client_notes"
      class="w-full"
      :class="{ 'cursor-pointer': noteRest, 'whitespace-pre-line': displayFullNote }"
      @click="displayFullNote = !displayFullNote"
    >
      {{ shortNote }}
      <template v-if="noteRest">
        <template v-if="displayFullNote"> {{ noteRest }}</template>
        <template v-else>...</template>
      </template>
    </div>
  </td>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import LabeledValue from '~/components/admin/LabeledValue.vue'

@Component({
  components: {
    LabeledValue,
  },
})
export default class ProjectCandidateClientFeedback extends Vue {
  @Prop({ default: () => {} })
  data!: any

  shortNote = ''
  noteRest = ''
  private maxStrLength = 120

  @Watch('data.candidate_project_pivot.client_notes', { immediate: true })
  onEventNotesChanged() {
    if (this.data.candidate_project_pivot && this.data.candidate_project_pivot.client_notes) {
      if (this.data.candidate_project_pivot.client_notes.length > this.maxStrLength) {
        const spaceIndex = this.data.candidate_project_pivot.client_notes.substr(0, this.maxStrLength).lastIndexOf(' ')
        this.shortNote = this.data.candidate_project_pivot.client_notes.substr(0, spaceIndex)
        this.noteRest = this.data.candidate_project_pivot.client_notes.substr(spaceIndex)
      } else {
        this.shortNote = this.data.candidate_project_pivot.client_notes
        this.noteRest = ''
      }
    } else {
      this.shortNote = ''
      this.noteRest = ''
    }
  }

  displayFullNote = false
}
</script>
