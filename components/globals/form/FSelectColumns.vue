<template>
  <div class="f-specified-multiselect" :class="{ 'is-disabled': disabled }">
    <label v-if="!!label" :class="{ 'is-floating': value.length > 0 || isOpened }">{{ label }}</label>
    <multiselect
      :value="value"
      class="capitalize"
      @input="handleInput"
      placeholder=""
      :options="columns"
      track-by="id"
      label="title"
      multiple
      :closeOnSelect="false"
      tagPosition="bottom"
      openDirection="bottom"
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
  disabled!: boolean
  @Prop({ default: () => [] })
  columns!: any[]

  isOpened = false
  id = ''

  mounted() {
    this.id = generateFormFieldId(this.label)
  }

  handleInput(e) {
    this.$emit('input', e)
  }
}
</script>
