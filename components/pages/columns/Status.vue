<template>
  <td class="px-6 py-3.5">
    <span class="border text-xs px-2.5 py-0.5 rounded-full whitespace-nowrap" :class="statusTextClass(data.status)">
      {{ data.status | formatSnakeCaseString }}
    </span>
  </td>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { statusTextColor } from '~/helpers/projectHelpers'

@Component({
  components: {},
})
export default class Status extends Vue {
  @Prop({ default: () => {} })
  data!: any

  statusTextClass(projectStatus) {
    return statusTextColor(projectStatus)
  }
}
</script>
