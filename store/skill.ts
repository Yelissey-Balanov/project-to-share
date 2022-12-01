import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { SkillState, RootState, TagOverviewQueryParams } from './index'
import GetAllSkills from '~/graphql/ressources/skills/GetAllSkills.gql'
import CreateSkill from '@/graphql/ressources/skills/CreateSkill.gql'
import { CreateSkillMutation, CreateSkillMutationVariables, GetAllSkillsQuery } from '~/graphql/GQLTypes'

export const state = (): SkillState => ({
  skills: [],
  overviewQueryParams: {},
  notReviewedCount: 0,
})

export const getters: GetterTree<SkillState, RootState> = {}

export const mutations: MutationTree<SkillState> = {
  setSkills(localState, skills: GetAllSkillsQuery['allSkills']) {
    localState.skills = skills
    localState.notReviewedCount = skills.filter((item) => !item.is_reviewed).length
  },
  addSkill(localState, newSkill: CreateSkillMutation['createSkill']) {
    localState.skills.push(newSkill!)
    localState.notReviewedCount += 1
  },
  decreaseNotReviewedCounter(localState) {
    localState.notReviewedCount -= 1
  },
  setOverviewQueryParams(localState, overviewQueryParams: TagOverviewQueryParams) {
    localState.overviewQueryParams = overviewQueryParams
  },
}

export const actions: ActionTree<SkillState, RootState> = {
  fetchSkills({ commit }) {
    return this.app
      .apolloProvider!.defaultClient.query({
        query: GetAllSkills,
      })
      .then(({ data }: { data: GetAllSkillsQuery }) => {
        if (data.allSkills) {
          commit('setSkills', data.allSkills)
        }
      })
  },
  createSkill({ commit }, payload: { title: string }) {
    const variables: CreateSkillMutationVariables = {
      input: {
        title: payload.title,
      },
    }
    return this.app
      .apolloProvider!.defaultClient.mutate<CreateSkillMutation>({
        mutation: CreateSkill,
        variables,
      })
      .then(({ data }) => {
        if (data && data.createSkill) {
          commit('addSkill', data.createSkill)
          return data.createSkill
        }
        return
      })
  },
}
