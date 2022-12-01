<template>
  <td class="px-6 py-3.5">
    <EventTableRow
      class=""
      v-for="event in lastHappenedEvents"
      :are-images-displayed="areImagesDisplayed"
      :event="event"
      :key="`ceip_${event.id}`"
    ></EventTableRow>
  </td>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import LabeledValue from '~/components/admin/LabeledValue.vue'
import EventTableRow from '~/components/events/EventTableRow.vue'

@Component({
  components: {
    EventTableRow,
    LabeledValue,
  },
})
export default class ProjectCandidateEvents extends Vue {
  @Prop({ default: () => {} })
  data!: any
  @Prop({default: true})
  areImagesDisplayed!: boolean

  get lastHappenedEvents() {
    if (!this.data || !this.data.events_in_project) {
      return []
    }
    return this.data.events_in_project.slice(0, 1)
  }
}
</script>
