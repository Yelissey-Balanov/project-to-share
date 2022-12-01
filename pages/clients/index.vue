<template>
  <div class="container pt-5">
    <PageHeader
      :are-filters-expanded="areFiltersExpanded"
      item-title="clients"
      item-type="client"
      @fetch="fetchClients()"
      @clear="clearFilters()"
      @toggle-filters="areFiltersExpanded = !areFiltersExpanded"
    >
      <template v-slot:search-form>
        <div class="page-header-main-filters">
          <FInput class="flex-auto" v-model="form.firstname" label="Firstname" @input="onNameChanged" />
          <FInput class="flex-auto" v-model="form.lastname" label="Lastname" @input="onNameChanged" />
        </div>
      </template>
      <template v-slot:slide-filters>
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex space-x-4 flex-auto">
              <FLocationAutocomplete class="flex-auto" v-model="form.location.autocompleteValue" label="Location" />
              <FInput class="w-[100px]" v-model="form.location_radius" label="Radius (km)" :as-integer="true" />
            </div>
            <FSelectIndustries v-model="form.industries" class="flex-auto" label="Industries" />
          </div>
        </div>
      </template>
    </PageHeader>
    <TableWithSelectableColumns
      :action-buttons="actionButtons"
      :selected-rows="selectedClientsIDs"
      :row-selection-is-active="true"
      :items="clientItems"
      :paginator-info="paginatorInfo"
      :available-columns="availableColumns"
      :row-actions="rowActions"
      :default-selected-columns="defaultSelectedColumns"
      item-title="clients"
      item-type="client"
      @fetch="fetchClients($event)"
      @rows-change="changeRows"
      @cancel-selection="cancelSelection"
    />

    <AddToBucketModal />
    <AddEventModal />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { debounce } from 'lodash'
import { GetClientsQuery, Maybe, UserRole } from '~/graphql/GQLTypes'
import { State } from '~/node_modules/nuxt-property-decorator'
import AddToBucketModal from '~/components/admin/AddToBucketModal.vue'
import { apolloParseErrors } from '~/helpers/apolloParseErrors'
import { ClientsFilterForm } from '~/store'
import PageHeader from '~/components/pages/PageHeader.vue'
import TableWithSelectableColumns, {
  ColumnsDefinition,
  RowActionDefinition,
} from '~/components/pages/TableWithSelectableColumns.vue'
import AddEventModal from '~/components/admin/AddEventModal.vue'
import AddEventButton from '~/components/pages/rowActions/AddEventButton.vue'

@Component({
  components: {
    AddEventModal,
    TableWithSelectableColumns,
    PageHeader,
    AddToBucketModal,
  },
  async asyncData({ app, store }) {
    const { data } = await store.dispatch('client/fetchClients')
    return {
      clientItems: data.clients ? data.clients.data : null,
      paginatorInfo: data.clients ? data.clients.paginatorInfo : null,
    }
  },
  head() {
    return {
      title: 'Clients overview',
    }
  },
  middleware: 'auth',
  meta: {
    requiredRole: UserRole.Employee,
  },
})
export default class Clients extends Vue {
  clientItems: NonNullable<GetClientsQuery['clients']>['data'] = []
  paginatorInfo: Maybe<NonNullable<GetClientsQuery['clients']>['paginatorInfo']> = null
  publicUrl = this.$config.publicUrl

  areFiltersExpanded = false

  form: ClientsFilterForm = {
    ...this.$store.state.client.clientsOverviewFilters,
    location: { ...this.$store.state.client.clientsOverviewFilters.location },
  }

  // this function is defined in mounted, to be able to use debounce and stay in right context
  onNameChanged = () => {}

  created() {
    // check if filters have to be expanded
    if (this.form.location.label || this.form.location.autocompleteValue || this.form.industries.length > 0) {
      this.areFiltersExpanded = true
    }
  }

  availableColumns: ColumnsDefinition = {
    name_with_photo: {
      title: 'Name',
      component: 'ClientNameWithPhoto',
      required: true,
    },
    company: {
      title: 'Position',
      component: 'ClientsCompany',
    },
    phone: {
      title: 'Phone number',
      component: 'PhoneNumber',
    },
    email: {
      title: 'Email',
      component: 'Email',
    },
    // last_contact: {
    //   title: 'Last contact',
    //   component: 'LastContact',
    // },
    has_stella_account: {
      title: 'Has stella account',
      component: 'HasStellaAccount',
    },
  }

  get rowActions(): RowActionDefinition[] {
    return [
      {
        component: AddEventButton,
        callback: (client) => {
          this.$bus.openEventFormModal(client, null)
        },
      },
    ]
  }

  defaultSelectedColumns = ['company']

  selectedClientsIDs: any = []

  get actionButtons() {
    return {
      add_to_bucket: {
        button: {
          class: 'hover:text-blue-700 hover:bg-blue-100',
          text: 'Add to bucket',
          icon: 'IHCollection',
          iconClass: '',
        },
        isAvailable: this.selectedClientsIDs.length > 0,
        callback: () => {
          this.submitToBucket()
        },
      },
    }
  }

  mounted() {
    this.onNameChanged = debounce(() => {
      if (this.areFiltersExpanded) {
        return
      }
      this.fetchClients()
    }, 400)
  }

  clearFilters() {
    this.form.firstname = null
    this.form.lastname = null
    this.form.location.label = null
    this.form.location.autocompleteValue = null
    this.form.location_radius = 100
    this.form.industries = []
    this.fetchClients()
  }

  private async fetchClients(page?: number) {
    this.paginatorInfo = null

    this.$store.commit('client/setClientsOverviewFilters', {
      ...this.form,
      page: page ? page : 1,
    })

    return this.$store
      .dispatch('client/fetchClients')
      .then(({ data }) => {
        if (data.clients) {
          this.clientItems = data.clients.data
          this.paginatorInfo = data.clients.paginatorInfo
        } else {
          console.error('oh oh oh, implement it!')
        }
      })
      .catch((err) => {
        this.$bus.showErrorModal({
          errors: apolloParseErrors(err),
        })
      })
  }
  cancelSelection() {
    this.selectedClientsIDs = []
  }
  changeRows(value: { isChecked: boolean; id: string }) {
    if (value.isChecked) {
      this.selectedClientsIDs.push(value.id)
    } else {
      this.selectedClientsIDs.splice(this.selectedClientsIDs.indexOf(value.id), 1)
    }
  }

  submitToBucket() {
    this.$bus.openAddToBucketFormModal('Clients', 'client', this.selectedClientsIDs, () => this.cancelSelection())
  }
}
</script>
