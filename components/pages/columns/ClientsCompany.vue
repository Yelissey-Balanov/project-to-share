<template>
  <td class="px-6 py-3.5">
    <div class="flex items-center">
      <nuxt-link
        v-if="areImagesDisplayed"
        :to="`/companies/${data.company ? data.company.id : null}`"
        class="small-foto mr-4"
      >
        <LImg :image="data.company && data.company.logo ? data.company.logo.sizes.PROFILE_IMAGE : null">
          <IHOfficeBuilding class="w-8 h-8 text-gray-400" />
        </LImg>
      </nuxt-link>
      <nuxt-link :to="`/companies/${data.company ? data.company.id : null}`" class="flex flex-col">
        <span v-if="data.company">
          {{ data.company.aliasOrName }}
        </span>
        <span class="mt-0.5 text-gray-500">{{ data.position }}</span>
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
export default class CompanyForClients extends Vue {
  @Prop({ default: () => {} })
  data!: any
  @Prop({default: true})
  areImagesDisplayed!: boolean
}
</script>
