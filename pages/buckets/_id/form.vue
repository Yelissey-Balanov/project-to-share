<template>
  <div class="container pt-5">
    <div class="flex w-full justify-start items-center mb-6 space-x-8">
      <nuxt-link :to="`/buckets/${isCreating ? '' : $route.params.id}`" class="tbtn-icon tbtn--white">
        <IHChevronLeft class="w-6 h-6" />
      </nuxt-link>
      <h1>{{ isCreating ? 'Create' : 'Edit' }} Bucket</h1>
    </div>

    <ValidationObserver tag="form" @submit.prevent="onSubmit()" ref="formValidationObserver">
      <div class="mb-8 card">
        <div class="divide-y">
          <div class="space-y-6 p-6">
            <div class="grid grid-cols-1 gap-4">
              <FInput v-model="form.title" label="Title" :rules="'required'" errorLabel="title" />
            </div>
            <div class="grid grid-cols-1 gap-4">
              <FTextarea v-model="form.notes" label="Notes" />
            </div>
          </div>
          <div v-if="isOwner" class="space-y-6 p-6">
            <template>
              <div class="flex justify-between mb-4">
                <h3>Sharing</h3>
                <button type="button" class="tbtn tbtn-icon tbtn-icon--small tbtn--green" @click="addEmptySharing">
                  <IPlus class="w-5 h-5"></IPlus>
                </button>
              </div>
              <div
                class="flex space-x-4 items-center"
                v-for="(formUser, index) in form.shared_with"
                :key="formUser.itemIndex"
              >
                <FUserAutocomplete v-model="formUser.autocompleteValue" label="Consultant" class="w-full" />
                <FCheckbox v-model="formUser.is_write_allowed" label="Grant write permissions" class="w-full" />
                <button
                  type="button"
                  class="tbtn tbtn-icon tbtn-icon--small tbtn--red"
                  @click="form.shared_with.splice(index, 1)"
                >
                  <IMinus class="w-5 h-5"></IMinus>
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>

      <div class="form-action-buttons">
        <button class="tbtn tbtn--red mr-auto" v-if="!isCreating && isOwner" type="button" @click="deleteBucket">
          Delete
        </button>
        <nuxt-link to="." class="tbtn tbtn--white">Abort</nuxt-link>
        <button class="tbtn tbtn--blue">Save</button>
      </div>
    </ValidationObserver>

    <AddPersonSuggestionModal />
  </div>
</template>

<script lang="ts">
import GetBucketForEdit from '@/graphql/ressources/buckets/GetBucketForEdit.gql'
import CreateBucket from '@/graphql/ressources/buckets/CreateBucket.gql'
import UpdateBucket from '@/graphql/ressources/buckets/UpdateBucket.gql'
import DeleteBucket from '@/graphql/ressources/buckets/DeleteBucket.gql'

import { Component, Vue, State } from 'nuxt-property-decorator'
import FCountryDialCodeAutocomplete from '@/components/admin/FCountryDialCodeAutocomplete.vue'
import { apolloParseErrors } from '~/helpers/apolloParseErrors'
import {
  Maybe,
  UserRole,
  GetBucketForEditQuery,
  CreateBucketMutationVariables,
  CreateBucketMutation,
  UpdateBucketMutationVariables,
  UpdateBucketMutation,
  DeleteBucketMutationVariables,
  GetUsersForAutocompleteQuery,
  ProjectUserPivot,
} from '~/graphql/GQLTypes'
import { ValidationObserver } from 'vee-validate'
import { validateObserver } from '~/helpers/validationHelpers'
import AddPersonSuggestionModal from '~/components/admin/AddPersonSuggestionModal.vue'
import { CountryDialCode, IFormPhonenumber } from '~/helpers/phonenumberHelpers'
import FUserAutocomplete from '~/components/admin/FUserAutocomplete.vue'
import IHChevronLeft from '~/components/globals/icons/heroicons/IHChevronLeft.vue'

@Component({
  components: {
    IHChevronLeft,
    FUserAutocomplete,
    AddPersonSuggestionModal,
    ValidationObserver,
  },
  async asyncData({ app, route }) {
    const data: any = {
      isCreating: route.params.id === 'new',
      bucketId: Number.parseInt(route.params.id),
    }
    if (!data.isCreating) {
      try {
        const res = await app.apolloProvider!.defaultClient.query<GetBucketForEditQuery>({
          query: GetBucketForEdit,
          variables: {
            id: data.bucketId,
          },
        })
        data.loadedData = res.data.bucket
      } catch (e) {
        data.loadedData = null
      }
    }
    return data
  },
  head() {
    return {
      title: `${(this as BucketsEdit).isCreating ? 'Create' : 'Edit'} bucket`,
    }
  },
  middleware: 'auth',
  meta: {
    requiredRole: UserRole.Employee,
  },
})
export default class BucketsEdit extends Vue {
  $refs!: {
    profileImage: any
    formValidationObserver: InstanceType<typeof ValidationObserver>
    addDocumentsInput: HTMLInputElement
  }

  isCreating = false
  bucketOwnerId: number = 0

  form: {
    title: Maybe<string>
    notes: Maybe<string>
    shared_with: Array<{
      itemIndex: number
      autocompleteValue: Maybe<NonNullable<GetUsersForAutocompleteQuery['users']>['data'][0]>
      is_write_allowed: boolean
    }>
  } = {
    title: null,
    notes: null,
    shared_with: [],
  }

  loadedData!: Maybe<GetBucketForEditQuery['bucket']>
  private bucketId: Maybe<number> = null

  private isSubmitting = false
  private incrementalIndex = 0

  @State((state) => state.account.user)
  accountUser

  get isOwner() {
    return this.accountUser && this.bucketOwnerId === this.accountUser.id
  }

  created() {
    // redirect to overview, if queried id was not found
    if (!this.isCreating && !this.loadedData) {
      this.$router.push('/buckets')
      return
    }

    // fetch data, when editing
    if (!this.isCreating && this.loadedData) {
      this.form.title = this.loadedData.title
      this.form.notes = this.loadedData.notes!
      this.bucketOwnerId = this.loadedData.owner_id

      this.loadedData.shared_with.forEach((user) => {
        this.form.shared_with.push({
          itemIndex: this.incrementalIndex++,
          autocompleteValue: {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
          },
          is_write_allowed: user.bucket_user_permission!.is_write_allowed,
        })
      })
    }
  }

  addEmptySharing() {
    this.form.shared_with.unshift({
      itemIndex: this.incrementalIndex++,
      autocompleteValue: null,
      is_write_allowed: false,
    })
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
      // this.$store.commit('updateGenericModal', {
      //   text: 'Storing form values...',
      //   progress: 0,
      //   blocking: true
      // });
      // this.$bus.showGenericModal();

      // determine if we should run create or update mutation
      let createOrUpdateFn = this.isCreating ? this.createBucket : this.updateBucket
      // store bucketId
      const ids = await createOrUpdateFn()
      this.bucketId = ids.bucketId
      // as we store bucket in 2 steps, mark that bucket was already created
      this.isCreating = false

      // this.$store.commit('updateGenericModal', {
      //   text: 'Storing companies, languages and profile image...',
      //   progress: Math.round(100 / 4)
      // });

      // store additional relations (images and regions). This should be merged later into regular create/update mutations, when lighthouse supports it
      // await this.updateBucketAdditional();

      this.$bus.hideGenericModal()

      // everything went good, clear store and navigate back to list overview
      this.$bus.showSuccessModal('Bucket was successfully ' + (this.isCreating ? 'created' : 'updated'), 3000)
      this.isSubmitting = false
      await this.$apollo.provider.defaultClient.clearStore()
      this.$router.push('/buckets/' + this.bucketId)
    } catch (err) {
      this.isSubmitting = false
      console.error(err)
      this.$bus.hideGenericModal()
      this.$bus.showErrorModal({
        errors: apolloParseErrors(err),
      })
    }
  }

  async createBucket(): Promise<{ bucketId: number }> {
    const variables: CreateBucketMutationVariables = {
      input: {
        ...(this.generateInputVariable() as CreateBucketMutationVariables['input']),
        owner_id: this.accountUser!.id,
      },
    }

    const { data } = await this.$apollo.mutate<CreateBucketMutation>({
      mutation: CreateBucket,
      variables,
    })

    return {
      bucketId: data!.createBucket!.id,
    }
  }

  async updateBucket(): Promise<{ bucketId: number }> {
    if (!this.bucketId) {
      throw new Error("bucketId is empty, can't call updateConsultant()")
    }
    const variables: UpdateBucketMutationVariables = {
      id: this.bucketId,
      input: this.generateInputVariable(),
    }

    const { data } = await this.$apollo.mutate<UpdateBucketMutation>({
      mutation: UpdateBucket,
      variables,
    })

    return {
      bucketId: data!.updateBucket!.id,
    }
  }

  private generateInputVariable() {
    const input: CreateBucketMutationVariables['input'] | UpdateBucketMutationVariables['input'] = {
      title: this.form.title!,
      notes: this.form.notes,
    }

    if (this.isOwner) {
      input.shared_with = {
        sync: [],
      }

      // fill users
      this.form.shared_with.forEach((formUser) => {
        // if no consultant was selected in autocomplete, ignore
        if (!formUser.autocompleteValue) {
          return
        }
        input.shared_with!.sync!.push({
          user_id: formUser.autocompleteValue.id!,
          is_write_allowed: formUser.is_write_allowed,
        })
      })
    }

    return input
  }

  deleteBucket() {
    if (!this.bucketId) {
      this.$bus.showErrorModal({
        errors: ['Deletion of bucket is not possible, as bucket id is not specified.'],
      })
      return
    }
    this.$bus.showDeleteConfirmModal('Are you sure you want to delete this bucket?', () => {
      const variables: DeleteBucketMutationVariables = {
        id: this.bucketId!,
      }
      this.$apollo
        .mutate({
          mutation: DeleteBucket,
          variables,
        })
        .then(async () => {
          this.$bus.showSuccessModal('Bucket was successfully removed', 3000)
          await this.$apollo.provider.defaultClient.clearStore()
          this.$router.push('/buckets')
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
