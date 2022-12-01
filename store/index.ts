import VueRouter from 'vue-router'
import { MutationTree, ActionTree } from 'vuex'
import {
  GetAllIndustriesQuery,
  GetAllSkillsQuery,
  UserRole,
  GetAllCertificationsQuery,
  GetDocumentTagsQuery,
  GetClientsForAutocompleteQuery,
  GetCompaniesForAutocompleteQuery,
  GetAllItSkillsQuery,
  GetProjectForViewQuery,
  CandidateInProjectlistFragment,
  GetSuitableCandidatesForProjectQuery,
  EventWithUserAndProjectFragment,
  GetPeopleByNameQuery,
  Maybe,
  GetAllInstitutionsQuery,
  JobLevel,
  MeQuery,
  GetLicenseQuery,
  GetCompanyForViewQuery,
  Scalars,
  GetUsersForAutocompleteQuery,
  ProjectStatus,
} from '~/graphql/GQLTypes'
import { IFormSingleLocation } from '~/helpers/locationHelpers'
import { IdWithTitle, SimpleMultiselectOption } from '~/helpers/types'

// store types
export interface RootState {
  account?: UserState
  bucket?: BucketState
  candidate?: CandidateState
  client?: ClientState
  company?: CompanyState
  documentTag?: DocumentTagState
  event?: EventState
  skill?: SkillState
  industry?: IndustryState
  itSkill?: ItSkillState
  person?: PersonState
  project?: ProjectState
  certification?: CertificationState
  institution?: InstitutionState
  stella?: StellaState

  isUnderMaintenance: boolean
  gqlLoadingCounter: number
  genericModal: GenericModal
  codeVersions: {
    client: Maybe<string>
    server: Maybe<string>
  }
}

export interface User {
  id: number
  email: string
  roles: UserRole[]
}

export interface UserState {
  user?: MeQuery['me']
}

export interface StellaState {
  license?: GetLicenseQuery['license']
}

export interface CandidatesFilterForm {
  firstname: Maybe<string>
  lastname: Maybe<string>
  is_interim: boolean
  available_from: Maybe<Date>
  daily_rate_max: Maybe<number>
  is_permanent: boolean
  salary_package_max: Maybe<number>
  location: IFormSingleLocation
  location_radius: Maybe<number>
  languages: string[]
  job_levels: JobLevel[]
  keywords_search: IdWithTitle<string>[]
  industries: IdWithTitle[]
  certifications: IdWithTitle[]
  it_skills: IdWithTitle[]
  skills: IdWithTitle[]
  page: number
}

export interface CandidateState {
  events: EventWithUserAndProjectFragment[]
  candidatesOverviewFilters: CandidatesFilterForm
}

export interface EventState {}

export interface PersonState {
  prefilledForCreation: {
    person?: GetPeopleByNameQuery['people'][0]
  }
}

export interface ClientsFilterForm {
  firstname: Maybe<string>
  lastname: Maybe<string>
  location: IFormSingleLocation
  location_radius: Maybe<number>
  industries: IdWithTitle[]
  page: number
}

export interface ClientState {
  events: EventWithUserAndProjectFragment[]
  clientsOverviewFilters: ClientsFilterForm
}

export interface CompaniesFilterForm {
  name: Maybe<string>
  location: IFormSingleLocation
  location_radius: Maybe<number>
  industries: IdWithTitle[]
  min_employees_count: Maybe<number>
  max_employees_count: Maybe<number>
  min_annual_sales: Maybe<number>
  max_annual_sales: Maybe<number>
  page: number
}

export interface CompanyState {
  events: NonNullable<GetCompanyForViewQuery['company']>['eventsInclClients']
  companiesOverviewFilters: CompaniesFilterForm
}

export type TagTitleWithSynonymReferenceMap = Map<
  number,
  {
    title: string
    synonymOfId?: number
  }
>

export interface ProjectsFilterForm {
  title: Maybe<string>
  user_autocomplete: Maybe<NonNullable<GetUsersForAutocompleteQuery['users']>['data'][0]> | undefined
  with_archived: boolean
  industries: IdWithTitle[]
  skills: IdWithTitle[]
  statuses: Array<IdWithTitle<ProjectStatus>>
  daily_rate_min: Maybe<number>
  daily_rate_max: Maybe<number>
  salary_package_min: Maybe<number>
  salary_package_max: Maybe<number>
  project_start_from: Maybe<string>
  project_start_till: Maybe<string>
  page: number
}

export interface ProjectState {
  prefilledForCreation: {
    client?: GetClientsForAutocompleteQuery['clientsInCompany'][0]
    company?: NonNullable<GetCompaniesForAutocompleteQuery['companies']>['data'][0]
  }
  clientEvents: NonNullable<GetProjectForViewQuery['project']>['client_events']
  projectAdditionalData: {
    industriesMap: TagTitleWithSynonymReferenceMap
    skillsMap: TagTitleWithSynonymReferenceMap
    certificationsMap: Map<number, string>
    itSkillsMap: TagTitleWithSynonymReferenceMap
    maxPossibleScore: number
    scoreMultiplicators: {
      industry: number
      skill: number
      certification: number
      itSkill: number
    }
  }
  projectCandidates: {
    map: Map<number, SuitableCandidate | CandidateInList>
    suitable?: SuitableCandidate[]
    longlist: CandidateInList[]
    shortlist: CandidateInList[]
  }
  sharedProject: {
    token: string
    password: string
  }
  projectsOverviewFilters: ProjectsFilterForm
}

export enum ButtonStatus {
  PROCESSING,
  PROCESSED,
  ACTIVE,
}

export interface CalculatedTagsObject<T> {
  original: T
  match: string[]
  missing: string[]
  extra: string[]
}

export interface AdditionalCandidateData {
  industriesCalculated: CalculatedTagsObject<TagTitleWithSynonymReferenceMap>
  skillsCalculated: CalculatedTagsObject<TagTitleWithSynonymReferenceMap>
  certificationsCalculated: CalculatedTagsObject<Map<number, string>>
  itSkillsCalculated: CalculatedTagsObject<TagTitleWithSynonymReferenceMap>
  matchingScore: number
  buttonStatus: {
    addToLonglist: ButtonStatus
    removeFromLonglist: ButtonStatus
    addToShortlist: ButtonStatus
    removeFromShortlist: ButtonStatus
    reject: ButtonStatus
    reactivate: ButtonStatus
    onHold: ButtonStatus
    changeConditions: ButtonStatus
    thumbUp: ButtonStatus
    thumbDown: ButtonStatus
    consent: ButtonStatus
  }
}

export type SuitableCandidate = AdditionalCandidateData &
  NonNullable<NonNullable<GetSuitableCandidatesForProjectQuery['suitableCandidatesForProject']>['data'][0]>

export type CandidateInList = AdditionalCandidateData & CandidateInProjectlistFragment

export interface DocumentTagState {
  documentTags: GetDocumentTagsQuery['documentTags']
}

export interface IndustryState {
  industries: GetAllIndustriesQuery['allIndustries']
  overviewQueryParams: TagOverviewQueryParams
  notReviewedCount: number
}

export interface CertificationState {
  certifications: GetAllCertificationsQuery['allCertifications']
  overviewQueryParams: TagOverviewQueryParams
  notReviewedCount: number
}

export interface ItSkillState {
  itSkills: GetAllItSkillsQuery['allItSkills']
  overviewQueryParams: TagOverviewQueryParams
  notReviewedCount: number
}

export interface SkillState {
  skills: GetAllSkillsQuery['allSkills']
  overviewQueryParams: TagOverviewQueryParams
  notReviewedCount: number
}

export interface InstitutionState {
  institutions: GetAllInstitutionsQuery['allInstitutions']
  overviewQueryParams: TagOverviewQueryParams
  notReviewedCount: number
}

export interface TagOverviewQueryParams {
  page?: string
  search?: string
  not_reviewed_only?: string
}

export interface BucketState {
  writableBuckets: WritableBucket[]
  lastSelectedBucket: Maybe<WritableBucket>
  candidateSelectionIsActive: boolean
  candidateSelection: Set<number>
  candidateSelectionCount: number
  clientSelectionIsActive: boolean
  clientSelection: Set<number>
  clientSelectionCount: number
  companySelectionIsActive: boolean
  companySelection: Set<number>
  companySelectionCount: number
  projectSelectionIsActive: boolean
  projectSelection: Set<number>
  projectSelectionCount: number
}

export interface WritableBucket {
  id: number
  title: string
  ownerName?: string
}

export interface GenericModal {
  text?: string
  html?: string
  progress?: number
  icon?: string
  blocking?: boolean
}

// ------------------------------
// Global state and mutations
// ------------------------------
export const state = (): RootState => ({
  isUnderMaintenance: false,
  gqlLoadingCounter: 0,
  genericModal: {
    text: '',
  },
  codeVersions: {
    client: null,
    server: null,
  },
})

export const mutations: MutationTree<RootState> = {
  setMaintenance(localState, isUnderMaintenance: boolean) {
    localState.isUnderMaintenance = isUnderMaintenance
    localState.account!.user = null
  },
  setCodeVersions(localState, newVersion: { client: Maybe<string>; server: Maybe<string> }) {
    localState.codeVersions = newVersion
  },
  updateLoadingCounter(localState, newCounter: number) {
    localState.gqlLoadingCounter += newCounter
  },
  updateGenericModal(localState, newData: GenericModal) {
    if (newData.progress) {
      newData.progress = Math.min(100, newData.progress)
    }
    localState.genericModal = Object.assign({}, localState.genericModal, newData)
  },
}
export const actions: ActionTree<RootState, any> = {
  async nuxtServerInit({ dispatch, commit }, { app }) {
    try {
      if (app.$cookies.get('XSRF-TOKEN')) {
        await dispatch('account/fetchUser')
      }
      await dispatch('stella/fetchLicense')
    } catch (e) {
      console.error('Error while fetching user and license!')
      if (e.networkError) {
        console.error(e.networkError)
      }
    }
  },
}

// ---------------------------------
// extend types definition for nuxt
// ---------------------------------
declare module 'vuex/types/index' {
  interface Store<S> {
    $router: VueRouter
  }
}
