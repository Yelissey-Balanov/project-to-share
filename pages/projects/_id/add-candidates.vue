<template>
  <div v-if="project" class="container pt-5">
    <div class="flex w-full justify-between items-center mb-6 space-x-8">
      <nuxt-link :to="`/projects/${project.id}`" class="tbtn-icon tbtn--white" v-tooltip="'Back to Project'">
        <IHChevronLeft class="w-6 h-6" />
      </nuxt-link>
      <h1>Search new candidates for long list</h1>
      <div></div>
    </div>

    <div class="grid gap-6 mb-8 grid-cols-1 xl:grid-cols-11">
      <div class="xl:col-span-7 2xl:col-span-7 flex flex-col space-y-6">
        <div class="card">
          <div class="card-header">
            <div>
              <h3>Project information</h3>
              <p class="mt-1 text-sm text-gray-500">Details and requirements of the project.</p>
            </div>
            <div class="flex flex-col space-y-1 items-end self-start">
              <div class="flex space-x-1">
                <span class="px-2.5 py-0.5 bg-blue-600 text-xs text-white rounded shadow-xl" v-if="project.is_permanent"
                  >Permanent</span
                >
                <span class="px-2.5 py-0.5 bg-pink-600 text-xs text-white rounded shadow-xl" v-if="project.is_interim"
                  >Interim</span
                >
              </div>
            </div>
          </div>
          <div class="card-body">
            <div>
              <span class="card-item-title first-col-1-4">Project title</span>
              <span>{{ project.title }}</span>
            </div>
            <div>
              <span class="card-item-title first-col-1-4">Project start</span>
              <span>{{ dateFilter(project.project_start) }}</span>
            </div>
            <div v-if="project.industries.length > 0">
              <span class="card-item-title first-col-1-4">Industries</span>
              <span class="-mb-2 -mr-2">
                <nuxt-link
                  class="tbadge tbadge--blue mr-2 mb-2"
                  :to="`/industries/${industry.id}`"
                  v-for="industry in project.industries"
                  :key="`ind_${industry.id}`"
                >
                  {{ industry.title }}
                </nuxt-link>
              </span>
            </div>

            <div v-if="project.skills.length > 0">
              <span class="card-item-title first-col-1-4">Skills</span>
              <span class="-mb-2 -mr-2">
                <nuxt-link
                  class="tbadge tbadge--blue mr-2 mb-2"
                  :to="`/skills/${skill.id}`"
                  v-for="skill in project.skills"
                  :key="`skill_${skill.id}`"
                >
                  {{ skill.title }}
                </nuxt-link>
              </span>
            </div>

            <div v-if="project.certifications.length > 0">
              <span class="card-item-title first-col-1-4">Certifications</span>
              <span class="-mb-2 -mr-2">
                <nuxt-link
                  class="tbadge tbadge--blue mr-2 mb-2"
                  :to="`/certifications/${certification.id}`"
                  v-for="certification in project.certifications"
                  :key="`cert_${certification.id}`"
                >
                  {{ certification.title }}
                </nuxt-link>
              </span>
            </div>

            <div v-if="project.it_skills.length > 0">
              <span class="card-item-title first-col-1-4">IT Skills</span>
              <span class="-mb-2 -mr-2">
                <nuxt-link
                  class="tbadge tbadge--blue mr-2 mb-2"
                  :to="`/it-skills/${itSkill.id}`"
                  v-for="itSkill in project.it_skills"
                  :key="`itskill_${itSkill.id}`"
                >
                  {{ itSkill.title }}
                </nuxt-link>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="xl:col-span-4 2xl:col-span-4 flex flex-col space-y-6">
        <div class="card" v-if="project.is_interim">
          <div class="card-header">
            <div class="flex items-center space-x-4">
              <IHBriefcase class="w-6 h-6 text-gray-700" />
              <h3>Interim conditions</h3>
            </div>
          </div>
          <div class="card-body">
            <div>
              <span class="card-item-title first-col-1-3">Max daily rate</span>
              <span>{{ project.max_daily_rate | currency }}</span>
            </div>
            <div>
              <span class="card-item-title first-col-1-3">Expenses</span>
              <span>{{ project.expenses_included ? 'Included' : 'Not included' }}</span>
            </div>
          </div>
        </div>

        <div class="card" v-if="project.is_permanent">
          <div class="card-header">
            <div class="flex items-center space-x-4">
              <IHBriefcase class="w-6 h-6 text-gray-700" />
              <h3>Permanent conditions</h3>
            </div>
          </div>
          <div class="card-body">
            <div>
              <span class="card-item-title first-col-1-3">Max basic salary</span>
              <span>{{ project.max_basic_salary | currency }}</span>
            </div>
            <div>
              <span class="card-item-title first-col-1-3">Max bonus</span>
              <span>{{ project.max_bonus_eur | currency }}</span>
            </div>
            <div>
              <span class="card-item-title first-col-1-3">Business car</span>
              <span>{{ project.is_business_car_included ? 'Included' : 'Not included' }}</span>
            </div>
            <div v-if="project.fee_structure">
              <span class="card-item-title first-col-1-3">Fee structure</span>
              <span>{{ project.fee_structure }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-8">
      <h2>
        Suitable candidates
        <template v-if="paginatorInfo">({{ paginatorInfo.total }})</template>
      </h2>
      <div class="mt-4 flex flex-col">
        <TableWithSelectableColumns
          v-if="candidates && candidates.length > 0"
          :items="candidates"
          :paginator-info="paginatorInfo"
          :parent-data="project"
          :available-columns="availableColumnsCandidates"
          :row-actions="rowActions"
          :default-selected-columns="defaultSelectedColumns"
          :custom-row-bg="customRowBg"
          item-title="suitable candidates to project"
          item-type="candidate"
          @fetch="fetchNextCandidates($event)"
        >
        </TableWithSelectableColumns>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, State, Vue } from 'nuxt-property-decorator'

import GetProjectForAddingCandidates from '@/graphql/ressources/projects/GetProjectForAddingCandidates.gql'
import GetSuitableCandidatesForProject from '@/graphql/ressources/candidates/GetSuitableCandidatesForProject.gql'
import {
  GetProjectForAddingCandidatesQuery,
  GetSuitableCandidatesForProjectQuery,
  UserRole,
  Maybe,
  GetSuitableCandidatesForProjectQueryVariables,
  GetCandidatesQuery,
} from '~/graphql/GQLTypes'
import IHChevronLeft from '~/components/globals/icons/heroicons/IHChevronLeft.vue'
import IHBriefcase from '~/components/globals/icons/heroicons/IHBriefcase.vue'
import TableWithSelectableColumns, {
  ColumnsDefinition,
  RowActionDefinition,
} from '~/components/pages/TableWithSelectableColumns.vue'
import { SuitableCandidate } from '~/store'
import { apolloParseErrors } from '~/helpers/apolloParseErrors'
import { DateTime } from 'luxon'
import CandidateAddToProject from '~/components/pages/rowActions/CandidateAddToProject.vue'

@Component({
  components: {
    TableWithSelectableColumns,
    IHBriefcase,
    IHChevronLeft,
  },
  async asyncData({ app, route, store }) {
    const data: any = {
      projectId: Number.parseInt(route.params.id),
    }
    if (data.projectId) {
      try {
        const res = await app.apolloProvider!.defaultClient.query<GetProjectForAddingCandidatesQuery>({
          query: GetProjectForAddingCandidates,
          variables: {
            id: data.projectId,
          },
        })
        data.project = res.data.project
      } catch (e) {
        data.project = null
      }
    }
    store.commit('project/setProjectAdditionalData', data.project)
    return data
  },
  head() {
    let projectName = ''
    if ((this as AddCandidatesToProject).project) {
      const project = (this as AddCandidatesToProject).project!
      projectName = 'Search candidates for ' + project.title
    }
    return {
      title: projectName,
    }
  },
  middleware: 'auth',
  meta: {
    requiredRole: UserRole.Employee,
  },
})
export default class AddCandidatesToProject extends Vue {
  project: GetProjectForAddingCandidatesQuery['project'] = null
  dateFilter = this.$options.filters!.date
  paginatorInfo: Maybe<
    NonNullable<GetSuitableCandidatesForProjectQuery['suitableCandidatesForProject']>['paginatorInfo']
  > = null

  @State((state) => state.project.projectCandidates.suitable)
  candidates!: any[]

  @State((state) => state.project.projectAdditionalData.maxPossibleScore)
  maxPossibleScore!: number

  get availableColumnsCandidates(): ColumnsDefinition {
    return {
      title: {
        title: 'Name',
        component: 'CandidateNameWithPhoto',
        required: true,
      },
      // matching_score: {
      //   title: 'Matching Score',
      //   component: 'ProjectCandidateMatchingScore',
      // },
      gender: {
        title: 'Gender',
        component: 'Gender',
      },
      age: {
        title: 'Age',
        component: 'Age',
        class: 'w-[151px] min-w-[151px]',
      },
      industries: {
        title: 'Industries',
        class: 'min-w-[280px]',
        component: 'CandidateIndustriesMatchedMissing',
      },
      industries_additional: {
        title: 'Additional Industries',
        class: 'min-w-[280px]',
        component: 'CandidateIndustriesAdditional',
      },
      skills: {
        title: 'Skills',
        class: 'min-w-[280px]',
        component: 'CandidateSkillsMatchedMissing',
      },
      skills_additional: {
        title: 'Additional Skills',
        class: 'min-w-[280px]',
        component: 'CandidateSkillsAdditional',
      },
      certifications: {
        title: 'Certifications',
        class: 'min-w-[280px]',
        component: 'CandidateCertificationsMatchedMissing',
      },
      certifications_additional: {
        title: 'Additional Certifications',
        class: 'min-w-[280px]',
        component: 'CandidateCertificationsAdditional',
      },
      it_skills: {
        title: 'IT Skills',
        class: 'min-w-[280px]',
        component: 'CandidateItSkillsMatchedMissing',
      },
      it_skills_additional: {
        title: 'Additional IT Skills',
        class: 'min-w-[280px]',
        component: 'CandidateItSkillsAdditional',
      },
      list_of_cv: {
        title: 'List of CV documents',
        component: 'ListOfCV',
      },
      desired_position: {
        title: 'Desired position',
        component: 'DesiredPosition',
      },
      location: {
        title: 'Location',
        component: 'Location',
      },
      daily_rate: {
        title: 'Candidates daily rate / Max daily rate',
        component: 'CandidateSuitableDailyRate',
      },
      expenses_included: {
        title: 'Expenses included',
        component: 'CandidateSuitableExpensesIncluded',
      },
      available_from: {
        title: 'Available from / Project start',
        component: 'CandidateSuitableAvailableFrom',
      },
      basic_salary: {
        title: 'Candidates basic salary / Max basic salary',
        component: 'CandidateSuitableBasicSalary',
      },
      bonus_eur: {
        title: 'Candidates bonus / Max bonus',
        component: 'CandidateSuitableBonus',
      },
      is_business_car_included: {
        title: 'Business car included',
        component: 'CandidateSuitableIsBusinessCarIncluded',
      },
      period_of_notice: {
        title: 'Notice period',
        component: 'CandidateSuitableNoticePeriod',
      },
      next_possible_notice_to: {
        title: 'Next possible notice / Project start',
        component: 'CandidateSuitableNextPossibleNotice',
      },
      other_bonus: {
        title: 'Other bonuses',
        component: 'CandidateSuitableOtherBonus',
      },
    }
  }
  defaultSelectedColumns = ['gender', 'age', 'desired_position', 'location', 'list_of_cv']

  rowActions: RowActionDefinition[] = [
    {
      component: CandidateAddToProject,
      callback: (candidate) => {
        this.$bus.openEventFormModal(candidate, null)
      },
    },
  ]

  mounted() {
    // redirect to overview, if queried id was not found
    if (!this.project) {
      this.$router.push('/projects')
      return
    }
    this.fetchNextCandidates()
  }

  customRowBg = (
    candidateRow: NonNullable<GetSuitableCandidatesForProjectQuery['suitableCandidatesForProject']>['data'][0]
  ) => {
    if (candidateRow.is_blacklisted) {
      return 'bg-red-50'
    } else if (
      candidateRow.caution
      // || candidateRow.offset // todo: <-- this comes later, include it when it becomes available
    ) {
      return 'bg-yellow-50'
    }
    return 'bg-white'
  }

  fetchNextCandidates(page?: number) {
    const variables: GetSuitableCandidatesForProjectQueryVariables = {
      projectId: this.project!.id,
      first: 20,
      page: page ? page : 1,
    }

    this.$apollo
      .query<GetSuitableCandidatesForProjectQuery>({
        query: GetSuitableCandidatesForProject,
        variables,
      })
      .then(({ data }) => {
        this.paginatorInfo = data.suitableCandidatesForProject!.paginatorInfo
        this.$store.commit('project/setSuitableCandidates', {
          candidates: data.suitableCandidatesForProject!.data,
        })
      })
      .catch((err) => {
        this.$bus.showErrorModal({
          errors: apolloParseErrors(err),
        })
      })
  }

  beforeDestroy() {
    this.$store.commit('project/setSuitableCandidates', undefined)
  }
}
</script>
