<template>
  <td class="px-6 py-3.5">
    <div class="flex items-center" v-if="company.company">
      <nuxt-link
        v-if="areImagesDisplayed"
        :to="`/companies/${company.company ? company.company.id : null}`"
        class="small-foto mr-4"
      >
        <LImg :image="company.company && company.company.logo ? company.company.logo.sizes.PROFILE_IMAGE : null">
          <IHOfficeBuilding class="w-8 h-8 text-gray-400" />
        </LImg>
      </nuxt-link>
      <nuxt-link :to="`/companies/${company.company ? company.company.id : null}`" class="flex flex-col">
        <span>{{ company.job_title }}</span>
        <span class="mt-0.5 text-gray-500" v-if="company.company">
          {{ company.company.aliasOrName }}
        </span>
      </nuxt-link>
    </div>
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
export default class CandidatesCompany extends Vue {
  @Prop({ default: () => {} })
  data!: any
  @Prop({default: true})
  areImagesDisplayed!: boolean

  get company() {
    if (this.data.worked_at_companies.length > 0) {
      return this.data.worked_at_companies[0]
    } else return {}
  }
}
</script>
