<template>
  <td class="px-6 py-3.5">
    <div>{{ data.candidates_count }} candidates</div>
    <div>{{ data.shortlisted_candidates_count }} shortlisted</div>
  </td>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { statusTextColor } from '~/helpers/projectHelpers'

@Component({
  components: {},
})
export default class Candidates extends Vue {
  @Prop({ default: () => {} })
  data!: any

  statusTextClass(projectStatus) {
    return statusTextColor(projectStatus)
  }
}
</script>
