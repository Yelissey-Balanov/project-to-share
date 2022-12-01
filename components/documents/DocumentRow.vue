<template>
  <div class="flex items-center space-x-4 group">
    <!--    <FileIcon class="w-8" :mime_type="document.mime_type" />-->

    <div v-if="!titleOnly" class="flex-auto flex space-x-2 items-center">
      <FileIcon class="w-8 duration-200 ease-linear shrink-0" :mime_type="document.mime_type" />
      <div class="flex-col flex">
        <span> {{ document.title }} </span>
        <span class="-mt-1 -mr-2">
          <span class="text-xs tbadge tbadge--blue mr-2 mt-2" v-for="tag in document.tags"> {{ tag.title }} </span>
        </span>
      </div>
    </div>
    <div v-else>
      <button
        class="tbadge tbadge--blue tbadge--small mb-1 mr-1"
        @click="showDocumentPreview(document)"
      >
        {{ document.title }}
      </button>
    </div>

    <div
      v-if="!titleOnly"
      class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition duration-200 ease-in-out"
    >
      <button
        type="button"
        class="tbtn-icon tbtn-icon--small tbtn--white"
        v-if="isSharingEnabled && document.preview_path && isEmployee"
        @click="openShareDocumentModal(document)"
      >
        <IHShare class="w-5 h-5" />
      </button>
      <button
        type="button"
        class="tbtn-icon tbtn-icon--small tbtn--white"
        v-if="document.preview_path"
        @click="showDocumentPreview(document)"
      >
        <IHEye class="w-5 h-5" />
      </button>
      <button
        type="button"
        class="tbtn-icon tbtn-icon--small tbtn--white"
        v-if="isParsingInfoEnabled && isAdmin"
        @click="showDocumentInfos(document)"
      >
        <IHInfo class="w-5 h-5" />
      </button>
      <button
        type="button"
        class="tbtn-icon tbtn-icon--small tbtn--white"
        v-if="isAllowedToDownload"
        @click="downloadDocument(document)"
      >
        <IHDownload class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import Vue from 'vue'
import { DocumentFragment, UserRole } from '@/graphql/GQLTypes'
import FileIcon from '~/components/admin/FileIcon.vue'
import { namespace } from 'nuxt-property-decorator'
import IHShare from '~/components/globals/icons/heroicons/IHShare.vue'
import IHEye from '~/components/globals/icons/heroicons/IHEye.vue'
import IHInfo from '~/components/globals/icons/heroicons/IHInfo.vue'
import IHDownload from '~/components/globals/icons/heroicons/IHDownload.vue'

@Component({
  components: { IHDownload, IHInfo, IHEye, IHShare, FileIcon },
})
export default class DocumentRow extends Vue {
  @Prop()
  document?: DocumentFragment
  @Prop()
  openShareDocumentModal?: (document) => {}
  @Prop()
  showDocumentPreview?: (document) => {}
  @Prop()
  showDocumentInfos?: (document) => {}
  @Prop()
  downloadDocument?: (document) => {}
  @Prop()
  isParsingInfoEnabled?: boolean
  @Prop()
  titleOnly?: boolean
  @Prop()
  isSharingEnabled?: boolean

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
}
</script>
