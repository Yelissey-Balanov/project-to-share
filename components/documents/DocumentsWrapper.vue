<template>
  <div>
    <div v-for="document in documents">
      <slot
        name="document"
        :document="document"
        :openShareDocumentModal="openShareDocumentModal"
        :showDocumentPreview="showDocumentPreview"
        :showDocumentInfos="showDocumentInfos"
        :downloadDocument="downloadDocument"
        :isParsingInfoEnabled="isParsingInfoEnabled"
        :isSharingEnabled="isSharingEnabled"
      />
    </div>

    <client-only>
      <SweetModal
        ref="modalDocumentParseInfo"
        title="Document parsing info"
        class="sweet-modal__wide"
        v-if="isParsingInfoEnabled"
      >
        <div v-if="documentForModal" :key="'modalDocumentParseInfo_' + documentForModal.id">
          <div class="grid grid-cols-2 gap-4">
            <LabeledValue :value="documentForModal.title" label="Title" />
            <LabeledValue :value="documentForModal.parsing_status" label="Parsing status" />
          </div>
          <div class="grid grid-cols-1 gap-4">
            <LabeledValue
              :value="documentForModal.parsed_content"
              label="Parsed content"
              :preWrap="true"
              v-if="documentForModal.parsing_status === DocumentParsingStatus.Succeeded"
            />
          </div>
          <div class="grid grid-cols-1 gap-4">
            <LabeledValue
              :value="documentForModal.parsing_failure_reason"
              label="Parsing status"
              :preWrap="true"
              v-if="documentForModal.parsing_status === DocumentParsingStatus.Failed"
            />
          </div>
        </div>
      </SweetModal>

      <SweetModal ref="modalDocumentPDFPreview" :title="documentPDFPreview.title" class="sweet-modal__pdf-viewer">
        <PDFViewer :url="documentPDFPreview.url" :scale="documentPDFPreview.scale" />
        <template slot="box-action">
          <button type="button" class="tbtn-icon tbtn--white" @click="zoomOut()">
            <IHMinus class="w-6 h-6" />
          </button>
          <button type="button" class="tbtn-icon tbtn--white" @click="zoomIn()">
            <IHPlus class="w-6 h-6" />
          </button>
        </template>
      </SweetModal>

      <SweetModal ref="modalShareDocument" title="Document sharing" class="sweet-modal__wide" v-if="isSharingEnabled">
        <ValidationObserver
          tag="form"
          @submit.prevent="onShareDocumentSubmit()"
          ref="shareModalDataValidationObserver"
          v-if="documentForModal"
          :key="'modalShareDocumentS' + documentForModal.id"
        >
          <div class="grid grid-cols-2 gap-4">
            <LabeledValue :value="documentForModal.title" label="Document" />
            <LabeledValue :value="documentForModal.tags" label="Tags" :mapFn="(tag) => tag.title" />
          </div>

          <template v-if="shareModalData.existingLinks === null">
            <p class="text-center">Loading existing shared links...</p>
          </template>
          <template v-else-if="shareModalData.length === 0">
            <p class="text-center">There are no shared links for this document.</p>
          </template>
          <template v-else>
            <div class="data-table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Token</th>
                    <th>Expires at</th>
                    <th>Views</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="sharedLink of shareModalData.existingLinks">
                    <td>
                      <a :href="sharedLink.URL" target="_blank">
                        {{ sharedLink.token }}
                      </a>
                    </td>
                    <td>
                      {{ sharedLink.expires_at | datetime }}
                    </td>
                    <td>
                      {{ sharedLink.views }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>

          <h4>New Link</h4>
          <div class="grid grid-cols-2 gap-4">
            <FInput
              v-model="shareModalData.expiresAfterDays"
              label="How many days should the link be accessible?"
              :rules="'numeric|required'"
              errorLabel="expiration time"
              class="flex-auto"
            />
            <button type="submit" class="tbtn tbtn--blue flex-none self-center ml-4">
              <template v-if="!shareModalData.isSubmitting"> Create shared link</template>
              <template v-else> Creating shared link...</template>
            </button>
          </div>
        </ValidationObserver>
      </SweetModal>
    </client-only>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import Vue from 'vue'
import {
  DocumentFragment,
  DocumentParsingStatus,
  GeneratePublicDocumentLinkMutation,
  GeneratePublicDocumentLinkMutationVariables,
  GetDocumentDownloadLinkQuery,
  GetDocumentDownloadLinkQueryVariables,
  GetDocumentPreviewLinkByTokenQuery,
  GetDocumentPreviewLinkByTokenQueryVariables,
  GetDocumentPreviewLinkQuery,
  GetDocumentPreviewLinkQueryVariables,
  GetSharedLinksOfDocumentQuery,
  GetSharedLinksOfDocumentQueryVariables,
  Maybe,
} from '@/graphql/GQLTypes'
import FileIcon from '~/components/admin/FileIcon.vue'
import LabeledValue from '~/components/admin/LabeledValue.vue'
import PDFViewer from '~/components/PDFViewer.vue'
import { ValidationObserver } from 'vee-validate'
import GeneratePublicDocumentLink from '@/graphql/ressources/sharedLinks/GeneratePublicDocumentLink.gql'
import GetSharedLinksOfDocument from '@/graphql/ressources/sharedLinks/GetSharedLinksOfDocument.gql'
import { apolloParseErrors } from '~/helpers/apolloParseErrors'
import copyToClipboard from '~/helpers/copyToClipboard'
import GetDocumentDownloadLink from '~/graphql/ressources/documents/GetDocumentDownloadLink.gql'
import GetDocumentPreviewLink from '~/graphql/ressources/documents/GetDocumentPreviewLink.gql'
import GetDocumentPreviewLinkByToken from '~/graphql/ressources/documents/GetDocumentPreviewLinkByToken.gql'
import IHMinus from '~/components/globals/icons/heroicons/IHMinus.vue'
import IHPlus from '~/components/globals/icons/heroicons/IHPlus.vue'

@Component({
  components: { IHPlus, IHMinus, PDFViewer, LabeledValue, FileIcon, ValidationObserver },
})
export default class DocumentsWrapper extends Vue {
  DocumentParsingStatus = DocumentParsingStatus
  $refs!: {
    modalDocumentParseInfo: any
    modalDocumentPDFPreview: any
    modalShareDocument: any
    shareModalDataValidationObserver: InstanceType<typeof ValidationObserver>
  }

  @Prop()
  documents?: DocumentFragment[]

  @Prop({ default: false })
  isParsingInfoEnabled?: boolean

  @Prop({ default: false })
  isSharingEnabled?: boolean

  documentForModal: Maybe<DocumentFragment> = null

  documentPDFPreview: {
    url: string
    title: string
    scale: number
  } = {
    url: '',
    title: '',
    scale: 1,
  }

  shareModalData: {
    expiresAfterDays: string
    isSubmitting: boolean
    existingLinks: Maybe<NonNullable<GetSharedLinksOfDocumentQuery['getSharedLinksOfDocument']>>
  } = {
    expiresAfterDays: '2',
    isSubmitting: false,
    existingLinks: null,
  }

  downloadDocument(document: DocumentFragment) {
    this.$apollo
      .query<GetDocumentDownloadLinkQuery>({
        fetchPolicy: 'no-cache',
        query: GetDocumentDownloadLink,
        variables: {
          id: document.id,
        } as GetDocumentDownloadLinkQueryVariables,
      })
      .then(({ data }) => {
        window.location.href = data.getDocumentDownloadLink
      })
      .catch((err) => {
        this.$bus.showErrorModal({
          errors: apolloParseErrors(err),
        })
      })
  }

  async showDocumentPreview(document: DocumentFragment) {
    this.documentPDFPreview.title = document.title
    this.documentPDFPreview.url = ''
    this.$refs.modalDocumentPDFPreview.open()
    try {
      this.documentPDFPreview.url = await this.getDocumentPreviewLink(document)
    } catch (e) {
      this.$refs.modalDocumentPDFPreview.close()
      this.$bus.showErrorModal({
        errors: ['Whoops... You probably has no permission to access this document...'],
      })
    }
  }

  async getDocumentPreviewLink(document: DocumentFragment) {
    if (!this.$store.state.project.sharedProject.token || !this.$store.state.project.sharedProject.password) {
      // no sharedProject data stored, so fetch preview link via user role
      return this.$apollo
        .query<GetDocumentPreviewLinkQuery>({
          fetchPolicy: 'no-cache',
          query: GetDocumentPreviewLink,
          variables: {
            id: document.id,
          } as GetDocumentPreviewLinkQueryVariables,
        })
        .then(({ data }) => {
          return data.getDocumentPreviewLink
        })
    } else {
      return this.$apollo
        .query<GetDocumentPreviewLinkByTokenQuery>({
          fetchPolicy: 'no-cache',
          query: GetDocumentPreviewLinkByToken,
          variables: {
            id: document.id,
            token: this.$store.state.project.sharedProject.token,
            password: this.$store.state.project.sharedProject.password,
          } as GetDocumentPreviewLinkByTokenQueryVariables,
        })
        .then(({ data }) => {
          return data.getDocumentPreviewLinkByToken
        })
    }
  }

  openShareDocumentModal(document: DocumentFragment) {
    if (!this.isSharingEnabled) {
      console.warn('Document sharing is disabled via attributes')
      return
    }
    this.shareModalData.isSubmitting = false
    this.shareModalData.expiresAfterDays = '2'
    this.shareModalData.existingLinks = null

    this.documentForModal = document
    this.$refs.modalShareDocument.open()

    // fetch existing links in background
    this.$apollo
      .query<GetSharedLinksOfDocumentQuery>({
        query: GetSharedLinksOfDocument,
        variables: {
          document_id: document.id,
        } as GetSharedLinksOfDocumentQueryVariables,
      })
      .then(({ data }) => {
        this.shareModalData.existingLinks = data.getSharedLinksOfDocument
      })
      .catch((err) => {
        this.$bus.showErrorModal({
          errors: apolloParseErrors(err),
        })
      })
  }

  onShareDocumentSubmit() {
    if (this.shareModalData.isSubmitting) {
      return
    }
    this.shareModalData.isSubmitting = true
    const variables: GeneratePublicDocumentLinkMutationVariables = {
      document_id: this.documentForModal!.id,
      expires_after_days: parseInt(this.shareModalData.expiresAfterDays),
    }

    this.$apollo
      .mutate<GeneratePublicDocumentLinkMutation>({
        mutation: GeneratePublicDocumentLink,
        variables,
      })
      .then(({ data }) => {
        this.shareModalData.existingLinks!.push(data!.generatePublicDocumentLink)

        copyToClipboard(data!.generatePublicDocumentLink.URL)
        this.$apollo.provider.defaultClient.clearStore()
        this.shareModalData.isSubmitting = false
      })
      .catch((err) => {
        this.shareModalData.isSubmitting = false
        this.$bus.showErrorModal({
          errors: apolloParseErrors(err),
        })
      })
  }

  zoomOut() {
    this.documentPDFPreview.scale -= 0.3
  }

  zoomIn() {
    this.documentPDFPreview.scale += 0.3
  }

  showDocumentInfos(document: DocumentFragment) {
    if (!this.isParsingInfoEnabled) {
      console.warn('Parsing info is disabled via attributes')
      return
    }
    this.documentForModal = document
    this.$refs.modalDocumentParseInfo!.open()
  }
}
</script>
