<template>
  <div class="container pt-5">
    <PageHeader
      :are-filters-expanded="areFiltersExpanded"
      item-title="companies"
      item-type="company"
      @fetch="fetchCompanies()"
      @clear="clearFilters()"
      @toggle-filters="areFiltersExpanded = !areFiltersExpanded"
    >
      <template v-slot:search-form>
        <FInput
          class="flex-auto md:flex-none md:w-1/2 md:items-center"
          v-model="form.name"
          label="Name"
          @input="onNameChanged"
        />
      </template>
      <template v-slot:slide-filters>
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex space-x-4 flex-auto">
              <FLocationAutocomplete class="flex-auto" v-model="form.location.autocompleteValue" label="Location" />
              <FInput class="w-[100px]" v-model="form.location_radius" label="Radius (km)" :as-integer="true" />
            </div>
            <FSelectIndustries class="flex-auto" v-model="form.industries" label="Industries" />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FInput
              v-model="form.min_employees_count"
              label="MIN employees count"
              class="flex-auto"
              :as-integer="true"
            />
            <FInput
              v-model="form.max_employees_count"
              label="MAX employees count"
              class="flex-auto"
              :as-integer="true"
            />
            <FInput v-model="form.min_annual_sales" label="MIN annual sales" class="flex-auto" :asCurrency="true" />
            <FInput v-model="form.max_annual_sales" label="MAX annual sales" class="flex-auto" :asCurrency="true" />
          </div>
        </div>
      </template>
    </PageHeader>
    <TableWithSelectableColumns
      :action-buttons="actionButtons"
      :selected-rows="selectedCompaniesIDs"
      :row-selection-is-active="true"
      :items="companyItems"
      :paginator-info="paginatorInfo"
      :available-columns="availableColumns"
      :row-actions="rowActions"
      :default-selected-columns="defaultSelectedColumns"
      item-title="companies"
      item-type="company"
      @fetch="fetchCompanies($event)"
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
import { CompaniesFilter, GetCompaniesQuery, Maybe, UserRole } from '~/graphql/GQLTypes'
import AddToBucketModal from '~/components/admin/AddToBucketModal.vue'
import { State } from '~/node_modules/nuxt-property-decorator'
import { apolloParseErrors } from '~/helpers/apolloParseErrors'
import { CompaniesFilterForm } from '~/store'
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
    const { data } = await store.dispatch('company/fetchCompanies')
    return {
      companyItems: data.companies ? data.companies.data : null,
      paginatorInfo: data.companies ? data.companies.paginatorInfo : null,
    }
  },
  head() {
    return {
      title: 'Companies overview',
    }
  },
  middleware: 'auth',
  meta: {
    requiredRole: UserRole.Employee,
  },
})
export default class Companies extends Vue {
  companyItems: NonNullable<GetCompaniesQuery['companies']>['data'] = []
  paginatorInfo: Maybe<NonNullable<GetCompaniesQuery['companies']>['paginatorInfo']> = null
  publicUrl = this.$config.publicUrl

  areFiltersExpanded = false

  form: CompaniesFilterForm = {
    ...this.$store.state.company.companiesOverviewFilters,
    location: { ...this.$store.state.company.companiesOverviewFilters.location },
  }

  // this function is defined in mounted, to be able to use debounce and stay in right context
  onNameChanged = () => {}

  created() {
    // check if filters have to be expanded
    if (
      this.form.min_annual_sales ||
      this.form.max_annual_sales ||
      this.form.min_employees_count ||
      this.form.max_employees_count ||
      this.form.location.label ||
      this.form.location.autocompleteValue ||
      this.form.industries.length > 0
    ) {
      this.areFiltersExpanded = true
    }
  }

  availableColumns: ColumnsDefinition = {
    name_with_photo: {
      title: 'Name',
      component: 'CompanyNameWithPhoto',
      required: true,
    },
    industries: {
      title: 'Industries',
      component: 'Industries',
    },
    locations: {
      title: 'Locations',
      component: 'Locations',
    },
    phone: {
      title: 'Phone number',
      component: 'PhoneNumber',
    },
    company_links: {
      title: 'Links',
      component: 'CompanyLinks',
    },
    // last_contact: {
    //   title: 'Last contact',
    //   component: 'LastContact',
    // },
  }

  get rowActions(): RowActionDefinition[] {
    return [
      {
        component: AddEventButton,
        callback: (company) => {
          this.$bus.openEventFormModal(company, null)
        },
      },
    ]
  }

  defaultSelectedColumns = ['company_links']

  selectedCompaniesIDs: any = []

  get actionButtons() {
    return {
      add_to_bucket: {
        button: {
          class: 'hover:text-blue-700 hover:bg-blue-100',
          text: 'Add to bucket',
          icon: 'IHCollection',
          iconClass: '',
        },
        isAvailable: this.selectedCompaniesIDs.length > 0,
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
      this.fetchCompanies()
    }, 400)
  }

  clearFilters() {
    this.form.name = null
    this.form.min_annual_sales = null
    this.form.max_annual_sales = null
    this.form.min_employees_count = null
    this.form.max_employees_count = null
    this.form.location.label = null
    this.form.location.autocompleteValue = null
    this.form.location_radius = 100
    this.form.industries = []
    this.fetchCompanies()
  }

  private fetchCompanies(page?: number) {
    this.paginatorInfo = null

    this.$store.commit('company/setCompaniesOverviewFilters', {
      ...this.form,
      page: page ? page : 1,
    })

    this.$store
      .dispatch('company/fetchCompanies')
      .then(({ data }) => {
        if (data.companies) {
          this.companyItems = data.companies.data
          this.paginatorInfo = data.companies.paginatorInfo
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
    this.selectedCompaniesIDs = []
  }
  changeRows(value: { isChecked: boolean; id: string }) {
    if (value.isChecked) {
      this.selectedCompaniesIDs.push(value.id)
    } else {
      this.selectedCompaniesIDs.splice(this.selectedCompaniesIDs.indexOf(value.id), 1)
    }
  }

  submitToBucket() {
    this.$bus.openAddToBucketFormModal('Companies', 'company', this.selectedCompaniesIDs, () => this.cancelSelection())
  }
}
</script>
