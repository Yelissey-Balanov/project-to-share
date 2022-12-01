<template>
  <td class="px-6 py-3.5">
    <nuxt-link :to="`/candidates/${data.id}`" class="flex items-center">
      <div v-if="areImagesDisplayed" class="small-foto mr-4">
        <LImg :image="data.person.foto ? data.person.foto.sizes.PROFILE_IMAGE : null">
          <IHUserFilled class="w-12 h-12 text-gray-400 mt-3" />
        </LImg>
      </div>
      <div class="flex-auto">
        <div class="flex items-center justify-between">
          <!--          <span class="round-badge round-badge&#45;&#45;orange mr-2" v-if="data.is_research">R</span>-->
          <!--          <span class="round-badge round-badge&#45;&#45;blue mr-2" v-if="data.is_permanent">P</span>-->
          <!--          <span class="round-badge round-badge&#45;&#45;pink mr-2" v-if="data.is_interim">I</span>-->
          <span>
            {{ data.person.full_name }}
          </span>

          <div class="flex items-end ml-2">
            <span
              class="tbadge--icon w-8 h-8 tbadge--orange text-lg transform scale-75"
              v-if="data.is_research"
              v-tooltip="{ content: 'Is research entry', classes: ['tooltip--orange'] }"
            >
              R
            </span>
            <span
              class="tbadge--icon w-8 h-8 tbadge--blue text-lg transform scale-75"
              v-if="data.is_permanent"
              v-tooltip="{ content: 'Permanent', classes: ['tooltip--blue'] }"
            >
              P
            </span>
            <span
              class="tbadge--icon w-8 h-8 tbadge--pink text-lg transform scale-75"
              v-if="data.is_interim"
              v-tooltip="{ content: 'Interim manager', classes: ['tooltip--pink'] }"
            >
              I
            </span>
            <span
              class="tbadge--icon w-8 h-8 tbadge--red transform scale-75"
              v-if="data.caution"
              v-tooltip="{ content: 'At least in 1 project beyond first interview!', classes: ['tooltip--red'] }"
            >
              <IHExclamation class="w-5 h-5" />
            </span>
            <span
              class="tbadge--icon w-8 h-8 tbadge--green transform scale-75"
              v-if="data.was_placed"
              v-tooltip="{ content: 'At least 1 time placed', classes: ['tooltip--green'] }"
            >
              <IHCash class="w-5 h-5" />
            </span>
          </div>
        </div>

        <div>
          <span class="tbadge tbadge--red ml-2" v-if="data.deleted_at">DELETED</span>
        </div>
      </div>
    </nuxt-link>
  </td>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import IHUserFilled from '~/components/globals/icons/heroicons/IHUserFilled.vue'
import IHExclamation from '~/components/globals/icons/heroicons/IHExclamation.vue'
import IHCash from '~/components/globals/icons/heroicons/IHCash.vue'

@Component({
  components: { IHCash, IHExclamation, IHUserFilled },
})
export default class NameWithPhotoCandidate extends Vue {
  @Prop({ default: () => {} })
  data!: any
  @Prop({ default: true })
  areImagesDisplayed!: boolean
}
</script>
