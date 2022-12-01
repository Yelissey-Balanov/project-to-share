import { ActionTree, GetterTree, MutationTree } from 'vuex'
import { InstitutionState, RootState, TagOverviewQueryParams } from './index'
import GetAllInstitutions from '~/graphql/ressources/institutions/GetAllInstitutions.gql'
import CreateInstitution from '@/graphql/ressources/institutions/CreateInstitution.gql'
import {
  CreateInstitutionMutation,
  CreateInstitutionMutationVariables,
  GetAllInstitutionsQuery,
  UserRole,
} from '~/graphql/GQLTypes'

export const state = (): InstitutionState => ({
  institutions: [],
  overviewQueryParams: {},
  notReviewedCount: 0,
})

export const getters: GetterTree<InstitutionState, RootState> = {}

export const mutations: MutationTree<InstitutionState> = {
  setInstitutions(localState, institutions: GetAllInstitutionsQuery['allInstitutions']) {
    localState.institutions = institutions
    localState.notReviewedCount = institutions.filter((item) => !item.is_reviewed).length
  },
  addInstitution(localState, newInstitution: CreateInstitutionMutation['createInstitution']) {
    localState.institutions.push(newInstitution!)
    if (!newInstitution.is_reviewed) {
      localState.notReviewedCount += 1
    }
  },
  decreaseNotReviewedCounter(localState) {
    localState.notReviewedCount -= 1
  },
  setOverviewQueryParams(localState, overviewQueryParams: TagOverviewQueryParams) {
    localState.overviewQueryParams = overviewQueryParams
  },
}

export const actions: ActionTree<InstitutionState, RootState> = {
  fetchInstitutions({ commit }) {
    return this.app
      .apolloProvider!.defaultClient.query({
        query: GetAllInstitutions,
      })
      .then(({ data }: { data: GetAllInstitutionsQuery }) => {
        if (data.allInstitutions) {
          commit('setInstitutions', data.allInstitutions)
        }
      })
  },
  createInstitution({ rootState, commit }, payload: { name: string }) {
    const isAdmin =
      rootState.account && rootState.account.user && rootState.account.user.roles.includes(UserRole.Employee)
    const variables: CreateInstitutionMutationVariables = {
      input: {
        name: payload.name,
        is_reviewed: isAdmin,
      },
    }
    return this.app
      .apolloProvider!.defaultClient.mutate<CreateInstitutionMutation>({
        mutation: CreateInstitution,
        variables,
      })
      .then(({ data }) => {
        if (data && data.createInstitution) {
          commit('addInstitution', data.createInstitution)
          return data!.createInstitution
        }
        return
      })
  },
}
