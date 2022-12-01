<template>
  <td class="px-6 py-3.5">
    <span class="flex items-center space-x-1 whitespace-nowrap">
      <span
        class="tbadge"
        :class="statusBadgeColor"
        v-if="data.buttonStatus.removeFromLonglist !== ButtonStatus.PROCESSED"
      >
        {{ data.candidate_project_pivot.status | formatSnakeCaseString }}
      </span>
      <span class="tbadge tbadge--red" v-else>Removed</span>
      <span class="tbadge tbadge--yellow" v-if="data.is_research">Research candidate</span>
    </span>
  </td>
</template>

<script lang="ts">
import { CandidateStatusInProject } from '@/graphql/GQLTypes'
import { ButtonStatus, CandidateInList } from '~/store'
import { Component, Prop, Vue } from 'vue-property-decorator'
import IHUserFilled from '~/components/globals/icons/heroicons/IHUserFilled.vue'

@Component({
  components: {
    IHUserFilled,
  },
})
export default class ProjectCandidateStatus extends Vue {
  CandidateStatusInProject = CandidateStatusInProject
  ButtonStatus = ButtonStatus

  @Prop({ default: () => {} })
  data!: any

  get statusBadgeColor() {
    switch (this.data!.candidate_project_pivot!.status) {
      case CandidateStatusInProject.RejectedByBlackbull:
      case CandidateStatusInProject.RejectedByClient:
        return 'tbadge--red'
      case CandidateStatusInProject.RejectedByCandidate:
        return 'tbadge--pink'
      case CandidateStatusInProject.OnHold:
        return 'tbadge--yellow'
      case CandidateStatusInProject.Placed:
        return 'tbadge--green'
      default:
        return 'tbadge--blue'
    }
  }
}
</script>
