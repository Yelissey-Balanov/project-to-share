<template>
  <div class="container pt-5">
    <h1>{{ isCreating ? 'Create' : 'Edit' }} Corona Helpdesk Podcast</h1>

    <ValidationObserver tag="form" @submit.prevent="onSubmit()" ref="formValidationObserver">
      <div class="flex-image-row">
        <CropperInModal class="podcast-image-wrapper" v-model="form.image" v-slot="{ openModal }">
          <img class="podcast-image" :src="form.image.croppedImage" />
          <button type="button" class="btn btn-icon primary" @click="openModal()">
            <IPencil />
          </button>
        </CropperInModal>

        <div class="flex-auto">
          <div class="grid grid-cols-1 gap-4">
            <FInput v-model="form.title" label="Podcast title" rules="required" />
          </div>
          <div class="grid grid-cols-1 gap-4">
            <FInput v-model="form.category" label="Category" rules="required" />
          </div>
          <div class="grid grid-cols-1 gap-4">
            <FTextarea v-model="form.description" :rows="16" label="Description" rules="required" />
          </div>
        </div>
      </div>

      <br />
      <h2>For Spotify, iTunes, etc.</h2>
      <div class="grid grid-cols-1 gap-4">
        <FInput v-model="form.rss_title" label="RSS title" rules="required" />
      </div>
      <div class="grid grid-cols-1 gap-4">
        <FTextarea v-model="form.rss_description" :rows="5" label="RSS description" rules="required" />
      </div>

      <br />
      <input type="file" class="hidden" accept="audio/*" ref="audioFileInput" @change="onNewFileSelected" />
      <div class="flex w-full justify-between items-center space-x-8 flex-wrap md:flex-nowrap">
        <h2>Audio file</h2>
        <div class="flex items-center space-x-2">
          <button type="button" class="btn btn-icon green-outline" @click="$refs.audioFileInput.click()">
            <IPencil class="icon"></IPencil>
          </button>
        </div>
      </div>
      <div class="grid grid-cols-1 gap-4">
        <audio :src="form.audio.src" v-if="form.audio.src" controls ref="audio" />
        <p v-else> Audio file is not defined! </p>
      </div>

      <div class="form-action-buttons">
        <button class="btn red-outline btn-delete" v-if="!isCreating" type="button" @click="deleteChPodcast">
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

import GetChPodcastForEdit from '@/graphql/ressources/chPodcasts/GetChPodcastForEdit.gql'
import DeleteChPodcast from '@/graphql/ressources/chPodcasts/DeleteChPodcast.gql'
import CreateChPodcast from '@/graphql/ressources/chPodcasts/CreateChPodcast.gql'
import UpdateChPodcast from '@/graphql/ressources/chPodcasts/UpdateChPodcast.gql'
import UpdateChPodcastAdditional from '~/graphql/ressources/chPodcasts/UpdateChPodcastAdditional.gql'

import { apolloParseErrors } from '~/helpers/apolloParseErrors'
import {
  CreateChPodcastMutation,
  CreateChPodcastMutationVariables,
  DeleteChPodcastMutationVariables,
  Maybe,
  UpdateChPodcastMutation,
  UpdateChPodcastMutationVariables,
  UserRole,
  GetChPodcastForEditQuery,
  UpdateChPodcastAdditionalMutation,
  UpdateChPodcastAdditionalMutationVariables,
  StellaPlugin,
} from '~/graphql/GQLTypes'
import { ValidationObserver } from 'vee-validate'
import { validateObserver } from '~/helpers/validationHelpers'
import FTiptap from '~/components/form/FTiptap.vue'
import CropperInModal from '~/components/form/CropperInModal.vue'
import { CropperInModalData } from '~/helpers/types'

@Component({
  components: { CropperInModal, FTiptap, ValidationObserver },
  async asyncData({ app, route }) {
    const data: any = {
      isCreating: route.params.id === 'new',
      chPodcastId: Number.parseInt(route.params.id),
    }
    if (!data.isCreating) {
      const res = await app.apolloProvider!.defaultClient.query<GetChPodcastForEditQuery>({
        query: GetChPodcastForEdit,
        variables: {
          id: data.chPodcastId,
        },
      })
      data.loadedData = res.data.chPodcast
    }
    return data
  },
  head() {
    return {
      title: `${(this as ChPodcastsEdit).isCreating ? 'Create' : 'Edit'} Corona Helpdesk Podcast`,
    }
  },
  middleware: ['auth', 'stellaPlugin'],
  meta: {
    requiredRole: UserRole.CoronaHelpdeskManager,
    plugin: StellaPlugin.CoronaHelpdesk,
  },
})
export default class ChPodcastsEdit extends Vue {
  $refs!: {
    formValidationObserver: InstanceType<typeof ValidationObserver>
    audioFileInput: HTMLInputElement
    audio: HTMLAudioElement
  }
  isCreating = false

  form: {
    title: Maybe<string>
    description: Maybe<string>
    rss_title: Maybe<string>
    rss_description: Maybe<string>
    category: Maybe<string>
    audio: {
      file: Maybe<File>
      src: Maybe<string>
    }
    image: CropperInModalData
  } = {
    title: null,
    description: null,
    rss_title: null,
    rss_description: null,
    category: null,
    audio: {
      src: null,
      file: null,
    },
    image: {
      sizeName: 'CH_PODCAST_FULL',
      file: null,
      fullImage: null,
      croppedImage: null,
      cropProps: null,
      isDirty: false,
    },
  }

  loadedData!: Maybe<GetChPodcastForEditQuery['chPodcast']>
  private chPodcastId: number | null = null

  private isSubmitting = false

  created() {
    // redirect to overview, if queried id was not found
    if (!this.isCreating && !this.loadedData) {
      this.$router.push('/chPodcasts')
      return
    }

    // fetch data, when editing
    if (!this.isCreating && this.loadedData) {
      this.form.title = this.loadedData.title
      this.form.description = this.loadedData.description
      this.form.rss_title = this.loadedData.rss_title
      this.form.rss_description = this.loadedData.rss_description
      this.form.category = this.loadedData.category!
      this.form.audio.src = this.loadedData.public_url!

      if (this.loadedData.image) {
        this.form.image.croppedImage = this.$config.publicUrl + this.loadedData.image.sizes.CH_PODCAST_FULL!.retina
        this.form.image.fullImage = this.$config.publicUrl + this.loadedData.image.original_image
        this.form.image.cropProps = this.loadedData.image.sizes.CH_PODCAST_FULL!.cropProps!
      }
    }
  }

  onNewFileSelected() {
    if (!this.$refs.audioFileInput.files!.length) {
      return
    }
    this.form.audio.file = this.$refs.audioFileInput.files![0]
    this.$refs.audioFileInput.value = ''
    this.form.audio.src = URL.createObjectURL(this.form.audio.file)
  }

  async onSubmit() {
    if (this.isSubmitting) {
      return
    }

    if (!(await validateObserver(this.$refs.formValidationObserver))) {
      return
    }

    if (this.isCreating && !this.form.audio.file) {
      this.$bus.showErrorModal({ errors: ['Audio file was not attached!'] })
      return
    }

    this.isSubmitting = true
    try {
      this.$store.commit('updateGenericModal', {
        text: 'Storing form values and image...',
        progress: 0,
        blocking: true,
      })
      this.$bus.showGenericModal()

      // determine if we should run create or update mutation
      // let createOrUpdateFn = this.isCreating ? this.createChPodcast : this.updateChPodcast;
      let createOrUpdateFn = this.isCreating ? this.createChPodcast : this.updateChPodcast
      // store chPodcastId
      this.chPodcastId = await createOrUpdateFn()

      await this.updateChPodcastAdditional()
      this.$bus.hideGenericModal()

      // everything went good, clear store and navigate back to list overview
      this.$bus.showSuccessModal(
        'Corona Helpdesk Podcast was successfully ' + (this.isCreating ? 'created' : 'updated'),
        3000
      )
      this.isSubmitting = false
      await this.$apollo.provider.defaultClient.clearStore()
      this.$router.push('/corona-helpdesk/podcast/' + this.chPodcastId)
    } catch (err) {
      this.isSubmitting = false
      console.error(err)
      this.$bus.showErrorModal({
        errors: apolloParseErrors(err),
      })
    }
  }

  async createChPodcast(): Promise<number> {
    const variables: CreateChPodcastMutationVariables = {
      input: this.generateInput(),
    }

    const { data } = await this.$apollo.mutate<CreateChPodcastMutation>({
      mutation: CreateChPodcast,
      variables,
      context: {
        fetchOptions: {
          onUploadProgress: (progressEvent) => {
            this.$store.commit('updateGenericModal', {
              progress: Math.round(((100 / 2) * progressEvent.loaded) / progressEvent.total),
            })
          },
        },
      },
    })

    return data!.createChPodcast!.id
  }

  async updateChPodcast(): Promise<number> {
    if (!this.chPodcastId) {
      throw new Error("chPodcastId is empty, can't call updateConsultant()")
    }
    const variables: UpdateChPodcastMutationVariables = {
      id: this.chPodcastId,
      input: this.generateInput(),
    }

    const { data } = await this.$apollo.mutate<UpdateChPodcastMutation>({
      mutation: UpdateChPodcast,
      variables,
      context: {
        fetchOptions: {
          onUploadProgress: (progressEvent) => {
            this.$store.commit('updateGenericModal', {
              progress: Math.round(((100 / 2) * progressEvent.loaded) / progressEvent.total),
            })
          },
        },
      },
    })

    return data!.updateChPodcast!.id
  }

  async updateChPodcastAdditional() {
    if (!this.chPodcastId) {
      throw new Error("chPodcastId is empty, can't call updateConsultant()")
    }

    this.$store.commit('updateGenericModal', {
      text: 'Storing audio file...',
      progress: Math.round(100 / 2),
    })

    const variables: UpdateChPodcastAdditionalMutationVariables = {
      id: this.chPodcastId,
      input: {},
    }

    if (this.form.audio.file) {
      variables.input.audio = this.form.audio.file
    }

    const { data } = await this.$apollo.mutate<UpdateChPodcastAdditionalMutation>({
      mutation: UpdateChPodcastAdditional,
      variables,
      context: {
        fetchOptions: {
          onUploadProgress: (progressEvent) => {
            this.$store.commit('updateGenericModal', {
              progress: Math.round(100 / 2 + ((100 / 2) * progressEvent.loaded) / progressEvent.total),
            })
          },
        },
      },
    })

    return data
  }

  deleteChPodcast() {
    if (!this.chPodcastId) {
      this.$bus.showErrorModal({
        errors: ['Deletion of podcast is not possible, as podcast id is not specified.'],
      })
      return
    }
    this.$bus.showDeleteConfirmModal('Are you sure you want to delete this podcast?', () => {
      const variables: DeleteChPodcastMutationVariables = {
        id: this.chPodcastId!,
      }
      this.$apollo
        .mutate({
          mutation: DeleteChPodcast,
          variables,
        })
        .then(async () => {
          this.$bus.showSuccessModal('Corona Helpdesk Podcast was successfully removed', 3000)
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

  private generateInput(): CreateChPodcastMutationVariables['input'] {
    const input: any = {
      title: this.form.title!,
      description: this.form.description!,
      rss_title: this.form.rss_title!,
      rss_description: this.form.rss_description!,
      category: this.form.category!,
    }

    if (this.form.audio.file) {
      input.duration = Math.floor(this.$refs.audio.duration)
    }

    // fill image
    if (this.form.image.isDirty) {
      input.image = {
        file: this.form.image.file,
        cropProps: this.form.image.cropProps!,
        sizeName: this.form.image.sizeName,
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
  margin-bottom: 1em;

  @media (min-width: 1350px) {
    align-items: flex-start;
    flex-direction: row;
  }
}

.podcast-image-wrapper {
  margin-right: auto;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  max-width: 615px;

  @media (min-width: 1350px) {
    margin-right: 25px;
    flex: 0 0 615px;
  }

  > .podcast-image {
    overflow: hidden;
    border-radius: 5px;
    background: $color-gray;
  }

  > .btn {
    position: absolute;
    bottom: -15px;
    right: -10px;
  }
}
</style>
