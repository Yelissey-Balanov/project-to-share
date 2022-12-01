<template>
  <div v-if="chArticle" class="container pt-5">
    <div class="flex w-full justify-between items-center space-x-8 flex-wrap md:flex-nowrap mb-6">
      <h1>{{ chArticle.title }}</h1>
      <div class="flex items-center space-x-2">
        <nuxt-link to="/corona-helpdesk" class="btn gray-outline">Back to list</nuxt-link>
        <nuxt-link :to="`/corona-helpdesk/article/${chArticle.id}/form`" class="tbtn tbtn--blue">Edit</nuxt-link>
      </div>
    </div>

    <div class="flex-image-row">
      <div class="ch-article-image-wrapper">
        <img
          class="ch-article-image"
          v-if="chArticle.image"
          :src="publicUrl + chArticle.image.sizes.CH_ARTICLE_FULL.retina"
        />
        <div class="ch-article-author-block">
          <img
            class="ch-article-author-image"
            v-if="chArticle.author_image"
            :src="publicUrl + chArticle.author_image.sizes.CH_ARTICLE_AUTHOR.retina"
          />
          <div class="flex-auto">
            <div class="grid grid-cols-1 gap-4">
              <LabeledValue :value="chArticle.author" label="Author" />
            </div>
            <div class="grid grid-cols-1 gap-4">
              <LabeledValue :value="chArticle.author_position" label="Author position at company" />
            </div>
            <div class="grid grid-cols-1 gap-4">
              <LabeledValue :value="chArticle.author_company" label="Authors company location (optional)" />
            </div>
          </div>
        </div>
      </div>
      <div class="flex-auto">
        <div class="grid grid-cols-1 gap-4">
          <LabeledValue :value="chArticle.title" label="Article title" />
        </div>
        <div class="grid grid-cols-1 gap-4">
          <LabeledValue :value="chArticle.category" label="Category" />
        </div>
        <div class="grid grid-cols-1 gap-4">
          <LabeledValue :value="chArticle.image_copyright" label="Image copyright" />
        </div>
        <div class="tiptap--ch-theme">
          <div class="tiptap-wrapper box-of-grouped-fields" v-html="chArticle.content"></div>
        </div>
      </div>
    </div>

    <div class="form-action-buttons">
      <!--      <button class="btn red-outline btn-delete" v-if="!isCreating" type="button" @click="deleteChArticle">-->
      <!--        Delete-->
      <!--      </button>-->
      <nuxt-link to="/corona-helpdesk" class="btn gray-outline">Back to list</nuxt-link>
      <nuxt-link :to="`/corona-helpdesk/article/${chArticle.id}/form`" class="tbtn tbtn--blue">Edit</nuxt-link>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import GetChArticleForView from '@/graphql/ressources/chArticles/GetChArticleForView.gql'
import { GetChArticleForViewQuery, StellaPlugin, UserRole } from '~/graphql/GQLTypes'
import LabeledValue from '~/components/admin/LabeledValue.vue'

@Component({
  components: {
    LabeledValue,
  },
  async asyncData({ app, route }) {
    const data: any = {
      chArticleId: Number.parseInt(route.params.id),
    }
    if (data.chArticleId) {
      const res = await app.apolloProvider!.defaultClient.query<GetChArticleForViewQuery>({
        query: GetChArticleForView,
        variables: {
          id: data.chArticleId,
        },
      })
      data.chArticle = res.data.chArticle
    }
    return data
  },
  head() {
    const chArticle = (this as ChArticlesView).chArticle
    return {
      title: chArticle ? `${chArticle.title}` : '',
    }
  },
  middleware: ['auth', 'stellaPlugin'],
  meta: {
    requiredRole: UserRole.CoronaHelpdeskManager,
    plugin: StellaPlugin.CoronaHelpdesk,
  },
})
export default class ChArticlesView extends Vue {
  chArticle: GetChArticleForViewQuery['chArticle'] = null
  publicUrl = this.$config.publicUrl

  mounted() {
    // redirect to overview, if queried id was not found
    if (!this.chArticle) {
      this.$router.push('/corona-helpdesk')
      return
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../../../assets/scss/variables';

.flex-image-row {
  display: flex;
  flex-direction: column;

  @media (min-width: 1450px) {
    align-items: flex-start;
    flex-direction: row;
  }
}

.ch-article-image-wrapper {
  margin-right: auto;
  margin-bottom: 25px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  overflow: hidden;
  width: 564px;

  @media (min-width: 1450px) {
    margin-right: 25px;
    flex: 0 0 564px;
  }
}

.ch-article-image {
  border-radius: 5px;
}

.ch-article-author-block {
  display: flex;
  margin-top: 30px;
  align-items: flex-start;
}

.ch-article-author-image {
  margin-right: 20px;
  border-radius: 50%;
  width: 100px;
  height: 100px;
  flex: none;
}
</style>
