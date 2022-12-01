<template>
  <div class="flex space-x-2 justify-end">
    <button
      type="button"
      class="tbtn-icon tbtn-icon--small tbtn--red"
      v-tooltip="{
        content: 'Remove from longlist',
        classes: ['tooltip--red'],
      }"
      v-if="data.buttonStatus.addToLonglist === ButtonStatus.PROCESSED"
      @click="removeFromLonglist(data)"
      :disabled="data.buttonStatus.removeFromLonglist !== ButtonStatus.ACTIVE"
    >
      <IHMinus class="w-5 h-5" />
    </button>

    <button
      type="button"
      class="tbtn-icon tbtn-icon--small"
      :class="[
        data.is_in_project || data.buttonStatus.addToLonglist === ButtonStatus.PROCESSED ? 'tbtn--green' : 'tbtn--gray',
        data.is_in_project && 'cursor-default',
      ]"
      v-tooltip="{
        content: data.is_in_project
          ? 'Already on the project'
          : data.buttonStatus.addToLonglist === ButtonStatus.PROCESSED
          ? 'Added to longlist'
          : 'Add to longlist',
        classes: [
          data.is_in_project || data.buttonStatus.addToLonglist === ButtonStatus.PROCESSED
            ? 'tooltip--green'
            : 'tooltip--white',
        ],
      }"
      @click="data.buttonStatus.addToLonglist === ButtonStatus.ACTIVE ? addToLonglist(data) : () => {}"
    >
      <IHCheck
        v-if="data.is_in_project || data.buttonStatus.addToLonglist === ButtonStatus.PROCESSED"
        class="w-5 h-5"
      />
      <IHPlus v-else class="w-6 h-6" />
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { ButtonStatus, SuitableCandidate } from '~/store'
import IHMinus from '~/components/globals/icons/heroicons/IHMinus.vue'
import IHPlus from '~/components/globals/icons/heroicons/IHPlus.vue'
import IHCheck from '~/components/globals/icons/heroicons/IHCheck.vue'

@Component({
  components: { IHCheck, IHPlus, IHMinus },
})
export default class CandidateFullInfo extends Vue {
  ButtonStatus = ButtonStatus

  @Prop({ default: () => {} })
  data!: any
  @Prop()
  parentData!: any

  addToLonglist(candidate: SuitableCandidate) {
    if (this.data.is_in_project || this.data.buttonStatus.addToLonglist === ButtonStatus.PROCESSING) {
      return
    }

    this.$store.dispatch('project/addToLonglist', {
      candidate,
      projectId: this.parentData!.id,
    })
  }

  removeFromLonglist(candidate: SuitableCandidate) {
    if (this.data.buttonStatus.removeFromLonglist === ButtonStatus.PROCESSING) {
      return
    }

    this.$store.dispatch('project/removeFromLonglist', {
      candidate,
      projectId: this.parentData!.id,
    })
  }
}
</script>
