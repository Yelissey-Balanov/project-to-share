<template>
  <div class="container pt-5">
    <h1>{{ isCreating ? 'Create' : 'Edit' }} Corona Helpdesk Article</h1>

    <ValidationObserver tag="form" @submit.prevent="onSubmit()" ref="formValidationObserver">
      <div class="flex-image-row">
        <div class="ch-article-image-column">
          <CropperInModal class="ch-article-image-wrapper" v-model="form.image" v-slot="{ openModal }">
            <img class="ch-article-image" :src="form.image.croppedImage" />
            <button type="button" class="btn btn-icon primary" @click="openModal()">
              <IPencil />
            </button>
          </CropperInModal>

          <div class="ch-article-author-block">
            <CropperInModal class="ch-article-author-image-wrapper" v-model="form.author_image" v-slot="{ openModal }">
              <img class="ch-article-author-image" :src="form.author_image.croppedImage" />
              <button type="button" class="btn btn-icon primary" @click="openModal()">
                <IPencil />
              </button>
            </CropperInModal>
            <div class="flex-auto">
              <div class="grid grid-cols-1 gap-4">
                <FInput v-model="form.author" label="Author" rules="required" />
              </div>
              <div class="grid grid-cols-1 gap-4">
                <FInput v-model="form.author_position" label="Author position at company (footer 2nd row)" />
              </div>
              <div class="grid grid-cols-1 gap-4">
                <FInput v-model="form.author_company" label="Authors company location (optional, footer 3rd row)" />
              </div>
            </div>
          </div>
        </div>
        <div class="flex-auto">
          <div class="grid grid-cols-1 gap-4">
            <FInput v-model="form.title" label="Article title" rules="required" />
          </div>
          <div class="grid grid-cols-1 gap-4">
            <FMultiselect
              v-model="form.category"
              label="Category"
              :options="categoryOptions"
              :isSingle="true"
              :isTaggable="false"
              rules="required"
            />
          </div>
          <div class="grid grid-cols-1 gap-4">
            <FInput v-model="form.image_copyright" label="Image copyright" />
          </div>
          <div class="grid grid-cols-1 gap-4">
            <FTiptap class="tiptap--ch-theme" v-model="form.content" ref="tiptapContent" />
          </div>
        </div>
      </div>

      <div class="form-action-buttons">
        <button class="btn red-outline btn-delete" v-if="!isCreating" type="button" @click="deleteChArticle">
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

import GetChArticleForEdit from '@/graphql/ressources/chArticles/GetChArticleForEdit.gql'
import DeleteChArticle from '@/graphql/ressources/chArticles/DeleteChArticle.gql'
import CreateChArticle from '@/graphql/ressources/chArticles/CreateChArticle.gql'
import UpdateChArticle from '@/graphql/ressources/chArticles/UpdateChArticle.gql'

import { apolloParseErrors } from '~/helpers/apolloParseErrors'
import {
  CreateChArticleMutation,
  CreateChArticleMutationVariables,
  DeleteChArticleMutationVariables,
  Maybe,
  UpdateChArticleMutation,
  UpdateChArticleMutationVariables,
  UserRole,
  GetChArticleForEditQuery,
  StellaPlugin,
} from '~/graphql/GQLTypes'
import { ValidationObserver } from 'vee-validate'
import { validateObserver } from '~/helpers/validationHelpers'
import FTiptap from '~/components/form/FTiptap.vue'
import { CropperInModalData, IdWithTitle } from '~/helpers/types'
import CropperInModal from '~/components/form/CropperInModal.vue'

@Component({
  components: { CropperInModal, FTiptap, ValidationObserver },
  async asyncData({ app, route }) {
    const data: any = {
      isCreating: route.params.id === 'new',
      chArticleId: Number.parseInt(route.params.id),
    }
    if (!data.isCreating) {
      const res = await app.apolloProvider!.defaultClient.query<GetChArticleForEditQuery>({
        query: GetChArticleForEdit,
        variables: {
          id: data.chArticleId,
        },
      })
      data.loadedData = res.data.chArticle
    }
    return data
  },
  head() {
    return {
      title: `${(this as ChArticlesEdit).isCreating ? 'Create' : 'Edit'} Corona Helpdesk Article`,
    }
  },
  middleware: ['auth', 'stellaPlugin'],
  meta: {
    requiredRole: UserRole.CoronaHelpdeskManager,
    plugin: StellaPlugin.CoronaHelpdesk,
  },
})
export default class ChArticlesEdit extends Vue {
  $refs!: {
    formValidationObserver: InstanceType<typeof ValidationObserver>
    tiptapContent: any
  }
  isCreating = false

  form: {
    title: Maybe<string>
    content: Maybe<string>
    author: Maybe<string>
    author_position: Maybe<string>
    author_company: Maybe<string>
    image_copyright: Maybe<string>
    category: Maybe<IdWithTitle<string>>
    image: CropperInModalData
    author_image: CropperInModalData
  } = {
    title: null,
    content: null,
    author: null,
    author_position: null,
    author_company: null,
    image_copyright: null,
    category: null,
    image: {
      sizeName: 'CH_ARTICLE_FULL',
      file: null,
      fullImage: null,
      croppedImage: null,
      cropProps: null,
      isDirty: false,
    },
    author_image: {
      sizeName: 'CH_ARTICLE_AUTHOR',
      file: null,
      fullImage: null,
      croppedImage: null,
      cropProps: null,
      isDirty: false,
    },
  }

  categoryOptions: IdWithTitle<string>[] = [
    'Transformation',
    'Leadership',
    'Organisation',
    'Restructuring',
    'Digital',
    'Industry Expert',
    'Insight',
    'Medical',
    'Political',
    'Corporate Finance',
    'Human Resources',
    'Finance',
    'Marketing',
    'Sales',
  ].map((category) => ({
    id: category,
    title: category,
  }))

  loadedData!: Maybe<GetChArticleForEditQuery['chArticle']>
  private chArticleId: number | null = null

  private isSubmitting = false

  created() {
    // redirect to overview, if queried id was not found
    if (!this.isCreating && !this.loadedData) {
      this.$router.push('/chArticles')
      return
    }

    // fetch data, when editing
    if (!this.isCreating && this.loadedData) {
      this.form.title = this.loadedData.title!
      this.form.content = this.loadedData.content
      this.form.author = this.loadedData.author
      this.form.author_position = this.loadedData.author_position!
      this.form.author_company = this.loadedData.author_company!
      this.form.image_copyright = this.loadedData.image_copyright!
      if (this.loadedData.category) {
        this.form.category = {
          id: this.loadedData.category,
          title: this.loadedData.category,
        }
      }

      if (this.loadedData.image) {
        this.form.image.croppedImage = this.$config.publicUrl + this.loadedData.image.sizes.CH_ARTICLE_FULL!.retina
        this.form.image.fullImage = this.$config.publicUrl + this.loadedData.image.original_image
        this.form.image.cropProps = this.loadedData.image.sizes.CH_ARTICLE_FULL!.cropProps!
      }

      if (this.loadedData.author_image) {
        this.form.author_image.croppedImage =
          this.$config.publicUrl + this.loadedData.author_image.sizes.CH_ARTICLE_AUTHOR!.retina
        this.form.author_image.fullImage = this.$config.publicUrl + this.loadedData.author_image.original_image
        this.form.author_image.cropProps = this.loadedData.author_image.sizes.CH_ARTICLE_AUTHOR!.cropProps!
      }
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
      // let createOrUpdateFn = this.isCreating ? this.createChArticle : this.updateChArticle;
      let createOrUpdateFn = this.isCreating ? this.createChArticle : this.updateChArticle
      // store chArticleId
      this.chArticleId = await createOrUpdateFn()

      this.$bus.hideGenericModal()

      // everything went good, clear store and navigate back to list overview
      this.$bus.showSuccessModal(
        'Corona Helpdesk Article was successfully ' + (this.isCreating ? 'created' : 'updated'),
        3000
      )
      this.isSubmitting = false
      await this.$apollo.provider.defaultClient.clearStore()
      this.$router.push('/corona-helpdesk/article/' + this.chArticleId)
    } catch (err) {
      this.isSubmitting = false
      console.error(err)
      this.$bus.showErrorModal({
        errors: apolloParseErrors(err),
      })
    }
  }

  async createChArticle(): Promise<number> {
    const variables: CreateChArticleMutationVariables = {
      input: await this.generateInput(),
    }

    const { data } = await this.$apollo.mutate<CreateChArticleMutation>({
      mutation: CreateChArticle,
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

    return data!.createChArticle!.id
  }

  async updateChArticle(): Promise<number> {
    if (!this.chArticleId) {
      throw new Error("chArticleId is empty, can't call updateConsultant()")
    }
    const variables: UpdateChArticleMutationVariables = {
      id: this.chArticleId,
      input: await this.generateInput(),
    }

    const { data } = await this.$apollo.mutate<UpdateChArticleMutation>({
      mutation: UpdateChArticle,
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

    return data!.updateChArticle!.id
  }

  deleteChArticle() {
    if (!this.chArticleId) {
      this.$bus.showErrorModal({
        errors: ['Deletion of article is not possible, as article id is not specified.'],
      })
      return
    }
    this.$bus.showDeleteConfirmModal('Are you sure you want to delete this article?', () => {
      const variables: DeleteChArticleMutationVariables = {
        id: this.chArticleId!,
      }
      this.$apollo
        .mutate({
          mutation: DeleteChArticle,
          variables,
        })
        .then(async () => {
          this.$bus.showSuccessModal('Corona Helpdesk Article was successfully removed', 3000)
          await this.$apollo.provider.defaultClient.clearStore()
          this.$router.push('/corona-helpdesk')
        })
        .catch((err) => {
          this.$bus.showErrorModal({
            errors: apolloParseErrors(err),
          })
        })
    })
  }

  private async generateInput(): Promise<CreateChArticleMutationVariables['input']> {
    const input: CreateChArticleMutationVariables['input'] = {
      title: this.form.title!,
      content: this.$refs.tiptapContent.getHTML(),
      category: this.form.category!.id,
      author: this.form.author!,
      author_position: this.form.author_position!,
      author_company: this.form.author_company!,
      image_copyright: this.form.image_copyright!,
    }

    // fill image
    if (this.form.image.isDirty) {
      input.image = {
        file: this.form.image.file,
        cropProps: this.form.image.cropProps!,
        sizeName: this.form.image.sizeName,
      }
    }

    // fill author image
    if (this.form.author_image.isDirty) {
      input.author_image = {
        file: this.form.author_image.file,
        cropProps: this.form.author_image.cropProps!,
        sizeName: this.form.author_image.sizeName,
      }
    }

    return input
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

.ch-article-image-column {
  margin-right: auto;
  margin-bottom: 25px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  position: relative;
  max-width: 564px;

  @media (min-width: 1450px) {
    margin-right: 25px;
    flex: 0 0 564px;
  }
}

.ch-article-image-wrapper {
  position: relative;

  .btn {
    position: absolute;
    bottom: -15px;
    right: -10px;
  }

  .ch-article-image {
    overflow: hidden;
    border-radius: 5px;
    background: $color-gray;
    width: 564px;
    height: 350px;
  }
}

.ch-article-author-block {
  margin-top: 30px;
  display: flex;
  align-items: flex-start;
}

.ch-article-author-image-wrapper {
  position: relative;
  margin-right: 20px;
  width: 100px;
  height: 100px;
  flex: none;

  .ch-article-author-image {
    overflow: hidden;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: $color-gray;
  }

  .btn {
    position: absolute;
    bottom: -7px;
    right: -2px;
  }
}
</style>
