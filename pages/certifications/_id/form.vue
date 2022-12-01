<template>
  <div class="container pt-5">
    <div class="flex w-full justify-start items-center mb-6 space-x-8">
      <nuxt-link :to="`/certifications/${isCreating ? '' : $route.params.id}`" class="tbtn-icon tbtn--white">
        <IHChevronLeft class="w-6 h-6" />
      </nuxt-link>
      <h1>{{ isCreating ? 'Create' : 'Edit' }} Certification</h1>
    </div>

    <ValidationObserver tag="form" @submit.prevent="onSubmit()" ref="formValidationObserver">
      <div class="flex flex-col space-y-6 mb-8">
        <div class="card">
          <div class="card-header">
            <div>
              <h3>Certification information</h3>
            </div>
          </div>
          <div class="divide-y">
            <div class="space-y-6 p-6">
              <FInput v-model="form.title" label="Title" :rules="'required'" errorLabel="title" />
              <div class="grid grid-cols-2 gap-4">
                <FSelectCertifications
                  :isSingle="true"
                  v-model="form.synonym_representative"
                  label="Synonym of"
                  :disabled="!!form.parent"
                />
                <FSelectCertifications
                  :isSingle="true"
                  v-model="form.parent"
                  label="Parent"
                  :disabled="!isRepresentative"
                />
              </div>
              <div class="text-xs">
                NOTE: You are able to fill either synonym or parent, but not both at the same time!
              </div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-header flex justify-between">
            <h3>Children</h3>
            <button
              v-if="isRepresentative"
              type="button"
              class="tbtn tbtn-icon tbtn-icon--small tbtn--green"
              @click="addEmptyChild"
            >
              <IPlus class="w-5 h-5"></IPlus>
            </button>
          </div>
          <div class="divide-y">
            <div class="space-y-6 p-6" v-if="isRepresentative">
              <div class="flex space-x-4" v-for="(formChild, index) in form.children" :key="formChild.itemIndex">
                <FSelectCertifications class="w-full" :isSingle="true" v-model="formChild.autocompleteValue" />
                <button type="button" class="tbtn tbtn-icon tbtn-icon--small tbtn--red" @click="deleteChild(index)">
                  <IMinus class="w-5 h-5"></IMinus>
                </button>
              </div>
            </div>
            <div class="space-y-6 p-6" v-else>
              Child certifications can be managed only on representative certification!
            </div>
          </div>
        </div>
      </div>

      <div class="form-action-buttons">
        <button class="tbtn tbtn--red mr-auto" v-if="!isCreating" type="button" @click="openModalDeleteCertification">
          Delete
        </button>
        <nuxt-link :to="abortRoute" class="tbtn tbtn--white">Abort</nuxt-link>
        <button class="tbtn tbtn--blue">Save</button>
      </div>
    </ValidationObserver>

    <client-only>
      <SweetModal ref="modalDeleteCertification" title="Deleting certification">
        <ValidationObserver
          tag="form"
          @submit.prevent="submitModalDeleteCertification()"
          ref="deleteCertificationValidationObserver"
          class="space-y-6"
        >
          <FSelectCertifications :isSingle="true" v-model="form.transfer_linked_data_to" label="Transfer data to" />

          <p class="text-gray-600 pb-32">
            For deleting <b>{{ form.title }}</b> please choose certification above, to which all items linked to current
            certification should be moved.
          </p>

          <div class="form-action-buttons mt-0 mb-0">
            <button type="button" class="tbtn tbtn--gray" @click="$refs.modalDeleteCertification.close()">
              Cancel
            </button>
            <button type="submit" class="tbtn tbtn--red"> Delete and transfer </button>
          </div>
        </ValidationObserver>
      </SweetModal>
    </client-only>
  </div>
</template>

<script lang="ts">
import { Component, State, Vue } from 'nuxt-property-decorator'
import GetCertificationForEdit from '@/graphql/ressources/certifications/GetCertificationForEdit.gql'
import DeleteCertification from '@/graphql/ressources/certifications/DeleteCertification.gql'
import UpdateCertification from '@/graphql/ressources/certifications/UpdateCertification.gql'
import CreateCertification from '@/graphql/ressources/certifications/CreateCertification.gql'

import { apolloParseErrors } from '~/helpers/apolloParseErrors'
import {
  CreateCertificationMutation,
  CreateCertificationMutationVariables,
  DeleteCertificationMutationVariables,
  GetCertificationForEditQuery,
  Maybe,
  UpdateCertificationMutation,
  UpdateCertificationMutationVariables,
  UserRole,
} from '~/graphql/GQLTypes'
import { ValidationObserver } from 'vee-validate'
import { validateObserver } from '~/helpers/validationHelpers'
import { IdWithTitle } from '~/helpers/types'
import IHChevronLeft from '~/components/globals/icons/heroicons/IHChevronLeft.vue'

@Component({
  components: { IHChevronLeft, ValidationObserver },
  async asyncData({ app, route }) {
    const data: any = {
      isCreating: route.params.id === 'new',
      certificationId: Number.parseInt(route.params.id),
    }
    if (!data.isCreating) {
      const res = await app.apolloProvider!.defaultClient.query<GetCertificationForEditQuery>({
        query: GetCertificationForEdit,
        variables: {
          id: data.certificationId,
        },
      })
      data.loadedData = res.data.certification
    }
    return data
  },
  head() {
    return {
      title: `${(this as CertificationsEdit).isCreating ? 'Create' : 'Edit'} certification`,
    }
  },
  middleware: 'auth',
  meta: {
    requiredRole: UserRole.Employee,
  },
})
export default class CertificationsEdit extends Vue {
  $refs!: {
    formValidationObserver: InstanceType<typeof ValidationObserver>
    deleteCertificationValidationObserver: InstanceType<typeof ValidationObserver>
    modalDeleteCertification: any
  }

  isCreating = false

  form: {
    title: Maybe<string>
    synonym_representative: Maybe<IdWithTitle>
    parent: Maybe<IdWithTitle>
    transfer_linked_data_to: Maybe<IdWithTitle>
    children: Array<{
      itemIndex: number
      autocompleteValue: Maybe<IdWithTitle>
    }>
  } = {
    title: null,
    synonym_representative: null,
    parent: null,
    transfer_linked_data_to: null,
    children: [],
  }

  @State((state) => state.certification.overviewQueryParams)
  overviewQueryParams: any

  loadedData!: Maybe<GetCertificationForEditQuery['certification']>
  private certificationId: number | null = null

  private incrementalIndex = 0
  private isSubmitting = false

  get abortRoute() {
    const baseRoute = '/certifications'
    if (this.isCreating) {
      return {
        path: baseRoute,
        query: this.overviewQueryParams,
      }
    }
    return baseRoute + '/' + this.certificationId
  }

  get isRepresentative() {
    return !this.form.synonym_representative
  }

  created() {
    // redirect to overview, if queried id was not found
    if (!this.isCreating && !this.loadedData) {
      this.$router.push('/certifications')
      return
    }

    // fetch data, when editing
    if (!this.isCreating && this.loadedData) {
      this.form.title = this.loadedData.title!
      this.form.synonym_representative = this.loadedData.synonym_representative!
      this.form.parent = this.loadedData.parent_id ? this.loadedData.parent! : null

      this.loadedData.children.forEach((child) => {
        this.form.children.push({
          itemIndex: this.incrementalIndex++,
          autocompleteValue: child,
        })
      })
    }
  }

  addEmptyChild() {
    this.form.children.unshift({
      itemIndex: this.incrementalIndex++,
      autocompleteValue: null,
    })
  }

  deleteChild(index: number) {
    this.form.children.splice(index, 1)
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
      // determine if we should run create or update mutation
      let createOrUpdateFn = this.isCreating ? this.createCertification : this.updateCertification
      // store certificationId
      this.certificationId = await createOrUpdateFn()
      // as we store certification in 2 steps, mark that certification was already created
      this.isCreating = false

      // everything went good, clear store and navigate back to list overview
      this.$bus.showSuccessModal('Certification was successfully ' + (this.isCreating ? 'created' : 'updated'), 3000)
      this.isSubmitting = false
      await this.$apollo.provider.defaultClient.clearStore()
      this.$router.push('/certifications/' + this.certificationId)
      // refresh certifications in background
      this.$store.dispatch('certification/fetchCertifications')
    } catch (err) {
      this.isSubmitting = false
      console.error(err)
      this.$bus.showErrorModal({
        errors: apolloParseErrors(err),
      })
    }
  }

  async createCertification(): Promise<number> {
    const variables: CreateCertificationMutationVariables = {
      input: this.generateInput() as CreateCertificationMutationVariables['input'],
    }

    variables.input.is_reviewed = true

    const { data } = await this.$apollo.mutate<CreateCertificationMutation>({
      mutation: CreateCertification,
      variables,
    })

    return data!.createCertification!.id
  }

  async updateCertification(): Promise<number> {
    if (!this.certificationId) {
      throw new Error("certificationId is empty, can't call updateCertification()")
    }
    const variables: UpdateCertificationMutationVariables = {
      id: this.certificationId,
      input: this.generateInput(),
    }

    const { data } = await this.$apollo.mutate<UpdateCertificationMutation>({
      mutation: UpdateCertification,
      variables,
    })

    return data!.updateCertification!.id
  }

  private generateInput() {
    const input: UpdateCertificationMutationVariables['input'] | CreateCertificationMutationVariables['input'] = {
      title: this.form.title!,
      synonym_representative_id: this.form.synonym_representative ? this.form.synonym_representative.id : null,
      parent_id: this.form.parent ? this.form.parent.id : null,
      children_ids: [],
    }

    if (this.isRepresentative) {
      this.form.children.forEach((child) => {
        if (!child.autocompleteValue) {
          return
        }
        input.children_ids!.push(child.autocompleteValue.id)
      })
    }

    return input
  }

  openModalDeleteCertification() {
    if (!this.certificationId) {
      this.$bus.showErrorModal({
        errors: ['Deletion of certification is not possible, as certification id is not specified.'],
      })
      return
    }
    this.$refs.modalDeleteCertification.open()
  }

  submitModalDeleteCertification() {
    this.$refs.modalDeleteCertification.close()
    const variables: DeleteCertificationMutationVariables = {
      id: this.certificationId!,
      transferLinkedDataTo: this.form.transfer_linked_data_to ? this.form.transfer_linked_data_to.id : null,
    }
    this.$apollo
      .mutate({
        mutation: DeleteCertification,
        variables,
      })
      .then(async () => {
        this.$bus.showSuccessModal('Certification was successfully removed', 3000)
        await this.$apollo.provider.defaultClient.clearStore()
        this.$router.push({ path: '/certifications', query: this.overviewQueryParams })
        // refresh certifications in background
        this.$store.dispatch('certification/fetchCertifications')
      })
      .catch((err) => {
        this.$bus.showErrorModal({
          errors: apolloParseErrors(err),
        })
      })
  }
}
</script>
