<template>
  <div class="f-specified-multiselect">
    <label
      v-if="!!label"
      :class="{ 'is-floating': (isSingle && selectedOptions) || (!isSingle && selectedOptions.length > 0) || isOpened }"
      >{{ label }}</label
    >
    <multiselect
      :value="selectedOptions"
      @input="handleInput"
      placeholder=""
      :options="languagesOptions"
      :multiple="!isSingle"
      openDirection="bottom"
      track-by="code"
      label="name"
      :closeOnSelect="isSingle"
      @open="isOpened = true"
      @close="isOpened = false"
      :id="id"
    >
    </multiselect>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import Vue from 'vue'
import { LanguageItem, languagesList, languagesObject } from '@/helpers/languagesListEn'
import { Maybe } from '~/graphql/GQLTypes'
import generateFormFieldId from '~/helpers/generateFormFieldId'

@Component
export default class FSelectLanguage extends Vue {
  @Prop()
  value?: string
  @Prop()
  label?: string
  @Prop({ default: true })
  isSingle!: boolean

  isOpened = false
  selectedOptions: Maybe<LanguageItem | LanguageItem[]> = null
  languagesOptions = languagesList
  id = ''

  private sentValueToOutside: Maybe<string | string[]> = null

  mounted() {
    this.id = generateFormFieldId(this.label)
  }

  @Watch('value', { immediate: true })
  onValueChanges(val) {
    // console.log('from', oldVal, 'to', val);
    // parse initialized value into selected option. DB contains just the language codes!
    if (val !== this.sentValueToOutside) {
      if (this.isSingle) {
        if (!languagesObject[val]) {
          this.selectedOptions = null
        } else {
          this.selectedOptions = {
            code: val,
            name: languagesObject[val],
          }
        }
      } else {
        this.selectedOptions = []
        ;(val as string[]).forEach((langCode) => {
          if (!languagesObject[langCode]) {
            return
          }
          ;(this.selectedOptions as LanguageItem[]).push({
            code: langCode,
            name: languagesObject[langCode],
          })
        })
      }

      this.handleInput(this.selectedOptions)
    }
  }

  handleInput(e) {
    this.selectedOptions = e
    if (this.isSingle) {
      if (!this.selectedOptions) {
        this.sentValueToOutside = null
      } else {
        this.sentValueToOutside = (this.selectedOptions as LanguageItem).code
      }
    } else {
      if ((this.selectedOptions as LanguageItem[]).length === 0) {
        this.sentValueToOutside = []
      } else {
        this.sentValueToOutside = (this.selectedOptions as LanguageItem[]).map((option) => option.code)
      }
    }
    this.$emit('input', this.sentValueToOutside)
  }
}
</script>

<style lang="scss"></style>
