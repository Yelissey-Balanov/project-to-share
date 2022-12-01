<template>
  <td class="px-6 py-3.5">
    <div :class="areImagesDisplayed ? 'flex -space-x-2' : '-mb-1 -mr-2'">
      <nuxt-link v-for="client in data.clients" :key="client.id" :to="`/clients/${client.id}`">
        <div v-if="areImagesDisplayed" class="small-foto">
          <LImg
            class="ring-white ring-2"
            :image="client.person.foto ? client.person.foto.sizes.PROFILE_IMAGE : null"
            v-tooltip="client.person.full_name"
          >
            <IHUserFilled class="w-12 h-12 text-gray-400 mt-3" />
          </LImg>
        </div>
        <div v-else class="mb-1 mr-2"> &middot; {{ client.person.full_name }} </div>
      </nuxt-link>
    </div>
  </td>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import IHUserFilled from '~/components/globals/icons/heroicons/IHUserFilled.vue'

@Component({
  components: { IHUserFilled },
})
export default class C extends Vue {
  @Prop({ default: () => {} })
  data!: any
  @Prop({default: true})
  areImagesDisplayed!: boolean
}
</script>
