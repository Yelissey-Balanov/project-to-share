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
    <div class="f-specified-multiselect is-single" :class="{ 'is-disabled': disabled, ...classes }">
      <label v-if="!!label" :class="{ 'is-floating': value || isOpened }">{{ label }}</label>
      <multiselect
        :value="selectedOption"
        @input="handleInput"
        @search-change="handleSearchChange"
        placeholder=""
        :options="candidateOptions"
        openDirection="bottom"
        track-by="id"
        :loading="isLoading"
        @open="handleOpen"
        @close="handleClose"
        :internalSearch="false"
        :taggable="false"
        :disabled="disabled"
        :id="id"
        :option-height="104"
        :show-labels="false"
      >
        <template slot="noResult" slot-scope="props"> No candidates found that satisfy search query </template>
        <template slot="singleLabel" slot-scope="props">
          {{
            (props.option.person.title ? `${props.option.person.title} ` : '') +
            `${props.option.person.firstname} ${props.option.person.lastname}`
          }}
        </template>
        <template slot="option" slot-scope="props">
          <div class="flex items-center">
            <span class="mr-2 small-foto">
              <img
                v-if="props.option.person.foto"
                :src="publicUrl + props.option.person.foto.sizes.PROFILE_IMAGE.retina"
              />
            </span>
            <span class="option__desc">{{
              (props.option.person.title ? `${props.option.person.title} ` : '') +
              `${props.option.person.firstname} ${props.option.person.lastname}`
            }}</span>
          </div>
        </template>
      </multiselect>
      <div class="input-error" v-if="!valid && touched">{{ errors[0] }}</div>
    </div>
  </ValidationProvider>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import Vue from 'vue'
import {
  GetCandidatesForAutocompleteQuery,
  GetCandidatesForAutocompleteQueryVariables,
  Maybe,
} from '@/graphql/GQLTypes'
import GetCandidatesForAutocomplete from '@/graphql/components/GetCandidatesForAutocomplete.gql'
import { ValidationProvider } from 'vee-validate'
import generateFormFieldId from '~/helpers/generateFormFieldId'
import { debounce } from 'lodash'
import { CandidateAutocompleteValue } from '~/helpers/types'

@Component({
  components: { ValidationProvider },
})
export default class FCandidateAutocomplete extends Vue {
  $refs!: {
    validationProvider: InstanceType<typeof ValidationProvider>
  }
  publicUrl = this.$config.publicUrl

  @Prop()
  rules?: any
  @Prop()
  errorLabel?: string
  @Prop({ default: false })
  disabled?: boolean
  @Prop()
  value?: CandidateAutocompleteValue
  @Prop()
  label?: string

  candidateOptions: CandidateAutocompleteValue[] = []

  selectedOption: Maybe<CandidateAutocompleteValue> = null
  isLoading = false
  isOpened = false
  id = ''

  get errorLabelComputed() {
    return this.errorLabel || this.label
  }

  mounted() {
    this.id = generateFormFieldId(this.label)
  }

  private sentValueToOutside!: Maybe<CandidateAutocompleteValue>

  @Watch('value', { immediate: true })
  onValueChanges(val: CandidateAutocompleteValue) {
    if (val !== this.sentValueToOutside) {
      if (val) {
        this.candidateOptions = [val]
        this.selectedOption = this.candidateOptions[0]
      } else {
        this.candidateOptions = []
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

  handleSearchChange(searchQuery) {
    if (!searchQuery) {
      return
    }
    this.getCandidatesFromDBDebounced(searchQuery)
  }

  getCandidatesFromDBDebounced = debounce((searchQuery) => {
    this.getCandidatesFromDB(searchQuery)
  }, 300)

  private getCandidatesFromDB(searchQuery) {
    this.isLoading = true
    const variables: GetCandidatesForAutocompleteQueryVariables = {
      anyName: searchQuery,
    }

    this.$apollo
      .query<GetCandidatesForAutocompleteQuery>({
        query: GetCandidatesForAutocomplete,
        variables,
      })
      .then(({ data }) => {
        this.isLoading = false
        this.candidateOptions = data.candidates!.data
      })
      .catch((err) => {
        console.error(err)
        this.isLoading = false
      })
  }
}
</script>
