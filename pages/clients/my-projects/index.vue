<template>
  <div class="container pt-5">
    <template v-if="runnerProjects.length > 0">
      <div class="flex w-full justify-between items-center mb-4 space-x-8">
        <h2 class="my-2 text-2xl font-normal text-gray-700">Running Interim Managers</h2>
      </div>
      <div class="grid gap-8 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 mb-16" ref="gridWrapper">
        <ProjectCardForClient v-for="project in runnerProjects" :key="'prt' + project.id" :project="project" />
      </div>
    </template>

    <div class="flex w-full justify-between items-center mb-4 space-x-8">
      <h2 class="my-2 text-2xl font-normal text-gray-700">Active Searches</h2>
    </div>
    <div class="grid gap-8 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4" ref="gridWrapper">
      <ProjectCardForClient v-for="project in activeProjects" :key="'prt' + project.id" :project="project" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { ClientProjectFragment, GetClientsProjectsQuery, UserRole } from '~/graphql/GQLTypes'
import GetClientsProjects from '~/graphql/ressources/projects/GetClientsProjects.gql'
import { apolloParseErrors } from '~/helpers/apolloParseErrors'
import ProjectCardForClient from '~/components/projects/ProjectCardForClient.vue'

@Component({
  components: {
    ProjectCardForClient,
  },
  async fetch(this: CandidatesProjects) {
    try {
      const { data } = await this.$apollo.query<GetClientsProjectsQuery>({
        query: GetClientsProjects,
      })
      this.activeProjects = data.me!.client!.active_projects!.data
      this.runnerProjects = data.me!.client!.runner_projects!.data
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
    requiredRole: UserRole.Client,
  },
})
export default class CandidatesProjects extends Vue {
  $refs!: {
    gridWrapper: HTMLDivElement
  }

  activeProjects: ClientProjectFragment[] = []
  runnerProjects: ClientProjectFragment[] = []
}
</script>
