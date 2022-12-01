<template>
  <td class="px-6 py-3.5">
    <span v-if="data.certifications.length > 0" class="-mb-1 -mr-1">
      <span
        class="tbadge tbadge--green tbadge--small mb-1 mr-1"
        v-for="certification in data.certificationsCalculated.match"
        :key="certification"
      >
        {{ certification }}
      </span>
      <span
        class="tbadge tbadge--red tbadge--small mb-1 mr-1"
        v-for="certification in data.certificationsCalculated.missing"
        :key="certification"
      >
        {{ certification }}
      </span>
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
export default class CandidateCertificationsMatchedMissing extends Vue {
  @Prop({ default: () => {} })
  data!: any
}
</script>
