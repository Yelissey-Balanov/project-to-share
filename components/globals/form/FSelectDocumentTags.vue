<template>
  <div class="f-specified-multiselect">
    <label v-if="!!label" :class="{ 'is-floating': value.length > 0 || isOpened }">{{ label }}</label>
    <multiselect
      :value="value"
      @input="handleInput"
      tag-placeholder="Add new tag"
      placeholder=""
      :options="documentTags"
      :multiple="true"
      :taggable="isTaggable && !isLoading"
      tagPosition="bottom"
      openDirection="bottom"
      track-by="id"
      label="title"
      :loading="isLoading"
      :closeOnSelect="false"
      @tag="addDocumentTag"
      @open="isOpened = true"
      @close="isOpened = false"
      :id="id"
    >
    </multiselect>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import Vue from 'vue'
import { State } from 'vuex-class'
import { GetDocumentTagsQuery } from '~/graphql/GQLTypes'
import generateFormFieldId from '~/helpers/generateFormFieldId'
import { namespace } from 'nuxt-property-decorator'

@Component
export default class FSelectDocumentTags extends Vue {
  @Prop()
  value?: any
  @Prop()
  label?: string

  get isTaggable() {
    return this.$store.getters['account/isAdmin']
  }

  @(namespace('account').Getter('isEmployee'))
  isEmployee!: boolean

  isLoading = false
  isOpened = false
  id = ''

  mounted() {
    this.id = generateFormFieldId(this.label)
    // fetch documentTags from graphql when component is mounted
    if (this.$store.state.documentTag.documentTags.length === 0) {
      this.isLoading = true
      this.$store.dispatch('documentTag/fetchDocumentTags').then(() => {
        this.isLoading = false
      })
    }
  }

  get documentTags() {
    if (this.isEmployee) {
      return this.$store.state.documentTag.documentTags
    }
    return this.$store.state.documentTag.documentTags.filter(
      (documentTag) =>
        documentTag.title.indexOf('CV') !== -1 || ['Reference', 'Zeugnis', 'Sonstiges'].includes(documentTag.title)
    )
  }

  handleInput(e) {
    this.$emit('input', e)
  }

  addDocumentTag(value) {
    this.isLoading = true
    this.$store
      .dispatch('documentTag/createDocumentTag', {
        title: value,
      })
      .then((documentTag) => {
        this.isLoading = false
        if (documentTag) {
          this.value.push(documentTag)
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
