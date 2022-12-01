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
      tag-placeholder="Add new certification"
      placeholder=""
      :options="certifications"
      :multiple="!isSingle"
      :taggable="!isLoading"
      tagPosition="bottom"
      openDirection="bottom"
      track-by="id"
      label="title"
      :loading="isLoading"
      :closeOnSelect="isSingle"
      @tag="addCertification"
      @open="isOpened = true"
      @close="isOpened = false"
      :disabled="disabled"
      :id="id"
    >
    </multiselect>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import Vue from 'vue'
import { State } from 'vuex-class'
import { GetAllCertificationsQuery } from '~/graphql/GQLTypes'
import generateFormFieldId from '~/helpers/generateFormFieldId'

@Component
export default class FSelectCertifications extends Vue {
  @Prop()
  value?: any
  @Prop()
  label?: string
  @Prop({ default: false })
  isSingle!: boolean
  @Prop({ default: false })
  disabled!: boolean

  @State((state) => state.certification.certifications)
  certifications!: GetAllCertificationsQuery['allCertifications']

  isLoading = false
  isOpened = false
  id = ''

  mounted() {
    this.id = generateFormFieldId(this.label)
    // fetch certifications from graphql when component is mounted
    if (this.certifications.length === 0) {
      this.isLoading = true
      this.$store.dispatch('certification/fetchCertifications').then(() => {
        this.isLoading = false
      })
    }
  }

  handleInput(e) {
    this.$emit('input', e)
  }

  addCertification(value) {
    this.isLoading = true
    this.$store
      .dispatch('certification/createCertification', {
        title: value,
      })
      .then((certification) => {
        this.isLoading = false
        if (this.isSingle) {
          this.handleInput(certification)
        } else {
          this.value.push(certification)
        }
      })
      .catch((err) => {
        this.isLoading = false
        console.error(err)
      })
  }
}
</script>

<style lang="scss"></style>
