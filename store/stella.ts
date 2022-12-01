import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { RootState, StellaState } from './index'
import GetLicense from '@/graphql/ressources/stellaLicenses/GetLicense.gql'
import { GetLicenseQuery, StellaPlugin } from '~/graphql/GQLTypes'

export const state = (): StellaState => ({
  license: undefined,
})

export const getters: GetterTree<StellaState, RootState> = {
  isPluginEnabled(localState) {
    return (plugin: StellaPlugin) => {
      return !!(localState.license && localState.license.plugins.includes(plugin))
    }
  },
}

export const mutations: MutationTree<StellaState> = {
  setLicense(localState, license: GetLicenseQuery['license']) {
    localState.license = license
  },
}

export const actions: ActionTree<StellaState, RootState> = {
  async fetchLicense({ commit }) {
    return this.app
      .apolloProvider!.defaultClient.query({ query: GetLicense })
      .then(({ data }: { data: GetLicenseQuery }) => {
        commit('setLicense', data.license)
        return data.license
      })
  },
}
