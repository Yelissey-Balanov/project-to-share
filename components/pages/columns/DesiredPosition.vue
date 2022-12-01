<template>
  <td class="px-6 py-3.5">
    <span class="whitespace-nowrap">{{ data.desired_job }}</span>
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
export default class DesiredPosition extends Vue {
  @Prop({ default: () => {} })
  data!: any
}
</script>
