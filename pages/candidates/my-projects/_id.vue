<template>
  <div v-if="project" class="container pt-5">
    <div class="flex w-full justify-between items-center mb-6 space-x-8">
      <nuxt-link to="/candidate/my-projects" class="tbtn-icon tbtn--white">
        <IHChevronLeft class="w-6 h-6" />
      </nuxt-link>

      <h1 class="my-2">{{ project.title }}</h1>
      <div class="flex items-center space-x-2">
        <!-- Action buttons goes here-->
      </div>
    </div>

    <ProjectViewForCandidate :project="project" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import GetProjectForCandidate from '~/graphql/ressources/projects/GetProjectForCandidate.gql'
import { GetProjectForCandidateQuery, UserRole } from '~/graphql/GQLTypes'
import IHChevronLeft from '~/components/globals/icons/heroicons/IHChevronLeft.vue'
import ProjectViewForCandidate from '../../../components/projects/ProjectViewForCandidate.vue'

@Component({
  components: {
    IHChevronLeft,
    ProjectViewForCandidate,
  },
  async asyncData({ app, route, store, error }) {
    const data: any = {
      projectId: Number.parseInt(route.params.id),
    }
    if (data.projectId) {
      try {
        const res = await app.apolloProvider!.defaultClient.query<GetProjectForCandidateQuery>({
          query: GetProjectForCandidate,
          variables: {
            projectId: data.projectId,
          },
        })
        data.project = res.data.project
      } catch (e) {
        return error({ statusCode: 404 })
      }
    }
    // store.commit('project/setProjectAdditionalData', data.project)

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
    requiredRole: UserRole.Candidate,
  },
})
export default class ProjectsView extends Vue {
  projectId!: number
  project: GetProjectForCandidateQuery['project'] = null

  // if ($this.$refs.candidateTabs && $this.projectCandidates.shortlist.length === 0) {
  //   $this.$refs.candidateTabs.selectTab(1)
  // }

  mounted() {}
}
</script>
