<template>
  <button
    class="tbtn-icon tbtn--blue tbtn-icon--small"
    type="button"
    v-tooltip="{ content: 'View Candidate', classes: ['tooltip--blue'] }"
    @click="$emit('callback')"
  >
    <IEye class="w-5 h-5" />
  </button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  components: {},
})
export default class ShowCandidateFullInfo extends Vue {
  @Prop({ default: () => {} })
  data!: any

  $refs!: {
    modalCandidateInProject: any
  }
}
</script>
