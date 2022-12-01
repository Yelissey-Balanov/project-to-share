<template>
  <client-only>
    <SweetModal :blocking="true" ref="modal" :title="`Select columns for ${itemTitle} table`">
      <ValidationObserver
        tag="form"
        @submit.prevent="onSubmit()"
        ref="formValidationObserver"
        class="space-y-6 select-displayed-columns-modal"
      >
        <FSelectColumns
          label="Select columns to display"
          :columns="availableColumnsComputed"
          v-model="selectedColumnsValue"
        />
        <FCheckbox v-model="areImagesDisplayedValue" label="Show images" />
        <FInput
          v-if="displayPerPage"
          v-model="perPageValue"
          :as-integer="true"
          label="Elements per page"
          class="w-40"
        />
        <div v-else class="h-8" />

        <div class="form-action-buttons pt-24">
          <button type="submit" class="tbtn tbtn--blue"> Apply </button>
        </div>
      </ValidationObserver>
    </SweetModal>
  </client-only>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import Vue from 'vue'
import { Maybe } from '~/graphql/GQLTypes'
import FSelectColumns from '~/components/globals/form/FSelectColumns.vue'
import { ValidationObserver } from 'vee-validate'
import { ColumnsDefinition } from '~/components/pages/TableWithSelectableColumns.vue'
@Component({
  components: { FSelectColumns, ValidationObserver },
})
export default class SelectDisplayedColumnsModal extends Vue {
  $refs!: {
    modal: any
    formValidationObserver: InstanceType<typeof ValidationObserver>
  }

  @Prop()
  itemTitle!: string
  @Prop({ default: () => {} })
  availableColumns!: ColumnsDefinition
  @Prop({ default: () => [] })
  selectedColumns!: string[]
  @Prop({ default: true })
  areImagesDisplayed!: boolean
  @Prop({ default: 20 })
  perPage!: number
  @Prop()
  displayPerPage!: boolean

  event: Maybe<{}> = null

  selectedColumnsValue: any[] = []
  areImagesDisplayedValue: boolean = true
  perPageValue: number = 20

  get availableColumnsComputed() {
    return Object.entries(this.availableColumns)
      .filter((el) => !el[1].required)
      .map((el) => {
        return {
          id: el[0],
          title: el[1].title,
        }
      })
  }

  onSubmit() {
    const selectedColumnIds = this.selectedColumnsValue.map((item) => item.id)
    localStorage.setItem('columns.' + this.itemTitle, JSON.stringify(selectedColumnIds))
    localStorage.setItem('images.' + this.itemTitle, JSON.stringify(this.areImagesDisplayedValue))
    localStorage.setItem('perPage.' + this.itemTitle, JSON.stringify(this.perPageValue))
    this.$emit('select-columns', selectedColumnIds)
    this.close()
  }

  open() {
    this.selectedColumnsValue = []
    this.selectedColumns
      .filter((columnId) => columnId in this.availableColumns)
      .forEach((columnId) => {
        this.selectedColumnsValue.push({
          id: columnId,
          title: this.availableColumns[columnId].title,
        })
      })
    this.areImagesDisplayedValue = this.areImagesDisplayed
    this.perPageValue = this.perPage
    this.$refs.modal.open()
  }

  close() {
    this.$refs.modal.close()
  }
}
</script>
<style lang="scss">
.select-displayed-columns-modal {
  .multiselect__content-wrapper {
    @apply max-h-[280px] #{!important};
  }
}
</style>
