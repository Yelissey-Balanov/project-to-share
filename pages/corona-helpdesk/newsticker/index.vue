<template>
  <div class="container pt-5">
    <div class="flex w-full justify-between items-center space-x-8 flex-wrap md:flex-nowrap">
      <h1>Corona Helpdesk Newsticker</h1>
      <!--      <form class="search-form" @submit.prevent="onSearchSubmit">-->
      <!--        <FInput v-model="form.search" label="Search" @input="onSearchSubmit"/>-->
      <!--      </form>-->
      <div class="flex items-center space-x-2">
        <nuxt-link to="/corona-helpdesk/newsticker/new/form" class="btn green">New item</nuxt-link>
      </div>
    </div>

    <div class="data-table-wrapper">
      <DataTablePagination :pagination="paginatorInfo" @pageChanged="changePage" class="mt-0"></DataTablePagination>
      <table class="table--old">
        <thead>
          <tr>
            <th> Source </th>
            <th> Title </th>
            <th> Publishdate </th>
            <th width="160"> Aktions </th>
          </tr>
        </thead>
        <tbody>
          <tr
            :class="`newsticker-row newsticker-row--${newstickerItem.status}`"
            v-for="newstickerItem in newstickerItems"
          >
            <td>
              {{ newstickerItem.source }}
            </td>
            <td>
              <a :href="newstickerItem.url" target="_blank">{{ newstickerItem.title }}</a>
            </td>
            <td>
              {{ newstickerItem.published_at | datetime }}
            </td>
            <td>
              <div class="action-buttons">
                <template v-if="newstickerItem.status === NewstickerItemStatus.Pending">
                  <button
                    class="text-green-700 hover:underline"
                    type="button"
                    @click="approveNewstickerItem(newstickerItem)"
                  >
                    Approve
                  </button>
                  <button
                    class="text-red-700 hover:underline"
                    type="button"
                    @click="ignoreNewstickerItem(newstickerItem)"
                  >
                    Ignore
                  </button>
                  <br />
                  <button
                    class="text-red-700 hover:underline"
                    type="button"
                    @click="ignoreNewstickerSource(newstickerItem.source)"
                  >
                    Ignore source
                  </button>
                </template>

                <nuxt-link :to="`/corona-helpdesk/newsticker/${newstickerItem.id}/form`"> Edit </nuxt-link>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <DataTablePagination :pagination="paginatorInfo" @pageChanged="changePage"></DataTablePagination>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  AddNewstickerIgnoredSourceMutation,
  AddNewstickerIgnoredSourceMutationVariables,
  GetNewstickerItemsQuery,
  GetNewstickerItemsQueryVariables,
  Maybe,
  QueryNewstickerItemsOrderByColumn,
  NewstickerItemStatus,
  SortOrder,
  StellaPlugin,
  UpsertNewstickerItemMutation,
  UpsertNewstickerItemMutationVariables,
  UserRole,
  QueryUsersWhereColumn,
} from '~/graphql/GQLTypes'
import DataTablePagination from '~/components/admin/DataTablePagination.vue'
import GetNewstickerItems from '~/graphql/ressources/newstickerItems/GetNewstickerItems.gql'
import UpsertNewstickerItem from '~/graphql/ressources/newstickerItems/UpsertNewstickerItem.gql'
import AddNewstickerIgnoredSource from '~/graphql/ressources/newstickerIgnoredSources/AddNewstickerIgnoredSource.gql'
import { apolloParseErrors } from '~/helpers/apolloParseErrors'

function fetchNewstickerItems(apolloUser: any, page?: number): Promise<{ data: GetNewstickerItemsQuery }> {
  const variables: GetNewstickerItemsQueryVariables = {
    orderBy: [
      {
        column: QueryNewstickerItemsOrderByColumn.PublishedAt,
        order: SortOrder.Desc,
      },
    ],
    status: [NewstickerItemStatus.Pending, NewstickerItemStatus.Published],
    first: 50,
  }
  if (page) {
    variables.page = page
  }
  return apolloUser.query({
    query: GetNewstickerItems,
    variables,
  })
}

@Component({
  components: { DataTablePagination },
  async asyncData({ app }) {
    const response = await fetchNewstickerItems(app.apolloProvider!.defaultClient)
    return {
      newstickerItems: response.data.newstickerItems!.data,
      paginatorInfo: response.data.newstickerItems!.paginatorInfo,
    }
  },
  head() {
    return {
      title: 'Corona Helpdesk Newsticker',
    }
  },
  middleware: ['auth', 'stellaPlugin'],
  meta: {
    requiredRole: UserRole.CoronaHelpdeskManager,
    plugin: StellaPlugin.CoronaHelpdesk,
  },
})
export default class Employees extends Vue {
  NewstickerItemStatus = NewstickerItemStatus
  newstickerItems: NonNullable<GetNewstickerItemsQuery['newstickerItems']>['data'] = []
  paginatorInfo: Maybe<NonNullable<GetNewstickerItemsQuery['newstickerItems']>['paginatorInfo']> = null

  mounted() {}

  changePage(newPage: number) {
    fetchNewstickerItems(this.$apollo, newPage).then(({ data }) => {
      if (data.newstickerItems) {
        this.newstickerItems = data.newstickerItems.data
        this.paginatorInfo = data.newstickerItems.paginatorInfo
      } else {
        console.error('oh oh oh, implement it!')
      }
    })
  }

  async approveNewstickerItem(newstickerItem: NonNullable<GetNewstickerItemsQuery['newstickerItems']>['data'][0]) {
    try {
      const response = await this.$apollo.mutate<UpsertNewstickerItemMutation>({
        mutation: UpsertNewstickerItem,
        variables: {
          input: {
            id: newstickerItem.id,
            status: NewstickerItemStatus.Published,
          },
        } as UpsertNewstickerItemMutationVariables,
      })
      newstickerItem.status = response.data?.upsertNewstickerItem!.status!
      // this.$bus.showSuccessModal(
      //   'Newsticker item was ' + (status === NewstickerItemStatus.Published ? 'published' : 'ignored'),
      //   3000
      // )
    } catch (err) {
      this.$bus.showErrorModal({
        errors: apolloParseErrors(err),
      })
    }
  }

  async ignoreNewstickerItem(newstickerItem: NonNullable<GetNewstickerItemsQuery['newstickerItems']>['data'][0]) {
    try {
      const response = await this.$apollo.mutate<UpsertNewstickerItemMutation>({
        mutation: UpsertNewstickerItem,
        variables: {
          input: {
            id: newstickerItem.id,
            status: NewstickerItemStatus.Ignored,
          },
        } as UpsertNewstickerItemMutationVariables,
      })
      this.newstickerItems.splice(this.newstickerItems.indexOf(newstickerItem), 1)
    } catch (err) {
      this.$bus.showErrorModal({
        errors: apolloParseErrors(err),
      })
    }
  }

  ignoreNewstickerSource(name: string) {
    this.$bus.showDeleteConfirmModal(
      'Are you sure you want to ignore the source "' +
        name +
        '"?\nAll stored and upcoming news from this source will be ignored!',
      async () => {
        try {
          const response = await this.$apollo.mutate<AddNewstickerIgnoredSourceMutation>({
            mutation: AddNewstickerIgnoredSource,
            variables: {
              name,
            } as AddNewstickerIgnoredSourceMutationVariables,
          })
          await this.$apollo.provider.defaultClient.clearStore()
          this.changePage(this.paginatorInfo!.currentPage)
        } catch (err) {
          this.$bus.showErrorModal({
            errors: apolloParseErrors(err),
          })
        }
      }
    )
  }
}
</script>

<style scoped lang="scss">
@import '../../../assets/scss/variables';

.action-buttons {
  opacity: 0;
  position: relative;

  > * {
    display: inline-block;
    white-space: nowrap;
    margin-right: 15px;
  }

  > *:last-child {
    margin-right: 0;
  }
}

.newsticker-row {
  &.newsticker-row--PENDING {
    opacity: 0.25;

    &:hover {
      opacity: 1;
    }
  }

  &.newsticker-row--IGNORED {
    opacity: 0.25;
  }

  &:hover .action-buttons {
    opacity: 1;
  }
}
</style>
