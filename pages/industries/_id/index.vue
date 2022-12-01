<template>
  <div v-if="industry" class="container pt-5">
    <div class="flex w-full justify-between items-center mb-6 space-x-8">
      <nuxt-link to="/industries" class="tbtn-icon tbtn--white">
        <IHChevronLeft class="w-6 h-6" />
      </nuxt-link>
      <h1>{{ industry.title }}</h1>
      <div class="flex items-center space-x-2">
        <nuxt-link :to="`/industries/${industry.id}/form`" class="tbtn-icon tbtn--blue" v-tooltip="'Edit'">
          <IHPencil class="w-6 h-6" />
        </nuxt-link>
      </div>
    </div>

    <div>
      <div class="alert alert-warning" v-if="!industry.is_reviewed">
        This industry was not reviewed after creation.
        <nuxt-link :to="`/industries/${industry.id}/form`">Update industry details here.</nuxt-link>
        Or simply
        <button class="underline" @click="markAsReviewed">mark it as reviewed.</button>
      </div>

      <div class="alert alert-info" v-if="industry.synonyms.length > 0 && !industry.synonym_representative_id">
        This industry is the representative of synonyms.
      </div>
    </div>

    <div class="mb-8 flex flex-col space-y-6">
      <div class="card">
        <div class="card-header">
          <div>
            <h3>Industry information</h3>
          </div>
        </div>
        <div class="card-body">
          <div>
            <span class="card-item-title first-col-1-4">Title</span>
            <span>
              {{ industry.title }}
            </span>
          </div>
          <div v-if="industry.synonyms.length > 0">
            <span class="card-item-title first-col-1-4">Synonyms</span>
            <span class="-mb-2 -mr-2">
              <nuxt-link
                class="tbadge tbadge--blue mr-2 mb-2"
                :to="`/industries/${synonym.id}`"
                v-for="synonym in industry.synonyms"
                :key="`synonym_${synonym.id}`"
              >
                {{ synonym.title }}
                <span v-if="!synonym.synonym_representative_id" class="ml-2">representative</span>
              </nuxt-link>
            </span>
          </div>
          <div v-if="industry.parent">
            <span class="card-item-title first-col-1-4">Parent</span>
            <nuxt-link :to="`/industries/${industry.parent.id}`">
              {{ industry.parent.title }}
            </nuxt-link>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div>
            <h3>
              Children
              <span class="text-gray-500">&middot; {{ industry.children.length }}</span>
            </h3>
          </div>
        </div>
        <table v-if="industry.children.length > 0" class="bg-white w-full overflow-hidden rounded-b-lg">
          <div class="card-body">
            <tr class="text-left">
              <th class="w-1/2">Title</th>
              <th class="w-1/2">Synonyms</th>
            </tr>
            <tr v-for="child in industry.children" :key="child.id">
              <td class="w-1/2 items-center">
                <nuxt-link :to="`/industries/${child.id}`">
                  {{ child.title }}
                </nuxt-link>
              </td>
              <td class="w-1/2 items-center">
                <span class="-mb-2 -mr-2">
                  <nuxt-link
                    class="tbadge tbadge--blue mr-2 mb-2"
                    :to="`/industries/${synonym.id}`"
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

import GetIndustryForView from '@/graphql/ressources/industries/GetIndustryForView.gql'
import {
  GetIndustryForViewQuery,
  UpdateIndustryMutation,
  UpdateIndustryMutationVariables,
  UserRole,
} from '~/graphql/GQLTypes'
import UpdateIndustry from '~/graphql/ressources/industries/UpdateIndustry.gql'
import IHChevronLeft from '~/components/globals/icons/heroicons/IHChevronLeft.vue'
import IHPencil from '~/components/globals/icons/heroicons/IHPencil.vue'

@Component({
  components: {
    IHPencil,
    IHChevronLeft,
  },
  async asyncData({ app, route }) {
    const data: any = {
      industryId: Number.parseInt(route.params.id),
    }
    if (data.industryId) {
      const res = await app.apolloProvider!.defaultClient.query<GetIndustryForViewQuery>({
        query: GetIndustryForView,
        variables: {
          id: data.industryId,
        },
      })
      data.industry = res.data.industry
    }
    return data
  },
  head() {
    return {
      title: (this as IndustryView).industry!.title,
    }
  },
  middleware: 'auth',
  meta: {
    requiredRole: UserRole.Employee,
  },
})
export default class IndustryView extends Vue {
  industry: GetIndustryForViewQuery['industry'] = null

  @State((state) => state.industry.overviewQueryParams)
  overviewQueryParams: any

  private isSubmitting = false

  mounted() {
    // redirect to overview, if queried id was not found
    if (!this.industry) {
      this.$router.push('/industries')
      return
    }
  }

  async markAsReviewed() {
    if (this.isSubmitting) {
      return
    }
    this.isSubmitting = true

    const variables: UpdateIndustryMutationVariables = {
      id: this.industry!.id,
      input: {},
    }

    const { data } = await this.$apollo.mutate<UpdateIndustryMutation>({
      mutation: UpdateIndustry,
      variables,
    })

    this.isSubmitting = false
    this.industry!.is_reviewed = true
    this.$store.commit('industry/decreaseNotReviewedCounter')
  }
}
</script>
