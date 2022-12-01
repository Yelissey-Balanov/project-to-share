<template>
  <ValidationProvider
    :rules="rules"
    :name="errorLabelComputed"
    :vid="id"
    v-slot="{ errors, classes, valid, touched }"
    tag="div"
    ref="validationProvider"
    slim
  >
    <div class="f-specified-multiselect is-single" :class="classes">
      <label v-if="!!label" :class="{ 'is-floating': value || isOpened }">{{ label }}</label>
      <multiselect
        :value="selectedOption"
        @input="handleInput"
        @search-change="handleSearchChange"
        placeholder=""
        :options="companyOptions"
        openDirection="bottom"
        track-by="id"
        :custom-label="customLabelForMultiselect"
        :loading="isLoading"
        @open="handleOpen"
        @close="handleClose"
        :internalSearch="false"
        tag-placeholder="Add new company"
        :taggable="allowCreating && currentSearchQuery === fetchedResultForSearchQuery"
        @tag="addCompany"
        tagPosition="bottom"
        :id="id"
      >
        <template slot="noResult" slot-scope="props"> No companies found that satisfy search query </template>
      </multiselect>
      <div class="input-error" v-if="!valid && touched">{{ errors[0] }}</div>
    </div>
  </ValidationProvider>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import Vue from 'vue'
import { debounce } from 'lodash'
import {
  CreateCompanyMutation,
  CreateCompanyMutationVariables,
  GetClientsForAutocompleteQuery,
  GetCompaniesForAutocompleteQuery,
  GetCompaniesForAutocompleteQueryVariables,
  Maybe,
  SortOrder,
} from '@/graphql/GQLTypes'
import GetCompaniesForAutocomplete from '@/graphql/components/GetCompaniesForAutocomplete.gql'
import CreateCompany from '@/graphql/ressources/companies/CreateCompany.gql'
import { ValidationProvider } from 'vee-validate'
import generateFormFieldId from '~/helpers/generateFormFieldId'

@Component({
  components: { ValidationProvider },
})
export default class FConsultancyAutocomplete extends Vue {
  $refs!: {
    validationProvider: InstanceType<typeof ValidationProvider>
  }

  @Prop()
  rules?: any
  @Prop()
  errorLabel?: string
  @Prop()
  value?: NonNullable<GetCompaniesForAutocompleteQuery['companies']>['data'][0]
  @Prop()
  label?: string
  @Prop({ default: false })
  allowCreating?: boolean

  companyOptions: NonNullable<GetCompaniesForAutocompleteQuery['companies']>['data'] = []

  selectedOption: Maybe<NonNullable<GetCompaniesForAutocompleteQuery['companies']>['data'][0]> = null
  isLoading = false
  isOpened = false

  currentSearchQuery = ''
  fetchedResultForSearchQuery = ''
  id = ''

  get errorLabelComputed() {
    return this.errorLabel || this.label
  }

  mounted() {
    this.id = generateFormFieldId(this.label)
  }

  customLabelForMultiselect(company: NonNullable<GetCompaniesForAutocompleteQuery['companies']>['data'][0]) {
    return `${company.name} ${company.legal_form ? company.legal_form : ''}`
  }

  handleSearchChange(searchQuery) {
    this.currentSearchQuery = searchQuery
    this.getCompaniesFromDBDebounced(searchQuery)
  }

  getCompaniesFromDBDebounced = debounce((searchQuery) => {
    this.getCompaniesFromDB(searchQuery)
  }, 200)

  private sentValueToOutside!: Maybe<NonNullable<GetCompaniesForAutocompleteQuery['companies']>['data'][0]>

  @Watch('value', { immediate: true })
  onValueChanges(val: NonNullable<GetCompaniesForAutocompleteQuery['companies']>['data'][0]) {
    if (val !== this.sentValueToOutside) {
      if (val) {
        this.companyOptions = [val]
        this.selectedOption = this.companyOptions[0]
      } else {
        this.companyOptions = []
        this.selectedOption = null
      }
      this.sentValueToOutside = val
    }
  }

  handleInput(e) {
    this.selectedOption = e
    this.sentValueToOutside = this.selectedOption ? this.selectedOption : null
    this.$emit('input', this.sentValueToOutside)
  }

  handleOpen() {
    this.isOpened = true
  }

  handleClose() {
    this.isOpened = false
    if (!this.$refs.validationProvider.flags.validated) {
      this.$refs.validationProvider.validate(this.sentValueToOutside)
    }
    this.$refs.validationProvider.setFlags({
      touched: true,
      untouched: false,
    })
  }

  addCompany(value) {
    if (!this.allowCreating) {
      return
    }
    const variables: CreateCompanyMutationVariables = {
      input: {
        name: value,
        need_review_after_autocomplete: true,
      },
    }
    this.isLoading = true
    this.$apollo
      .mutate<CreateCompanyMutation>({
        mutation: CreateCompany,
        variables,
      })
      .then(({ data }) => {
        this.isLoading = false
        this.companyOptions = [
          {
            id: data!.createCompany!.id,
            name: data!.createCompany!.name,
          },
        ]

        this.handleInput(this.companyOptions[0])
      })
      .catch((err) => {
        console.error(err)
        this.isLoading = false
      })
  }

  private getCompaniesFromDB(query: string) {
    if (!query) {
      return
    }
    this.isLoading = true
    const variables: GetCompaniesForAutocompleteQueryVariables = {
      name: `%${query}%`,
      orderBy: [
        {
          order: SortOrder.Asc,
          column: 'name',
        },
      ],
    }
    this.isLoading = true
    this.$apollo
      .query<GetCompaniesForAutocompleteQuery>({
        query: GetCompaniesForAutocomplete,
        variables,
      })
      .then(({ data }) => {
        this.isLoading = false
        this.fetchedResultForSearchQuery = query
        this.companyOptions = data.companies!.data
      })
      .catch((err) => {
        console.error(err)
        this.isLoading = false
      })
  }
}
</script>
