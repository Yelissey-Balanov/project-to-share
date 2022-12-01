<template>
  <div>
    <div class="grid gap-6 mb-6 grid-cols-1 xl:grid-cols-11">
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
              <span :class="'border px-2.5 py-0.5 rounded-full ' + statusTextClass">
                {{ project.status | formatSnakeCaseString }}
              </span>
            </div>
          </div>
          <div class="card-body">
            <div>
              <span class="card-item-title first-col-1-4">Title</span>
              <span>{{ project.title }}</span>
            </div>

            <div>
              <span class="card-item-title first-col-1-4">Project duration</span>
              <span>
                {{ [project.project_start, project.project_end] | dateRange }}
              </span>
            </div>

            <div>
              <span class="card-item-title first-col-1-4">Retainer</span>
              <span>{{ project.retain | currency }}</span>
            </div>

            <div v-if="project.industries.length > 0">
              <span class="card-item-title first-col-1-4">Industries</span>
              <span class="-mb-2 -mr-2">
                <span
                  class="tbadge tbadge--blue mr-2 mb-2"
                  v-for="industry in project.industries"
                  :key="`ind_${industry.id}`"
                >
                  {{ industry.title }}
                </span>
              </span>
            </div>

            <div v-if="project.skills.length > 0">
              <span class="card-item-title first-col-1-4">Skills</span>
              <span class="-mb-2 -mr-2">
                <span class="tbadge tbadge--blue mr-2 mb-2" v-for="skill in project.skills" :key="`skill_${skill.id}`">
                  {{ skill.title }}
                </span>
              </span>
            </div>

            <div v-if="project.certifications.length > 0">
              <span class="card-item-title first-col-1-4">Certifications</span>
              <span class="-mb-2 -mr-2">
                <span
                  class="tbadge tbadge--blue mr-2 mb-2"
                  v-for="certification in project.certifications"
                  :key="`cert_${certification.id}`"
                >
                  {{ certification.title }}
                </span>
              </span>
            </div>

            <div v-if="project.it_skills.length > 0">
              <span class="card-item-title first-col-1-4">IT Skills</span>
              <span class="-mb-2 -mr-2">
                <span
                  class="tbadge tbadge--blue mr-2 mb-2"
                  v-for="itSkill in project.it_skills"
                  :key="`itskill_${itSkill.id}`"
                >
                  {{ itSkill.title }}
                </span>
              </span>
            </div>

            <div v-if="project.languages.length > 0">
              <span class="card-item-title first-col-1-4">Languages</span>
              <span>
                <ul class="space-y-2">
                  <li v-for="language in project.languages">
                    <span>{{ language.name }}</span>
                    <span class="text-gray-500" v-if="language.language_pivot.level">
                      &middot; {{ language.language_pivot.level | formatSnakeCaseString }}
                    </span>
                  </li>
                </ul>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="xl:col-span-4 2xl:col-span-4 flex flex-col space-y-6">
        <div class="card" v-for="client in project.clients" :key="client.id">
          <div class="card-header">
            <div class="flex items-center space-x-4">
              <IHUserCircle class="w-6 h-6 text-gray-700" />
              <h3>Client information</h3>
            </div>

            <div class="flex -space-x-3 -my-2"  >
              <LImg
                class="w-14 h-14 overflow-hidden rounded-full bg-gray-200 ring-white ring-2"
                :image="project.company.logo ? project.company.logo.sizes.PROFILE_IMAGE : null"
                v-tooltip="project.company.aliasOrName"
              >
                <IHOfficeBuilding class="w-8 h-8 text-gray-400" />
              </LImg>
              <LImg
                class="w-14 h-14 overflow-hidden rounded-full bg-gray-200 ring-white ring-2"
                :image="client.person.foto ? client.person.foto.sizes.PROFILE_IMAGE : null"
                v-tooltip="client.person.full_name"
              >
                <IHUserFilled class="w-14 h-14 text-gray-400 mt-3" />
              </LImg>
            </div>
          </div>
          <div class="card-body">
            <div>
              <span class="card-item-title first-col-1-3">Name</span>
              <span>{{ client.person.full_name }}</span>
            </div>
            <div v-if="client.position">
              <span class="card-item-title first-col-1-3">Position</span>
              <span>{{ client.position }}</span>
            </div>
            <div>
              <span class="card-item-title first-col-1-3">Company</span>
              <span>{{ project.company.aliasOrName }}</span>
            </div>
          </div>
        </div>

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

        <!--          TODO: Faith und Sven fragen, ob Dokumente hier ersichtlich sein sollen? -->
        <!--          <div class="rounded-lg bg-white shadow-md">-->
        <!--            <div class="px-6 py-5 border-b flex items-center justify-between space-x-6 relative">-->
        <!--              <div class="flex items-center space-x-4">-->
        <!--                <IHFolder class="w-6 h-6 text-gray-700" />-->
        <!--                <h3>Documents</h3>-->
        <!--              </div>-->

        <!--              &lt;!&ndash;            <button class="tbtn-icon tbtn&#45;&#45;transparent tbtn&#45;&#45;green tbtn-icon&#45;&#45;small">&ndash;&gt;-->
        <!--              &lt;!&ndash;              <IHPlus class="w-5 h-5" />&ndash;&gt;-->
        <!--              &lt;!&ndash;            </button>&ndash;&gt;-->
        <!--            </div>-->
        <!--            <DocumentsWrapper-->
        <!--              class="divide-y"-->
        <!--              :documents="project.documents"-->
        <!--              :is-parsing-info-enabled="true"-->
        <!--              :is-sharing-enabled="true"-->
        <!--            >-->
        <!--              <template v-slot:document="slotProps">-->
        <!--                <DocumentRow class="px-6 py-3" v-bind="slotProps" />-->
        <!--              </template>-->
        <!--            </DocumentsWrapper>-->
        <!--          </div>-->

        <div class="card">
          <div class="card-header">
            <div class="flex items-center space-x-4">
              <IHUserGroup class="w-6 h-6 text-gray-700" />
              <h3>Contact person</h3>
            </div>
          </div>

          <div class="card-body">
            <div
              class="flex justify-between items-center space-x-4"
              v-for="consultant in project.users"
              :key="consultant.id"
            >
              <div class="flex items-center">
                <LImg
                  class="flex-none flex items-center justify-center bg-blue-100 ring-white ring-1 text-blue-600 w-14 h-14 rounded-full overflow-hidden mr-4"
                  :image="consultant.foto ? consultant.foto.sizes.PROFILE_IMAGE : null"
                >
                  {{ consultant.firstname.substr(0, 1) }}{{ consultant.lastname.substr(0, 1) }}
                </LImg>

                <div>
                  <span>{{ consultant.firstname }} {{ consultant.lastname }}</span>
                  <span class="text-gray-500 flex items-center space-x-2 mt-1" v-if="consultant.contact_number">
                    <IHPhone class="w-4 h-4 mb-0.5" />
                    <span>{{ consultant.contact_number }}</span>
                  </span>
                </div>
              </div>

              <div class="flex items-center space-x-2 !flex-none">
                <a
                  class="tbtn-icon tbtn--white tbtn-icon--small"
                  :href="`mailto:${consultant.contact_email}`"
                  v-tooltip="`Mail to ${consultant.firstname} ${consultant.lastname}`"
                  v-if="consultant.contact_email"
                >
                  <IHMail class="w-5 h-5" />
                </a>
                <a
                  class="tbtn-icon tbtn--white tbtn-icon--small"
                  :href="`tel:${consultant.contact_number}`"
                  v-tooltip="`Call ${consultant.firstname} ${consultant.lastname}`"
                  v-if="consultant.contact_number"
                >
                  <IHPhone class="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Tabs class="mt-8 mb-8" ref="candidateTabs">
      <template v-slot:header>
        <h2>Candidates</h2>
      </template>
      <Tab :title="`Placed`" v-if="projectHasPlacement && project.placed_candidate">
        <div class="mt-4 flex flex-col">
          <PlacedCandidateInProjectClient :candidate="project.placed_candidate" :project="project" />
        </div>
      </Tab>

      <Tab :title="`Short list · ${projectCandidates.shortlist.length}`" v-if="projectCandidates.shortlist.length > 0">
        <div class="mt-4 flex flex-col">
          <CandidateInProjectListClient
            v-for="candidate in projectCandidates.shortlist"
            :project="project"
            :candidate="candidate"
            :key="`SLCN_${candidate.id}`"
          />
        </div>
      </Tab>

      <Tab
        :title="`Long list · ${projectCandidates.longlist.length}`"
        v-if="showLongListTab && projectCandidates.longlist.length > 0"
      >
        <div class="mt-4 flex flex-col">
          <CandidateInProjectListClient
            v-for="candidate in projectCandidates.longlist"
            :project="project"
            :candidate="candidate"
            :key="`SLCN_${candidate.id}`"
          />
        </div>
      </Tab>
    </Tabs>
    <div
      class="-mt-8 mb-8"
      v-if="
        projectCandidates.shortlist.length === 0 && projectCandidates.longlist.length === 0 && !project.placed_candidate
      "
    >
      There is no data to display yet.
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import Vue from 'vue'
import CandidateInProjectListClient from '~/components/candidates/CandidateInProjectListClient.vue'
import Tabs from '~/components/Tabs.vue'
import Tab from '~/components/Tab.vue'
import IHUserCircle from '~/components/globals/icons/heroicons/IHUserCircle.vue'
import IHOfficeBuilding from '~/components/globals/icons/heroicons/IHOfficeBuilding.vue'
import IHUserFilled from '~/components/globals/icons/heroicons/IHUserFilled.vue'
import IHBriefcase from '~/components/globals/icons/heroicons/IHBriefcase.vue'
import IHUserGroup from '~/components/globals/icons/heroicons/IHUserGroup.vue'
import IHPhone from '~/components/globals/icons/heroicons/IHPhone.vue'
import IHMail from '~/components/globals/icons/heroicons/IHMail.vue'
import { GetProjectByTokenQuery, GetProjectForClientQuery, ProjectStatus } from '~/graphql/GQLTypes'
import { State } from 'nuxt-property-decorator'
import { ProjectState } from '~/store'
import { statusTextColor } from '~/helpers/projectHelpers'
import PlacedCandidateInProjectClient from '~/components/candidates/PlacedCandidateInProjectClient.vue'
@Component({
  components: {
    PlacedCandidateInProjectClient,
    IHMail,
    IHPhone,
    IHUserGroup,
    IHBriefcase,
    IHUserFilled,
    IHOfficeBuilding,
    IHUserCircle,
    Tab,
    Tabs,
    CandidateInProjectListClient,
  },
})
export default class ProjectViewForClient extends Vue {
  @Prop()
  project: GetProjectByTokenQuery['getProjectByToken'] | GetProjectForClientQuery['project']

  @Prop({ default: false })
  showLongListTab!: Boolean

  @State((state) => state.project.projectCandidates)
  projectCandidates!: ProjectState['projectCandidates']

  get projectHasPlacement() {
    return (
      this.project &&
      [ProjectStatus.Placed, ProjectStatus.Runner, ProjectStatus.Completed].includes(this.project.status)
    )
  }

  get statusTextClass() {
    if (!this.project) {
      return ''
    }
    return statusTextColor(this.project.status)
  }
}
</script>
