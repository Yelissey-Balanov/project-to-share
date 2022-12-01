<template>
  <div>
    <client-only>
      <SweetModal ref="modalAddToBucketForm" :title="'Add ' + itemTitle + ' to bucket'">
        <ValidationObserver tag="form" @submit.prevent="onSubmit()" ref="formValidationObserver" class="space-y-6">
          <div class="grid grid-cols-1 gap-4">
            <FSelectWritableBucket v-model="form.bucket" label="Bucket" error-label="bucket" :rules="'required'" />
          </div>
          <div class="grid grid-cols-1 gap-4">
            <FTextarea v-model="form.notes" label="Notes" />
          </div>

          <p class="text-gray-600">Amount of items to add: {{ itemIds.length }}</p>

          <div class="form-action-buttons mt-0 mb-0">
            <button type="submit" class="tbtn tbtn--blue">
              <template v-if="!isSubmitting"> Add to bucket </template>
              <template v-else> Adding to bucket... </template>
            </button>
          </div>
        </ValidationObserver>
      </SweetModal>
    </client-only>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import Vue from 'vue'
import { Maybe, AddToBucketMutationVariables, AddToBucketMutation } from '~/graphql/GQLTypes'
import { validateObserver } from '~/helpers/validationHelpers'
import { ValidationObserver } from 'vee-validate'
import AddToBucket from '@/graphql/ressources/buckets/AddToBucket.gql'
import { apolloParseErrors } from '~/helpers/apolloParseErrors'
import FSelectWritableBucket from '~/components/admin/FSelectWritableBucket.vue'
import { WritableBucket } from '~/store'
import { AddToBucketItemType } from '~/helpers/types'
import { State } from '~/node_modules/vuex-class'

@Component({
  components: { FSelectWritableBucket, ValidationObserver },
})
export default class AddToBucketModal extends Vue {
  $refs!: {
    modalAddToBucketForm: any
    formValidationObserver: InstanceType<typeof ValidationObserver>
  }

  itemTitle: string = ''
  itemType: Maybe<AddToBucketItemType> = null
  itemIds: number[] = []
  callbackAfterSuccess: () => void = () => {}

  form: {
    bucket: Maybe<WritableBucket>
    notes: Maybe<string>
  } = {
    bucket: null,
    notes: null,
  }

  isSubmitting = false

  @State((state) => state.bucket.lastSelectedBucket)
  lastSelectedBucket!: Maybe<WritableBucket>

  mounted() {
    this.$bus.$on(
      'openAddToBucketFormModal',
      (itemTitle: string, itemType: AddToBucketItemType, itemIds: number[], callbackAfterSuccess: () => void) => {
        this.itemTitle = itemTitle
        this.itemType = itemType
        this.itemIds = itemIds
        this.callbackAfterSuccess = callbackAfterSuccess

        this.form.bucket = this.lastSelectedBucket
        this.form.notes = null

        this.$refs.modalAddToBucketForm!.open()
      }
    )
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
      await this.addItemsToBucket()
      await this.$apollo.provider.defaultClient.clearStore()

      this.isSubmitting = false
      this.$refs.modalAddToBucketForm!.close()
      this.$bus.showSuccessModal('Items were successfully added to selected bucket', 2500)
      this.callbackAfterSuccess()
    } catch (err) {
      this.isSubmitting = false
      this.$bus.showErrorModal({
        errors: apolloParseErrors(err),
      })
    }
  }

  private async addItemsToBucket() {
    const variables: AddToBucketMutationVariables = {
      id: this.form.bucket!.id,
      input: {
        notes: this.form.notes,
      },
    }

    variables.input[this.itemType + '_ids'] = this.itemIds

    const { data } = await this.$apollo.mutate<AddToBucketMutation>({
      mutation: AddToBucket,
      variables,
    })
  }

  destroyed() {
    this.$bus.$off('openAddToBucketFormModal')
  }
}
</script>
