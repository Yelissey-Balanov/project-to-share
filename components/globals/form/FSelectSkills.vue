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
      tag-placeholder="Add new skill"
      placeholder=""
      :options="skills"
      :multiple="!isSingle"
      :taggable="!isLoading"
      tagPosition="bottom"
      openDirection="bottom"
      track-by="id"
      label="title"
      :loading="isLoading"
      :closeOnSelect="isSingle"
      @tag="addSkill"
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
import { GetAllSkillsQuery } from '~/graphql/GQLTypes'
import generateFormFieldId from '~/helpers/generateFormFieldId'

@Component
export default class FSelectSkills extends Vue {
  @Prop()
  value?: any
  @Prop()
  label?: string
  @Prop({ default: false })
  isSingle!: boolean
  @Prop({ default: false })
  disabled!: boolean

  @State((state) => state.skill.skills)
  skills!: GetAllSkillsQuery['allSkills']

  isLoading = false
  isOpened = false
  id = ''

  mounted() {
    this.id = generateFormFieldId(this.label)
    // fetch skills from graphql when component is mounted
    if (this.skills.length === 0) {
      this.isLoading = true
      this.$store.dispatch('skill/fetchSkills').then(() => {
        this.isLoading = false
      })
    }
  }

  handleInput(e) {
    this.$emit('input', e)
  }

  addSkill(value) {
    this.isLoading = true
    this.$store
      .dispatch('skill/createSkill', {
        title: value,
      })
      .then((skill) => {
        this.isLoading = false
        if (this.isSingle) {
          this.handleInput(skill)
        } else {
          this.value.push(skill)
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
