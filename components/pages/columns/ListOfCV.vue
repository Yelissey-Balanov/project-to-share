<template>
  <td class="px-6 py-3.5">
    <DocumentsWrapper
      :documents="data.documents || data.cv_documents"
      class="-mb-1 -mr-1 flex flex-wrap"
      :is-parsing-info-enabled="false"
      :is-sharing-enabled="false"
    >
      <template v-slot:document="slotProps">
        <DocumentRow v-bind="slotProps" :title-only="true" />
      </template>
    </DocumentsWrapper>
  </td>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import DocumentRow from '~/components/documents/DocumentRow.vue'
import DocumentsWrapper from '~/components/documents/DocumentsWrapper.vue'

@Component({
  components: { DocumentsWrapper, DocumentRow },
})
export default class ListOfCV extends Vue {
  @Prop({ default: () => {} })
  data!: any
}
</script>
