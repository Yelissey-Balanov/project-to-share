<template>
  <div v-if="user" class="container pt-5">
    <div class="flex justify-between items-center space-x-6">
      <nuxt-link to="/stats" class="tbtn-icon tbtn--gray mb-6" v-tooltip="{ content: 'Back to list' }"
        ><IHChevronLeft class="w-6 h-6"
      /></nuxt-link>
      <PageHeader
        class="flex-auto"
        :item-title="`Statistic of ${user.firstname} ${user.lastname}`"
        :available-buttons="['']"
        @fetch="fetchUsersStats()"
      >
        <template v-slot:search-form>
          <div class="page-header-main-filters">
            <FDatePicker
              v-model="form.range"
              :is-range="true"
              label="Time interval"
              @input="onSearchSubmit"
              :rules="'required'"
              errorLabel="time interval"
            />
          </div>
        </template>
      </PageHeader>
    </div>

    <div class="mb-8 space-y-2">
      <h2>
        Created {{ user.stats.createdCandidates.length }} candidate{{
          user.stats.createdCandidates.length !== 1 ? 's' : ''
        }}
      </h2>
      <div v-if="user.stats.createdCandidates.length === 0">
        No candidates were created by this consultant in given period of time!
      </div>
      <TableWithSelectableColumns v-else :items="user.stats.createdCandidates" :is-pagination-on-frontend="true">
        <template v-slot:table-headers>
          <td class="px-6 py-3.5">Name</td>
          <td class="px-6 py-3.5">Position</td>
          <td class="px-6 py-3.5">Gender</td>
          <td class="px-6 py-3.5">Created at</td>
        </template>
        <template v-slot:table-data="{ item }">
          <CandidateNameWithPhoto :data="item" />
          <CandidatesCompany :data="item" />
          <td class="px-6 py-3.5">
            {{ item.person.gender }}
          </td>
          <td class="px-6 py-3.5">
            {{ item.created_at | datetime }}
          </td>
        </template>
      </TableWithSelectableColumns>

      <h2 class="pt-6">
        Created {{ user.stats.createdCompanies.length }} compan{{
          user.stats.createdCompanies.length !== 1 ? 'ies' : 'y'
        }}
      </h2>
      <p v-if="user.stats.createdCompanies.length === 0">
        No companies were created by this consultant in given period of time!
      </p>
      <TableWithSelectableColumns v-else :items="user.stats.createdCompanies" :is-pagination-on-frontend="true">
        <template v-slot:table-headers>
          <td class="px-6 py-3.5">Name</td>
          <td class="px-6 py-3.5">Links</td>
          <td class="px-6 py-3.5">Created at</td>
        </template>
        <template v-slot:table-data="{ item }">
          <CompanyNameWithPhoto :data="item" />
          <CompanyLinks :data="item" />
          <td class="px-6 py-3.5">
            {{ item.created_at | datetime }}
          </td>
        </template>
      </TableWithSelectableColumns>

      <h2 class="pt-6">
        Created {{ user.stats.createdClients.length }} client{{ user.stats.createdClients.length !== 1 ? 's' : '' }}
      </h2>
      <p v-if="user.stats.createdClients.length === 0">
        No clients were created by this consultant in given period of time!
      </p>
      <TableWithSelectableColumns v-else :items="user.stats.createdClients" :is-pagination-on-frontend="true">
        <template v-slot:table-headers>
          <td class="px-6 py-3.5">Name</td>
          <td class="px-6 py-3.5">Position</td>
          <td class="px-6 py-3.5">Created at</td>
        </template>
        <template v-slot:table-data="{ item }">
          <ClientNameWithPhoto :data="item" />
          <ClientsCompany :data="item" />
          <td class="px-6 py-3.5">
            {{ item.created_at | datetime }}
          </td>
        </template>
      </TableWithSelectableColumns>

      <h2 class="pt-6">
        Created {{ user.stats.createdProjects.length }} project{{ user.stats.createdProjects.length !== 1 ? 's' : '' }}
      </h2>
      <p v-if="user.stats.createdProjects.length === 0">
        No projects were created by this consultant in given period of time!
      </p>
      <TableWithSelectableColumns v-else :items="user.stats.createdProjects" :is-pagination-on-frontend="true">
        <template v-slot:table-headers>
          <td class="px-6 py-3.5">Title</td>
          <td class="px-6 py-3.5">Company</td>
          <td class="px-6 py-3.5">Status</td>
          <td class="px-6 py-3.5">Created at</td>
        </template>
        <template v-slot:table-data="{ item }">
          <ProjectTitle :data="item" />
          <ProjectsCompany :data="item" />
          <Status :data="item" />
          <td class="px-6 py-3.5">
            {{ item.created_at | datetime }}
          </td>
        </template>
      </TableWithSelectableColumns>

      <div class="flex items-center space-x-4 pt-6">
        <h2>
          Created {{ user.stats.createdEvents.length }} event{{ user.stats.createdEvents.length !== 1 ? 's' : '' }}
        </h2>
        <button
          v-if="hiddenCreatedEvents.length > 0"
          type="button"
          class="tbtn-icon tbtn--white tbtn-icon--small"
          @click="toggleCreatedEventsVisibility"
        >
          <span
            class="transform transition duration-300 ease-in-out"
            :class="{ 'rotate-180': areAllCreatedEventsVisible }"
          >
            <IHChevronDown class="w-5 h-5" />
          </span>
        </button>
      </div>
      <p v-if="user.stats.createdEvents.length === 0">
        No events were created by this consultant in given period of time!
      </p>
      <div class="bg-white rounded-lg overflow-hidden shadow-md">
        <table class="w-full">
          <tbody class="divide-y">
            <EventTableRow
              class=""
              v-for="event in alwaysVisibleCreatedEvents"
              :event="event"
              :displayEventable="true"
              :key="`he_${event.id}`"
            ></EventTableRow>
          </tbody>
        </table>
        <SlideUpDown class="border-t ease-in-out" :active="areAllCreatedEventsVisible" :duration="350">
          <table class="w-full">
            <tbody class="divide-y">
              <EventTableRow
                class=""
                v-for="event in hiddenCreatedEvents"
                :event="event"
                :displayEventable="true"
                :key="`he_${event.id}`"
              ></EventTableRow>
            </tbody>
          </table>
        </SlideUpDown>
      </div>

      <div class="flex items-center space-x-4 pt-6">
        <h2>
          Happened {{ user.stats.happenedEvents.length }} event{{ user.stats.happenedEvents.length !== 1 ? 's' : '' }}
        </h2>
        <button
          v-if="hiddenHappenedEvents.length > 0"
          type="button"
          class="tbtn-icon tbtn--white tbtn-icon--small"
          @click="toggleHappenedEventsVisibility"
        >
          <span
            class="transform transition duration-300 ease-in-out"
            :class="{ 'rotate-180': areAllHappenedEventsVisible }"
          >
            <IHChevronDown class="w-5 h-5" />
          </span>
        </button>
      </div>
      <p v-if="user.stats.happenedEvents.length === 0"> This consultant had no events in given period of time! </p>
      <div class="bg-white rounded-lg overflow-hidden shadow-md">
        <table class="w-full">
          <tbody class="divide-y">
            <EventTableRow
              class=""
              v-for="event in alwaysVisibleHappenedEvents"
              :event="event"
              :displayEventable="true"
              :key="`ce_${event.id}`"
            ></EventTableRow>
          </tbody>
        </table>
        <SlideUpDown class="border-t ease-in-out" :active="areAllHappenedEventsVisible" :duration="350">
          <table class="w-full">
            <tbody class="divide-y">
              <EventTableRow
                class=""
                v-for="event in hiddenHappenedEvents"
                :event="event"
                :displayEventable="true"
                :key="`ce_${event.id}`"
              ></EventTableRow>
            </tbody>
          </table>
        </SlideUpDown>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, namespace, State, Vue } from 'nuxt-property-decorator'
import GetUserWithStats from '@/graphql/ressources/users/GetUserWithStats.gql'
import { GetUserWithStatsQuery, GetUserWithStatsQueryVariables, UserRole } from '~/graphql/GQLTypes'
import { DateTime } from 'luxon'
import { debounce } from 'lodash'
import { parseDateFromISO, toISODate } from '~/helpers/dateHelpers'
import PageHeader from '~/components/pages/PageHeader.vue'

import SlideUpDown from 'vue-slide-up-down'
import IHChevronLeft from '~/components/globals/icons/heroicons/IHChevronLeft.vue'
import EventTableRow from '~/components/events/EventTableRow.vue'
import IHChevronDown from '~/components/globals/icons/heroicons/IHChevronDown.vue'
import ClientNameWithPhoto from '~/components/pages/columns/ClientNameWithPhoto.vue'
import ClientsCompany from '~/components/pages/columns/ClientsCompany.vue'
import ProjectTitle from '~/components/pages/columns/ProjectTitle.vue'
import ProjectsCompany from '~/components/pages/columns/ProjectsCompany.vue'
import Status from '~/components/pages/columns/Status.vue'
import CompanyNameWithPhoto from '~/components/pages/columns/CompanyNameWithPhoto.vue'
import CompanyLinks from '~/components/pages/columns/CompanyLinks.vue'
import CandidateNameWithPhoto from '~/components/pages/columns/CandidateNameWithPhoto.vue'
import CandidatesCompany from '~/components/pages/columns/CandidatesCompany.vue'
import TableWithSelectableColumns from "~/components/pages/TableWithSelectableColumns.vue";

const defaultStartValue = DateTime.local().minus({ days: 7 }).toJSDate()
const defaultEndValue = new Date()

async function fetchUsersStats(
  apolloUser: any,
  variables: GetUserWithStatsQueryVariables
): Promise<{ data: GetUserWithStatsQuery }> {
  return apolloUser.query({
    query: GetUserWithStats,
    variables,
  })
}

@Component({
  components: {
    TableWithSelectableColumns,
    CandidatesCompany,
    CandidateNameWithPhoto,
    CompanyLinks,
    CompanyNameWithPhoto,
    Status,
    ProjectsCompany,
    ProjectTitle,
    ClientsCompany,
    ClientNameWithPhoto,
    IHChevronDown,
    EventTableRow,
    IHChevronLeft,
    PageHeader,
    SlideUpDown,
  },
  async asyncData({ app, route }) {
    const data: any = {
      userId: Number.parseInt(route.params.id),
      form: {
        range: {
          start: route.query.from ? parseDateFromISO(route.query.from as string) : defaultStartValue,
          end: route.query.till ? parseDateFromISO(route.query.till as string) : defaultEndValue,
        },
      },
    }
    if (!data.form.range.start) {
      data.form.range.start = defaultStartValue
    }
    if (!data.form.range.end) {
      data.form.range.end = defaultEndValue
    }

    if (data.userId) {
      const res = await fetchUsersStats(app.apolloProvider!.defaultClient, {
        id: data.userId,
        from: toISODate(data.form.range.start)!,
        till: toISODate(data.form.range.end)!,
      })
      data.user = res.data.user
    }
    return data
  },
  head() {
    const user = (this as UserStatsView).user!
    return {
      title: `Statistic of ${user.firstname} ${user.lastname}`,
    }
  },
  middleware: [
    'auth',
    ({ store, redirect, route }) => {
      const accountUser = store.state.account.user
      if (
        !accountUser.roles.includes(UserRole.Admin) &&
        accountUser.roles.includes(UserRole.Employee) &&
        accountUser.id !== Number.parseInt(route.params.id)
      ) {
        return redirect('/stats/' + accountUser.id)
      }
    },
  ],
  meta: {
    requiredRole: UserRole.Employee,
  },
})
export default class UserStatsView extends Vue {
  UserRole = UserRole
  publicUrl = this.$config.publicUrl
  userId?: number
  user: GetUserWithStatsQuery['user'] = null
  form!: {
    range: {
      start: Date
      end: Date
    }
  }

  areAllCreatedEventsVisible = false
  areAllHappenedEventsVisible = false

  @State((state) => state.account.user)
  accountUser

  @(namespace('account').Getter('isAdmin'))
  isAdmin!: boolean

  mounted() {
    // redirect to overview, if queried id was not found
    if (!this.user) {
      this.$router.push(this.isAdmin ? '/stats' : '/stats/' + this.accountUser.id)
      return
    }
  }

  get alwaysVisibleCreatedEvents() {
    if (!this.user || !this.user.stats.createdEvents) {
      return []
    }
    return this.user.stats.createdEvents.slice(0, 5)
  }

  get hiddenCreatedEvents() {
    if (!this.user || !this.user.stats.createdEvents || this.user.stats.createdEvents.length <= 5) {
      return []
    }
    return this.user.stats.createdEvents.slice(5)
  }

  toggleCreatedEventsVisibility() {
    this.areAllCreatedEventsVisible = !this.areAllCreatedEventsVisible
  }

  get alwaysVisibleHappenedEvents() {
    if (!this.user || !this.user.stats.happenedEvents) {
      return []
    }
    return this.user.stats.happenedEvents.slice(0, 5)
  }

  get hiddenHappenedEvents() {
    if (!this.user || !this.user.stats.happenedEvents || this.user.stats.happenedEvents.length <= 5) {
      return []
    }
    return this.user.stats.happenedEvents.slice(5)
  }

  toggleHappenedEventsVisibility() {
    this.areAllHappenedEventsVisible = !this.areAllHappenedEventsVisible
  }

  onSearchSubmit = debounce(() => {
    this.fetchUsersStats()
  }, 400)

  private fetchUsersStats() {
    const from = toISODate(this.form.range.start)
    const till = toISODate(this.form.range.end)
    if (!from || !till) {
      return
    }

    fetchUsersStats(this.$apollo, {
      id: this.userId!,
      from,
      till,
    }).then(({ data }) => {
      if (data.user) {
        this.user = data.user
      } else {
        console.error('oh oh oh, implement it!')
      }
    })
  }
}
</script>
