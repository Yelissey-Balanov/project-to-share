<template>
  <div class="container pt-5">
    <div class="flex w-full justify-between items-center space-x-8 flex-wrap md:flex-nowrap">
      <div class="h1">Corona Helpdesk Articles</div>
      <!--      <form class="search-form" @submit.prevent="onSearchSubmit">-->
      <!--        <FInput v-model="form.search" label="Search" @input="onSearchSubmit"/>-->
      <!--      </form>-->
      <div class="flex items-center space-x-2">
        <nuxt-link to="/corona-helpdesk/article/new/form" class="btn green">New article</nuxt-link>
      </div>
    </div>

    <div class="data-table-wrapper">
      <br />
      <table class="table--old">
        <thead>
          <tr>
            <th> Title </th>
            <th> Category </th>
            <th> Author </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="chArticle in chArticleItems">
            <td>
              <nuxt-link :to="`/corona-helpdesk/article/${chArticle.id}`">
                {{ chArticle.title }}
              </nuxt-link>
            </td>
            <td>
              {{ chArticle.category }}
            </td>
            <td>
              {{ chArticle.author }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <br /><br /><br />
    <div class="flex w-full justify-between items-center space-x-8 flex-wrap md:flex-nowrap">
      <div class="h1">Corona Helpdesk Podcasts</div>
      <!--      <form class="search-form" @submit.prevent="onSearchSubmit">-->
      <!--        <FInput v-model="form.search" label="Search" @input="onSearchSubmit"/>-->
      <!--      </form>-->
      <div class="flex items-center space-x-2">
        <nuxt-link to="/corona-helpdesk/podcast/new/form" class="btn green">New podcast</nuxt-link>
      </div>
    </div>

    <div class="data-table-wrapper">
      <br />
      <table class="table--old">
        <thead>
          <tr>
            <th> Title </th>
            <th> Description </th>
            <th> Duration </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="chPodcast in chPodcastItems">
            <td>
              <nuxt-link :to="`/corona-helpdesk/podcast/${chPodcast.id}`">
                {{ chPodcast.title }}
              </nuxt-link>
            </td>
            <td>
              {{ chPodcast.description | maxLength }}
            </td>
            <td>
              {{ chPodcast.duration | timeDuration }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <br /><br /><br />
    <div class="flex w-full justify-between items-center space-x-8 flex-wrap md:flex-nowrap">
      <div class="h1">Corona Helpdesk Topics</div>
      <!--      <form class="search-form" @submit.prevent="onSearchSubmit">-->
      <!--        <FInput v-model="form.search" label="Search" @input="onSearchSubmit"/>-->
      <!--      </form>-->
      <div class="flex items-center space-x-2">
        <nuxt-link to="/corona-helpdesk/new/form" class="btn green">New topic</nuxt-link>
      </div>
    </div>

    <div class="data-table-wrapper">
      <br />
      <table class="table--old">
        <thead>
          <tr>
            <th> Thema </th>
            <th> Hashtags </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="chCategory in chCategoryItems">
            <td>
              <nuxt-link :to="`/corona-helpdesk/${chCategory.id}`">
                {{ chCategory.title }}
              </nuxt-link>
            </td>
            <td>
              {{ chCategory.short_text }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import GetChCategories from '@/graphql/ressources/chCategories/GetChCategories.gql'
import GetChArticles from '@/graphql/ressources/chArticles/GetChArticles.gql'
import GetChPodcasts from '@/graphql/ressources/chPodcasts/GetChPodcasts.gql'
import {
  GetChCategoriesQuery,
  GetChCategoriesQueryVariables,
  SortOrder,
  UserRole,
  QueryChCategoriesOrderByColumn,
  GetChArticlesQuery,
  GetChArticlesQueryVariables,
  QueryChArticlesOrderByColumn,
  GetChPodcastsQuery,
  GetChPodcastsQueryVariables,
  QueryChPodcastsOrderByColumn,
  StellaPlugin,
} from '~/graphql/GQLTypes'

function fetchChCategories(
  apolloClient: any,
  filter: { search?: string } = {}
): Promise<{ data: GetChCategoriesQuery }> {
  const variables: GetChCategoriesQueryVariables = {
    orderBy: [
      {
        column: QueryChCategoriesOrderByColumn.UpdatedAt,
        order: SortOrder.Desc,
      },
    ],
  }
  // if (filter.search) {}
  return apolloClient.query({
    query: GetChCategories,
    variables,
  })
}

function fetchChArticles(apolloClient: any, filter: { search?: string } = {}): Promise<{ data: GetChArticlesQuery }> {
  const variables: GetChArticlesQueryVariables = {
    orderBy: [
      {
        column: QueryChArticlesOrderByColumn.UpdatedAt,
        order: SortOrder.Desc,
      },
    ],
  }
  // if (filter.search) {}
  return apolloClient.query({
    query: GetChArticles,
    variables,
  })
}

function fetchChPodcasts(apolloClient: any, filter: { search?: string } = {}): Promise<{ data: GetChPodcastsQuery }> {
  const variables: GetChPodcastsQueryVariables = {
    orderBy: [
      {
        column: QueryChPodcastsOrderByColumn.UpdatedAt,
        order: SortOrder.Desc,
      },
    ],
  }
  // if (filter.search) {}
  return apolloClient.query({
    query: GetChPodcasts,
    variables,
  })
}

@Component({
  components: {},
  async asyncData({ app }) {
    const catQuery = await fetchChCategories(app.apolloProvider!.defaultClient)
    const artQuery = await fetchChArticles(app.apolloProvider!.defaultClient)
    const podcastQuery = await fetchChPodcasts(app.apolloProvider!.defaultClient)
    return {
      chCategoryItems: catQuery.data.chCategories ? catQuery.data.chCategories : null,
      chArticleItems: artQuery.data.chArticles ? artQuery.data.chArticles : null,
      chPodcastItems: podcastQuery.data.chPodcasts ? podcastQuery.data.chPodcasts : null,
    }
  },
  head() {
    return {
      title: 'Corona Helpdesk overview',
    }
  },
  middleware: ['auth', 'stellaPlugin'],
  meta: {
    requiredRole: UserRole.CoronaHelpdeskManager,
    plugin: StellaPlugin.CoronaHelpdesk,
  },
})
export default class Employees extends Vue {
  chCategoryItems: NonNullable<GetChCategoriesQuery['chCategories']> = []
  chArticleItems: NonNullable<GetChArticlesQuery['chArticles']> = []
  chPodcastItems: NonNullable<GetChPodcastsQuery['chPodcasts']> = []

  // form: {
  //   search: string;
  // } = {
  //   search: ''
  // };

  // this function is defined in mounted, to be able to use debounce and stay in right context
  // onSearchChanged = () => {};

  mounted() {
    // this.onSearchChanged = debounce(() => {
    //   this.fetchChCategories();
    // }, 400);
  }

  // onSearchSubmit() {
  //   this.fetchChCategories();
  // }
}
</script>

<style scoped lang="scss">
@import '../../assets/scss/variables';
</style>
