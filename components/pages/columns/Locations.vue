<template>
  <td class="px-6 py-3.5">
    <div class="-mb-1 -mr-2">
      <div class="mb-1 mr-2" v-for="location in data.locations"> &middot; {{ location.full_address }} </div>
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
export default class Locations extends Vue {
  @Prop({ default: () => {} })
  data!: any
}
</script>
