<template>
  <div class="container pt-5">
    <PageHeader item-title="employees" item-type="employee" :available-buttons="['create']" @fetch="fetchEmployees()">
      <template v-slot:search-form>
        <div class="page-header-main-filters">
          <FInput class="flex-auto" v-model="form.search" label="Search" @input="onSearchSubmit" />
        </div>
      </template>
    </PageHeader>
    <TableWithSelectableColumns :items="employeeItems" :paginator-info="paginatorInfo">
      <template v-slot:table-headers>
        <td class="px-6 py-3.5">Name</td>
        <td class="px-6 py-3.5">Job title</td>
        <td class="px-6 py-3.5">Phone number</td>
      </template>
      <template v-slot:table-data="{ item }">
        <td class="px-6 py-3.5">
          <nuxt-link :to="`/employees/${item.id}`"> {{ item.vorname }} {{ item.familienname }} </nuxt-link>
        </td>
        <td class="px-6 py-3.5">
          {{ item.berufsbezeichnung }}
        </td>
        <td class="px-6 py-3.5">
          {{ item.personalnummer }}
        </td>
      </template>
    </TableWithSelectableColumns>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import GetEmployees from '@/graphql/ressources/employees/GetEmployees.gql'
import { debounce } from 'lodash'
import {
  GetEmployeesQuery,
  GetEmployeesQueryVariables,
  Maybe,
  SortOrder,
  SqlOperator,
  QueryEmployeesWhereColumn,
  UserRole,
  StellaPlugin,
  QueryUsersWhereColumn,
} from '~/graphql/GQLTypes'
import PageHeader from '~/components/pages/PageHeader.vue'

import TableWithSelectableColumns from '~/components/pages/TableWithSelectableColumns.vue'

function fetchEmployees(
  apolloClient: any,
  filter: { search?: string; page?: number } = {},
  itemsPerPage = 40
): Promise<{ data: GetEmployeesQuery }> {
  const variables: GetEmployeesQueryVariables = {
    orderBy: [
      {
        column: 'vorname',
        order: SortOrder.Desc,
      },
      {
        column: 'familienname',
        order: SortOrder.Desc,
      },
    ],
    first: itemsPerPage,
  }
  if (filter.search) {
    variables.where = {
      OR: [
        {
          column: QueryEmployeesWhereColumn.BetrPersonalnummer,
          operator: SqlOperator.Ilike,
          value: `%${filter.search}%`,
        },
        {
          column: QueryEmployeesWhereColumn.Personalnummer,
          operator: SqlOperator.Ilike,
          value: `%${filter.search}%`,
        },
        {
          column: QueryEmployeesWhereColumn.Familienname,
          operator: SqlOperator.Ilike,
          value: `%${filter.search}%`,
        },
        {
          column: QueryEmployeesWhereColumn.Vorname,
          operator: SqlOperator.Ilike,
          value: `%${filter.search}%`,
        },
      ],
    }
  }
  if (filter.page) {
    variables.page = filter.page
  }
  return apolloClient.query({
    query: GetEmployees,
    variables,
  })
}

@Component({
  components: { TableWithSelectableColumns, PageHeader },
  async asyncData({ app }) {
    const { data } = await fetchEmployees(app.apolloProvider!.defaultClient)
    return {
      employeeItems: data.employees ? data.employees.data : null,
      paginatorInfo: data.employees ? data.employees.paginatorInfo : null,
    }
  },
  head() {
    return {
      title: 'Employees overview',
    }
  },
  middleware: ['auth', 'stellaPlugin'],
  meta: {
    requiredRole: UserRole.EmployeeManager,
    plugin: StellaPlugin.Employees,
  },
})
export default class Employees extends Vue {
  employeeItems: NonNullable<GetEmployeesQuery['employees']>['data'] = []
  paginatorInfo: Maybe<NonNullable<GetEmployeesQuery['employees']>['paginatorInfo']> = null

  form: {
    search: string
  } = {
    search: '',
  }

  // this function is defined in mounted, to be able to use debounce and stay in right context
  onSearchChanged = () => {}

  mounted() {
    this.onSearchChanged = debounce(() => {
      this.fetchEmployees()
    }, 400)
  }

  onSearchSubmit() {
    this.fetchEmployees()
  }

  private itemsPerPage = 40

  changePage(newPage: number) {
    this.fetchEmployees(newPage)
  }

  private fetchEmployees(page = 1) {
    fetchEmployees(
      this.$apollo,
      {
        search: this.form.search,
        page,
      },
      this.itemsPerPage
    ).then(({ data }) => {
      if (data.employees) {
        this.employeeItems = data.employees.data
        this.paginatorInfo = data.employees.paginatorInfo
      } else {
        console.error('oh oh oh, implement it!')
      }
    })
  }
}
</script>
