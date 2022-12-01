<template>
  <td class="px-6 py-3.5">
    <div :class="areImagesDisplayed ? 'flex -space-x-2' : '-mb-1 -mr-2'">
      <nuxt-link v-for="user in data.users" :key="user.id" :to="`/users/${user.id}`">
        <div v-if="areImagesDisplayed" class="small-foto">
          <LImg
            class="flex-none flex items-center justify-center bg-blue-100 ring-white ring-1 text-blue-600 rounded-full overflow-hidden"
            v-tooltip="`${user.firstname} ${user.lastname}`"
            :image="user.foto ? user.foto.sizes.PROFILE_IMAGE : null"
          >
            {{ user.firstname.substr(0, 1) }}{{ user.lastname.substr(0, 1) }}
          </LImg>
        </div>
        <div v-else class="mb-1 mr-2"> &middot; {{ user.firstname }} {{ user.lastname }} </div>
      </nuxt-link>
    </div>
  </td>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  components: {},
})
export default class ProjectUsers extends Vue {
  @Prop({ default: () => {} })
  data!: any
  @Prop({default: true})
  areImagesDisplayed!: boolean
}
</script>
