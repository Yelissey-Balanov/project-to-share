<template>
  <td class="px-6 py-3.5">
    <span v-if="data.itSkillsCalculated" class="-mb-1 -mr-1">
      <span class="tbadge tbadge--small mb-1 mr-1" v-for="it_skill in data.itSkillsCalculated.extra" :key="it_skill">
        {{ it_skill }}
      </span>
    </span>
  </td>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  components: {
  },
})
export default class CandidateItSkillsAdditional extends Vue {
  @Prop({ default: () => {} })
  data!: any
}
</script>
