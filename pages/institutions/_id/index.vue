<template>
  <div v-if="institution" class="container pt-5">
    <div class="flex w-full justify-between items-center mb-6 space-x-8">
      <nuxt-link to="/institutions" class="tbtn-icon tbtn--white">
        <IHChevronLeft class="w-6 h-6" />
      </nuxt-link>
      <h1>{{ institution.name }}</h1>
      <div class="flex items-center space-x-2">
        <nuxt-link :to="`/institutions/${institution.id}/form`" class="tbtn-icon tbtn--blue" v-tooltip="'Edit'">
          <IHPencil class="w-6 h-6" />
        </nuxt-link>
      </div>
    </div>
    <div>
      <div class="alert alert-warning" v-if="!institution.is_reviewed">
        This institution was not reviewed after creation.
        <nuxt-link :to="`/institutions/${institution.id}/form`">Update institution details here.</nuxt-link>
        Or simply
        <button class="underline" @click="markAsReviewed">mark it as reviewed.</button>
      </div>
    </div>

    <div class="mb-8 flex flex-col space-y-6">
      <div class="card">
        <div class="card-header">
          <div>
            <h3>Institution information</h3>
          </div>
        </div>
        <div class="card-body">
          <div>
            <span class="card-item-title first-col-1-4">Name</span>
            <span>
              {{ institution.name }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, State, Vue } from 'nuxt-property-decorator'
import GetInstitutionForView from '@/graphql/ressources/institutions/GetInstitutionForView.gql'
import {
  GetInstitutionForViewQuery,
  UpdateInstitutionMutation,
  UpdateInstitutionMutationVariables,
  UserRole,
} from '~/graphql/GQLTypes'
import UpdateInstitution from '~/graphql/ressources/institutions/UpdateInstitution.gql'
import IHPencil from '~/components/globals/icons/heroicons/IHPencil.vue'
import IHChevronLeft from '~/components/globals/icons/heroicons/IHChevronLeft.vue'

@Component({
  components: {
    IHChevronLeft,
    IHPencil,
  },
  async asyncData({ app, route }) {
    const data: any = {
      institutionId: Number.parseInt(route.params.id),
    }
    if (data.institutionId) {
      const res = await app.apolloProvider!.defaultClient.query<GetInstitutionForViewQuery>({
        query: GetInstitutionForView,
        variables: {
          id: data.institutionId,
        },
      })
      data.institution = res.data.institution
    }
    return data
  },
  head() {
    return {
      title: (this as InstitutionView).institution!.name,
    }
  },
  middleware: 'auth',
  meta: {
    requiredRole: UserRole.Employee,
  },
})
export default class InstitutionView extends Vue {
  institution: GetInstitutionForViewQuery['institution'] = null

  @State((state) => state.institution.overviewQueryParams)
  overviewQueryParams: any

  private isSubmitting = false

  mounted() {
    // redirect to overview, if queried id was not found
    if (!this.institution) {
      this.$router.push('/institutions')
      return
    }
  }

  async markAsReviewed() {
    if (this.isSubmitting) {
      return
    }
    this.isSubmitting = true

    const variables: UpdateInstitutionMutationVariables = {
      id: this.institution!.id,
      input: {},
    }

    const { data } = await this.$apollo.mutate<UpdateInstitutionMutation>({
      mutation: UpdateInstitution,
      variables,
    })

    this.isSubmitting = false
    this.institution!.is_reviewed = true
    this.$store.commit('institution/decreaseNotReviewedCounter')
  }
}
</script>
