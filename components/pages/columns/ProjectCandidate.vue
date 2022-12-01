<template>
  <td class="px-6 py-3.5">
    <div class="flex items-center">
      <nuxt-link :to="`/candidates/${data.id}`" class="flex items-center">
        <div v-if="areImagesDisplayed" class="small-foto mr-4">
          <LImg :image="data.person.foto ? data.person.foto.sizes.PROFILE_IMAGE : null">
            <IHUserFilled class="w-8 h-8 text-gray-400" />
          </LImg>
        </div>
        <div class="flex flex-wrap items-center">
          <div class="whitespace-nowrap mr-2 leading-8">
            {{ data.person.full_name }}
          </div>
          <div class="flex items-end space-x-2">
            <span
              class="tbadge--icon w-8 h-8 tbadge--red shadow-md"
              v-if="data.caution"
              v-tooltip="{ content: 'At least in 1 project beyond first interview!', classes: ['tooltip--red'] }"
            >
              <IHExclamation class="w-5 h-5" />
            </span>
            <span
              class="tbadge--icon w-8 h-8 tbadge--red shadow-md"
              v-if="data.candidate_project_pivot.contradicted_at"
              v-tooltip="{
                content: 'Candidate has withdrawn the consent for data transmission!',
                classes: ['tooltip--red'],
              }"
            >
              <IHExclamation class="w-5 h-5" />
            </span>
            <span
              class="tbadge--icon w-8 h-8 tbadge--green shadow-md"
              v-if="data.was_placed"
              v-tooltip="{ content: 'At least 1 time placed', classes: ['tooltip--green'] }"
            >
              <IHCash class="w-5 h-5" />
            </span>
            <span
              class="tbadge--icon w-8 h-8 tbadge--green shadow-md"
              v-if="data.candidate_project_pivot.liked_by_client"
              v-tooltip="{ content: 'Liked by client', classes: ['tooltip--green'] }"
            >
              <IHThumbUp class="w-5 h-5" />
            </span>
          </div>
        </div>
      </nuxt-link>
    </div>
  </td>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import IHUserFilled from '~/components/globals/icons/heroicons/IHUserFilled.vue'
import IHExclamation from '~/components/globals/icons/heroicons/IHExclamation.vue'
import IHCash from '~/components/globals/icons/heroicons/IHCash.vue'
import IHThumbUp from '~/components/globals/icons/heroicons/IHThumbUp.vue'

@Component({
  components: {
    IHThumbUp,
    IHCash,
    IHExclamation,
    IHUserFilled,
  },
})
export default class ProjectCandidate extends Vue {
  @Prop({ default: () => {} })
  data!: any
  @Prop({ default: true })
  areImagesDisplayed!: boolean
}
</script>
