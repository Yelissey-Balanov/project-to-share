<template>
  <ValidationProvider
    :rules="rules"
    :name="errorLabelComputed"
    :vid="id"
    v-slot="{ errors, classes, valid, touched }"
    tag="div"
    ref="validationProvider"
    slim
  >
    <div class="f-specified-multiselect is-single project-select" :class="classes">
      <label v-if="!!label" :class="{ 'is-floating': value || isOpened }">{{ label }}</label>
      <multiselect
        :value="value"
        @input="handleInput"
        placeholder=""
        :options="projects"
        openDirection="bottom"
        track-by="id"
        :custom-label="customLabelForMultiselect"
        @open="handleOpen"
        @close="handleClose"
        :showNoOptions="false"
        :showLabels="false"
        :id="id"
      >
        <template slot="noResult" slot-scope="props"> No project found that satisfy search query </template>
      </multiselect>
      <div class="input-error" v-if="!valid && touched">{{ errors[0] }}</div>
    </div>
  </ValidationProvider>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import Vue from 'vue'
import { countryDialCodes, CountryDialCode } from '~/helpers/phonenumberHelpers'
import { ValidationProvider } from 'vee-validate'
import { GetProjectsForAutocompleteForLonglistQuery, Project } from '~/graphql/GQLTypes'
import generateFormFieldId from '~/helpers/generateFormFieldId'

@Component({
  components: { ValidationProvider },
})
export default class FActiveProjectAutocomplete extends Vue {
  $refs!: {
    validationProvider: InstanceType<typeof ValidationProvider>
  }

  @Prop()
  rules?: any
  @Prop()
  errorLabel?: string
  @Prop()
  value?: GetProjectsForAutocompleteForLonglistQuery['projectsForAutocompleteForLonglist'][0]
  @Prop()
  label?: string

  @Prop()
  projects?: GetProjectsForAutocompleteForLonglistQuery['projectsForAutocompleteForLonglist']

  projectOptions = {}
  isOpened = false
  id = ''

  get errorLabelComputed() {
    return this.errorLabel || this.label
  }

  mounted() {
    this.id = generateFormFieldId(this.label)
  }

  customLabelForMultiselect(
    project: GetProjectsForAutocompleteForLonglistQuery['projectsForAutocompleteForLonglist'][0]
  ) {
    let optionTitle = ''
    if (project.is_interim) {
      optionTitle += '[I]'
    }
    if (project.is_permanent) {
      optionTitle += '[P]'
    }
    optionTitle += ` ${project.title} (${project.company.name})`
    return optionTitle
  }

  handleInput(e) {
    this.$emit('input', e)
  }

  handleOpen() {
    this.isOpened = true
  }

  handleClose() {
    this.isOpened = false
    this.$refs.validationProvider.setFlags({
      touched: true,
      untouched: false,
    })
  }
}
</script>
