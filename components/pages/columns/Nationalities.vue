<template>
  <td class="px-6 py-3.5">
    <span class="-mb-1 -mr-1">
      <div
        class="tbadge tbadge--blue tbadge--small mb-1 mr-1"
        v-for="nationality in firstFiveNationalities"
        :key="nationality.id"
      >
        {{ nationality.name }}
      </div>
    </span>
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
export default class Nationalities extends Vue {
  @Prop({ default: () => {} })
  data!: any

  get firstFiveNationalities() {
    return this.data.nationalities.slice(0, 5)
  }
}
</script>
