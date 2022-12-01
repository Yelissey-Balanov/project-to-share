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
        placeholder=""
        :options="clientOptions"
        openDirection="bottom"
        track-by="id"
        :custom-label="customLabelForMultiselect"
        :loading="isLoading"
        @open="handleOpen"
        @close="handleClose"
        tag-placeholder="Add new client"
        :taggable="!isLoading"
        @tag="addClient"
        :disabled="disabled"
        tagPosition="bottom"
        :id="id"
      >
        <template slot="noResult" slot-scope="props"> No clients found that satisfy search query </template>
      </multiselect>
      <div class="input-error" v-if="!valid && touched">{{ errors[0] }}</div>
    </div>
  </ValidationProvider>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import Vue from 'vue'
import {
  CreateClientMutation,
  CreateClientMutationVariables,
  GetClientsForAutocompleteQuery,
  GetClientsForAutocompleteQueryVariables,
  Maybe,
  SortOrder,
} from '@/graphql/GQLTypes'
import GetClientsForAutocomplete from '@/graphql/components/GetClientsForAutocomplete.gql'
import CreateClient from '@/graphql/ressources/clients/CreateClient.gql'
import { ValidationProvider } from 'vee-validate'
import generateFormFieldId from '~/helpers/generateFormFieldId'

@Component({
  components: { ValidationProvider },
})
export default class FClientAutocomplete extends Vue {
  $refs!: {
    validationProvider: InstanceType<typeof ValidationProvider>
  }

  @Prop()
  rules?: any
  @Prop()
  errorLabel?: string
  @Prop({ default: false })
  disabled?: boolean
  @Prop()
  companyId?: Maybe<number>
  @Prop()
  value?: NonNullable<GetClientsForAutocompleteQuery['clientsInCompany']>[0]
  @Prop()
  label?: string
  @Prop({ default: false })
  allowCreating?: boolean

  clientOptions: NonNullable<GetClientsForAutocompleteQuery['clientsInCompany']> = []

  selectedOption: Maybe<NonNullable<GetClientsForAutocompleteQuery['clientsInCompany']>[0]> = null
  isLoading = false
  isOpened = false
  id = ''

  get errorLabelComputed() {
    return this.errorLabel || this.label
  }

  mounted() {
    this.id = generateFormFieldId(this.label)
    this.reloadClientsAndUpdateValue(this.companyId!, true)
  }

  customLabelForMultiselect(client: NonNullable<GetClientsForAutocompleteQuery['clientsInCompany']>[0]) {
    return (
      (client.person.title ? `${client.person.title} ` : '') + `${client.person.firstname} ${client.person.lastname}`
    )
  }

  private sentValueToOutside!: Maybe<NonNullable<GetClientsForAutocompleteQuery['clientsInCompany']>[0]>

  @Watch('companyId')
  async onCompanyIdChanges(companyId: Maybe<number>) {
    this.reloadClientsAndUpdateValue(companyId)
  }

  private async reloadClientsAndUpdateValue(companyId, ignoreValidate = false) {
    const initialValue: Maybe<NonNullable<GetClientsForAutocompleteQuery['clientsInCompany']>[0]> = this.value
      ? this.value
      : null
    this.handleInput(null)
    if (companyId === null) {
      return
    }
    await this.getClientsFromDB()
    // search initial value in new dropdown list
    if (initialValue) {
      for (let i = 0; i < this.clientOptions.length; i++) {
        if (initialValue.id === this.clientOptions[i].id) {
          this.handleInput(this.clientOptions[i])
          break
        }
      }
    }
  }

  // @Watch('value', { immediate: true })
  // onValueChanges(val: NonNullable<GetClientsForAutocompleteQuery['clientsInCompany']>[0]) {
  //   if (val !== this.sentValueToOutside) {
  //     if (val) {
  //       this.clientOptions = [val];
  //       this.selectedOption = this.clientOptions[0];
  //     } else {
  //       this.clientOptions = [];
  //       this.selectedOption = null;
  //     }
  //     this.sentValueToOutside = val;
  //   }
  // }

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

  addClient(value) {
    const splittedValue = value.split(' ')
    const guessedFirstname = splittedValue.shift()
    const guessedLastname = splittedValue.join(' ')
    const variables: CreateClientMutationVariables = {
      input: {
        company_id: this.companyId,
        need_review_after_autocomplete: true,
        person: {
          upsert: {
            firstname: guessedFirstname,
            lastname: guessedLastname,
          },
        },
      },
    }
    this.isLoading = true
    this.$apollo
      .mutate<CreateClientMutation>({
        mutation: CreateClient,
        variables,
      })
      .then(({ data }) => {
        this.isLoading = false
        this.clientOptions.unshift(data!.createClient!)

        this.handleInput(this.clientOptions[0])
      })
      .catch((err) => {
        console.error(err)
        this.isLoading = false
      })
  }

  private async getClientsFromDB() {
    // if (!query) {
    //   return;
    // }
    this.isLoading = true
    const variables: GetClientsForAutocompleteQueryVariables = {
      companyId: this.companyId!,
    }
    try {
      const { data } = await this.$apollo.query<GetClientsForAutocompleteQuery>({
        query: GetClientsForAutocomplete,
        variables,
      })
      this.isLoading = false
      this.clientOptions = data.clientsInCompany!
    } catch (err) {
      console.error(err)
      this.isLoading = false
    }
  }
}
</script>
