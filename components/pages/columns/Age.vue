<template>
  <td class="px-6 py-3.5">
    <span class="" v-if="age"> {{ age }} years old</span>
  </td>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import LabeledValue from '~/components/admin/LabeledValue.vue'
import { DateTime } from 'luxon'

@Component({
  components: {
    LabeledValue,
  },
})
export default class Age extends Vue {
  @Prop({ default: () => {} })
  data!: any

  get age() {
    if (!this.data || !this.data.person.birthdate) {
      return ''
    }
    return Math.floor(Math.abs(DateTime.fromISO(this.data.person.birthdate).diffNow('years').as('years')))
  }
}
</script>
