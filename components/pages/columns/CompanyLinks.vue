<template>
  <td class="px-6 py-3.5 space-y-1 whitespace-nowrap">
    <a class="block" :href="sanitizedWebsite" target="_blank" v-if="data.website">Website</a>
    <a class="block" :href="sanitizedJobExternalLink" target="_blank" v-if="data.jobs_external_link">Company jobs</a>
  </td>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import LabeledValue from '~/components/admin/LabeledValue.vue'
import sanitizeUrl from '~/helpers/sanitizeUrl'

@Component({
  components: {
    LabeledValue,
  },
})
export default class CompanyLinks extends Vue {
  @Prop({ default: () => {} })
  data!: any

  get sanitizedWebsite() {
    return sanitizeUrl(this.data.website)
  }
  get sanitizedJobExternalLink() {
    return sanitizeUrl(this.data.jobs_external_link)
  }
}
</script>
