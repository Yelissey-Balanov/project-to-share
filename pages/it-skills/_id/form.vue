<template>
  <div class="container pt-5">
    <div class="flex w-full justify-start items-center mb-6 space-x-8">
      <nuxt-link :to="`/it-skills/${isCreating ? '' : $route.params.id}`" class="tbtn-icon tbtn--white">
        <IHChevronLeft class="w-6 h-6" />
      </nuxt-link>
      <h1>{{ isCreating ? 'Create' : 'Edit' }} IT Skill</h1>
    </div>

    <ValidationObserver tag="form" @submit.prevent="onSubmit()" ref="formValidationObserver">
      <div class="flex flex-col space-y-6 mb-8">
        <div class="card">
          <div class="card-header">
            <div>
              <h3>IT skill information</h3>
            </div>
          </div>
          <div class="divide-y">
            <div class="space-y-6 p-6">
              <FInput v-model="form.title" label="Title" :rules="'required'" errorLabel="title" />
              <div class="grid grid-cols-2 gap-4">
                <FSelectItSkills
                  :isSingle="true"
                  v-model="form.synonym_representative"
                  label="Synonym of"
                  :disabled="!!form.parent"
                />
                <FSelectItSkills :isSingle="true" v-model="form.parent" label="Parent" :disabled="!isRepresentative" />
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
                <FSelectItSkills class="w-full" :isSingle="true" v-model="formChild.autocompleteValue" />
                <button type="button" class="tbtn tbtn-icon tbtn-icon--small tbtn--red" @click="deleteChild(index)">
                  <IMinus class="w-5 h-5"></IMinus>
                </button>
              </div>
            </div>
            <div class="space-y-6 p-6" v-else> Child IT skills can be managed only on representative IT skill! </div>
          </div>
        </div>
      </div>

      <div class="form-action-buttons">
        <button class="tbtn tbtn--red mr-auto" v-if="!isCreating" type="button" @click="openModalDeleteItSkill">
          Delete
        </button>
        <nuxt-link :to="abortRoute" class="tbtn tbtn--white">Abort</nuxt-link>
        <button class="tbtn tbtn--blue">Save</button>
      </div>
    </ValidationObserver>

    <client-only>
      <SweetModal ref="modalDeleteItSkill" title="Deleting IT skill">
        <ValidationObserver
          tag="form"
          @submit.prevent="submitModalDeleteItSkill()"
          ref="deleteItSkillValidationObserver"
          class="space-y-6"
        >
          <FSelectItSkills :isSingle="true" v-model="form.transfer_linked_data_to" label="Transfer data to" />

          <p class="text-gray-600 pb-32">
            For deleting <b>{{ form.title }}</b> please choose IT skill above, to which all items linked to current IT
            skill should be moved.
          </p>

          <div class="form-action-buttons mt-0 mb-0">
            <button type="button" class="tbtn tbtn--gray" @click="$refs.modalDeleteItSkill.close()"> Cancel </button>
            <button type="submit" class="tbtn tbtn--red"> Delete and transfer </button>
          </div>
        </ValidationObserver>
      </SweetModal>
    </client-only>
  </div>
</template>

<script lang="ts">
import { Component, State, Vue } from 'nuxt-property-decorator'

import GetItSkillForEdit from '@/graphql/ressources/itSkills/GetItSkillForEdit.gql'
import DeleteItSkill from '@/graphql/ressources/itSkills/DeleteItSkill.gql'
import UpdateItSkill from '@/graphql/ressources/itSkills/UpdateItSkill.gql'
import CreateItSkill from '@/graphql/ressources/itSkills/CreateItSkill.gql'

import { apolloParseErrors } from '~/helpers/apolloParseErrors'
import {
  CreateItSkillMutation,
  CreateItSkillMutationVariables,
  DeleteItSkillMutationVariables,
  GetItSkillForEditQuery,
  Maybe,
  UpdateItSkillMutation,
  UpdateItSkillMutationVariables,
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
      itSkillId: Number.parseInt(route.params.id),
    }
    if (!data.isCreating) {
      const res = await app.apolloProvider!.defaultClient.query<GetItSkillForEditQuery>({
        query: GetItSkillForEdit,
        variables: {
          id: data.itSkillId,
        },
      })
      data.loadedData = res.data.itSkill
    }
    return data
  },
  head() {
    return {
      title: `${(this as ItSkillsEdit).isCreating ? 'Create' : 'Edit'} IT skill`,
    }
  },
  middleware: 'auth',
  meta: {
    requiredRole: UserRole.Employee,
  },
})
export default class ItSkillsEdit extends Vue {
  $refs!: {
    formValidationObserver: InstanceType<typeof ValidationObserver>
    deleteItSkillValidationObserver: InstanceType<typeof ValidationObserver>
    modalDeleteItSkill: any
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

  @State((state) => state.itSkill.overviewQueryParams)
  overviewQueryParams: any

  loadedData!: Maybe<GetItSkillForEditQuery['itSkill']>
  private itSkillId: number | null = null

  private incrementalIndex = 0
  private isSubmitting = false

  get abortRoute() {
    const baseRoute = '/it-skills'
    if (this.isCreating) {
      return {
        path: baseRoute,
        query: this.overviewQueryParams,
      }
    }
    return baseRoute + '/' + this.itSkillId
  }

  get isRepresentative() {
    return !this.form.synonym_representative
  }

  created() {
    // redirect to overview, if queried id was not found
    if (!this.isCreating && !this.loadedData) {
      this.$router.push('/it-skills')
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
      let createOrUpdateFn = this.isCreating ? this.createItSkill : this.updateItSkill
      // store itSkillId
      this.itSkillId = await createOrUpdateFn()
      // as we store itSkill in 2 steps, mark that itSkill was already created
      this.isCreating = false

      // everything went good, clear store and navigate back to list overview
      this.$bus.showSuccessModal('IT Skill was successfully ' + (this.isCreating ? 'created' : 'updated'), 3000)
      this.isSubmitting = false
      await this.$apollo.provider.defaultClient.clearStore()
      this.$router.push('/it-skills/' + this.itSkillId)
      // refresh IT skills in background
      this.$store.dispatch('itSkill/fetchItSkills')
    } catch (err) {
      this.isSubmitting = false
      console.error(err)
      this.$bus.showErrorModal({
        errors: apolloParseErrors(err),
      })
    }
  }

  async createItSkill(): Promise<number> {
    const variables: CreateItSkillMutationVariables = {
      input: this.generateInput() as CreateItSkillMutationVariables['input'],
    }

    variables.input.is_reviewed = true

    const { data } = await this.$apollo.mutate<CreateItSkillMutation>({
      mutation: CreateItSkill,
      variables,
    })

    return data!.createItSkill!.id
  }

  async updateItSkill(): Promise<number> {
    if (!this.itSkillId) {
      throw new Error("itSkillId is empty, can't call updateItSkill()")
    }
    const variables: UpdateItSkillMutationVariables = {
      id: this.itSkillId,
      input: this.generateInput(),
    }

    const { data } = await this.$apollo.mutate<UpdateItSkillMutation>({
      mutation: UpdateItSkill,
      variables,
    })

    return data!.updateItSkill!.id
  }

  private generateInput() {
    const input: UpdateItSkillMutationVariables['input'] | CreateItSkillMutationVariables['input'] = {
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

  openModalDeleteItSkill() {
    if (!this.itSkillId) {
      this.$bus.showErrorModal({
        errors: ['Deletion of itSkill is not possible, as itSkill id is not specified.'],
      })
      return
    }
    this.$refs.modalDeleteItSkill.open()
  }

  submitModalDeleteItSkill() {
    this.$refs.modalDeleteItSkill.close()
    const variables: DeleteItSkillMutationVariables = {
      id: this.itSkillId!,
      transferLinkedDataTo: this.form.transfer_linked_data_to ? this.form.transfer_linked_data_to.id : null,
    }
    this.$apollo
      .mutate({
        mutation: DeleteItSkill,
        variables,
      })
      .then(async () => {
        this.$bus.showSuccessModal('ItSkill was successfully removed', 3000)
        await this.$apollo.provider.defaultClient.clearStore()
        this.$router.push({ path: '/it-skills', query: this.overviewQueryParams })
        // refresh IT skills in background
        this.$store.dispatch('itSkill/fetchItSkills')
      })
      .catch((err) => {
        this.$bus.showErrorModal({
          errors: apolloParseErrors(err),
        })
      })
  }
}
</script>
