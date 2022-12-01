<template>
  <td class="px-6 py-3.5">
    <span v-if="data.certificationsCalculated" class="-mb-1 -mr-1">
      <span
        class="tbadge tbadge--small mb-1 mr-1"
        v-for="certification in data.certificationsCalculated.extra"
        :key="certification"
      >
        {{ certification }}
      </span>
    </span>
  </td>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
@Component({})
export default class CandidateCertificationsAdditional extends Vue {
  @Prop({ default: () => {} })
  data!: any
}
</script>
