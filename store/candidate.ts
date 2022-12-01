import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { CandidatesFilterForm, CandidateState, RootState } from './index'
import {
  CreateEventMutation,
  EventWithUserAndProjectFragment,
  FirstAndLastname,
  GetCandidatesQuery,
  GetCandidatesQueryVariables,
  SortOrder,
} from '~/graphql/GQLTypes'
import GetCandidates from '@/graphql/ressources/candidates/GetCandidates.gql'
import { toISODate } from '~/helpers/dateHelpers'

export const state = (): CandidateState => ({
  events: [],
  candidatesOverviewFilters: {
    firstname: null,
    lastname: null,
    is_interim: false,
    available_from: null,
    daily_rate_max: null,
    is_permanent: false,
    salary_package_max: null,
    location: {
      label: null,
      autocompleteValue: null,
    },
    location_radius: 100,
    languages: [],
    job_levels: [],
    keywords_search: [],
    industries: [],
    certifications: [],
    it_skills: [],
    skills: [],
    page: 1,
  },
})

export const getters: GetterTree<CandidateState, RootState> = {}

export const mutations: MutationTree<CandidateState> = {
  // region EVENTS
  setEvents(localState, events: EventWithUserAndProjectFragment[]) {
    localState.events = events
  },
  addEvent(localState, payload: { event: CreateEventMutation['createEvent'] }) {
    localState.events.unshift({
      project: null,
      ...payload.event,
    })
  },
  // endregion
  setCandidatesOverviewFilters(localState, candidatesOverviewFilters: CandidatesFilterForm) {
    localState.candidatesOverviewFilters = candidatesOverviewFilters
    localState.candidatesOverviewFilters.location = { ...candidatesOverviewFilters.location }
    localState.candidatesOverviewFilters.keywords_search = Array.from(candidatesOverviewFilters.keywords_search)
  },
}

export const actions: ActionTree<CandidateState, RootState> = {
  async fetchCandidates({ state }) {
    const variables: GetCandidatesQueryVariables = {
      first: 40,
      orderBy: [
        {
          column: 'updated_at',
          order: SortOrder.Desc,
        },
      ],
      page: state.candidatesOverviewFilters.page,
      names: {
        firstname: state.candidatesOverviewFilters.firstname,
        lastname: state.candidatesOverviewFilters.lastname,
      } as FirstAndLastname,
      filter: {
        is_interim: state.candidatesOverviewFilters.is_interim ? state.candidatesOverviewFilters.is_interim : null,
        is_permanent: state.candidatesOverviewFilters.is_permanent
          ? state.candidatesOverviewFilters.is_permanent
          : null,
        available_from: toISODate(state.candidatesOverviewFilters.available_from),
        daily_rate_max: state.candidatesOverviewFilters.daily_rate_max
          ? state.candidatesOverviewFilters.daily_rate_max
          : null,
        salary_package_max: state.candidatesOverviewFilters.salary_package_max
          ? state.candidatesOverviewFilters.salary_package_max
          : null,
        skills: state.candidatesOverviewFilters.skills.map((item) => item.id),
        industries: state.candidatesOverviewFilters.industries.map((item) => item.id),
        certifications: state.candidatesOverviewFilters.certifications.map((item) => item.id),
        it_skills: state.candidatesOverviewFilters.it_skills.map((item) => item.id),
        keywords_search: state.candidatesOverviewFilters.keywords_search.map((item) => item.title),
        location: state.candidatesOverviewFilters.location.autocompleteValue,
        location_radius: state.candidatesOverviewFilters.location_radius,
        language_codes: state.candidatesOverviewFilters.languages,
        job_levels: state.candidatesOverviewFilters.job_levels,
      },
    }

    return this.app.apolloProvider!.defaultClient.query<GetCandidatesQuery>({
      query: GetCandidates,
      variables,
    })
  },
}
