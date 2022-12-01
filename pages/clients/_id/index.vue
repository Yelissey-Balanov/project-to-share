<template>
  <div v-if="client" class="container pt-5">
    <div class="flex w-full justify-between items-center mb-6 space-x-8">
      <nuxt-link to="/clients" class="tbtn-icon tbtn--white" v-if="isEmployee">
        <IHChevronLeft class="w-6 h-6" />
      </nuxt-link>

      <h1>
        {{ client.person.title }} {{ client.person.firstname }} {{ client.person.other_firstnames }}
        {{ client.person.lastname }}
      </h1>

      <div class="flex items-center space-x-2" v-if="!client.deleted_at">
        <nuxt-link :to="`/clients/${client.id}/form`" class="tbtn-icon tbtn--blue" v-tooltip="'Edit'">
          <IHPencil class="w-6 h-6" />
        </nuxt-link>
        <DropdownButton v-if="isEmployee">
          <template #items>
            <button
              class="flex items-center px-4 py-2 text-sm text-gray-700 outline-none hover:text-green-700 hover:bg-green-100"
              type="button"
              @click="createProjectForClient"
            >
              <IHPlus class="w-5 h-5 mr-3" />
              New Project
            </button>
            <button
              class="flex items-center px-4 py-2 text-sm text-gray-700 outline-none hover:text-blue-700 hover:bg-blue-100"
              type="button"
              @click="addToBucket"
            >
              <IHCollection class="w-5 h-5 mr-3" />
              Add to bucket
            </button>
          </template>
        </DropdownButton>
      </div>
    </div>

    <div>
      <template v-if="isEmployee">
        <div class="alert alert-danger" v-if="client.deleted_at">
          This client was deleted at {{ client.deleted_at | datetime }}, therefore it is not editable! You can
          <button class="underline" type="button" @click="restore">restore</button>
          <template v-if="isAdmin">
            or
            <button class="underline" type="button" @click="forceDelete">force delete</button>
          </template>
          this client.
        </div>

        <div class="alert alert-warning" v-if="client.need_review_after_autocomplete && !client.deleted_at">
          This client was created via autocomplete and was not reviewed after creation.
          <nuxt-link :to="`/clients/${client.id}/form`">Enter client details here.</nuxt-link>
        </div>

        <InviteCandidateOrClientToCreateAccount :model="client" />

        <div class="alert alert-info" v-if="client.person.candidate_id">
          This client is also our candidate.
          <nuxt-link :to="`/candidates/${client.person.candidate_id}`">Show candidate profile</nuxt-link>
        </div>

        <div class="alert alert-warning" v-if="client.is_research">
          This is a research client without detailed information.
        </div>
      </template>
    </div>

    <div class="grid gap-6 mb-8 grid-cols-1 xl:grid-cols-11">
      <div class="xl:col-span-6 flex flex-col space-y-6">
        <div class="card">
          <div class="card-header">
            <div>
              <h3>Client information</h3>
            </div>
          </div>
          <div class="card-body">
            <div v-if="client.person.title">
              <span class="card-item-title first-col-1-4">Title</span>
              <span>{{ client.person.title }}</span>
            </div>
            <div>
              <span class="card-item-title first-col-1-4">Firstname</span>
              <span>{{ client.person.firstname }}</span>
            </div>
            <div>
              <span class="card-item-title first-col-1-4">Lastname</span>
              <span>{{ client.person.lastname }}</span>
            </div>
            <div v-if="client.person.other_firstnames">
              <span class="card-item-title first-col-1-4">Other firstnames</span>
              <span>{{ client.person.other_firstnames }}</span>
            </div>
            <div v-if="client.person.birth_name">
              <span class="card-item-title first-col-1-4">Birth name</span>
              <span>{{ client.person.birth_name }}</span>
            </div>
            <div v-if="client.person.birthdate">
              <span class="card-item-title first-col-1-4">Birthdate</span>
              <span>{{ dateFilter(client.person.birthdate) }}</span>
            </div>
            <div v-if="client.person.gender">
              <span class="card-item-title first-col-1-4">Gender</span>
              <span>{{ client.person.gender }}</span>
            </div>

            <div v-if="isEmployee && client.notes">
              <span class="card-item-title first-col-1-4">Notes</span>
              <span class="whitespace-pre-wrap">{{ client.notes }}</span>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div>
              <h3>Contact information</h3>
            </div>
          </div>
          <div class="card-body">
            <div v-if="client.email">
              <span class="card-item-title first-col-1-4">Email</span>
              <a :href="`mailto:${client.email}`">{{ client.email }}</a>
            </div>
            <div v-if="client.zoom_id">
              <span class="card-item-title first-col-1-4">Zoom ID</span>
              <a :href="`https://zoom.us/j/${client.zoom_id}`">{{ client.zoom_id }}</a>
            </div>

            <div v-if="client.phonenumbers.length > 0">
              <span class="card-item-title first-col-1-4">Phonenumbers</span>
              <span>
                <ul class="space-y-2">
                  <li v-for="phonenumber in client.phonenumbers">
                    <a :href="`tel:${phonenumber.dial_code} ${phonenumber.number}`">
                      {{ phonenumber.dial_code }} {{ phonenumber.number }}
                    </a>
                    {{ phonenumber.label ? ` - ${phonenumber.label}` : '' }}
                  </li>
                </ul>
              </span>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div>
              <h3>Company</h3>
            </div>
          </div>
          <div class="card-body">
            <div v-if="client.position">
              <span class="card-item-title first-col-1-4">Position</span>
              <span>{{ client.position }}</span>
            </div>
            <div v-if="client.company">
              <span class="card-item-title first-col-1-4">Company</span>
              <nuxt-link
                :value="client.company"
                :to="isEmployee && client.company ? `/companies/${client.company.id}` : ''"
                >{{ client.company.name }} {{ client.company.legal_form }}
              </nuxt-link>
            </div>
            <div v-if="client.location">
              <span class="card-item-title first-col-1-4">Location</span>
              <span>
                {{ client.location.full_address }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="xl:col-span-5 flex flex-col space-y-6">
        <div class="card">
          <div class="card-body">
            <div class="flex justify-center">
              <LImg
                class="!flex-none w-48 h-48 border-gray-400 border-2 overflow-hidden rounded-full bg-gray-200"
                :image="client.person.foto ? client.person.foto.sizes.PROFILE_IMAGE : null"
              >
                <IHUserFilled class="w-48 h-48 text-gray-400 mt-12" />
              </LImg>
            </div>
          </div>
        </div>

        <div v-if="isEmployee" class="card">
          <div class="card-header">
            <div class="flex items-center space-x-4">
              <IHBriefcase class="w-6 h-6 text-gray-700" />
              <h3>
                Projects
                <span class="text-gray-500">&middot; {{ client.projects.data.length }}</span>
              </h3>
            </div>
            <div class="space-x-4 flex items-center">
              <button
                class="tbtn-icon tbtn--white tbtn-icon--small"
                @click="toggleProjectsVisibility"
                v-if="hiddenProjects.length > 0"
              >
                <span
                  class="transform transition duration-300 ease-in-out"
                  :class="{ 'rotate-180': areAllProjectsVisible }"
                >
                  <IHChevronDown class="w-5 h-5" />
                </span>
              </button>
              <button
                class="tbtn-icon tbtn--green tbtn-icon--small"
                @click="createProjectForClient"
                v-if="!client.deleted_at"
              >
                <IHPlus class="w-5 h-5" />
              </button>
            </div>
          </div>
          <div v-if="client.projects.data.length > 0">
            <table class="card-body w-full">
              <tr class="text-left">
                <th class="w-1/2">Title</th>
                <th class="w-1/2">Status</th>
                <th class="w-8"></th>
              </tr>
              <tr v-for="project in alwaysVisibleProjects">
                <td class="w-1/2">
                  <span class="tbadge tbadge--red" v-if="project.deleted_at">DELETED</span>
                  <nuxt-link :to="`/projects/${project.id}`">
                    {{ project.title }}
                  </nuxt-link>
                </td>
                <td class="w-1/2">
                  <span :class="'border px-2.5 py-0.5 rounded-full ' + statusTextClass(project.status)">
                    {{ project.status | formatSnakeCaseString }}
                  </span>
                </td>
                <td class="w-8">
                  <div class="flex justify-end">
                    <button
                      class="tbtn-icon tbtn--green tbtn-icon--small relative"
                      @click="addEvent(project)"
                      v-tooltip="{ content: 'Add Event', classes: ['tooltip--green'] }"
                    >
                      <IHCalendar class="w-4 h-4 relative -left-[3px] -bottom-0.5" />
                      <IHPlus class="w-4 h-4 absolute right-0 top-0.5" />
                    </button>
                  </div>
                </td>
              </tr>
            </table>
            <SlideUpDown class="border-t ease-in-out" :active="areAllProjectsVisible" :duration="350">
              <table class="card-body w-full">
                <tr v-for="project in hiddenProjects">
                  <td class="w-1/2">
                    <span class="tbadge tbadge--red" v-if="project.deleted_at">DELETED</span>
                    <nuxt-link :to="`/projects/${project.id}`">
                      {{ project.title }}
                    </nuxt-link>
                  </td>
                  <td class="w-1/2">
                    <span :class="'border px-2.5 py-0.5 rounded-full ' + statusTextClass(project.status)">
                      {{ project.status | formatSnakeCaseString }}
                    </span>
                  </td>
                  <td class="w-8">
                    <div class="flex justify-end">
                      <button
                        class="tbtn-icon tbtn--green tbtn-icon--small relative"
                        @click="addEvent(project)"
                        v-tooltip="{ content: 'Add Event', classes: ['tooltip--green'] }"
                      >
                        <IHCalendar class="w-4 h-4 relative -left-[3px] -bottom-0.5" />
                        <IHPlus class="w-4 h-4 absolute right-0 top-0.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              </table>
            </SlideUpDown>
          </div>
        </div>

        <div v-if="isEmployee" class="card">
          <div class="card-header">
            <div class="flex items-center space-x-4">
              <IHCalendar class="w-6 h-6 text-gray-700" />
              <h3>
                Events with client
                <span class="text-gray-500">&middot; {{ clientEvents.length }}</span>
              </h3>
            </div>
            <div class="space-x-4 flex items-center">
              <button
                class="tbtn-icon tbtn--white tbtn-icon--small"
                @click="toggleEventsVisibility"
                v-if="hiddenEvents.length > 0"
              >
                <span
                  class="transform transition duration-300 ease-in-out"
                  :class="{ 'rotate-180': areAllEventsVisible }"
                >
                  <IHChevronDown class="w-5 h-5" />
                </span>
              </button>
              <button class="tbtn-icon tbtn--green tbtn-icon--small" @click="addEvent()" v-if="!client.deleted_at">
                <IHPlus class="w-5 h-5" />
              </button>
            </div>
          </div>
          <table class="bg-white w-full overflow-hidden rounded-b-lg">
            <tbody class="divide-y">
              <EventTableRow
                class=""
                v-for="event in alwaysVisibleEvents"
                :event="event"
                :key="`clientEvent_${event.id}`"
              ></EventTableRow>
            </tbody>
          </table>
          <SlideUpDown class="border-t ease-in-out" :active="areAllEventsVisible" :duration="350">
            <table class="bg-white w-full overflow-hidden rounded-b-lg">
              <tbody class="divide-y">
                <EventTableRow
                  class=""
                  v-for="event in hiddenEvents"
                  :event="event"
                  :key="`ce_${event.id}`"
                ></EventTableRow>
              </tbody>
            </table>
          </SlideUpDown>
        </div>
      </div>
    </div>

    <div class="mb-8" v-if="isAdmin">
      <button class="h2" @click="isHistoryExpanded = !isHistoryExpanded">Modification history (click to toggle)</button>
      <HistoryList :histories="client.histories" v-if="isHistoryExpanded" />
    </div>

    <template v-if="isEmployee">
      <AddEventModal />
      <AddToBucketModal />
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Mutation, namespace, State, Vue } from 'nuxt-property-decorator'

import GetClientForView from '~/graphql/ressources/clients/GetClientForView.gql'
import {
  ForceDeleteClientMutation,
  ForceDeleteClientMutationVariables,
  GetClientForViewQuery,
  Project,
  RestoreClientMutation,
  RestoreClientMutationVariables,
  UserRole,
} from '~/graphql/GQLTypes'
import HistoryList from '~/components/admin/HistoryList.vue'
import AddEventModal from '~/components/admin/AddEventModal.vue'
import ForceDeleteClient from '~/graphql/ressources/clients/ForceDeleteClient.gql'
import RestoreClient from '~/graphql/ressources/clients/RestoreClient.gql'
import AddToBucketModal from '~/components/admin/AddToBucketModal.vue'
import InviteCandidateOrClientToCreateAccount from '~/components/admin/InviteCandidateOrClientToCreateAccount.vue'
import IHPencil from '~/components/globals/icons/heroicons/IHPencil.vue'
import IHChevronLeft from '~/components/globals/icons/heroicons/IHChevronLeft.vue'
import IHPlus from '~/components/globals/icons/heroicons/IHPlus.vue'
import EventTableRow from '~/components/events/EventTableRow.vue'
import IHCalendar from '~/components/globals/icons/heroicons/IHCalendar.vue'
import IHBriefcase from '~/components/globals/icons/heroicons/IHBriefcase.vue'
import IHUserFilled from '~/components/globals/icons/heroicons/IHUserFilled.vue'
import IHChevronDown from '~/components/globals/icons/heroicons/IHChevronDown.vue'
import SlideUpDown from 'vue-slide-up-down'
import DropdownButton from '~/components/DropdownButton.vue'
import IHCollection from '~/components/globals/icons/heroicons/IHCollection.vue'
import { statusTextColor } from '~/helpers/projectHelpers'

@Component({
  components: {
    IHCollection,
    DropdownButton,
    IHChevronDown,
    IHUserFilled,
    IHBriefcase,
    IHCalendar,
    EventTableRow,
    IHPlus,
    IHChevronLeft,
    IHPencil,
    InviteCandidateOrClientToCreateAccount,
    AddToBucketModal,
    AddEventModal,
    HistoryList,
    SlideUpDown,
  },
  async asyncData({ app, route, store, error }) {
    const data: any = {
      clientId: Number.parseInt(route.params.id),
    }
    if (data.clientId) {
      try {
        const res = await app.apolloProvider!.defaultClient.query<GetClientForViewQuery>({
          query: GetClientForView,
          variables: {
            id: data.clientId,
          },
        })
        data.client = res.data.client
      } catch (e) {
        data.client = null
      }
    }

    if (!data.client) {
      return error({ statusCode: 404 })
    }

    store.commit('client/setEvents', data.client.events)
    return data
  },
  head() {
    let clientName = ''
    if ((this as ClientsView).client) {
      const client = (this as ClientsView).client!
      clientName =
        (client.person.title ? client.person.title + ' ' : '') + client.person.firstname + ' ' + client.person.lastname
    }
    return {
      title: clientName,
    }
  },
  middleware: 'auth',
  meta: {
    requiredRole: UserRole.Employee,
    allowAlsoFor: {
      userPath: 'client.id',
      routePath: 'params.id',
    },
  },
})
export default class ClientsView extends Vue {
  UserRole = UserRole
  client: GetClientForViewQuery['client'] = null
  publicUrl = this.$config.publicUrl
  dateFilter = this.$options.filters!.date

  @Mutation('project/setClient')
  setClient

  @Mutation('project/setCompany')
  setCompany

  @State((state) => state.client.events)
  clientEvents

  @(namespace('account').Getter('isClient'))
  isClient!: boolean

  @(namespace('account').Getter('isAdmin'))
  isAdmin!: boolean

  @(namespace('account').Getter('isEmployee'))
  isEmployee!: boolean

  isHistoryExpanded = false
  areAllEventsVisible = false
  areAllProjectsVisible = false

  get alwaysVisibleEvents() {
    if (!this.client) {
      return []
    }
    return this.clientEvents.slice(0, 5)
  }

  get hiddenEvents() {
    if (!this.client || this.clientEvents.length <= 5) {
      return []
    }
    return this.clientEvents.slice(5)
  }

  toggleEventsVisibility() {
    this.areAllEventsVisible = !this.areAllEventsVisible
  }

  get alwaysVisibleProjects() {
    if (!this.client || !this.client.projects) {
      return []
    }
    return this.client.projects.data.filter((project) => project.status == 'ACTIVE' || project.status == 'PLACED')
  }

  get hiddenProjects() {
    if (
      !this.client ||
      !this.client.projects ||
      this.alwaysVisibleProjects.length == this.client.projects.data.length
    ) {
      return []
    }
    return this.client.projects.data.filter((project) => project.status !== 'ACTIVE' && project.status !== 'PLACED')
  }

  toggleProjectsVisibility() {
    this.areAllProjectsVisible = !this.areAllProjectsVisible
  }

  statusTextClass(projectStatus) {
    return statusTextColor(projectStatus)
  }

  createProjectForClient() {
    this.setClient(this.client)
    this.setCompany(this.client!.company)
    this.$router.push('/projects/new/form')
  }

  addEvent(project?: Project) {
    this.$bus.openEventFormModal(this.client, project)
  }

  addToBucket() {
    this.$bus.openAddToBucketFormModal('client', 'client', [this.client!.id])
  }

  forceDelete() {
    const variables: ForceDeleteClientMutationVariables = {
      id: this.client!.id,
    }
    return this.$apollo
      .mutate<ForceDeleteClientMutation>({
        mutation: ForceDeleteClient,
        variables,
      })
      .then(async (result) => {
        await this.$apollo.provider.defaultClient.cache.reset()
        this.$router.push('/clients')
      })
  }

  restore() {
    const variables: RestoreClientMutationVariables = {
      id: this.client!.id,
    }
    return this.$apollo
      .mutate<RestoreClientMutation>({
        mutation: RestoreClient,
        variables,
      })
      .then(async (result) => {
        await this.$apollo.provider.defaultClient.cache.reset()
        this.client!.deleted_at = null
      })
  }
}
</script>
