<template>
  <div class="container pt-5">
    <PageHeader item-title="users" item-type="user" :available-buttons="['create']" @fetch="fetchUsers()">
      <template v-slot:search-form>
        <div class="page-header-main-filters">
          <FInput class="flex-auto" v-model="form.search" label="Search" @input="onSearchSubmit" />
          <FCheckbox class="flex-none" v-model="form.only_employees" label="Only employees" @input="onSearchSubmit" />
        </div>
      </template>
    </PageHeader>
    <TableWithSelectableColumns :items="userItems" :paginator-info="paginatorInfo">
      <template v-slot:table-headers>
        <td class="px-6 py-3.5">Name</td>
        <td class="px-6 py-3.5">Email</td>
        <td class="px-6 py-3.5">Roles</td>
        <td class="px-6 py-3.5 w-[180px]">Registered At</td>
      </template>
      <template v-slot:table-data="{ item }">
        <td class="px-6 py-3.5">
          <nuxt-link :to="`/users/${item.id}`"> {{ item.firstname }} {{ item.lastname }} </nuxt-link>
        </td>
        <td class="px-6 py-3.5">
          <a :href="`mailto:${item.email}`">
            {{ item.email }}
          </a>
        </td>
        <td class="px-6 py-3.5">
          <span class="-mb-1 -mr-1">
            <div class="tbadge tbadge--blue tbadge--small mb-1 mr-1" v-for="role in item.roles" :key="role">
              {{ role }}
            </div>
          </span>
        </td>
        <td class="px-6 py-3.5 w-[180px]">
          {{ item.created_at | datetime }}
        </td>
      </template>
    </TableWithSelectableColumns>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import GetUsers from '@/graphql/ressources/users/GetUsers.gql'
import { debounce } from 'lodash'
import {
  GetUsersQuery,
  GetUsersQueryVariables,
  Maybe,
  SortOrder,
  SqlOperator,
  UserRole,
  QueryUsersWhereColumn,
} from '~/graphql/GQLTypes'
import PageHeader from '~/components/pages/PageHeader.vue'

import TableWithSelectableColumns from '~/components/pages/TableWithSelectableColumns.vue'

function fetchUsers(
  apolloUser: any,
  filter: { search?: string; roles?: UserRole[]; page?: number } = {},
  itemsPerPage = 40
): Promise<{ data: GetUsersQuery }> {
  const variables: GetUsersQueryVariables = {
    orderBy: [
      {
        column: 'created_at',
        order: SortOrder.Desc,
      },
    ],
    first: itemsPerPage,
  }
  if (filter.search) {
    variables.where = {
      OR: [
        {
          column: QueryUsersWhereColumn.Lastname,
          operator: SqlOperator.Ilike,
          value: `%${filter.search}%`,
        },
        {
          column: QueryUsersWhereColumn.Email,
          operator: SqlOperator.Ilike,
          value: `%${filter.search}%`,
        },
        {
          column: QueryUsersWhereColumn.Firstname,
          operator: SqlOperator.Ilike,
          value: `%${filter.search}%`,
        },
      ],
    }
  }
  if (filter.page) {
    variables.page = filter.page
  }
  if (filter.roles && filter.roles.length > 0) {
    variables.roles = filter.roles
  }
  return apolloUser.query({
    query: GetUsers,
    variables,
  })
}

@Component({
  components: { TableWithSelectableColumns, PageHeader },
  async asyncData({ app }) {
    const { data } = await fetchUsers(app.apolloProvider!.defaultClient, { roles: [UserRole.Employee] })
    return {
      userItems: data.users ? data.users.data : null,
      paginatorInfo: data.users ? data.users.paginatorInfo : null,
    }
  },
  head() {
    return {
      title: 'Users overview',
    }
  },
  middleware: 'auth',
  meta: {
    requiredRole: UserRole.UserManager,
  },
})
export default class Users extends Vue {
  userItems: NonNullable<GetUsersQuery['users']>['data'] = []
  paginatorInfo: Maybe<NonNullable<GetUsersQuery['users']>['paginatorInfo']> = null

  form: {
    search: string
    only_employees: boolean
  } = {
    search: '',
    only_employees: true,
  }

  onSearchSubmit = debounce(() => {
    this.fetchUsers()
  }, 400)

  private itemsPerPage = 40

  changePage(newPage: number) {
    this.fetchUsers(newPage)
  }

  private fetchUsers(page?: number) {
    const filter: any = {
      search: this.form.search,
      roles: this.form.only_employees ? [UserRole.Employee] : undefined,
    }
    if (page) {
      filter.page = page
    }
    fetchUsers(this.$apollo, filter, this.itemsPerPage).then(({ data }) => {
      if (data.users) {
        this.userItems = data.users.data
        this.paginatorInfo = data.users.paginatorInfo
      } else {
        console.error('oh oh oh, implement it!')
      }
    })
  }
}
</script>
