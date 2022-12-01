<template>
  <div v-if="project" class="container pt-5">
    <div class="flex w-full justify-between items-center mb-6 space-x-8">
      <nuxt-link to="/clients/my-projects" class="tbtn-icon tbtn--white">
        <IHChevronLeft class="w-6 h-6" />
      </nuxt-link>

      <h1 class="my-2">{{ project.title }}</h1>
      <div class="flex items-center space-x-2">
        <!-- Action buttons goes here-->
      </div>
    </div>

    <ProjectViewForClient :project="project" :showLongListTab="clientHasAccessToLongList" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import GetProjectForClient from '~/graphql/ressources/projects/GetProjectForClient.gql'
import { GetProjectForClientQuery, UserRole } from '~/graphql/GQLTypes'
import IHChevronLeft from '~/components/globals/icons/heroicons/IHChevronLeft.vue'
import ProjectViewForClient from '../../../components/projects/ProjectViewForClient.vue'

@Component({
  components: {
    IHChevronLeft,
    ProjectViewForClient,
  },
  async asyncData({ app, route, store, error }) {
    const data: any = {
      projectId: Number.parseInt(route.params.id),
    }
    if (data.projectId) {
      try {
        const res = await app.apolloProvider!.defaultClient.query<GetProjectForClientQuery>({
          query: GetProjectForClient,
          variables: {
            projectId: data.projectId,
          },
        })
        data.project = res.data.project
      } catch (e) {
        return error({ statusCode: 404 })
      }
    }
    store.commit('project/setProjectAdditionalData', data.project)
    store.commit(
      'project/setProjectCandidates',
      data.project!.candidates.length > 0 ? data.project!.candidates : data.project!.shortlisted_candidates
    )

    return data
  },
  head() {
    let projectName = ''
    if ((this as ProjectsView).project) {
      const project = (this as ProjectsView).project!
      projectName = project.title
    }
    return {
      title: projectName,
    }
  },
  middleware: 'auth',
  meta: {
    requiredRole: UserRole.Client,
  },
})
export default class ProjectsView extends Vue {
  projectId!: number
  project: GetProjectForClientQuery['project'] = null

  // if ($this.$refs.candidateTabs && $this.projectCandidates.shortlist.length === 0) {
  //   $this.$refs.candidateTabs.selectTab(1)
  // }

  mounted() {}

  get clientHasAccessToLongList() {
    if (!this.project) {
      return false
    }
    const client = this.project.clients.find((client) => client.user_id === this.$store.state.account.user.id)
    return client && client.client_project_pivot!.has_long_list_access
  }
}
</script>
