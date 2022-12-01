import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { CertificationState, RootState, TagOverviewQueryParams } from './index'
import GetAllCertifications from '~/graphql/ressources/certifications/GetAllCertifications.gql'
import CreateCertification from '@/graphql/ressources/certifications/CreateCertification.gql'
import {
  CreateCertificationMutation,
  CreateCertificationMutationVariables,
  GetAllCertificationsQuery,
} from '~/graphql/GQLTypes'

export const state = (): CertificationState => ({
  certifications: [],
  overviewQueryParams: {},
  notReviewedCount: 0,
})

export const getters: GetterTree<CertificationState, RootState> = {}

export const mutations: MutationTree<CertificationState> = {
  setCertifications(localState, certifications: GetAllCertificationsQuery['allCertifications']) {
    localState.certifications = certifications
    localState.notReviewedCount = certifications.filter((item) => !item.is_reviewed).length
  },
  addCertification(localState, newCertification: CreateCertificationMutation['createCertification']) {
    localState.certifications.push(newCertification!)
    localState.notReviewedCount += 1
  },
  decreaseNotReviewedCounter(localState) {
    localState.notReviewedCount -= 1
  },
  setOverviewQueryParams(localState, overviewQueryParams: TagOverviewQueryParams) {
    localState.overviewQueryParams = overviewQueryParams
  },
}

export const actions: ActionTree<CertificationState, RootState> = {
  fetchCertifications({ commit }) {
    return this.app
      .apolloProvider!.defaultClient.query({
        query: GetAllCertifications,
      })
      .then(({ data }: { data: GetAllCertificationsQuery }) => {
        if (data.allCertifications) {
          commit('setCertifications', data.allCertifications)
        }
      })
  },
  createCertification({ commit }, payload: { title: string }) {
    const variables: CreateCertificationMutationVariables = {
      input: {
        title: payload.title,
      },
    }
    return this.app
      .apolloProvider!.defaultClient.mutate<CreateCertificationMutation>({
        mutation: CreateCertification,
        variables,
      })
      .then(({ data }) => {
        if (data && data.createCertification) {
          commit('addCertification', data.createCertification)
          return data!.createCertification
        }
        return
      })
  },
}
