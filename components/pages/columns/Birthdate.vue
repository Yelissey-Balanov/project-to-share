<template>
  <td class="px-6 py-3.5">
    <span> {{ (data.person ? data.person.birthdate : '') | date }}</span>
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
export default class Birthdate extends Vue {
  @Prop({ default: () => {} })
  data!: any
}
</script>
