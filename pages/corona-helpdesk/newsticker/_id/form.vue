<template>
  <div class="container pt-5">
    <h1>{{ isCreating ? 'Create' : 'Edit' }} CHD Newsticker Item</h1>

    <ValidationObserver tag="form" @submit.prevent="onSubmit()" ref="formValidationObserver">
      <div class="grid grid-cols-1 gap-4">
        <FInput v-model="form.title" label="News title" rules="required" />
      </div>
      <div class="grid grid-cols-1 gap-4">
        <FInput v-model="form.url" label="URL" rules="required" />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <FInput v-model="form.source" label="URL" rules="required" />
        <FSelectSimple v-model="form.status" label="Status" :options="newstickerStatusOptions" />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <FDatePicker v-model="form.published_date" label="Publish date" rules="required" />
        <FInput v-model="form.published_time" label="Publish time (HH:MM)" rules="required" />
      </div>

      <div class="form-action-buttons">
        <button class="btn red-outline btn-delete" v-if="!isCreating" type="button" @click="deleteNewstickerItems">
          Delete
        </button>
        <nuxt-link to="." class="btn gray-outline">Abort</nuxt-link>
        <button class="tbtn tbtn--blue">Save</button>
      </div>
    </ValidationObserver>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import UpsertNewstickerItem from '@/graphql/ressources/newstickerItems/UpsertNewstickerItem.gql'
import DeleteNewstickerItem from '@/graphql/ressources/newstickerItems/DeleteNewstickerItem.gql'
import GetNewstickerItemForEdit from '@/graphql/ressources/newstickerItems/GetNewstickerItemForEdit.gql'

import { apolloParseErrors } from '~/helpers/apolloParseErrors'
import {
  DeleteNewstickerItemMutationVariables,
  GetNewstickerItemForEditQuery,
  Maybe,
  NewstickerItemStatus,
  StellaPlugin,
  UpsertNewstickerItemMutation,
  UpsertNewstickerItemMutationVariables,
  UserRole,
} from '~/graphql/GQLTypes'
import { ValidationObserver } from 'vee-validate'
import { validateObserver } from '~/helpers/validationHelpers'
import { parseDateFromISO, toISODate } from '~/helpers/dateHelpers'

@Component({
  components: { ValidationObserver },
  async asyncData({ app, route, redirect }) {
    const data: any = {
      isCreating: route.params.id === 'new',
      newstickerItemId: Number.parseInt(route.params.id),
    }
    if (!data.isCreating) {
      const res = await app.apolloProvider!.defaultClient.query<GetNewstickerItemForEditQuery>({
        query: GetNewstickerItemForEdit,
        variables: {
          id: data.newstickerItemId,
        },
      })
      data.loadedData = res.data.newstickerItem

      // redirect to overview, if queried id was not found
      if (!data.loadedData) {
        return redirect('/corona-helpdesk/newsticker')
      }
    }
    return data
  },
  head() {
    return {
      title: `${(this as NewstickerItemsEdit).isCreating ? 'Create' : 'Edit'} CHD Newsticker Item`,
    }
  },
  middleware: ['auth', 'stellaPlugin'],
  meta: {
    requiredRole: UserRole.CoronaHelpdeskManager,
    plugin: StellaPlugin.CoronaHelpdesk,
  },
})
export default class NewstickerItemsEdit extends Vue {
  $refs!: {
    formValidationObserver: InstanceType<typeof ValidationObserver>
  }
  isCreating = false

  form: {
    title: Maybe<string>
    source: Maybe<string>
    published_date: Maybe<Date>
    published_time: Maybe<string>
    status: NewstickerItemStatus
    url: Maybe<string>
  } = {
    title: null,
    source: null,
    published_date: null,
    published_time: null,
    status: NewstickerItemStatus.Pending,
    url: null,
  }

  newstickerStatusOptions = {}

  loadedData!: Maybe<GetNewstickerItemForEditQuery['newstickerItem']>
  private newstickerItemId: number | null = null

  private isSubmitting = false

  created() {
    // init gender options
    Object.keys(NewstickerItemStatus).forEach((status) => {
      this.newstickerStatusOptions[NewstickerItemStatus[status]] = status
    })

    // fetch data, when editing
    if (!this.isCreating && this.loadedData) {
      this.form.title = this.loadedData.title!
      this.form.source = this.loadedData.source!
      this.form.published_date = parseDateFromISO(this.loadedData.published_at)
      this.form.published_time = this.form.published_date
        ? this.form.published_date.getHours() + ':' + this.form.published_date.getMinutes()
        : null
      this.form.status = this.loadedData.status!
      this.form.url = this.loadedData.url!
    }
  }

  async onSubmit() {
    if (this.isSubmitting) {
      return
    }

    if (!(await validateObserver(this.$refs.formValidationObserver))) {
      return
    }

    this.isSubmitting = true
    try {
      this.$store.commit('updateGenericModal', {
        text: 'Uploading data to server...',
        progress: 0,
        blocking: true,
      })
      this.$bus.showGenericModal()

      // determine if we should run create or update mutation
      this.newstickerItemId = await this.upsertNewstikerItem()

      this.$bus.hideGenericModal()

      // everything went good, clear store and navigate back to list overview
      this.$bus.showSuccessModal('CHD Newsticker was successfully ' + (this.isCreating ? 'created' : 'updated'), 3000)
      this.isSubmitting = false
      await this.$apollo.provider.defaultClient.clearStore()
      // this.$router.push('/corona-helpdesk/newsticker/' + this.newstickerItemId)
      this.$router.push('/corona-helpdesk/newsticker')
    } catch (err) {
      this.isSubmitting = false
      this.$bus.hideGenericModal()
      console.error(err)
      this.$bus.showErrorModal({
        errors: apolloParseErrors(err),
      })
    }
  }

  async upsertNewstikerItem(): Promise<number> {
    if (!this.newstickerItemId && !this.isCreating) {
      throw new Error("newstickerItemId is empty, can't call upsertNewstikerItem()")
    }
    const time = this.form.published_time!.split(':')
    this.form.published_date!.setHours(parseInt(time[0]))
    this.form.published_date!.setMinutes(parseInt(time[1]))

    const variables: UpsertNewstickerItemMutationVariables = {
      input: {
        title: this.form.title,
        source: this.form.source,
        status: this.form.status,
        url: this.form.url,
        published_at: toISODate(this.form.published_date),
      },
    }

    if (!this.isCreating) {
      variables.input.id = this.newstickerItemId
    }

    const { data } = await this.$apollo.mutate<UpsertNewstickerItemMutation>({
      mutation: UpsertNewstickerItem,
      variables,
      context: {
        fetchOptions: {
          onUploadProgress: (progressEvent) => {
            this.$store.commit('updateGenericModal', {
              progress: Math.round((100 * progressEvent.loaded) / progressEvent.total),
            })
          },
        },
      },
    })

    return data!.upsertNewstickerItem!.id
  }

  deleteNewstickerItems() {
    if (!this.newstickerItemId) {
      this.$bus.showErrorModal({
        errors: ['Deletion of article is not possible, as article id is not specified.'],
      })
      return
    }
    this.$bus.showDeleteConfirmModal('Are you sure you want to delete this article?', () => {
      const variables: DeleteNewstickerItemMutationVariables = {
        id: this.newstickerItemId!,
      }
      this.$apollo
        .mutate({
          mutation: DeleteNewstickerItem,
          variables,
        })
        .then(async () => {
          this.$bus.showSuccessModal('CHD Newsticker item was successfully removed', 3000)
          await this.$apollo.provider.defaultClient.clearStore()
          this.$router.push('/corona-helpdesk/newsticker')
        })
        .catch((err) => {
          this.$bus.showErrorModal({
            errors: apolloParseErrors(err),
          })
        })
    })
  }
}
</script>

<style scoped lang="scss">
@import '../../../../assets/scss/variables';
</style>
