<template>
  <div v-if="skill" class="container pt-5">
    <div class="flex w-full justify-between items-center mb-6 space-x-8">
      <nuxt-link to="/skills" class="tbtn-icon tbtn--white">
        <IHChevronLeft class="w-6 h-6" />
      </nuxt-link>
      <h1>{{ skill.title }}</h1>
      <div class="flex items-center space-x-2">
        <nuxt-link :to="`/skills/${skill.id}/form`" class="tbtn-icon tbtn--blue" v-tooltip="'Edit'">
          <IHPencil class="w-6 h-6" />
        </nuxt-link>
      </div>
    </div>

    <div>
      <div class="alert alert-warning" v-if="!skill.is_reviewed">
        This skill was not reviewed after creation.
        <nuxt-link :to="`/skills/${skill.id}/form`">Update skill details here.</nuxt-link>
        Or simply
        <button class="underline" @click="markAsReviewed">mark it as reviewed.</button>
      </div>

      <div class="alert alert-info" v-if="skill.synonyms.length > 0 && !skill.synonym_representative_id">
        This skill is the representative of synonyms.
      </div>
    </div>

    <div class="mb-8 flex flex-col space-y-6">
      <div class="card">
        <div class="card-header">
          <div>
            <h3>Skill information</h3>
          </div>
        </div>
        <div class="card-body">
          <div>
            <span class="card-item-title first-col-1-4">Title</span>
            <span>
              {{ skill.title }}
            </span>
          </div>
          <div v-if="skill.synonyms.length > 0">
            <span class="card-item-title first-col-1-4">Synonyms</span>
            <span class="-mb-2 -mr-2">
              <nuxt-link
                class="tbadge tbadge--blue mr-2 mb-2"
                :to="`/skills/${synonym.id}`"
                v-for="synonym in skill.synonyms"
                :key="`synonym_${synonym.id}`"
              >
                {{ synonym.title }}
                <span v-if="!synonym.synonym_representative_id" class="ml-2">representative</span>
              </nuxt-link>
            </span>
          </div>
          <div v-if="skill.parent">
            <span class="card-item-title first-col-1-4">Parent</span>
            <nuxt-link :to="`/skills/${skill.parent.id}`">
              {{ skill.parent.title }}
            </nuxt-link>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div>
            <h3>
              Children
              <span class="text-gray-500">&middot; {{ skill.children.length }}</span>
            </h3>
          </div>
        </div>
        <table v-if="skill.children.length > 0" class="bg-white w-full overflow-hidden rounded-b-lg">
          <div class="card-body">
            <tr class="text-left">
              <th class="w-1/2">Title</th>
              <th class="w-1/2">Synonyms</th>
            </tr>
            <tr v-for="child in skill.children">
              <td class="w-1/2 items-center">
                <nuxt-link :to="`/skills/${child.id}`">
                  {{ child.title }}
                </nuxt-link>
              </td>
              <td class="w-1/2 items-center">
                <span class="-mb-2 -mr-2">
                  <nuxt-link
                    class="tbadge tbadge--blue mr-2 mb-2"
                    :to="`/skills/${synonym.id}`"
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

import GetSkillForView from '@/graphql/ressources/skills/GetSkillForView.gql'
import { GetSkillForViewQuery, UpdateSkillMutation, UpdateSkillMutationVariables, UserRole } from '~/graphql/GQLTypes'
import UpdateSkill from '~/graphql/ressources/skills/UpdateSkill.gql'
import IHChevronLeft from '~/components/globals/icons/heroicons/IHChevronLeft.vue'
import IHPencil from '~/components/globals/icons/heroicons/IHPencil.vue'

@Component({
  components: {
    IHPencil,
    IHChevronLeft,
  },
  async asyncData({ app, route }) {
    const data: any = {
      skillId: Number.parseInt(route.params.id),
    }
    if (data.skillId) {
      const res = await app.apolloProvider!.defaultClient.query<GetSkillForViewQuery>({
        query: GetSkillForView,
        variables: {
          id: data.skillId,
        },
      })
      data.skill = res.data.skill
    }
    return data
  },
  head() {
    return {
      title: (this as SkillView).skill!.title,
    }
  },
  middleware: 'auth',
  meta: {
    requiredRole: UserRole.Employee,
  },
})
export default class SkillView extends Vue {
  skill: GetSkillForViewQuery['skill'] = null

  @State((state) => state.skill.overviewQueryParams)
  overviewQueryParams: any

  private isSubmitting = false

  mounted() {
    // redirect to overview, if queried id was not found
    if (!this.skill) {
      this.$router.push('/skills')
      return
    }
  }

  async markAsReviewed() {
    if (this.isSubmitting) {
      return
    }
    this.isSubmitting = true

    const variables: UpdateSkillMutationVariables = {
      id: this.skill!.id,
      input: {},
    }

    const { data } = await this.$apollo.mutate<UpdateSkillMutation>({
      mutation: UpdateSkill,
      variables,
    })

    this.isSubmitting = false
    this.skill!.is_reviewed = true
    this.$store.commit('skill/decreaseNotReviewedCounter')
  }
}
</script>
