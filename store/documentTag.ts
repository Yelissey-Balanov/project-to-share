import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { DocumentTagState, RootState } from './index'
import GetDocumentTags from '@/graphql/components/GetDocumentTags.gql'
import CreateDocumentTag from '@/graphql/components/CreateDocumentTag.gql'
import { CreateDocumentTagMutation, CreateDocumentTagMutationVariables, GetDocumentTagsQuery } from '~/graphql/GQLTypes'

export const state = (): DocumentTagState => ({
  documentTags: [],
})

export const getters: GetterTree<DocumentTagState, RootState> = {}

export const mutations: MutationTree<DocumentTagState> = {
  setDocumentTags(localState, documentTags: GetDocumentTagsQuery['documentTags']) {
    localState.documentTags = documentTags
  },
  addDocumentTag(localState, newDocumentTag: CreateDocumentTagMutation['createDocumentTag']) {
    localState.documentTags.push(newDocumentTag!)
  },
}

export const actions: ActionTree<DocumentTagState, RootState> = {
  fetchDocumentTags({ commit }) {
    return this.app
      .apolloProvider!.defaultClient.query({
        query: GetDocumentTags,
      })
      .then(({ data }: { data: GetDocumentTagsQuery }) => {
        if (data.documentTags) {
          commit('setDocumentTags', data.documentTags)
        }
      })
  },
  createDocumentTag({ commit }, payload: { title: string }) {
    const variables: CreateDocumentTagMutationVariables = {
      input: {
        title: payload.title,
      },
    }
    return this.app
      .apolloProvider!.defaultClient.mutate<CreateDocumentTagMutation>({
        mutation: CreateDocumentTag,
        variables,
      })
      .then(({ data }) => {
        if (data && data.createDocumentTag) {
          commit('addDocumentTag', data.createDocumentTag)
          return data!.createDocumentTag
        }
        return
      })
  },
}
