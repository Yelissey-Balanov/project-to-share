<template>
  <td class="px-6 py-3.5">
    <div class="flex items-center">
      <nuxt-link v-if="areImagesDisplayed" :to="`/companies/${data.id}`" class="small-foto mr-4">
        <LImg :image="data.logo ? data.logo.sizes.PROFILE_IMAGE : null" v-if="data">
          <IHOfficeBuilding class="w-8 h-8 text-gray-400" />
        </LImg>
      </nuxt-link>
      <nuxt-link :to="`/companies/${data.id}`" class="flex items-center">
        <div class="flex flex-col">
          <template v-if="data.alias">
            <span>{{ data.alias }}</span>
            <span class="mt-0.5 text-gray-500 text-xs">
              {{ data.name }} {{ data.legal_form }}
            </span>
          </template>
          <span v-else>
            {{ data.name }} {{ data.legal_form }}
          </span>
        </div>
        <span class="tbadge tbadge--red ml-2" v-if="data.deleted_at">DELETED</span>
      </nuxt-link>
    </div>
  </td>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import IHUserFilled from '~/components/globals/icons/heroicons/IHUserFilled.vue'
import IHOfficeBuilding from '~/components/globals/icons/heroicons/IHOfficeBuilding.vue'

@Component({
  components: { IHOfficeBuilding, IHUserFilled },
})
export default class NameWithPhotoCompany extends Vue {
  @Prop({ default: () => {} })
  data!: any
  @Prop({ default: true })
  areImagesDisplayed!: boolean
}
</script>
