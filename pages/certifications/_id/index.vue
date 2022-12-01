<template>
  <div v-if="certification" class="container pt-5">
    <div class="flex w-full justify-between items-center mb-6 space-x-8">
      <nuxt-link to="/certifications" class="tbtn-icon tbtn--white">
        <IHChevronLeft class="w-6 h-6" />
      </nuxt-link>
      <h1>{{ certification.title }}</h1>
      <div class="flex items-center space-x-2">
        <nuxt-link :to="`/certifications/${certification.id}/form`" class="tbtn-icon tbtn--blue" v-tooltip="'Edit'">
          <IHPencil class="w-6 h-6" />
        </nuxt-link>
      </div>
    </div>

    <div>
      <div class="alert alert-warning" v-if="!certification.is_reviewed">
        This certification was not reviewed after creation.
        <nuxt-link :to="`/certifications/${certification.id}/form`">Update certification details here.</nuxt-link>
        Or simply
        <button class="underline" @click="markAsReviewed">mark it as reviewed.</button>
      </div>

      <div
        class="alert alert-info"
        v-if="certification.synonyms.length > 0 && !certification.synonym_representative_id"
      >
        This certification is the representative of synonyms.
      </div>
    </div>

    <div class="mb-8 flex flex-col space-y-6">
      <div class="card">
        <div class="card-header">
          <div>
            <h3>Certification information</h3>
          </div>
        </div>
        <div class="card-body">
          <div>
            <span class="card-item-title first-col-1-4">Title</span>
            <span>
              {{ certification.title }}
            </span>
          </div>
          <div v-if="certification.synonyms.length > 0">
            <span class="card-item-title first-col-1-4">Synonyms</span>
            <span class="-mb-2 -mr-2">
              <nuxt-link
                class="tbadge tbadge--blue mr-2 mb-2"
                :to="`/certifications/${synonym.id}`"
                v-for="synonym in certification.synonyms"
                :key="`synonym_${synonym.id}`"
              >
                {{ synonym.title }}
                <span v-if="!synonym.synonym_representative_id" class="ml-2">representative</span>
              </nuxt-link>
            </span>
          </div>
          <div v-if="certification.parent">
            <span class="card-item-title first-col-1-4">Parent</span>
            <nuxt-link :to="`/certifications/${certification.parent.id}`">
              {{ certification.parent.title }}
            </nuxt-link>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div>
            <h3>
              Children
              <span class="text-gray-500">&middot; {{ certification.children.length }}</span>
            </h3>
          </div>
        </div>
        <table v-if="certification.children.length > 0" class="bg-white w-full overflow-hidden rounded-b-lg">
          <div class="card-body">
            <tr class="text-left">
              <th class="w-1/2">Title</th>
              <th class="w-1/2">Synonyms</th>
            </tr>
            <tr v-for="child in certification.children" :key="child.id">
              <td class="w-1/2 items-center">
                <nuxt-link :to="`/certifications/${child.id}`">
                  {{ child.title }}
                </nuxt-link>
              </td>
              <td class="w-1/2 items-center">
                <span class="-mb-2 -mr-2">
                  <nuxt-link
                    class="tbadge tbadge--blue mr-2 mb-2"
                    :to="`/certifications/${synonym.id}`"
                    v-for="synonym in child.synonyms"
                    :key="`synonym_${synonym.id}`"
                  >
                    {{ synonym.title }}
                  </nuxt-link>
                </span>
              </td>
            </tr>
          </div>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, State, Vue } from 'nuxt-property-decorator'

import GetCertificationForView from '@/graphql/ressources/certifications/GetCertificationForView.gql'
import {
  GetCertificationForViewQuery,
  UpdateCertificationMutation,
  UpdateCertificationMutationVariables,
  UserRole,
} from '~/graphql/GQLTypes'
import UpdateCertification from '~/graphql/ressources/certifications/UpdateCertification.gql'
import IHChevronLeft from '~/components/globals/icons/heroicons/IHChevronLeft.vue'
import IHPencil from '~/components/globals/icons/heroicons/IHPencil.vue'

@Component({
  components: {
    IHPencil,
    IHChevronLeft,
  },
  async asyncData({ app, route }) {
    const data: any = {
      certificationId: Number.parseInt(route.params.id),
    }
    if (data.certificationId) {
      const res = await app.apolloProvider!.defaultClient.query<GetCertificationForViewQuery>({
        query: GetCertificationForView,
        variables: {
          id: data.certificationId,
        },
      })
      data.certification = res.data.certification
    }
    return data
  },
  head() {
    return {
      title: (this as CertificationView).certification!.title,
    }
  },
  middleware: 'auth',
  meta: {
    requiredRole: UserRole.Employee,
  },
})
export default class CertificationView extends Vue {
  certification: GetCertificationForViewQuery['certification'] = null

  @State((state) => state.certification.overviewQueryParams)
  overviewQueryParams: any

  private isSubmitting = false

  mounted() {
    // redirect to overview, if queried id was not found
    if (!this.certification) {
      this.$router.push('/certifications')
      return
    }
  }

  async markAsReviewed() {
    if (this.isSubmitting) {
      return
    }
    this.isSubmitting = true

    const variables: UpdateCertificationMutationVariables = {
      id: this.certification!.id,
      input: {},
    }

    const { data } = await this.$apollo.mutate<UpdateCertificationMutation>({
      mutation: UpdateCertification,
      variables,
    })

    this.isSubmitting = false
    this.certification!.is_reviewed = true
    this.$store.commit('certification/decreaseNotReviewedCounter')
  }
}
</script>
