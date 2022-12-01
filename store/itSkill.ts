import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { ItSkillState, RootState, TagOverviewQueryParams } from './index'
import GetAllItSkills from '~/graphql/ressources/itSkills/GetAllItSkills.gql'
import CreateItSkill from '@/graphql/ressources/itSkills/CreateItSkill.gql'
import { CreateItSkillMutation, CreateItSkillMutationVariables, GetAllItSkillsQuery } from '~/graphql/GQLTypes'

export const state = (): ItSkillState => ({
  itSkills: [],
  overviewQueryParams: {},
  notReviewedCount: 0,
})

export const getters: GetterTree<ItSkillState, RootState> = {}

export const mutations: MutationTree<ItSkillState> = {
  setItSkills(localState, itSkills: GetAllItSkillsQuery['allItSkills']) {
    localState.itSkills = itSkills
    localState.notReviewedCount = itSkills.filter((item) => !item.is_reviewed).length
  },
  addItSkill(localState, newItSkill: CreateItSkillMutation['createItSkill']) {
    localState.itSkills.push(newItSkill!)
    localState.notReviewedCount += 1
  },
  decreaseNotReviewedCounter(localState) {
    localState.notReviewedCount -= 1
  },
  setOverviewQueryParams(localState, overviewQueryParams: TagOverviewQueryParams) {
    localState.overviewQueryParams = overviewQueryParams
  },
}

export const actions: ActionTree<ItSkillState, RootState> = {
  fetchItSkills({ commit }) {
    return this.app
      .apolloProvider!.defaultClient.query({
        query: GetAllItSkills,
      })
      .then(({ data }: { data: GetAllItSkillsQuery }) => {
        if (data.allItSkills) {
          commit('setItSkills', data.allItSkills)
        }
      })
  },
  createItSkill({ commit }, payload: { title: string }) {
    const variables: CreateItSkillMutationVariables = {
      input: {
        title: payload.title,
      },
    }
    return this.app
      .apolloProvider!.defaultClient.mutate<CreateItSkillMutation>({
        mutation: CreateItSkill,
        variables,
      })
      .then(({ data }) => {
        if (data && data.createItSkill) {
          commit('addItSkill', data.createItSkill)
          return data!.createItSkill
        }
        return
      })
  },
}
