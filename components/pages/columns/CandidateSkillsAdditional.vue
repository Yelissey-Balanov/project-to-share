<template>
  <td class="px-6 py-3.5">
    <span v-if="data.skillsCalculated" class="-mb-1 -mr-1">
      <span class="tbadge tbadge--small mb-1 mr-1" v-for="skill in data.skillsCalculated.extra" :key="skill">
        {{ skill }}
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
export default class CandidateSkillsAdditional extends Vue {
  @Prop({ default: () => {} })
  data!: any
}
</script>
