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
      tag-placeholder="Add new institution"
      placeholder=""
      :options="institutions"
      :multiple="!isSingle"
      :taggable="!isLoading"
      tagPosition="bottom"
      openDirection="bottom"
      track-by="id"
      label="name"
      :loading="isLoading"
      :closeOnSelect="isSingle"
      @tag="addInstitution"
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
import { GetAllInstitutionsQuery } from '~/graphql/GQLTypes'
import generateFormFieldId from '~/helpers/generateFormFieldId'

@Component
export default class FSelectInstitutions extends Vue {
  @Prop()
  value?: any
  @Prop()
  label?: string
  @Prop({ default: false })
  isSingle!: boolean
  @Prop({ default: false })
  disabled!: boolean

  @State((state) => state.institution.institutions)
  institutions!: GetAllInstitutionsQuery['allInstitutions']

  isLoading = false
  isOpened = false
  id = ''

  mounted() {
    this.id = generateFormFieldId(this.label)
    // fetch institutions from graphql when component is mounted
    if (this.institutions.length === 0) {
      this.isLoading = true
      this.$store.dispatch('institution/fetchInstitutions').then(() => {
        this.isLoading = false
      })
    }
  }

  handleInput(e) {
    this.$emit('input', e)
  }

  addInstitution(value) {
    this.isLoading = true
    this.$store
      .dispatch('institution/createInstitution', {
        name: value,
      })
      .then((institution) => {
        this.isLoading = false
        if (institution) {
          if (this.isSingle) {
            this.handleInput(institution)
          } else {
            this.value.push(institution)
          }
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
