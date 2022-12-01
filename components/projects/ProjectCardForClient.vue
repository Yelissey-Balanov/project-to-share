<template>
  <nuxt-link
    :to="`/clients/my-projects/${project.id}`"
    class="rounded-lg bg-white shadow-md hover:shadow-xl focus-within:shadow-xl mt-7 relative flex flex-col transition duration-200 ease-in-out hover:no-underline focus:no-underline outline-none"
  >
    <div class="w-full px-5 -mt-7 flex justify-between items-center">
      <div class="flex space-x-1">
        <span class="px-2.5 py-0.5 bg-blue-600 text-xs text-white rounded shadow-xl" v-if="project.is_permanent">
          Permanent
        </span>
        <span class="px-2.5 py-0.5 bg-pink-600 text-xs text-white rounded shadow-xl" v-if="project.is_interim">
          Interim
        </span>
      </div>

      <div class="flex -space-x-3">
        <LImg
          class="shadow-lg w-14 h-14 overflow-hidden rounded-full bg-gray-200 ring-white ring-2"
          :image="project.company.logo ? project.company.logo.sizes.PROFILE_IMAGE : null"
          v-tooltip="project.company.aliasOrName"
        >
          <IHOfficeBuilding class="w-8 h-8 text-gray-400" />
        </LImg>
        <LImg
          v-for="client in project.clients"
          class="shadow-lg w-14 h-14 overflow-hidden rounded-full bg-gray-200 ring-white ring-2"
          :image="client.person.foto ? client.person.foto.sizes.PROFILE_IMAGE : null"
          :key="client.id"
          v-tooltip="client.person.full_name"
        >
          <IHUserFilled class="w-14 h-14 text-gray-400 mt-3" />
        </LImg>
      </div>
    </div>

    <div class="bg-white border absolute text-xs left-5 top-3.5 px-2.5 py-0.5 rounded-full" :class="statusTextClass">
      {{ project.status | formatSnakeCaseString }}
    </div>

    <div class="divide-y pt-3 flex flex-col flex-auto hover:no-underline focus:no-underline outline-none">
      <div class="w-full px-5 py-3 text-center text-base text-gray-800 flex-auto flex items-center justify-center">
        {{ project.title }}
      </div>
      <div class="w-full px-5 py-3 flex justify-between items-center text-gray-500">
        <span>{{ project.candidates_count }} candidates</span>
        <span>{{ project.shortlisted_candidates_count }} shortlisted</span>
      </div>
      <div class="w-full px-5 py-2 flex justify-between items-center text-gray-500">
        <div class="flex -space-x-2">
          <LImg
            class="flex-none flex items-center justify-center bg-blue-100 ring-white ring-1 text-blue-600 w-10 h-10 rounded-full overflow-hidden"
            v-for="user in project.users"
            :key="user.id"
            v-tooltip="`${user.firstname} ${user.lastname}`"
            :image="user.foto ? user.foto.sizes.PROFILE_IMAGE : null"
          >
            {{ user.firstname.substr(0, 1) }}{{ user.lastname.substr(0, 1) }}
          </LImg>
        </div>
        <span>{{ project.updated_at | datetime }}</span>
      </div>
    </div>
  </nuxt-link>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import Vue from 'vue'
import { ClientProjectFragment } from '~/graphql/GQLTypes'
import IHUserFilled from '~/components/globals/icons/heroicons/IHUserFilled.vue'
import IHOfficeBuilding from '~/components/globals/icons/heroicons/IHOfficeBuilding.vue'
import { statusTextColor } from '~/helpers/projectHelpers'
@Component({
  components: {
    IHOfficeBuilding,
    IHUserFilled,
  },
})
export default class ProjectCardForClient extends Vue {
  @Prop()
  project!: ClientProjectFragment

  publicUrl = this.$config.publicUrl

  get statusTextClass() {
    return statusTextColor(this.project.status)
  }
}
</script>
