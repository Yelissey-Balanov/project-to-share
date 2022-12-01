<template>
  <div class="container pt-5">
    <div class="flex w-full justify-start items-center mb-6 space-x-8">
      <nuxt-link :to="`/candidates/${isCreating ? '' : $route.params.id}`" class="tbtn-icon tbtn--white">
        <IHChevronLeft class="w-6 h-6" />
      </nuxt-link>
      <h1>{{ isCreating ? 'Create' : 'Edit' }} Candidate profile</h1>
    </div>

    <ValidationObserver tag="form" @submit.prevent="onSubmit()" ref="formValidationObserver">
      <div class="grid gap-6 mb-8 grid-cols-1 xl:grid-cols-11">
        <div class="xl:col-span-6 flex flex-col space-y-6">
          <div class="card">
            <div class="card-header">
              <div>
                <h3>Candidate information</h3>
              </div>
            </div>
            <div class="divide-y">
              <div class="space-y-6 p-6">
                <FCheckbox v-model="form.is_research" label="Research candidate" />
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
                <FInput v-model="form.marital_status" label="Marital status" />
                <FNationalityAutocomplete v-model="form.nationalities" label="Nationalities" />
              </div>
              <div class="space-y-6 p-6">
                <div class="flex justify-between mb-4">
                  <h3>Languages</h3>
                  <button type="button" class="tbtn tbtn-icon tbtn-icon--small tbtn--green" @click="addEmptyLanguage">
                    <IPlus class="w-5 h-5"></IPlus>
                  </button>
                </div>
                <div
                  class="flex space-x-4"
                  v-for="(formLanguage, index) in form.languages"
                  :key="formLanguage.itemIndex"
                >
                  <FSelectLanguage class="w-full" v-model="formLanguage.code" label="Language" />
                  <FSelectSimple
                    class="w-full"
                    v-model="formLanguage.level"
                    label="Level"
                    :options="languageLevelOptions"
                  />
                  <button
                    type="button"
                    class="tbtn tbtn-icon tbtn-icon--small tbtn--red"
                    @click="form.languages.splice(index, 1)"
                  >
                    <IMinus class="w-5 h-5"></IMinus>
                  </button>
                </div>
              </div>
              <div class="space-y-6 p-6">
                <FSelectIndustries v-model="form.industries" label="Industries" />
                <FSelectSkills v-model="form.skills" label="Skills" />
                <FSelectCertifications v-model="form.certifications" label="Certifications" />
                <FSelectItSkills v-model="form.it_skills" label="IT Skills" />
                <FTextarea v-if="isEmployee" v-model="form.notes" label="Notes (visible for Employees only)" />
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <div>
                <h3>Job preferences</h3>
              </div>
            </div>
            <div class="divide-y">
              <div class="space-y-6 p-6">
                <FInput v-model="form.desired_job" label="Desired position" />
                <FInput v-model="form.max_distance_from_home" label="Maximum distance from home (km)" />
                <FInput
                  v-model="form.willing_to_travel"
                  label="Travel willingness (%)"
                  :rules="'min_value:0|max_value:100'"
                  errorLabel="travel willingness"
                />
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <div class="flex items-center space-x-4">
                <h3>Education</h3>
              </div>
              <button type="button" class="tbtn tbtn-icon tbtn-icon--small tbtn--green" @click="addEmptyEducation">
                <IPlus class="w-5 h-5"></IPlus>
              </button>
            </div>
            <div class="divide-y">
              <div
                class="space-x-4 p-6 flex justify-between"
                v-for="(formEducation, index) of form.educations"
                :key="formEducation.itemIndex"
              >
                <div class="space-y-6 flex-auto">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FSelectInstitutions v-model="formEducation.institution" label="Institution" :isSingle="true">
                    </FSelectInstitutions>

                    <FInput v-model="formEducation.main_field_of_study" label="Main field of study" />
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-1 gap-6">
                    <FMultiselect
                      label="Additional fields of study"
                      v-model="formEducation.additional_fields_of_study"
                    />
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FDatePicker v-model="formEducation.from" label="From" />
                    <FDatePicker v-model="formEducation.till" label="Till" />
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FInput v-model="formEducation.degree" label="Degree" />
                    <FInput v-model="formEducation.final_grade" label="Final grade" />
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-1 gap-6">
                    <FTextarea label="Notes" v-model="formEducation.notes" />
                  </div>
                </div>
                <button
                  type="button"
                  class="tbtn tbtn-icon tbtn-icon--small tbtn--red"
                  @click="form.educations.splice(index, 1)"
                >
                  <IMinus class="w-5 h-5"></IMinus>
                </button>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <div class="flex items-center space-x-4">
                <h3>Worked at companies</h3>
              </div>
              <button
                type="button"
                class="tbtn tbtn-icon tbtn-icon--small tbtn--green"
                @click="addEmptyCompanyRelation"
              >
                <IPlus class="w-5 h-5"></IPlus>
              </button>
            </div>
            <div class="divide-y">
              <div
                class="space-x-4 p-6 flex justify-between"
                v-for="(formCompany, index) of form.companies"
                :key="formCompany.itemIndex"
              >
                <div class="space-y-6 flex-auto">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FCompanyAutocomplete v-model="formCompany.autocompleteValue" label="Company" :allowCreating="true">
                    </FCompanyAutocomplete>

                    <FInput v-model="formCompany.pivot.job_title" label="Job title" />
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FSelectJobLevel v-model="formCompany.pivot.job_level" label="Job level" />
                    <FMultiselect
                      label="Main responsibilities (short, max. 5)"
                      v-model="formCompany.mainResponsibilities"
                    />
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FDatePicker v-model="formCompany.pivot.from" label="From" />
                    <FDatePicker v-model="formCompany.pivot.till" label="Till" />
                  </div>
                </div>
                <button
                  type="button"
                  class="tbtn tbtn-icon tbtn-icon--small tbtn--red"
                  @click="form.companies.splice(index, 1)"
                >
                  <IMinus class="w-5 h-5"></IMinus>
                </button>
              </div>
            </div>
          </div>

          <div class="card" v-if="isEmployee">
            <div class="space-y-6 p-6">
              <FCheckbox v-model="form.is_blacklisted" label="Is blacklisted" />
              <FTextarea v-if="form.is_blacklisted" v-model="form.blacklisting_reason" label="Blacklisting reason" />
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
                      class="!flex-none w-48 h-48 border-gray-400 border-2 overflow-hidden rounded-full bg-gray-200"
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
                <FInput v-model="form.skype_name" label="Skype ID" />
                <FInput v-model="form.zoom_id" label="Zoom ID" />
                <FInput v-model="form.linked_in_profile" label="LinkedIn" :rules="'url'" errorLabel="LinkedIn" />
                <FInput v-model="form.xing_profile" label="XING" :rules="'url'" errorLabel="XING" />
                <FInput v-model="form.url" label="URL" :rules="'url'" errorLabel="URL" />
                <FLocationAutocomplete v-model="form.location.autocompleteValue" label="Location" />
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
                <IHBriefcase class="w-6 h-6 text-gray-700" />
                <h3>Interim conditions</h3>
              </div>
            </div>
            <div class="space-y-6 p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <FCheckbox v-model="form.is_interim" label="Interim" />
                <FDatePicker v-model="form.available_from" label="Available from" :disabled="!form.is_interim" />
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <FCheckbox v-model="form.has_hourly_rate" :disabled="!form.is_interim" label="Has hourly rate" />
                <template v-if="form.has_hourly_rate">
                  <FInput
                    v-model="form.hourly_rate"
                    label="Hourly rate"
                    :disabled="!form.is_interim"
                    :asCurrency="true"
                    :rules="'currency'"
                    errorLabel="hourly rate"
                  />
                  <FInput
                    v-model="calculatedDailyRate"
                    label="Daily rate"
                    :disabled="!form.is_interim"
                    :asCurrency="true"
                    readonly
                    :rules="'currency'"
                    errorLabel="daily rate"
                  />
                  <FCheckbox v-model="form.expenses_included" label="Expenses included" :disabled="!form.is_interim" />
                </template>
                <template v-else>
                  <FInput
                    v-model="form.daily_rate"
                    label="Daily rate"
                    :disabled="!form.is_interim"
                    :asCurrency="true"
                    :rules="'currency'"
                    errorLabel="daily rate"
                  />
                  <FCheckbox v-model="form.expenses_included" label="Expenses included" :disabled="!form.is_interim" />
                  <div></div>
                </template>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <div class="flex items-center space-x-4">
                <IHBriefcase class="w-6 h-6 text-gray-700" />
                <h3>Permanent conditions</h3>
              </div>
            </div>
            <div class="space-y-6 p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <FCheckbox v-model="form.is_permanent" label="Permanent" />
                <FCheckbox
                  v-model="form.is_business_car_included"
                  label="Business car included"
                  :disabled="!form.is_permanent"
                />
                <FNoticePeriodInput
                  class="col-span-2"
                  v-model="form.period_of_notice"
                  label="Notice period"
                  :disabled="!form.is_permanent"
                />
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <FInput
                  v-model="form.basic_salary"
                  label="Basic salary"
                  :asCurrency="true"
                  :disabled="!form.is_permanent"
                  :rules="'currency'"
                  errorLabel="basic salary"
                />
                <FInput
                  v-model="form.bonus_eur"
                  label="Bonus"
                  :asCurrency="true"
                  :disabled="!form.is_permanent"
                  :rules="'currency'"
                  errorLabel="bonus"
                />
                <FInput v-model="form.other_bonus" label="Other bonuses" :disabled="!form.is_permanent" />
                <FInput
                  v-model="salaryPackage"
                  label="Salary package"
                  :disabled="!form.is_permanent"
                  :asCurrency="true"
                  readonly
                  :rules="'currency'"
                  errorLabel="salary package"
                />
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
        <button class="tbtn tbtn--red mr-auto" v-if="!isCreating" type="button" @click="deleteCandidate">
          Delete
        </button>
        <nuxt-link to="." class="tbtn tbtn--white">Abort</nuxt-link>
        <button class="tbtn tbtn--blue">Save</button>
      </div>
    </ValidationObserver>

    <AddPersonSuggestionModal />
  </div>
</template>

<script lang="ts">
import GetCandidate from '@/graphql/ressources/candidates/GetCandidate.gql'
import CreateCandidate from '@/graphql/ressources/candidates/CreateCandidate.gql'
import DeleteCandidate from '@/graphql/ressources/candidates/DeleteCandidate.gql'
import UpdateCandidate from '@/graphql/ressources/candidates/UpdateCandidate.gql'
import UpdateCandidateAdditional from '@/graphql/ressources/candidates/UpdateCandidateAdditional.gql'
import UpdateCandidateDocuments from '@/graphql/ressources/candidates/UpdateCandidateDocuments.gql'

import { Component, Vue, Action, State, Mutation, namespace, Watch } from 'nuxt-property-decorator'
import FCountryDialCodeAutocomplete from '@/components/admin/FCountryDialCodeAutocomplete.vue'
import { countryDialCodeByCode, generatePhonenumberInput, IFormPhonenumber } from '~/helpers/phonenumberHelpers'
import { apolloParseErrors } from '~/helpers/apolloParseErrors'
import {
  CreateCandidateMutation,
  CreateCandidateMutationVariables,
  GetCandidateQuery,
  Maybe,
  UpdateCandidateMutation,
  UpdateCandidateMutationVariables,
  UserRole,
  Gender,
  GetCompaniesForAutocompleteQuery,
  UpdateCandidateAdditionalMutation,
  UpdateCandidateAdditionalMutationVariables,
  UpdateCandidateDocumentsMutation,
  UpdateCandidateDocumentsMutationVariables,
  DeleteCandidateMutationVariables,
  LanguageLevel,
  GetPeopleByNameQuery,
  JobLevel,
} from '~/graphql/GQLTypes'
import { debounce } from 'lodash'
import { generateLocationInput, IFormSingleLocation } from '~/helpers/locationHelpers'
import { ValidationObserver } from 'vee-validate'
import { syncValidateObserverValues, validateObserver } from '~/helpers/validationHelpers'
import FCompanyAutocomplete from '~/components/admin/FCompanyAutocomplete.vue'
import { DocumentsForm } from '~/helpers/fileUploadHelpers'
import FileIcon from '~/components/admin/FileIcon.vue'
import { languageLevelOptions } from '@/helpers/languagesListEn'
import FNationalityAutocomplete from '~/components/admin/FNationalityAutocomplete.vue'
import FNoticePeriodInput from '~/components/form/FNoticePeriodInput.vue'
import { CropperInModalData, IdWithTitle, NoticePeriodValue } from '~/helpers/types'
import AddPersonSuggestionModal from '~/components/admin/AddPersonSuggestionModal.vue'
import LabeledValue from '~/components/admin/LabeledValue.vue'
import FSelectJobLevel from '~/components/globals/form/FSelectJobLevel.vue'
import { parseDateFromISO, toISODate } from '~/helpers/dateHelpers'
import CropperInModal from '~/components/form/CropperInModal.vue'
import IHChevronLeft from '~/components/globals/icons/heroicons/IHChevronLeft.vue'
import IHFolder from '~/components/globals/icons/heroicons/IHFolder.vue'
import IHBriefcase from '~/components/globals/icons/heroicons/IHBriefcase.vue'

@Component({
  components: {
    IHBriefcase,
    IHFolder,
    IHChevronLeft,
    CropperInModal,
    FSelectJobLevel,
    LabeledValue,
    AddPersonSuggestionModal,
    FNoticePeriodInput,
    FNationalityAutocomplete,
    FileIcon,
    FCompanyAutocomplete,
    FCountryDialCodeAutocomplete,
    ValidationObserver,
  },
  async asyncData({ app, route, redirect }) {
    const data: any = {
      isCreating: route.params.id === 'new',
      candidateId: Number.parseInt(route.params.id),
    }
    if (!data.isCreating) {
      try {
        const res = await app.apolloProvider!.defaultClient.query<GetCandidateQuery>({
          query: GetCandidate,
          variables: {
            id: data.candidateId,
          },
        })
        data.loadedData = res.data.candidate
      } catch (e) {
        data.loadedData = null
      }
    }

    // redirect to overview, if queried id was not found
    if (!data.isCreating && !data.loadedData) {
      return redirect('/candidates')
    }
    return data
  },
  head() {
    return {
      title: `${(this as CandidatesEdit).isCreating ? 'Create' : 'Edit'} candidate profile`,
    }
  },
  middleware: 'auth',
  meta: {
    requiredRole: UserRole.Employee,
    allowAlsoFor: {
      userPath: 'candidate.id',
      routePath: 'params.id',
    },
  },
})
export default class CandidatesEdit extends Vue {
  $refs!: {
    formValidationObserver: InstanceType<typeof ValidationObserver>
    addDocumentsInput: HTMLInputElement
  }

  isCreating = false

  form: {
    title: Maybe<string>
    firstname: Maybe<string>
    lastname: Maybe<string>
    other_firstnames: Maybe<string>
    birth_name: Maybe<string>
    birthdate: Maybe<Date>
    email: Maybe<string>
    gender: Maybe<Gender>
    marital_status: Maybe<string>
    skype_name: Maybe<string>
    zoom_id: Maybe<string>
    desired_job: Maybe<string>
    max_distance_from_home: Maybe<string>
    willing_to_travel: Maybe<string>
    is_interim: boolean
    available_from: Maybe<Date>
    daily_rate: Maybe<number>
    hourly_rate: Maybe<number>
    has_hourly_rate: boolean
    expenses_included: Maybe<boolean>
    is_permanent: boolean
    period_of_notice: Maybe<NoticePeriodValue>
    basic_salary: Maybe<number>
    bonus_eur: Maybe<number>
    is_business_car_included: Maybe<boolean>
    other_bonus: Maybe<string>
    notes: Maybe<string>
    is_blacklisted: Maybe<boolean>
    blacklisting_reason: Maybe<string>
    linked_in_profile: Maybe<string>
    xing_profile: Maybe<string>
    url: Maybe<string>
    nationalities: string[]
    is_research: boolean

    person_foto: CropperInModalData
    location: IFormSingleLocation
    phonenumbers: IFormPhonenumber[]
    languages: Array<{
      itemIndex: number
      code: Maybe<string>
      level: Maybe<LanguageLevel>
    }>
    documents: DocumentsForm
    industries: IdWithTitle[]
    certifications: IdWithTitle[]
    it_skills: IdWithTitle[]
    skills: IdWithTitle[]
    companies: Array<{
      itemIndex: number
      autocompleteValue: Maybe<NonNullable<GetCompaniesForAutocompleteQuery['companies']>['data'][0]>
      pivot: {
        id: Maybe<number>
        from: Maybe<Date>
        till: Maybe<Date>
        job_title: Maybe<string>
        job_level: Maybe<JobLevel>
      }
      mainResponsibilities: IdWithTitle<string>[]
    }>
    educations: Array<{
      itemIndex: number
      institution: Maybe<{
        id: number
        name: string
      }>
      id: Maybe<number>
      from: Maybe<Date>
      till: Maybe<Date>
      main_field_of_study: Maybe<string>
      additional_fields_of_study: IdWithTitle[]
      degree: Maybe<string>
      final_grade: Maybe<string>
      notes: Maybe<string>
    }>
  } = {
    title: null,
    firstname: null,
    lastname: null,
    other_firstnames: null,
    birth_name: null,
    birthdate: null,
    email: null,
    gender: null,
    marital_status: null,
    skype_name: null,
    zoom_id: null,
    desired_job: null,
    max_distance_from_home: null,
    willing_to_travel: null,
    is_interim: false,
    available_from: null,
    daily_rate: null,
    hourly_rate: null,
    has_hourly_rate: false,
    expenses_included: null,
    is_permanent: false,
    period_of_notice: null,
    basic_salary: null,
    bonus_eur: null,
    is_business_car_included: null,
    other_bonus: null,
    notes: null,
    is_blacklisted: false,
    blacklisting_reason: null,
    linked_in_profile: null,
    xing_profile: null,
    url: null,
    nationalities: [],
    is_research: false,

    person_foto: {
      sizeName: 'PROFILE_IMAGE',
      file: null,
      fullImage: null,
      croppedImage: null,
      cropProps: null,
      isDirty: false,
    },
    location: {
      label: null,
      autocompleteValue: null,
    },
    phonenumbers: [],
    languages: [],
    documents: new DocumentsForm(),
    industries: [],
    certifications: [],
    it_skills: [],
    skills: [],
    companies: [],
    educations: [],
  }

  genderOptions = {}
  languageLevelOptions = languageLevelOptions

  loadedData!: Maybe<GetCandidateQuery['candidate']>
  private incrementalIndex = 0
  private candidateId: Maybe<number> = null
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

  get salaryPackage() {
    const basicSalary = this.form.basic_salary ? parseFloat(this.form.basic_salary as any) : 0
    const bonusEur = this.form.bonus_eur ? parseFloat(this.form.bonus_eur as any) : 0
    return basicSalary + bonusEur
  }

  get calculatedDailyRate() {
    if (this.form.has_hourly_rate) {
      return this.form.hourly_rate ? this.form.hourly_rate * 8 : null
    } else {
      return this.form.daily_rate
    }
  }

  // @(namespace('account').Getter('isCandidate'))
  // isCandidate!: boolean
  //
  // @(namespace('account').Getter('isAdmin'))
  // isAdmin!: boolean

  @(namespace('account').Getter('isEmployee'))
  isEmployee!: boolean

  @Watch('form.has_hourly_rate')
  onHasHourlyRateChanged(newValue) {
    if (newValue === true && this.form.daily_rate) {
      this.form.hourly_rate = this.form.daily_rate / 8
    } else if (newValue === false && this.form.hourly_rate) {
      this.form.daily_rate = this.form.hourly_rate * 8
    }
  }

  created() {
    // init gender options
    Object.keys(Gender).forEach((genderItem) => {
      this.genderOptions[genderItem] = genderItem
    })

    // fetch data, when editing
    if (!this.isCreating && this.loadedData) {
      this.personId = this.loadedData.person.id

      this.form.title = this.loadedData.person.title!
      this.form.firstname = this.loadedData.person.firstname
      this.form.lastname = this.loadedData.person.lastname
      this.form.other_firstnames = this.loadedData.person.other_firstnames!
      this.form.birth_name = this.loadedData.person.birth_name!
      this.form.birthdate = parseDateFromISO(this.loadedData.person.birthdate)
      this.form.email = this.loadedData.email!
      this.form.gender = this.loadedData.person.gender!
      this.form.marital_status = this.loadedData.marital_status!
      this.form.skype_name = this.loadedData.skype_name!
      this.form.zoom_id = this.loadedData.zoom_id!
      this.form.desired_job = this.loadedData.desired_job!
      this.form.max_distance_from_home = this.loadedData.max_distance_from_home!
      this.form.willing_to_travel = this.loadedData.willing_to_travel
        ? this.loadedData.willing_to_travel.toString()
        : null
      this.form.is_interim = this.loadedData.is_interim
      this.form.available_from = parseDateFromISO(this.loadedData.available_from)
      this.form.daily_rate = this.loadedData.daily_rate!
      this.form.has_hourly_rate = this.loadedData.has_hourly_rate
      if (this.form.daily_rate) {
        this.form.hourly_rate = this.form.daily_rate / 8
      }
      this.form.expenses_included = this.loadedData.expenses_included!
      this.form.is_permanent = this.loadedData.is_permanent
      this.form.period_of_notice = this.loadedData.period_of_notice
      this.form.basic_salary = this.loadedData.basic_salary!
      this.form.bonus_eur = this.loadedData.bonus_eur!
      this.form.is_business_car_included = this.loadedData.is_business_car_included!
      this.form.other_bonus = this.loadedData.other_bonus!
      this.form.notes = this.loadedData.notes!
      this.form.is_blacklisted = this.loadedData.is_blacklisted!
      this.form.blacklisting_reason = this.loadedData.blacklisting_reason!
      this.form.linked_in_profile = this.loadedData.linked_in_profile!
      this.form.xing_profile = this.loadedData.xing_profile!
      this.form.url = this.loadedData.url!
      this.form.nationalities = this.loadedData.nationalities.map((nationality) => nationality.id)
      this.form.is_research = this.loadedData.is_research!

      this.form.industries = this.loadedData.industries
      this.form.skills = this.loadedData.skills
      this.form.certifications = this.loadedData.certifications
      this.form.it_skills = this.loadedData.it_skills

      if (this.loadedData.location) {
        const storedLocation = this.loadedData.location
        delete storedLocation.__typename
        this.form.location = {
          id: storedLocation.id,
          autocompleteValue: storedLocation,
          label: null,
        }
      }

      this.loadedData.phonenumbers.forEach((phonenumber) => {
        this.form.phonenumbers.push({
          itemIndex: this.incrementalIndex++,
          id: phonenumber.id,
          countryDialCode: countryDialCodeByCode[phonenumber.country_code],
          number: phonenumber.number,
          label: phonenumber.label!,
        })
      })

      this.loadedData.languages.forEach((language) => {
        this.form.languages.push({
          itemIndex: this.incrementalIndex++,
          code: language.code,
          level: language.language_pivot!.level!,
        })
      })

      this.loadedData.documents.forEach((document) => {
        this.form.documents.add({
          id: document.id,
          title: document.title,
          mime_type: document.mime_type,
          tags: document.tags,
        })
      })

      if (this.loadedData.person.foto) {
        this.form.person_foto.croppedImage =
          this.$config.publicUrl + this.loadedData.person.foto.sizes.PROFILE_IMAGE!.retina
        this.form.person_foto.fullImage = this.$config.publicUrl + this.loadedData.person.foto.original_image
        this.form.person_foto.cropProps = this.loadedData.person.foto.sizes.PROFILE_IMAGE!.cropProps!
      }

      this.loadedData.worked_at_companies.forEach((companyPivot) => {
        this.form.companies.push({
          itemIndex: this.incrementalIndex++,
          autocompleteValue: {
            id: companyPivot.company!.id,
            name: companyPivot.company!.name,
          },
          pivot: {
            id: companyPivot.id!,
            from: parseDateFromISO(companyPivot.from),
            till: parseDateFromISO(companyPivot.till),
            job_title: companyPivot.job_title!,
            job_level: companyPivot.job_level!,
          },
          mainResponsibilities: companyPivot.main_responsibilities
            ? companyPivot.main_responsibilities.map((item) => ({
                id: item,
                title: item,
              }))
            : [],
        })
      })

      this.loadedData.educations.forEach((education) => {
        this.form.educations.push({
          itemIndex: this.incrementalIndex++,
          institution: education.institution!,
          id: education.id!,
          from: parseDateFromISO(education.from),
          till: parseDateFromISO(education.till),
          main_field_of_study: education.main_field_of_study!,
          additional_fields_of_study: education.additional_fields_of_study.map((fos) => ({
            id: this.incrementalIndex++,
            title: fos,
          })),
          degree: education.degree!,
          final_grade: education.final_grade!,
          notes: education.notes!,
        })
      })
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

  addEmptyLanguage() {
    this.form.languages.unshift({
      itemIndex: this.incrementalIndex++,
      code: null,
      level: null,
    })
  }

  addEmptyCompanyRelation() {
    this.form.companies.unshift({
      itemIndex: this.incrementalIndex++,
      pivot: {
        id: null,
        job_title: null,
        job_level: null,
        from: null,
        till: null,
      },
      autocompleteValue: null,
      mainResponsibilities: [],
    })
  }

  addEmptyEducation() {
    this.form.educations.unshift({
      itemIndex: this.incrementalIndex++,
      institution: null,
      id: null,
      from: null,
      till: null,
      main_field_of_study: null,
      additional_fields_of_study: [],
      degree: null,
      final_grade: null,
      notes: null,
    })
  }

  async onSubmit() {
    if (this.isSubmitting) {
      return
    }

    // sanitize values before validate
    if (!this.form.is_interim) {
      this.form.available_from = null
      this.form.daily_rate = null
      this.form.expenses_included = null
    }

    if (!this.form.is_permanent) {
      this.form.period_of_notice = null
      this.form.basic_salary = null
      this.form.bonus_eur = null
      this.form.is_business_car_included = null
      this.form.other_bonus = null
    }

    if (!this.form.is_blacklisted) {
      this.form.blacklisting_reason = null
    }

    // revalidate disabled inputs
    await Vue.nextTick()
    syncValidateObserverValues(this.$refs.formValidationObserver)

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
      let createOrUpdateFn = this.isCreating ? this.createCandidate : this.updateCandidate
      // store candidateId
      const ids = await createOrUpdateFn()
      this.candidateId = ids.candidateId
      this.personId = ids.personId
      // as we store candidate in 2 steps, mark that candidate was already created
      this.isCreating = false

      this.$store.commit('updateGenericModal', {
        text: 'Storing companies and profile image...',
        progress: Math.round(100 / 4),
      })
      // store additional relations (images and regions). This should be merged later into regular create/update mutations, when lighthouse supports it
      await this.updateCandidateAdditional()

      this.$store.commit('updateGenericModal', {
        text: 'Storing documents...',
        progress: Math.round((100 / 4) * 3),
      })
      // process documents changes
      await this.updateCandidateDocuments()
      this.$bus.hideGenericModal()

      // everything went good, clear store and navigate back to list overview
      this.$bus.showSuccessModal('Candidate was successfully ' + (this.isCreating ? 'created' : 'updated'), 3000)
      this.isSubmitting = false
      await this.$apollo.provider.defaultClient.clearStore()
      this.$router.push('/candidates/' + this.candidateId)
    } catch (err) {
      this.isSubmitting = false
      console.error(err)
      this.$bus.hideGenericModal()
      this.$bus.showErrorModal({
        errors: apolloParseErrors(err),
      })
    }
  }

  async createCandidate(): Promise<{ candidateId: number; personId: number }> {
    const variables: CreateCandidateMutationVariables = {
      input: this.generateInput(),
    }

    // process location
    if (this.form.location.autocompleteValue) {
      variables.input.location = {
        create: {
          ...generateLocationInput(this.form.location),
        },
      }
    }

    // process phonenumbers
    this.form.phonenumbers.forEach((formPhonenumber) => {
      if (!formPhonenumber.number) {
        return
      }
      variables.input.phonenumbers!.create!.push(generatePhonenumberInput(formPhonenumber))
    })

    const { data } = await this.$apollo.mutate<CreateCandidateMutation>({
      mutation: CreateCandidate,
      variables,
      context: {
        fetchOptions: {
          onUploadProgress: (progressEvent) => {
            this.$store.commit('updateGenericModal', {
              progress: Math.round(((100 / 4) * progressEvent.loaded) / progressEvent.total),
            })
          },
        },
      },
    })

    return {
      candidateId: data!.createCandidate!.id,
      personId: data!.createCandidate!.person.id,
    }
  }

  async updateCandidate(): Promise<{ candidateId: number; personId: number }> {
    if (!this.candidateId) {
      throw new Error("candidateId is empty, can't call updateConsultant()")
    }
    const variables: UpdateCandidateMutationVariables = {
      id: this.candidateId,
      input: this.generateInput(),
    }

    // process location changes
    if (this.form.location.autocompleteValue) {
      // autocomplete value exists
      if (this.form.location.id) {
        // if location ID is defined, update location
        variables.input.location = {
          update: {
            ...generateLocationInput(this.form.location),
            id: this.form.location.id,
          },
        }
      } else {
        // otherwise create new location
        variables.input.location = {
          create: {
            ...generateLocationInput(this.form.location),
          },
        }
      }
    } else {
      // autocomple value is empty
      if (this.form.location.id) {
        // if ID of location is present, delete this location
        variables.input.location = {
          delete: this.form.location.id,
        }
      }
    }

    // additional process for phonenumbers changes
    variables.input.phonenumbers!.update = []
    variables.input.phonenumbers!.delete = this.deletedPhonenumberIds
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

    const { data } = await this.$apollo.mutate<UpdateCandidateMutation>({
      mutation: UpdateCandidate,
      variables,
      context: {
        fetchOptions: {
          onUploadProgress: (progressEvent) => {
            this.$store.commit('updateGenericModal', {
              progress: Math.round(((100 / 4) * progressEvent.loaded) / progressEvent.total),
            })
          },
        },
      },
    })

    // clean up temporary arrays
    this.deletedPhonenumberIds = []

    return {
      candidateId: data!.updateCandidate!.id,
      personId: data!.updateCandidate!.person.id,
    }
  }

  async updateCandidateAdditional(): Promise<{ data?: UpdateCandidateAdditionalMutation }> {
    if (!this.candidateId) {
      throw new Error('this.candidateId is not set! Calling updateCandidateAdditional() is not allowed')
    }
    const variables: UpdateCandidateAdditionalMutationVariables = {
      id: this.candidateId,
      input: {
        companies: {
          sync: [],
        },
      },
    }

    // fill companies
    this.form.companies.forEach((formCompany) => {
      // if no consultancy was selected in autocomplete, ignore
      if (!formCompany.autocompleteValue) {
        return
      }
      variables.input.companies!.sync!.push({
        id: formCompany.pivot.id ? formCompany.pivot.id : null,
        company_id: formCompany.autocompleteValue.id,
        from: toISODate(formCompany.pivot.from),
        till: toISODate(formCompany.pivot.till),
        job_title: formCompany.pivot.job_title,
        job_level: formCompany.pivot.job_level,
        main_responsibilities: formCompany.mainResponsibilities.map((item) => item.title),
      })
    })

    const response = await this.$apollo.mutate({
      mutation: UpdateCandidateAdditional,
      variables,
      context: {
        fetchOptions: {
          onUploadProgress: (progressEvent) => {
            this.$store.commit('updateGenericModal', {
              progress: Math.round(100 / 4 + ((100 / 4) * progressEvent.loaded) / progressEvent.total),
            })
          },
        },
      },
    })

    return response
  }

  async updateCandidateDocuments(): Promise<{ data?: UpdateCandidateDocumentsMutation }> {
    if (!this.candidateId) {
      throw new Error('this.candidateId is not set! Calling updateCandidateDocuments() is not allowed')
    }
    const variables: UpdateCandidateDocumentsMutationVariables = {
      id: this.candidateId,
      input: this.form.documents.generateMutationInput(),
    }

    const response = await this.$apollo.mutate({
      mutation: UpdateCandidateDocuments,
      variables,
      context: {
        fetchOptions: {
          onUploadProgress: (progressEvent) => {
            this.$store.commit('updateGenericModal', {
              progress: Math.round((100 / 4) * 3 + ((100 / 4) * progressEvent.loaded) / progressEvent.total),
            })
          },
        },
      },
    })

    return response
  }

  deleteCandidate() {
    if (!this.candidateId) {
      this.$bus.showErrorModal({
        errors: ['Deletion of candidate is not possible, as candidate id is not specified.'],
      })
      return
    }
    this.$bus.showDeleteConfirmModal('Are you sure you want to delete this candidate?', () => {
      const variables: DeleteCandidateMutationVariables = {
        id: this.candidateId!,
      }
      this.$apollo
        .mutate({
          mutation: DeleteCandidate,
          variables,
        })
        .then(async () => {
          this.$bus.showSuccessModal('Candidate was successfully removed', 3000)
          await this.$apollo.provider.defaultClient.clearStore()
          this.$router.push('/candidates')
        })
        .catch((err) => {
          this.$bus.showErrorModal({
            errors: apolloParseErrors(err),
          })
        })
    })
  }

  private suggestExistingPerson() {
    if (
      !this.isCreating ||
      this.ignorePersonSuggestion ||
      !this.form.firstname ||
      !this.form.lastname ||
      !this.isEmployee
    ) {
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

  private generateInput() {
    const input: CreateCandidateMutationVariables['input'] = {
      person: {
        upsert: {
          title: this.form.title,
          firstname: this.form.firstname!,
          other_firstnames: this.form.other_firstnames,
          lastname: this.form.lastname!,
          birth_name: this.form.birth_name,
          gender: this.form.gender!,
          birthdate: toISODate(this.form.birthdate),
        },
      },
      email: this.form.email!,
      is_interim: this.form.is_interim,
      is_permanent: this.form.is_permanent,
      marital_status: this.form.marital_status,
      skype_name: this.form.skype_name,
      zoom_id: this.form.zoom_id,
      desired_job: this.form.desired_job,
      max_distance_from_home: this.form.max_distance_from_home,
      willing_to_travel: this.form.willing_to_travel ? parseInt(this.form.willing_to_travel) : null,
      available_from: toISODate(this.form.available_from),
      daily_rate: this.form.has_hourly_rate ? this.calculatedDailyRate : this.form.daily_rate,
      has_hourly_rate: this.form.has_hourly_rate,
      expenses_included: this.form.expenses_included,
      period_of_notice: this.form.period_of_notice,
      basic_salary: this.form.basic_salary,
      bonus_eur: this.form.bonus_eur,
      is_business_car_included: this.form.is_business_car_included,
      other_bonus: this.form.other_bonus,
      linked_in_profile: this.form.linked_in_profile,
      xing_profile: this.form.xing_profile,
      url: this.form.url,

      phonenumbers: {
        create: [],
      },
      nationalities: {
        sync: this.form.nationalities.map((nationality) => ({ id: nationality })),
      },
      languages: {
        sync: this.form.languages
          // if no language was selected in autocomplete, ignore this row
          .filter((language) => !!language.code)
          .map((language) => {
            return {
              id: language.code as string,
              level: language.level,
            }
          }),
      },
      industries: {
        sync: this.form.industries.map((industry) => {
          return industry.id
        }),
      },
      certifications: {
        sync: this.form.certifications.map((certification) => {
          return certification.id
        }),
      },
      it_skills: {
        sync: this.form.it_skills.map((certification) => {
          return certification.id
        }),
      },
      skills: {
        sync: this.form.skills.map((skill) => {
          return skill.id
        }),
      },
      educations: {
        sync: this.form.educations
          .filter((education) => {
            return !!education.institution
          })
          .map((education) => {
            return {
              institution_id: education.institution!.id,
              id: education.id,
              from: toISODate(education.from),
              till: toISODate(education.till),
              main_field_of_study: education.main_field_of_study,
              additional_fields_of_study: education.additional_fields_of_study.map((fos) => fos.title),
              degree: education.degree,
              final_grade: education.final_grade,
              notes: education.notes,
            }
          }),
      },
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

    if (this.isEmployee) {
      input.is_blacklisted = this.form.is_blacklisted
      input.blacklisting_reason = this.form.blacklisting_reason
      input.notes = this.form.notes
      input.is_research = this.form.is_research
    }

    return input
  }

  destroyed() {
    this.$bus.$off('ignorePersonSuggestion')
    this.$bus.$off('selectSuggestedPerson')
  }
}
</script>
