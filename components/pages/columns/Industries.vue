<template>
  <td class="px-6 py-3.5">
    <span class="-mb-1 -mr-1">
      <nuxt-link
        class="tbadge tbadge--blue tbadge--small mb-1 mr-1"
        :to="`/industries/${industry.id}`"
        v-for="industry in firstFiveIndustries"
        :key="industry.id"
      >
        {{ industry.title }}
      </nuxt-link>
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
export default class Industries extends Vue {
  @Prop({ default: () => {} })
  data!: any

  get firstFiveIndustries() {
    return this.data.industries.slice(0, 5)
  }
}
</script>
