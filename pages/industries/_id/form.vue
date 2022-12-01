<template>
  <div class="container pt-5">
    <div class="flex w-full justify-start items-center mb-6 space-x-8">
      <nuxt-link :to="`/industries/${isCreating ? '' : $route.params.id}`" class="tbtn-icon tbtn--white">
        <IHChevronLeft class="w-6 h-6" />
      </nuxt-link>
      <h1>{{ isCreating ? 'Create' : 'Edit' }} Industry</h1>
    </div>

    <ValidationObserver tag="form" @submit.prevent="onSubmit()" ref="formValidationObserver">
      <div class="flex flex-col space-y-6 mb-8">
        <div class="card">
          <div class="card-header">
            <div>
              <h3>Industry information</h3>
            </div>
          </div>
          <div class="divide-y">
            <div class="space-y-6 p-6">
              <FInput v-model="form.title" label="Title" :rules="'required'" errorLabel="title" />
              <div class="grid grid-cols-2 gap-4">
                <FSelectIndustries
                  :isSingle="true"
                  v-model="form.synonym_representative"
                  label="Synonym of"
                  :disabled="!!form.parent"
                />
                <FSelectIndustries
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
                <FSelectIndustries class="w-full" :isSingle="true" v-model="formChild.autocompleteValue" />
                <button type="button" class="tbtn tbtn-icon tbtn-icon--small tbtn--red" @click="deleteChild(index)">
                  <IMinus class="w-5 h-5"></IMinus>
                </button>
              </div>
            </div>
            <div class="space-y-6 p-6" v-else> Child industries can be managed only on representative industry! </div>
          </div>
        </div>
      </div>

      <div class="form-action-buttons">
        <button class="tbtn tbtn--red mr-auto" v-if="!isCreating" type="button" @click="openModalDeleteIndustry">
          Delete
        </button>
        <nuxt-link :to="abortRoute" class="tbtn tbtn--white">Abort</nuxt-link>
        <button class="tbtn tbtn--blue">Save</button>
      </div>
    </ValidationObserver>

    <client-only>
      <SweetModal ref="modalDeleteIndustry" title="Deleting industry">
        <ValidationObserver
          tag="form"
          @submit.prevent="submitModalDeleteIndustry()"
          ref="deleteIndustryValidationObserver"
          class="space-y-6"
        >
          <FSelectIndustries :isSingle="true" v-model="form.transfer_linked_data_to" label="Transfer data to" />

          <p class="text-gray-600 pb-32">
            For deleting <b>{{ form.title }}</b> please choose industry above, to which all items linked to current
            industry should be moved.
          </p>

          <div class="form-action-buttons mt-0 mb-0">
            <button type="button" class="tbtn tbtn--gray" @click="$refs.modalDeleteIndustry.close()"> Cancel </button>
            <button type="submit" class="tbtn tbtn--red"> Delete and transfer </button>
          </div>
        </ValidationObserver>
      </SweetModal>
    </client-only>
  </div>
</template>

<script lang="ts">
import { Component, State, Vue } from 'nuxt-property-decorator'
import GetIndustryForEdit from '@/graphql/ressources/industries/GetIndustryForEdit.gql'
import DeleteIndustry from '@/graphql/ressources/industries/DeleteIndustry.gql'
import UpdateIndustry from '@/graphql/ressources/industries/UpdateIndustry.gql'
import CreateIndustry from '@/graphql/ressources/industries/CreateIndustry.gql'

import { apolloParseErrors } from '~/helpers/apolloParseErrors'
import {
  CreateIndustryMutation,
  CreateIndustryMutationVariables,
  DeleteIndustryMutationVariables,
  GetIndustryForEditQuery,
  Maybe,
  UpdateIndustryMutation,
  UpdateIndustryMutationVariables,
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
      industryId: Number.parseInt(route.params.id),
    }
    if (!data.isCreating) {
      const res = await app.apolloProvider!.defaultClient.query<GetIndustryForEditQuery>({
        query: GetIndustryForEdit,
        variables: {
          id: data.industryId,
        },
      })
      data.loadedData = res.data.industry
    }
    return data
  },
  head() {
    return {
      title: `${(this as IndustriesEdit).isCreating ? 'Create' : 'Edit'} industry`,
    }
  },
  middleware: 'auth',
  meta: {
    requiredRole: UserRole.Employee,
  },
})
export default class IndustriesEdit extends Vue {
  $refs!: {
    formValidationObserver: InstanceType<typeof ValidationObserver>
    deleteIndustryValidationObserver: InstanceType<typeof ValidationObserver>
    modalDeleteIndustry: any
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

  @State((state) => state.industry.overviewQueryParams)
  overviewQueryParams: any

  loadedData!: Maybe<GetIndustryForEditQuery['industry']>
  private industryId: number | null = null

  private incrementalIndex = 0
  private isSubmitting = false

  get abortRoute() {
    const baseRoute = '/industries'
    if (this.isCreating) {
      return {
        path: baseRoute,
        query: this.overviewQueryParams,
      }
    }
    return baseRoute + '/' + this.industryId
  }

  get isRepresentative() {
    return !this.form.synonym_representative
  }

  created() {
    // redirect to overview, if queried id was not found
    if (!this.isCreating && !this.loadedData) {
      this.$router.push('/industries')
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
      let createOrUpdateFn = this.isCreating ? this.createIndustry : this.updateIndustry
      // store industryId
      this.industryId = await createOrUpdateFn()
      // as we store industry in 2 steps, mark that industry was already created
      this.isCreating = false

      // everything went good, clear store and navigate back to list overview
      this.$bus.showSuccessModal('Industry was successfully ' + (this.isCreating ? 'created' : 'updated'), 3000)
      this.isSubmitting = false
      await this.$apollo.provider.defaultClient.clearStore()
      this.$router.push('/industries/' + this.industryId)
      // refresh industries in background
      this.$store.dispatch('industry/fetchIndustries')
    } catch (err) {
      this.isSubmitting = false
      console.error(err)
      this.$bus.showErrorModal({
        errors: apolloParseErrors(err),
      })
    }
  }

  async createIndustry(): Promise<number> {
    const variables: CreateIndustryMutationVariables = {
      input: this.generateInput() as CreateIndustryMutationVariables['input'],
    }

    variables.input.is_reviewed = true

    const { data } = await this.$apollo.mutate<CreateIndustryMutation>({
      mutation: CreateIndustry,
      variables,
    })

    return data!.createIndustry!.id
  }

  async updateIndustry(): Promise<number> {
    if (!this.industryId) {
      throw new Error("industryId is empty, can't call updateIndustry()")
    }
    const variables: UpdateIndustryMutationVariables = {
      id: this.industryId,
      input: this.generateInput(),
    }

    const { data } = await this.$apollo.mutate<UpdateIndustryMutation>({
      mutation: UpdateIndustry,
      variables,
    })

    return data!.updateIndustry!.id
  }

  private generateInput() {
    const input: UpdateIndustryMutationVariables['input'] | CreateIndustryMutationVariables['input'] = {
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

  openModalDeleteIndustry() {
    if (!this.industryId) {
      this.$bus.showErrorModal({
        errors: ['Deletion of industry is not possible, as industry id is not specified.'],
      })
      return
    }
    this.$refs.modalDeleteIndustry.open()
  }

  submitModalDeleteIndustry() {
    this.$refs.modalDeleteIndustry.close()
    const variables: DeleteIndustryMutationVariables = {
      id: this.industryId!,
      transferLinkedDataTo: this.form.transfer_linked_data_to ? this.form.transfer_linked_data_to.id : null,
    }
    this.$apollo
      .mutate({
        mutation: DeleteIndustry,
        variables,
      })
      .then(async () => {
        this.$bus.showSuccessModal('Industry was successfully removed', 3000)
        await this.$apollo.provider.defaultClient.clearStore()
        this.$router.push({ path: '/industries', query: this.overviewQueryParams })
        // refresh industries in background
        this.$store.dispatch('industry/fetchIndustries')
      })
      .catch((err) => {
        this.$bus.showErrorModal({
          errors: apolloParseErrors(err),
        })
      })
  }
}
</script>
