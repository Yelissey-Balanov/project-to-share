<template>
  <td class="px-6 py-3.5">
    <nuxt-link :to="`/clients/${data.id}`" class="flex items-center">
      <div v-if="areImagesDisplayed" class="small-foto mr-4">
        <LImg :image="data.person.foto ? data.person.foto.sizes.PROFILE_IMAGE : null">
          <IHUserFilled class="w-12 h-12 text-gray-400 mt-3" />
        </LImg>
      </div>
      <span class="round-badge round-badge--orange mr-2" v-if="data.is_research">R</span>
      <span>{{ data.person.full_name }}</span>
      <span class="tbadge tbadge--red ml-2" v-if="data.deleted_at">DELETED</span>
    </nuxt-link>
  </td>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import IHUserFilled from '~/components/globals/icons/heroicons/IHUserFilled.vue'

@Component({
  components: { IHUserFilled },
})
export default class NameWithPhotoClient extends Vue {
  @Prop({ default: () => {} })
  data!: any
  @Prop({ default: true })
  areImagesDisplayed!: boolean
}
</script>
