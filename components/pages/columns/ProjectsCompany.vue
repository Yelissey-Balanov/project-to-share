<template>
  <td class="px-6 py-3.5">
    <nuxt-link :to="`/companies/${data.company ? data.company.id : null}`" class="flex items-center">
      <div v-if="areImagesDisplayed" class="small-foto mr-4">
        <LImg :image="data.company && data.company.logo ? data.company.logo.sizes.PROFILE_IMAGE : null">
          <IHOfficeBuilding class="w-8 h-8 text-gray-400" />
        </LImg>
      </div>
      <div>
        {{ data.company.aliasOrName }}
      </div>
    </nuxt-link>
  </td>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import IHOfficeBuilding from '~/components/globals/icons/heroicons/IHOfficeBuilding.vue'

@Component({
  components: {
    IHOfficeBuilding,
  },
})
export default class ProjectsCompany extends Vue {
  @Prop({ default: () => {} })
  data!: any
  @Prop({default: true})
  areImagesDisplayed!: boolean
}
</script>
