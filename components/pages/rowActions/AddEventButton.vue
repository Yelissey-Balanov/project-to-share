<template>
  <button
    class="tbtn-icon tbtn--green tbtn-icon--small relative"
    @click="$emit('callback')"
    v-tooltip="{ content: 'Add Event', classes: ['tooltip--green'] }"
  >
    <IHCalendar class="w-4 h-4 relative -left-[3px] -bottom-0.5" />
    <IHPlus class="w-4 h-4 absolute right-0 top-0.5" />
  </button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import IHPlus from '~/components/globals/icons/heroicons/IHPlus.vue'
import IHCalendar from '~/components/globals/icons/heroicons/IHCalendar.vue'

@Component({
  components: { IHCalendar, IHPlus },
})
export default class CandidateActionButtons extends Vue {
  @Prop({
    default: () => {},
  })
  data!: any

  $refs!: {
    modalCandidateInProject: any
  }
}
</script>
