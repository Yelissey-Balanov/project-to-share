import GetDocumentDownloadLink from '@/graphql/ressources/documents/GetDocumentDownloadLink.gql'
import GetDocumentPreviewLink from '@/graphql/ressources/documents/GetDocumentPreviewLink.gql'
import GetDocumentPreviewLinkByToken from '@/graphql/ressources/documents/GetDocumentPreviewLinkByToken.gql'
import {
  GetDocumentDownloadLinkQuery,
  GetDocumentDownloadLinkQueryVariables,
  GetDocumentPreviewLinkQuery,
  GetDocumentPreviewLinkQueryVariables,
  GetDocumentPreviewLinkByTokenQuery,
  GetDocumentPreviewLinkByTokenQueryVariables,
} from '~/graphql/GQLTypes'
import { Vue } from 'vue-property-decorator'
import { apolloParseErrors } from '~/helpers/apolloParseErrors'
import DocumentsList from '~/components/admin/DocumentsList.vue'

// TODO: refactor this function back to DocumentsList

export async function getDocumentDownloadLink(vueInstance: Vue, documentId: number) {
  const apolloClient = vueInstance.$apollo
  const variables: GetDocumentDownloadLinkQueryVariables = {
    id: documentId,
  }
  return apolloClient
    .query<GetDocumentDownloadLinkQuery>({
      fetchPolicy: 'no-cache',
      query: GetDocumentDownloadLink,
      variables,
    })
    .then(({ data }) => {
      return data.getDocumentDownloadLink
    })
    .catch((err) => {
      vueInstance.$bus.showErrorModal({
        errors: apolloParseErrors(err),
      })
    })
}

export async function getDocumentPreviewLink(vueInstance: DocumentsList, documentId: number) {
  const apolloClient = vueInstance.$apollo
  const variables: GetDocumentPreviewLinkQueryVariables = {
    id: documentId,
  }
  // @ts-ignore
  if (!vueInstance.sharedProject) {
    return apolloClient
      .query<GetDocumentPreviewLinkQuery>({
        fetchPolicy: 'no-cache',
        query: GetDocumentPreviewLink,
        variables,
      })
      .then(({ data }) => {
        return data.getDocumentPreviewLink
      })
      .catch((err) => {
        // vueInstance.$bus.showErrorModal({
        //   errors: apolloParseErrors(err)
        // });
      })
  } else {
    return apolloClient
      .query<GetDocumentPreviewLinkByTokenQuery>({
        fetchPolicy: 'no-cache',
        query: GetDocumentPreviewLinkByToken,
        variables: {
          ...variables,
          token: vueInstance.$store.state.project.sharedProject.token,
          password: vueInstance.$store.state.project.sharedProject.password,
        } as GetDocumentPreviewLinkByTokenQueryVariables,
      })
      .then(({ data }) => {
        return data.getDocumentPreviewLinkByToken
      })
      .catch((err) => {
        // vueInstance.$bus.showErrorModal({
        //   errors: apolloParseErrors(err)
        // });
      })
  }
}
