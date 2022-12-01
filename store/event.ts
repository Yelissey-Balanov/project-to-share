import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { EventState, RootState } from './index'
import { EventWithUserFragment, UpdateEventMutation } from '~/graphql/GQLTypes'

export const state = (): EventState => ({})

export const getters: GetterTree<EventState, RootState> = {}

export const mutations: MutationTree<EventState> = {
  // region EVENTS
  updateEvent(
    localState,
    payload: { event: EventWithUserFragment; responseData: NonNullable<UpdateEventMutation['updateEvent']> }
  ) {
    payload.event.group = payload.responseData.group
    payload.event.type = payload.responseData.type
    payload.event.notes = payload.responseData.notes
    payload.event.happened_at = payload.responseData.happened_at
  },
  // endregion
}

export const actions: ActionTree<EventState, RootState> = {}
