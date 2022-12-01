<template>
  <div class="container pt-5">
    <div class="flex w-full justify-start items-center mb-6 space-x-8">
      <nuxt-link :to="`/institutions/${isCreating ? '' : $route.params.id}`" class="tbtn-icon tbtn--white">
        <IHChevronLeft class="w-6 h-6" />
      </nuxt-link>
      <h1>{{ isCreating ? 'Create' : 'Edit' }} Institution</h1>
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
              <FInput v-model="form.name" label="Title" :rules="'required'" errorLabel="title" />
            </div>
          </div>
        </div>
      </div>

      <div class="form-action-buttons">
        <button class="tbtn tbtn--red mr-auto" v-if="!isCreating" type="button" @click="openModalDeleteInstitution">
          Delete
        </button>
        <nuxt-link :to="abortRoute" class="tbtn tbtn--white">Abort</nuxt-link>
        <button class="tbtn tbtn--blue">Save</button>
      </div>
    </ValidationObserver>

    <client-only>
      <SweetModal ref="modalDeleteInstitution" title="Deleting institution">
        <ValidationObserver
          tag="form"
          @submit.prevent="submitModalDeleteInstitution()"
          ref="deleteInstitutionValidationObserver"
          class="space-y-6"
        >
          <FSelectInstitutions :isSingle="true" v-model="form.transfer_linked_data_to" label="Transfer data to" />

          <p class="text-gray-600 pb-32">
            For deleting <b>{{ form.name }}</b> please choose institution above, to which all items linked to current
            institution should be moved.
          </p>

          <div class="form-action-buttons mt-0 mb-0">
            <button type="button" class="tbtn tbtn--gray" @click="$refs.modalDeleteInstitution.close()">
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

import GetInstitutionForEdit from '@/graphql/ressources/institutions/GetInstitutionForEdit.gql'
import DeleteInstitution from '@/graphql/ressources/institutions/DeleteInstitution.gql'
import UpdateInstitution from '@/graphql/ressources/institutions/UpdateInstitution.gql'
import CreateInstitution from '@/graphql/ressources/institutions/CreateInstitution.gql'

import { apolloParseErrors } from '~/helpers/apolloParseErrors'
import {
  CreateInstitutionMutation,
  CreateInstitutionMutationVariables,
  DeleteInstitutionMutationVariables,
  GetInstitutionForEditQuery,
  Maybe,
  UpdateInstitutionMutation,
  UpdateInstitutionMutationVariables,
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
      institutionId: Number.parseInt(route.params.id),
    }
    if (!data.isCreating) {
      const res = await app.apolloProvider!.defaultClient.query<GetInstitutionForEditQuery>({
        query: GetInstitutionForEdit,
        variables: {
          id: data.institutionId,
        },
      })
      data.loadedData = res.data.institution
    }
    return data
  },
  head() {
    return {
      title: `${(this as InstitutionsEdit).isCreating ? 'Create' : 'Edit'} institution`,
    }
  },
  middleware: 'auth',
  meta: {
    requiredRole: UserRole.Employee,
  },
})
export default class InstitutionsEdit extends Vue {
  $refs!: {
    formValidationObserver: InstanceType<typeof ValidationObserver>
    deleteIndustryValidationObserver: InstanceType<typeof ValidationObserver>
    modalDeleteInstitution: any
  }

  isCreating = false

  form: {
    name: Maybe<string>
    transfer_linked_data_to: Maybe<IdWithTitle>
  } = {
    name: null,
    transfer_linked_data_to: null,
  }

  @State((state) => state.institution.overviewQueryParams)
  overviewQueryParams: any

  loadedData!: Maybe<GetInstitutionForEditQuery['institution']>
  private institutionId: number | null = null

  private isSubmitting = false

  get abortRoute() {
    const baseRoute = '/institutions'
    if (this.isCreating) {
      return {
        path: baseRoute,
        query: this.overviewQueryParams,
      }
    }
    return baseRoute + '/' + this.institutionId
  }

  created() {
    // redirect to overview, if queried id was not found
    if (!this.isCreating && !this.loadedData) {
      this.$router.push('/institutions')
      return
    }

    // fetch data, when editing
    if (!this.isCreating && this.loadedData) {
      this.form.name = this.loadedData.name!
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
      // determine if we should run create or update mutation
      let createOrUpdateFn = this.isCreating ? this.createInstitution : this.updateInstitution
      // store institutionId
      this.institutionId = await createOrUpdateFn()
      // as we store institution in 2 steps, mark that institution was already created
      this.isCreating = false

      // everything went good, clear store and navigate back to list overview
      this.$bus.showSuccessModal('Institution was successfully ' + (this.isCreating ? 'created' : 'updated'), 3000)
      this.isSubmitting = false
      await this.$apollo.provider.defaultClient.clearStore()
      this.$router.push('/institutions/' + this.institutionId)
      // refresh institutions in background
      this.$store.dispatch('institution/fetchInstitutions')
    } catch (err) {
      this.isSubmitting = false
      console.error(err)
      this.$bus.showErrorModal({
        errors: apolloParseErrors(err),
      })
    }
  }

  async createInstitution(): Promise<number> {
    const variables: CreateInstitutionMutationVariables = {
      input: this.generateInput() as CreateInstitutionMutationVariables['input'],
    }

    variables.input.is_reviewed = true

    const { data } = await this.$apollo.mutate<CreateInstitutionMutation>({
      mutation: CreateInstitution,
      variables,
    })

    return data!.createInstitution!.id
  }

  async updateInstitution(): Promise<number> {
    if (!this.institutionId) {
      throw new Error("institutionId is empty, can't call updateInstitution()")
    }
    const variables: UpdateInstitutionMutationVariables = {
      id: this.institutionId,
      input: this.generateInput(),
    }

    const { data } = await this.$apollo.mutate<UpdateInstitutionMutation>({
      mutation: UpdateInstitution,
      variables,
    })

    return data!.updateInstitution!.id
  }

  private generateInput() {
    const input: UpdateInstitutionMutationVariables['input'] | CreateInstitutionMutationVariables['input'] = {
      name: this.form.name!,
    }

    return input
  }

  openModalDeleteInstitution() {
    if (!this.institutionId) {
      this.$bus.showErrorModal({
        errors: ['Deletion of institution is not possible, as institution id is not specified.'],
      })
      return
    }
    this.$refs.modalDeleteInstitution.open()
  }

  submitModalDeleteInstitution() {
    this.$refs.modalDeleteInstitution.close()
    const variables: DeleteInstitutionMutationVariables = {
      id: this.institutionId!,
      transferLinkedDataTo: this.form.transfer_linked_data_to ? this.form.transfer_linked_data_to.id : null,
    }
    this.$apollo
      .mutate({
        mutation: DeleteInstitution,
        variables,
      })
      .then(async () => {
        this.$bus.showSuccessModal('Institution was successfully removed', 3000)
        await this.$apollo.provider.defaultClient.clearStore()
        this.$router.push({ path: '/institutions', query: this.overviewQueryParams })
        // refresh institutions in background
        this.$store.dispatch('institution/fetchInstitutions')
      })
      .catch((err) => {
        this.$bus.showErrorModal({
          errors: apolloParseErrors(err),
        })
      })
  }
}
</script>
