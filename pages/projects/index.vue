<template>
  <div class="container pt-5">
    <PageHeader
      :are-filters-expanded="areFiltersExpanded"
      item-title="projects"
      item-type="project"
      @fetch="fetchProjects()"
      @clear="clearFilters()"
      @toggle-filters="areFiltersExpanded = !areFiltersExpanded"
    >
      <template v-slot:search-form>
        <div class="page-header-main-filters">
          <FInput class="flex-auto" v-model="form.title" label="Search" @input="onTitleChanged" />
        </div>
      </template>
      <template v-slot:slide-filters>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-6">
          <FUserAutocomplete class="md:col-span-2" v-model="form.user_autocomplete" label="Consultant" />
          <!--          <FCheckbox class="md:col-span-2" v-model="form.only_my_projects" label="Only my projects" />-->

          <FMultiselect
            v-model="form.statuses"
            label="Statuses"
            :options="projectStatusOptions"
            :isSingle="false"
            :isTaggable="false"
          />

          <FCheckbox class="flex flex-col justify-center" v-model="form.with_archived" label="With archived" />

          <FSelectIndustries v-model="form.industries" label="Industries" />
          <FSelectSkills v-model="form.skills" label="Skills" />
          <FDatePicker
            class="col-span-2"
            :value="{
              start: form.project_start_from,
              end: form.project_start_till,
            }"
            @input="
              (value) => {
                ;(form.project_start_from = value.start), (form.project_start_till = value.end)
              }
            "
            :is-range="true"
            label="Project start"
            errorLabel="project start"
          />

          <FInput v-model="form.daily_rate_min" label="Daily Rate MIN" :as-integer="true" />
          <FInput v-model="form.daily_rate_max" label="Daily Rate MAX" :as-integer="true" />
          <FInput v-model="form.salary_package_min" label="Salary Package MIN" :as-integer="true" />
          <FInput v-model="form.salary_package_max" label="Salary Package MAX" :as-integer="true" />
        </div>
      </template>
    </PageHeader>

    <TableWithSelectableColumns
      :action-buttons="actionButtons"
      :selected-rows="selectedProjectsIDs"
      :row-selection-is-active="true"
      :items="projectItems"
      :paginator-info="paginatorInfo"
      :available-columns="availableColumns"
      :default-selected-columns="defaultSelectedColumns"
      item-title="projects"
      item-type="project"
      @fetch="fetchProjects($event)"
      @rows-change="changeRows"
      @cancel-selection="cancelSelection"
    />

    <AddToBucketModal />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { debounce } from 'lodash'
import {
  Gender,
  GetProjectsQuery,
  GetUsersForAutocompleteQuery,
  Maybe,
  ProjectStatus,
  UserRole,
} from '~/graphql/GQLTypes'
import { State } from '~/node_modules/nuxt-property-decorator'
import AddToBucketModal from '~/components/admin/AddToBucketModal.vue'
import { ProjectsFilterForm } from '~/store'
import { apolloParseErrors } from '~/helpers/apolloParseErrors'
import IHCollection from '~/components/globals/icons/heroicons/IHCollection.vue'
import jump from 'jump.js'
import { statusTextColor } from '~/helpers/projectHelpers'
import PageHeader from '~/components/pages/PageHeader.vue'
import TableWithSelectableColumns, { ColumnsDefinition } from '~/components/pages/TableWithSelectableColumns.vue'
import { DateTime } from 'luxon'
import { parseDateFromISO, toISODate } from '~/helpers/dateHelpers'
import FUserAutocomplete from '~/components/admin/FUserAutocomplete.vue'
import { SimpleMultiselectOption } from '~/helpers/types'
import { t_de } from '~/helpers/i18n'
import formatSnakeCaseString from '~/helpers/formatSnakeCaseString'

const defaultStartValue = DateTime.local().minus({ days: 7 }).toJSDate()
const defaultEndValue = new Date()

@Component({
  components: {
    FUserAutocomplete,
    TableWithSelectableColumns,
    PageHeader,
    IHCollection,
    AddToBucketModal,
  },
  async asyncData({ store }) {
    if (store.state.project.projectsOverviewFilters.user_autocomplete === undefined) {
      store.commit('project/setProjectsOverviewFilters', {
        ...store.state.project.projectsOverviewFilters,
        user_autocomplete: {
          id: store.state.account.user.id,
          firstname: store.state.account.user.firstname,
          lastname: store.state.account.user.lastname,
        },
      })
    }

    const { data } = await store.dispatch('project/fetchProjects')
    return {
      projectItems: data.projects ? data.projects.data : null,
      paginatorInfo: data.projects ? data.projects.paginatorInfo : null,
    }
  },
  head() {
    return {
      title: 'Projects overview',
    }
  },
  middleware: 'auth',
  meta: {
    requiredRole: UserRole.Employee,
  },
})
export default class Projects extends Vue {
  $refs!: {
    gridWrapper: HTMLDivElement
  }

  projectItems: NonNullable<GetProjectsQuery['projects']>['data'] = []
  paginatorInfo: Maybe<NonNullable<GetProjectsQuery['projects']>['paginatorInfo']> = null
  publicUrl = this.$config.publicUrl

  areFiltersExpanded = false

  form: ProjectsFilterForm = {
    ...this.$store.state.project.projectsOverviewFilters,
  }

  projectStatusOptions: SimpleMultiselectOption[] = []

  // this function is defined in mounted, to be able to use debounce and stay in right context
  onTitleChanged = () => {}

  created() {
    Object.values(ProjectStatus).forEach((item) => {
      this.projectStatusOptions.push({
        id: item,
        title: formatSnakeCaseString(item),
      })
    })

    // check if filters have to be expanded
    if (
      this.form.with_archived ||
      this.form.daily_rate_min ||
      this.form.daily_rate_max ||
      this.form.salary_package_min ||
      this.form.salary_package_max ||
      this.form.project_start_from ||
      this.form.project_start_till ||
      this.form.industries.length > 0 ||
      this.form.skills.length > 0
    ) {
      this.areFiltersExpanded = true
    }
  }

  availableColumns: ColumnsDefinition = {
    title: {
      title: 'Title',
      component: 'ProjectTitle',
      required: true,
    },
    company: {
      title: 'Company',
      component: 'ProjectsCompany',
    },
    clients: {
      title: 'Clients',
      component: 'Clients',
    },
    status: {
      title: 'Status',
      component: 'Status',
    },
    candidates: {
      title: 'Candidates',
      component: 'Candidates',
    },
    users: {
      title: 'Consultants',
      component: 'ProjectUsers',
    },
  }

  defaultSelectedColumns = ['company']

  selectedProjectsIDs: any = []

  get actionButtons() {
    return {
      add_to_bucket: {
        button: {
          class: 'hover:text-blue-700 hover:bg-blue-100',
          text: 'Add to bucket',
          icon: 'IHCollection',
          iconClass: '',
        },
        isAvailable: this.selectedProjectsIDs.length > 0,
        callback: () => {
          this.submitToBucket()
        },
      },
    }
  }

  mounted() {
    this.onTitleChanged = debounce(() => {
      if (this.areFiltersExpanded) {
        return
      }
      this.fetchProjects()
    }, 400)
  }

  clearFilters() {
    this.form.title = null
    this.form.user_autocomplete = null
    this.form.with_archived = false
    this.form.daily_rate_min = null
    this.form.daily_rate_max = null
    this.form.salary_package_min = null
    this.form.salary_package_max = null
    this.form.project_start_from = null
    this.form.project_start_till = null
    this.form.industries = []
    this.form.skills = []
    this.fetchProjects()
  }

  private fetchProjects(page?: number) {
    this.paginatorInfo = null

    this.$store.commit('project/setProjectsOverviewFilters', {
      ...this.form,
      project_start_from: toISODate(this.form.project_start_from),
      project_start_till: toISODate(this.form.project_start_till),
      page: page ? page : 1,
    })

    this.$store
      .dispatch('project/fetchProjects')
      .then(({ data }) => {
        if (data.projects) {
          this.projectItems = data.projects.data
          this.paginatorInfo = data.projects.paginatorInfo
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
    this.selectedProjectsIDs = []
  }
  changeRows(value: { isChecked: boolean; id: string }) {
    if (value.isChecked) {
      this.selectedProjectsIDs.push(value.id)
    } else {
      this.selectedProjectsIDs.splice(this.selectedProjectsIDs.indexOf(value.id), 1)
    }
  }

  submitToBucket() {
    this.$bus.openAddToBucketFormModal('Projects', 'project', this.selectedProjectsIDs)
  }
}
</script>
