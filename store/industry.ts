import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { IndustryState, RootState, TagOverviewQueryParams } from './index'
import GetIndustries from '~/graphql/ressources/industries/GetAllIndustries.gql'
import CreateIndustry from '~/graphql/ressources/industries/CreateIndustry.gql'
import { CreateIndustryMutation, CreateIndustryMutationVariables, GetAllIndustriesQuery } from '~/graphql/GQLTypes'

export const state = (): IndustryState => ({
  industries: [],
  overviewQueryParams: {},
  notReviewedCount: 0,
})

export const getters: GetterTree<IndustryState, RootState> = {}

export const mutations: MutationTree<IndustryState> = {
  setIndustries(localState, industries: GetAllIndustriesQuery['allIndustries']) {
    localState.industries = industries
    localState.notReviewedCount = industries.filter((item) => !item.is_reviewed).length
  },
  addIndustry(localState, newIndustry: CreateIndustryMutation['createIndustry']) {
    localState.industries.push(newIndustry!)
    localState.notReviewedCount += 1
  },
  decreaseNotReviewedCounter(localState) {
    localState.notReviewedCount -= 1
  },
  setOverviewQueryParams(localState, overviewQueryParams: TagOverviewQueryParams) {
    localState.overviewQueryParams = overviewQueryParams
  },
}

export const actions: ActionTree<IndustryState, RootState> = {
  fetchIndustries({ commit }) {
    return this.app
      .apolloProvider!.defaultClient.query({
        query: GetIndustries,
      })
      .then(({ data }: { data: GetAllIndustriesQuery }) => {
        if (data.allIndustries) {
          commit('setIndustries', data.allIndustries)
        }
      })
  },
  createIndustry({ commit }, payload: { title: string }) {
    const variables: CreateIndustryMutationVariables = {
      input: {
        title: payload.title,
      },
    }
    return this.app
      .apolloProvider!.defaultClient.mutate<CreateIndustryMutation>({
        mutation: CreateIndustry,
        variables,
      })
      .then(({ data }) => {
        if (data && data.createIndustry) {
          commit('addIndustry', data.createIndustry)
          return data!.createIndustry
        }
        return
      })
  },
}
