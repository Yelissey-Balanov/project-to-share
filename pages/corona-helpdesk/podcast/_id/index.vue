<template>
  <div v-if="chPodcast" class="container pt-5">
    <div class="flex w-full justify-between items-center space-x-8 flex-wrap md:flex-nowrap mb-6">
      <h1>{{ chPodcast.title }}</h1>
      <div class="flex items-center space-x-2">
        <nuxt-link to="/corona-helpdesk" class="btn gray-outline">Back to list</nuxt-link>
        <nuxt-link :to="`/corona-helpdesk/podcast/${chPodcast.id}/form`" class="tbtn tbtn--blue">Edit</nuxt-link>
      </div>
    </div>

    <div class="flex-image-row">
      <div class="podcast-image-wrapper">
        <img v-if="chPodcast.image" :src="publicUrl + chPodcast.image.sizes.CH_PODCAST_FULL.retina" />
      </div>
      <div class="flex-auto">
        <div class="grid grid-cols-1 gap-4">
          <LabeledValue :value="chPodcast.title" label="Podcast title" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <LabeledValue :value="chPodcast.category" label="Category" />
          <LabeledValue :value="chPodcast.duration | timeDuration" label="Duration" />
        </div>
        <div class="grid grid-cols-1 gap-4">
          <LabeledValue :value="chPodcast.description" label="Description" :pre-wrap="true" />
        </div>
      </div>
    </div>
    <div class="grid grid-cols-1 gap-4">
      <audio controls :src="chPodcast.public_url" />
    </div>

    <br />
    <h2>For Spotify, iTunes, etc.</h2>
    <div class="grid grid-cols-1 gap-4">
      <LabeledValue :value="chPodcast.rss_title" label="RSS title" />
    </div>
    <div class="grid grid-cols-1 gap-4">
      <LabeledValue :value="chPodcast.rss_description" label="RSS description" :pre-wrap="true" />
    </div>

    <div class="form-action-buttons">
      <!--      <button class="btn red-outline btn-delete" v-if="!isCreating" type="button" @click="deleteChPodcast">-->
      <!--        Delete-->
      <!--      </button>-->
      <nuxt-link to="/corona-helpdesk" class="btn gray-outline">Back to list</nuxt-link>
      <nuxt-link :to="`/corona-helpdesk/podcast/${chPodcast.id}/form`" class="tbtn tbtn--blue">Edit</nuxt-link>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import GetChPodcastForView from '@/graphql/ressources/chPodcasts/GetChPodcastForView.gql'
import { GetChPodcastForViewQuery, StellaPlugin, UserRole } from '~/graphql/GQLTypes'
import LabeledValue from '~/components/admin/LabeledValue.vue'

@Component({
  components: {
    LabeledValue,
  },
  async asyncData({ app, route }) {
    const data: any = {
      chPodcastId: Number.parseInt(route.params.id),
    }
    if (data.chPodcastId) {
      const res = await app.apolloProvider!.defaultClient.query<GetChPodcastForViewQuery>({
        query: GetChPodcastForView,
        variables: {
          id: data.chPodcastId,
        },
      })
      data.chPodcast = res.data.chPodcast
    }
    return data
  },
  head() {
    const chPodcast = (this as ChPodcastsView).chPodcast
    return {
      title: chPodcast ? `${chPodcast.title}` : '',
    }
  },
  middleware: ['auth', 'stellaPlugin'],
  meta: {
    requiredRole: UserRole.CoronaHelpdeskManager,
    plugin: StellaPlugin.CoronaHelpdesk,
  },
})
export default class ChPodcastsView extends Vue {
  chPodcast: GetChPodcastForViewQuery['chPodcast'] = null
  publicUrl = this.$config.publicUrl

  mounted() {
    // redirect to overview, if queried id was not found
    if (!this.chPodcast) {
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
  margin-bottom: 1em;

  @media (min-width: 1400px) {
    align-items: flex-start;
    flex-direction: row;
  }
}

.podcast-image-wrapper {
  margin-right: auto;
  margin-bottom: 25px;
  border-radius: 5px;
  background: $color-gray;
  display: flex;
  overflow: hidden;
  width: 615px;

  @media (min-width: 1400px) {
    margin-right: 25px;
    flex: 0 0 615px;
  }
}
</style>
