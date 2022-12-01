import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { PersonState, RootState, User } from './index'
import GetPeopleByName from '@/graphql/ressources/people/GetPeopleByName.gql'
import { GetPeopleByNameQuery, GetPeopleByNameQueryVariables } from '~/graphql/GQLTypes'

export const state = (): PersonState => ({
  prefilledForCreation: {
    person: undefined,
  },
})

export const getters: GetterTree<PersonState, RootState> = {}

export const mutations: MutationTree<PersonState> = {
  setPrefilledPerson(localState, person: GetPeopleByNameQuery['people'][0]) {
    localState.prefilledForCreation.person = person
  },
  clearPrefilledPerson(localState) {
    localState.prefilledForCreation.person = undefined
  },
}

export const actions: ActionTree<PersonState, RootState> = {
  async getPeopleByName(a, payload: { firstname: string; lastname: string }) {
    const variables: GetPeopleByNameQueryVariables = {
      names: payload,
    }

    const response = await this.app.apolloProvider!.defaultClient.query({
      query: GetPeopleByName,
      variables,
    })

    return response
  },
}
