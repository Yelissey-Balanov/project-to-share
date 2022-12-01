<template>
  <div class="container pt-5">
    <PageHeader item-title="it-skills" item-type="it-skill" :available-buttons="['create']" @fetch="changeRoute()">
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
      :items="itSkillItems"
      :paginator-info="paginatorInfo"
      item-title="it-skills"
      item-type="it-skill"
      @fetch="changeRoute()"
    >
      <template v-slot:table-headers>
        <td class="px-6 py-3.5">Title</td>
      </template>
      <template v-slot:table-data="{ item }">
        <td class="px-6 py-3.5">
          <nuxt-link :to="`/it-skills/${item.id}`">
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
import GetItSkills from '@/graphql/ressources/itSkills/GetItSkills.gql'
import { debounce } from 'lodash'
import { GetItSkillsQuery, GetItSkillsQueryVariables, Maybe, SortOrder, UserRole } from '~/graphql/GQLTypes'
import { Route } from 'vue-router'
import { TagOverviewQueryParams } from '~/store'
import PageHeader from '~/components/pages/PageHeader.vue'

import TableWithSelectableColumns from '~/components/pages/TableWithSelectableColumns.vue'

function fetchItSkills(
  apolloUser: any,
  filters: TagOverviewQueryParams,
  itemsPerPage = 50
): Promise<{ data: GetItSkillsQuery }> {
  const variables: GetItSkillsQueryVariables = {
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
    query: GetItSkills,
    fetchPolicy: 'no-cache',
    variables,
  })
}

@Component({
  components: { TableWithSelectableColumns, PageHeader },
  async asyncData({ route, app }) {
    const { data } = await fetchItSkills(app.apolloProvider!.defaultClient, route.query)
    return {
      itSkillItems: data.itSkills ? data.itSkills.data : null,
      paginatorInfo: data.itSkills ? data.itSkills.paginatorInfo : null,
    }
  },
  head() {
    return {
      title: 'IT Skills overview',
    }
  },
  middleware: 'auth',
  meta: {
    requiredRole: UserRole.Employee,
  },
})
export default class ItSkills extends Vue {
  itSkillItems: NonNullable<GetItSkillsQuery['itSkills']>['data'] = []
  paginatorInfo: Maybe<NonNullable<GetItSkillsQuery['itSkills']>['paginatorInfo']> = null

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
    this.$store.commit('itSkill/setOverviewQueryParams', val.query)

    // update form values, because route params may be changed via simple nuxt-link (e.g. from menu)
    this.fillFormFromQuery()

    fetchItSkills(this.$apollo, val.query).then(({ data }) => {
      if (data.itSkills) {
        this.itSkillItems = data.itSkills.data
        this.paginatorInfo = data.itSkills.paginatorInfo
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
