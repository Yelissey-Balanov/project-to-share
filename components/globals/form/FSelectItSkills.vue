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
      tag-placeholder="Add new IT skill"
      placeholder=""
      :options="itSkills"
      :multiple="!isSingle"
      :taggable="!isLoading"
      tagPosition="bottom"
      openDirection="bottom"
      track-by="id"
      label="title"
      :loading="isLoading"
      :closeOnSelect="isSingle"
      @tag="addItSkill"
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
import { GetAllItSkillsQuery } from '~/graphql/GQLTypes'
import generateFormFieldId from '~/helpers/generateFormFieldId'

@Component
export default class FSelectItSkills extends Vue {
  @Prop()
  value?: any
  @Prop()
  label?: string
  @Prop({ default: false })
  isSingle!: boolean
  @Prop({ default: false })
  disabled!: boolean

  @State((state) => state.itSkill.itSkills)
  itSkills!: GetAllItSkillsQuery['allItSkills']

  isLoading = false
  isOpened = false
  id = ''

  mounted() {
    this.id = generateFormFieldId(this.label)
    // fetch itSkills from graphql when component is mounted
    if (this.itSkills.length === 0) {
      this.isLoading = true
      this.$store.dispatch('itSkill/fetchItSkills').then(() => {
        this.isLoading = false
      })
    }
  }

  handleInput(e) {
    this.$emit('input', e)
  }

  addItSkill(value) {
    this.isLoading = true
    this.$store
      .dispatch('itSkill/createItSkill', {
        title: value,
      })
      .then((itSkill) => {
        this.isLoading = false
        if (this.isSingle) {
          this.handleInput(itSkill)
        } else {
          this.value.push(itSkill)
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
