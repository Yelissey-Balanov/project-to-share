<template>
  <td class="px-6 py-3.5">
    <div>
      <span class="text-black">{{ data.other_bonus }}</span>
    </div>
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
export default class CandidateSuitableOtherBonus extends Vue {
  @Prop({ default: () => {} })
  data!: any
}
</script>
