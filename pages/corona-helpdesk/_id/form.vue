<template>
  <div class="container pt-5">
    <h1>{{ isCreating ? 'Create' : 'Edit' }} Corona Helpdesk Topic</h1>

    <ValidationObserver tag="form" @submit.prevent="onSubmit()" ref="formValidationObserver">
      <div class="grid grid-cols-1 gap-4">
        <FInput v-model="form.title" label="Topic title" rules="required" />
      </div>
      <div class="grid grid-cols-1 gap-4">
        <FTextarea :rows="3" v-model="form.short_text" label="Hashtags" rules="required" />
      </div>
      <div class="grid grid-cols-1 gap-4">
        <FTextarea v-model="form.long_text" label="Description" rules="required" />
      </div>

      <br />
      <div class="flex w-full justify-between items-center space-x-8 flex-wrap md:flex-nowrap">
        <h2> Candidates </h2>
        <div class="flex items-center space-x-2">
          <button type="button" class="btn btn-icon green-outline" @click="addEmptyCandidate">
            <IPlus class="icon"></IPlus>
          </button>
        </div>
      </div>
      <div
        class="box-of-grouped-fields mb-8"
        v-for="(formCandidate, index) of form.candidates"
        :key="formCandidate.itemIndex"
      >
        <div class="grid grid-cols-1 gap-4">
          <FCandidateAutocomplete
            v-model="formCandidate.autocompleteValue"
            label="Candidate"
            @input="loadContactDataForCandidate(formCandidate)"
          />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <FInput v-model="formCandidate.phonenumber" label="Phonenumber" rules="required" />
          <FInput v-model="formCandidate.email" label="Email" rules="required" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <FSelectSimple v-model="formCandidate.work_time" label="Arbeitszeit" :options="workTimeOptions" />
          <FSelectSimple v-model="formCandidate.work_place" label="Arbeitsort" :options="workPlaceOptions" />
        </div>
        <div class="grid grid-cols-1 gap-4">
          <FTextarea :rows="6" v-model="formCandidate.text" label="About candidate" />
        </div>

        <div class="box-action-buttons">
          <button class="btn btn-icon red-outline" type="button" @click="form.candidates.splice(index, 1)">
            <IMinus class="icon"></IMinus>
          </button>
        </div>
      </div>

      <div class="form-action-buttons">
        <button class="btn red-outline btn-delete" v-if="!isCreating" type="button" @click="deleteChCategory">
          Delete
        </button>
        <nuxt-link to="." class="btn gray-outline">Abort</nuxt-link>
        <button class="tbtn tbtn--blue">Save</button>
      </div>
    </ValidationObserver>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'

import GetChCategoryForEdit from '@/graphql/ressources/chCategories/GetChCategoryForEdit.gql'
import DeleteChCategory from '@/graphql/ressources/chCategories/DeleteChCategory.gql'
import CreateChCategory from '@/graphql/ressources/chCategories/CreateChCategory.gql'
import UpdateChCategory from '@/graphql/ressources/chCategories/UpdateChCategory.gql'
import GetCandidateContactData from '@/graphql/ressources/candidates/GetCandidateContactData.gql'

import { apolloParseErrors } from '~/helpers/apolloParseErrors'
import {
  CreateChCategoryMutation,
  CreateChCategoryMutationVariables,
  DeleteChCategoryMutationVariables,
  Maybe,
  UpdateChCategoryMutation,
  UpdateChCategoryMutationVariables,
  UserRole,
  GetChCategoryForEditQuery,
  GetCandidateContactDataQueryVariables,
  GetCandidateContactDataQuery,
  WorkTime,
  WorkPlace,
  StellaPlugin,
} from '~/graphql/GQLTypes'
import { ValidationObserver } from 'vee-validate'
import { validateObserver } from '~/helpers/validationHelpers'
import FCandidateAutocomplete from '~/components/admin/FCandidateAutocomplete.vue'
import { CandidateAutocompleteValue } from '~/helpers/types'
import { workPlaceOptions, workTimeOptions } from '~/helpers/simpleSelectorOptions'

interface ChCandidateFormElement {
  itemIndex: number
  autocompleteValue: Maybe<CandidateAutocompleteValue>
  text: Maybe<string>
  phonenumber: Maybe<string>
  email: Maybe<string>
  work_time: Maybe<WorkTime>
  work_place: Maybe<WorkPlace>
}

@Component({
  components: { FCandidateAutocomplete, ValidationObserver },
  async asyncData({ app, route }) {
    const data: any = {
      isCreating: route.params.id === 'new',
      chCategoryId: Number.parseInt(route.params.id),
    }
    if (!data.isCreating) {
      const res = await app.apolloProvider!.defaultClient.query<GetChCategoryForEditQuery>({
        query: GetChCategoryForEdit,
        variables: {
          id: data.chCategoryId,
        },
      })
      data.loadedData = res.data.chCategory
    }
    return data
  },
  head() {
    return {
      title: `${(this as ChCategoriesEdit).isCreating ? 'Create' : 'Edit'} Corona Helpdesk Topic`,
    }
  },
  middleware: ['auth', 'stellaPlugin'],
  meta: {
    requiredRole: UserRole.CoronaHelpdeskManager,
    plugin: StellaPlugin.CoronaHelpdesk,
  },
})
export default class ChCategoriesEdit extends Vue {
  $refs!: {
    formValidationObserver: InstanceType<typeof ValidationObserver>
  }
  isCreating = false

  workTimeOptions = workTimeOptions
  workPlaceOptions = workPlaceOptions

  form: {
    title: Maybe<string>
    short_text: Maybe<string>
    long_text: Maybe<string>
    candidates: ChCandidateFormElement[]
  } = {
    title: null,
    short_text: null,
    long_text: null,
    candidates: [],
  }

  loadedData!: Maybe<GetChCategoryForEditQuery['chCategory']>
  private chCategoryId: number | null = null

  private incrementalIndex = 0
  private isSubmitting = false

  created() {
    // redirect to overview, if queried id was not found
    if (!this.isCreating && !this.loadedData) {
      this.$router.push('/chCategories')
      return
    }

    // fetch data, when editing
    if (!this.isCreating && this.loadedData) {
      this.form.title = this.loadedData.title!
      this.form.short_text = this.loadedData.short_text!
      this.form.long_text = this.loadedData.long_text

      this.loadedData.candidates.forEach((candidate) => {
        this.form.candidates.push({
          itemIndex: this.incrementalIndex++,
          text: candidate.candidate_ch_category_pivot!.text!,
          phonenumber: candidate.candidate_ch_category_pivot!.phonenumber!,
          email: candidate.candidate_ch_category_pivot!.email!,
          work_place: candidate.candidate_ch_category_pivot!.work_place!,
          work_time: candidate.candidate_ch_category_pivot!.work_time!,
          autocompleteValue: {
            id: candidate.id,
            person: candidate.person,
          },
        })
      })
    }
  }

  addEmptyCandidate() {
    this.form.candidates.push({
      itemIndex: this.incrementalIndex++,
      autocompleteValue: null,
      text: null,
      phonenumber: null,
      email: null,
      work_place: null,
      work_time: null,
    })
  }

  loadContactDataForCandidate(formCandidate: ChCandidateFormElement) {
    if (!formCandidate.autocompleteValue) {
      return
    }
    this.$apollo
      .query<GetCandidateContactDataQuery>({
        query: GetCandidateContactData,
        variables: {
          id: formCandidate.autocompleteValue.id,
        } as GetCandidateContactDataQueryVariables,
      })
      .then(({ data }) => {
        formCandidate.email = data.candidate!.email!
        if (data.candidate!.phonenumbers.length > 0) {
          formCandidate.phonenumber =
            data.candidate!.phonenumbers[0].dial_code + ' ' + data.candidate!.phonenumbers[0].number
        } else {
          formCandidate.phonenumber = null
        }
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
      // determine if we should run create or update mutation
      // let createOrUpdateFn = this.isCreating ? this.createChCategory : this.updateChCategory;
      let createOrUpdateFn = this.isCreating ? this.createChCategory : this.updateChCategory
      // store chCategoryId
      this.chCategoryId = await createOrUpdateFn()

      // everything went good, clear store and navigate back to list overview
      this.$bus.showSuccessModal(
        'Corona Helpdesk Topic was successfully ' + (this.isCreating ? 'created' : 'updated'),
        3000
      )
      this.isSubmitting = false
      await this.$apollo.provider.defaultClient.clearStore()
      this.$router.push('/corona-helpdesk/' + this.chCategoryId)
    } catch (err) {
      this.isSubmitting = false
      console.error(err)
      this.$bus.showErrorModal({
        errors: apolloParseErrors(err),
      })
    }
  }

  async createChCategory(): Promise<number> {
    const variables: CreateChCategoryMutationVariables = {
      input: this.generateInput(),
    }

    const { data } = await this.$apollo.mutate<CreateChCategoryMutation>({
      mutation: CreateChCategory,
      variables,
    })

    return data!.createChCategory!.id
  }

  async updateChCategory(): Promise<number> {
    if (!this.chCategoryId) {
      throw new Error("chCategoryId is empty, can't call updateConsultant()")
    }
    const variables: UpdateChCategoryMutationVariables = {
      id: this.chCategoryId,
      input: this.generateInput(),
    }

    const { data } = await this.$apollo.mutate<UpdateChCategoryMutation>({
      mutation: UpdateChCategory,
      variables,
    })

    return data!.updateChCategory!.id
  }

  deleteChCategory() {
    if (!this.chCategoryId) {
      this.$bus.showErrorModal({
        errors: ['Deletion of topic is not possible, as topic id is not specified.'],
      })
      return
    }
    this.$bus.showDeleteConfirmModal('Are you sure you want to delete this topic?', () => {
      const variables: DeleteChCategoryMutationVariables = {
        id: this.chCategoryId!,
      }
      this.$apollo
        .mutate({
          mutation: DeleteChCategory,
          variables,
        })
        .then(async () => {
          this.$bus.showSuccessModal('Corona Helpdesk Topic was successfully removed', 3000)
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

  private generateInput(): CreateChCategoryMutationVariables['input'] {
    return {
      title: this.form.title!,
      short_text: this.form.short_text!,
      long_text: this.form.long_text!,
      candidates: {
        sync: this.form.candidates
          .filter((candidate) => candidate.autocompleteValue !== null)
          .map((candidate) => {
            return {
              id: candidate.autocompleteValue!.id,
              text: candidate.text,
              phonenumber: candidate.phonenumber,
              email: candidate.email,
              work_place: candidate.work_place,
              work_time: candidate.work_time,
            }
          }),
      },
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../../assets/scss/variables';
</style>
