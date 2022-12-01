import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { ClientsFilterForm, ClientState, RootState } from './index'
import {
  CreateEventMutation,
  EventWithUserAndProjectFragment,
  FirstAndLastname,
  GetClientsQuery,
  GetClientsQueryVariables,
  SortOrder,
} from '~/graphql/GQLTypes'
import GetClients from '~/graphql/ressources/clients/GetClients.gql'

export const state = (): ClientState => ({
  events: [],
  clientsOverviewFilters: {
    firstname: null,
    lastname: null,
    location: {
      label: null,
      autocompleteValue: null,
    },
    location_radius: 100,
    industries: [],
    page: 1,
  },
})

export const getters: GetterTree<ClientState, RootState> = {}

export const mutations: MutationTree<ClientState> = {
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
  setClientsOverviewFilters(localState, clientsOverviewFilters: ClientsFilterForm) {
    localState.clientsOverviewFilters = clientsOverviewFilters
    localState.clientsOverviewFilters.location = { ...clientsOverviewFilters.location }
  },
}

export const actions: ActionTree<ClientState, RootState> = {
  async fetchClients({ state }) {
    const variables: GetClientsQueryVariables = {
      first: 40,
      orderBy: [
        {
          column: 'updated_at',
          order: SortOrder.Desc,
        },
      ],
      page: state.clientsOverviewFilters.page,
      names: {
        firstname: state.clientsOverviewFilters.firstname,
        lastname: state.clientsOverviewFilters.lastname,
      } as FirstAndLastname,
      filter: {
        industries: state.clientsOverviewFilters.industries.map((item) => item.id),
        location: state.clientsOverviewFilters.location.autocompleteValue,
        location_radius: state.clientsOverviewFilters.location_radius,
      },
    }

    return this.app.apolloProvider!.defaultClient.query<GetClientsQuery>({
      query: GetClients,
      variables,
    })
  },
}
