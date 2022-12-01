<template>
  <div>
    <p v-if="!documents || documents.length === 0">
      <slot name="errorText">There are no uploaded documents yet.</slot>
    </p>
    <div class="document-row" v-for="document in documents">
      <FileIcon class="document-row--icon" :mime_type="document.mime_type" />
      <div class="document-row--labels">
        <div class="document-row--labels--title">
          {{ document.title }}
        </div>
        <LabeledValue class="document-row--labels--tags" :value="document.tags" :mapFn="(tag) => tag.title" />
      </div>
      <div class="document-row--buttons">
        <button
          type="button"
          class="btn btn-icon gray-outline"
          v-if="document.preview_path && isEmployee"
          @click="openShareDocumentModal(document)"
        >
          <IShare class="icon" />
        </button>
        <button
          type="button"
          class="btn btn-icon gray-outline"
          v-if="document.preview_path"
          @click="showDocumentPreview(document)"
        >
          <IEye class="icon" />
        </button>
        <button
          type="button"
          class="btn btn-icon gray-outline"
          :class="`parsing_status__${document.parsing_status}`"
          v-if="displayParsingInfo && isAdmin"
          @click="showDocumentInfos(document)"
        >
          <IInfo class="icon" />
        </button>
        <button @click="downloadDocument(document)" class="btn btn-icon gray-outline" v-if="isAllowedToDownload">
          <IDownload class="icon" />
        </button>
      </div>
    </div>

    <client-only>
      <SweetModal
        ref="modalDocumentParseInfo"
        title="Document parsing info"
        class="sweet-modal__wide"
        v-if="displayParsingInfo"
      >
        <div v-if="documentForModal" :key="'modalDocumentParseInfo_' + documentForModal.id">
          <div class="grid grid-cols-2 gap-4">
            <LabeledValue :value="documentForModal.title" label="Title" />
            <LabeledValue
              :value="documentForModal.parsing_status"
              label="Parsing status"
              :class="`parsing_status__${documentForModal.parsing_status}`"
            />
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
          <button type="button" class="btn btn-icon gray-outline btn__in-modal-header" @click="zoomOut()">
            <IMinus class="icon" />
          </button>
          <button type="button" class="btn btn-icon gray-outline btn__in-modal-header" @click="zoomIn()">
            <IPlus class="icon" />
          </button>
        </template>
      </SweetModal>

      <SweetModal ref="modalShareDocument" title="Document sharing" class="sweet-modal__wide">
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
            <button type="submit" class="tbtn tbtn--blue btn-create-shared-link">
              <template v-if="!shareModalData.isSubmitting"> Create shared link </template>
              <template v-else> Creating shared link... </template>
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
  GetCandidateForViewQuery,
  GetSharedLinksOfDocumentQuery,
  GetSharedLinksOfDocumentQueryVariables,
  Maybe,
  UserRole,
} from '@/graphql/GQLTypes'
import FileIcon from '~/components/admin/FileIcon.vue'
import LabeledValue from '~/components/admin/LabeledValue.vue'
import PDFViewer from '~/components/PDFViewer.vue'
import { getDocumentDownloadLink, getDocumentPreviewLink } from '~/helpers/getDocumentLink'
import { ValidationObserver } from 'vee-validate'
import GeneratePublicDocumentLink from '@/graphql/ressources/sharedLinks/GeneratePublicDocumentLink.gql'
import GetSharedLinksOfDocument from '@/graphql/ressources/sharedLinks/GetSharedLinksOfDocument.gql'
import { apolloParseErrors } from '~/helpers/apolloParseErrors'
import copyToClipboard from '~/helpers/copyToClipboard'
import { namespace } from 'nuxt-property-decorator'

// TODO: Remove usage in all places. This is now deprecated
// #DEPRECATED
@Component({
  components: { PDFViewer, LabeledValue, FileIcon, ValidationObserver },
})
export default class DocumentsList extends Vue {
  DocumentParsingStatus = DocumentParsingStatus
  $refs!: {
    modalDocumentParseInfo: any
    modalDocumentPDFPreview: any
    modalShareDocument: any
    shareModalDataValidationObserver: InstanceType<typeof ValidationObserver>
  }

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

  @Prop()
  documents?: DocumentFragment[]

  @Prop({ default: false })
  displayParsingInfo?: boolean

  @Prop({ default: false })
  sharedProject?: boolean

  shareModalData: {
    expiresAfterDays: string
    isSubmitting: boolean
    existingLinks: Maybe<NonNullable<GetSharedLinksOfDocumentQuery['getSharedLinksOfDocument']>>
  } = {
    expiresAfterDays: '2',
    isSubmitting: false,
    existingLinks: null,
  }

  @(namespace('account').Getter('isAdmin'))
  isAdmin!: boolean

  get isAllowedToDownload() {
    return (
      this.isAdmin ||
      (this.$store.getters['account/isEmployee'] &&
        this.$store.state.account.user.roles.includes(UserRole.FilesDownloader))
    )
  }

  @(namespace('account').Getter('isEmployee'))
  isEmployee!: boolean

  async downloadDocument(document: NonNullable<GetCandidateForViewQuery['candidate']>['documents'][0]) {
    const downloadLink = await getDocumentDownloadLink(this, document.id)
    if (downloadLink) {
      window.location.href = downloadLink
    }
  }

  async showDocumentPreview(document: NonNullable<GetCandidateForViewQuery['candidate']>['documents'][0]) {
    this.documentPDFPreview.title = document.title
    this.documentPDFPreview.url = ''
    this.$refs.modalDocumentPDFPreview.open()
    const documentLink = await getDocumentPreviewLink(this, document.id)
    if (documentLink) {
      this.documentPDFPreview.url = documentLink
    } else {
      this.$refs.modalDocumentPDFPreview.close()
      this.$bus.showErrorModal({
        errors: ['Whoops... Server was not able to generate public URL for this document...'],
      })
    }
  }

  openShareDocumentModal(document: NonNullable<GetCandidateForViewQuery['candidate']>['documents'][0]) {
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

  showDocumentInfos(document: NonNullable<GetCandidateForViewQuery['candidate']>['documents'][0]) {
    this.documentForModal = document
    this.$refs.modalDocumentParseInfo!.open()
  }
}
</script>

<style scoped lang="scss">
@import '../../assets/scss/variables';

// parsing status colors
.parsing_status__QUEUED {
  color: $color-orange;
}

.parsing_status__PROCESSING {
  color: $color-orange;
}

.parsing_status__SUCCEEDED {
  color: $color-green;
}

.parsing_status__FAILED {
  color: $color-red;
}

.parsing_status__UNKNOWN_FORMAT {
  color: $color-orange;
}

.btn-create-shared-link {
  flex: none;
  margin-left: 15px;
  align-self: center;
}
</style>
