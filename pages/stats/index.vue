<template>
  <div class="container pt-5">
    <PageHeader item-title="statistic" :available-buttons="['']" @fetch="fetchUsersStats()">
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
    <TableWithSelectableColumns :items="statItems" :is-pagination-on-frontend="true">
      <template v-slot:table-headers>
        <td class="px-6 py-3.5">Consultant</td>
        <td class="px-6 py-3.5">Created candidates</td>
        <td class="px-6 py-3.5">Created companies</td>
        <td class="px-6 py-3.5">Created clients</td>
        <td class="px-6 py-3.5">Created projects</td>
        <td class="px-6 py-3.5">Created / happened events</td>
      </template>
      <template v-slot:table-data="{ item }">
        <td class="px-6 py-3.5">
          <nuxt-link :to="userLink(item.user.id)"> {{ item.user.firstname }} {{ item.user.lastname }} </nuxt-link>
        </td>
        <td class="px-6 py-3.5">
          {{ item.createdCandidates }}
        </td>
        <td class="px-6 py-3.5">
          {{ item.createdCompanies }}
        </td>
        <td class="px-6 py-3.5">
          {{ item.createdClients }}
        </td>
        <td class="px-6 py-3.5">
          {{ item.createdProjects }}
        </td>
        <td class="px-6 py-3.5"> {{ item.createdEvents }} / {{ item.happenedEvents }} </td>
      </template>
    </TableWithSelectableColumns>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import UsersStatsCount from '@/graphql/ressources/users/UsersStatsCount.gql'
import { debounce } from 'lodash'
import { UsersStatsCountQuery, UsersStatsCountQueryVariables, Maybe, UserRole } from '~/graphql/GQLTypes'
import { DateTime } from 'luxon'
import { toISODate } from '~/helpers/dateHelpers'
import PageHeader from '~/components/pages/PageHeader.vue'

import TableWithSelectableColumns from "~/components/pages/TableWithSelectableColumns.vue";

function fetchUsersStats(
  apolloClient: any,
  filter: { from: string; till: string }
): Promise<{ data: UsersStatsCountQuery }> {
  const variables: UsersStatsCountQueryVariables = {
    from: filter.from,
    till: filter.till,
  }
  return apolloClient.query({
    query: UsersStatsCount,
    variables,
  })
}

const defaultStartValue = DateTime.local().minus({ days: 7 }).toJSDate()
const defaultEndValue = new Date()

@Component({
  components: {TableWithSelectableColumns,  PageHeader },
  async asyncData({ app }) {
    const { data } = await fetchUsersStats(app.apolloProvider!.defaultClient, {
      from: toISODate(defaultStartValue)!,
      till: toISODate(defaultEndValue)!,
    })

    return {
      statItems: data.usersStatsCount ? data.usersStatsCount : [],
    }
  },
  head() {
    return {
      title: 'Statistic',
    }
  },
  middleware: 'auth',
  meta: {
    requiredRole: UserRole.Admin,
  },
})
export default class UsersStats extends Vue {
  statItems: UsersStatsCountQuery['usersStatsCount'] = []

  form: {
    range: {
      start: Date
      end: Date
    }
  } = {
    range: {
      start: defaultStartValue,
      end: defaultEndValue,
    },
  }

  userLink(userId) {
    return `/stats/${userId}?from=${toISODate(this.form.range.start)}&till=${toISODate(this.form.range.end)}`
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

    fetchUsersStats(this.$apollo, { from, till }).then(({ data }) => {
      if (data.usersStatsCount) {
        this.statItems = data.usersStatsCount
      } else {
        console.error('oh oh oh, implement it!')
      }
    })
  }
}
</script>
