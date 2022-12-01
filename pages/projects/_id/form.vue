<template>
  <div class="container pt-5">
    <div class="flex w-full justify-start items-center mb-6 space-x-8">
      <nuxt-link :to="`/projects/${isCreating ? '' : $route.params.id}`" class="tbtn-icon tbtn--white">
        <IHChevronLeft class="w-6 h-6" />
      </nuxt-link>
      <h1>{{ isCreating ? 'Create' : 'Edit' }} Project</h1>
    </div>

    <ValidationObserver tag="form" @submit.prevent="onSubmit()" ref="formValidationObserver">
      <div class="grid gap-6 mb-6 grid-cols-1 xl:grid-cols-11">
        <div class="xl:col-span-7 2xl:col-span-7 flex flex-col space-y-6">
          <div class="card">
            <div class="card-header">
              <div>
                <h3>Project information</h3>
                <p class="mt-1 text-sm text-gray-500">Details and requirements of the project.</p>
              </div>
            </div>
            <div class="divide-y">
              <div class="space-y-6 p-6">
                <FInput v-model="form.title" label="Title" :rules="'required'" errorLabel="title" />

                <div class="flex space-x-4">
                  <FDatePicker
                    v-model="form.project_start"
                    class="w-full"
                    label="Project start"
                    :rules="'required'"
                    errorLabel="project start"
                  />
                  <FDatePicker v-model="form.project_end" class="w-full" label="Project end" />
                </div>

                <FInput
                  v-model="form.retain"
                  label="Retain"
                  :rules="'currency'"
                  errorLabel="bonus"
                  :asCurrency="true"
                />

                <FSelectIndustries v-model="form.industries" label="Industries" />

                <FSelectSkills v-model="form.skills" label="Skills" />

                <FSelectCertifications v-model="form.certifications" label="Certifications" />

                <FSelectItSkills v-model="form.it_skills" label="IT Skills" />
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
              <div class="p-6">
                <FTextarea v-model="form.notes" label="Notes" />
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <div class="flex items-center space-x-4">
                <IHCash class="w-6 h-6 text-gray-700" />
                <h3>Invoice Recipient</h3>
              </div>
            </div>
            <div class="space-y-6 p-6">
              <FInput v-model="form.ir_name" label="Name" />

              <FInput v-model="form.ir_email" label="Email" rules="email" />

              <FInput v-model="form.ir_phone" label="Phonenumber" />

              <FInput v-model="form.ir_address" label="Address" />

              <FInput v-model="form.ir_vat" label="VAT" />

              <FInput v-model="form.ir_po" label="PO" />
            </div>
          </div>
        </div>

        <div class="xl:col-span-4 2xl:col-span-4 flex flex-col space-y-6">
          <div class="card">
            <div class="card-header">
              <div class="flex items-center space-x-4">
                <IHUserCircle class="w-6 h-6 text-gray-700" />
                <h3>Client information</h3>
              </div>
              <div>
                <button
                  type="button"
                  class="tbtn tbtn-icon tbtn-icon--small tbtn--green"
                  @click="addEmptyClientRelation"
                >
                  <IPlus class="w-5 h-5"></IPlus>
                </button>
              </div>
            </div>
            <div class="divide-y">
              <div class="p-6">
                <FCompanyAutocomplete
                  v-model="form.company.autocompleteValue"
                  label="Company"
                  :allowCreating="true"
                  :rules="'required'"
                  errorLabel="company"
                />
              </div>
              <div class="space-x-6 p-6 flex" v-for="(formClient, index) in form.clients" :key="formClient.itemIndex">
                <div class="space-y-6 flex-auto">
                  <FClientAutocomplete
                    v-model="formClient.autocompleteValue"
                    label="Client"
                    :disabled="!form.company.autocompleteValue"
                    :companyId="form.company.autocompleteValue ? form.company.autocompleteValue.id : null"
                    :rules="'required'"
                    errorLabel="client"
                  />

                  <FCheckbox v-model="formClient.pivot.has_long_list_access" label="Has long list access" />
                </div>
                <button
                  type="button"
                  class="tbtn tbtn-icon tbtn-icon--small tbtn--red"
                  @click="form.clients.splice(index, 1)"
                >
                  <IMinus class="w-5 h-5"></IMinus>
                </button>
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
              <FCheckbox v-model="form.is_interim" label="Interim" />
              <FInput
                v-model="form.max_daily_rate"
                label="Max daily rate"
                :disabled="!form.is_interim"
                :asCurrency="true"
                :rules="'currency'"
                errorLabel="daily rate"
              />
              <FCheckbox v-model="form.expenses_included" label="Expenses included" :disabled="!form.is_interim" />
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
              <FCheckbox v-model="form.is_permanent" label="Permanent" />
              <FInput
                v-model="form.max_basic_salary"
                label="Max basic salary"
                :disabled="!form.is_permanent"
                :asCurrency="true"
                :rules="'currency'"
                errorLabel="basic salary"
              />
              <FInput
                v-model="form.max_bonus_eur"
                label="Max bonus "
                :disabled="!form.is_permanent"
                :asCurrency="true"
                :rules="'currency'"
                errorLabel="bonus"
              />
              <FCheckbox
                v-model="form.is_business_car_included"
                label="Business car included"
                :disabled="!form.is_permanent"
              />
              <FInput
                v-model="form.fee_structure"
                label="Fee structure"
                :asInteger="true"
                :disabled="!form.is_permanent"
                rules="numeric"
                errorLabel="fee structure"
              />
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

          <div class="card">
            <div class="card-header">
              <div class="flex items-center space-x-4">
                <IHUserGroup class="w-6 h-6 text-gray-700" />
                <h3>Consultants</h3>
              </div>
              <div>
                <button type="button" class="tbtn tbtn-icon tbtn-icon--small tbtn--green" @click="addEmptyUserRelation">
                  <IPlus class="w-5 h-5"></IPlus>
                </button>
              </div>
            </div>
            <div class="divide-y">
              <div class="flex space-x-6 p-6" v-for="(formUser, index) of form.users" :key="formUser.itemIndex">
                <div class="space-y-6 flex-auto">
                  <FUserAutocomplete v-model="formUser.autocompleteValue" label="Consultant"></FUserAutocomplete>
                  <div class="flex space-x-4">
                    <FInput
                      class="flex-auto"
                      v-model="formUser.pivot.role"
                      label="Role"
                      :rules="'required'"
                      rrorLabel="role"
                    />
                    <FInput
                      v-model="formUser.pivot.percent"
                      label="Percent"
                      class="w-[70px]"
                      :rules="'required|numeric'"
                      errorLabel="percent"
                    />
                  </div>
                </div>
                <button
                  class="tbtn tbtn-icon tbtn-icon--small tbtn--red"
                  type="button"
                  @click="form.users.splice(index, 1)"
                >
                  <IMinus class="w-5 h-5"></IMinus>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="form-action-buttons">
        <button class="tbtn tbtn--red mr-auto" v-if="!isCreating" type="button" @click="deleteProject">Delete</button>
        <nuxt-link to="." class="tbtn tbtn--white">Abort</nuxt-link>
        <button class="tbtn tbtn--blue">Save</button>
      </div>
    </ValidationObserver>
  </div>
</template>

<script lang="ts">
import { Component, Mutation, State, Vue } from 'nuxt-property-decorator'

import GetProject from '@/graphql/ressources/projects/GetProject.gql'
import CreateProject from '@/graphql/ressources/projects/CreateProject.gql'
import DeleteProject from '@/graphql/ressources/projects/DeleteProject.gql'
import UpdateProject from '@/graphql/ressources/projects/UpdateProject.gql'

import FCountryDialCodeAutocomplete from '@/components/admin/FCountryDialCodeAutocomplete.vue'
import { apolloParseErrors } from '~/helpers/apolloParseErrors'
import {
  CreateProjectMutation,
  CreateProjectMutationVariables,
  DeleteProjectMutationVariables,
  GetProjectQuery,
  GetUsersForAutocompleteQuery,
  Maybe,
  ProjectUserPivot,
  UpdateProjectMutation,
  UpdateProjectMutationVariables,
  UserRole,
  LanguageLevel,
  ClientProjectPivot,
} from '~/graphql/GQLTypes'
import { DateTime } from 'luxon'
import { ValidationObserver } from 'vee-validate'
import { syncValidateObserverValues, validateObserver } from '~/helpers/validationHelpers'
import FCompanyAutocomplete from '~/components/admin/FCompanyAutocomplete.vue'
import { DocumentsForm } from '~/helpers/fileUploadHelpers'
import FileIcon from '~/components/admin/FileIcon.vue'
import FUserAutocomplete from '~/components/admin/FUserAutocomplete.vue'
import FClientAutocomplete from '~/components/admin/FClientAutocomplete.vue'
import { ProjectState } from '~/store'
import { languageLevelOptions } from '~/helpers/languagesListEn'
import { IdWithTitle } from '~/helpers/types'
import { parseDateFromISO, toISODate } from '~/helpers/dateHelpers'
import IHChevronLeft from '~/components/globals/icons/heroicons/IHChevronLeft.vue'
import IHCash from '~/components/globals/icons/heroicons/IHCash.vue'
import IHUserCircle from '~/components/globals/icons/heroicons/IHUserCircle.vue'
import IHBriefcase from '~/components/globals/icons/heroicons/IHBriefcase.vue'
import IHFolder from '~/components/globals/icons/heroicons/IHFolder.vue'
import IHUserGroup from '~/components/globals/icons/heroicons/IHUserGroup.vue'

@Component({
  components: {
    IHUserGroup,
    IHFolder,
    IHBriefcase,
    IHUserCircle,
    IHCash,
    IHChevronLeft,
    FClientAutocomplete,
    FUserAutocomplete,
    FileIcon,
    FCompanyAutocomplete,
    FCountryDialCodeAutocomplete,
    ValidationObserver,
  },
  async asyncData({ app, route }) {
    const data: any = {
      isCreating: route.params.id === 'new',
      projectId: Number.parseInt(route.params.id),
      cloneFrom: route.query.cloneFrom ? Number.parseInt(route.query.cloneFrom as string) : null,
    }
    if (!data.isCreating || data.cloneFrom) {
      try {
        const res = await app.apolloProvider!.defaultClient.query<GetProjectQuery>({
          query: GetProject,
          variables: {
            id: !data.isCreating ? data.projectId : data.cloneFrom,
          },
        })
        data.loadedData = res.data.project
      } catch (e) {
        data.loadedData = null
      }
    }
    return data
  },
  head() {
    return {
      title: `${(this as ProjectsEdit).isCreating ? 'Create' : 'Edit'} project`,
    }
  },
  middleware: 'auth',
  meta: {
    requiredRole: UserRole.Employee,
  },
})
export default class ProjectsEdit extends Vue {
  $refs!: {
    profileImage: any
    formValidationObserver: InstanceType<typeof ValidationObserver>
    addDocumentsInput: HTMLInputElement
  }

  @State((state) => state.account.user)
  accountUser

  @State((state) => state.project.prefilledForCreation)
  prefilledForCreation!: ProjectState['prefilledForCreation']

  @Mutation('project/resetPrefilledForCreation')
  resetPrefilledForCreation

  isCreating = false

  form: {
    is_interim: boolean
    is_permanent: boolean
    title: Maybe<string>
    max_basic_salary: Maybe<number>
    max_bonus_eur: Maybe<number>
    is_business_car_included: Maybe<boolean>
    fee_structure: Maybe<number>
    max_daily_rate: Maybe<number>
    expenses_included: Maybe<boolean>
    retain: Maybe<number>
    project_start: Maybe<Date>
    project_end: Maybe<Date>
    notes: Maybe<string>
    ir_name: Maybe<string>
    ir_email: Maybe<string>
    ir_phone: Maybe<string>
    ir_vat: Maybe<string>
    ir_po: Maybe<string>
    ir_address: Maybe<string>

    clients: Array<{
      itemIndex: number
      autocompleteValue: Maybe<NonNullable<GetProjectQuery['project']>['clients'][0]>
      pivot: Pick<ClientProjectPivot, 'has_long_list_access'>
    }>
    company: {
      autocompleteValue: Maybe<NonNullable<GetProjectQuery['project']>['company']>
    }
    documents: DocumentsForm
    industries: IdWithTitle[]
    certifications: IdWithTitle[]
    it_skills: IdWithTitle[]
    skills: IdWithTitle[]
    users: Array<{
      itemIndex: number
      autocompleteValue: Maybe<NonNullable<GetUsersForAutocompleteQuery['users']>['data'][0]>
      pivot: Pick<ProjectUserPivot, 'role' | 'percent'>
    }>
    languages: Array<{
      itemIndex: number
      code: Maybe<string>
      level: Maybe<LanguageLevel>
    }>
  } = {
    is_interim: false,
    is_permanent: false,
    title: null,
    max_basic_salary: null,
    max_bonus_eur: null,
    is_business_car_included: null,
    fee_structure: null,
    max_daily_rate: null,
    expenses_included: null,
    retain: null,
    project_start: new Date(),
    project_end: null,
    notes: null,
    ir_name: null,
    ir_email: null,
    ir_phone: null,
    ir_vat: null,
    ir_po: null,
    ir_address: null,

    clients: [],
    company: {
      autocompleteValue: null,
    },
    documents: new DocumentsForm(),
    industries: [],
    certifications: [],
    it_skills: [],
    skills: [],
    users: [],
    languages: [],
  }

  projectStatusOptions: any = {}
  languageLevelOptions = languageLevelOptions

  loadedData!: Maybe<GetProjectQuery['project']>
  private incrementalIndex = 0
  private projectId: number | null = null
  private cloneFrom: number | null = null

  private isSubmitting = false

  created() {
    // redirect to overview, if queried id was not found
    if (!this.isCreating && !this.loadedData) {
      this.$router.push('/projects')
      return
    }

    // fill startup data when creating
    if (this.isCreating) {
      this.form.users.push({
        itemIndex: this.incrementalIndex++,
        autocompleteValue: {
          id: this.accountUser.id,
          firstname: this.accountUser.firstname,
          lastname: this.accountUser.lastname,
        },
        pivot: {
          role: 'Acquisition & Research',
          percent: 100,
        },
      })

      if (this.prefilledForCreation.client) {
        this.form.clients.push({
          itemIndex: this.incrementalIndex++,
          autocompleteValue: {
            id: this.prefilledForCreation.client.id,
            person: this.prefilledForCreation.client.person,
          },
          pivot: {
            has_long_list_access: false,
          },
        })
      }

      if (this.prefilledForCreation.company) {
        this.form.company.autocompleteValue = {
          id: this.prefilledForCreation.company.id,
          name: this.prefilledForCreation.company.name,
        }
      }

      this.resetPrefilledForCreation()
    }

    // fill data, when editing or creating a clone
    if (this.loadedData) {
      this.form.is_interim = this.loadedData.is_interim
      this.form.is_permanent = this.loadedData.is_permanent
      this.form.title = this.loadedData.title
      this.form.max_basic_salary = this.loadedData.max_basic_salary!
      this.form.max_bonus_eur = this.loadedData.max_bonus_eur!
      this.form.is_business_car_included = this.loadedData.is_business_car_included!
      this.form.fee_structure = this.loadedData.fee_structure!
      this.form.max_daily_rate = this.loadedData.max_daily_rate!
      this.form.expenses_included = this.loadedData.expenses_included!
      this.form.retain = this.loadedData.retain!
      this.form.project_start = parseDateFromISO(this.loadedData.project_start)
      this.form.project_end = parseDateFromISO(this.loadedData.project_end)
      this.form.notes = this.loadedData.notes!
      this.form.ir_name = this.loadedData.ir_name!
      this.form.ir_email = this.loadedData.ir_email!
      this.form.ir_phone = this.loadedData.ir_phone!
      this.form.ir_vat = this.loadedData.ir_vat!
      this.form.ir_po = this.loadedData.ir_po!
      this.form.ir_address = this.loadedData.ir_address!

      this.form.industries = this.loadedData.industries
      this.form.skills = this.loadedData.skills
      this.form.certifications = this.loadedData.certifications
      this.form.it_skills = this.loadedData.it_skills

      this.form.users = []
      this.loadedData.users.forEach((user) => {
        this.form.users.push({
          itemIndex: this.incrementalIndex++,
          autocompleteValue: {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
          },
          pivot: {
            role: user.pivot!.role,
            percent: user.pivot!.percent,
          },
        })
      })

      this.form.clients = []
      this.loadedData.clients.forEach((client) => {
        this.form.clients.push({
          itemIndex: this.incrementalIndex++,
          autocompleteValue: {
            id: client.id,
            person: client.person,
          },
          pivot: {
            has_long_list_access: client.client_project_pivot!.has_long_list_access,
          },
        })
      })

      this.loadedData.languages.forEach((language) => {
        this.form.languages.push({
          itemIndex: this.incrementalIndex++,
          code: language.code,
          level: language.language_pivot!.level!,
        })
      })

      this.form.company.autocompleteValue = this.loadedData.company

      if (!this.isCreating) {
        this.loadedData.documents.forEach((document) => {
          this.form.documents.add({
            id: document.id,
            title: document.title,
            mime_type: document.mime_type,
            tags: document.tags,
          })
        })
      } else {
        this.form.title += ' Copy'
      }
    }
  }

  addEmptyLanguage() {
    this.form.languages.unshift({
      itemIndex: this.incrementalIndex++,
      code: null,
      level: null,
    })
  }

  addEmptyUserRelation() {
    this.form.users.unshift({
      itemIndex: this.incrementalIndex++,
      pivot: {
        role: 'Research',
        percent: 0,
      },
      autocompleteValue: null,
    })
  }

  addEmptyClientRelation() {
    this.form.clients.unshift({
      itemIndex: this.incrementalIndex++,
      pivot: {
        has_long_list_access: false,
      },
      autocompleteValue: null,
    })
  }

  async onSubmit() {
    if (this.isSubmitting) {
      return
    }

    // sanitize values before validate
    if (!this.form.is_interim) {
      this.form.max_daily_rate = null
      this.form.expenses_included = null
    }

    if (!this.form.is_permanent) {
      this.form.max_basic_salary = null
      this.form.max_bonus_eur = null
      this.form.is_business_car_included = null
      this.form.fee_structure = null
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
      let createOrUpdateFn = this.isCreating ? this.createProject : this.updateProject
      // store projectId
      this.projectId = await createOrUpdateFn()
      // as we store project in 2 steps, mark that project was already created
      this.isCreating = false

      this.$bus.hideGenericModal()

      // everything went good, clear store and navigate back to list overview
      this.$bus.showSuccessModal('Project was successfully ' + (this.isCreating ? 'created' : 'updated'), 3000)
      this.isSubmitting = false
      await this.$apollo.provider.defaultClient.clearStore()
      this.$router.push('/projects/' + this.projectId)
    } catch (err) {
      this.isSubmitting = false
      console.error(err)
      this.$bus.hideGenericModal()
      this.$bus.showErrorModal({
        errors: apolloParseErrors(err),
      })
    }
  }

  generateInput(): CreateProjectMutationVariables {
    return {
      input: {
        is_interim: this.form.is_interim,
        is_permanent: this.form.is_permanent,
        title: this.form.title!,
        max_basic_salary: this.form.max_basic_salary,
        max_bonus_eur: this.form.max_bonus_eur,
        is_business_car_included: this.form.is_business_car_included,
        fee_structure: this.form.fee_structure,
        max_daily_rate: this.form.max_daily_rate,
        expenses_included: this.form.expenses_included,
        retain: this.form.retain,
        project_start: toISODate(this.form.project_start) ?? DateTime.local().toISODate(),
        project_end: toISODate(this.form.project_end),
        notes: this.form.notes,
        ir_name: this.form.ir_name,
        ir_email: this.form.ir_email,
        ir_phone: this.form.ir_phone,
        ir_vat: this.form.ir_vat,
        ir_po: this.form.ir_po,
        ir_address: this.form.ir_address,
        clients: {
          sync: this.form.clients
            .filter((formClient) => formClient.autocompleteValue)
            .map((formClient) => {
              return {
                id: formClient.autocompleteValue!.id,
                has_long_list_access: formClient.pivot.has_long_list_access,
              }
            }),
        },
        users: {
          sync: this.form.users
            .filter((formUser) => formUser.autocompleteValue)
            .map((formUser) => {
              return {
                id: formUser.autocompleteValue!.id!,
                role: formUser.pivot.role,
                percent: parseFloat(formUser.pivot.percent as any),
              }
            }),
        },
        company_id: this.form.company.autocompleteValue!.id,
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
        documents: this.form.documents.generateMutationInput(),
      },
    }
  }

  async createProject(): Promise<number> {
    const { data } = await this.$apollo.mutate<CreateProjectMutation>({
      mutation: CreateProject,
      variables: this.generateInput(),
      context: {
        fetchOptions: {
          onUploadProgress: (progressEvent) => {
            this.$store.commit('updateGenericModal', {
              progress: Math.round(progressEvent.loaded / progressEvent.total) * 100,
            })
          },
        },
      },
    })

    return data!.createProject!.id
  }

  async updateProject(): Promise<number> {
    if (!this.projectId) {
      throw new Error("projectId is empty, can't call updateConsultant()")
    }
    const variables: UpdateProjectMutationVariables = {
      ...this.generateInput(),
      id: this.projectId,
    }

    const { data } = await this.$apollo.mutate<UpdateProjectMutation>({
      mutation: UpdateProject,
      variables,
      context: {
        fetchOptions: {
          onUploadProgress: (progressEvent) => {
            this.$store.commit('updateGenericModal', {
              progress: Math.round(progressEvent.loaded / progressEvent.total) * 100,
            })
          },
        },
      },
    })

    return data!.updateProject!.id
  }

  deleteProject() {
    if (!this.projectId) {
      this.$bus.showErrorModal({
        errors: ['Deletion of project is not possible, as project id is not specified.'],
      })
      return
    }
    this.$bus.showDeleteConfirmModal('Are you sure you want to delete this project?', () => {
      const variables: DeleteProjectMutationVariables = {
        id: this.projectId!,
      }
      this.$apollo
        .mutate({
          mutation: DeleteProject,
          variables,
        })
        .then(async () => {
          this.$bus.showSuccessModal('Project was successfully removed', 3000)
          await this.$apollo.provider.defaultClient.clearStore()
          this.$router.push('/projects')
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
