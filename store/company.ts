import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { CompaniesFilterForm, CompanyState, RootState } from './index'
import {
  CreateEventMutation,
  EventWithUserAndProjectFragment,
  GetCompaniesQuery,
  GetCompaniesQueryVariables,
  SortOrder,
} from '~/graphql/GQLTypes'
import GetCompanies from '~/graphql/ressources/companies/GetCompanies.gql'

export const state = (): CompanyState => ({
  events: [],
  companiesOverviewFilters: {
    name: null,
    location: {
      label: null,
      autocompleteValue: null,
    },
    location_radius: 100,
    industries: [],
    min_employees_count: null,
    max_employees_count: null,
    min_annual_sales: null,
    max_annual_sales: null,
    page: 1,
  },
})

export const getters: GetterTree<CompanyState, RootState> = {}

export const mutations: MutationTree<CompanyState> = {
  // region EVENTS
  setEvents(localState, events: EventWithUserAndProjectFragment[]) {
    localState.events = events
  },
  addEvent(localState, payload: { event: CreateEventMutation['createEvent'] }) {
    localState.events.unshift({
      ...payload.event,
      // project: null,
    })
  },
  // endregion
  setCompaniesOverviewFilters(localState, companiesOverviewFilters: CompaniesFilterForm) {
    localState.companiesOverviewFilters = companiesOverviewFilters
    localState.companiesOverviewFilters.location = { ...companiesOverviewFilters.location }
  },
}

export const actions: ActionTree<CompanyState, RootState> = {
  async fetchCompanies({ state }) {
    const variables: GetCompaniesQueryVariables = {
      first: 40,
      orderBy: [
        {
          column: 'updated_at',
          order: SortOrder.Desc,
        },
      ],
      page: state.companiesOverviewFilters.page,
      filter: {
        industries: state.companiesOverviewFilters.industries.map((item) => item.id),
        location: state.companiesOverviewFilters.location.autocompleteValue,
        location_radius: state.companiesOverviewFilters.location_radius,
        min_employees_count: state.companiesOverviewFilters.min_employees_count,
        max_employees_count: state.companiesOverviewFilters.max_employees_count,
        min_annual_sales: state.companiesOverviewFilters.min_annual_sales,
        max_annual_sales: state.companiesOverviewFilters.max_annual_sales,
      },
    }

    if (state.companiesOverviewFilters.name) {
      variables.name = `%${state.companiesOverviewFilters.name}%`
    }

    return this.app.apolloProvider!.defaultClient.query<GetCompaniesQuery>({
      query: GetCompanies,
      variables,
    })
  },
}
