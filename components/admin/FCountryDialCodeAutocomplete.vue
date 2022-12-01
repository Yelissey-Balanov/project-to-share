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
    <div class="f-specified-multiselect is-single dial-code-select" :class="classes">
      <label v-if="!!label" :class="{ 'is-floating': value || isOpened }">{{ label }}</label>
      <multiselect
        :value="value"
        @input="handleInput"
        placeholder=""
        :options="countryDialCodes"
        openDirection="bottom"
        track-by="code"
        :custom-label="customLabelForMultiselect"
        @open="handleOpen"
        @close="handleClose"
        :showNoOptions="false"
        :showLabels="false"
      >
        <template slot="noResult" slot-scope="props"> No country dial code found that satisfy search query </template>
      </multiselect>
      <div class="input-error" v-if="!valid && touched">{{ errors[0] }}</div>
    </div>
  </ValidationProvider>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import Vue from 'vue'
import { countryDialCodes, CountryDialCode } from '~/helpers/phonenumberHelpers'
import { ValidationProvider } from 'vee-validate'
import generateFormFieldId from '~/helpers/generateFormFieldId'

@Component({
  components: { ValidationProvider },
})
export default class FCountryDialCodeAutocomplete extends Vue {
  $refs!: {
    validationProvider: InstanceType<typeof ValidationProvider>
  }

  @Prop()
  rules?: any
  @Prop()
  errorLabel?: string
  @Prop()
  value?: CountryDialCode
  @Prop()
  label?: string

  countryDialCodes = countryDialCodes

  isOpened = false
  id = ''

  get errorLabelComputed() {
    return this.errorLabel || this.label
  }

  customLabelForMultiselect(countryDialCode: CountryDialCode) {
    return `${countryDialCode.code} ${countryDialCode.dial_code}`
  }

  mounted() {
    this.id = generateFormFieldId(this.label)
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
