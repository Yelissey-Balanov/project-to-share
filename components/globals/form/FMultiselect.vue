<template>
  <div class="f-specified-multiselect" :class="{ 'is-disabled': disabled }">
    <label
      v-if="!!label"
      :class="{ 'is-floating': (isSingle && value) || (!isSingle && value.length > 0) || isOpened }"
      >{{ label }}</label
    >
    <multiselect
      :value="value"
      @input="handleInput"
      tag-placeholder="Add new option"
      placeholder=""
      :options="internalOptions"
      :multiple="!isSingle"
      :taggable="isTaggable"
      tagPosition="bottom"
      openDirection="bottom"
      :track-by="trackBy"
      :label="optionLabelAttr"
      :loading="isLoading"
      :closeOnSelect="isSingle"
      @tag="addNewItem"
      @open="isOpened = true"
      @close="isOpened = false"
      :disabled="disabled"
      :id="id"
    >
      <template slot="noOptions">
        <slot name="noOptions" />
      </template>
    </multiselect>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import Vue from 'vue'
import generateFormFieldId from '~/helpers/generateFormFieldId'

@Component
export default class FMultiselect extends Vue {
  @Prop()
  value?: any
  @Prop()
  label?: string
  @Prop({ default: false })
  isSingle!: boolean
  @Prop({ default: false })
  disabled!: boolean
  @Prop({ default: () => [] })
  options!: any[]
  @Prop({ default: true })
  isTaggable!: boolean
  @Prop({ default: false })
  isLoading!: boolean
  @Prop({ default: 'id' })
  trackBy!: string
  @Prop({ default: 'title' })
  optionLabelAttr!: string
  @Prop({ default: '' })
  noResultsText!: string

  isOpened = false

  id = ''
  internalOptions: any[] = []
  private incrementalId = 0

  @Watch('options', { immediate: true })
  onOptionsChange(options) {
    this.internalOptions = options
  }

  mounted() {
    this.id = generateFormFieldId(this.label)
  }

  handleInput(e) {
    this.$emit('input', e)
  }

  addNewItem(value) {
    const newItem = {
      id: 'New' + this.incrementalId++,
      title: value,
    }
    this.internalOptions.push(newItem)
    if (this.isSingle) {
      this.value = newItem
    } else {
      this.value.push(newItem)
    }
  }
}
</script>

<style lang="scss"></style>
