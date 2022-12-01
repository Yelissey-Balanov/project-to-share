<template>
  <div class="container pt-5">
    <div class="flex w-full justify-between items-center mb-6 space-x-8">
      <h1 class="my-2">My projects</h1>
      <div class="whitespace-nowrap flex space-x-2">
        <!-- placeholder for buttons-->
      </div>
    </div>

    <div class="grid gap-8 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4" ref="gridWrapper">
      <nuxt-link
        :to="`/candidates/my-projects/${project.id}`"
        class="rounded-lg bg-white shadow-md hover:shadow-xl focus-within:shadow-xl mt-7 relative flex flex-col transition duration-200 ease-in-out hover:no-underline focus:no-underline outline-none"
        v-for="project in projectItems"
        :key="'prt' + project.id"
      >
        <div class="w-full px-5 -mt-7 flex justify-between items-center">
          <div class="flex space-x-1">
            <span class="px-2.5 py-0.5 bg-blue-600 text-xs text-white rounded shadow-xl" v-if="project.is_permanent">
              Permanent
            </span>
            <span class="px-2.5 py-0.5 bg-pink-600 text-xs text-white rounded shadow-xl" v-if="project.is_interim">
              Interim
            </span>
          </div>

          <div class="flex -space-x-3">
            <LImg
              class="shadow-lg w-14 h-14 overflow-hidden rounded-full bg-gray-200 ring-white ring-2"
              :image="project.company.logo ? project.company.logo.sizes.PROFILE_IMAGE : null"
              v-tooltip="project.company.aliasOrName"
            >
              <IHOfficeBuilding class="w-8 h-8 text-gray-400" />
            </LImg>
            <LImg
              v-for="client in project.clients"
              class="shadow-lg w-14 h-14 overflow-hidden rounded-full bg-gray-200 ring-white ring-2"
              :image="client.person.foto ? client.person.foto.sizes.PROFILE_IMAGE : null"
              :key="client.id"
              v-tooltip="client.person.full_name"
            >
              <IHUserFilled class="w-14 h-14 text-gray-400 mt-3" />
            </LImg>
          </div>
        </div>

        <div
          :class="
            'bg-white border absolute text-xs left-5 top-3.5 px-2.5 py-0.5 rounded-full ' +
            statusTextClass(project.status)
          "
        >
          {{ project.status | formatSnakeCaseString }}
        </div>

        <div class="divide-y pt-3 flex flex-col flex-auto">
          <div class="w-full px-5 py-3 text-center text-base text-gray-800 flex-auto flex items-center justify-center">
            {{ project.title }}
          </div>
          <div class="w-full px-5 py-2 flex justify-between items-center text-gray-500">
            <div class="flex -space-x-2"> Placement start </div>
            <span>{{ project.placed_start_at | date }}</span>
          </div>
        </div>
      </nuxt-link>
    </div>

    <FooterTablePagination class="my-6" :transparent="true" :pagination="paginatorInfo" @pageChanged="changePage" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { GetCandidatesProjectsQuery, GetCandidatesProjectsQueryVariables, Maybe, UserRole } from '~/graphql/GQLTypes'
import IHUserFilled from '~/components/globals/icons/heroicons/IHUserFilled.vue'
import IHOfficeBuilding from '~/components/globals/icons/heroicons/IHOfficeBuilding.vue'
import FooterTablePagination from '~/components/FooterTablePagination.vue'
import jump from 'jump.js'
import { statusTextColor } from '~/helpers/projectHelpers'
import GetCandidatesProjects from '~/graphql/ressources/projects/GetCandidatesProjects.gql'
import { apolloParseErrors } from '~/helpers/apolloParseErrors'

@Component({
  components: {
    FooterTablePagination,
    IHOfficeBuilding,
    IHUserFilled,
  },
  async fetch() {
    const $this = this as CandidatesProjects
    const variables: GetCandidatesProjectsQueryVariables = {
      first: 40,
      page: $this.pageToFetch,
    }

    try {
      const { data } = await $this.$apollo.query<GetCandidatesProjectsQuery>({
        query: GetCandidatesProjects,
        variables,
      })
      $this.projectItems = data.me!.candidate!.placed_projects!.data
      $this.paginatorInfo = data.me!.candidate!.placed_projects!.paginatorInfo
    } catch (err) {
      this.$bus.showErrorModal({
        errors: apolloParseErrors(err),
      })
    }
  },
  head() {
    return {
      title: 'My projects',
    }
  },
  middleware: 'auth',
  meta: {
    requiredRole: UserRole.Candidate,
  },
})
export default class CandidatesProjects extends Vue {
  $refs!: {
    gridWrapper: HTMLDivElement
  }

  projectItems: NonNullable<
    NonNullable<NonNullable<GetCandidatesProjectsQuery['me']>['candidate']>['placed_projects']
  >['data'] = []
  paginatorInfo: Maybe<
    NonNullable<
      NonNullable<NonNullable<GetCandidatesProjectsQuery['me']>['candidate']>['placed_projects']
    >['paginatorInfo']
  > = null
  pageToFetch = 1
  publicUrl = this.$config.publicUrl

  changePage(newPage: number) {
    this.pageToFetch = newPage
    this.$fetch()
    jump(this.$refs.gridWrapper, {
      duration: 300,
      offset: -24,
    })
  }

  statusTextClass(projectStatus) {
    return statusTextColor(projectStatus)
  }
}
</script>
