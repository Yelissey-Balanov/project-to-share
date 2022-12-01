<template>
  <div class="container pt-5">
    <PageHeader
      item-title="certifications"
      item-type="certification"
      :available-buttons="['create']"
      @fetch="changeRoute()"
    >
      <template v-slot:search-form>
        <div class="page-header-main-filters">
          <FInput class="flex-auto" v-model="form.search" label="Search" @input="onSearchSubmit" />
          <FCheckbox
            class="flex-none"
            v-model="form.not_reviewed_only"
            label="Only not reviewed"
            @input="onSearchSubmit"
          />
        </div>
      </template>
    </PageHeader>
    <TableWithSelectableColumns
      :items="certificationItems"
      :paginator-info="paginatorInfo"
      item-title="certifications"
      item-type="certification"
      @fetch="changeRoute()"
    >
      <template v-slot:table-headers>
        <td class="px-6 py-3.5">Title</td>
      </template>
      <template v-slot:table-data="{ item }">
        <td class="px-6 py-3.5">
          <nuxt-link :to="`/certifications/${item.id}`">
            {{ item.title }}
          </nuxt-link>
          <span
            v-tooltip="{ content: 'Not reviewed', classes: ['tooltip--orange'] }"
            class="tbadge tbadge--orange"
            v-if="!item.is_reviewed"
            >NR</span
          >
        </td>
      </template>
    </TableWithSelectableColumns>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import GetCertifications from '@/graphql/ressources/certifications/GetCertifications.gql'
import { debounce } from 'lodash'
import { GetCertificationsQuery, GetCertificationsQueryVariables, Maybe, SortOrder, UserRole } from '~/graphql/GQLTypes'
import { Route } from 'vue-router'
import { TagOverviewQueryParams } from '~/store'
import PageHeader from '~/components/pages/PageHeader.vue'
import TableWithSelectableColumns from '~/components/pages/TableWithSelectableColumns.vue'

function fetchCertifications(
  apolloUser: any,
  filters: TagOverviewQueryParams,
  itemsPerPage = 50
): Promise<{ data: GetCertificationsQuery }> {
  const variables: GetCertificationsQueryVariables = {
    orderBy: [
      {
        column: 'title',
        order: SortOrder.Asc,
      },
    ],
    first: itemsPerPage,
  }
  if (filters.search) {
    variables.title = `%${filters.search}%`
  }
  if (filters.page) {
    variables.page = parseInt(filters.page)
  }
  if (filters.not_reviewed_only && filters.not_reviewed_only === 'true') {
    variables.is_reviewed = false
  }
  return apolloUser.query({
    query: GetCertifications,
    fetchPolicy: 'no-cache',
    variables,
  })
}

@Component({
  components: { TableWithSelectableColumns, PageHeader },
  async asyncData({ route, app }) {
    const { data } = await fetchCertifications(app.apolloProvider!.defaultClient, route.query)
    return {
      certificationItems: data.certifications ? data.certifications.data : null,
      paginatorInfo: data.certifications ? data.certifications.paginatorInfo : null,
    }
  },
  head() {
    return {
      title: 'Certifications overview',
    }
  },
  middleware: 'auth',
  meta: {
    requiredRole: UserRole.Employee,
  },
})
export default class Certifications extends Vue {
  certificationItems: NonNullable<GetCertificationsQuery['certifications']>['data'] = []
  paginatorInfo: Maybe<NonNullable<GetCertificationsQuery['certifications']>['paginatorInfo']> = null

  form: {
    search: string
    not_reviewed_only: boolean
  } = {
    search: '',
    not_reviewed_only: false,
  }

  mounted() {
    this.fillFormFromQuery()
  }

  onSearchSubmit = debounce(() => {
    this.changeRoute()
  }, 400)

  changePage(newPage: number) {
    this.changeRoute(newPage)
  }

  @Watch('$route')
  onRouteChange(val: Route) {
    // store current search params in store
    this.$store.commit('certification/setOverviewQueryParams', val.query)

    // update form values, because route params may be changed via simple nuxt-link (e.g. from menu)
    this.fillFormFromQuery()

    fetchCertifications(this.$apollo, val.query).then(({ data }) => {
      if (data.certifications) {
        this.certificationItems = data.certifications.data
        this.paginatorInfo = data.certifications.paginatorInfo
      } else {
        console.error('oh oh oh, implement it!')
      }
    })
  }

  private fillFormFromQuery() {
    if (this.$route.query.search) {
      this.form.search = this.$route.query.search as string
    } else {
      this.form.search = ''
    }

    if (this.$route.query.not_reviewed_only && this.$route.query.not_reviewed_only === 'true') {
      this.form.not_reviewed_only = true
    } else {
      this.form.not_reviewed_only = false
    }
  }

  private changeRoute(page?: number) {
    const queryParams: any = {}
    if (page) {
      queryParams.page = page.toString()
    }
    if (this.form.search) {
      queryParams.search = this.form.search
    }
    if (this.form.not_reviewed_only) {
      queryParams.not_reviewed_only = 'true'
    }

    this.$router.push({
      path: this.$route.path,
      query: queryParams,
    })
  }
}
</script>
