<template>
  <div class="container pt-5">
    <PageHeader
      :are-filters-expanded="areFiltersExpanded"
      item-title="revenues"
      item-type="revenue"
      :available-buttons="['filters']"
      @fetch="onSearchSubmit()"
      @clear="clearFilters()"
      @toggle-filters="areFiltersExpanded = !areFiltersExpanded"
    >
      <template v-slot:search-form>
        <div class="page-header-main-filters">
          <FInput class="flex-auto" v-model="form.name" label="Project or Company Name" @input="onNameChanged" />
        </div>
      </template>
      <template v-slot:slide-filters>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <FSelectSimple v-model="form.type" label="Revenue type" :options="typeOptions" />
          <FSelectSimple v-model="form.stage" label="Revenue stage" :options="stageOptions" />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FUserAutocomplete v-model="form.userAutocomplete" label="Employee" />
          <FSelectSimple v-model="form.month" label="Month" :options="monthOptions" errorLabel="month" />
          <FSelectSimple v-model="form.year" label="Year" :options="yearOptions" errorLabel="year" />
        </div>
      </template>
    </PageHeader>

    <div v-if="$fetchState.pending" class="mt-4 text-center">Loading...</div>
    <div v-else-if="revenueItems.length === 0" class="mt-4 text-center">No revenues found.</div>
    <TableWithSelectableColumns
      v-if="revenueItems.length > 0"
      :items="revenueItems"
      :paginator-info="paginatorInfo"
      item-title="revenues"
      item-type="revenue"
      @fetch="changePage"
    >
      <template v-slot:table-headers>
        <td class="px-6 py-3.5">Month</td>
        <td class="px-6 py-3.5">Amount</td>
        <td class="px-6 py-3.5">Type</td>
        <td class="px-6 py-3.5">Stage</td>
        <td class="px-6 py-3.5">Project</td>
        <td class="px-6 py-3.5">Splitting</td>
        <td class="px-6 py-3.5"></td>
      </template>
      <template v-slot:table-row="{ item }">
        <RevenuesOverviewTableRow
          :revenue="item"
          @onRevenueDeleted="onRevenueDeleted"
          @openInvoiceRecipientModal="openInvoiceRecipientModal"
        />
      </template>
    </TableWithSelectableColumns>

    <AddRevenueModal @updatedRevenue="updatedRevenue" />
    <ProjectInvoiceRecipientModal ref="invoiceRecipientModal" @updatedRevenue="updatedRevenue" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import GetRevenues from '@/graphql/ressources/revenues/GetRevenues.gql'
import { debounce } from 'lodash'
import {
  GetRevenuesQuery,
  GetRevenuesQueryVariables,
  GetUsersForAutocompleteQuery,
  Maybe,
  RevenueStage,
  RevenueType,
  SortOrder,
  UpdateRevenueMutation,
  UserRole,
} from '~/graphql/GQLTypes'
import AddToBucketModal from '~/components/admin/AddToBucketModal.vue'
import SlideUpDown from 'vue-slide-up-down'
import { apolloParseErrors } from '~/helpers/apolloParseErrors'
import RevenuesOverviewTableRow from '~/components/revenue/RevenuesOverviewTableRow.vue'
import AddRevenueModal from '~/components/admin/AddRevenueModal.vue'
import FUserAutocomplete from '~/components/admin/FUserAutocomplete.vue'
import ProjectInvoiceRecipientModal from '~/components/modals/ProjectInvoiceRecipientModal.vue'
import PageHeader from '~/components/pages/PageHeader.vue'

import TableWithSelectableColumns from '~/components/pages/TableWithSelectableColumns.vue'

@Component({
  components: {
    TableWithSelectableColumns,

    PageHeader,
    ProjectInvoiceRecipientModal,
    FUserAutocomplete,
    AddRevenueModal,
    RevenuesOverviewTableRow,
    AddToBucketModal,
    SlideUpDown,
  },
  head() {
    return {
      title: 'Revenues overview',
    }
  },
  middleware: 'auth',
  meta: {
    requiredRole: UserRole.RevenueManager,
  },
})
export default class Revenues extends Vue {
  $refs!: {
    invoiceRecipientModal: ProjectInvoiceRecipientModal
  }
  revenueItems: NonNullable<GetRevenuesQuery['revenues']>['data'] = []
  paginatorInfo: Maybe<NonNullable<GetRevenuesQuery['revenues']>['paginatorInfo']> = null
  publicUrl = this.$config.publicUrl

  areFiltersExpanded = false

  page = 1
  form: {
    month: Maybe<string>
    year: Maybe<string>
    stage: Maybe<RevenueStage>
    type: Maybe<RevenueType>
    name: Maybe<string>
    userAutocomplete: Maybe<NonNullable<GetUsersForAutocompleteQuery['users']>['data'][0]>
  } = {
    month: null,
    year: null,
    stage: null,
    type: null,
    name: null,
    userAutocomplete: null,
  }

  stageOptions = {
    [RevenueStage.PendingOrCancelled]: 'Pending or cancelled',
    [RevenueStage.Forecast]: 'Forecast',
    [RevenueStage.ReadyToInvoice]: 'Ready to invoce',
    [RevenueStage.InvoiceSent]: 'Invoice sent',
    [RevenueStage.Paid]: 'Paid',
  }

  typeOptions = {
    [RevenueType.AdminFee]: 'Admin Fee',
    [RevenueType.MonthlyFee]: 'Monthly Fee',
    [RevenueType.Retainer]: 'Retainer',
    [RevenueType.ShortlistFee]: 'Shortlist Fee',
    [RevenueType.CompletionFee]: 'Completion Fee',
    [RevenueType.SuccessFee]: 'Success Fee',
    [RevenueType.CancellationFee]: 'Cancellation Fee',
  }

  monthOptions = {
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December',
  }

  get yearOptions() {
    const currentYear = new Date().getFullYear()
    const options = {}
    for (let i = -1; i < 2; i++) {
      options[currentYear + i] = currentYear + i
    }
    return options
  }

  // this function is defined in mounted, to be able to use debounce and stay in right context
  onNameChanged = () => {}

  mounted() {

    this.onNameChanged = debounce(() => {
      if (this.areFiltersExpanded) {
        return
      }
      this.$fetch()
    }, 400)
  }

  onRevenueDeleted(revenue) {
    const revenueIndex = this.revenueItems.indexOf(revenue)
    this.revenueItems.splice(revenueIndex, 1, revenue)
  }

  updatedRevenue(revenueUpd: NonNullable<UpdateRevenueMutation['updateRevenue']>) {
    const revenue = this.revenueItems.find((rev) => rev.id === revenueUpd.id)
    if (!revenue) {
      return
    }

    revenue.month = revenueUpd.month
    revenue.year = revenueUpd.year
    revenue.stage = revenueUpd.stage
    revenue.type = revenueUpd.type
    revenue.amount = revenueUpd.amount
    revenue.revenue_users = revenueUpd.revenue_users
  }

  onSearchSubmit() {
    this.$fetch()
  }

  changePage(newPage: number) {
    this.page = newPage
    this.$fetch()
  }

  clearFilters() {
    this.form.type = null
    this.form.stage = null
    this.form.name = null
    this.form.userAutocomplete = null
    this.form.month = null
    this.form.year = null
    this.$fetch()
  }

  openInvoiceRecipientModal(revenueId) {
    this.$refs.invoiceRecipientModal.open(revenueId)
  }

  fetch() {
    this.paginatorInfo = null
    const variables: GetRevenuesQueryVariables = {
      page: this.page,
      first: 30,
      orderBy: [
        {
          column: 'year',
          order: SortOrder.Desc,
        },
        {
          column: 'month',
          order: SortOrder.Desc,
        },
      ],
      filter: {},
    }

    if (this.form.name) {
      variables.filter!.search = this.form.name
    }

    if (this.form.type) {
      variables.filter!.type = this.form.type
    }

    if (this.form.stage) {
      variables.filter!.stage = this.form.stage
    }

    if (this.form.month) {
      variables.filter!.month = parseInt(this.form.month)
    }

    if (this.form.year) {
      variables.filter!.year = parseInt(this.form.year)
    }

    if (this.form.userAutocomplete) {
      variables.filter!.user_id = this.form.userAutocomplete.id
    }

    return this.$apollo
      .query<GetRevenuesQuery>({
        query: GetRevenues,
        variables,
      })
      .then(({ data }) => {
        if (data.revenues) {
          this.revenueItems = data.revenues.data
          this.paginatorInfo = data.revenues.paginatorInfo
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
}
</script>
