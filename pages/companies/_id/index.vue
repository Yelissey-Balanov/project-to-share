<template>
  <div v-if="company" class="container pt-5">
    <div class="flex w-full justify-between items-center mb-6 space-x-8">
      <nuxt-link to="/companies" class="tbtn-icon tbtn--white">
        <IHChevronLeft class="w-6 h-6" />
      </nuxt-link>

      <h1>{{ company.name }}</h1>

      <div class="flex items-center space-x-2" v-if="!company.deleted_at">
        <nuxt-link :to="`/companies/${company.id}/form`" class="tbtn-icon tbtn--blue" v-tooltip="'Edit'">
          <IHPencil class="w-6 h-6" />
        </nuxt-link>
        <DropdownButton>
          <template #items>
            <button
              class="flex items-center px-4 py-2 text-sm text-gray-700 outline-none hover:text-blue-700 hover:bg-blue-100"
              type="button"
              @click="transferData"
            >
              <IHShare class="w-5 h-5 mr-3" />
              Transfer data
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
      <div class="alert alert-danger" v-if="company.deleted_at">
        This company was deleted at {{ company.deleted_at | datetime }}, therefore it is not editable! You can either
        <button class="underline" type="button" @click="restore">restore</button>
        <template v-if="isAdmin">
          or
          <button class="underline" type="button" @click="forceDelete">force delete</button>
        </template>
        this company.
      </div>

      <div class="alert alert-warning" v-if="company.need_review_after_autocomplete && !company.deleted_at">
        This company was created via autocomplete and was not reviewed after creation.
        <nuxt-link :to="`/companies/${company.id}/form`">Enter company details here.</nuxt-link>
      </div>
    </div>

    <div class="grid gap-6 mb-8 grid-cols-1 xl:grid-cols-11">
      <div class="xl:col-span-6 flex flex-col space-y-6">
        <div class="card">
          <div class="card-header">
            <div>
              <h3>Company information</h3>
            </div>
          </div>
          <div class="card-body">
            <div>
              <span class="card-item-title first-col-1-4">Company name</span>
              <span>{{ company.name }}</span>
            </div>
            <div v-if="company.legal_form">
              <span class="card-item-title first-col-1-4">Legal form</span>
              <span>{{ company.legal_form }}</span>
            </div>
            <div v-if="company.alias">
              <span class="card-item-title first-col-1-4">Alias</span>
              <span>{{ company.alias }}</span>
            </div>
            <div v-if="company.employees_count || (company.employees_count && company.employees_count == 0)">
              <span class="card-item-title first-col-1-4">Employees count</span>
              <span>{{ company.employees_count }}</span>
            </div>
            <div v-if="company.annual_sales">
              <span class="card-item-title first-col-1-4">Annual sales</span>
              <span>{{ company.annual_sales | currency }}</span>
            </div>
            <div v-if="company.industries.length > 0">
              <span class="card-item-title first-col-1-4">Industries</span>
              <span class="-mb-2 -mr-2">
                <nuxt-link
                  class="tbadge tbadge--blue mr-2 mb-2"
                  :to="`/industries/${industry.id}`"
                  v-for="industry in company.industries"
                  :key="`ind_${industry.id}`"
                >
                  {{ industry.title }}
                </nuxt-link>
              </span>
            </div>
            <div v-if="company.about">
              <span class="card-item-title first-col-1-4 whitespace-pre-wrap">About</span>
              <span>{{ company.about }}</span>
            </div>
            <div v-if="company.invoice_notes">
              <span class="card-item-title first-col-1-4 whitespace-pre-wrap">Invoice notes</span>
              <span>{{ company.invoice_notes }}</span>
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
            <div v-if="company.website">
              <span class="card-item-title first-col-1-4">Website URL</span>
              <a :href="sanitizedWebsite" target="_blank">{{ company.website }}</a>
            </div>
            <div v-if="company.email">
              <span class="card-item-title first-col-1-4">Email</span>
              <a :href="`mailto:${company.email}`">{{ company.email }}</a>
            </div>
            <div v-if="company.jobs_external_link">
              <span class="card-item-title first-col-1-4">Companies jobs URL</span>
              <a :href="sanitizedJobsExternalLink" target="_blank">{{ company.jobs_external_link }}</a>
            </div>

            <div v-if="company.locations.length > 0">
              <span class="card-item-title first-col-1-4">Office Locations</span>
              <span class="-mb-2 -mr-2">
                <span class="mr-2 mb-2" v-for="location in company.locations">
                  {{ location.full_address }}
                </span>
              </span>
            </div>

            <div v-if="company.phonenumbers.length > 0">
              <span class="card-item-title first-col-1-4">Phonenumbers</span>
              <span>
                <ul class="space-y-2">
                  <li v-for="phonenumber in company.phonenumbers">
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
              <h3>Company relations</h3>
            </div>
          </div>
          <div class="card-body">
            <div v-if="company.parent_company">
              <span class="card-item-title first-col-1-4">Parent company</span>
              <nuxt-link :to="`/companies/${company.parent_company.id}`"
                >{{ company.parent_company.name }} {{ company.parent_company.legal_form }}
              </nuxt-link>
            </div>
            <div v-if="company.child_companies.length > 0">
              <span class="card-item-title first-col-1-4">Subsidiaries</span>
              <span>
                <ul class="space-y-2">
                  <li v-for="childCompany in company.child_companies">
                    <nuxt-link :to="`/companies/${childCompany.id}`">
                      {{ childCompany.name }} {{ childCompany.legal_form ? childCompany.legal_form : '' }}
                    </nuxt-link>
                  </li>
                </ul>
              </span>
            </div>

            <div v-if="company.clients.length > 0">
              <span class="card-item-title first-col-1-4">Our clients at company</span>
              <span>
                <ul class="space-y-2">
                  <li v-for="client in company.clients" class="flex items-center">
                    <nuxt-link :to="`/clients/${client.id}`" class="small-foto mr-4">
                      <LImg :image="client.person.foto ? client.person.foto.sizes.PROFILE_IMAGE : null">
                        <IHUserFilled class="w-12 h-12 text-gray-400 mt-3" />
                      </LImg>
                    </nuxt-link>
                    <nuxt-link :to="`/clients/${client.id}`" class="flex flex-col">
                      <div class="flex items-center">
                        <span class="tbadge tbadge--red mr-2" v-if="client.deleted_at">DELETED</span>
                        {{ client.person.title }} {{ client.person.firstname }} {{ client.person.lastname }}
                      </div>
                      <div v-if="client.position" class="mt-0.5 text-gray-500">{{ client.position }}</div>
                    </nuxt-link>
                  </li>
                </ul>
              </span>
            </div>

            <div>
              <span>Candidates count worked at company - {{ company.candidatesCount }}</span>
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
                :image="company.logo ? company.logo.sizes.PROFILE_IMAGE : null"
              >
                <IHUserFilled class="w-48 h-48 text-gray-400 mt-12" />
              </LImg>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="flex items-center space-x-4">
              <IHFolder class="w-6 h-6 text-gray-700" />
              <h3>Documents</h3>
            </div>
          </div>
          <DocumentsWrapper
            class="divide-y"
            :documents="company.documents"
            :is-parsing-info-enabled="true"
            :is-sharing-enabled="true"
          >
            <template v-slot:document="slotProps">
              <DocumentRow class="px-6 py-3" v-bind="slotProps" />
            </template>
          </DocumentsWrapper>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="flex items-center space-x-4">
              <IHCalendar class="w-6 h-6 text-gray-700" />
              <h3>
                Events with company
                <span class="text-gray-500">&middot; {{ companyEvents.length }}</span>
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
              <button class="tbtn-icon tbtn--green tbtn-icon--small" @click="addEvent" v-if="!company.deleted_at">
                <IHPlus class="w-5 h-5" />
              </button>
            </div>
          </div>
          <table class="bg-white w-full overflow-hidden rounded-b-lg">
            <tbody class="divide-y">
              <EventTableRow
                class=""
                v-for="event in lastCompanyEvents"
                :event="event"
                :display-eventable="true"
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
                  :display-eventable="true"
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
      <HistoryList :histories="company.histories" v-if="isHistoryExpanded" />
    </div>

    <!-- MODALS -->
    <AddToBucketModal />
    <AddEventModal />

    <client-only>
      <SweetModal ref="modalTransferData" title="Transfer data to another company">
        <form @submit.prevent="onTransferDataSubmit()" class="space-y-6">
          <div class="grid grid-cols-1 gap-4">
            <FCompanyAutocomplete v-model="form.transferToCompany" label="Company" />
          </div>

          <p class="text-gray-600 pb-32">
            Select company in field above. All candidates and clients from current company will be transferred to the
            selected one.
          </p>

          <div class="form-action-buttons">
            <button type="submit" class="tbtn tbtn--blue"> Submit</button>
          </div>
        </form>
      </SweetModal>
    </client-only>
  </div>
</template>

<script lang="ts">
import { Component, namespace, State, Vue } from 'nuxt-property-decorator'

import GetCompanyForView from '~/graphql/ressources/companies/GetCompanyForView.gql'
import ForceDeleteCompany from '~/graphql/ressources/companies/ForceDeleteCompany.gql'
import RestoreCompany from '~/graphql/ressources/companies/RestoreCompany.gql'
import TransferCandidatesAndClients from '~/graphql/ressources/companies/TransferCandidatesAndClients.gql'
import {
  ForceDeleteCompanyMutation,
  ForceDeleteCompanyMutationVariables,
  GetCompaniesForAutocompleteQuery,
  GetCompanyForViewQuery,
  Maybe,
  RestoreCompanyMutation,
  RestoreCompanyMutationVariables,
  TransferCandidatesAndClientsMutation,
  TransferCandidatesAndClientsMutationVariables,
  UserRole,
} from '~/graphql/GQLTypes'
import HistoryList from '~/components/admin/HistoryList.vue'
import FCompanyAutocomplete from '~/components/admin/FCompanyAutocomplete.vue'
import AddToBucketModal from '~/components/admin/AddToBucketModal.vue'
import AddEventModal from '~/components/admin/AddEventModal.vue'
import IHCalendar from '~/components/globals/icons/heroicons/IHCalendar.vue'
import IHPlus from '~/components/globals/icons/heroicons/IHPlus.vue'
import EventTableRow from '~/components/events/EventTableRow.vue'
import SlideUpDown from 'vue-slide-up-down'
import IHChevronDown from '~/components/globals/icons/heroicons/IHChevronDown.vue'
import IHChevronLeft from '~/components/globals/icons/heroicons/IHChevronLeft.vue'
import DropdownButton from '~/components/DropdownButton.vue'
import IHShare from '~/components/globals/icons/heroicons/IHShare.vue'
import IHCollection from '~/components/globals/icons/heroicons/IHCollection.vue'
import IHPencil from '~/components/globals/icons/heroicons/IHPencil.vue'
import DocumentRow from '~/components/documents/DocumentRow.vue'
import DocumentsWrapper from '~/components/documents/DocumentsWrapper.vue'
import IHFolder from '~/components/globals/icons/heroicons/IHFolder.vue'
import IHUserFilled from '~/components/globals/icons/heroicons/IHUserFilled.vue'
import sanitizeUrl from '~/helpers/sanitizeUrl'

function fetchCompany(apolloClient: any, companyId: number): Promise<{ data: GetCompanyForViewQuery }> {
  return apolloClient.query({
    query: GetCompanyForView,
    variables: {
      id: companyId,
    },
  })
}

@Component({
  components: {
    IHUserFilled,
    IHFolder,
    DocumentsWrapper,
    DocumentRow,
    IHPencil,
    IHCollection,
    IHShare,
    DropdownButton,
    IHChevronLeft,
    IHChevronDown,
    EventTableRow,
    IHPlus,
    IHCalendar,
    AddEventModal,
    AddToBucketModal,
    FCompanyAutocomplete,
    HistoryList,
    SlideUpDown,
  },
  async asyncData({ app, route, store }) {
    const data: any = {
      companyId: Number.parseInt(route.params.id),
    }
    if (data.companyId) {
      try {
        const res = await fetchCompany(app.apolloProvider!.defaultClient, data.companyId)
        data.company = res.data.company
        store.commit('company/setEvents', data.company.eventsInclClients)
      } catch (e) {
        data.company = null
      }
    }
    return data
  },
  head() {
    let companyName = ''
    if ((this as CompaniesView).company) {
      companyName = (this as CompaniesView).company!.name
    }
    return {
      title: companyName,
    }
  },
  middleware: 'auth',
  meta: {
    requiredRole: UserRole.Employee,
  },
})
export default class CompaniesView extends Vue {
  UserRole = UserRole
  company: GetCompanyForViewQuery['company'] = null
  publicUrl = this.$config.publicUrl
  dateFilter = this.$options.filters!.date

  $refs!: {
    modalTransferData: any
  }

  @State((state) => state.account.user)
  accountUser

  form: {
    transferToCompany: Maybe<NonNullable<GetCompaniesForAutocompleteQuery['companies']>['data'][0]>
  } = {
    transferToCompany: null,
  }

  isHistoryExpanded = false
  areAllEventsVisible = false

  @(namespace('account').Getter('isAdmin'))
  isAdmin!: boolean

  @State((state) => state.company.events)
  companyEvents

  get lastCompanyEvents() {
    if (!this.company) {
      return []
    }
    return this.companyEvents.slice(0, 5)
  }

  get hiddenEvents() {
    if (!this.company || this.companyEvents.length <= 5) {
      return []
    }
    return this.companyEvents.slice(5)
  }

  get sanitizedWebsite() {
    return sanitizeUrl(this.company?.website)
  }

  get sanitizedJobsExternalLink() {
    return sanitizeUrl(this.company?.jobs_external_link)
  }

  toggleEventsVisibility() {
    this.areAllEventsVisible = !this.areAllEventsVisible
  }

  created() {
    // redirect to overview, if queried id was not found
    if (!this.company) {
      this.$router.push('/companies')
      return
    }
  }

  addEvent() {
    this.$bus.openEventFormModal(this.company, null)
  }

  addToBucket() {
    this.$bus.openAddToBucketFormModal('company', 'company', [this.company!.id])
  }

  forceDelete() {
    const variables: ForceDeleteCompanyMutationVariables = {
      id: this.company!.id,
    }
    return this.$apollo
      .mutate<ForceDeleteCompanyMutation>({
        mutation: ForceDeleteCompany,
        variables,
      })
      .then(async (result) => {
        await this.$apollo.provider.defaultClient.cache.reset()
        this.$router.push('/companies')
      })
  }

  restore() {
    const variables: RestoreCompanyMutationVariables = {
      id: this.company!.id,
    }
    return this.$apollo
      .mutate<RestoreCompanyMutation>({
        mutation: RestoreCompany,
        variables,
      })
      .then(async (result) => {
        await this.$apollo.provider.defaultClient.cache.reset()
        this.company!.deleted_at = null
      })
  }

  transferData() {
    this.form.transferToCompany = null
    this.$refs.modalTransferData.open()
  }

  onTransferDataSubmit() {
    if (!this.form.transferToCompany) {
      return
    }
    this.$refs.modalTransferData.close()
    const variables: TransferCandidatesAndClientsMutationVariables = {
      fromCompanyId: this.company!.id,
      toCompanyId: this.form.transferToCompany.id,
    }
    return this.$apollo
      .mutate<TransferCandidatesAndClientsMutation>({
        mutation: TransferCandidatesAndClients,
        variables,
      })
      .then(async (result) => {
        this.$bus.showSuccessModal(
          'Candidates and clients were successfully transferred to ' + this.form.transferToCompany!.name,
          3000
        )
        await this.$apollo.provider.defaultClient.cache.reset()
        const res = await fetchCompany(this.$apollo, this.company!.id)
        this.company = res.data.company
      })
  }
}
</script>
