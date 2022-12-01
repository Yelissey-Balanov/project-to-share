<template>
  <div v-if="bucket" class="container pt-5">
    <div class="flex w-full justify-between items-center mb-6 space-x-8">
      <nuxt-link to="/clients" class="tbtn-icon tbtn--white">
        <IHChevronLeft class="w-6 h-6" />
      </nuxt-link>

      <h1>
        {{ bucket.title }}
      </h1>

      <div class="flex items-center space-x-2">
        <button
          type="button"
          class="tbtn-icon tbtn--blue"
          @click="openExportModal"
          v-tooltip="{ content: 'Export' }"
          v-if="isEmployee"
        >
          <IUpload class="w-6 h-6" />
        </button>
        <button
          type="button"
          class="tbtn-icon tbtn--blue"
          @click="copyBucket"
          v-tooltip="{ content: `Create ${!isOwner ? 'my own' : ''} copy` }"
        >
          <IHDuplicate class="w-6 h-6" />
        </button>
        <nuxt-link
          :to="`/buckets/${bucket.id}/form`"
          class="tbtn-icon tbtn--blue"
          v-if="userHasWritePermission"
          v-tooltip="'Edit'"
        >
          <IHPencil class="w-6 h-6" />
        </nuxt-link>
      </div>
    </div>

    <div class="alert alert-info" v-if="!isOwner">
      {{ bucket.owner.firstname }} {{ bucket.owner.lastname }} has granted you
      <b v-if="userHasWritePermission">read and write permissions</b>
      <b v-else>read only permission</b>
      to this bucket.
    </div>
    <div class="card shadow-md">
      <div class="card-body">
        <div v-if="bucket.notes">
          <span class="card-item-title first-col-1-4">Notes</span>
          <span>{{ bucket.notes }}</span>
        </div>
        <div v-if="bucket.notes">
          <span class="card-item-title first-col-1-4">Shared with</span>
          <span>
            <ul class="space-y-2">
              <li v-for="user in bucket.shared_with" :key="user.id">
                <span>
                  {{ user.firstname }} {{ user.lastname }} -
                  {{ user.bucket_user_permission.is_write_allowed ? 'Write allowed' : ' Read only' }}
                </span>
              </li>
            </ul>
          </span>
        </div>
      </div>
    </div>

    <div class="my-8 space-y-2">
      <h2>Candidates</h2>
      <div v-if="bucket.candidates.length === 0"> There are no candidates stored in this bucket. </div>
      <TableWithSelectableColumns
        v-else
        :items="bucket.candidates"
        :available-columns="candidateAvailableColumns"
        item-title="candidates"
        item-type="candidate"
        :is-pagination-on-frontend="true"
        :per-page="perPage"
      />

      <h2 class="pt-4">Clients</h2>
      <div v-if="bucket.clients.length === 0"> There are no clients stored in this bucket. </div>
      <TableWithSelectableColumns
        v-else
        :items="bucket.clients"
        :available-columns="clientAvailableColumns"
        item-title="clients"
        item-type="client"
        :is-pagination-on-frontend="true"
        :per-page="perPage"
      />

      <h2 class="pt-4">Companies</h2>
      <div v-if="bucket.companies.length === 0"> There are no companies stored in this bucket. </div>
      <TableWithSelectableColumns
        v-else
        :items="bucket.companies"
        :available-columns="companyAvailableColumns"
        item-title="companies"
        item-type="company"
        :is-pagination-on-frontend="true"
        :per-page="perPage"
      />

      <h2 class="pt-4">Projects</h2>
      <div v-if="bucket.projects.length === 0"> There are no projects stored in this bucket. </div>
      <TableWithSelectableColumns
        v-else
        :items="bucket.projects"
        :available-columns="projectAvailableColumns"
        item-title="projects"
        item-type="project"
        :is-pagination-on-frontend="true"
        :per-page="perPage"
      />
    </div>

    <div class="mb-8" v-if="isAdmin">
      <button class="h2" @click="isHistoryExpanded = !isHistoryExpanded">Modification history (click to toggle)</button>
      <HistoryList :histories="bucket.histories" v-if="isHistoryExpanded" />
    </div>

    <client-only>
      <SweetModal ref="modalExportBucket" title="Define columns for export">
        <form @submit.prevent="onExportBucketSubmit()" class="space-y-6">
          <div class="grid grid-cols-1 gap-4">
            <FMultiselect
              v-model="exportForm.candidate"
              label="Candidate columns"
              :options="candidateColumns"
              :isSingle="false"
              :isTaggable="false"
            />
          </div>
          <div class="grid grid-cols-1 gap-4">
            <FMultiselect
              v-model="exportForm.client"
              label="Client columns"
              :options="clientColumns"
              :isSingle="false"
              :isTaggable="false"
            />
          </div>
          <div class="grid grid-cols-1 gap-4">
            <FMultiselect
              v-model="exportForm.company"
              label="Company columns"
              :options="companyColumns"
              :isSingle="false"
              :isTaggable="false"
            />
          </div>
          <div class="grid grid-cols-1 gap-4">
            <FMultiselect
              v-model="exportForm.project"
              label="Project columns"
              :options="projectColumns"
              :isSingle="false"
              :isTaggable="false"
            />
          </div>

          <p class="text-gray-600 pb-32">
            Choose which columns of each resource type you want to have in exported Excel tables. After generation of
            file it will be downloaded automatically.
          </p>

          <div class="form-action-buttons mt-0 mb-0">
            <button type="submit" class="tbtn tbtn--blue">
              <template v-if="!isSubmittingExportBucket"> Download bucket </template>
              <template v-else> Generating file... </template>
            </button>
          </div>
        </form>
      </SweetModal>
    </client-only>
  </div>
</template>

<script lang="ts">
import { Component, namespace, State, Vue } from 'nuxt-property-decorator'

import GetBucketForView from '~/graphql/ressources/buckets/GetBucketForView.gql'
import CopyBucket from '~/graphql/ressources/buckets/CopyBucket.gql'
import ExportBucket from '~/graphql/ressources/buckets/ExportBucket.gql'
import RemoveFromBucket from '~/graphql/ressources/buckets/RemoveFromBucket.gql'
import {
  CopyBucketMutation,
  CopyBucketMutationVariables,
  ExportBucketQuery,
  ExportBucketQueryVariables,
  GetBucketForViewQuery,
  GetCandidatesQuery,
  GetClientsQuery,
  GetCompaniesQuery,
  Maybe,
  RemoveFromBucketMutation,
  RemoveFromBucketMutationVariables,
  UserRole,
} from '~/graphql/GQLTypes'
import HistoryList from '~/components/admin/HistoryList.vue'
import { apolloParseErrors } from '~/helpers/apolloParseErrors'
import { SimpleMultiselectOption } from '~/helpers/types'
import IHChevronLeft from '~/components/globals/icons/heroicons/IHChevronLeft.vue'
import IHPencil from '~/components/globals/icons/heroicons/IHPencil.vue'
import IUpload from '~/components/globals/icons/IUpload.vue'
import IHDuplicate from '~/components/globals/icons/heroicons/IHDuplicate.vue'
import TableWithSelectableColumns, { ColumnsDefinition } from '~/components/pages/TableWithSelectableColumns.vue'

@Component({
  components: {
    TableWithSelectableColumns,
    IHDuplicate,
    IHPencil,
    IHChevronLeft,
    HistoryList,
    IUpload,
  },
  async asyncData({ app, route, store }) {
    const data: any = {
      bucketId: Number.parseInt(route.params.id),
    }
    if (data.bucketId) {
      try {
        const res = await app.apolloProvider!.defaultClient.query<GetBucketForViewQuery>({
          query: GetBucketForView,
          variables: {
            id: data.bucketId,
          },
        })
        data.bucket = res.data.bucket
      } catch (e) {
        console.error(e)
        data.bucket = null
      }
    }
    return data
  },
  head() {
    let bucketName = ''
    if ((this as BucketsView).bucket) {
      bucketName = (this as BucketsView).bucket!.title
    }
    return {
      title: bucketName,
    }
  },
  middleware: 'auth',
  meta: {
    requiredRole: UserRole.Employee,
  },
})
export default class BucketsView extends Vue {
  $refs!: {
    modalExportBucket: any
  }

  perPage = 5

  candidateAvailableColumns: ColumnsDefinition = {
    name_with_photo: {
      title: 'Name',
      component: 'CandidateNameWithPhoto',
      required: true,
    },
    company: {
      title: 'Position',
      component: 'CandidatesCompany',
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

  clientAvailableColumns: ColumnsDefinition = {
    name_with_photo: {
      title: 'Name',
      component: 'ClientNameWithPhoto',
      required: true,
    },
    company: {
      title: 'Position',
      component: 'ClientsCompany',
    },
    phone: {
      title: 'Phone number',
      component: 'PhoneNumber',
    },
    email: {
      title: 'Email',
      component: 'Email',
    },
    // last_contact: {
    //   title: 'Last contact',
    //   component: 'LastContact',
    // },
    has_stella_account: {
      title: 'Has stella account',
      component: 'HasStellaAccount',
    },
  }

  companyAvailableColumns: ColumnsDefinition = {
    name_with_photo: {
      title: 'Name',
      component: 'CompanyNameWithPhoto',
      required: true,
    },
    industries: {
      title: 'Industries',
      component: 'Industries',
    },
    locations: {
      title: 'Locations',
      component: 'Locations',
    },
    phone: {
      title: 'Phone number',
      component: 'PhoneNumber',
    },
    company_links: {
      title: 'Links',
      component: 'CompanyLinks',
    },
    // last_contact: {
    //   title: 'Last contact',
    //   component: 'LastContact',
    // },
  }

  projectAvailableColumns: ColumnsDefinition = {
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
      title: 'Consultants',
      component: 'Candidates',
    },
    users: {
      title: 'ProjectUsers',
      component: 'ProjectUsers',
    },
  }

  bucket: GetBucketForViewQuery['bucket'] = null
  publicUrl = this.$config.publicUrl
  isHistoryExpanded = false

  isSubmittingExportBucket = false

  @State((state) => state.account.user)
  accountUser

  exportForm: {
    candidate: SimpleMultiselectOption[]
    client: SimpleMultiselectOption[]
    company: SimpleMultiselectOption[]
    project: SimpleMultiselectOption[]
  } = {
    candidate: [],
    client: [],
    company: [],
    project: [],
  }

  candidateColumns: SimpleMultiselectOption[] = [
    { id: 'title', title: 'Title' },
    { id: 'firstname', title: 'Firstname' },
    { id: 'other_firstnames', title: 'Other firstnames' },
    { id: 'lastname', title: 'Lastname' },
    { id: 'birth_name', title: 'Birth name' },
    { id: 'gender', title: 'Gender' },
    { id: 'birthdate', title: 'Birthdate' },
    { id: 'email', title: 'Email' },
    { id: 'is_interim', title: 'Is interim' },
    { id: 'is_permanent', title: 'Is permanent' },
    { id: 'marital_status', title: 'Marital status' },
    { id: 'desired_job', title: 'Desired job' },
    { id: 'max_distance_from_home', title: 'Max distance from home' },
    { id: 'willing_to_travel', title: 'Willing to travel' },
    { id: 'available_from', title: 'Available from' },
    { id: 'daily_rate', title: 'Daily rate' },
    { id: 'expenses_included', title: 'Expenses included' },
    { id: 'period_of_notice', title: 'Period of notice' },
    { id: 'next_possible_notice_to', title: 'Next possible notice to' },
    { id: 'basic_salary', title: 'Basic salary' },
    { id: 'bonus_eur', title: 'Bonus EUR' },
    { id: 'is_business_car_included', title: 'Is business car included' },
    { id: 'other_bonus', title: 'Other bonus' },
    { id: 'notes', title: 'Notes' },
    { id: 'nationalities', title: 'Nationalities' },
    { id: 'location', title: 'Location' },
    { id: 'postal_code', title: 'Postal code' },
    { id: 'city', title: 'City' },
    { id: 'street', title: 'Street' },
    { id: 'house_number', title: 'House number' },
    { id: 'country', title: 'Country' },
    { id: 'phonenumbers', title: 'Phonenumbers' },
    { id: 'industries', title: 'Industries' },
    { id: 'skills', title: 'Skills' },
    { id: 'certification', title: 'Certification' },
    { id: 'it_skills', title: 'IT Skills' },
    { id: 'languages', title: 'Languages' },
    { id: 'worked_at_companies', title: 'Worked at companies' },
  ]

  clientColumns: SimpleMultiselectOption[] = [
    { id: 'title', title: 'Title' },
    { id: 'firstname', title: 'Firstname' },
    { id: 'other_firstnames', title: 'Other firstnames' },
    { id: 'lastname', title: 'Lastname' },
    { id: 'birth_name', title: 'Birth name' },
    { id: 'gender', title: 'Gender' },
    { id: 'birthdate', title: 'Birthdate' },
    { id: 'email', title: 'Email' },
    { id: 'position', title: 'Position' },
    { id: 'notes', title: 'Notes' },
    { id: 'company', title: 'Company' },
    { id: 'location', title: 'Location' },
    { id: 'postal_code', title: 'Postal code' },
    { id: 'city', title: 'City' },
    { id: 'street', title: 'Street' },
    { id: 'house_number', title: 'House number' },
    { id: 'country', title: 'Country' },
    { id: 'phonenumbers', title: 'Phonenumbers' },
  ]

  companyColumns: SimpleMultiselectOption[] = [
    { id: 'name', title: 'Name' },
    { id: 'legal_form', title: 'Legal form' },
    { id: 'website', title: 'Website' },
    { id: 'email', title: 'Email' },
    { id: 'employees_count', title: 'Employees count' },
    { id: 'annual_sales', title: 'Annual sales' },
    { id: 'about', title: 'About' },
    { id: 'jobs_external_link', title: 'Jobs external link' },
    { id: 'industries', title: 'Industries' },
    { id: 'locations', title: 'Locations' },
    { id: 'phonenumbers', title: 'Phonenumbers' },
    { id: 'parent_company', title: 'Parent company' },
  ]

  projectColumns: SimpleMultiselectOption[] = [
    { id: 'status', title: 'Status' },
    { id: 'status_note', title: 'Status note' },
    { id: 'is_interim', title: 'Is interim' },
    { id: 'is_permanent', title: 'Is permanent' },
    { id: 'title', title: 'Project title' },
    { id: 'basic_salary', title: 'Basic salary' },
    { id: 'bonus_eur', title: 'Bonus EUR' },
    { id: 'is_business_car_included', title: 'Is business car included' },
    { id: 'fee_structure', title: 'Fee sctructure' },
    { id: 'daily_rate', title: 'Daily rate' },
    { id: 'expenses_included', title: 'Expenses included' },
    { id: 'purchasing_daily_rate', title: 'Purchasing daily rate' },
    { id: 'retail_daily_rate', title: 'Retail daily rate' },
    { id: 'retain', title: 'Retain' },
    { id: 'project_start', title: 'Project start' },
    { id: 'project_end', title: 'Project end' },
    { id: 'placed_start_at', title: 'Placed start at' },
    { id: 'notes', title: 'Notes' },
    { id: 'company', title: 'Company' },
    { id: 'client', title: 'Client' },
    { id: 'industries', title: 'Industries' },
    { id: 'skills', title: 'Skills' },
    { id: 'certification', title: 'Certification' },
    { id: 'it_skills', title: 'IT Skills' },
    { id: 'languages', title: 'Languages' },
  ]

  @(namespace('account').Getter('isAdmin'))
  isAdmin!: boolean

  @(namespace('account').Getter('isEmployee'))
  isEmployee!: boolean

  get isOwner() {
    return !!(this.bucket && this.accountUser && this.bucket.owner.id === this.accountUser.id)
  }

  get userHasWritePermission() {
    if (this.isOwner) {
      return true
    }
    if (this.bucket) {
      let hasWritePermission = false
      this.bucket.shared_with.forEach((user) => {
        hasWritePermission = hasWritePermission || user.bucket_user_permission!.is_write_allowed
      })
      return hasWritePermission
    }
    return false
  }

  mounted() {
    // redirect to overview, if queried id was not found
    if (!this.bucket) {
      this.$router.push('/buckets')
      return
    }
  }

  removeFromBucket(object: { candidate?; client?; company?; project? }) {
    const variables: RemoveFromBucketMutationVariables = {
      id: this.bucket!.id,
      input: {},
    }
    if (object.candidate) {
      variables.input.candidate_ids = [object.candidate.id]
    }
    if (object.client) {
      variables.input.client_ids = [object.client.id]
    }
    if (object.company) {
      variables.input.company_ids = [object.company.id]
    }
    if (object.project) {
      variables.input.project_ids = [object.project.id]
    }

    this.$apollo
      .mutate<RemoveFromBucketMutation>({
        mutation: RemoveFromBucket,
        variables,
      })
      .then(() => {
        // remove from bucket
        if (object.candidate) {
          this.bucket!.candidates.splice(this.bucket!.candidates.indexOf(object.candidate), 1)
        }
        if (object.client) {
          this.bucket!.clients.splice(this.bucket!.clients.indexOf(object.client), 1)
        }
        if (object.company) {
          this.bucket!.companies.splice(this.bucket!.companies.indexOf(object.company), 1)
        }
        if (object.project) {
          this.bucket!.projects.splice(this.bucket!.projects.indexOf(object.project), 1)
        }
      })
      .catch((err) => {
        this.$bus.showErrorModal({
          errors: apolloParseErrors(err),
        })
      })
  }

  openExportModal() {
    this.$refs.modalExportBucket.open()
  }

  onExportBucketSubmit() {
    if (this.isSubmittingExportBucket) {
      return
    }
    this.isSubmittingExportBucket = true

    this.$apollo
      .query<ExportBucketQuery>({
        query: ExportBucket,
        fetchPolicy: 'no-cache',
        variables: {
          id: this.bucket!.id,
          candidateColumns: this.exportForm.candidate.map((option) => option.id),
          clientColumns: this.exportForm.client.map((option) => option.id),
          companyColumns: this.exportForm.company.map((option) => option.id),
          projectColumns: this.exportForm.project.map((option) => option.id),
        } as ExportBucketQueryVariables,
      })
      .then(({ data }) => {
        this.isSubmittingExportBucket = false
        this.$refs.modalExportBucket.close()
        location.href = data.exportBucket!
      })
      .catch((err) => {
        this.isSubmittingExportBucket = false
        this.$bus.showErrorModal({
          errors: apolloParseErrors(err),
        })
      })
  }

  copyBucket() {
    if (!this.bucket) {
      this.$bus.showErrorModal({
        errors: ['Copying of bucket is not possible, as bucket is not specified.'],
      })
      return
    }
    this.$bus.showDeleteConfirmModal('Are you sure you want to crete a copy of this bucket?', () => {
      const variables: CopyBucketMutationVariables = {
        id: this.bucket!.id,
      }
      this.$apollo
        .mutate<CopyBucketMutation>({
          mutation: CopyBucket,
          variables,
        })
        .then(({ data }) => {
          this.$bus.showSuccessModal('Bucket was successfully copied', 3000)
          this.$apollo.provider.defaultClient.clearStore()
          this.$router.push('/buckets/' + data!.copyBucket!.id)
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
