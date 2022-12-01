<template>
  <div class="container pt-5">
    <div class="flex w-full justify-start items-center mb-6 space-x-8">
      <nuxt-link :to="`/clients/${isCreating ? '' : $route.params.id}`" class="tbtn-icon tbtn--white">
        <IHChevronLeft class="w-6 h-6" />
      </nuxt-link>
      <h1>{{ isCreating ? 'Create' : 'Edit' }} Client</h1>
    </div>

    <ValidationObserver tag="form" @submit.prevent="onSubmit()" ref="formValidationObserver">
      <div class="grid gap-6 mb-8 grid-cols-1 xl:grid-cols-11">
        <div class="xl:col-span-6 flex flex-col space-y-6">
          <div class="card">
            <div class="card-header">
              <div>
                <h3>Client information</h3>
              </div>
            </div>
            <div class="divide-y">
              <div class="space-y-6 p-6">
                <FCheckbox v-if="isEmployee" v-model="form.is_research" label="Research client" />
                <FInput v-model="form.title" label="Title" />
                <FInput
                  v-model="form.firstname"
                  label="Firstname"
                  :rules="'required'"
                  errorLabel="firstname"
                  @input="onNamesChanged"
                />
                <FInput
                  v-model="form.lastname"
                  label="Lastname"
                  :rules="'required'"
                  errorLabel="lastname"
                  @input="onNamesChanged"
                />
                <FInput v-model="form.other_firstnames" label="Other firstnames" />
                <FInput v-model="form.birth_name" label="Birth name" />
                <FDatePicker v-model="form.birthdate" label="Birthdate" />
                <FSelectSimple v-model="form.gender" label="Gender" :options="genderOptions" />
                <FTextarea v-if="isEmployee" v-model="form.notes" label="Notes (visible for Employees only)" />
              </div>
            </div>
          </div>
        </div>

        <div class="xl:col-span-5 flex flex-col space-y-6">
          <div class="card">
            <div class="divide-y">
              <div class="space-y-6 p-6">
                <div class="flex justify-center">
                  <CropperInModal class="relative" v-model="form.person_foto" v-slot="{ openModal }">
                    <img
                      class="!flex-none w-48 h-48 border-slate-400 border overflow-hidden rounded-full bg-slate-200"
                      :src="form.person_foto.croppedImage"
                    />
                    <button
                      type="button"
                      class="absolute p-1 rounded-full"
                      :class="
                        form.person_foto.croppedImage
                          ? 'bottom-2.5 right-2.5 bg-slate-200 border border-slate-400'
                          : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                      "
                      @click="openModal()"
                    >
                      <IPencil />
                    </button>
                  </CropperInModal>
                </div>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-header">
              <div>
                <h3>Contact information</h3>
              </div>
            </div>
            <div class="divide-y">
              <div class="space-y-6 p-6">
                <FInput v-model="form.email" label="Email" :rules="'email'" errorLabel="email" />
                <FInput v-model="form.zoom_id" label="Zoom ID" />
              </div>
              <div class="space-y-6 p-6">
                <div class="flex justify-between mb-4">
                  <h3>Phonenumbers</h3>
                  <button
                    type="button"
                    class="tbtn tbtn-icon tbtn-icon--small tbtn--green"
                    @click="addEmptyPhonenumber"
                  >
                    <IPlus class="w-5 h-5"></IPlus>
                  </button>
                </div>
                <div
                  class="flex space-x-4"
                  v-for="(formPhonenumber, index) in form.phonenumbers"
                  :key="formPhonenumber.itemIndex"
                >
                  <FCountryDialCodeAutocomplete
                    v-model="formPhonenumber.countryDialCode"
                    label="Country code"
                    class="w-full max-w-[128px]"
                    :rules="'required'"
                    errorLabel="country code"
                  />
                  <FInput v-model="formPhonenumber.number" label="Number" class="w-full" />
                  <FInput v-model="formPhonenumber.label" class="w-full" label="Label (e.g. main office)" />
                  <button
                    type="button"
                    class="tbtn tbtn-icon tbtn-icon--small tbtn--red"
                    @click="deletePhonenumber(formPhonenumber, index)"
                  >
                    <IMinus class="w-5 h-5"></IMinus>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <div>
                <h3>Company</h3>
              </div>
            </div>
            <div class="divide-y">
              <div class="space-y-6 p-6">
                <FInput v-model="form.position" label="Position" />
                <FCompanyAutocomplete v-model="form.company.autocompleteValue" label="Company" :allowCreating="true" />
                <FMultiselect
                  v-model="form.location"
                  label="Location"
                  :isSingle="true"
                  :options="companyLocationOptions"
                  :isTaggable="false"
                  :isLoading="isLoadingCompanyLocations"
                >
                  <template slot="noOptions">
                    <template v-if="!form.company.autocompleteValue">
                      Select company to load company locations.
                    </template>
                    <template v-else> Company has no locations stored. </template>
                  </template>
                </FMultiselect>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="form-action-buttons">
        <button class="tbtn tbtn--red mr-auto" v-if="!isCreating && isEmployee" type="button" @click="deleteClient"
          >Delete</button
        >
        <nuxt-link to="." class="tbtn tbtn--white">Abort</nuxt-link>
        <button class="tbtn tbtn--blue">Save</button>
      </div>
    </ValidationObserver>

    <AddPersonSuggestionModal />
  </div>
</template>

<script lang="ts">
import { Action, Component, Mutation, namespace, State, Vue, Watch } from 'nuxt-property-decorator'

import GetClient from '@/graphql/ressources/clients/GetClient.gql'
import CreateClient from '@/graphql/ressources/clients/CreateClient.gql'
import DeleteClient from '@/graphql/ressources/clients/DeleteClient.gql'
import UpdateClient from '@/graphql/ressources/clients/UpdateClient.gql'
import GetCompanyLocations from '@/graphql/ressources/companies/GetCompanyLocations.gql'

import FCountryDialCodeAutocomplete from '@/components/admin/FCountryDialCodeAutocomplete.vue'
import { countryDialCodeByCode, generatePhonenumberInput, IFormPhonenumber } from '~/helpers/phonenumberHelpers'
import { apolloParseErrors } from '~/helpers/apolloParseErrors'
import {
  CreateClientMutation,
  CreateClientMutationVariables,
  GetClientQuery,
  Maybe,
  UpdateClientMutation,
  UpdateClientMutationVariables,
  UserRole,
  Gender,
  DeleteClientMutationVariables,
  GetPeopleByNameQuery,
  GetCompanyLocationsQuery,
  GetCompanyLocationsQueryVariables,
} from '~/graphql/GQLTypes'
import { debounce } from 'lodash'
import { ValidationObserver } from 'vee-validate'
import { validateObserver } from '~/helpers/validationHelpers'
import FCompanyAutocomplete from '~/components/admin/FCompanyAutocomplete.vue'
import AddPersonSuggestionModal from '~/components/admin/AddPersonSuggestionModal.vue'
import { CropperInModalData, IdWithTitle } from '~/helpers/types'
import { parseDateFromISO, toISODate } from '~/helpers/dateHelpers'
import CropperInModal from '~/components/form/CropperInModal.vue'
import IHChevronLeft from '~/components/globals/icons/heroicons/IHChevronLeft.vue'

@Component({
  components: {
    IHChevronLeft,
    CropperInModal,
    AddPersonSuggestionModal,
    FCompanyAutocomplete,
    FCountryDialCodeAutocomplete,
    ValidationObserver,
  },
  async asyncData({ app, route }) {
    const data: any = {
      isCreating: route.params.id === 'new',
      clientId: Number.parseInt(route.params.id),
    }
    if (!data.isCreating) {
      try {
        const res = await app.apolloProvider!.defaultClient.query<GetClientQuery>({
          query: GetClient,
          variables: {
            id: data.clientId,
          },
        })
        data.loadedData = res.data.client
      } catch (e) {
        data.loadedData = null
      }
    }
    return data
  },
  head() {
    return {
      title: `${(this as ClientsEdit).isCreating ? 'Create' : 'Edit'} client`,
    }
  },
  middleware: 'auth',
  meta: {
    requiredRole: UserRole.Employee,
    allowAlsoFor: {
      userPath: 'client.id',
      routePath: 'params.id',
    },
  },
})
export default class ClientsEdit extends Vue {
  $refs!: {
    formValidationObserver: InstanceType<typeof ValidationObserver>
  }

  isCreating = false

  form: {
    title: Maybe<string>
    firstname: Maybe<string>
    other_firstnames: Maybe<string>
    lastname: Maybe<string>
    birth_name: Maybe<string>
    gender: Maybe<Gender>
    zoom_id: Maybe<string>
    email: Maybe<string>
    birthdate: Maybe<Date>
    position: Maybe<string>
    location: Maybe<IdWithTitle>
    phonenumbers: IFormPhonenumber[]
    company: {
      autocompleteValue: Maybe<NonNullable<GetClientQuery['client']>['company']>
    }
    person_foto: CropperInModalData
    notes: Maybe<string>
    is_research: boolean
  } = {
    title: null,
    firstname: null,
    other_firstnames: null,
    lastname: null,
    birth_name: null,
    gender: null,
    zoom_id: null,
    email: null,
    birthdate: null,
    position: null,
    location: null,
    phonenumbers: [],
    company: {
      autocompleteValue: null,
    },
    person_foto: {
      sizeName: 'PROFILE_IMAGE',
      file: null,
      fullImage: null,
      croppedImage: null,
      cropProps: null,
      isDirty: false,
    },
    notes: null,
    is_research: false,
  }

  genderOptions = {}
  companyLocationOptions: IdWithTitle[] = []
  isLoadingCompanyLocations = false

  loadedData!: Maybe<GetClientQuery['client']>
  private incrementalIndex = 0
  private clientId: Maybe<number> = null
  private personId: Maybe<number> = null

  // temporary array of IDs for simplified sending data to server
  private deletedPhonenumberIds: number[] = []

  private isSubmitting = false

  @Action('person/getPeopleByName')
  private getPeopleByName
  private ignorePersonSuggestion = false
  @State((state) => state.person.prefilledForCreation.person)
  prefilledPerson?: GetPeopleByNameQuery['people'][0]
  @Mutation('person/clearPrefilledPerson')
  private clearPrefilledPerson

  @Watch('form.company.autocompleteValue')
  onCompanyChange(company) {
    this.form.location = null
    if (!company) {
      // clear locations
      this.companyLocationOptions = []
      return
    }

    // fetch company locations
    this.isLoadingCompanyLocations = true
    this.$apollo
      .query<GetCompanyLocationsQuery>({
        query: GetCompanyLocations,
        variables: {
          id: company.id,
        } as GetCompanyLocationsQueryVariables,
      })
      .then(({ data }) => {
        this.isLoadingCompanyLocations = false
        this.companyLocationOptions = []

        data.company!.locations.forEach((location) => {
          const option = {
            id: location.id,
            title: (!location.label ? '' : `${location.label}: `) + location.full_address,
          }
          this.companyLocationOptions.push(option)

          if (this.loadedData && this.loadedData.location && option.id === this.loadedData!.location.id) {
            this.form.location = option
          }
        })

        if (this.companyLocationOptions.length === 1 && !this.form.location) {
          this.form.location = this.companyLocationOptions[0]
        }
      })
      .catch((err) => {
        console.error(err)
        this.companyLocationOptions = []
      })
  }

  @(namespace('account').Getter('isEmployee'))
  isEmployee!: boolean

  created() {
    // redirect to overview, if queried id was not found
    if (!this.isCreating && !this.loadedData) {
      this.$router.push('/clients')
      return
    }

    // init gender options
    Object.keys(Gender).forEach((genderItem) => {
      this.genderOptions[genderItem] = genderItem
    })

    // fetch data, when editing
    if (!this.isCreating && this.loadedData) {
      this.personId = this.loadedData.person.id

      this.form.title = this.loadedData.person.title!
      this.form.firstname = this.loadedData.person.firstname
      this.form.other_firstnames = this.loadedData.person.other_firstnames!
      this.form.lastname = this.loadedData.person.lastname!
      this.form.birth_name = this.loadedData.person.birth_name!
      this.form.email = this.loadedData.email!
      this.form.gender = this.loadedData.person.gender!
      this.form.zoom_id = this.loadedData.zoom_id!
      this.form.birthdate = parseDateFromISO(this.loadedData.person.birthdate)
      this.form.position = this.loadedData.position!
      this.form.notes = this.loadedData.notes!
      this.form.is_research = this.loadedData.is_research

      this.loadedData.phonenumbers.forEach((phonenumber) => {
        this.form.phonenumbers.push({
          itemIndex: this.incrementalIndex++,
          id: phonenumber.id,
          countryDialCode: countryDialCodeByCode[phonenumber.country_code],
          number: phonenumber.number,
          label: phonenumber.label!,
        })
      })

      if (this.loadedData.company) {
        this.form.company.autocompleteValue = this.loadedData.company
      }

      if (this.loadedData.person.foto) {
        this.form.person_foto.croppedImage =
          this.$config.publicUrl + this.loadedData.person.foto.sizes.PROFILE_IMAGE!.retina
        this.form.person_foto.fullImage = this.$config.publicUrl + this.loadedData.person.foto.original_image
        this.form.person_foto.cropProps = this.loadedData.person.foto.sizes.PROFILE_IMAGE!.cropProps!
      }
    }

    if (this.isCreating) {
      this.fillFormWithPersonFromStore()
    }
  }

  mounted() {
    this.$bus.$on('ignorePersonSuggestion', () => {
      this.ignorePersonSuggestion = true
    })
    this.$bus.$on('selectSuggestedPerson', () => {
      this.fillFormWithPersonFromStore()
    })
  }

  onNamesChanged = debounce(() => {
    this.suggestExistingPerson()
  }, 400)

  addEmptyPhonenumber() {
    this.form.phonenumbers.unshift({
      itemIndex: this.incrementalIndex++,
      countryDialCode: null,
      number: '',
      label: null,
    })
  }

  deletePhonenumber(formPhonenumber: IFormPhonenumber, index: number) {
    this.form.phonenumbers.splice(index, 1)
    if (formPhonenumber.id) {
      this.deletedPhonenumberIds.push(formPhonenumber.id)
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
      this.$store.commit('updateGenericModal', {
        text: 'Storing form values...',
        progress: 0,
        blocking: true,
      })
      this.$bus.showGenericModal()
      // determine if we should run create or update mutation
      let createOrUpdateFn = this.isCreating ? this.createClient : this.updateClient
      // store clientId
      const ids = await createOrUpdateFn()
      this.clientId = ids.clientId
      this.personId = ids.personId
      // as we store client in 2 steps, mark that client was already created
      this.isCreating = false
      // store additional relations (images and regions). This should be merged later into regular create/update mutations, when lighthouse supports it
      this.$bus.hideGenericModal()

      // everything went good, clear store and navigate back to list overview
      this.$bus.showSuccessModal('Client was successfully ' + (this.isCreating ? 'created' : 'updated'), 3000)
      this.isSubmitting = false
      await this.$apollo.provider.defaultClient.clearStore()
      this.$router.push('/clients/' + this.clientId)
    } catch (err) {
      this.isSubmitting = false
      console.error(err)
      this.$bus.hideGenericModal()
      this.$bus.showErrorModal({
        errors: apolloParseErrors(err),
      })
    }
  }

  async createClient(): Promise<{ clientId: number; personId: number }> {
    const variables: CreateClientMutationVariables = {
      input: {
        ...this.generateInput(),
        phonenumbers: {
          create: [],
        },
      },
    }

    // process phonenumbers
    this.form.phonenumbers.forEach((formPhonenumber) => {
      if (!formPhonenumber.number) {
        return
      }
      variables.input.phonenumbers!.create!.push(generatePhonenumberInput(formPhonenumber))
    })

    const { data } = await this.$apollo.mutate<CreateClientMutation>({
      mutation: CreateClient,
      variables,
      context: {
        fetchOptions: {
          onUploadProgress: (progressEvent) => {
            this.$store.commit('updateGenericModal', {
              progress: Math.round((100 * progressEvent.loaded) / progressEvent.total),
            })
          },
        },
      },
    })

    return {
      clientId: data!.createClient!.id,
      personId: data!.createClient!.person.id,
    }
  }

  async updateClient(): Promise<{ clientId: number; personId: number }> {
    if (!this.clientId) {
      throw new Error("clientId is empty, can't call updateConsultant()")
    }
    const variables: UpdateClientMutationVariables = {
      id: this.clientId,
      input: {
        ...this.generateInput(),
        phonenumbers: {
          create: [],
          update: [],
          delete: this.deletedPhonenumberIds,
        },
      },
    }

    // additional process for phonenumbers changes
    this.form.phonenumbers.forEach((formPhonenumber) => {
      if (!formPhonenumber.number) {
        // empty numbers should be deleted from DB, or ignored on create
        if (formPhonenumber.id) {
          this.deletedPhonenumberIds.push(formPhonenumber.id)
        }
      } else {
        if (formPhonenumber.id) {
          // update existing phone number
          variables.input.phonenumbers!.update!.push({
            ...generatePhonenumberInput(formPhonenumber),
            id: formPhonenumber.id,
          })
        } else {
          // create new phone number
          variables.input.phonenumbers!.create!.push({
            ...generatePhonenumberInput(formPhonenumber),
          })
        }
      }
    })

    const { data } = await this.$apollo.mutate<UpdateClientMutation>({
      mutation: UpdateClient,
      variables,
      context: {
        fetchOptions: {
          onUploadProgress: (progressEvent) => {
            this.$store.commit('updateGenericModal', {
              progress: Math.round((100 * progressEvent.loaded) / progressEvent.total),
            })
          },
        },
      },
    })

    // clean up temporary arrays
    this.deletedPhonenumberIds = []

    return {
      clientId: data!.updateClient!.id,
      personId: data!.updateClient!.person.id,
    }
  }

  private generateInput() {
    const input: CreateClientMutationVariables['input'] = {
      person: {
        upsert: {
          title: this.form.title,
          firstname: this.form.firstname!,
          other_firstnames: this.form.other_firstnames,
          lastname: this.form.lastname!,
          birth_name: this.form.birth_name!,
          gender: this.form.gender,
          birthdate: toISODate(this.form.birthdate),
        },
      },
      zoom_id: this.form.zoom_id!,
      email: this.form.email!,
      position: this.form.position,
      company_id: this.form.company.autocompleteValue ? this.form.company.autocompleteValue.id : null,
      location_id: this.form.location ? this.form.location.id : null,
      need_review_after_autocomplete: false,
      notes: this.form.notes,
      is_research: this.form.is_research,
    }

    if (this.personId) {
      input.person!.upsert!.id = this.personId
    }

    // fill profile image
    if (this.form.person_foto.isDirty) {
      input.person!.upsert!.foto = {
        file: this.form.person_foto.file,
        cropProps: this.form.person_foto.cropProps!,
        sizeName: this.form.person_foto.sizeName,
      }
    }

    return input
  }

  deleteClient() {
    if (!this.clientId) {
      this.$bus.showErrorModal({
        errors: ['Deletion of client is not possible, as client id is not specified.'],
      })
      return
    }
    this.$bus.showDeleteConfirmModal('Are you sure you want to delete this client?', () => {
      const variables: DeleteClientMutationVariables = {
        id: this.clientId!,
      }
      this.$apollo
        .mutate({
          mutation: DeleteClient,
          variables,
        })
        .then(async () => {
          this.$bus.showSuccessModal('Client was successfully removed', 3000)
          await this.$apollo.provider.defaultClient.clearStore()
          this.$router.push('/clients')
        })
        .catch((err) => {
          this.$bus.showErrorModal({
            errors: apolloParseErrors(err),
          })
        })
    })
  }

  private suggestExistingPerson() {
    if (this.ignorePersonSuggestion || !this.form.firstname || !this.form.lastname) {
      return
    }
    this.getPeopleByName({
      firstname: this.form.firstname,
      lastname: this.form.lastname,
    }).then(({ data }) => {
      if (data.people.length > 0) {
        this.$bus.showPersonSuggestionModal(data.people)
      }
    })
  }

  private fillFormWithPersonFromStore() {
    if (this.prefilledPerson) {
      this.personId = this.prefilledPerson.id

      this.form.title = this.prefilledPerson.title!
      this.form.firstname = this.prefilledPerson.firstname
      this.form.other_firstnames = this.prefilledPerson.other_firstnames!
      this.form.lastname = this.prefilledPerson.lastname!
      this.form.birth_name = this.prefilledPerson.birth_name!
      this.form.gender = this.prefilledPerson.gender!
      this.form.birthdate = parseDateFromISO(this.prefilledPerson.birthdate)

      if (this.prefilledPerson.foto) {
        this.form.person_foto.croppedImage =
          this.$config.publicUrl + this.prefilledPerson.foto.sizes.PROFILE_IMAGE!.retina
        this.form.person_foto.fullImage = this.$config.publicUrl + this.prefilledPerson.foto.original_image
        this.form.person_foto.cropProps = this.prefilledPerson.foto.sizes.PROFILE_IMAGE!.cropProps!
      }

      this.clearPrefilledPerson()
    }
  }

  destroyed() {
    this.$bus.$off('ignorePersonSuggestion')
    this.$bus.$off('selectSuggestedPerson')
  }
}
</script>
