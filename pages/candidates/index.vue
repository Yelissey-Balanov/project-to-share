<template>
  <div class="container pt-5">
    <PageHeader
      :are-filters-expanded="areFiltersExpanded"
      item-title="candidates"
      item-type="candidate"
      @fetch="fetchCandidates()"
      @clear="clearFilters()"
      @toggle-filters="areFiltersExpanded = !areFiltersExpanded"
    >
      <template v-slot:search-form>
        <div class="page-header-main-filters">
          <FInput class="flex-auto" v-model="form.firstname" label="Firstname" @input="onNameChanged" />
          <FInput class="flex-auto" v-model="form.lastname" label="Lastname" @input="onNameChanged" />
        </div>
      </template>
      <template v-slot:slide-filters>
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FSelectIndustries v-model="form.industries" label="Industries" />
            <FSelectSkills v-model="form.skills" label="Skills" />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FSelectCertifications v-model="form.certifications" label="Certifications" />
            <FSelectItSkills v-model="form.it_skills" label="IT Skills" />
          </div>

          <div class="box-of-grouped-fields">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <FCheckbox v-model="form.is_interim" label="Interim" />
              <FDatePicker
                v-model="form.available_from"
                label="Available from"
                :disabled="!form.is_interim"
                :key="'available_from'"
              />
              <FInput
                v-model="form.daily_rate_max"
                label="Daily rate maximum"
                :disabled="!form.is_interim"
                :asCurrency="true"
                :rules="'currency'"
                errorLabel="daily rate maximum"
              />
            </div>
          </div>

          <div class="box-of-grouped-fields">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <FCheckbox v-model="form.is_permanent" label="Permanent" />
              <FDatePicker
                v-model="form.available_from"
                label="Available from"
                :disabled="!form.is_permanent"
                :key="'available_from'"
              />
              <FInput
                v-model="form.salary_package_max"
                label="Salary package maximum"
                :asCurrency="true"
                :disabled="!form.is_permanent"
                :rules="'currency'"
                errorLabel="salary package maximum"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FMultiselect label="Keywords search" v-model="form.keywords_search" />
            <div class="flex space-x-4">
              <FLocationAutocomplete class="flex-auto" v-model="form.location.autocompleteValue" label="Location" />
              <FInput class="w-[100px]" v-model="form.location_radius" label="Radius (km)" :as-integer="true" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FSelectLanguage v-model="form.languages" :isSingle="false" label="Languages" />
            <FSelectJobLevel v-model="form.job_levels" :isSingle="false" label="Job levels" />
          </div>
        </div>
      </template>
    </PageHeader>
    <TableWithSelectableColumns
      :action-buttons="actionButtons"
      :selected-rows="selectedCandidatesIDs"
      :row-selection-is-active="true"
      :items="candidateItems"
      :paginator-info="paginatorInfo"
      :available-columns="availableColumns"
      :row-actions="rowActions"
      :default-selected-columns="defaultSelectedColumns"
      :custom-row-bg="customRowBg"
      item-title="candidates"
      item-type="candidate"
      @fetch="fetchCandidates($event)"
      @rows-change="changeRows"
      @cancel-selection="cancelSelection"
    />
    <AddToBucketModal />
    <AddEventModal />
    <client-only>
      <SweetModal ref="modalAddToProject" title="Add candidates to project">
        <ValidationObserver
          tag="form"
          @submit.prevent="onAddToProjectSubmit()"
          ref="addToProjectValidationObserver"
          class="space-y-6"
        >
          <div class="grid grid-cols-1 md:grid-cols-1 gap-4">
            <FActiveProjectAutocomplete
              v-model="selectedProject"
              label="Project"
              :rules="'required'"
              errorLabel="project"
              :projects="projectsForLonglist"
            />
          </div>

          <p class="text-gray-600 pb-32">
            NOTE: Autocomplete contains only suitable projects for candidates. E.g. if candidates work just as interim,
            only projects that requires interim are showed! If candidates are already in longlist, project will not be
            listed!
          </p>

          <div class="form-action-buttons mt-0 mb-0">
            <button type="submit" class="tbtn tbtn--blue">
              <template v-if="!isSubmittingAddToProject"> Add to longlist</template>
              <template v-else> Adding to longlist...</template>
            </button>
          </div>
        </ValidationObserver>
      </SweetModal>
    </client-only>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { debounce, bind } from 'lodash'
import {
  AddCandidatesToProjectMutation,
  AddCandidatesToProjectMutationVariables,
  GetCandidatesQuery,
  GetProjectsForAutocompleteOnAddingToProjectQuery,
  GetProjectsForAutocompleteOnAddingToProjectQueryVariables,
  Maybe,
  UserRole,
} from '~/graphql/GQLTypes'
import { apolloParseErrors } from '~/helpers/apolloParseErrors'
import { State } from '~/node_modules/nuxt-property-decorator'
import AddToBucketModal from '~/components/admin/AddToBucketModal.vue'
import { CandidatesFilterForm } from '~/store'
import PageHeader from '~/components/pages/PageHeader.vue'
import TableWithSelectableColumns, {
  ColumnsDefinition,
  RowActionDefinition,
} from '~/components/pages/TableWithSelectableColumns.vue'
import FSelectJobLevel from '~/components/globals/form/FSelectJobLevel.vue'
import AddCandidatesToProject from '~/graphql/ressources/candidates/AddCandidatesToProject.gql'
import GetProjectsForAutocompleteOnAddingToProject from '~/graphql/ressources/projects/GetProjectsForAutocompleteOnAddingToProject.gql'
import { ValidationObserver } from 'vee-validate'
import { validateObserver } from '~/helpers/validationHelpers'
import FActiveProjectAutocomplete from '~/components/admin/FActiveProjectAutocomplete.vue'
import AddEventModal from '~/components/admin/AddEventModal.vue'
import AddEventButton from '~/components/pages/rowActions/AddEventButton.vue'

@Component({
  components: {
    AddEventModal,
    FActiveProjectAutocomplete,
    FSelectJobLevel,
    TableWithSelectableColumns,
    PageHeader,
    AddToBucketModal,
    ValidationObserver,
  },
  async asyncData({ app, store }) {
    const { data } = await store.dispatch('candidate/fetchCandidates')
    return {
      candidateItems: data.candidates ? data.candidates.data : null,
      paginatorInfo: data.candidates ? data.candidates.paginatorInfo : null,
    }
  },
  head() {
    return {
      title: 'Candidates overview',
    }
  },
  middleware: 'auth',
  meta: {
    requiredRole: UserRole.Employee,
  },
})
export default class Candidates extends Vue {
  $refs!: {
    modalAddToProject: any
    addToProjectValidationObserver: InstanceType<typeof ValidationObserver>
  }

  candidateItems: NonNullable<GetCandidatesQuery['candidates']>['data'] = []
  paginatorInfo: Maybe<NonNullable<GetCandidatesQuery['candidates']>['paginatorInfo']> = null
  publicUrl = this.$config.publicUrl

  areFiltersExpanded = false

  projectsForLonglist: GetProjectsForAutocompleteOnAddingToProjectQuery['allProjects'] = []
  selectedProject: Maybe<GetProjectsForAutocompleteOnAddingToProjectQuery['allProjects'][0]> = null
  isSubmittingAddToProject = false

  form: CandidatesFilterForm = {
    ...this.$store.state.candidate.candidatesOverviewFilters,
    keywords_search: Array.from(this.$store.state.candidate.candidatesOverviewFilters.keywords_search),
    location: { ...this.$store.state.candidate.candidatesOverviewFilters.location },
  }

  // this function is defined in mounted, to be able to use debounce and stay in right context
  onNameChanged = () => {}

  created() {
    // check if filters have to be expanded
    if (
      this.form.is_interim ||
      this.form.available_from ||
      this.form.daily_rate_max ||
      this.form.is_permanent ||
      this.form.salary_package_max ||
      this.form.location.label ||
      this.form.location.autocompleteValue ||
      this.form.languages.length > 0 ||
      this.form.job_levels.length > 0 ||
      this.form.keywords_search.length > 0 ||
      this.form.industries.length > 0 ||
      this.form.certifications.length > 0 ||
      this.form.it_skills.length > 0 ||
      this.form.skills.length > 0
    ) {
      this.areFiltersExpanded = true
    }
  }

  availableColumns: ColumnsDefinition = {
    name_with_photo: {
      title: 'Name',
      component: 'CandidateNameWithPhoto',
      required: true,
    },
    company: {
      title: 'Position',
      component: 'CandidatesCompany',
    },
    birthdate: {
      title: 'Birthdate',
      component: 'Birthdate',
    },
    email: {
      title: 'Email',
      component: 'Email',
    },
    location: {
      title: 'Location',
      component: 'Location',
    },
    industries: {
      title: 'Industries',
      component: 'Industries',
    },
    skills: {
      title: 'Skills',
      component: 'Skills',
    },
    salary: {
      title: 'Salary',
      component: 'Salary',
    },
    daily_rate: {
      title: 'Daily Rate',
      component: 'DailyRate',
    },
    phone: {
      title: 'Phone number',
      component: 'PhoneNumber',
    },
    // last_contact: {
    //   title: 'Last contact',
    //   component: 'LastContact',
    // },
    has_stella_account: {
      title: 'Has stella account',
      component: 'HasStellaAccount',
    },
    list_of_cv: {
      title: 'List of CV documents',
      component: 'ListOfCV',
    },
  }

  get rowActions(): RowActionDefinition[] {
    return [
      {
        component: AddEventButton,
        callback: (candidate) => {
          this.$bus.openEventFormModal(candidate, null)
        },
      },
    ]
  }

  defaultSelectedColumns = ['company']

  selectedCandidatesIDs: any = []

  customRowBg = (candidateRow: NonNullable<GetCandidatesQuery['candidates']>['data'][0]) => {
    if (candidateRow.is_blacklisted) {
      return 'bg-red-50'
    } else if (
      candidateRow.caution
      // || candidateRow.offset // todo: <-- this comes later, include it when it becomes available
    ) {
      return 'bg-yellow-50'
    }
    return 'bg-white'
  }

  get actionButtons() {
    return {
      add_candidates_to_project: {
        button: {
          class: 'hover:text-green-700 hover:bg-green-100',
          text: 'Add to project',
          icon: 'IHUserAdd',
          iconClass: '',
        },
        isAvailable: this.selectedCandidatesIDs.length > 0,
        callback: () => {
          this.addToProject()
        },
      },
      add_to_bucket: {
        button: {
          class: 'hover:text-blue-700 hover:bg-blue-100',
          text: 'Add to bucket',
          icon: 'IHCollection',
          iconClass: '',
        },
        isAvailable: this.selectedCandidatesIDs.length > 0,
        callback: () => {
          this.submitToBucket()
        },
      },
    }
  }

  mounted() {
    this.onNameChanged = debounce(() => {
      if (this.areFiltersExpanded) {
        return
      }
      this.fetchCandidates()
    }, 400)

    // get projects for autocomplete
    this.$apollo
      .query<GetProjectsForAutocompleteOnAddingToProjectQuery>({
        query: GetProjectsForAutocompleteOnAddingToProject,
      })
      .then(({ data }) => {
        this.projectsForLonglist = data.allProjects
      })
  }

  clearFilters() {
    this.form.firstname = null
    this.form.lastname = null
    this.form.is_interim = false
    this.form.available_from = null
    this.form.daily_rate_max = null
    this.form.is_permanent = false
    this.form.salary_package_max = null
    this.form.location.label = null
    this.form.location.autocompleteValue = null
    this.form.location_radius = 100
    this.form.languages = []
    this.form.job_levels = []
    this.form.keywords_search = []
    this.form.industries = []
    this.form.certifications = []
    this.form.it_skills = []
    this.form.skills = []
    this.fetchCandidates()
  }

  private fetchCandidates(page?: number) {
    this.paginatorInfo = null

    this.$store.commit('candidate/setCandidatesOverviewFilters', {
      ...this.form,
      page: page ? page : 1,
    })

    this.$store
      .dispatch('candidate/fetchCandidates')
      .then(({ data }) => {
        if (data.candidates) {
          this.candidateItems = data.candidates.data
          this.paginatorInfo = data.candidates.paginatorInfo
        } else {
          console.error('oh oh oh, implement it!')
        }
      })
      .catch((err) => {
        this.$bus.showErrorModal({
          errors: apolloParseErrors(err),
        })
      })
  }

  cancelSelection() {
    this.selectedCandidatesIDs = []
  }
  changeRows(value: { isChecked: boolean; id: string }) {
    if (value.isChecked) {
      this.selectedCandidatesIDs.push(value.id)
    } else {
      this.selectedCandidatesIDs.splice(this.selectedCandidatesIDs.indexOf(value.id), 1)
    }
  }

  submitToBucket() {
    this.$bus.openAddToBucketFormModal('Candidates', 'candidate', this.selectedCandidatesIDs, () =>
      this.cancelSelection()
    )
  }

  addToProject() {
    // reset selected project
    this.selectedProject = null

    // open modal
    this.$refs.modalAddToProject.open()
  }

  async onAddToProjectSubmit() {
    if (this.isSubmittingAddToProject) {
      return
    }

    if (!(await validateObserver(this.$refs.addToProjectValidationObserver))) {
      return
    }

    this.isSubmittingAddToProject = true
    this.$apollo
      .mutate<AddCandidatesToProjectMutation>({
        mutation: AddCandidatesToProject,
        variables: {
          projectId: this.selectedProject!.id,
          candidateIds: this.selectedCandidatesIDs,
        } as AddCandidatesToProjectMutationVariables,
      })
      .then(({ data }) => {
        this.isSubmittingAddToProject = false
        this.$apollo.provider.defaultClient.clearStore()
        this.$refs.modalAddToProject.close()
        this.$bus.showSuccessModal(
          `Candidates were successfully added to longlist of ${this.selectedProject!.title}`,
          3000
        )
        this.cancelSelection()
      })
      .catch((err) => {
        this.isSubmittingAddToProject = false
        this.$bus.showErrorModal({
          errors: apolloParseErrors(err),
        })
      })
  }
}
</script>
