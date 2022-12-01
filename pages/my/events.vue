<template>
  <div class="container pt-5">
    <PageHeader item-title="my events" :available-buttons="[]" />
    <TableWithSelectableColumns
      v-if="upcomingEvents"
      :items="upcomingEvents"
      :is-pagination-on-frontend="true"
      item-title="events"
      item-type="event"
      @fetch="fetchUpcomingEvents()"
    >
      <template v-slot:table-headers>
        <td class="px-6 py-3.5">Time</td>
        <td class="px-6 py-3.5">Event</td>
        <td class="px-6 py-3.5">Person</td>
        <td class="px-6 py-3.5">Project</td>
      </template>
      <template v-slot:table-data="{ item }">
        <td class="px-6 py-3.5">
          {{ item.happened_at | date }}<br />
          <span class="text-gray-500">{{ item.happened_at | time }}</span>
        </td>
        <td class="px-6 py-3.5">
          <span class="flex flex-col items-start">
            <span
              class="px-2.5 py-1 text-xs rounded-full"
              :class="{
                'bg-blue-100 text-blue-800': item.group === EventGroup.Contact || item.group === EventGroup.Meeting,
                'bg-yellow-100 text-yellow-800': item.group === EventGroup.Interview,
                'bg-red-100 text-red-800': item.group === EventGroup.ClientInterview,
              }"
            >
              {{ item.group | replaceUnderscoreWithSpace }}
            </span>
            <span class="px-2.5 mt-0.5 text-xs text-gray-500" v-if="item.type">
              {{ item.type | replaceUnderscoreWithSpace }}
            </span>
          </span>
        </td>
        <td class="px-6 py-3.5">
          <nuxt-link
            :to="
              item.eventable.__typename === 'Candidate'
                ? `/candidates/${item.eventable.id}`
                : `/clients/${item.eventable.id}`
            "
            class="flex items-center group hover:no-underline focus:no-underline"
          >
            <div class="small-foto mr-4">
              <LImg :image="item.eventable.person.foto ? item.eventable.person.foto.sizes.PROFILE_IMAGE : null">
                <IHUserFilled class="w-12 h-12 text-gray-400 mt-3" />
              </LImg>
            </div>
            <span class="flex flex-col">
              <span class="mb-0.5 text-gray-800 group-hover:underline">{{ item.eventable.person.full_name }}</span>
              <span class="text-gray-500 text-xs tracking-wider">{{ item.eventable.__typename }}</span>
            </span>
          </nuxt-link>
        </td>
        <td class="px-6 py-3.5">
          <span class="flex flex-col items-start" v-if="item.project">
            <nuxt-link :to="`/projects/${item.project.id}`" class="text-gray-800">
              {{ item.project.title }}
            </nuxt-link>
            <nuxt-link :to="`/companies/${item.project.company.id}`" class="mt-0.5 text-xs text-gray-500">
              {{ item.project.company.aliasOrName }}
            </nuxt-link>
          </span>
        </td>
      </template>
    </TableWithSelectableColumns>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  DashboardUpcomingEventsQuery,
  DashboardUpcomingEventsQueryVariables,
  EventGroup,
  Maybe,
  UserRole,
} from '~/graphql/GQLTypes'
import DashboardUpcomingEvents from '~/graphql/ressources/users/DashboardUpcomingEvents.gql'
import { apolloParseErrors } from '~/helpers/apolloParseErrors'
import IHUserFilled from '~/components/globals/icons/heroicons/IHUserFilled.vue'
import PageHeader from '~/components/pages/PageHeader.vue'

import TableWithSelectableColumns from '~/components/pages/TableWithSelectableColumns.vue'

@Component({
  components: {
    TableWithSelectableColumns,

    PageHeader,
    IHUserFilled,
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
  EventGroup = EventGroup
  upcomingEvents: Maybe<NonNullable<DashboardUpcomingEventsQuery['me']>['events']> = null

  mounted() {
    this.fetchUpcomingEvents()
  }

  fetchUpcomingEvents(page = 1) {
    this.$apollo
      .query<DashboardUpcomingEventsQuery>({
        query: DashboardUpcomingEvents,
      })
      .then(({ data }) => {
        console.log(data)
        this.upcomingEvents = data.me!.events
      })
      .catch((err) => {
        this.$bus.showErrorModal({
          errors: apolloParseErrors(err),
        })
      })
  }
}
</script>
