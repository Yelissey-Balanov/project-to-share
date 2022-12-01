<template>
  <div v-if="itSkill" class="container pt-5">
    <div class="flex w-full justify-between items-center mb-6 space-x-8">
      <nuxt-link to="/it-skills" class="tbtn-icon tbtn--white">
        <IHChevronLeft class="w-6 h-6" />
      </nuxt-link>
      <h1>{{ itSkill.title }}</h1>
      <div class="flex items-center space-x-2">
        <nuxt-link :to="`/it-skills/${itSkill.id}/form`" class="tbtn-icon tbtn--blue" v-tooltip="'Edit'">
          <IHPencil class="w-6 h-6" />
        </nuxt-link>
      </div>
    </div>

    <div>
      <div class="alert alert-warning" v-if="!itSkill.is_reviewed">
        This IT skill was not reviewed after creation.
        <nuxt-link :to="`/it-skills/${itSkill.id}/form`">Update IT skill details here.</nuxt-link>
        Or simply
        <button class="underline" @click="markAsReviewed">mark it as reviewed.</button>
      </div>

      <div class="alert alert-info" v-if="itSkill.synonyms.length > 0 && !itSkill.synonym_representative_id">
        This IT skill is the representative of synonyms.
      </div>
    </div>

    <div class="mb-8 flex flex-col space-y-6">
      <div class="card">
        <div class="card-header">
          <div>
            <h3>IT skill information</h3>
          </div>
        </div>
        <div class="card-body">
          <div>
            <span class="card-item-title first-col-1-4">Title</span>
            <span>
              {{ itSkill.title }}
            </span>
          </div>
          <div v-if="itSkill.synonyms.length > 0">
            <span class="card-item-title first-col-1-4">Synonyms</span>
            <span class="-mb-2 -mr-2">
              <nuxt-link
                class="tbadge tbadge--blue mr-2 mb-2"
                :to="`/it-skills/${synonym.id}`"
                v-for="synonym in itSkill.synonyms"
                :key="`synonym_${synonym.id}`"
              >
                {{ synonym.title }}
                <span v-if="!synonym.synonym_representative_id" class="ml-2">representative</span>
              </nuxt-link>
            </span>
          </div>
          <div v-if="itSkill.parent">
            <span class="card-item-title first-col-1-4">Parent</span>
            <nuxt-link :to="`/it-skills/${itSkill.parent.id}`">
              {{ itSkill.parent.title }}
            </nuxt-link>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div>
            <h3>
              Children
              <span class="text-gray-500">&middot; {{ itSkill.children.length }}</span>
            </h3>
          </div>
        </div>
        <table v-if="itSkill.children.length > 0" class="bg-white w-full overflow-hidden rounded-b-lg">
          <div class="card-body">
            <tr class="text-left">
              <th class="w-1/2">Title</th>
              <th class="w-1/2">Synonyms</th>
            </tr>
            <tr v-for="child in itSkill.children">
              <td class="w-1/2 items-center">
                <nuxt-link :to="`/it-skills/${child.id}`">
                  {{ child.title }}
                </nuxt-link>
              </td>
              <td class="w-1/2 items-center">
                <span class="-mb-2 -mr-2">
                  <nuxt-link
                    class="tbadge tbadge--blue mr-2 mb-2"
                    :to="`/it-skills/${synonym.id}`"
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

import GetItSkillForView from '@/graphql/ressources/itSkills/GetItSkillForView.gql'
import {
  GetItSkillForViewQuery,
  UpdateItSkillMutation,
  UpdateItSkillMutationVariables,
  UserRole,
} from '~/graphql/GQLTypes'
import UpdateItSkill from '~/graphql/ressources/itSkills/UpdateItSkill.gql'
import IHPencil from '~/components/globals/icons/heroicons/IHPencil.vue'
import IHChevronLeft from '~/components/globals/icons/heroicons/IHChevronLeft.vue'

@Component({
  components: {
    IHChevronLeft,
    IHPencil,
  },
  async asyncData({ app, route }) {
    const data: any = {
      itSkillId: Number.parseInt(route.params.id),
    }
    if (data.itSkillId) {
      const res = await app.apolloProvider!.defaultClient.query<GetItSkillForViewQuery>({
        query: GetItSkillForView,
        variables: {
          id: data.itSkillId,
        },
      })
      data.itSkill = res.data.itSkill
    }
    return data
  },
  head() {
    return {
      title: (this as ItSkillView).itSkill!.title,
    }
  },
  middleware: 'auth',
  meta: {
    requiredRole: UserRole.Employee,
  },
})
export default class ItSkillView extends Vue {
  itSkill: GetItSkillForViewQuery['itSkill'] = null

  @State((state) => state.itSkill.overviewQueryParams)
  overviewQueryParams: any

  private isSubmitting = false

  mounted() {
    // redirect to overview, if queried id was not found
    if (!this.itSkill) {
      this.$router.push('/it-skills')
      return
    }
  }

  async markAsReviewed() {
    if (this.isSubmitting) {
      return
    }
    this.isSubmitting = true

    const variables: UpdateItSkillMutationVariables = {
      id: this.itSkill!.id,
      input: {},
    }

    const { data } = await this.$apollo.mutate<UpdateItSkillMutation>({
      mutation: UpdateItSkill,
      variables,
    })

    this.isSubmitting = false
    this.itSkill!.is_reviewed = true
    this.$store.commit('itSkill/decreaseNotReviewedCounter')
  }
}
</script>
