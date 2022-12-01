<template>
  <td class="px-6 py-3.5">
    <div v-if="data.period_of_notice">
      {{ data.period_of_notice | noticePeriod }}
    </div>
    <div v-if="data.next_possible_notice_to">
      {{ data.next_possible_notice_to | date }}
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
export default class NoticePeriod extends Vue {
  @Prop({ default: () => {} })
  data!: any
}
</script>
