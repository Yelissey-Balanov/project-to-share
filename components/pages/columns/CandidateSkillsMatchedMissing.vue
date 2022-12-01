<template>
  <td class="px-6 py-3.5">
    <span v-if="data.skills.length > 0" class="-mb-1 -mr-1">
      <span
        class="tbadge tbadge--green tbadge--small mb-1 mr-1"
        v-for="skill in data.skillsCalculated.match"
        :key="skill"
      >
        {{ skill }}
      </span>
      <span
        class="tbadge tbadge--red tbadge--small mb-1 mr-1"
        v-for="skill in data.skillsCalculated.missing"
        :key="skill"
      >
        {{ skill }}
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
export default class CandidateSkillsMatchedMissing extends Vue {
  @Prop({ default: () => {} })
  data!: any
}
</script>
