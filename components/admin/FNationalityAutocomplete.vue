<template>
  <ValidationProvider
    :rules="rules"
    :name="errorLabelComputed"
    v-slot="{ errors, classes, valid, touched }"
    tag="div"
    ref="validationProvider"
    slim
  >
    <div class="f-specified-multiselect is-single dial-code-select" :class="classes">
      <label
        v-if="!!label"
        :class="{
          'is-floating': (isSingle && selectedOptions) || (!isSingle && selectedOptions.length > 0) || isOpened,
        }"
        >{{ label }}</label
      >
      <multiselect
        :value="selectedOptions"
        @input="handleInput"
        placeholder=""
        :options="nationalityOptions"
        openDirection="bottom"
        track-by="alpha_3_code"
        label="nationality"
        @open="handleOpen"
        @close="handleClose"
        :id="id"
        :multiple="!isSingle"
        :closeOnSelect="isSingle"
      >
        <template slot="noResult" slot-scope="props"> No nationality found that satisfy search query </template>
      </multiselect>
      <div class="input-error" v-if="!valid && touched">{{ errors[0] }}</div>
    </div>
  </ValidationProvider>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import Vue from 'vue'
import { ValidationProvider } from 'vee-validate'
import { Maybe } from '~/graphql/GQLTypes'
import { nationalitiesList, nationalitiesObject, NationalityItem } from '~/helpers/nationalitiesListEn'
import generateFormFieldId from '~/helpers/generateFormFieldId'
import { LanguageItem, languagesList, languagesObject } from '~/helpers/languagesListEn'

@Component({
  components: { ValidationProvider },
})
export default class FNationalityAutocomplete extends Vue {
  $refs!: {
    validationProvider: InstanceType<typeof ValidationProvider>
  }

  @Prop()
  rules?: any
  @Prop()
  errorLabel?: string
  @Prop()
  value?: NationalityItem
  @Prop()
  label?: string
  @Prop({ default: false })
  isSingle!: boolean

  selectedOptions: Maybe<NationalityItem | NationalityItem[]> = null

  // originally took from https://github.com/Dinuks/country-nationality-list/blob/master/countries.json
  nationalityOptions: NationalityItem[] = nationalitiesList

  isOpened = false
  id = ''

  private sentValueToOutside: Maybe<string | string[]> = null

  get errorLabelComputed() {
    return this.errorLabel || this.label
  }

  @Watch('value', { immediate: true })
  onValueChanges(val) {
    // parse initialized value into selected option. DB contains just the alpha_3_code!
    if (val !== this.sentValueToOutside) {
      if (this.isSingle) {
        const nationalityItem = nationalitiesObject[val]
        if (!nationalityItem) {
          this.selectedOptions = null
        } else {
          this.selectedOptions = nationalityItem
        }
      } else {
        this.selectedOptions = []
        ;(val as string[]).forEach((id) => {
          const nationalityItem = nationalitiesObject[id]
          if (!nationalityItem) {
            return
          }
          ;(this.selectedOptions as NationalityItem[]).push(nationalityItem)
        })
      }

      this.handleInput(this.selectedOptions)
    }
  }

  mounted() {
    this.id = generateFormFieldId(this.label)
    this.onValueChanges(this.value)
  }

  handleInput(e) {
    this.selectedOptions = e
    if (this.isSingle) {
      if (!this.selectedOptions) {
        this.sentValueToOutside = null
      } else {
        this.sentValueToOutside = (this.selectedOptions as NationalityItem).alpha_3_code
      }
    } else {
      if ((this.selectedOptions as NationalityItem[]).length === 0) {
        this.sentValueToOutside = []
      } else {
        this.sentValueToOutside = (this.selectedOptions as NationalityItem[]).map((option) => option.alpha_3_code)
      }
    }
    this.$emit('input', this.sentValueToOutside)
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
