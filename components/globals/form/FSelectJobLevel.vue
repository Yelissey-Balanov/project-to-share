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
      :options="jobLevelOptions"
      :multiple="!isSingle"
      openDirection="bottom"
      track-by="value"
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
import { Maybe } from '~/graphql/GQLTypes'
import generateFormFieldId from '~/helpers/generateFormFieldId'
import { JobLevelItem, jobLevelOptions, jobLevelsObject } from '~/helpers/jobLevels'

@Component
export default class FSelectJobLevel extends Vue {
  @Prop()
  value?: string
  @Prop()
  label?: string
  @Prop({ default: true })
  isSingle!: boolean

  isOpened = false
  selectedOptions: Maybe<JobLevelItem | JobLevelItem[]> = null
  jobLevelOptions = jobLevelOptions
  id = ''

  private sentValueToOutside: Maybe<string | string[]> = null

  mounted() {
    this.id = generateFormFieldId(this.label)
  }

  @Watch('value', { immediate: true })
  onValueChanges(val) {
    // console.log('from', oldVal, 'to', val);
    // parse initialized value into selected option.
    if (val !== this.sentValueToOutside) {
      if (this.isSingle) {
        if (!jobLevelsObject[val]) {
          this.selectedOptions = null
        } else {
          this.selectedOptions = {
            value: val,
            name: jobLevelsObject[val],
          }
        }
      } else {
        this.selectedOptions = []
        ;(val as string[]).forEach((langCode) => {
          if (!jobLevelsObject[langCode]) {
            return
          }
          ;(this.selectedOptions as JobLevelItem[]).push({
            value: langCode,
            name: jobLevelsObject[langCode],
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
        this.sentValueToOutside = (this.selectedOptions as JobLevelItem).value
      }
    } else {
      if ((this.selectedOptions as JobLevelItem[]).length === 0) {
        this.sentValueToOutside = []
      } else {
        this.sentValueToOutside = (this.selectedOptions as JobLevelItem[]).map((option) => option.value)
      }
    }
    this.$emit('input', this.sentValueToOutside)
  }
}
</script>

<style lang="scss"></style>
