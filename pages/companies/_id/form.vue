<template>
  <div class="container pt-5">
    <div class="flex w-full justify-start items-center mb-6 space-x-8">
      <nuxt-link :to="`/companies/${isCreating ? '' : $route.params.id}`" class="tbtn-icon tbtn--white">
        <IHChevronLeft class="w-6 h-6" />
      </nuxt-link>
      <h1>{{ isCreating ? 'Create' : 'Edit' }} Company</h1>
    </div>

    <ValidationObserver tag="form" @submit.prevent="onSubmit()" ref="formValidationObserver">
      <div class="grid gap-6 mb-8 grid-cols-1 xl:grid-cols-11">
        <div class="xl:col-span-6 flex flex-col space-y-6">
          <div class="card">
            <div class="card-header">
              <div>
                <h3>Company information</h3>
              </div>
            </div>
            <div class="divide-y">
              <div class="space-y-6 p-6">
                <FInput v-model="form.name" label="Company name" :rules="'required'" errorLabel="name" />
                <FInput v-model="form.legal_form" label="Legal form" />
                <FInput v-model="form.alias" label="Alias" />
                <FInput
                  v-model="form.employees_count"
                  label="Employees count"
                  :rules="'numeric'"
                  errorLabel="employees count"
                />
                <FInput
                  v-model="form.annual_sales"
                  label="Annual sales in EUR"
                  :asCurrency="true"
                  :rules="'currency'"
                  errorLabel="annual sales"
                />
                <FSelectIndustries v-model="form.industries" label="Industries" />
                <FTextarea v-model="form.about" label="About" />
                <FTextarea v-model="form.invoice_notes" label="Invoice Notes" />
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-header">
              <div>
                <h3>Company relations</h3>
              </div>
            </div>
            <div class="divide-y">
              <div class="space-y-6 p-6">
                <FCompanyAutocomplete v-model="form.parent_company.autocompleteValue" label="Parent company">
                </FCompanyAutocomplete>
              </div>
              <div class="space-y-6 p-6">
                <div class="flex justify-between mb-4">
                  <h3>Subsidiaries</h3>
                  <button
                    type="button"
                    class="tbtn tbtn-icon tbtn-icon--small tbtn--green"
                    @click="addEmptyChildCompany"
                  >
                    <IPlus class="w-5 h-5"></IPlus>
                  </button>
                </div>
                <div
                  class="flex space-x-4"
                  v-for="(formChildCompany, index) in form.child_companies"
                  :key="formChildCompany.itemIndex"
                >
                  <FCompanyAutocomplete v-model="formChildCompany.autocompleteValue" class="w-full" label="Company" />
                  <button
                    type="button"
                    class="tbtn tbtn-icon tbtn-icon--small tbtn--red"
                    @click="form.child_companies.splice(index, 1)"
                  >
                    <IMinus class="w-5 h-5"></IMinus>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="xl:col-span-5 flex flex-col space-y-6">
          <div class="card">
            <div class="divide-y">
              <div class="space-y-6 p-6">
                <div class="flex justify-center">
                  <CropperInModal class="relative" v-model="form.logo" v-slot="{ openModal }">
                    <img
                      class="!flex-none w-48 h-48 border-gray-400 border-2 overflow-hidden rounded-full bg-gray-200"
                      :src="form.logo.croppedImage"
                    />
                    <button
                      type="button"
                      class="absolute p-1 rounded-full"
                      :class="
                        form.logo.croppedImage
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
                <FInput v-model="form.website" label="Website URL" :rules="'url'" errorLabel="website" />
                <FInput v-model="form.email" label="Email" :rules="'email'" errorLabel="email" />
                <FInput
                  v-model="form.jobs_external_link"
                  label="Companies jobs URL"
                  :rules="'url'"
                  errorLabel="companies jobs URL"
                />
              </div>
              <div class="space-y-6 p-6">
                <div class="flex justify-between mb-4">
                  <h3>Office locations</h3>
                  <button type="button" class="tbtn tbtn-icon tbtn-icon--small tbtn--green" @click="addEmptyLocation">
                    <IPlus class="w-5 h-5"></IPlus>
                  </button>
                </div>
                <div
                  class="flex space-x-4"
                  v-for="(formLocation, index) in form.locations"
                  :key="formLocation.itemIndex"
                >
                  <FLocationAutocomplete v-model="formLocation.autocompleteValue" class="w-full" label="Location" />
                  <FInput v-model="formLocation.label" class="w-full" label="Label (e.g. primary office)" />
                  <button
                    type="button"
                    class="tbtn tbtn-icon tbtn-icon--small tbtn--red"
                    @click="deleteLocation(formLocation, index)"
                  >
                    <IMinus class="w-5 h-5"></IMinus>
                  </button>
                </div>
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
              <div class="flex items-center space-x-4">
                <IHFolder class="w-6 h-6 text-gray-700" />
                <h3>Documents</h3>
              </div>
              <div>
                <input
                  type="file"
                  multiple
                  @change="form.documents.processSelectedDocuments($refs.addDocumentsInput.files)"
                  style="display: none"
                  ref="addDocumentsInput"
                />
                <button
                  type="button"
                  class="tbtn tbtn-icon tbtn-icon--small tbtn--green"
                  @click="$refs.addDocumentsInput.click()"
                >
                  <IPlus class="w-5 h-5"></IPlus>
                </button>
              </div>
            </div>
            <div class="divide-y">
              <div
                class="flex space-x-6 p-6"
                v-for="(formDocument, index) in form.documents.documents"
                :key="formDocument.itemIndex"
              >
                <div class="space-y-6 flex-auto">
                  <FileIcon :mime_type="formDocument.mime_type" />
                  <FInput v-model="formDocument.title" label="Title" />
                  <FSelectDocumentTags v-model="formDocument.tags" label="Tags" />
                </div>
                <button
                  type="button"
                  class="tbtn tbtn-icon tbtn-icon--small tbtn--red"
                  @click="form.documents.deleteDocument(formDocument, index)"
                >
                  <IMinus class="w-5 h-5"></IMinus>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="form-action-buttons">
        <button class="tbtn tbtn--red mr-auto" v-if="!isCreating" type="button" @click="deleteCompany"> Delete </button>
        <nuxt-link to="." class="tbtn tbtn--white">Abort</nuxt-link>
        <button class="tbtn tbtn--blue">Save</button>
      </div>
    </ValidationObserver>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import GetCompany from '@/graphql/ressources/companies/GetCompany.gql'
import CreateCompany from '@/graphql/ressources/companies/CreateCompany.gql'
import DeleteCompany from '@/graphql/ressources/companies/DeleteCompany.gql'
import UpdateCompany from '@/graphql/ressources/companies/UpdateCompany.gql'
import UpdateCompanyAdditional from '@/graphql/ressources/companies/UpdateCompanyAdditional.gql'
import UpdateCompanyDocuments from '@/graphql/ressources/companies/UpdateCompanyDocuments.gql'

import FCountryDialCodeAutocomplete from '@/components/admin/FCountryDialCodeAutocomplete.vue'
import { countryDialCodeByCode, generatePhonenumberInput, IFormPhonenumber } from '~/helpers/phonenumberHelpers'
import { apolloParseErrors } from '~/helpers/apolloParseErrors'
import {
  CreateCompanyMutation,
  CreateCompanyMutationVariables,
  DeleteCompanyMutationVariables,
  GetCompanyQuery,
  Maybe,
  UpdateCompanyAdditionalMutation,
  UpdateCompanyAdditionalMutationVariables,
  UpdateCompanyDocumentsMutation,
  UpdateCompanyDocumentsMutationVariables,
  UpdateCompanyMutation,
  UpdateCompanyMutationVariables,
  UserRole,
} from '~/graphql/GQLTypes'
import { generateLocationInput, IFormLocation } from '~/helpers/locationHelpers'
import FCompanyAutocomplete from '~/components/admin/FCompanyAutocomplete.vue'
import { ValidationObserver } from 'vee-validate'
import { validateObserver } from '~/helpers/validationHelpers'
import FileIcon from '~/components/admin/FileIcon.vue'
import { DocumentsForm } from '~/helpers/fileUploadHelpers'
import { CropperInModalData, IdWithTitle } from '~/helpers/types'
import CropperInModal from '~/components/form/CropperInModal.vue'
import IHFolder from '~/components/globals/icons/heroicons/IHFolder.vue'
import IHChevronLeft from '~/components/globals/icons/heroicons/IHChevronLeft.vue'

@Component({
  components: {
    IHChevronLeft,
    IHFolder,
    CropperInModal,
    FileIcon,
    FCompanyAutocomplete,
    FCountryDialCodeAutocomplete,
    ValidationObserver,
  },
  async asyncData({ app, route }) {
    const data: any = {
      isCreating: route.params.id === 'new',
      companyId: Number.parseInt(route.params.id),
    }
    if (!data.isCreating) {
      try {
        const res = await app.apolloProvider!.defaultClient.query<GetCompanyQuery>({
          query: GetCompany,
          variables: {
            id: data.companyId,
          },
        })
        data.loadedData = res.data.company
      } catch (e) {
        data.loadedData = null
      }
    }
    return data
  },
  head() {
    return {
      title: `${(this as CompaniesEdit).isCreating ? 'Create' : 'Edit'} company`,
    }
  },
  middleware: 'auth',
  meta: {
    requiredRole: UserRole.Employee,
  },
})
export default class CompaniesEdit extends Vue {
  $refs!: {
    addDocumentsInput: HTMLInputElement
    logoImage: any
    formValidationObserver: InstanceType<typeof ValidationObserver>
  }

  isCreating = false

  form: {
    name: Maybe<string>
    legal_form: Maybe<string>
    alias: Maybe<string>
    website: Maybe<string>
    email: Maybe<string>
    employees_count: Maybe<string>
    annual_sales: Maybe<number>
    about: Maybe<string>
    invoice_notes: Maybe<string>
    industries: IdWithTitle[]
    logo: CropperInModalData
    locations: IFormLocation[]
    phonenumbers: IFormPhonenumber[]

    // consultants: Array<{
    //   itemIndex: number;
    //   autocompleteValue: Maybe<NonNullable<GetConsultantsForAutocompleteQuery['consultants']>['data'][0]>;
    //   pivot: ConsultantCompanyPivot;
    // }>;
    parent_company: {
      autocompleteValue: Maybe<NonNullable<GetCompanyQuery['company']>['parent_company']>
    }
    child_companies: Array<{
      itemIndex: number
      autocompleteValue: Maybe<NonNullable<GetCompanyQuery['company']>['child_companies'][0]>
    }>
    jobs_external_link: Maybe<string>
    documents: DocumentsForm
  } = {
    name: null,
    legal_form: null,
    alias: null,
    website: null,
    email: null,
    employees_count: null,
    annual_sales: null,
    about: null,
    invoice_notes: null,
    industries: [],
    logo: {
      sizeName: 'PROFILE_IMAGE',
      file: null,
      fullImage: null,
      croppedImage: null,
      cropProps: null,
      isDirty: false,
    },
    locations: [],
    phonenumbers: [],
    // consultants: [],
    parent_company: {
      autocompleteValue: null,
    },
    child_companies: [],
    jobs_external_link: null,
    documents: new DocumentsForm(),
  }

  loadedData!: Maybe<GetCompanyQuery['company']>
  private incrementalIndex = 0
  private companyId: number | null = null

  // temporary array of IDs for simplified sending data to server
  private deletedPhonenumberIds: number[] = []
  private deletedLocationIds: number[] = []

  private isSubmitting = false

  created() {
    // redirect to overview, if queried id was not found
    if (!this.isCreating && !this.loadedData) {
      this.$router.push('/companies')
      return
    }
    // fetch data, when editing
    if (!this.isCreating && this.loadedData) {
      this.form.name = this.loadedData.name
      this.form.legal_form = this.loadedData.legal_form!
      this.form.alias = this.loadedData.alias!
      this.form.website = this.loadedData.website!
      this.form.email = this.loadedData.email!
      this.form.employees_count = this.loadedData.employees_count!
      this.form.annual_sales = this.loadedData.annual_sales!
      this.form.about = this.loadedData.about!
      this.form.invoice_notes = this.loadedData.invoice_notes!
      this.form.jobs_external_link = this.loadedData.jobs_external_link!

      this.form.industries = this.loadedData.industries

      this.loadedData.locations.forEach((location) => {
        delete location.__typename
        this.form.locations.push({
          itemIndex: this.incrementalIndex++,
          id: location.id,
          autocompleteValue: location,
          label: location.label!,
        })
      })

      this.loadedData.phonenumbers.forEach((phonenumber) => {
        this.form.phonenumbers.push({
          itemIndex: this.incrementalIndex++,
          id: phonenumber.id,
          countryDialCode: countryDialCodeByCode[phonenumber.country_code],
          number: phonenumber.number,
          label: phonenumber.label!,
        })
      })

      if (this.loadedData.logo) {
        this.form.logo.croppedImage = this.$config.publicUrl + this.loadedData.logo.sizes.PROFILE_IMAGE!.retina
        this.form.logo.fullImage = this.$config.publicUrl + this.loadedData.logo.original_image
        this.form.logo.cropProps = this.loadedData.logo.sizes.PROFILE_IMAGE!.cropProps!
      }

      this.loadedData.documents.forEach((document) => {
        this.form.documents.add({
          id: document.id,
          title: document.title,
          mime_type: document.mime_type,
          tags: document.tags,
        })
      })
      // this.loadedData.consultants.forEach(consultantRelation => {
      //   this.form.consultants.push({
      //     itemIndex: this.incrementalIndex++,
      //     autocompleteValue: {
      //       id: consultantRelation.id,
      //       firstname: consultantRelation.firstname,
      //       lastname: consultantRelation.lastname,
      //       email: consultantRelation.email,
      //       title: consultantRelation.title
      //     },
      //     pivot: {
      //       consultant_id: consultantRelation.id,
      //       from: consultantRelation.pivot!.from
      //         ? DateTime.fromISO(consultantRelation.pivot!.from).toFormat('dd.MM.yyyy')
      //         : null,
      //       till: consultantRelation.pivot!.till
      //         ? DateTime.fromISO(consultantRelation.pivot!.till).toFormat('dd.MM.yyyy')
      //         : null,
      //       job_title: consultantRelation.pivot!.job_title
      //     }
      //   });
      // });

      if (this.loadedData.parent_company) {
        this.form.parent_company.autocompleteValue = this.loadedData.parent_company
      }

      this.loadedData.child_companies.forEach((childCompany) => {
        this.form.child_companies.push({
          itemIndex: this.incrementalIndex++,
          autocompleteValue: childCompany,
        })
      })
    }
  }

  addEmptyChildCompany() {
    this.form.child_companies.push({
      itemIndex: this.incrementalIndex++,
      autocompleteValue: null,
    })
  }

  // addEmptyConsultantRelation() {
  //   this.form.consultants.unshift({
  //     itemIndex: this.incrementalIndex++,
  //     pivot: {
  //       consultant_id: 0
  //     },
  //     autocompleteValue: null
  //   });
  // }

  addEmptyLocation() {
    this.form.locations.unshift({
      itemIndex: this.incrementalIndex++,
      autocompleteValue: null,
      label: null,
    })
  }

  deleteLocation(formLocation: IFormLocation, index: number) {
    this.form.locations.splice(index, 1)
    if (formLocation.id) {
      this.deletedLocationIds.push(formLocation.id)
    }
  }

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
        text: 'Storing form values and logo image...',
        progress: 0,
        blocking: true,
      })
      this.$bus.showGenericModal()
      // determine if we should run create or update mutation
      let createOrUpdateFn = this.isCreating ? this.createCompany : this.updateCompany
      // store consultantId
      this.companyId = await createOrUpdateFn()
      // as we store consultant in 2 steps, mark that consultant was already created
      this.isCreating = false

      this.$store.commit('updateGenericModal', {
        text: 'Storing company relations...',
        progress: Math.round(100 / 3),
      })
      // store additional relations (images and regions). This should be merged later into regular create/update mutations, when lighthouse supports it
      await this.updateCompanyAdditional()

      this.$store.commit('updateGenericModal', {
        text: 'Storing documents...',
        progress: Math.round((100 / 3) * 2),
      })
      // process documents changes
      await this.updateCompanyDocuments()
      this.$bus.hideGenericModal()

      // everything went good, clear store and navigate back to list overview
      this.$bus.showSuccessModal('Company was successfully ' + (this.isCreating ? 'created' : 'updated'), 3000)
      this.isSubmitting = false
      await this.$apollo.provider.defaultClient.clearStore()
      this.$router.push('/companies/' + this.companyId)
    } catch (err) {
      this.isSubmitting = false
      console.error(err)
      this.$bus.hideGenericModal()
      this.$bus.showErrorModal({
        errors: apolloParseErrors(err),
      })
    }
  }

  async createCompany(): Promise<number> {
    const variables: CreateCompanyMutationVariables = {
      input: {
        ...this.generateInput(),
        locations: {
          create: [],
        },
        phonenumbers: {
          create: [],
        },
      },
    }

    // process locations
    this.form.locations.forEach((formLocation) => {
      if (!formLocation.autocompleteValue) {
        return
      }
      variables.input.locations!.create!.push({
        ...generateLocationInput(formLocation),
        label: formLocation.label,
      })
    })

    // process phonenumbers
    this.form.phonenumbers.forEach((formPhonenumber) => {
      if (!formPhonenumber.number) {
        return
      }
      variables.input.phonenumbers!.create!.push(generatePhonenumberInput(formPhonenumber))
    })

    const { data } = await this.$apollo.mutate<CreateCompanyMutation>({
      mutation: CreateCompany,
      variables,
      context: {
        fetchOptions: {
          onUploadProgress: (progressEvent) => {
            this.$store.commit('updateGenericModal', {
              progress: Math.round(((100 / 3) * progressEvent.loaded) / progressEvent.total),
            })
          },
        },
      },
    })

    return data!.createCompany!.id
  }

  async updateCompany(): Promise<number> {
    if (!this.companyId) {
      throw new Error("consultantId is empty, can't call updateConsultant()")
    }
    const variables: UpdateCompanyMutationVariables = {
      id: this.companyId,
      input: {
        ...this.generateInput(),
        phonenumbers: {
          create: [],
          update: [],
          delete: this.deletedPhonenumberIds,
        },
        locations: {
          create: [],
          update: [],
          delete: this.deletedLocationIds,
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

    // additional process for locations changes
    this.form.locations.forEach((formLocation) => {
      if (!formLocation.autocompleteValue) {
        // empty locations should be deleted from DB, or ignored on create
        if (formLocation.id) {
          this.deletedLocationIds.push(formLocation.id)
        }
      } else {
        if (formLocation.id) {
          // update existing location
          variables.input.locations!.update!.push({
            ...generateLocationInput(formLocation),
            id: formLocation.id,
          })
        } else {
          // create new location
          variables.input.locations!.create!.push({
            ...generateLocationInput(formLocation),
          })
        }
      }
    })

    const { data } = await this.$apollo.mutate<UpdateCompanyMutation>({
      mutation: UpdateCompany,
      variables,
      context: {
        fetchOptions: {
          onUploadProgress: (progressEvent) => {
            this.$store.commit('updateGenericModal', {
              progress: Math.round(((100 / 3) * progressEvent.loaded) / progressEvent.total),
            })
          },
        },
      },
    })

    // clean up temporary arrays
    this.deletedPhonenumberIds = []
    this.deletedLocationIds = []

    return data!.updateCompany!.id
  }

  private generateInput() {
    const input: CreateCompanyMutationVariables['input'] = {
      name: this.form.name!,
      legal_form: this.form.legal_form,
      alias: this.form.alias,
      website: this.form.website,
      email: this.form.email,
      employees_count: this.form.employees_count,
      annual_sales: this.form.annual_sales,
      about: this.form.about,
      invoice_notes: this.form.invoice_notes,
      industries: {
        sync: this.form.industries.map((industry) => {
          return industry.id
        }),
      },
      jobs_external_link: this.form.jobs_external_link,
      need_review_after_autocomplete: false,
    }

    // fill profile image
    if (this.form.logo.isDirty) {
      input.logo = {
        file: this.form.logo.file,
        cropProps: this.form.logo.cropProps!,
        sizeName: this.form.logo.sizeName,
      }
    }

    return input
  }

  async updateCompanyAdditional(): Promise<{ data?: UpdateCompanyAdditionalMutation }> {
    if (!this.companyId) {
      throw new Error('this.companyId is not set! Calling updateCompanyAdditional() is not allowed')
    }
    const variables: UpdateCompanyAdditionalMutationVariables = {
      id: this.companyId,
      input: {
        // consultants: {
        //   sync: []
        // },
        parent_company_id: this.form.parent_company.autocompleteValue
          ? this.form.parent_company.autocompleteValue.id
          : null,
        sync_children_company: [],
      },
    }

    // fill consultants
    // this.form.consultants.forEach(formConsultant => {
    //   // if no consultant was selected in autocomplete, ignore
    //   if (!formConsultant.autocompleteValue) {
    //     return;
    //   }
    //   variables.input.consultants!.sync!.push({
    //     consultant_id: formConsultant.autocompleteValue.id,
    //     from: formConsultant.pivot.from
    //       ? DateTime.fromFormat(formConsultant.pivot.from, 'dd.MM.yyyy').toISODate()
    //       : null,
    //     till: formConsultant.pivot.till
    //       ? DateTime.fromFormat(formConsultant.pivot.till, 'dd.MM.yyyy').toISODate()
    //       : null,
    //     job_title: formConsultant.pivot.job_title
    //   });
    // });

    // process child companies
    this.form.child_companies.forEach((childCompany) => {
      if (!childCompany.autocompleteValue) {
        return
      }
      variables.input.sync_children_company!.push(childCompany.autocompleteValue.id)
    })

    const response = await this.$apollo.mutate({
      mutation: UpdateCompanyAdditional,
      variables,
      context: {
        fetchOptions: {
          onUploadProgress: (progressEvent) => {
            this.$store.commit('updateGenericModal', {
              progress: Math.round(100 / 3 + ((100 / 3) * progressEvent.loaded) / progressEvent.total),
            })
          },
        },
      },
    })

    return response
  }

  async updateCompanyDocuments(): Promise<{ data?: UpdateCompanyDocumentsMutation }> {
    if (!this.companyId) {
      throw new Error('this.companyId is not set! Calling updateCompanyDocuments() is not allowed')
    }
    const variables: UpdateCompanyDocumentsMutationVariables = {
      id: this.companyId,
      input: this.form.documents.generateMutationInput(),
    }

    const response = await this.$apollo.mutate({
      mutation: UpdateCompanyDocuments,
      variables,
      context: {
        fetchOptions: {
          onUploadProgress: (progressEvent) => {
            this.$store.commit('updateGenericModal', {
              progress: Math.round((100 / 3) * 2 + ((100 / 3) * progressEvent.loaded) / progressEvent.total),
            })
          },
        },
      },
    })

    return response
  }

  deleteCompany() {
    if (!this.companyId) {
      this.$bus.showErrorModal({
        errors: ['Deletion of consultant is not possible, as consultant id is not specified.'],
      })
      return
    }
    this.$bus.showDeleteConfirmModal('Are you sure you want to delete this company?', () => {
      const variables: DeleteCompanyMutationVariables = {
        id: this.companyId!,
      }
      this.$apollo
        .mutate({
          mutation: DeleteCompany,
          variables,
        })
        .then(async () => {
          this.$bus.showSuccessModal('Company was successfully removed', 3000)
          await this.$apollo.provider.defaultClient.clearStore()
          this.$router.push('/companies')
        })
        .catch((err) => {
          this.$bus.showErrorModal({
            errors: apolloParseErrors(err),
          })
        })
    })
  }
}
</script>
