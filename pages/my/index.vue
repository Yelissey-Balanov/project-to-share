<template>
  <div class="container pt-5 mb-1">
    <PageHeader item-title="dashboard" :available-buttons="[]" />
    <div class="grid gap-6 mb-12" :class="{ 'xl:grid-cols-2': isRevenueManager }">
      <UsersRevenueChartCard :user-id="myUserId" />
      <OverallRevenueChartCard v-if="isRevenueManager" />
    </div>

    <div class="mb-12 rounded-lg bg-white shadow-md">
      <div class="px-6 py-5 border-b flex items-center justify-between space-x-4 relative">
        <div class="flex items-center space-x-4">
          <IHCalendar class="w-6 h-6 text-gray-700" />
          <h3>
            Your events
            <span class="text-gray-500">&middot; {{ fetchedEvents.length }}</span>
          </h3>
        </div>
        <div class="flex items-center space-x-6">
          <FDatePicker
            v-model="formEvent.day"
            :has-arrows="true"
            label="Day"
            rules="required"
            errorLabel="day"
            @input="$fetch"
          />
          <button
            class="tbtn-icon tbtn--white tbtn-icon--small"
            @click="toggleEventsVisibility"
            v-if="hiddenEvents.length > 0"
          >
            <span class="transform transition duration-300 ease-in-out" :class="{ 'rotate-180': areAllEventsVisible }">
              <IHChevronDown class="w-5 h-5" />
            </span>
          </button>
        </div>
      </div>
      <table class="bg-white w-full overflow-hidden rounded-b-lg">
        <tbody class="divide-y">
          <EventTableRow
            class=""
            v-for="event in alwaysVisibleEvents"
            :event="event"
            :displayEventable="true"
            :display-user="false"
            :key="`pce_${event.id}`"
            @onEventDeleted="onEventDeleted"
            @onOverviewEvent="onOverviewEvent"
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
              :displayEventable="true"
              :display-user="false"
              :key="`pce_${event.id}`"
              @onEventDeleted="onEventDeleted"
              @onOverviewEvent="onOverviewEvent"
            ></EventTableRow>
          </tbody>
        </table>
      </SlideUpDown>
    </div>

    <div class="mb-12 rounded-lg bg-white shadow-md">
      <div class="px-6 py-5 border-b flex items-center justify-between space-x-4 relative">
        <h2>Your revenues</h2>
        <div class="flex space-x-4">
          <FSelectSimple
            class="min-w-[90px]"
            v-model="form.month"
            label="Month"
            @input="onSearchSubmit()"
            :options="monthOptions"
            errorLabel="month"
          />
          <FSelectSimple
            class="min-w-[80px]"
            v-model="form.year"
            label="Year"
            @input="onSearchSubmit()"
            :options="yearOptions"
            errorLabel="year"
          />
        </div>
      </div>
      <div v-if="revenueItems.length === 0" class="py-8 text-center">No revenues found.</div>
      <TableWithSelectableColumns
        v-else
        class="shadow-none"
        :items="revenueItems"
        :is-pagination-on-frontend="true"
        item-title="revenues"
        item-type="revenue"
        @fetch="onSearchSubmit()"
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
    </div>

    <AddRevenueModal @updatedRevenue="updatedRevenue" />
    <ProjectInvoiceRecipientModal ref="invoiceRecipientModal" @updatedRevenue="updatedRevenue" />
    <AddEventModal />
    <EventOverviewModal ref="eventOverviewModal" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  DashboardDataQuery,
  DashboardDataQueryVariables,
  DashboardUpcomingEventsQuery,
  DashboardUpcomingEventsQueryVariables,
  EventGroup,
  GetUsersForAutocompleteQuery,
  Maybe,
  QueryUsersWhereColumn,
  RevenueStage,
  RevenueType,
  SqlOperator,
  UpdateEventMutationVariables,
  UpdateRevenueMutation,
  UserRevenuesWhereColumn,
  UserRole,
} from '~/graphql/GQLTypes'
import DashboardUpcomingEvents from '~/graphql/ressources/users/DashboardUpcomingEvents.gql'
import { apolloParseErrors } from '~/helpers/apolloParseErrors'
import IHCalendar from '~/components/globals/icons/heroicons/IHCalendar.vue'
import EventTableRow from '~/components/events/EventTableRow.vue'
import AddEventModal from '~/components/admin/AddEventModal.vue'
import EventOverviewModal from '~/components/modals/EventOverviewModal.vue'
import UsersRevenueChartCard from '~/components/dashboard/UsersRevenueChartCard.vue'
import { namespace } from 'nuxt-property-decorator'
import OverallRevenueChartCard from '~/components/dashboard/OverallRevenueChartCard.vue'
import PageHeader from '~/components/pages/PageHeader.vue'
import TableWithSelectableColumns from '~/components/pages/TableWithSelectableColumns.vue'
import RevenuesOverviewTableRow from '~/components/revenue/RevenuesOverviewTableRow.vue'
import AddRevenueModal from '~/components/admin/AddRevenueModal.vue'
import ProjectInvoiceRecipientModal from '~/components/modals/ProjectInvoiceRecipientModal.vue'
import DashboardData from '~/graphql/ressources/users/DashboardData.gql'
import SlideUpDown from 'vue-slide-up-down'
import IHChevronDown from '~/components/globals/icons/heroicons/IHChevronDown.vue'
import IHCash from '~/components/globals/icons/heroicons/IHCash.vue'
import { parseDateFromISO, toISODate } from '~/helpers/dateHelpers'
import { DateTime } from 'luxon'

@Component({
  components: {
    IHCash,
    IHChevronDown,
    ProjectInvoiceRecipientModal,
    AddRevenueModal,
    RevenuesOverviewTableRow,
    TableWithSelectableColumns,
    PageHeader,
    OverallRevenueChartCard,
    UsersRevenueChartCard,
    EventOverviewModal,
    AddEventModal,
    EventTableRow,
    IHCalendar,
    SlideUpDown,
  },
  async asyncData({ app }) {
    return {}
  },
  head() {
    return {
      title: 'Dashboard',
    }
  },
  middleware: 'auth',
  meta: {
    requiredRole: UserRole.Employee,
  },
})
export default class Dashboard extends Vue {
  $refs!: {
    eventOverviewModal: EventOverviewModal
    invoiceRecipientModal: ProjectInvoiceRecipientModal
  }

  revenueItems: NonNullable<DashboardDataQuery['me']>['revenues'] = []
  EventGroup = EventGroup
  fetchedEvents: NonNullable<DashboardUpcomingEventsQuery['me']>['events'] = []

  @(namespace('account').Getter('isRevenueManager'))
  isRevenueManager!: boolean

  form: {
    month: Maybe<string>
    year: Maybe<string>
  } = {
    month: (new Date().getMonth() + 1).toString(),
    year: new Date().getFullYear().toString(),
  }
  formEvent: {
    day: Maybe<string>
  } = {
    day: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(),
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

  areAllEventsVisible = false

  get myUserId() {
    return this.$store.state.account.user.id
  }

  mounted() {
    this.fetchRevenue()
  }

  fetch() {
    let variables = {}
    let onlyDay: any = new Date(this.formEvent.day || '')
    if (onlyDay != 'Invalid Date') {
      variables = {
        onlyDay: onlyDay.getFullYear() + '-' + (onlyDay.getMonth() + 1) + '-' + onlyDay.getDate(),
      }
      return Promise.all([
        this.$apollo
          .query<DashboardUpcomingEventsQuery>({
            query: DashboardUpcomingEvents,
            variables,
          })
          .then(({ data }) => {
            this.fetchedEvents = data.me!.events
          })
          .catch((err) => {
            this.$bus.showErrorModal({
              errors: apolloParseErrors(err),
            })
          }),
      ])
    }
  }

  get alwaysVisibleEvents() {
    return this.fetchedEvents.slice(0, 5)
  }

  get hiddenEvents() {
    return this.fetchedEvents.slice(5)
  }

  toggleEventsVisibility() {
    this.areAllEventsVisible = !this.areAllEventsVisible
  }

  onEventDeleted(deletedEvent: this['fetchedEvents'][0]) {
    const eventIndex = this.fetchedEvents.findIndex((event) => event.id === deletedEvent.id)
    if (eventIndex !== -1) {
      this.fetchedEvents.splice(eventIndex, 1)
    }
  }

  onOverviewEvent(event: this['fetchedEvents'][0]) {
    console.log('overview', event)
    this.$refs.eventOverviewModal.fetchAndOpen(event.id)
  }

  openInvoiceRecipientModal(revenueId) {
    this.$refs.invoiceRecipientModal.open(revenueId)
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
    this.fetchRevenue()
  }

  fetchRevenue() {
    const variables: DashboardDataQueryVariables = {
      where: {
        AND: [],
      },
    }
    if (this.form.year) {
      variables.where?.AND?.push({
        column: UserRevenuesWhereColumn.Year,
        operator: SqlOperator.Eq,
        value: this.form.year,
      })
    }
    if (this.form.month) {
      variables.where?.AND?.push({
        column: UserRevenuesWhereColumn.Month,
        operator: SqlOperator.Eq,
        value: this.form.month,
      })
    }
    return this.$apollo
      .query<DashboardDataQuery>({
        query: DashboardData,
        variables,
      })
      .then(({ data }) => {
        if (data.me?.revenues) {
          this.revenueItems = data.me?.revenues
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
