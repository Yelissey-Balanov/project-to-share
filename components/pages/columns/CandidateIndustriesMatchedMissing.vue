<template>
  <td class="px-6 py-3.5">
    <span v-if="data.industries.length > 0" class="-mb-1 -mr-1">
      <span
        class="tbadge tbadge--green tbadge--small mb-1 mr-1"
        v-for="industry in data.industriesCalculated.match"
        :key="industry"
      >
        {{ industry }}
      </span>
      <span
        class="tbadge tbadge--red tbadge--small mb-1 mr-1"
        v-for="industry in data.industriesCalculated.missing"
        :key="industry"
      >
        {{ industry }}
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
export default class CandidateIndustriesMatchedMissing extends Vue {
  @Prop({ default: () => {} })
  data!: any
}
</script>
