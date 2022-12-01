<template>
  <td class="px-6 py-3.5">
    <span class="whitespace-nowrap">{{ locationFormatted }}</span>
  </td>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import LabeledValue from '~/components/admin/LabeledValue.vue'
import { Location } from '~/graphql/GQLTypes'

@Component({
  components: {
    LabeledValue,
  },
})
export default class LocationColumn extends Vue {
  @Prop({ default: () => {} })
  data!: any

  get locationFormatted() {
    if (!this.data.location) {
      return ''
    }

    const location: Partial<Location> = this.data.location

    const result: any = []

    if (location.postal_code || location.city) {
      const city: any = []
      if (location.postal_code) {
        city.push(location.postal_code)
      }
      if (location.city) {
        city.push(location.city)
      }
      result.push(city.join(' '))
    }
    if (location.country) {
      result.push(location.country)
    }

    if (result.length === 0 && location.full_address) {
      result.push(location.full_address)
    }

    return result.join(', ')
  }
}
</script>
