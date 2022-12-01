<template>
  <div>
    <IFilePDF class="icon" v-if="mime_type === 'application/pdf'" />
    <IFileDOC
      class="icon"
      v-else-if="
        mime_type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        mime_type === 'application/msword'
      "
    />
    <IFileZIP class="icon" v-else-if="mime_type === 'application/zip' || mime_type === 'application/msword'" />
    <IFileUnknown class="icon" v-else />
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import Vue from 'vue'

@Component
export default class DataTablePagination extends Vue {
  @Prop()
  mime_type?: string
}
</script>
